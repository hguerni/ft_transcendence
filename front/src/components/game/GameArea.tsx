import Sketch from "react-p5";
import p5Types from "p5";
import { Socket } from 'socket.io-client';
import UserService from "../../services/user.service";

const UP_ARROW = 38;
const DOWN_ARROW = 40;

export class PongProps {
	width: number = window.innerWidth / 2.2;
	height: number = window.innerWidth / 3.2;
	score_l: number = 0;
	score_r: number = 0;
	ball_x: number = this.width / 2;
	ball_y: number = this.height / 2;
	ball_vx: number = 2;
	ball_vy: number = 2;
	speepFactor: number = 10;
	paddle_width: number = this.width / 60;
	paddle_height: number = this.height / 8.5;
	paddle_l_x: number = this.width / 30;
	paddle_l_y: number = this.height / 10;
	paddle_r_x: number = this.width - this.width / 30 - this.paddle_width;
	paddle_r_y: number = this.height / 10;
}

class UserDataGame {
	username: string = UserService.getUsername();
	userId: number = UserService.getUserId();
	roomToJoin: string = "";
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

export function GameJoin(client: Socket, roomName: string) {
	let userDataGame: UserDataGame = new UserDataGame();
	userDataGame.roomToJoin = roomName;
	client.emit("GAME_JOIN", userDataGame);
}

export function GameWatch(client: Socket, room: string) {
	client.emit("GAME_WATCH", room);
}

export function GetRooms(client: Socket) {
	client.emit("GET_ROOMS");
}

export function GetCurrentRoom(client: Socket) {
	client.emit("GET_CURRENT_ROOM");
}

export function GameCreate(client: Socket, roomName: string, customMode: string) {
	let userDataGame: UserDataGame = new UserDataGame();
	userDataGame.roomToJoin = roomName;
	client.emit("GAME_CREATE", JSON.stringify(userDataGame), customMode);
}

export function GameLeave(client: Socket) {
	client.emit("GAME_LEAVE");
}

export function GameSetPongProps(client: Socket, newPongProps: PongProps) {
	client.emit("GAME_SET_PONG_PROPS", JSON.stringify(newPongProps));
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
		let ratio = (window.innerWidth / 2.2) / pong.width;
		pong.width *= ratio;
		pong.height *= ratio;
		pong.ball_x *= ratio;
		pong.ball_y *= ratio;
		pong.paddle_width *= ratio;
		pong.paddle_height *= ratio;
		pong.paddle_l_x *= ratio;
		pong.paddle_l_y *= ratio;
		pong.paddle_r_x *= ratio;
		pong.paddle_r_y *= ratio;
	});

	const draw = (p5: p5Types) => {
		p5.background(0);
		p5.fill(255);
		p5.ellipse(pong.ball_x, pong.ball_y, 10, 10); //ball
		p5.rect(pong.paddle_l_x, pong.paddle_l_y, pong.paddle_width, pong.paddle_height); //paddle left
		p5.rect(pong.paddle_r_x, pong.paddle_r_y,  pong.paddle_width, pong.paddle_height); //paddle right
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

	const windowResized = (p5: p5Types) => {
		p5.resizeCanvas(window.innerWidth / 2.2, window.innerWidth / 3.2);
		//GameSetPongProps(socket, pong);
	}

	return <Sketch setup={setup} draw={draw} windowResized={windowResized}/>;
};
