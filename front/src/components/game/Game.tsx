import './Game.css';
import GameTabs from './GameTabs';
import { Socket, io } from 'socket.io-client';
import axios from 'axios';
import { useState, useEffect } from 'react';

export const socket: Socket = io("ws://localhost:3030/game");

function linkClientToUser(client: Socket, userID: number) {
	client.emit("LINK_CLIENT_TO_USER", userID);
}

function Game() {
  const [userID, setUserID] = useState<number>(-1);

  useEffect(() => {
    async function getActiveUserID() {
      const {data} = await axios.get("userID");
      setUserID(data);
    }
    getActiveUserID();
    if (userID != -1)
      linkClientToUser(socket, userID);
  }, []);

  socket.on("ALERT", (message: string) => {
		alert(message);
	});

  return (
    <>
      <div>
        <h1></h1>
      </div>
      <GameTabs/>
    </>
  );
}

export default Game;
