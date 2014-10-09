var QuestionList = Backbone.Collection.extend({
	initialize: function(){
		//this.on('sync',this.getQuestion,this);
	},
    	getQuestion: function(){
		//console.log("getQuestion");
		var that = this;
		var valLU = {};
		var validationFuncs = {
			"0": function(q) {if(q == "") return "A response is required before continuing";},
			"select": function(q) {if(q && q == "Select One") return "A response is required before continuing";},
			"1": function(q) {if(q && q.length < 2) return "Invalid phone number";}, 
			"checkq7": function(q, at) {if(q && at.q6 != q) return "Phone number must match";},
			"checkq9": function(q, at) {if(q && at.q8 != q) return "Email must match";},
			"gte1": function(q) {if(q && q.split(" : ")[1] < 1) return "Value must be greater than zero";},
			"isNumber": function(q) {if(q && isNaN(q)) return "Value must be a number";},
			"numberWeek": function(q) {if(q && (isNaN(q.split(" : ")[1]) || q.split(" : ")[1] == "")) return "Value must be a number";},
			"selectOne": function(q){if(q && _.values(JSON.parse(q)).filter(function(x) {return x == "Select One";}).length > 0) return "You must select an answer for all days";}
		};
		var createValidation = function (questions){
		  for(i=0; i< MAXQUESTION; i++) {
			var thismod =  that.models[i].attributes; 
			if(!thismod.hasOwnProperty("check")) {
				thismod["check"] = "0";
			};
			var codes = thismod.check.split(",");
			valLU["q" + (i+1)] = codes.map(function(c) {
				return validationFuncs[c];
			});	
			if(thismod.errmessage != "") {
				var v = (function() {
					var message = thismod.errmessage;
					return function(q) {if(q && q == "No") {return message;}}
				})(); 	
				valLU["q" + (i+1)].push(v);
			};
	  	  };
		  return valLU;
		};
		validators = createValidation(this);
		//console.log(validators);
        },
	model: Question,
	url: 'questions.json'
});
