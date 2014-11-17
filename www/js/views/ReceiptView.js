var ReceiptView = Backbone.View.extend({
	//el: '#content',
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
		event.preventDefault();
		var that = this;
		/* find id of question user wants to edit and set qcount to previous */
		//console.log(event.currentTarget);
		var clickedID = event.currentTarget.id;
		//console.log(clickedID);
		var fixedID = Number(clickedID.replace('q',''));
		//console.log(fixedID);
		that.cleanup();
		// why are we navigating
		appRouter.navigate('shs/edit/' + fixedID, {trigger: true});
		//footerView = new FooterView;
		//footerView.render();
		//console.log("this model after cleanup: ");
		//console.log(this.model);
		answerListView = new AnswerListView({model: this.model});
		answerListView.endquestion =  event.currentTarget.name; 
		answerListView.model.set({ qcount: fixedID});
		answerListView.nextQuestion(this.model);
	},
	finish: function(event){
		event.preventDefault();
		////console.log("finish");
		var that = this;
		////console.log(this.model.toJSON());
		//appRouter.checksum();
		var survey_type = this.model.get('survey_type');
		if(survey_type == "enrollment"){
			custom_alert("Thank You for Enrolling!", "", done);
			//app.dialog("Thank You for Enrolling!","Enrollment Complete","Ok");
		}
		if(survey_type == "followup"){
			//app.dialog("Come Back Next Week","Weekly Complete","Ok");
			custom_alert("Come Back Next Week", "", done);
		}
		function done () {
			that.cleanup();
			appRouter.navigate('/', {trigger: false});
			location.assign(HOME);
		}
	},
	cleanup: function() {
	     //console.log("receipt cleanup");
	     this.undelegateEvents();
	     this.$el.removeData().unbind();
	     Backbone.View.prototype.remove.call(this);
 	},
	render: function(){
			//console.log("ReceiptView render");
			//console.log(this.model.toJSON());
		        $(headerView.el).hide();
			//$(this.el).html("");	
			$(footerView.el).hide();	
			//footerView.cleanup();
			var receiptData = _.omit(this.model.attributes, 'id', 'user_id');
			$(this.el).append(this.template({ 'elements': receiptData }));	
			//$('#aid').trigger('create');
			return this;
	}
});
