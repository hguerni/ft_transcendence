import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { FriendEntity } from '../entities/friend.entity';
import { getRepository, Repository } from 'typeorm';
import { UpdateUserDTO, RegisterDTO } from '../models/user.model';
import { GameEntity } from '../entities/game.entity';

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

  async saveGame(clientid: number, data: any) {
    this.findByFtId(clientid).then(async(client) =>{
        let game = new GameEntity;
        game.adversary = await this.userRepo.findOne(data.player_two);
        game.gameName = data.gameName;
        if (game.adversary.id === data.player_two) 
          game.winner = false;
        else
          game.winner = true
        game.userscore = data.player_one_score;
        game.adversaryscore = data.player_two_score;
        game.user = client;
        await this.gameRepo.save(game);
    });
  } 

  async addFriend(clientid: number, friendid: number) {
    this.findByFtId(clientid).then((client) =>{
      this.getById(friendid).then(async (friend) => {
        let friendship1 = new FriendEntity;
        let friendship2 = new FriendEntity;
        friendship1.status = "requesting";
        friendship1.friend = friend;
        friendship1.user = client;
        friendship2.status = "pending";
        friendship2.friend = client;
        friendship2.user = friend;
        await this.friendRepo.save(friendship1)
        this.friendRepo.findOne({where: {friend: friend, user: client}}).then(async (friendship) => {
          friendship2.friendship = friendship;
          await this.friendRepo.save(friendship2);
        });
      });
    });
  }

  async acceptFriend(clientid, friendid) {
    this.findByFtId(clientid).then((client) =>{
      this.getById(friendid).then(async (friend) => {
        this.friendRepo.findOne({where: {friend: friend, user: client}}).then(async (friendship) => {
          this.friendRepo.update(friendship.id, {status: "accepted"});
          this.friendRepo.update(friendship.friendship.id, {status: "accepted"});
        });
      });
    });
  }

  async removeFriend(clientid, friendid) {
    this.findByFtId(clientid).then((client) =>{
      this.getById(friendid).then(async (friend) => {
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
        await this.friendRepo.save(friendship1)
        this.friendRepo.findOne({where: {friend: friend, user: client}}).then(async (friendship) => {
          friendship2.friendship = friendship;
          await this.friendRepo.save(friendship2);
        });
      });
    });
  }

  async getFriends(clientID: number) {
    this.findByFtId(clientID).then((client) =>{
      return this.friendRepo.find({where: {user: client, status: "accepted"}})
    });
  }

  async getRequest(clientID: number) {
    this.findByFtId(clientID).then((client) =>{
      return this.friendRepo.find({where: {friend: client, status: "pending"}})
    });
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