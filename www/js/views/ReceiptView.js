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
		clickedID = event.target.id;
		var fixedID = Number(clickedID.replace('q',''));
		appRouter.navigate('edit', {trigger: true});
		answerListView.model.set({ qcount: fixedID, status: "edit" });
		answerListView.render();
		$(headerView.el).show();
		$(footerView.el).show();
		//alert((--fixedID));
		this.model.set({ qcount: fixedID });
		console.log(answer);
		console.log(this.model);
		this.model.set({ status: "edit" });
		//EventBus.trigger("nextQuestion:view");
	},
	finish: function(event){
		//this.model.save({ status: "complete" });
       		//appRouter.navigate('start', {trigger: true});
		// get contact id
		var femail = this.model.attributes.contact;
		var fid = this.model.attributes.uid;
		//appRouter.checksum();
		//console.log(femail);
		//console.log(fid);
		app.notify(femail,fid);
		alert("Come back next week!");
		//appRouter.start();
		// navigate may not be correct
		appRouter.navigate('', {trigger: true});
	},
	render: function(){
			console.log("ReceiptView render");
			$(this.el).html("");	
		        $(headerView.el).hide();
			$(footerView.el).hide();	
			var receiptData = _.omit(this.model.attributes, 'id', 'contact', 'uid', 'q9', 'q7')
			$(this.el).html(this.template({ 'elements': receiptData }));	
	}
});
