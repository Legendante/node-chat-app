var socket = io();
socket.on('connect', function () {
	console.log("Connected to server");
	
	// getParameterByName(name, url)
	
	params = {
		name: getParameterByName('name'),
		room: getParameterByName('room')
	};
	
	socket.emit('join', params, function (err) 
	{
		if(err)
		{
			alert(err);
			window.location.href = '/';
		}
		else
		{
			console.log('No error');
		}
	});
	
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
	// $('#messages').append('<li>' + formattedTime + ': From: ' + msg.from + ' - ' + msg.text + '</li>');
	var template = $('#message-template').html();
	var html = Mustache.render(template, {
		date: formattedTime,
		name: msg.from,
		msg: msg.text
	});
	$('#messages').append(html);
});	

socket.on('newLocationMessage', function (msg) {
	var formattedTime = moment(msg.createdAt).format('MMM Do YYYY, HH:mm:ss');
	console.log("New Message", msg);
	$('#messages').append('<li>' + formattedTime + ': From: ' + msg.from + ' - <a href="' + msg.url + '" target="_blank">Location</a></li>');
});	

socket.on('updateUserList', function (users) {
	console.log('Users list', users);
	$('#userList').html('');
	users.forEach(function (user)
	{	
		$('#userList').append('<p>' + user + '</p>');
	});
});


// socket.emit('createMessage', { from: 'mike@example.com', text: 'Hey there' }, function (data) 
// {
	// console.log('Got it', data);
// });

$('#message-form').on('submit', function (e) 
{
	e.preventDefault();
	socket.emit('createMessage', { text: $('#message').val() }, function (data) 
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


function getParameterByName(name, url) 
{
    if (!url) 
		url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'), results = regex.exec(url);
    if (!results) 
		return null;
    if (!results[2]) 
		return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}