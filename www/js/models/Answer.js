var Answer = Backbone.Model.extend({
	initialize: function(){
		this.on("invalid",function(model,error){
			alert(error.phone);
			alert(error.length);
		});
	},
	defaults: {
q1 : null,
    q2 : null,
    q3 : null,
    q4 : null,
    q5 : null,
    q6 : null,
    q7 : null,
    q8 : null,
    q9 : null,
    q10 : null,
    q11 : null,
    q12 : null,
    q13 : null,
    q14 : null,
    q15 : null,
    q16 : null,
    q17 : null,
    q18 : null,
    q19 : null,
    q20 : null,
    q21 : null,
    q22 : null,
    q23 : null,
    q24 : null,
    q25 : null,
    q26 : null,
    q27 : null,
    q28 : null,
    q29 : null,
    q30 : null,
    q31 : null,
    q32 : null,
    q33 : null,
    q34 : null,
    q35 : null,
    q36 : null,
    q37 : null,
    q38 : null,
    q39 : null,
    q40 : null,
    q41 : null,
    q42 : null,
    q43 : null,
    q44 : null,
    q45 : null,
    q46 : null,
    q47 : null,
    q48 : null,
    q49 : null,
    q50 : null,
    q51 : null,
    q52 : null,
    q53 : null,
    q54 : null,
    q55 : null,
    q56 : null,
    q57 : null,
    q58 : null,
    q59 : null,
    q60 : null,
    q61 : null,
    q62 : null,
    q63 : null,
    q64 : null,
    q65 : null,
    q66 : null,
    q67 : null,
    q68 : null,
    q69 : null,
    q70 : null,
    q71 : null,
    q72 : null,
    q73 : null,
    q74 : null,
    q75 : null,
    uid : null
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
