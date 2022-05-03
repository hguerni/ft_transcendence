import { useState, useEffect } from "react";
import { GameJoin, GameWatch, GetRooms } from './GameArea';
import { socket } from "./GameFighting";

export interface RoomProps {
	name: string;
	trainingMode: boolean;
  canJoinGame: boolean;
  p1_name: string;
  p2_name: string;
  p1_readyToStart: boolean;
  p2_readyToStart: boolean;
}

function CardButton(props: {room: RoomProps}) {
  if (props.room.canJoinGame === true)
    return (<button className='gameButton' onClick={() => GameJoin(socket, props.room.name)}>JOIN GAME</button>);
  else
    return (<button className='gameButton' onClick={() => GameWatch(socket, props.room.name)}>WATCH GAME</button>);
}

function GamesCards(props: {room: RoomProps}) {
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
