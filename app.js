const { Socket } = require('dgram')
const express =require('express')
const path = require('path')
const app=express()
const PORT = process.env.PORT || 3000
const server = app.listen(PORT,()=>console.log(`chat server om port ${PORT} `))
//require sokect  in http server that listen in port 3000 for client socket import script
const io= require('socket.io')(server)

app.use(express.static(path.join(__dirname,'public')))

let socketsConnected =new Set()

 io.on('connection', onConnected)


 function onConnected(socket)
 {
        console.log(socket.id)
        socketsConnected.add(socket.id)   
        //to send message to all connected clients(sockets) & io is an instance of Socket.io server
        //by make event called clients-total and send it to clinet side in main js to handle this event
        //that's like trigger 
        io.emit('clients-total',socketsConnected.size)
        
        socket.on('disconnect',()=>{
            console.log("socket disconnected",socket.id)
            socketsConnected.delete(socket.id)
            io.emit('clients-total',socketsConnected.size) 
        })
        // handle client's event and see data that come from to server and brodcast it to al clients except messager who send the message
        socket.on('message',(data)=>{
            console.log(data)
            socket.broadcast.emit('chat-message',data)
            
        })

      // handle feedback from client side  
      socket.on('feedback',(data)=>{
        socket.broadcast.emit('feedback',data)

    
      })
        
 
 }