const express = require('express');
const app = express();
const mysql = require('mysql');

//home url
app.get('/', function (req, res) {
  res.send('Hello World!');
})

//transactions
app.get('/transactions', function (req, res) {

	//connect to mysql. NOTE: I'm aware this is not secure at all
	var con = mysql.createConnection({
  		host: "localhost",
  		user: "root",
  		password: "helloworld",
  		database: "crypto_transactions"
	});

	con.connect(function(err) {
  		
  		if (err) throw err;
  		
  		//transactions
  		var transactions; 
  		con.query("SELECT * FROM transactions", function (err, result) {
    		
    		if (err) throw err;

    		transactions = json.stringify(result);
    		
  		});
  
	});
	
	con.end();
	res.send(transactions);
	
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
