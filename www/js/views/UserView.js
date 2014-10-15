var UserView = Backbone.View.extend({
	el: '#content',
	template:_.template($('#tpl-intro-details').html()),
	initialize: function(){
	},
	render: function(){
		console.log("userview render");
		$(this.el).html("");
		$(this.el).html(this.template());	
	}
});