var LoginView = Backbone.View.extend({
	el: '#content',
	template:_.template($('#tpl-login-details').html()),
	initialize: function(){
		this.render();
	},
	events:{
		"click #loginBtn":"loginUser",
		"click #enrollBtn":"enrollUser"
	},
	loginUser: function(e){
		e.preventDefault();
		var loginID = $('#loginInput').val();
	  //if (networkStatus != 'offline' && isDevice == true){
	  if (networkStatus != 'offline'){
        	var url = 'http://data.sccwrp.org/shs2/index.php/user/' + loginID;
		message = $.ajax({
		type: 'GET',
		url: url,
		contentType: "application/json",
		dataType: 'json',
		crossDomain: true,
		timeout: 4000,
		error: function(x,t,m){ 
			 if(t==="timeout"){ alert("Server Inaccessible contact Paul Smith"); }
		}, 
		success: function(data) {
			if(data.event == false){
				console.log(data);
				alert("Failed to login...Try again");
				loginView.render();
			//console.log(data.event.id);
			//console.log(typeof(data.event.id));
			} else {
				//console.log("login");
				//console.log(data.event.contact);
				USERID = Number(data.event.id);
				appRouter.gift(USERID);
				appRouter.weekly();
			}
		},
		complete: function(data) {
			//alert("complete:"+data.key);
	        }
		});
	  } else {
		alert("Login Locally");
  	  	var getUserKey = window.localStorage.getItem("user");
		if(getUserKey != null){
  	  		// loop through userKey looking to match login with key
			// may be able to just use initial user key
			var splitKey = getUserKey.split(',');
			var splitKeyCount = splitKey.length;
			for(var i=0; i<splitKeyCount; i++){
				var retrieveKey = window.localStorage.getItem("user-"+ splitKey[i]);
				var retrieveObject = jQuery.parseJSON(retrieveKey);
				if(loginID == retrieveObject.email || loginID == retrieveObject.phone){
					loginStatus = true;
	  				USERID = retrieveObject.id;
				}
			}
			if(loginStatus == true){
				appRouter.weekly();
			} else {
				alert("User account not found - You must signup online before you can run a weekly survey.");
			}
		} else {
			alert("You must signup online before you can run a weekly survey.");
		}
	  }
	},
	enrollUser: function(e){
		e.preventDefault();
		//if (networkStatus != 'offline' && isDevice == true){
		if (networkStatus != 'offline'){
			appRouter.signup();
		} else {
			alert("enrollUser not available offline");
		}
	},
	render: function(){
		console.log("LoginView render");
		$(this.el).html("");
		$(this.el).html(this.template());	
	}
});
