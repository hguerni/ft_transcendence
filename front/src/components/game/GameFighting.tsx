import React, { useState, useEffect } from "react";
import Gamezone, { GameStartTraining, GameStart, GameReset, GameJoin, GameWatch, GetRooms, GameCreate } from './Gamezone';
import { Room, RoomService } from "@mui/icons-material";
import { io, Socket } from "socket.io-client";
import { RmOptions } from "fs";

const socket: Socket = io("ws://localhost:3030");

export interface RoomProps {
	name: string;
	trainingMode: boolean;
  canJoinGame: boolean;
  player1: string;
  palyer2?: string;
}

function SearchGame(props: {room: RoomProps[]}) {
  const [name, setName] = useState<string>("");

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  )
}

function CardButton(props: {room: RoomProps}) {
  if (props.room.canJoinGame === true)
    return (<button className='gameButton' onClick={() => GameJoin(socket, props.room.name)}>JOIN GAME</button>);
  else
    return (<button className='gameButton' onClick={() => GameWatch(socket, props.room.name)}>WATCH GAME</button>);
}

export function GamesCards(props: {room: RoomProps}) {
  return (
    <div className='gameCards'>
      <div style={{marginBottom: '20px'}}>
        {props.room.name.substring(0, 10)}
      </div>
        <CardButton room={props.room}/>
    </div>
  );
}

export function GamesInProgress() {
  const [rooms, setRooms] = useState<RoomProps[]>([]);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    socket.on("SEND_ROOMS_INFOS", (rooms: string) => {
      setRooms(JSON.parse(rooms));
    });
    //setInterval(GetRooms, 1000, socket);
    GetRooms(socket);
  }, [])

  return (
    <div>
      <div style={{marginLeft: 'auto', marginRight: 'auto', width: 'fit-content'}}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      </div>

      <div>
        {rooms.map(item => {
          if (item.name.includes(name))
            return <GamesCards key={item.name} room={item}/>
        })}
      </div>
      <button className='gameButton' onClick={() => GetRooms(socket)}>MANUAL REFRESH</button>
    </div>
  );
}

export default function GameFighting() {
  return (
    <div className="gameFighting">
      <div>
        <div className="searchGame">
          <GamesInProgress/>
        </div>
      </div>
      <div className='GameZone'>
        <Gamezone client={socket}/>
      </div>
      <div className="GameZone">
        <button className="gameButton" onClick={() => GameCreate(socket)}>CREATE GAME</button>
        <button className="gameButton" onClick={() => GameStart(socket)}>START GAME</button>
      </div>
    </div>
  );
}
