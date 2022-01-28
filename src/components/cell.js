export default class Cell {
	constructor (width=10, height=10, state=1, buffer=1, neighbours=[], x=0, y=0) {
		this.state = state
		this.buffer = buffer
		this.neighbours = neighbours
		this.width = width
		this.height = height
		this.x = x
		this.y = y
	}
	
	array_to_binary(array) {
		let str = ""

		for (let i = 0; i < array.length; i++) {
			str += array[i].state
		}

		return parseInt(str)
	}

	get_neighbour_data(cells) {
		let cell_state = ""
		let alive_count = 0
		let dead_count = 0
		let bin = array_to_binary(cells)

		for (let i = 0; i < cells.length; i++) {
			cell_state += cells[i].state
			cells[i].state == 1 ? alive_count += 1 : dead_count += 1
		}

		return {
			"alive": alive_count,
			"dead": dead_count,
			"bin": bin
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

				"neighbours": {
					"alive": get_neighbour_data(neighbours).alive,
					"dead": get_neighbour_data(neighbours).dead,
					"count": neighbours.length,
					"bin": get_neighbour_data(neighbours).bin,
					"cells": neighbours
				}
			}
		)
	}

	render() {
		let cell = document.createElement("div")
		cell.classList.add(this.state == 1 ? "alive" : "dead", "cell")
		cell.style.width = `${this.width}px`
		cell.style.height = `${this.height}px`
		return cell
	}

	
}