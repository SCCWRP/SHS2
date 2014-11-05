var User = Backbone.Model.extend({
    	urlRoot: "http://54.187.64.245/shs2/index.php/user",
	initialize: function(){
            //alert("Welcome to User Login");
        }
        // critical - urlRoot must be used to make get,post,put requests not url
});
