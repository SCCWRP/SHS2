var HistoryView = Backbone.View.extend({
	el: '#content',
	template:_.template($('#tpl-history-details').html()),
	initialize: function(){ //this.model.on('change',this.test,this);
		//$(this.el).unbind("click");
		//this.listenTo(this.model, "change", this.render);
		//this.fixData(response);
	},
	events:{
		//"click .history-edit":"editHistory",
		//"click .history-forget":"forgetHistory"
		"click .history-skip":"skipHistory"
	},
    	skipHistory: function(event){
		console.log("skipHistory");
		event.preventDefault();
		appRouter.weekly();
	},
        editHistory: function(event){
		console.log("HistoryView edit");
		event.preventDefault();
		/* find id of question user wants to edit and set qcount to previous */
		console.log(event.currentTarget);
		var clickedID = event.currentTarget.id;
		console.log(clickedID);
		//answerListView = new AnswerListView({model: this.model});
		//answerListView.model.set({ qcount: clickedID, status: "edit"});
		appRouter.navigate('shs2/receipt/' + clickedID, {trigger: true});
	},
	forgetHistory: function(event){
		console.log("ForgetHistory edit");
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
			console.log(this.model.toJSON());
			$.each(response.attributes, function(key, value){
				console.log(value);
				$(this.el).append(this.template(value));	
			});
		        //$(headerView.el).hide();
			//$(this.el).html("");	
			//$(footerView.el).hide();	
			//$(this.el).html(this.template({ 'elements': this.model.attributes }));	
	}
});
