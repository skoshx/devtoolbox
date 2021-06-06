import { spring } from 'svelte/motion';
// import { spring } from './spring';

export interface DragParams {
  stiffness?: number;
  damping?: number;
  precision?: number;
}

export function drag(node: HTMLElement, params?: DragParams) {
	let x;
	let y;

	const coords = spring({ x: 0, y: 0, scale: 1 });
	coords.subscribe((current) => {
    const { x, y, scale } = current;
		node.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    node.style.zIndex = scale === 1 ? '0' : '2';
	});

	const mousedown = (event) => {
		x = event.clientX;
		y = event.clientY;
    coords.update(() => {
			return { x: 0, y: 0, scale: 1.2 };
		});
		window.addEventListener('mouseup', mouseup);
		window.addEventListener('mousemove', mousemove);
	};
	const mouseup = () => {
		window.removeEventListener('mouseup', mouseup);
		window.removeEventListener('mousemove', mousemove);
		coords.update(() => {
			return { x: 0, y: 0, scale: 1 };
		});
		node.dispatchEvent(
			new CustomEvent('dragstop', {
				detail: { x, y }
			})
		);
		x = 0;
		y = 0;
	};
	const mousemove = (event) => {
		const dx = event.clientX - x;
		const dy = event.clientY - y;
		x = event.clientX;
		y = event.clientY;
		coords.update((current) => {
			return {
				x: current.x + dx,
				y: current.y + dy,
        scale: 1.2,
			};
		});
	};

	// Event listener
	node.addEventListener('mousedown', mousedown);
}