const { randomUUID } = require("crypto")
const express = require('express')
const { createServer } = require('http')
const { parse } = require('url')
const WebSocket = require('ws')

const port = 8080,
    server = createServer(),
    chatSocket = new WebSocket.Server({ noServer: true }),
    userSocket = new WebSocket.Server({ noServer: true })

chatSocket.on('connection', (ws) => {
    ws.on('message', data => {
        chatSocket.clients.forEach(client => {
            // this if statement stops broadcasting to yourself
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                console.log('chat received: %s', data)
                client.send(data)
            }
        })
    })
})

const userRooms = {}
userSocket.on('connection', (ws) => {
    const { username, room } = ws.params

    if (!userRooms[room]) {
        userRooms[room] = {}
    }
    if (!userRooms[room][username]) {
        userRooms[room][username] = ws
    }
    console.log({userRooms})

    ws.on('message', data => {
        if (userRooms[room]) {
            Object.entries(userRooms[room]).forEach(([id, client]) => {
                if (client.readyState === WebSocket.OPEN) {
                    const users = Object.keys(userRooms[room] ?? {})
                    console.log({users})
                    client.send(JSON.stringify({users}))
                }
            })
        } else {
            ws.send(JSON.stringify({users: []}))
        }
    })

    ws.on('close', () => {
        if (Object.keys(userRooms[room]).length === 1) {
            delete userRooms[room]
        } else {
            delete userRooms[room][username]
        }

        ws.emit('message')
    })

    ws.emit('message')
})

server.on('upgrade', (request, socket, head) => {
    const { pathname, query } = parse(request.url)

    if (pathname === '/chat') {
        chatSocket.handleUpgrade(request, socket, head, ws => {
            chatSocket.emit('connection', ws, request)
        })
    } else if (pathname === '/user') {
        userSocket.handleUpgrade(request, socket, head, ws => {
            const parsed = {}
            new URLSearchParams(query).forEach((v, k) => parsed[k] = v)
            ws.params = parsed
            userSocket.emit('connection', ws, request)
        })
    } else {
        socket.destroy()
    }
})

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})