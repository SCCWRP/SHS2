var HistoryView = Backbone.View.extend({
	template:_.template($('#tpl-history-details').html()),
	events:{
		"click .edit":"editHistory",
		"click .forget":"forgetHistory",
		"click #finish":"skipHistory"
	},
    	skipHistory: function(event){
		console.log("skipHistory");
		event.preventDefault();
		$(this.el).empty();
		appRouter.weekly();
	},
        editHistory: function(event){
		console.log("HistoryView edit");
		event.preventDefault();
		$(this.el).empty();
		/* find id of question user wants to edit and set qcount to previous */
		var clickedID = jQuery.trim(event.currentTarget.id);
		var leaveoff = new Receipt({id: clickedID});
		leaveoff.fetch({wait: true, success: recreateSurvey, error: errorMessage});
		function recreateSurvey () {
			var answerList = new AnswerList(new Answer());
			answerListView = new AnswerListView({model: answerList.first()});
			answerListView.endquestion = leaveoff.get("survey_type") == "enrollment" ? 76 : 71;
			answerListView.model.set(leaveoff.attributes);
			answerListView.nextQuestion(answerListView.model);	
		};
	 	function errorMessage(model,response){
			console.log(model);
			console.log(response);
			console.log("edit history failed");
	 	};
	},
	forgetHistory: function(event){ //needs to set status field to 'forget'
		console.log("forget");
		var that = this;
		var clickedID = event.currentTarget.id;
		var answer = new AnswerList(new Answer({id: clickedID}));
		answer = answer.first();
		answer.fetch({success: forget, error: errorMessage});
		function forget () {
			answer.save({'status': 'forget'});
			$(event.currentTarget).parent().remove();
		};
	 	function errorMessage(model,response){
			console.log(response.responseText);
			console.log(response.status);
			console.log("forget history failed");
	 	};
	},
	render: function(response){
			console.log("HistoryView render");
			console.log(this.model);
			$(headerView.el).hide();
			$(this.el).html("");	
			$(footerView.el).hide();	
			$(this.el).html(this.template({ 'elements': this.model.attributes }));		
			return this;
	}
});
