var MapView = Backbone.View.extend({
	//el: '#content',
	template:_.template($('#tpl-map-details').html()),
	initialize: function(){
		this.render();
	},
	render: function(){
		console.log("map");
		$("#landing").hide();
		$(headerView.el).show();
		$('#question').html("Map");
		$(this.el).html("");
		$(this.el).html(this.template());	
		map = new google.maps.Map(document.getElementById("map-canvas-test"), { zoom: 12, center: {lat: 32.7663694, lng: -117.2592576} });
		return this;
	}
});
