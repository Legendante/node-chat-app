var socket = io();
socket.on('connect', function () {
	console.log("Connected to server");
	
	// socket.emit('createEmail', {
		// to: 'jen@example.com',
		// text: 'Hi there person'
	// });
	
	// socket.emit('createMessage', {
		// to: 'jen@example.com',
		// text: 'Hi there person'
	// });
});

socket.on('disconnect', function () {
	console.log("Server connection disconnected");
});

socket.on('newEmail', function (email) {
	console.log("New Email", email);
});	

socket.on('newMessage', function (msg) {
	console.log("New Message", msg);
	$('#messages').append('<li>From: ' + msg.from + ' - ' + msg.text + '</li>');
});	

// socket.emit('createMessage', { from: 'mike@example.com', text: 'Hey there' }, function (data) 
// {
	// console.log('Got it', data);
// });

$('#message-form').on('submit', function (e) 
{
	e.preventDefault();
	socket.emit('createMessage', { from: 'User', text: $('#message').val() }, function (data) 
	{
		console.log('Got it', data);
	});
	$('#message').val('');
});