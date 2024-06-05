import express from "express"
import {createServer} from "node:http";
import {dirname, join} from "node:path";
import { fileURLToPath } from "node:url";
import path from "path"
import http from "http"
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server)



const PORT = 9000
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

const connections = {}

app.get('/', (req, res)=>{
    res.sendFile(join(__dirname, "index.html"));
})



io.on("connection", (socket) =>{
    console.log("a user connected", socket.id);

    connections[socket.id] = socket

    socket.emit("chat message", "Welcome to the server")

    socket.on("chat message", msg=>{
        socket.broadcast.emit("chat message", msg)
    })
    socket.on("disconnect", ()=>{
        console.log("user disconnected");
    })

})


app.post("/chat", (req, res)=>{
    const socketid = req.query.socketid;
    const socket = connections[socketid]

    socket.broadcast.emit("chat message", req.body.message)
})


server.listen(PORT, _ =>{
    console.log("currently listening on, ", PORT )
})
