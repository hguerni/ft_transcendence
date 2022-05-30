import { useState, useEffect } from "react";
import { RoomProps } from "./GameSearching";
import { socket } from "./Game";

export function GameInProgress() {
  const [room, setRoom] = useState<RoomProps>();
  const [msg, setMsg] = useState<string>("");

  let p1_status: string = "⏳";
  let p2_status: string = "⏳";

  useEffect(() => {
    socket.on("SEND_CURRENT_ROOM_INFOS", (room: string) => {
      setRoom(JSON.parse(room));
    });
    socket.on("SEND_GAME_STATUS", (message: string) => {
      setMsg(message);
    });
  }, [])

  if (room && room.p1_score >= 2)
    setMsg(`${room.p1_name} has won this game!`);

  if (room && room.p2_score >= 2)
    setMsg(`${room.p2_name} has won this game!`);

  if (room && room.p1_readyToStart)
    p1_status = "✔️";
  if (room && room.p2_readyToStart)
    p2_status = "✔️";

  if (room?.p2_name === "")
    room.p2_name = "?";
  if (room != undefined) {
    return (
      <div>
        <h4>Game <span style={{color: 'red'}}>{room?.name}</span></h4>
        <br></br>
        <br></br>
        <div className="gridStatsContainer">
          <div className="gridStatsItem"><p>{room.p1_name}</p></div>
          <div className="gridStatsItem"><p>VS</p></div>
          <div className="gridStatsItem"><p>{room.p2_name}</p></div>
          <div className="gridStatsItem"><p>{room.p1_score}</p></div>
          <div className="gridStatsItem"></div>
          <div className="gridStatsItem"><p>{room?.p2_score}</p></div>
        </div>
        <br></br>
        <div className="gameStatus">
          <h5>Status:</h5>
          <br></br>
          {msg}
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
