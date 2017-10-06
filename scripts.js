
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
	xhr.open('GET', '18.221.195.150/holdings'); //aware this is not secure
	xhr.onload = function() {

		if (xhr.status === 200) {

			json = JSON.parse(xhr.responseText);
			
			for (entry in json) {

				alert(entry['crypto_type']);
				alert(entry['total']);

			}
		}
	};

	xhr.send();


}







get_price("BTC", "USD");
get_price("BTC", "CAD");
get_price("ETH", "USD");
get_price("ETH", "CAD");
get_price("LTC", "USD");
//get_price("LTC", "CAD");
get_holdings();