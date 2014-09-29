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
		var femail = this.model.get('contact');
		var fid = this.model.get('uid');
		//appRouter.checksum();
		console.log(femail);
		console.log(fid);
		app.notify(femail,fid);
		alert("Come back next week!");
		appRouter.navigate('intro', {trigger: true});
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
