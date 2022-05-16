import { useState, useEffect } from "react";
import { RoomProps } from "./GameSearching";
import { socket } from "./Game";
import { GameLeave } from "./GameArea";

export function GameInProgress() {
  const [room, setRoom] = useState<RoomProps>();
  let p1_status: string = "⏳";
  let p2_status: string = "⏳";
  let winnerMsg: string = "";

  useEffect(() => {
    socket.on("SEND_CURRENT_ROOM_INFOS", (room: string) => {
      setRoom(JSON.parse(room));
    });
    //setInterval(GetCurrentRoom, 1000, socket);
  }, [])

  if (room && room.p1_score >= 2)
    winnerMsg = `${room.p1_name} has won this game!`

  if (room && room.p2_score >= 2)
    winnerMsg = `${room.p2_name} has won this game!`

  if (room && room.p1_readyToStart)
    p1_status = "✔️";
  if (room && room.p2_readyToStart)
    p2_status = "✔️";

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
        <br></br>
        <div>{winnerMsg}</div>
        {// percentage of game played (one player with 10 point is the end)
        }
      </div>
    );
  }
  return (
    <div>Waiting for game infos</div>
  );
}
