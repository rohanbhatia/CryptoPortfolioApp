global_count = 0;

function get_prices() {

	for (type in ["BTC", "ETH", "LTC"]) {
		for(currency in ["USD", "CAD"]) {

			if (!(type == "LTC" && currency == "CAD")) {
				get_price(type, currency);
			}

		}
	}

}


function get_price(type, currency) {
	
	//hardcoded values for the kraken api
	var pairname;
	var json_pairname;

	if (type == 'BTC') {
		pairname = 'XBT' + currency;
		json_pairname = 'XXBTZ' + currency;
	}

	if (type == 'ETH') {
		pairname = 'ETH' + currency;
		json_pairname = 'XETHZ' + currency;
	}

	if (type == 'LTC') {
		pairname = 'LTC' + currency;
		json_pairname = 'XLTCZ' + currency;
	}

	//XML Request
	var xhr = new XMLHttpRequest();
	xhr.open('GET', ('https://api.kraken.com/0/public/Ticker?pair=' + pairname));
	xhr.onload = function() {
    	
    	if (xhr.status === 200) {

    		json = JSON.parse(xhr.responseText);
    		price = (parseFloat(json['result'][json_pairname]['a'][0]) + parseFloat(json['result'][json_pairname]['b'][0]))/2;

        	var next = document.getElementById(type.toLowerCase()).firstChild;
        	while (true) {

        		if (next.className == currency.toLowerCase()) {
        
                	next.innerHTML = type + " Price (" + currency + "): " + price.toString();
                	global_count++;
                	if (global_count == 5) {
                		global_count = 0;
                		get_holdings()
                	}
        			break;
        		}
        		else {
        			
        			next = next.nextSibling;
        		}
        	}
    	}	
	};

	xhr.send()
};


function get_holdings() {

	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://18.221.195.150:3000/holdings'); //aware this is not secure
	xhr.onload = function() {

		if (xhr.status === 200) {

			json = JSON.parse(xhr.responseText);
			
			for (entry in json) {

				var id = json[entry]["crypto_type"];
				var holdings = parseFloat(json[entry]["total"]);
				var usdprice;

				var next = document.getElementById(id.toLowerCase()).firstChild;
				

        		while (true) {

	        		if (next.className == 'total') {
	        
	                	next.innerHTML = 'Total ' + id.toString() + ": " + holdings.toString();
	        		}
	        		else if (next.className == 'usd') {

	        			usdprice = parseFloat(((next.innerHTML).split(" "))[3]);
	        			alert(usdprice);
	        		}
	        		else if (next.className == 'position_value') {

	        			var position_value = usdprice * holdings;
	        			next.innerHTML = id + ' Position Value (USD): ' + position_value.toString();
	        			break;

	        		}
	        		
	        			
	        		next = next.nextSibling;
	        		
        		}
			}
		}
	};

	xhr.send();
}






get_prices();
