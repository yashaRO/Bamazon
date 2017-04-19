var mysql = require('mysql');
var prompt = require('prompt');

var connection = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	database: 'bamazon'
});

prompt.start();
connection.connect();