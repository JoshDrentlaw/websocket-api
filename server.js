const express = require('express')
const { createServer } = require('http')
const { parse } = require('url')
const WebSocket = require('ws')

const port = 8080,
    server = createServer(),
    chatSocket = new WebSocket.Server({ noServer: true }),
    themeSocket = new WebSocket.Server({ noServer: true })

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

themeSocket.on('connection', (ws) => {
    ws.on('message', data => {
        themeSocket.clients.forEach(client => {
            // this if statement stops broadcasting to yourself
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                console.log('theme received: %s', data)
                client.send(data)
            }
        })
    })
})

server.on('upgrade', (request, socket, head) => {
    const { pathname } = parse(request.url)

    if (pathname === '/chat') {
        chatSocket.handleUpgrade(request, socket, head, ws => {
            chatSocket.emit('connection', ws, request)
        })
    } else if (pathname === '/theme') {
        themeSocket.handleUpgrade(request, socket, head, ws => {
            themeSocket.emit('connection', ws, request)
        })
    } else {
        socket.destroy()
    }
})

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})