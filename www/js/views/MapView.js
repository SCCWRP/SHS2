var MapView = Backbone.View.extend({
	el: '#content',
	template:_.template($('#tpl-map-details').html()),
	initialize: function(){
		this.render();
	},
	render: function(){
		console.log("map");
		$(headerView.el).show();
		$('#question').html("Map");
		$(this.el).html("");
		$(this.el).html(this.template());	
	}
});
