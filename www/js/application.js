var appRouter = new (Backbone.Router.extend({
  routes: {
    "shs2/receipt/:appid": "receipt",
    "": "signup",
    "intro": "start"
  },
  // new not yet incorporated into main program
  checksum: function(){
	console.log("checksum");
  	//if (networkStatus != 'offline' && isDevice == true){
  	if (networkStatus != 'offline'){
		var surveyKey = window.localStorage.getItem("http://data.sccwrp.org/shs2/index.php/surveys");
		var splitKey = surveyKey.split(',');
		var splitKeyCount = splitKey.length;
		console.log(splitKeyCount);
		for(var i=0; i<splitKeyCount; i++){
			console.log(splitKey[i]);
			// check each value against server - to confirm they are "complete" in status field
			// if not - send to staging table for manual decision making
		}
	}
  },
  receipt: function(appid){
	 console.log("receipt");
	 var receipt = new Receipt({id: appid});
	 receiptView = new ReceiptView({model: receipt});
	 receipt.fetch({error: errorMessage});
	 function errorMessage(response){
		 console.log(response);
	 }
  },
  signup: function(){
	console.log("signup");
	// create initial record in database - set timestamp
	user = new User();
	var seedEmail = chance.email();
	var seedPhone = chance.phone();
	var userCreate = user.save({email: seedEmail, phone: seedPhone}, {
	  	wait: true,
	      	success: function(response){
	  		//console.log(response);
			//console.log(response.id);
			USERID = response.id;
			startSignup();
		  },
		error: function(model,response){
	       		console.log("failed");
			console.log(response.responseText);
			console.log(response.status);
			console.log(response.statusText);
		}
	});
	//userView = new UserView({model: user});
	function startSignup(){
	  answerList = new AnswerList();
	  var answerCreate = answerList.create({qcount: 1, timestamp: SESSIONID}, {
	    success: function(response){
		console.log("start - success");
		var answer = answerList.get(response.id);
		answerListView = new AnswerListView({model: answer});
	    },
 	    error: function(response){
		console.log("failed");
		console.log(response.responseText);
		console.log(response.status);
		console.log(response.statusText);
	    }
	  });
	}
  },
  weekly: function(){
	console.log("weekly");
	// user has logged in successfully lets check to see if they have an stored sessions
  	//if (networkStatus != 'offline' && isDevice == true){
  	if (networkStatus != 'offline'){
		var dirtyKey = window.localStorage.getItem("http://data.sccwrp.org/shs2/index.php/surveys_dirty");
		if (dirtyKey){
			alert(dirtyKey);
			submitLocal(dirtyKey, startWeekly);
			//submitLocal(dirtyKey);
			//startWeekly();
		} else {
			startWeekly();
		}
	} else {
		startWeekly();
	}
	function submitLocal(dirtyKey){
		// split on comma to get individual keys
		// sync data
		var splitKey = dirtyKey.split(',');
		var splitKeyCount = splitKey.length;
		for(var i=0; i<splitKeyCount; i++){
			var surveyLocalKey = window.localStorage.getItem("http://data.sccwrp.org/shs2/index.php/surveys"+ splitKey[i]);
			//storeLocal(localKey,localReceipt);
			var surveyLocalObject = jQuery.parseJSON(surveyLocalKey);
			var saveList = new AnswerList();
			saveList.create(surveyLocalObject, {
		  	  wait: true,
  		  	  success: function(model,response){
				appID = Number(response.id);
				console.log(appID);
				console.log("Receipt: "+ saveList.toJSON());
				// future - need to setup receipt for each local submission
				//appRouter.navigate('shs2/receipt/' + appID, {trigger: true});
  		  	  },
		  	  error: function(response){
				console.log("failed");
				console.log(response.responseText);
				console.log(response.status);
				console.log(response.statusText);
  		  	  }
			});
		} // end for
	} // close submitLocal
	function startWeekly(){
			answerList = new AnswerList();
			//this.answerList = answerList;
			answerList.create({qcount: 25, uid: USERID, timestamp: SESSIONID}, {
	  		  wait: true,
	  		  success: function(model,response){
				answer = answerList.get(response.id);
				answerListView = new AnswerListView({model: answer});
	  		  },
 			  error: function(model,response){
				console.log("failed");
				console.log(response.responseText);
				console.log(response.status);
				console.log(response.statusText);
	  		  }
			});
	}
  },
  start: function(){
	console.log("start");
	//appRouter.navigate('shs2/receipt/855', {trigger: true});
	//appRouter.checksum();
	introView = new IntroView();
	introView.render();
  }
}));
var app = {
  xhr_get: function(url,indata){
	return $.ajax({
		type: 'GET',
		url: url,
		contentType: "application/json",
		dataType: 'jsonp',
		data: {generic: indata},
		crossDomain: true
		//beforeSend: loader
	})
	.always(function(){
		// loader
	})
	.fail(function(){
		// failures
	});
  },
  notify: function(e,i){
	alert(e);
	alert(i);
	var url = 'http://data.sccwrp.org/shs2/email.php';
	//var p = "15625727718";
	var message = $.ajax({
		type: 'GET',
		url: url,
		contentType: "application/json",
		dataType: 'jsonp',
		data: {ee: e,ii: i},
		crossDomain: true,
		timeout: 4000,
		error: function(x,t,m){ 
			 if(t==="timeout"){ alert("Data not Submitted"); }
		}, 
		success: function(data) {
			alert(data);
			//alert("status:"+data.status[0]);
			//alert("number:"+data.number[0]);
			//lookup_number = data.number[0];
		},
		complete: function(data) {
			//alert("complete:"+data.key);
	        }
    	});

  },
  receipt: function(){
	alert("app.receipt");
  },
  onDeviceReady: function(){
 	// jquery cors support for phonegap
	/*
	$.support.cors = true;
	$.mobile.allowCrossDomainPages = true;
	*/
	// disable jquery mobile routing
	$.mobile.ajaxEnabled = false;
	$.mobile.linkBindingEnabled = false;
	$.mobile.hashListeningEnabled = false;
	$.mobile.pushStateEnabled = false;
	//app.bindEvents();
  	Backbone.history.start({pushState: true});
	// check network status
 	networkStatus = navigator.onLine ? 'online' : 'offline';
	appRouter.start();
  },
  initialize: function(){
	if(document.URL.indexOf("http://") === -1 && document.URL.indexOf("https://") === -1){
		isDevice = true;
	}
	if( isDevice ){
    		document.addEventListener("deviceready", function(){
			app.onDeviceReady();
		},true);
	} else {
		app.onDeviceReady();
	}
  }
};
app.initialize();
