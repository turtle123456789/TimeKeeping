import { io } from "socket.io-client"

const socket = io("http://localhost:3001")

// Log connection status
socket.on('connect', () => {
    console.log('Socket connected successfully')
})

socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error)
})

socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason)
})

// // Log all incoming events for debugging
// socket.onAny((eventName, ...args) => {
//   console.log('Received event:', eventName, args)
// })

export default socket
