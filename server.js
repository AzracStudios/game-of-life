const express = require('express')
const path = require('path')
const app = express()

app.use(express.static(path.resolve(path.join(__dirname, "."))))

app.listen(3000, () => {
	console.log("Server started at port 3000")
})