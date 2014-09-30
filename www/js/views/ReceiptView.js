var ReceiptView = Backbone.View.extend({
	el: '#content',
	template:_.template($('#tpl-receipt-details').html()),
	initialize: function(){ //this.model.on('change',this.test,this);
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
		var fixedID = Number(clickedID.replace('q',''));
		appRouter.navigate('edit', {trigger: true});
		answerListView.model.set({ qcount: fixedID, status: "edit"});
		answerListView.render();
		$(headerView.el).show();
		$(footerView.el).show();
	},
	finish: function(){
		// get contact id
		console.log("finish");
		console.log(this.model.toJSON());
		var email = this.model.get('contact');
		var id = this.model.get('user_id');
		var survey_type = this.model.get('survey_type');
		//appRouter.checksum();
		//console.log(email);
		//console.log(id);
		console.log(survey_type);
		if(survey_type == "enrollment"){
			// email user welcome message
			app.notify(email,id);
			alert("Thank you for enrolling!");
		}
		if(survey_type == "followup"){
			alert("Come back next week!");
		}
		appRouter.navigate('intro', {trigger: true});
	},
	render: function(){
			console.log("ReceiptView render");
			console.log(this.model.toJSON());
			$(this.el).html("");	
		        //$(headerView.el).hide();
			//$(footerView.el).hide();	
			var receiptData = _.omit(this.model.attributes, 'id', 'contact', 'user_id', 'q9', 'q7')
			$(this.el).html(this.template({ 'elements': receiptData }));	
			//$(this.el).html(this.template({ 'elements': this.model.toJSON() }));
	}
});
