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
		//alert($(event.target).text());
		//alert(event.target.id);
		/* find id of question user wants to edit and set qcount to previous */
		clickedID = event.target.id;
		var fixedID = Number(clickedID.replace('q',''));
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
			console.log(this.model.toJSON());
			$(this.el).html("");	
			$(this.el).html(this.template({ 'elements': this.model.toJSON() }));	
	}
});
