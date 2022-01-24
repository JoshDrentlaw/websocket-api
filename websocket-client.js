export const initWebSocket = ({ path } = { path: '' }) => {
    let ws
    console.log('initing web socket path:', path)
    if (ws) {
        console.log(`closing path: ${path}`)
        ws.onerror = ws.onopen = ws.onclose = null
        ws.close()
    }

    ws = new WebSocket(`ws://localhost:8080/${path}`)

    ws.onopen = () => {
        console.log(`Connected to "${path}" socket`)
    }

    ws.onclose = function () {
        ws = null
    }

    ws.setMessage = fn => {
        ws.onmessage = async ({ data }) => fn(await parseMessage(data))
    }

    return ws
}

export const parseMessage = async data => {
    return await (new Response(data)).text()
}