import React, { useRef, useEffect, useState } from "react";

type Coordinates = {
	x: number;
	y: number;
};

const Canvas = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

	useEffect(() => {
		let mouseDown: boolean = false;
		let start: Coordinates = { x: 0, y: 0 };
		let end: Coordinates = { x: 0, y: 0 };
		let canvasOffsetLeft: number = 0;
		let canvasOffsetTop: number = 0;

		function handleMouseDown(evt: MouseEvent) {
			mouseDown = true;
			start = {
				x: evt.clientX - canvasOffsetLeft,
				y: evt.clientY - canvasOffsetTop,
			};

			end = {
				x: evt.clientX - canvasOffsetLeft,
				y: evt.clientY - canvasOffsetTop,
			};

			// so you can draw a point
			handleMouseMove(evt);
		}

		//unfortunatelly it does not trigger outside of the canvas
		function handleMouseUp(evt: MouseEvent) {
			mouseDown = false;
		}

		function handleMouseMove(evt: MouseEvent) {
			if (mouseDown && context) {
				start = {
					x: end.x,
					y: end.y,
				};

				end = {
					x: evt.clientX - canvasOffsetLeft,
					y: evt.clientY - canvasOffsetTop,
				};

				// Draw our path
				context.beginPath();

				context.moveTo(start.x, start.y);
				context.lineTo(end.x, end.y);

				//color, needs to be get from React Context e.g.
				context.strokeStyle = "#ff0";
				context.lineWidth = 10;
				context.lineCap = "round"; //smooth likes
				context.stroke();

				context.closePath();
			}
		}

		if (canvasRef.current) {
			const renderCtx = canvasRef.current.getContext("2d");

			if (renderCtx) {
				canvasRef.current.addEventListener("mousedown", handleMouseDown);
				canvasRef.current.addEventListener("mouseup", handleMouseUp);
				canvasRef.current.addEventListener("mousemove", handleMouseMove);

				canvasOffsetLeft = canvasRef.current.offsetLeft;
				canvasOffsetTop = canvasRef.current.offsetTop;

				setContext(renderCtx);
			}
		}

		return () => {
			if (canvasRef.current) {
				canvasRef.current.removeEventListener('mousedown', handleMouseDown);
				canvasRef.current.removeEventListener('mouseup', handleMouseUp);
				canvasRef.current.removeEventListener('mousemove', handleMouseMove);
			}
		}
	}, [context]);



	return (
		<div
			style={{
				textAlign: "center",
			}}
		>
			<canvas
				id="canvas"
				ref={canvasRef}
				width={window.innerWidth -20}
				height={window.innerHeight -20}
				style={{
					border: "2px solid #000",
					marginTop: 10,
				}}
			></canvas>
		</div>
	);
};

export default Canvas;

/*
https://betterprogramming.pub/add-an-html-canvas-into-your-react-app-176dab099a79
https://www.youtube.com/watch?v=3GqUM4mEYKA&t=183s
*/