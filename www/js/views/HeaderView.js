var HeaderView = Backbone.View.extend({
	el: '#header',
	template:_.template($('#tpl-header-details').html()),
	initialize: function(){
		this.render();
	},
	render: function(){
		$(this.el).html("");
		$(this.el).html(this.template());	
		$('#header').trigger('create');
	}
});