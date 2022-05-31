export default class Cell {
	constructor (resolution, state, buffer, x, y) {
		this.state = state
		this.buffer = buffer
		this.resolution = resolution
		this.neighbours = []
		this.x = x
		this.y = y
	}
	
	get_neighbour_data(cells) {
		let cell_state = ""
		let alive_count = 0
		let dead_count = 0
		
		for (let i = 0; i < cells.length; i++) {
			cells[i].state === 1 ? alive_count ++ : dead_count ++
		}
		
		return {
			"alive": alive_count,
			"dead": dead_count,
			"count": cells.length,
			"cells": cells
		}
	}

	get_cell_data() {
		return (
			{
				"state": this.state,
				"buffer": this.buffer,
				"position": {
					"x": this.x,
					"y": this.y
				},

				"neighbours": this.get_neighbour_data(this.neighbours)
			}
		)
	}
}