var createDefaults =  function() {
	var df = {};
	for(i=1; i<= MAXQUESTION; i++) {
		df["q" + i] = null;
	};
	df["uid"] = null;
	return df;
}

var Answer = Backbone.Model.extend({
	initialize: function(){
		this.on("invalid",function(model,error){
			alert(error.phone);
			alert(error.length);
		});
	},
	defaults: createDefaults(),
    	validator: function(attr, qid, funcs){
		funcs.map(function(f) {
			return f(attr[qid]);
		});
	},
	validate: function (attrs){
		/* error checking/validation code placement - example for question6 */
		var errors = this.errors = {};
		if(attrs.q6 && attrs.q6 == ""){ errors.phone = 'phone is required'; }
		if(attrs.q6 && attrs.q6.length < 2){ errors.length = 'phone has minimum'; }
		if(!_.isEmpty(errors)) return errors;
	}
});

var validationFuncs = {
	notNull: function(q) {if(q && q == "") return "A response is required before continuing";},
	phoneLength: function(q) {if(q && q.length < 2) return "Invalid phone number";} 
};

/*
function makeValidator() {
	// First, create validation look up object
	var questions = {};
	(function() {
		$.ajax({
			url:"questions.json",
			dataType: 'json',
			async: false,
			success: function(qjson){
				questions = qjson;
			})
	}());
	var valLU = {};
	for(i=0; i < MAXQUESTION; i++) {
		var vs = questions[i].checks.split(",");
		// add validation checks to function array
		valLU["q" + i]  = vs.map(function (v) {return validationFuncs[v];});
		// add default validator, if one is needed
		if(questions[i].errmessage != "") {
			var defaultvalid= function () {
				var msg = questions[i].errmessage;	
				return function(q) {if(q && q == "no") return msg;};
			}();
			valLU["q" + i].push(defaultvalid); 
		};	
	};	
	// Return function closure that references LU object
	return function(attrs) {
		var errors = [];
		for(key in valLU) {
			var err = valLU[key].map(function(f) {return f(attrs[key]);});
			err.each(function(e) {
				if(e) {
					errors.push(e);
			}});
		};
		if(errors.length > 0) return errors;
	};	
};

var validator = makeValidator();
*/
