const express = require('express');
const app = express();
const mysql = require('mysql');
const fs = require('fs');


app.use(express.static(__dirname + '/')); //include all files in dir
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({extended: true})); // to support URL-encoded bodies

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

app.get('/holdings', function (req, res) {

	//connect to mysql. NOTE: I'm aware this is not secure at all
	var con = mysql.createConnection({
  		host: "localhost",
  		user: "root",
  		password: "helloworld",
  		database: "crypto_transactions"
	});

	con.connect(function(err) {
  		
  		if (err) throw err;
  		
  		var holdings;
  		var query = "SELECT crypto_type, SUM(crypto_amount) AS total FROM buys GROUP BY crypto_type";
  		con.query(query, function (err, result) {
    		
    		if (err) throw err;

    		holdings = JSON.stringify(result);
    		res.send(holdings);
  		});
  		
  		con.end();
	});

});

app.post('/transaction', function (req, res) {

	var password = req.body["password"];

	console.log(password);

	fs.readFile(__dirname + '/tx_auth.txt', 'utf8', function (err,data) {
  		
  		if (err) throw err;

  		console.log(data);
  		if (password.toString().trim() == data.toString().trim()) { //authenticated

  			var transaction_date = req.body["tx_date"];
  			var transaction_cost = req.body["tx_cost"];
  			var crypto_type = req.body["type"];
  			var crypto_amount = req.body["amount"];
  			var current_price = req.body["current_price"];
  			var effective_price = parseFloat(crypto_amount) * parseFloat(current_price); 
  			var query = "INSERT INTO buys VALUES (" + transaction_date + ", " + transaction_cost + "," + crypto_type + "," + crypto_amount + "," + effective_price.toString() + "," + current_price + ")";

  			//connect to mysql. NOTE: I'm aware this is not secure at all
			var con = mysql.createConnection({
		  		host: "localhost",
		  		user: "root",
		  		password: "helloworld",
		  		database: "crypto_transactions"
			});

			con.connect(function(err) {
  		
		  		if (err) throw err;
		  		
		  		con.query(query, function (err, result) {
		    		
		    		if (err) throw err;

		    		res.redirect('/');
		  		});
		  		
		  		con.end();
			});
  		}
  		else { // not authenticated

  		}
	});

});

app.listen(3000, function () {
  console.log('App running');
});
