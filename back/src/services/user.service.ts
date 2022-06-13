import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { FriendEntity } from '../entities/friend.entity';
import { getRepository, Repository } from 'typeorm';
import { UpdateUserDTO, RegisterDTO } from '../models/user.model';
import { GameEntity } from '../entities/game.entity';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UserService {
  getById(id: number) {
    return this.userRepo.findOne(id);
  }
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(FriendEntity)private friendRepo: Repository<FriendEntity>,
    @InjectRepository(GameEntity)private gameRepo: Repository<GameEntity>,
  ) {}

  async saveTwoFactorSecret(secret: string, clientID: number): Promise<any> {
    const client = await this.findByFtId(clientID);
    return this.userRepo.update(client.id, { twofaSecret: secret });
  }

  async enableTwoFactor(clientID: number): Promise<any> {
    const client = await this.findByFtId(clientID);
    return this.userRepo.update(client.id, { twofa: true });
  }

  async disableTwoFactor(clientID: number): Promise<any> {
    const client = await this.findByFtId(clientID);
    return this.userRepo.update(client.id, { twofa: false });
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepo.find();
  }

  async findByUsername(login: string): Promise<UserEntity> {
    return await this.userRepo.findOne({ where: { login } });
  }

  async findByUserName(username: string): Promise<UserEntity> {
    return await this.userRepo.findOne({ where: { username } });
  }


  async findByFtId(ft_id: number): Promise<UserEntity> {
    return await this.userRepo.findOne({where: { ft_id }});
  }

  async updateUser(data: UpdateUserDTO) {
    return await this.userRepo.update(data.id, data);
  }

  async updateAvatar(data: UserEntity) {
    return await this.userRepo.update(data.id, data);
  }

  async createUser(data: RegisterDTO) {
    return await this.userRepo.save(data);
  }

  async saveGame(data: any) : Promise<void> {
    //console.log(data);
    if (data.p1_userId < 0 || data.p2_userId < 0)
      return ;
    this.findByFtId(data.p1_userId).then(async(client) =>{
      let game = new GameEntity;
      //console.log(data);
      if (typeof (await this.findByFtId(data.p2_userId)) === "undefined" || typeof client === "undefined" ){
        console.log("yes")
        return ;
      }
      game.adversary = await this.findByFtId(data.p2_userId);
      game.gameName = data.name;
      if (data.p1_score > data.p2_score) 
        game.winner = true;
      else
        game.winner = false;
      game.userscore = data.p1_score;
      game.adversaryscore = data.p2_score;
      game.user = client
      //console.log(game);
      await this.gameRepo.save(game);
    });
  } 



  async saveGameadversary(data: any) : Promise<void>  {
    //console.log(data);
    if (data.p1_userId < 0 || data.p2_userId < 0)
      return ;
    this.findByFtId(data.p2_userId).then(async(client) =>{
        let game = new GameEntity;
        //console.log(data);
        if (typeof (await this.findByFtId(data.p1_userId)) === "undefined" || typeof client === "undefined" ){
          console.log("yes")
          return ;
        }
        game.adversary = await this.findByFtId(data.p1_userId);
        game.gameName = data.name;
        if (data.p1_score >= data.p2_score) 
          game.winner = false;
        else
          game.winner = true;
        game.userscore = data.p2_score;
        game.adversaryscore = data.p1_score;
        game.user = client;
        //console.log(game);
        await this.gameRepo.save(game);
    });
  }

  async addFriend(clientid: number, friendid: number) {
    this.findByFtId(clientid).then((client) =>{
      this.findByFtId(friendid).then(async (friend) => {
        console.log(friend);
        if (typeof friend === "undefined")
          return;
        let previousfriend = await this.friendRepo.findOne({where: {friend: client, user: friend}});
        console.log(previousfriend);
        if (previousfriend)
          return ;
        let friendship1 = new FriendEntity;
        let friendship2 = new FriendEntity;
        friendship1.status = "requesting";
        friendship1.friend = friend;
        friendship1.user = client;
        friendship2.status = "pending";
        friendship2.friend = client;
        friendship2.user = friend;
        console.log(friendship1);
        await this.friendRepo.save(friendship2);
        await this.friendRepo.save(friendship1);
      });
    });
  }

  async acceptFriend(clientid, friendid) {
    this.findByFtId(clientid).then((client) =>{
      this.getById(friendid).then(async (friend) => {
        this.friendRepo.findOne({where: {friend: friend, user: client}}).then(async (friendship) => {
          console.log(friendship);
          await this.friendRepo.update(friendship.id, {status: "accepted"});
          this.friendRepo.findOne({where: {friend: client, user: friend}}).then(async (friendship2) => {
            console.log(friendship2);
            await this.friendRepo.update(friendship2.id, {status: "accepted"});
          });
        });
      });
    });
  }

  async removeFriend(clientid, friendid) {
    this.findByFtId(clientid).then((client) =>{
      this.findByFtId(friendid).then(async (friend) => {
        await this.friendRepo.delete({user: client, friend: friend})
        await this.friendRepo.delete({user: friend, friend: client})
      });
    });
  }

  async block(clientid: number, friendid: number) {
    this.findByFtId(clientid).then((client) =>{
      this.getById(friendid).then(async (friend) => {
        let friendship1 = new FriendEntity;
        let friendship2 = new FriendEntity;
        friendship1.status = "blocking";
        friendship1.friend = friend;
        friendship1.user = client;
        friendship2.status = "blocked";
        friendship2.friend = client;
        friendship2.user = friend;
        await this.friendRepo.save(friendship1);
        await this.friendRepo.save(friendship2);
      });
    });
  }

  async getFriends(clientID: number) {
    const client = await this.findByFtId(clientID);
    let friends = await this.friendRepo.find({where: {user: client, status: "accepted"}, relations: ['friend', 'user'],});
    let req = JSON.stringify(instanceToPlain(friends));
    return req
  }

  async getBlocked(clientID: number) {
    const client = await this.findByFtId(clientID);
    let friends = await this.friendRepo.find({where: {user: client, status: "blocked"}, relations: ['friend', 'user'],});
    let req = JSON.stringify(instanceToPlain(friends));
    //console.log(req)
    return req
  }

  async isFriend(clientID: number, friendId: number){
    const client = await this.findByFtId(clientID);
    const friend = await this.findByFtId(friendId);
    let friends = await this.friendRepo.findOne({where: {user: client, friend: friend}, relations: ['friend', 'user'],})
    let status = '';
    if (typeof friends !== "undefined") 
      status = friends.status;
    console.log(status);
    return status;
  }

  async getBlocking(clientID: number) {
    const block = await this.findByFtId(clientID).then((client) =>{
      return this.friendRepo.find({select:['id'], where: {user: client, status: "blocking"}, relations: ['friend', 'user']})
    });
    const tmp: number[] = [];
    block.forEach((element) => {
      tmp.push(element.friend.ft_id);
    })
    return tmp;
  }

  async getStats(clientID: number) {
    const client = await this.findByFtId(clientID);
    let stats = {n: 0, v: 0, d:0}
    stats.n = await this.gameRepo.count({where: {user: client}})
    stats.v = await this.gameRepo.count({where: {user: client, winner: true}});
    stats.d = await this.gameRepo.count({where: {user: client, winner: false}});
    //console.log(stats)
    return stats
  }

  async getGames(clientID: number) {
    const client = await this.findByFtId(clientID);
    let games = await this.gameRepo.find({where: {user: client}, relations: ['user', 'adversary'],});
    let req = JSON.stringify(instanceToPlain(games));
    //console.log(req)
    return req
  }

  async getRequest(clientID: number) {
    const client = await this.findByFtId(clientID);
    let requests = await this.friendRepo.find({where: {user: client, status: "pending"}, relations: ['friend', 'user'],});
    let req = JSON.stringify(instanceToPlain(requests));
    return req
  }

  async setOffline(clientID: number): Promise<any> {
    return this.userRepo.update(clientID, { online: 1 });
  }

  async setOnline(clientID: number): Promise<any> {
    return this.userRepo.update(clientID, { online: 0 });
  }

  async setInGame(clientID: number): Promise<any> {
    return this.userRepo.update(clientID, { online: 2 });
  }
}