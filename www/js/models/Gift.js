var Gift = Backbone.Model.extend({
	urlRoot: "http://shs.sccwrp.org/shs2/index.php/gift",
    	/* critical - backbone by default will not replace client side attributes with server response
		https://github.com/jashkenas/backbone/issues/1069
	   instead we will return the response.event object to our model which will replace those client attributes
	*/
    	parse: function(response){
		return response;
	}
});
