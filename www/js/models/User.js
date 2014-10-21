var User = Backbone.Model.extend({
	initialize: function(){
            //alert("Welcome to User Login");
        },
        // critical - urlRoot must be used to make get,post,put requests not url
        urlRoot:"http://data.sccwrp.org/shs/index.php/user"
});
