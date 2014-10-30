var AnswerListView = Backbone.View.extend({
	//el: '#content',
	template:_.template($('#tpl-answer-details').html()),
	initialize: function(){
		console.log("AnswerListView");
		// must unbind event before each question or will end up with wrong model
		$(this.el).unbind("click");
		//headerView = new HeaderView;
		//footerView = new FooterView;
		this.listenTo(this.model, 'sync', this.nextQuestion);
		this.listenTo(footerView, 'forward', this.saveAnswer); 
		this.listenTo(footerView, 'back', this.goBack); 
		this.listenTo(this.model, 'change:status', this.nextQuestion);
		this.listenTo(this.model, 'change:type', function() {
			if(["radio"].indexOf(this.model.get('type')) >=  0) {
				$('#forward').hide();
			} else {
				$('#forward').show();
			};
		});
		},
	events:{
		"click .save":"saveAnswer",
		"change select[name=aid]":"saveAnswer",
		/* only necessary for mobile branch */
		//"click #multi-select":"hideFooter",
		//"change #multi-select":"showFooter",
		//"click #aid":"hideFooter",
		//"change #aid":"showFooter",
		/* end mobile branch */
    		"click .decline":"declineAnswer",
    		"click #decline":"declineAnswer",
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
		this.saveAnswer(event, true);
	},
	qHistory: [],
	goBack: function(event){
		index = this.qHistory.pop();
		if(index) {
			this.model.set("qcount", index); 
			this.nextQuestion(this.model);
		} else {
			appRouter.navigate("");
		};
	},
	hideFooter: function(event){
		$("#footer").css('display','none');
		$("#footer").hide();
	},
	showFooter: function(event){
		$('html,body').animate({ scrollTop: '0px' }, 700);
		$("#footer").css('display','inline');
		$("#footer").show();
		appRouter.positionFooter();
	},
	nextQuestion:function(t, response, options){	
		console.log("nextQuestion");
		console.log(this.qHistory);
		var that = this;
		// get current question number
		var nextQcount = t.get("qcount");
		if(nextQcount > this.endquestion) return;
		// changed - to above for receipt
		//var nextQcount = response.qcount;
		//console.log(response.qcount);
     		var questionList = new QuestionList();
		questionList.fetch({success: getQuestion,error: errorQuestion});
		function getQuestion(){
			gotQuestion = questionList.get(nextQcount);
			var fixMenu = gotQuestion.attributes.menu.split(",")
			t.set({	'title': gotQuestion.attributes.title,
				'menu': fixMenu,
				'type': gotQuestion.attributes.type,
				'placeholder': gotQuestion.attributes.placeholder,
				'decline': gotQuestion.attributes.decline});
			questionListView = new QuestionListView({model: gotQuestion});
			questionListView.render();
			//updateProgressBar();
			//that.render();
			$("#content").append(that.render().el);
			updateProgressBar(t);
			//appRouter.resizePage2("content");
			appRouter.css();
			//$(window).scroll(appRouter.positionFooter).resize(appRouter.positionFooter)
		}

		function updateProgressBar(t){
			var modOne = 12;
			var modTwo =16;
			var modThree = 11;
			var modFour = 15;
			var modFive = 5;
			var modSix = 7;
			var nextQcount = t.get("qcount");
			//var totPercentDone = 35;
			//console.log("Variable declared");
			console.log("updateProgressBar");			
			console.log("qcount");
			console.log(nextQcount);
			if (nextQcount < 12) {
				$('#Modprogress-bar').val((nextQcount/modOne)*100);
     			$('#Modprogress-bar').slider('refresh');
			}
			if (nextQcount > 12 && nextQcount <25){				
				$('#Modprogress-bar').val(((nextQcount-12)/modTwo)*100);
     			$('#Modprogress-bar').slider('refresh');
			}
			if (nextQcount > 25 && nextQcount < 34) {
					$('#Modprogress-bar').val(((nextQcount-25)/modThree)*100);
     				$('#Modprogress-bar').slider('refresh');
			}
			if (nextQcount > 34 && nextQcount < 71){
					$('#Modprogress-bar').val(((nextQcount-34)/modFour)*100);
     				$('#Modprogress-bar').slider('refresh');
			}	
			if (nextQcount > 71 && nextQcount < MAXQUESTION){
					$('#Modprogress-bar').val(((nextQcount-71/modFive)*100));
     				$('#Modprogress-bar').slider('refresh');
			}	
			//if(nextQcount > 59){
					//$('#Modprogress-bar').val(((nextQcount-59)/modSix)*100);
     				//$('#Modprogress-bar').slider('refresh');
			//}
			

     		//console.log("Doing Update to slider bar");			
			$('#Fullprogress-bar').val((nextQcount/MAXQUESTION)*100); 			
			//console.log("Refreshing slider bar");
     		$('#Fullprogress-bar').slider('refresh');

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
	extractAnswer: function () {
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
		console.log("currentAnswer: "+ currentAnswer);
	 	return currentAnswer;	
		       },
	saveAnswer:function(event, decline, other){
		console.log("saveAnswer");
		var timer = 0;
		var appID;
		var that = this;
		formtype = this.model.get("type");
		if(other) {
			var currentAnswer = other;
		} else if(!decline) {
			var currentAnswer = this.extractAnswer();
		} else {
			var currentAnswer = "Did not Enter";	
		};
		if(currentAnswer == "Other") {
			return;
		};
		// current question
		var currentQuestion = Number(this.model.get("qcount")); 
		appID = Number(this.model.get("id")); 
	

		// next question  
		var nextQuestion = (currentQuestion + 1);
		// storing userid email and phone
		// set userid for answer also
		//if(currentQuestion == 1){
		//	 this.cleanup();
		//	$("#content").html( new IntroView().render().el );
		//}
		if(currentQuestion == 6 || currentQuestion == 7) {
			currentAnswer = currentAnswer.replace(/\W/g, '');
		};
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
		if([19, 22, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62].indexOf(currentQuestion) > -1  && currentAnswer == "No"){
			nextQuestion += 1;
		};
		if(currentQuestion == 62 && currentAnswer == "No" && _.all(_.map(this.model.pick('q34', 'q36', 'q38', 'q40', 'q42', 'q44', 'q46', 'q50', 'q52',
						'q54', 'q56', 'q58', 'q60' ), function(x) {return x == 'No';}))) {
			nextQuestion += 6;	
		};
		// module3 did not surf
		if(currentQuestion == 25 && currentAnswer == "Did not Enter"){
			nextQuestion +=  7;
		};
		// this should really go somewhere after sync happens maybe next question
		// also status needs to be toggled to complete in database
		if(currentQuestion == 12){
			user.save({ list: "weekly" });
			user.save({ status: "complete" });
		};
		if(currentQuestion ==  this.endquestion){
		//if(currentQuestion == 75){
			this.model.set({ status: "complete" });
			timer = 4;
		};
		// create answerDetails object
		answerDetails = {};
		answerDetails["q"+currentQuestion] = currentAnswer;
		this.model.set("q"+currentQuestion, currentAnswer);
		answerDetails.qcount = nextQuestion;
		if(this.qHistory.indexOf(currentQuestion) == -1)this.qHistory.push(currentQuestion);
		// either set or save here
		//this.model.set(answerDetails, {validate:true});
		//if(timer != 0){ use this code if you want break up modules and then save
		// dump saved answers to json string 
		var parsedJSON = JSON.stringify(this.model.toJSON());
		// need a new column called status in db
		// we are offline


		//status change for module 4 so that follow-up questions can be edited

		if (networkStatus != 'online'){
			//this.model.set(answerDetails);
			this.model.save(answerDetails);
		} else {
			// we are online 
			//this.model.save({qcount: currentQuestion},{ used when useing set and mulitiple save
			//console.log(this.model.toJSON());
			this.model.save(answerDetails, {
				wait: false,
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
					if(timer == 4){
						console.log("timer == 4");
						// clear stage and events
						that.cleanup();
						//appRouter.cleanup();
						// return receipt from database
						appRouter.navigate('shs/receipt/' + appID, {trigger: true});
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
					alert("update record in database");
					console.log(response.responseText);
					console.log(response.status);
					that.cleanup();
					console.log(model);
					model.destroy({remote: false});
					console.log(model);
					//appRouter.navigate("shs2/www", {trigger: true});
					$("#content").html( new IntroView().render().el );
					$("#content").trigger("create");
				  }
       				}
			});
			console.log(this.model);
		}
		}, /* end saveAnswer */
	cleanup: function() {
		console.log("AnswerListView cleanup");
	        this.undelegateEvents();
		this.unbind();
		this.remove();
	},
	render: function(){
		console.log("AnswerListView render");
		$(this.el).html("");
		$(headerView.el).show();
		$(footerView.el).show();
		$(this.el).html(this.template(this.model.toJSON()));
		$('select').on('change', function(s) {
				var selectTarget = $(s.currentTarget);
				if(selectTarget.val() == "Other") {
					$('<div>').simpledialog2({
					    mode: 'button',
				   	    headerText: '',
				   	    headerClose: true,
				    	    buttonPrompt: 'Type your response',
				    	    buttonInput: true,
				    	    buttons : {
				          	'OK': {
					          click: function () { 
							var newoption = $.mobile.sdLastInput;
							$("select").append($("<option></option>").attr("value", newoption).text(newoption));
						       	selectTarget.val(newoption);
							selectTarget.trigger('change');
							}
						},
				    	   }
			 	 	})	
				};
			});
		//$('#multi-view').trigger('create');
		//$("input[type='checkbox']").checkboxradio();
		//$(this.el).trigger('create');
		//console.log(Math.round($('#content').height()));
		return this;
	}
});
