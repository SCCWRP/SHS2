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
		var that = this;
                this.on("invalid",function(model,error){
			that.set(that.rollback, {validate: false});
		        alert(error);
	        });
	},
	defaults: createDefaults(),
    	rollback: {},
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
			} 
		};
		this.rollback = attrs;
	}
});
