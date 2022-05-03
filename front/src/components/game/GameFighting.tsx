import React, { useState, useEffect } from "react";
import Gamezone, { GameStartTraining, GameStart, GameReset, GameJoin, GameWatch, GetRooms, GameCreate } from './Gamezone';
import { Room, RoomService } from "@mui/icons-material";
import { io, Socket } from "socket.io-client";
import { RmOptions } from "fs";
import Popup from 'reactjs-popup';
import { v4 } from 'uuid'
import { Button } from "@mui/material";

const socket: Socket = io("ws://localhost:3030");

export interface RoomProps {
	name: string;
	trainingMode: boolean;
  canJoinGame: boolean;
  p1_name: string;
  p2_name: string;
  p1_readyToStart: boolean;
  p2_readyToStart: boolean;
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

function AutoMatching(rooms: RoomProps[]) {
  for (const room of rooms) {
    if (room.canJoinGame === true) {
      GameJoin(socket, room.name);
      return true;
    }
  }
  return false;
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
      <div>
        <div style={{color: 'white', textAlign: 'center', marginBottom: '10px'}}>Search game:</div>
        <div style={{marginLeft: 'auto', marginRight: 'auto', width: 'fit-content'}}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
        </div>
      </div>

      <div className="gameCardsBox">
        {rooms.map(item => {
          if (item.name.includes(name))
            return <GamesCards key={item.name} room={item}/>
        })}
      </div>
      <div style={{margin: 'auto', width: 'fit-content'}}>
        <button className='gameButton' onClick={() => AutoMatching(rooms)}>AUTO MATCHING</button>
      </div>
      {AutoMatching(rooms) === false &&
        <div style={{color: 'white', textAlign: 'center'}}>All games are full, please create your own game</div>
      }
    </div>
  );
}

function CreateGamePopUp() {
  const [gameName, setGameName] = useState<string>(v4().substring(0, 10));
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button className="gameButton" onClick={() => setOpen(true)}> CREATE GAME</button>
      <Popup open={open} closeOnDocumentClick onClose={() => setOpen(false)}>
        <div>Enter a name for your game:</div>
        <input
          type="text"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
        />
        <button className="gameButton" onClick={() => {GameCreate(socket, gameName); setOpen(false); setGameName(v4().substring(0, 10))}}>SEND</button>
      </Popup>
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
        <CreateGamePopUp/>
        <button className="gameButton" onClick={() => GameStart(socket)}>START GAME</button>
      </div>
    </div>
  );
}

//<button className="gameButton" onClick={() => GameCreate(socket)}>CREATE GAME</button>
