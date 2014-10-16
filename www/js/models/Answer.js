var createDefaults =  function() {
	var df = {};
	for(i=1; i<= MAXQUESTION; i++) {
		df["q" + i] = null;
	};
	df["user_id"] = null;
	return df;
}
var Answer = Backbone.Model.extend({
	initialize: function(){
                this.on("invalid",function(model,error){
		        alert(error);
	        });
	},
	defaults: createDefaults(),
	validate: function (attrs){
		for(i=1; i<= MAXQUESTION; i++) {
			var q = "q" + i;
			var outcome = validators[q].map(function(f) {
				return f(attrs[q], attrs);
			});
			var outcome = outcome.filter(function(x){return x != undefined;});
			if(outcome.length > 0){
				var oneerror = outcome[0];
				return oneerror;
			};
		};
	}
});
