const express = require('express');
const app = express();
const mysql = require('mysql');

//home url
app.get('/', function (req, res) {
  res.sendFile('index.html', {root: __dirname});
})

//transactions
app.get('/buys', function (req, res) {

	//connect to mysql. NOTE: I'm aware this is not secure at all
	var con = mysql.createConnection({
  		host: "localhost",
  		user: "root",
  		password: "helloworld",
  		database: "crypto_transactions"
	});

	con.connect(function(err) {
  		
  		if (err) throw err;
  		
  		//buys
  		var transactions;
  		var query = "SELECT * FROM buys";
  		con.query(query, function (err, result) {
    		
    		if (err) throw err;

    		transactions = JSON.stringify(result);
    		res.send(transactions);
  		});
  		
  		con.end();
	});
});

app.listen(3000, function () {
  console.log('App running');
});
