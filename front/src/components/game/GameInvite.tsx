import { Redirect, useLocation } from "react-router-dom";
import { GameJoin } from "./GameArea";
import { socket } from "./Game";

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
