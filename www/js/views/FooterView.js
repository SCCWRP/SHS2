var FooterView = Backbone.View.extend({
	el: '#footer',
	template:_.template($('#tpl-footer-details').html()),
	initialize: function(){
		this.render();
	},
    	events: {
		"click #back": "back",
		"click #forward": "forward"
	},
    	back: function (e) { 
		this.trigger("back");
	},
    	forward: function (e) { 
		this.trigger("forward");
	},
	render: function(){
		console.log("footer");
		$(this.el).html("");
		$(this.el).html(this.template());	
		$('#footer').trigger('create');
	}
});
