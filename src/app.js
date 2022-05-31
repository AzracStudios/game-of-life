import Cell from "./components/cell.js";

let canvas = document.querySelector(".map");
let ctx = canvas.getContext("2d");
let MAP_ROWS = 20;
let MAP_COLS = 48;
let CELL_RESOLUTION = 30;
let MAP_GRID = [];
let FPS = 10;
let run = false;
let interval;
let time = 0;
let population = 0;

let lmb = false;
let rmb = false;

let x;
let y;

function generate_grid(randomize = false) {
  for (let i = 0; i < MAP_ROWS; i++) {
    MAP_GRID.push([]);
    for (let j = 0; j < MAP_COLS; j++) {
      let cell_state = Math.round(Math.random());
      let cell = new Cell(
        CELL_RESOLUTION,
        randomize ? cell_state : 0,
        randomize ? cell_state : 0,
        j,
        i
      );
      MAP_GRID[i].push(cell);
    }
  }

  update_neighbours();
}

function update_neighbours() {
  for (let i = 0; i < MAP_GRID.length; i++) {
    for (let j = 0; j < MAP_GRID[i].length; j++) {
      let neighbours = [];
      let grid = MAP_GRID;

      // Get neighbours for the cells that are not in the corners
      if (
        i > 0 &&
        j > 0 &&
        i < MAP_GRID.length - 1 &&
        j < MAP_GRID[i].length - 1
      ) {
        neighbours.push(
          grid[i - 1][j],
          grid[i + 1][j],
          grid[i][j - 1],
          grid[i][j + 1],
          grid[i - 1][j - 1],
          grid[i + 1][j + 1],
          grid[i - 1][j + 1],
          grid[i + 1][j - 1]
        );
      }

      // Get neighbours for the corner cells
      if (j > 0 && j < MAP_GRID[i].length - 1) {
        // Cells at the top most row of the board
        if (i === 0) {
          neighbours.push(
            grid[i + 1][j],
            grid[i][j - 1],
            grid[i][j + 1],
            grid[i + 1][j + 1],
            grid[i + 1][j - 1]
          );
        }

        // Cells at the bottom most row of the board
        if (i === MAP_ROWS) {
          neighbours.push(
            grid[i - 1][j],
            grid[i][j - 1],
            grid[i][j + 1],
            grid[i - 1][j - 1],
            grid[i - 1][j + 1]
          );
        }
      }

      if (i > 0 && i < MAP_GRID.length - 1) {
        // Cells at the left most collumn of the board
        if (j === 0) {
          neighbours.push(
            grid[i - 1][j],
            grid[i + 1][j],
            grid[i][j + 1],
            grid[i + 1][j + 1],
            grid[i - 1][j + 1]
          );
        }

        // Cells at the right most collumn of the board
        if (j === MAP_COLS) {
          neighbours.push(
            grid[i - 1][j],
            grid[i + 1][j],
            grid[i][j - 1],
            grid[i - 1][j - 1],
            grid[i + 1][j - 1]
          );
        }
      }

      MAP_GRID[i][j].neighbours = neighbours;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, parseInt(canvas.width + 1), parseInt(canvas.height + 1));

  for (let i = 0; i < MAP_GRID.length; i++) {
    for (let j = 0; j < MAP_GRID[i].length; j++) {
      let cell = MAP_GRID[i][j];
      let x = cell.x * CELL_RESOLUTION;
      let y = cell.y * CELL_RESOLUTION;

      ctx.strokeStyle = "rgb(60, 60, 60)";
      ctx.fillStyle = cell.state == 1 ? "rgb(180, 180, 180)" : "#333";
      ctx.fillRect(x, y, CELL_RESOLUTION, CELL_RESOLUTION);

      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, MAP_ROWS * CELL_RESOLUTION);
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(MAP_COLS * CELL_RESOLUTION, y);
      ctx.stroke();
      ctx.closePath();
    }
  }
}

function clear_cells(randomize = false) {
  MAP_GRID = [];
  generate_grid(randomize ? true : false);
  draw();
}

function step_forward() {
  // Set buffer
  for (let i = 0; i < MAP_GRID.length; i++) {
    for (let j = 0; j < MAP_GRID[i].length; j++) {
      let cell_data = MAP_GRID[i][j].get_cell_data();

      let alive = cell_data.neighbours.alive;
      let buffer = cell_data.state;

      // Set buffer based on the rules of 'The game of life'
      buffer == 0 && alive == 3
        ? (buffer = 1)
        : buffer == 1 && (alive < 2 || alive > 3)
        ? (buffer = 0)
        : null;
      MAP_GRID[i][j].buffer = buffer;
    }
  }

  // Set state to buffer
  for (let i = 0; i < MAP_GRID.length; i++) {
    for (let j = 0; j < MAP_GRID[i].length; j++) {
      let cell_data = MAP_GRID[i][j].get_cell_data();
      MAP_GRID[i][j].state = cell_data.buffer;
      if (cell_data.buffer == 1) {
        population++;
      }
    }
  }

  // Update time
  time++;
  document.querySelector(".time").innerText = `Time: ${time}`;

  // Update Population
  document.querySelector(".population").innerText = `Population: ${population}`;
  population = 0;

  draw();
}

document.querySelector(".play").addEventListener("click", () => {
  if (!run) {
    run = true;
    interval = setInterval(step_forward, 1000 / FPS);
  }
});

document.querySelector(".pause").addEventListener("click", () => {
  if (run) {
    run = false;
    clearInterval(interval);
    interval = null;
  }
});

document.querySelector(".step").addEventListener("click", () => {
  if (!run) {
    step_forward();
  }
});

document.querySelector(".reset").addEventListener("click", () => {
  clear_cells();
  run = false;
  window.clearInterval(interval);
  interval = null;
  time = 0;
  population = 0;

  document.querySelector(".time").innerText = `Time: ${time}`;
  document.querySelector(".population").innerText = `Population: ${population}`;
});

document.querySelector(".randomize").addEventListener("click", () => {
  clear_cells(true);
  run = false;
  window.clearInterval(interval);
  interval = null;
});

// Listen for keyboard events
window.addEventListener("keydown", (e) => {
  // Toggle the play state on 'Space' key pressed
  if (e.key == " ") {
    run = !run;
    if (run) {
      interval = setInterval(step_forward, 1000 / FPS);
    } else {
      clearInterval(interval);
      interval = null;
    }
  }

  // Clear the board on 'C' key pressed
  if (e.key == "c") {
    clear_cells();
    run = false;
    window.clearInterval(interval);
    interval = null;
  }

  // Set all the cell's states to random on 'Shift' key pressed
  if (e.key == "Shift") {
    clear_cells(true);
    run = false;
    window.clearInterval(interval);
    interval = null;
  }

  // Step forward
  if (e.key == "ArrowRight") {
    if (!run) {
      step_forward();
    }
  }
});

// Disable the ability to drag inorder to prevent draging of the cells
window.addEventListener("dragstart", (e) => {
  // Prevent default behaviour
  e.preventDefault();
});

// Set defaults and generate grid on page load
window.addEventListener("load", () => {
  MAP_ROWS = Math.round(window.innerHeight / CELL_RESOLUTION) - 3;
  MAP_COLS = Math.round(window.innerWidth / CELL_RESOLUTION);
  generate_grid();

  canvas.width = CELL_RESOLUTION * MAP_COLS;
  canvas.height = CELL_RESOLUTION * MAP_ROWS;
  draw();
});

// Get the coords of the cell that the mouse is hovering over
window.addEventListener("mousemove", (e) => {
  x = parseInt(e.clientX / CELL_RESOLUTION);
  y = parseInt(e.clientY / CELL_RESOLUTION) - 3;
  if (lmb) {
    MAP_GRID[y][x].state = 1;
    draw();
  } else if (rmb) {
    MAP_GRID[y][x].state = 0;
    draw();
  }
});

// Get mouse down events
window.addEventListener("mousedown", (e) => {
  e.button === 0 ? (lmb = true) : e.button === 2 ? (rmb = true) : null;
  MAP_GRID[y][x].state = 1;
  draw();
});

// Get mouse up events
window.addEventListener("mouseup", (e) => {
  e.button === 0 ? (lmb = false) : e.button === 2 ? (rmb = false) : null;
  draw();
});

// Disable the context menu that appears on right click
window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});
