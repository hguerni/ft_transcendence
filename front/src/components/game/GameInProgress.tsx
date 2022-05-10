import { useState, useEffect } from "react";
import { GetCurrentRoom } from "./GameArea";
import { RoomProps } from "./GameSearching";
import { socket } from "./GameFighting";

export function GameInProgress() {
  const [room, setRoom] = useState<RoomProps>();

  useEffect(() => {
    socket.on("SEND_CURRENT_ROOM_INFOS", (room: string) => {
      setRoom(JSON.parse(room));
    });
    //setInterval(GetCurrentRoom, 1000, socket);
  }, [])

  if (room != undefined){
    return (
      <div>
        Game <span style={{color: 'red'}}>{room?.name}</span>
        <br></br>
        <br></br>
        <div className="gridStatsContainer">
          <div className="gridStatsItem">{room?.p1_name}</div>
          <div className="gridStatsItem">VS</div>
          <div className="gridStatsItem">{room?.p2_name}</div>
          <div className="gridStatsItem">{room?.p1_score}</div>
          <div className="gridStatsItem"></div>
          <div className="gridStatsItem">{room?.p2_score}</div>
        </div>
        {// percentage of game played (one player with 10 point is the end)
        }
      </div>
    );
  }
  return (
    <div>Waiting for game infos</div>
  );
}
