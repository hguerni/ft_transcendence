import Sketch from "react-p5";
import p5Types from "p5";
import { Socket } from 'socket.io-client';

const UP_ARROW = 38;
const DOWN_ARROW = 40;

export class PongProps {
	width: number = 600;
	height: number = 400;
	score_l: number = 0;
	score_r: number = 0;
	ball_x: number = 600 / 2;
	ball_y: number = 400 / 2;
	ball_vx: number = 2;
	ball_vy: number = 2;
	paddle_l_x: number = 15;
	paddle_l_y: number = 50;
	paddle_r_x: number = 575;
	paddle_r_y: number = 50;
  }

export function GameStartTraining(client: Socket) {
	client.emit("START_TRAINING");
}

export function GameStart(client: Socket) {
	client.emit("GAME_START");
}

export function GameReset(client: Socket) {
	client.emit("GAME_RESET");
}

export function GameJoin(client: Socket, room: string) {
	client.emit("GAME_JOIN", room);
}

export function GameWatch(client: Socket, room: string) {
	client.emit("GAME_WATCH", room);
}

export function GetRooms(client: Socket) {
	client.emit("GET_ROOMS");
}

export function GameCreate(client: Socket, room: string) {
	client.emit("GAME_CREATE", room);
	console.log("testttt");
}

export default function Gamezone(props: {client: Socket}) {

	let pong = new PongProps();

	// use parent to render the canvas in this ref
	// (without that p5 will render the canvas outside of your component)
	const setup = (p5: p5Types, canvasParentRef: Element) => {
		p5.frameRate(100);
		p5.noStroke();
		p5.createCanvas(pong.width, pong.height).parent(canvasParentRef);
	};

	props.client.on("GAME_UPDATE", (pongString: string) => {
		pong = JSON.parse(pongString);
	});

	const draw = (p5: p5Types) => {
		p5.background(0);
		p5.fill(255);
		p5.ellipse(pong.ball_x, pong.ball_y, 10, 10); //ball
		p5.rect(pong.paddle_l_x, pong.paddle_l_y, 10, 50); //paddle left
		p5.rect(pong.paddle_r_x, pong.paddle_r_y, 10, 50); //paddle right
		p5.rect(pong.width / 2 - 2, 0, 4, pong.height); // line sep
		p5.textSize(60);
		p5.textAlign('center');
		p5.text(pong.score_l, pong.width / 4, pong.height / 3);
		p5.text(pong.score_r, (pong.width / 4) * 3, pong.height / 3);

		if (p5.keyIsDown(UP_ARROW))
			props.client.emit("MOVE_PADDLE_UP");
		else if (p5.keyIsDown(DOWN_ARROW))
			props.client.emit("MOVE_PADDLE_DOWN");
	};

	return <Sketch setup={setup} draw={draw}/>;
};
