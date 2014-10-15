var IntroView = Backbone.View.extend({
	el: '#landing',
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
		headerView = new HeaderView;
		faqView = new FAQView;
	},
	showLogin: function(){
		$("#landing").hide();
		headerView = new HeaderView;
		loginView = new LoginView;
		footerView = new FooterView;
	},
	showMap: function(){
	  if (networkStatus != 'offline'){
		headerView = new HeaderView;
		mapView = new MapView;
	  } else { 
		  alert("showMap not available offline");
	  }
	},
	render: function(){
		console.log("introview render");
		/* clear the interface */
		$("#header").hide();
		$("#landing").show();
		//$(this.el).html(this.template());	
		$("#footer").hide();
		//$("#landList").trigger('create');
		//$('#landList').listview();
		//$('#landList').listview( "refresh" );
		//console.log(jQuery("html").html());
		//$.mobile.changePage($(this.el));
		return this;
	}
});
