const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const appPort = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketio(server);

app.use(express.static(publicPath));

io.on('connection', (socket) =>
{
	console.log('New user connected');
	socket.emit('newMessage', { from: "Admin", text: "Welcome new user", createdAt: new Date().getTime()});
	socket.broadcast.emit('newMessage', { from: "Admin", text: "A new user has joined", createdAt: new Date().getTime()});
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
		io.emit('newMessage', {
			from: newMsg.from,
			text: newMsg.text,
			createdAt: new Date().getTime()
		});
		// socket.broadcast.emit('newMessage', {
			// from: newMsg.from,
			// text: newMsg.text,
			// createdAt: new Date().getTime()
		// });
	});
	
	socket.on('disconnect', (inp) =>
	{
		console.log('Client connection disconnected');
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



