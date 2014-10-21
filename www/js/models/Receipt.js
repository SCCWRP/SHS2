var Receipt = Backbone.Model.extend({
	urlRoot: 'http://data.sccwrp.org/shs/index.php/surveys',
    	/* critical - backbone by default will not replace client side attributes with server response
		https://github.com/jashkenas/backbone/issues/1069
	   instead we will return the response.event object to our model which will replace those client attributes
	*/
    	parse: function(response){
		//console.log(response);
		//return response.event - old way
		return response;
	}

});
