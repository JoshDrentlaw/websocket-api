import { initWebSocket, parseMessage } from './websocket-client.js'

const sendBtn = document.querySelector('#send'),
    messages = document.querySelector('#messages'),
    messageBox = document.querySelector('#messageBox'),
    userList = document.querySelector('#user-list')

let chatSocket = initWebSocket({ path: 'chat' }),
    userSocket = initWebSocket({
        path: `user?username=${window.localStorage.getItem('username')}&room=1`,
        onOpen: () => {
            console.log(userSocket)
            addUser
        }
    })

function showMessage(message) {
    console.log({message})
    messages.textContent += `\n\n${message}`
    messages.scrollTop = messages.scrollHeight
    messageBox.value = ''
}

function addUser(users) {
    console.log({users})
    userList.innerHTML = null
    users.forEach(u => {
        const li = document.createElement('li')
        li.innerHTML = u
        userList.appendChild(li)
    })
}

sendBtn.onclick = function () {
    if (!chatSocket) {
        showMessage("No Chat connection :(")
        return
    }

    chatSocket.send(messageBox.value)
    showMessage(messageBox.value)
}

const init = () => {
    chatSocket.setMessage(showMessage)
    userSocket.setJsonMessage(addUser)
    addUser(window.localStorage.getItem('username'))
}

init()