var ContactView = Backbone.View.extend({
	el: '#content',
	template:_.template($('#tpl-contact-details').html()),
	initialize: function(){
		this.render();
	},
	render: function(){
		console.log("contact");
		$(this.el).html("");
		$(this.el).html(this.template());	
	}
});
