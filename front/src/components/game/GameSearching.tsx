import { useState, useEffect } from "react";
import { GameJoin, GameWatch, GetRooms } from './GameArea';
import { socket } from "./Game";
import { CreateGamePopUp } from "./GameFighting";

export interface RoomProps {
  name: string;
  trainingMode: boolean;
  canJoinGame: boolean;
  p1_name: string;
  p2_name: string;
  p1_readyToStart: boolean;
  p2_readyToStart: boolean;
  p1_score: number;
  p2_score: number;
}

function CardButton(props: {room: RoomProps}) {
  if (props.room.canJoinGame === true)
    return (<button className='gameButton' style={{fontSize: '0.7em'}} onClick={() => GameJoin(socket, props.room.name)}><h4>JOIN GAME</h4></button>);
  else
    return (<button className='gameButton' style={{fontSize: '0.7em'}} onClick={() => GameWatch(socket, props.room.name)}><h4>WATCH GAME</h4></button>);
}

function GamesCards(props: {room: RoomProps}) {
  if (props.room.p2_name === "")
    props.room.p2_name = "?"
  return (
    <div className='gameCards'>
      <div style={{color: '#3498db'}}>
        <p style={{fontSize: '2em'}}>{props.room.name.substring(0, 10)}</p>
      </div>
      {/*<div style={{marginBottom: '10px'}}>
          <span>{props.room.p1_name}</span>
          <br></br> vs <br></br>
          <span>{props.room.p2_name}</span>
        </div>*/}
        <p style={{margin: '10px 0px 15px 0px'}}>info</p>
        <CardButton room={props.room}/>
    </div>
  );
}

function isGameWaitingPlayer(rooms: RoomProps[]) {
  for (const room of rooms) {
    if (room.canJoinGame === true) {
      return true;
    }
  }
  return false;
}

/*
function AutoMatching(props: {rooms: RoomProps[]}) {

  for (const room of props.rooms) {
    if (room.canJoinGame === true) {
      return <button className='gameButton' onClick={() => GameJoin(socket, room.name)}>CREATE GAME</button>
    }
  }
  return <button className='gameButton' onClick={() => GameJoin(socket, room.name)}>CREATE GAME</button>;
}*/

function GameCards(props: {rooms: RoomProps[]}) {
  const [name, setName] = useState<string>("");

  return (
    <div>
      <div style={{marginLeft: 'auto', marginRight: 'auto', width: 'fit-content'}}>
          <input className="input" type="text" value={name} onChange={(e) => setName(e.target.value)}/>
      </div>
      <div className="gameCardsBox">
        {props.rooms.map(item => {
          if (item.name.includes(name))
            return <GamesCards key={item.name} room={item}/>
        })}
      </div>
    </div>
  );
}

export function GameSearching() {
  const [rooms, setRooms] = useState<RoomProps[]>([]);

  useEffect(() => {
    socket.on("SEND_ROOMS_INFOS", (rooms: string) => {
      setRooms(JSON.parse(rooms));
    });
    GetRooms(socket);
  }, []);

  return (
    <div>
        <div style={{color: 'white', textAlign: 'center', marginBottom: '10px'}}><h4>Search game:</h4></div>
      <GameCards rooms={rooms}/>
      <div style={{margin: 'auto', marginTop: '10px', width: 'fit-content', textAlign: 'center'}}>
        <CreateGamePopUp/>
      </div>
    </div>
  );
}
