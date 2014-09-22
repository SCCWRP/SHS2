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
		answer.set({ qcount: fixedID });
		//console.log(answer);
		answer.set({ status: "edit" });
		//EventBus.trigger("nextQuestion:view");
	},
	finish: function(){
       		//appRouter.navigate('start', {trigger: true});
		appRouter.checksum();
		alert("Come back next week!");
		appRouter.start();
	},
	render: function(){
			console.log("ReceiptView render");
			console.log(this.model.toJSON());
			$(this.el).html("");	
			$(this.el).html(this.template({ 'elements': this.model.toJSON() }));	
	}
});
