const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '../public');
const appPort = process.env.PORT || 3000;

var app = express();
app.use(express.static(publicPath));
// app.use(bodyParser.json());

app.listen(appPort, () => 
{
	console.log(`Started on port ${appPort}`);
});

module.exports = {app};



