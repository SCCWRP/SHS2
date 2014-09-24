var AnswerListView = Backbone.View.extend({
	el: '#content',
	template:_.template($('#tpl-answer-details').html()),
	initialize: function(){
		// must unbind event before each question or will end up with wrong model
		$(this.el).unbind("click");
		this.listenTo(this.model, 'sync', this.nextQuestion);
		this.listenTo(footerView, 'forward', this.saveAnswer); 
		this.listenTo(this.model, 'change:status', this.nextQuestion);
		//this.listenTo(this.model, 'change:status', this.change);
		//EventBus.on("nextQuestion:view",this.nextQuestion);
	},
	events:{
		//"change":"change",
		"click .save":"saveAnswer",
    		"click .decline":"declineAnswer"
	},
	change:function(event){
		var that = this;
		console.log("change");
		console.log(event);
		that.nextQuestion();
	},
    	declineAnswer:function(event){
		formtype = this.model.get("type");
		$(this.selectorString[formtype]).val(this.model.get("declinedefault"));
		this.saveAnswer(event);
	},
	nextQuestion:function(t, response, options){
		var that = this;
		console.log("nextQuestion");
		// get current question number
		console.log(t);
		console.log(t.get("qcount"));
		var nextQcount = t.get("qcount");
		// changed - to above for receipt
		//var nextQcount = response.qcount;
		//console.log(response.qcount);
     		var questionList = new QuestionList();
		questionList.fetch({success: getQuestion,error: errorQuestion});
		function getQuestion(){
			console.log("getQuestion");
			gotQuestion = questionList.get(nextQcount);
			var fixMenu = gotQuestion.attributes.menu.split(",")
			t.set({'title': gotQuestion.attributes.title,'menu': fixMenu,'type': gotQuestion.attributes.type,'decline': gotQuestion.attributes.decline});
			questionListView = new QuestionListView({model: gotQuestion});
			questionListView.render();
			that.render();
		}
		function errorQuestion(){
			alert("errorQuestion");
		}
    	},
	selectorString: {
				"radio":"#aid input[type = 'radio']:checked",
				"text":"#aid",
				"select":"#aid",
				"multi":"#aid input[type = 'checkbox']:checked",
				"sevenday":"#aid input[type = 'checkbox']:checked",
				"numberSelect":"#aid"
	},
	saveAnswer:function(event){
		console.log("saveAnswer");
		var timer = 0;
		var appID;
		var that = this;
		formtype = this.model.get("type");
		var currentAnswer = $(this.selectorString[formtype]); 
		if(formtype == "multi" || formtype == "sevenday") {
			var temparray = [];
			currentAnswer.map(function () { temparray.push(this.value); });
			currentAnswer = temparray.join();
		} else if(formtype == "numberSelect") {
			currentAnswer = $("select").val() + " : " + currentAnswer.val();
		} else {
			currentAnswer = currentAnswer.val();	
		};
		if(!currentAnswer || currentAnswer == []) {
			currentAnswer = "";
		};
		if(currentAnswer == "Other") {
			currentAnswer = "Other : " + prompt("", "").replace(",", "|");
		};
		console.log("currentAnswer: "+ currentAnswer);
		// current question
		// too slow
		var currentQuestion = Number(this.model.get("qcount")); 
		//console.log("currentQuestion: "+ currentQuestion);
		appID = Number(this.model.get("id")); 
		// next question  
		var nextQuestion = (currentQuestion + 1);
		// storing userid email and phone
		// set userid for answer also
		if(currentQuestion == 6){
			user.save({ phone: currentAnswer }, {
				wait: true,
				success: function(response){
					console.log(user.toJSON());
				},
				error: function(response){
					console.log(response.status);
				}
			});
			// maybe a better place to set userid-uid
			answer.set({uid: USERID});
		}
		if(currentQuestion == 8){
			user.save({ email: currentAnswer }, {
				wait: true,
				success: function(response){
					console.log(user.toJSON());
					//if device save to user key
					userPhoneEmail = '{"email":"'+user.get('email')+'","phone":"'+user.get('phone')+'","id":"'+USERID+'"}';
					var userKey = window.localStorage.getItem("user");
					// add to keychain
					if(userKey != null){
						userKey = ''+userKey+','+USERID+'';
						window.localStorage.setItem("user", userKey);
					} else {
					// new keychain
						window.localStorage.setItem("user", USERID);
					}
					window.localStorage.setItem("user-"+USERID, userPhoneEmail);
					// set userid in database and forms
				},
				error: function(response){
					console.log(response.status);
				}
			});
			//appRouter.navigate('shs2/receipt/' + appID, {trigger: true});
		}
		if(currentQuestion == 12){
			timer = 4;
		}
                // logic for skipping certain questions
		if([22, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62].indexOf(currentQuestion) > -1  && currentAnswer == "No"){
			nextQuestion += 1;
		};
		if(currentQuestion == 25 && currentAnswer == "No"){
			nextQuestion +=  9;
		};
		// this should really go somewhere after sync happens maybe next question
		// also status needs to be toggled to complete in database
		if(currentQuestion == 75){
			timer = 4;
		};
		// create answerDetails object
		answerDetails = {};
		answerDetails["q"+currentQuestion] = currentAnswer;
		this.model.set("q"+currentQuestion, currentAnswer);
		answerDetails.qcount = nextQuestion;
		// either set or save here
		//this.model.set(answerDetails, {validate:true});
		//if(timer != 0){ use this code if you want break up modules and then save
		// dump saved answers to json string 
		var parsedJSON = JSON.stringify(this.model.toJSON());
		// need a new column called status in db
		// we are offline
		if (networkStatus != 'online'){
			//this.model.set(answerDetails);
			this.model.save(answerDetails);
		} else {
			// we are online 
			//this.model.save({qcount: currentQuestion},{ used when useing set and mulitiple save
			//console.log(this.model.toJSON());
			this.model.save(answerDetails, {
				wait: true,
				success: function(model,response){
					console.log("success");
					console.log(model);
					console.log(response);
					//appID = Number(this.model.get("id")); 
					// if module1 - then notify user 
					// ****** notify user - working code ********** //
					//var currentEmail = model.get("q8");
					//app.notify(currentEmail);
					// ******************************************** // 
					// last module - go to receipt
					if(timer == 4){
						// return receipt from database
						appRouter.navigate('shs2/receipt/' + appID, {trigger: true});
					}
					/*
					} else {
						that.getQuestion(that,nextQuestion);
					}
					*/
				},
				error: function(model,response){
	       				console.log("failed");
	       				console.log(response.responseText);
	       				console.log(response.status);
	       				console.log(response.statusText);
       				}
			});
			console.log(this.model);
		}
		}, /* end saveAnswer */
	render: function(){
		$(this.el).html("");
		$(this.el).html(this.template(this.model.toJSON()));
		$('#multi-radio').trigger('create');
		$("input[type='checkbox']").checkboxradio();
		return this;
	}
});
