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
	var formattedTime = moment(msg.createdAt).format('MMM Do YYYY, HH:mm:ss');
	console.log("New Message", msg);
	$('#messages').append('<li>' + formattedTime + ': From: ' + msg.from + ' - ' + msg.text + '</li>');
});	

socket.on('newLocationMessage', function (msg) {
	var formattedTime = moment(msg.createdAt).format('MMM Do YYYY, HH:mm:ss');
	console.log("New Message", msg);
	$('#messages').append('<li>' + formattedTime + ': From: ' + msg.from + ' - <a href="' + msg.url + '" target="_blank">Location</a></li>');
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

var locationButton = $('#send-location');
locationButton.on('click', function (e)
{
	if(!navigator.geolocation)
	{
		return alert("Geoloaction is not available");
	}
	
	navigator.geolocation.getCurrentPosition(function (position) 
	{
		console.log(position);
		// position.coords
		socket.emit('createLocationMessage', { from: 'User', latitude: position.coords.latitude, longitude: position.coords.longitude }, function (data) 
		{
			console.log('Got it', data);
		});
	}, function () 
	{
		alert('Unable to fetch location');
	});
});