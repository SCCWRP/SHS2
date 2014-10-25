var FooterView = Backbone.View.extend({
	el: '#footer',
	template:_.template($('#tpl-footer-details').html()),
	initialize: function(){
		this.render();
	},
    	events: {
		"click #back": "back",
		"click #forward": "forward",
		"click #restart": "restart",
		"click #restartCancel": "cancel",
		"click #restartRestart": "reload"
	},
    	back: function (e) { 
	  	e.preventDefault();
		this.trigger("back");
	},
    	forward: function (e) { 
	  	e.preventDefault();
		this.trigger("forward");
	},
    	restart: function (e) { 
	  e.preventDefault();
	  $("#popupRestart").html( new RestartView().render().el );
	  //$("#popupRestart").popup({ create: function(e,u){ alert("create"); }});
	  $("#popupRestart").trigger("create");
	  $("#popupRestart").popup("open");
	  //$("#popupRestart").on({ "popupafteropen", function(event,ui){ alert(event); alert(ui); }});
	},
	render: function(){
		console.log("footer");
		$(this.el).html("");
		$(this.el).html(this.template());	
		$('#footer').trigger('create');
		return this;
	}
});
