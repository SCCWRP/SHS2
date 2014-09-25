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
		alert("Answer Start");
		this.on("invalid",function(model,error){
			alert(error);
		});
	},
	defaults: createDefaults(),
	validate: function (attrs){
		for(i=1; i<= MAXQUESTION; i++) {
			var q = "q" + i
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
var validationFuncs = {
	"0": function(q) {if(q == "") return "A response is required before continuing";},
	"1": function(q) {if(q && q.length < 2) return "Invalid phone number";}, 
	"checkq7": function(q, at) {if(q && at.q7 != q) return "Phone number must match";},
	"checkq9": function(q, at) {if(q && at.q8 != q) return "Email must match";},
	"gte1": function(q) {if(q && q.split(" : ")[1] < 1) return "Value must be greater than zero";},
	"isNumber": function(q) {if(q && isNaN(q)) return "Value must be a number";},
	"numberWeek": function(q) {if(q && (isNaN(q.split(" : ")[1]) || q.split(" : ")[1] == "")) return "Value must be a number";}
};
var createValidation = function (questions){
	var valLU = {};
	for(i=0; i< MAXQUESTION; i++) {
		if(!questions[i].hasOwnProperty("check")) {
			questions[i]["check"] = "0";
		};
		var codes = questions[i].check.split(",");
		valLU["q" + (i+1)] = codes.map(function(c) {
			return validationFuncs[c];
		});	
		if(questions[i].errmessage != "") {
			var v = (function() {
				var message = questions[i].errmessage;
				return function(q) {if(q && q == "No") {return message;}}
			})(); 	
			valLU["q" + (i+1)].push(v);
		};
	};
	return valLU;
};

$.ajax({
	url: "questions.json",
	async: false,
	success: function(q) {
		validators = createValidation(q);
	}
})


