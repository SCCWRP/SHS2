var IntroView = Backbone.View.extend({
	//el: '#landing',
	template:_.template($('#tpl-intro-details').html()),
	initialize: function(){
	},
	events:{
		"click #landingSurvey":"showLogin",
		"click #landingSurf":"showMap",
		"click #landingContact":"showContact",
		"click #landingFAQ":"showFAQ"
	},
	showContact: function(){
		headerView = new HeaderView;
		contactView = new ContactView;
	},
	showFAQ: function(){
		console.log("showFAQ");
		headerView = new HeaderView;
		var faqList = new FAQList();
		faqList.fetch({success: successMessage, error: errorMessage});
		function successMessage(model,response){
			$("#content").html( new FAQView({model: faqList}).render().el );
			appRouter.css();
		}
		function errorMessage(model,response){
		 	console.log("faq failed fetch");
		 	console.log(response);
		}
	},
	showLogin: function(){
		//$("#landing").hide();
		this.cleanup();
		headerView = new HeaderView;
		$("#home").show();
		footerView = new FooterView;
		$("#popupInfo").html( new LoginView().render().el );
		$("#popupInfo").trigger("create");
		$("#popupInfo").popup("open");
		$('#popupInfo').popup('reposition', 'positionTo: window');
		appRouter.css();
	},
	showMap: function(){
	  if (networkStatus != 'offline'){
		headerView = new HeaderView;
		mapView = new MapView;
	  } else { 
		  alert("showMap not available offline");
	  }
	},
	cleanup: function() {
		console.log("IntroView cleanup");
	        this.undelegateEvents();
	        this.$el.removeData().unbind();
	        Backbone.View.prototype.remove.call(this);
	},
	render: function(){
		console.log("introview render");
		/* clear the interface */
		$("#header").hide();
		//$("#landing").show();
		$(this.el).html(this.template());	
		//$(this.el).trigger('create');
		$("#footer").hide();
		//console.log(jQuery("html").html());
		// code below is for devices taking too long to render
		// its ugly but it works
		if(isDevice){
		setTimeout(function() {
			$('#landList').listview();
			$('#landList').listview('refresh');
		}, 0);
		} else {
			$('#landList').listview();
			$('#landList').listview('refresh');
		}
		return this;
	}
});
