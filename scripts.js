
function test() {
	
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'https://api.kraken.com/0/public/Ticker?pair=XBTUSD');
	xhr.onload = function() {
    	
    	if (xhr.status === 200) {
        	
        	alert(xhr.responseText);
    	}	
	};
	
	xhr.send()
};

test();