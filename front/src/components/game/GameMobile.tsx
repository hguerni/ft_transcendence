import { Socket } from "socket.io-client";
import Sketch from "react-p5";
import p5Types from "p5";
import useWindowDimensions from "../../services/window.service";
import "./GameMobile.css"

export class PongProps {
  windowDim = useWindowDimensions();
	width: number = this.windowDim.width;
	height: number = 600;
	score_l: number = 0;
	score_r: number = 0;
	ball_x: number = this.width / 2;
	ball_y: number = this.height / 2;
	ball_vx: number = 2;
	ball_vy: number = 2;
	paddle_l_x: number = 15;
	paddle_l_y: number = 50;
	paddle_r_x: number = this.width - 25;
	paddle_r_y: number = 50;
}

function Gamezone(props: {client: Socket}) {

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
	};

	return <Sketch setup={setup} draw={draw}/>;
};

export function GameMobile(props: {client: Socket}) {
  return (
    <div className="GameArea">
      <Gamezone client={props.client}/>
    </div>
  );
}
