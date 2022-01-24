import { initWebSocket, parseMessage } from './websocket-client.js'

const sendBtn = document.querySelector('#send'),
    messages = document.querySelector('#messages'),
    messageBox = document.querySelector('#messageBox'),
    themeSelect = document.querySelector('#theme-select')

let chatSocket = initWebSocket({ path: 'chat' }),
    themeSocket = initWebSocket({ path: 'theme' })

function showMessage(message) {
    console.log({message})
    messages.textContent += `\n\n${message}`
    messages.scrollTop = messages.scrollHeight
    messageBox.value = ''
}

function updateTheme(color) {
    console.log({color})
    sendBtn.style.backgroundColor = color
}

sendBtn.onclick = function () {
    if (!chatSocket) {
        showMessage("No Chat connection :(")
        return
    }

    chatSocket.send(messageBox.value)
    showMessage(messageBox.value)
}

themeSelect.onchange = ({ target: { value }}) => {
    if (!themeSocket) {
        showMessage("No Theme connection :(")
        return
    }

    themeSocket.send(value)
    updateTheme(value)
}

const init = () => {
    // chatSocket.onmessage = async ({ data }) => showMessage(await parseMessage(data))
    chatSocket.setMessage(showMessage)
    // themeSocket.onmessage = ({ data }) => updateTheme(data)
    themeSocket.setMessage(updateTheme)
}

init()