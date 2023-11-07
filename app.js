import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import __dirname from "./helpers/dirname.js"

const app = express()
const server = createServer(app)
const filesURL = __dirname.concat("/html") 

app.use(cors())

const io = new Server(server)

const messages = []

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: filesURL })
})

io.on("connection", (socket) => {
    console.log("usuario conectado!");

    io.emit("getMessages", messages)

    socket.on("username", (name) => {
        socket.id = name
    })
    socket.broadcast.emit("hi")
    socket.on('chat message', (msg) => {
        io.emit("chat message", { name: socket.id, msg })
        messages.push({ name: socket.id, msg })
        // console.log('message: ' + socket.id + ": " + msg);
        console.log(messages);
    });
    socket.on("disconnect", () => {
        console.log("usuario desconectado!");
    })
})

server.listen(3000, () => {
    console.log("Server listen on port 3000");
})