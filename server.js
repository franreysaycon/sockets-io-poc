
const express = require("express")
const http = require('http')
const cors = require('cors')
const fs = require('fs');
const { v4 } = require('uuid');
const installSockets = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = installSockets(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

const NEW_ALERTS_EVENT = "new alerts"
const ACK_ALERTS_EVENT = "ack alerts"

app.use(cors())
app.use(express.json())

// Amps Routes
app.post('/new', (req, res) => {
    const oldAlerts = JSON.parse(fs.readFileSync('data.json'))
    const id = v4()
    oldAlerts[v4()] = {
        data: req.body.data,
        ack_person: null,
    }

    io.emit(NEW_ALERTS_EVENT, { id: id, data: req.body.data })

    fs.writeFileSync('data.json', JSON.stringify(oldAlerts))
    res.json({ success: true })
})

// Amps Websocket
io.on('connection', (socket) => {
    // Acknowledgement on sockets
    socket.on(ACK_ALERTS_EVENT, (data) => {
        const oldAlerts = JSON.parse(fs.readFileSync('data.json'))
        oldAlerts[data.id].ack_person = data.person
        socket.emit(ACK_ALERTS_EVENT, { id: data.id, ack_person: data.person })
        fs.writeFileSync('data.json', JSON.stringify(oldAlerts))
    })
})

server.listen(8000)
