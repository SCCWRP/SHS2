var History = Backbone.Model.extend({
	urlRoot: "http://data.sccwrp.org/shs/index.php/history",
    	/* critical - backbone by default will not replace client side attributes with server response
		https://github.com/jashkenas/backbone/issues/1069
	   instead we will return the response.event object to our model which will replace those client attributes
	*/
    	parse: function(response){
		//return response.event;
		return response;
	}
});
