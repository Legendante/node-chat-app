const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const appPort = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketio(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) =>
{
	console.log('New user connected');

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
	
	socket.on('join', (params, callback) => 
	{
		if(!isRealString(params.name) || !isRealString(params.room))
		{
			return callback("Name and/or roomname are required");
		}
		
		socket.join(params.room);
		users.removeUser(socket.id);
		users.addUser(socket.id, params.name, params.room);
		
		io.to(params.room).emit('updateUserList', users.getUserList(params.room));
		
		socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app') );
		socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`) );
		// socket.leave(params.room);
		
		// io.emit // Sends message to everyone
		// socket.broadcast.emit // Sends to everyone except the socket (connection) user
		// socket.emit // Sends only to the socket user
		// ## Room specific socket sends
		// io.to(params.room).emit // Send to everyone in a specific room
		// socket.broadcast.to(params.room).emit // Sends to everyone except the socket (connection) user in a specific room
		
		callback();
	});
	
	
	socket.on('createMessage', (newMsg, callback) =>
	{
		console.log('createMessage', newMsg);
		var user = users.getUser(socket.id);
		if(user && isRealString(newMsg.text))
		{
			io.to(user.room).emit('newMessage', generateMessage(user.name, newMsg.text));
			callback('This is from the server');
		}
	});
	
	socket.on('createLocationMessage', (coords, callback) =>
	{
		var user = users.getUser(socket.id);
		console.log('createLocationMessage', coords);
		if(user)
		{
			io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
			callback('This is from the server');
		}
	});
	
	socket.on('disconnect', () =>
	{
		console.log('Client connection disconnected');
		var user = users.removeUser(socket.id);
		console.log('User', user);
		if(user)
		{
			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
		}
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