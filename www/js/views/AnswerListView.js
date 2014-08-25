var AnswerListView = Backbone.View.extend({
	el: '#content',
	template:_.template($('#tpl-answer-details').html()),
	initialize: function(){
		// must unbind event before each question or will end up with wrong model
		$(this.el).unbind("click");
		//this.model.on("change", this.change, this);
		this.model.on('change', function(model){
			console.log('change', model.toJSON());
		});
	},
	events:{
		//"change":"change",
		"click .save":"saveAnswer"
	},
	change:function(event){
		//console.log("changing "+ target.id + ' from: ' + target.defaultValue +'"');
		console.log("change");
	},
	saveAnswer:function(event){
		console.log("saveAnswer");
		var timer = 0;
		var appID;
		var that = this;
		//console.log("changing "+ target.id + ' from: ' + target.defaultValue +'"');
		// current answer
		//console.log(this.model.get("qcount"));
		var currentAnswer = $('#aid').val();
		//console.log("currentAnswer: "+ currentAnswer);
		// current question
		// too slow
		//var currentQuestion = Number(this.model.get("qcount")); 
		//console.log("currentQuestion: "+ currentQuestion);
		appID = Number(this.model.get("id")); 
		//console.log("appID: "+ appID);
		var currentQuestion = (Number($('#qid').val()));
		// next question  
		var nextQuestion = (currentQuestion + 1);

                // logic for skipping certain questions
		if(currentQuestion == 7 && currentAnswer == "phone") {
			alert("phone answer");
			nextQuestion = nextQuestion + 2;
		};

		// create answerDetails object
		answerDetails = {};
		answerDetails["q"+currentQuestion] = currentAnswer;
		answerDetails.qcount = nextQuestion;
			
		// either set or save here
		//this.model.save({q1: "test"}, { 
		//this.model.set(answerDetails, {validate:true});
		//if(timer != 0){ use this code if you want break up modules and then save
		//window.localStorage.clear();
		console.log(this.model.toJSON());
		// dump saved answers to json string 
		var parsedJSON = JSON.stringify(this.model.toJSON());
		// need a new column called status in db
		//  are we online or offline 
		// we are offline
		//if (connectionStatus != 'online'){
			// create unique key for web session 
			//var sessionKey = "key-" + SESSIONID + "-" + timer;
			var sessionKey = "key-" + SESSIONID;
			// are there any other keys on the key chain 
			var keyStorage = window.localStorage.getItem("key-chain");
			if (keyStorage != null && currentQuestion == 1){
				//alert("The following sessions are saved " + keyStorage);
				// yes other keys add new key to key chain 
				keyStorage = ""+ keyStorage +","+ sessionKey +"";
			} else {
				// no first key on key chain 
				var keyStorage = ""+ sessionKey +"";
			}	
			// save key chain to local database 
			window.localStorage.setItem("key-chain", keyStorage);
			// save new key to local database 
			window.localStorage.setItem(""+ sessionKey +"", parsedJSON);
			var currentStorage = window.localStorage.getItem("key-chain");
			//alert("Test pull on : "+ currentStorage);	
		//} else {
			// we are online 
			//this.model.save({qcount: currentQuestion},{ used when useing set and mulitiple save
			//console.log(this.model.toJSON());
			this.model.save(answerDetails, {
				wait: true,
				success: function(model,response){
					console.log("success");
					//console.log(model.get("id"));
					//appID = Number(this.model.get("id")); 
					// if module1 - then notify user 
					// ****** notify user - working code ********** //
					//var currentEmail = model.get("q8");
					//app.notify(currentEmail);
					// ******************************************** // 
					// last module - go to receipt
					if(timer == 4){
						// return receipt from database
						//app.receipt();
						appRouter.navigate('shs2/receipt/' + appID, {trigger: true});
					} else {
						that.getQuestion(that,nextQuestion);
					}
				},
				error: function(model,response){
	       				console.log("failed");
	       				console.log(response.responseText);
	       				console.log(response.status);
	       				console.log(response.statusText);
       				}
			});
			//} // close else
			//} // timer if - remove to enable module save
			// last module - go to receipt
			//this.getQuestion(nextQuestion);
			// call lookup after database save
			//app.lookup();
			// set/save telephone/email fields to database
			// when finished with all questions check users record in database and present to viewer
			// then send user an email notification welcoming them to the study
			//app.receipt();
			//app.notify();
			//appRouter.navigate('shs2/question/' + appID + '/' + nextQuestion, {trigger: true});
			/* set timer back to 0 */
			//timer = 0;
		}, /* end saveAnswer */
	getQuestion: function(t,nq){
		//console.log("getQuestion");
     		//console.log(t.model.get("id"));
	     	var questionList = new QuestionList();
	     	questionList.fetch({
			success: function(response){
				question = questionList.get(nq);
				var type = question.attributes.type;
				var menu = question.attributes.menu.split(","); //menu options in JSON are in one string
				questionListView = new QuestionListView({model: question});
				questionListView.render();
				t.render(type, menu); // this render is called starting from the second question.
						      // render is called the first time from the router
			},
			error: function(response){
				console.log("questionList Failed");
			}
		});
	},
	render: function(form_type, menu_opts){
		//this is to substitute in menu options for the the first question when sent from the router
		if(menu_opts == "test") { 
			menu_opts = ['Yes', 'No'];
		};
		$(this.el).html("");
		this.model.set({"type":form_type, "menu":menu_opts});
		$(this.el).html(this.template(this.model.toJSON()));	
		$('#multi-radio').trigger('create');
		return this;
	}
});
