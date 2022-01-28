import Cell from "./cell.js";

let ROOT = document.querySelector(".map");
let MAP_ROWS = 20;
let MAP_COLS = 100;
let CELL_WIDTH = 40;
let CELL_HEIGHT = 40;
let MAP_GRID = [];

function generate_grid() {
	for (let i = 0; i < MAP_ROWS; i++) {
		MAP_GRID.push([]);

		for (let j = 0; j < MAP_COLS; j++) {
			let cell = new Cell(CELL_WIDTH, CELL_HEIGHT, 1, 1, [], j, i);
			MAP_GRID.push(cell);
			ROOT.appendChild(cell.render());
		}
	}

	update_neighbours();

	ROOT.style.gridTemplateColumns = `repeat(${MAP_COLS}, ${CELL_WIDTH}px`;
}

function update_neighbours() {
	console.log(MAP_GRID);
}

function clear_cells() {
	ROOT.innerHTML = "";
	generate_grid();
}

function event() {

}

function ready() {
	console.log(MAP_COLS)
	generate_grid();
}

function process() {
	window.requestAnimationFrame(process);
}

function main() {
	ready();
	event();
	window.requestAnimationFrame(process);
}

main();