var socket = io();
socket.on('connect', function () {
	console.log("Connected to server");
	
	socket.emit('createEmail', {
		to: 'jen@example.com',
		text: 'Hi there person'
	});
	
	socket.emit('createMessage', {
		to: 'jen@example.com',
		text: 'Hi there person'
	});
});

socket.on('disconnect', function () {
	console.log("Server connection disconnected");
});

socket.on('newEmail', function (email) {
	console.log("New Email", email);
});	

socket.on('newMessage', function (msg) {
	console.log("New Message", msg);
});	