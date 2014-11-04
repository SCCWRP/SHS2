var HistoryView = Backbone.View.extend({
	//el: '#content',
	template:_.template($('#tpl-history-details').html()),
	initialize: function(){ //this.model.on('change',this.test,this);
		//$(this.el).unbind("click");
		//this.listenTo(this.model, "change", this.render);
		//this.fixData(response);
	},
	events:{
		"click .edit":"editHistory",
		"click .forget":"forgetHistory",
		"click #finish":"skipHistory"
	},
    	skipHistory: function(event){
		console.log("skipHistory");
		event.preventDefault();
		//$("#content").empty();
		$(this.el).empty();
		appRouter.weekly();
	},
        editHistory: function(event){
		console.log("HistoryView edit");
		event.preventDefault();
		//$("#content").empty();
		$(this.el).empty();
		/* find id of question user wants to edit and set qcount to previous */
		var clickedID = jQuery.trim(event.currentTarget.id);
		console.log(clickedID);
		var leaveoff = new Receipt({id: clickedID});
		console.log(leaveoff.url());
		leaveoff.fetch({wait: true, success: recreateSurvey, error: errorMessage});
		function recreateSurvey () {
			var answerList = new AnswerList(new Answer());
			answerListView = new AnswerListView({model: answerList.first()});
			answerListView.endquestion = 70;
			answerListView.model.set(leaveoff.attributes);
			/*var qmodel = _.map(answerListView.model.attributes, function(v, k) {
				if(v && k.indexOf('q') > -1) {
					return Number(k.replace('q', ''));
				} else {
					return 0;
				};	
			});
			var returnQ = Math.max.apply(null, qmodel); 
			if(returnQ == 0) {
				returnQ =+ 1;
			};
			answerListView.model.set('qcount', returnQ);
			*/
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
		console.log("ForgetHistory edit");
		var clickedID = event.currentTarget.id;
		console.log(clickedID);
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
	fixData: function(response){
		console.log("fixData");
		//console.log(response);
		$.each(response.attributes, function(key, value){
			//var unixTimestamp = response.attributes[key].timestamp;
			//console.log(unixTimestamp);
		});
	},
	render: function(response){
			console.log("HistoryView render");
			console.log(this.model);
			/*
		 	$(this.el).append("<ul id='aid' data-role='listview'>Under Construction/Read-Only<br><input type='button' value='Continue' class='history-skip'/ ><li>test</li>");
			$.each(this.model.attributes, function(key, value){
				console.log(value);
				//$(this.el).append(this.template(value));	
				//console.log(this.model.attributes[key].timestamp);
			 	var unixTimestamp = response.attributes[key].timestamp;
			 	var returnTime = new Date(+unixTimestamp);
			 	var qtext = "Session "+ returnTime.toLocaleString() + " was saved would you like to <input type='button' id='"+response.attributes[key].id+"' value='Edit' class='history-edit'/ > or <input type='button' id='"+response.attributes[key].id+"'value='Forget' class='history-forget'/ >?"; 
	 	 		$(this.el).append("<li>"+qtext+"</li>");
			});
			*/
		        $(headerView.el).hide();
			$(this.el).html("");	
			$(footerView.el).hide();	
			$(this.el).html(this.template({ 'elements': this.model.attributes }));		
			return this;
	}
});
