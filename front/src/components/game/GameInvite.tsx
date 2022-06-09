import { Redirect, useLocation } from "react-router-dom";
import { GameJoin } from "./GameArea";
import { socket } from "./Game";
import { useEffect, useState } from "react";
import { RoomProps } from "./GameSearching";

export function GetGameInviteLink() {
  const [gameInviteLink, setGameInviteLink] = useState<string>("");

  useEffect(() => {
    socket.on("GET_CURRENT_ROOM", (roomProps: RoomProps) => {
      setGameInviteLink("http://54.245.74.93/game/join/".concat(roomProps.name));
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
