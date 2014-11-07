var User = Backbone.Model.extend({
	initialize: function(){
        },
        // critical - urlRoot must be used to make get,post,put requests not url
    	urlRoot: "http://shs.sccwrp.org/shs2/index.php/user"
});
