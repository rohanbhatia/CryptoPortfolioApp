const express = require('express');
const app = express();
const mysql = require('mysql');


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

	res.redirect('/');


});

app.listen(3000, function () {
  console.log('App running');
});
