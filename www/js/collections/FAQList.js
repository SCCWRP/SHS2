var FAQList = Backbone.Collection.extend({
	model: FAQ,
	url: "faq.json",
    	/*
    	parse: function(response){
		console.log(response);
      		return response;
        }
	*/
});
