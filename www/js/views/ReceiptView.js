var ReceiptView = Backbone.View.extend({
	el: '#content',
	template:_.template($('#tpl-receipt-details').html()),
	initialize: function(){ //this.model.on('change',this.test,this);
		//$(this.el).unbind("click");
		this.listenTo(this.model, "change", this.render);
	},
	events:{
		"click .finish":"finish",
		"click .edit":"edit"
	},
        edit: function(event){
		/* find id of question user wants to edit and set qcount to previous */
		console.log(event.currentTarget);
		var clickedID = event.currentTarget.id;
		console.log(clickedID);
		var fixedID = Number(clickedID.replace('q',''));
		appRouter.navigate('shs2/edit/' + fixedID, {trigger: true});
		answerListView = new AnswerListView({model: this.model});
		answerListView.model.set({ qcount: fixedID, status: "edit"});
	},
	finish: function(){
		console.log("finish");
		//console.log(this.model.toJSON());
		//appRouter.checksum();
		var survey_type = this.model.get('survey_type');
		if(survey_type == "enrollment"){
			var email = this.model.get('contact');
			var id = this.model.get('user_id');
			// email user welcome message
			app.notify(email,id);
			alert("Thank you for enrolling!");
		}
		if(survey_type == "followup"){
			alert("Come back next week!");
		}
		appRouter.navigate('shs2/home/', {trigger: true});
		//appRouter.navigate('intro', {trigger: true});
	},
	render: function(){
			console.log("ReceiptView render");
			console.log(this.model.toJSON());
			$(this.el).html("");	
		        $(headerView.el).hide();
			$(footerView.el).hide();	
			var receiptData = _.omit(this.model.attributes, 'id', 'user_id', 'q9', 'q7','survey_type')
			$(this.el).html(this.template({ 'elements': receiptData }));	
	}
});
