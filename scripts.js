global_count = 0;
btc_value = 0;
eth_value = 0;
ltc_value = 0;
highchart_count = 0;

function get_prices() {

	arr1 = ["BTC", "ETH", "LTC"];
 	arr2 = ["USD", "CAD"];

	for (type in arr1) {
		
		for(currency in arr2) {

			if (!(arr1[type] == "LTC" && arr2[currency] == "CAD")) {
				get_price(arr1[type], arr2[currency]);
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
                		get_holdings();
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
	xhr.open('GET', 'http://18.221.195.150/holdings'); //aware this is not secure
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
	        		}
	        		else if (next.className == 'position_value') {

	        			var position_value = usdprice * holdings;
	        			next.innerHTML = id + ' Position Value (USD): ' + position_value.toString();

	        			if (id == "BTC") {
	        				btc_value = position_value;
	        			}
	        			else if (id == "ETH") {
	        				eth_value = position_value;
	        			} 
	        			else {
	        				ltc_value = position_value;
	        			}
	        			
	        			highchart_count++;

	        			if (highchart_count == 3) {
	        				highchart_count = 0;
	        				draw_highchart();
	        			}

	        			break;

	        		}
	        			
	        		next = next.nextSibling;
        		}
			}
		}
	};

	xhr.send();
}

function draw_highchart() {

	Highcharts.setOptions({colors: ['#FFD527', '#0036FF', '#8C9B9E']});


	Highcharts.chart('container', {
	    chart: {
	        plotBackgroundColor: null,
	        plotBorderWidth: null,
	        plotShadow: false,
	        type: 'pie'
	    },
	    title: {
	        text: 'Holdings by Percentage'
	    },
	    tooltip: {
	        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	    },
	    plotOptions: {
	        pie: {
	            allowPointSelect: true,
	            cursor: 'pointer',
	            dataLabels: {
	                enabled: false,
	                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
	                style: {
	                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
	                }
	            }
	        }
	    },
	    series: [{
	        name: 'Cryptos',
	        colorByPoint: true,
	        data: [{
	            name: 'BTC',
	            y: btc_value
	        }, {
	            name: 'ETH',
	            y: eth_value
	        }, {
	            name: 'LTC',
	            y: ltc_value
	        }]
	    }]
	});
}


//Main
get_prices();