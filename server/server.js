const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const {generateMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const appPort = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketio(server);

app.use(express.static(publicPath));

io.on('connection', (socket) =>
{
	console.log('New user connected');
	socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app') );
	socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new user has joined') );
	// socket.emit('newEmail', {
		// from: 'mike@example.com',
		// text: 'Hey there',
		// created: 123
	// });
	
	// socket.emit('newMessage', {
		// from: 'me@mydomain.com',
		// text: 'Hey there',
		// created: 12345 // new Date().getTime();
	// });
	
	// socket.on('createEmail', (newEmail) =>
	// {
		// console.log('createEmail', newEmail);
	// });
	
	socket.on('createMessage', (newMsg) =>
	{
		console.log('createMessage', newMsg);
		io.emit('newMessage', generateMessage(newMsg.from, newMsg.text));
	
		socket.on('disconnect', (inp) =>
		{
			console.log('Client connection disconnected');
		});
	});
});
// io.on('disconnect', (socket) =>
// {
	// console.log('Client connection disconnected');
// });

server.listen(appPort, () => 
{
	console.log(`Started on port ${appPort}`);
});

module.exports = {app};