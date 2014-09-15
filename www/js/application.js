var appRouter = new (Backbone.Router.extend({
  routes: {
    "shs2/receipt/:appid": "receipt",
    "": "signup"
  },
  receipt: function(appid){
	 receiptUnique = this.answerList.get(appid);
	 receiptView = new ReceiptView({model: receiptUnique});
         receiptView.render();
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
		  },
		error: function(model,response){
	       		console.log("failed");
			console.log(response.responseText);
			console.log(response.status);
			console.log(response.statusText);
		}
	});
	//userView = new UserView({model: user});
	answerList = new AnswerList();
	this.answerList = answerList;
	answerList.create({qcount: 1, timestamp: SESSIONID}, {
	  wait: true,
	  success: function(model,response){
		console.log("start - success");
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
  },
  weekly: function(){
	console.log("weekly");
	// user has logged in successfully lets check to see if they have an stored sessions
  	//if (networkStatus != 'offline' && isDevice == true){
  	if (networkStatus != 'offline'){
		var dirtyKey = window.localStorage.getItem("http://data.sccwrp.org/shs2/index.php/surveys_dirty");
		if (dirtyKey != null){
			// split on comma to get individual keys
			// sync data
			var splitKey = dirtyKey.split(',');
			var splitKeyCount = splitKey.length;
			for(var i=0; i<splitKeyCount; i++){
				var retrieveKey = window.localStorage.getItem("http://data.sccwrp.org/shs2/index.php/surveys"+ splitKey[i]);
				var retrieveObject = jQuery.parseJSON(retrieveKey);
				saveList = new AnswerList();
				saveList.create({uid: USERID, timestamp: SESSIONID}, {
			  	  wait: true,
	  		  	  success: function(model,response){
					model.save(retrieveObject);
					console.log(model);
					// create view to show user that offline data has been saved
					// receipt
					//answerListView = new AnswerListView({model: answer});
	  		  	  },
 			  	  error: function(model,response){
					console.log("failed");
					console.log(response.responseText);
					console.log(response.status);
					console.log(response.statusText);
	  		  	  }
				});
			}
		}
	}
	answerList = new AnswerList();
	this.answerList = answerList;
	answerList.create({qcount: 33, uid: USERID, timestamp: SESSIONID}, {
	  wait: true,
	  success: function(model,response){
		answer = answerList.get(response.id);
		answerListView = new AnswerListView({model: answer});
		//console.log(answer);
		//console.log(answer.get("id"));
		//answer.set({'q1.question': 'mine','q1.next': test});
	  },
 		error: function(model,response){
		console.log("failed");
		console.log(response.responseText);
		console.log(response.status);
		console.log(response.statusText);
	  }
	});
  },
  start: function(){
	console.log("start");
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
  notify: function(e){
	alert("app.notify");
	alert(e)
	var url = 'http://data.sccwrp.org/shs2/email.php';
	//var p = "15625727718";
	var message = $.ajax({
		type: 'GET',
		url: url,
		contentType: "application/json",
		dataType: 'jsonp',
		data: {ee: e},
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
