var ReceiptView = Backbone.View.extend({
	el: '#content',
	template:_.template($('#tpl-receipt-details').html()),
	initialize: function(){
		//this.model.on('change',this.test,this);
		this.listenTo(this.model, "change", this.render);
	},
	events:{
		"click .finish":"finish"
	},
	finish: function(){
       		//appRouter.navigate('start', {trigger: true});
		appRouter.start();
	},
	render: function(){
			console.log("ReceiptView render");
			//console.log(this.model.toJSON());
			$(this.el).html("");	
			$(this.el).html(this.template(this.model.toJSON()));	
	}
});
