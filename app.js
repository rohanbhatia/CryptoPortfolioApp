const express = require('express');
const app = express();
const mysql = require('mysql');

app.get('/', function (req, res) {
  res.send('Hello World!');
})

app.get('/transactions', function (req, res) {

	//connect to db. NOTE: I'm aware this is not secure at all
	var con = mysql.createConnection({
  		host: "localhost",
  		user: "root",
  		password: "helloworld"
	});

	con.connect(function(err) {
  	if (err) throw err;
  		console.log("Connected!");
	});
	


});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
