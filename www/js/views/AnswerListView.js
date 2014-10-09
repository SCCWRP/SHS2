var AnswerListView = Backbone.View.extend({
	el: '#content',
	template:_.template($('#tpl-answer-details').html()),
	initialize: function(){
		// must unbind event before each question or will end up with wrong model
		$(this.el).unbind("click");
		this.listenTo(this.model, 'sync', this.nextQuestion);
		this.listenTo(footerView, 'forward', this.saveAnswer); 
		this.listenTo(this.model, 'change:status', this.nextQuestion);
	},
	events:{
		"click .save":"saveAnswer",
    		"click .decline":"declineAnswer",
    		"change input[type=radio]":"saveAnswer"
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
		if(nextQcount > MAXQUESTION) return;
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
			updateProgressBar();
			that.render();
			appRouter.css();
		}
		function updateProgressBar(){
			console.log("updateProgressBar");
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
				"numberSelect":"#aid",
				"dateSelect":"[id=aid]",
				"dateTimeInterval":"[id=aid]"
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
		} else if(formtype == "dateSelect") {
			var locations = currentAnswer.map(function(x) {return $(this).val() });
			var dates = $("[id=date]").map(function(x) {return this.textContent });
			var dateSelectAnswer = {};
			for(i=0; i < dates.length; i++) {
				dateSelectAnswer[dates[i]] = locations[i];
			};			
			currentAnswer = JSON.stringify(dateSelectAnswer);
		} else if(formtype == "dateTimeInterval") {
			currentAnswer = currentAnswer.map(function(x) {return $(this).val() });
			var start = currentAnswer.filter(function(x,i) {return x % 2 == 0});
			var end  = currentAnswer.filter(function(x,i) {return x % 2 != 0});
			var intervals = _.zip(start, end).map(function(x) {return x.join("-");});
			var dates = $("[id=date]").map(function(x) {return this.textContent });
			var dateSelectAnswer = {};
			for(i=0; i < dates.length; i++) {
				dateSelectAnswer[dates[i]] = intervals[i];
			};			
			currentAnswer = JSON.stringify(dateSelectAnswer);
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
			// CRITICAL - need to add error checking for existing user account
			user.save({ phone: currentAnswer }, {
				wait: true,
				success: function(response){
					console.log(user.toJSON());
				},
				error: function(model, response){
				  if(response.status == 500){
					console.log("failed");
					alert("Phone number already exists in database! Please login instead.");
					console.log(response.responseText);
					console.log(response.status);
					loginView = new LoginView;
				  }
				}
			});
			// maybe a better place to set userid-uid
			this.model.set({"user_id": USERID});
			this.model.set("q7", currentAnswer);
		}
		if(currentQuestion == 8){
			// CRITICAL - need to add error checking for existing user account
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
				  if(response.status == 500){
					console.log("failed");
					alert("Email address already exists in database! Please login instead.");
					console.log(response.responseText);
					console.log(response.status);
					loginView = new LoginView;
				  }
				}
			});
			this.model.set("q9", currentAnswer);
			//appRouter.navigate('shs2/receipt/' + appID, {trigger: true});
		}
		if(currentQuestion == 11){
			var setContact = this.model.get('contact');
			user.save({ "contact": setContact, "status": "complete" });
		}
                // logic for skipping certain questions
		if([22, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62].indexOf(currentQuestion) > -1  && currentAnswer == "No"){
			nextQuestion += 1;
		};
		if(currentQuestion == 25 && currentAnswer == ""){
			nextQuestion +=  9;
		};
		// this should really go somewhere after sync happens maybe next question
		// also status needs to be toggled to complete in database
		if(currentQuestion == 12){
			user.save({ list: "weekly" });
			user.save({ status: "complete" });
		};
		if(currentQuestion ==  MAXQUESTION){
		//if(currentQuestion == 75){
			this.model.set({ status: "complete" });
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
					//appID = Number(this.model.get("id")); 
					// if module1 - then notify user 
					// ****** notify user - working code ********** //
					//var currentEmail = model.get("q8");
					//app.notify(currentEmail);
					// ******************************************** // 
					// last module - go to receipt
					if(timer == 4 || that.model.get("status") == "edit"){
						// clear stage and events
						//that.cleanup();
						appRouter.cleanup();
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
				  if(response.status == 500){
					console.log("failed");
					alert("Phone/Email address already exists in database! Please login instead.");
					console.log(response.responseText);
					console.log(response.status);
					loginView = new LoginView;
				  }
       				}
			});
			console.log(this.model);
		}
		}, /* end saveAnswer */
	/*
	cleanup: function() {
	     console.log("cleanup");
	     this.undelegateEvents();
	     //$(this.el).html("");
 	},
	*/
	render: function(){
		$(this.el).html("");
		$(headerView.el).show();
		$(footerView.el).show();
		$(this.el).html(this.template(this.model.toJSON()));
		$('#multi-radio').trigger('create');
		$("input[type='checkbox']").checkboxradio();
		return this;
	}
});
