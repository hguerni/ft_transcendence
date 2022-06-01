import { Redirect, useLocation } from "react-router-dom";
import { GameJoin, GetCurrentRoom } from "./GameArea";
import { socket } from "./Game";
import { GameCreate } from "./GameArea";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import Popup from "reactjs-popup";
import { RoomProps } from "./GameSearching";

export function GetGameInviteLink() {
  const [gameInviteLink, setGameInviteLink] = useState<string>("");

  useEffect(() => {
    socket.on("GET_CURRENT_ROOM", (roomProps: RoomProps) => {
      setGameInviteLink("http://localhost/game/join/".concat(roomProps.name));
    });
  }, []);
}

export default function GameInvite() {
  const usePathname = () => {
    const location = useLocation();
    return location.pathname;
  }
  const path = usePathname();

  GameJoin(socket, path.substring(11));

  return (
    <Redirect to="/game/fighting"/>
  );
}
