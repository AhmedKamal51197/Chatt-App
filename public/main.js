const socket =io()

const clientsTotal  = document.getElementById('clients-total')
const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')


const messageTone = new Audio('/messageTone.mp3')
messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    sendMessage()
})


// handle clients-total event that's come from server side by emit method
socket.on('clients-total',(data)=>{
   // console.log(data)
   clientsTotal.innerText=`Total Clients: ${data}`
})

// this function to get message from clients that login and handle it in server
function sendMessage() {
if(messageInput.value==='') return
//  console.log(messageInput.value)
 //create json object (dict) to path data from client to server
 const data = {
    name:nameInput.value,
    message:messageInput.value,
    dateTime: new Date()
 }
 // create custom  event call message   and handle it in server
 socket.emit('message',data)
 addMessageToUI(true,data)
 messageInput.value=''
}
// message from other that server send it to owner clinet who login
socket.on('chat-message',(data)=>{
    console.log("enter chat")
    messageTone.play()
    addMessageToUI(false,data)
})

function addMessageToUI(isOwnMessage,data)
{
    clearFeedback()
    // messageTone.play()

    const element=`
    <li class="${isOwnMessage? 'message-right' : 'message-left'}">
    <p class="message">
        ${data.message}
        <span>${data.name} . ${moment(data.dateTime).fromNow()}</span>
    </p>
    </li>
    `

    messageContainer.innerHTML+=element
    scrollToBottom()
}


function scrollToBottom() {
    messageContainer.scrollTo(0,messageContainer.scrollHeight)
}


messageInput.addEventListener('focus',(e)=>{
    socket.emit('feedback',{
        feedback:` ${nameInput.value} is typing a message`
    })
})

messageInput.addEventListener('keypress',(e)=>{
    socket.emit('feedback',{
        feedback:` ${nameInput.value} is typing a message`
    })
})

messageInput.addEventListener('blur',(e)=>{
    socket.emit('feedback',{
        feedback:'',
    })
})


socket.on('feedback',(data)=>{
    clearFeedback()
    const element= `
    <li class="message-feedback">
    <p class="feedback" id="feedback">
        ${data.feedback} 
    </p>
    </li>
    `

    messageContainer.innerHTML+=element
})

function clearFeedback()
{
    document.querySelectorAll('li.message-feedback').forEach(element=>{
        element.parentNode.removeChild(element)
    })
}