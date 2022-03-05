import React, { useRef, useEffect, useState } from "react";
import "./Canvas.css";

type Coordinates = {
	x: number;
	y: number;
};

const Canvas = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
	const [color, setColor] = useState<string>("#000000");
	const [size, setSize] = useState<number>(10);

	useEffect(() => {
		let mouseDown: boolean = false;
		let start: Coordinates = { x: 0, y: 0 };
		let end: Coordinates = { x: 0, y: 0 };
		let canvasOffsetLeft: number = 0;
		let canvasOffsetTop: number = 0;
		let curr : HTMLCanvasElement | null= null;

		//mouse down
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

		//mouse up, unfortunatelly it does not trigger outside of the canvas
		function handleMouseUp(evt: MouseEvent) {
			mouseDown = false;
		}

		//mouse move
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
				context.strokeStyle = color;
				context.lineWidth = size;
				context.lineCap = "round"; //smooth likes
				context.stroke();

				context.closePath();
			}
		}

		//rendering
		if (canvasRef.current) {
			curr = canvasRef.current;
			const renderCtx = curr.getContext("2d");

			if (renderCtx) {
				curr.addEventListener("mousedown", handleMouseDown);
				curr.addEventListener("mouseup", handleMouseUp);
				curr.addEventListener("mousemove", handleMouseMove);

				canvasOffsetLeft = curr.offsetLeft;
				canvasOffsetTop = curr.offsetTop;

				setContext(renderCtx);
			}
		}

		//cleanup effect
		return () => {
			if (curr) {
				curr.removeEventListener("mousedown", handleMouseDown);
				curr.removeEventListener("mouseup", handleMouseUp);
				curr.removeEventListener("mousemove", handleMouseMove);
			}
		};
		//triggers
	}, [canvasRef, context, color, size]);

	return (
		<div className="container">
			<canvas
				id="canvas"
				ref={canvasRef}
				width={window.innerWidth - 200}
				height={window.innerHeight - 200}
			/>
			<input
				type="color"
				id="colorpicker"
				value={color}
				onChange={(e) => setColor(e.target.value)}
			/>
			<input
				type="number"
				id="sizepicker"
				value={size}
				min="1"
				max="100"
				onChange={(e) => setSize(parseInt(e.target.value))}
			/>
		</div>
	);
};

export default Canvas;

/*
https://betterprogramming.pub/add-an-html-canvas-into-your-react-app-176dab099a79
https://www.youtube.com/watch?v=3GqUM4mEYKA&t=183s
*/
