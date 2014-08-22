alert("test")

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
	var user = new User();
	//user.save({ email: ""+SESSIONID++"@sccwrp.org" }, {
	user.save({}, {
	  wait: true,
	  success: function(response){
		console.log(response);
		console.log(response.id);
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
		//console.log(response);
		answer = answerList.get(response.id);
		answerListView = new AnswerListView({model: answer});
		answerListView.render("radio");
		//this.close;
	  },
 		error: function(model,response){
		console.log("failed");
		console.log(response.responseText);
		console.log(response.status);
		console.log(response.statusText);
	  }
	});
     	var questionList = new QuestionList();
     	questionList.fetch({
	  success: function(response){
		console.log("questionList fetch");
		question = questionList.get(1);
		var type = question.attributes.type;
		questionListView = new QuestionListView({model: question});
		questionListView.render();
	  },
	  error: function(response){
		console.log("questionList Failed");
	  }
	});
  },
  weekly: function(){
	console.log("weekly");
	alert(USERID);
	answerList = new AnswerList();
	this.answerList = answerList;
	answerList.create({qcount: 33, uid: USERID, timestamp: SESSIONID}, {
	  wait: true,
	  success: function(model,response){
		answer = answerList.get(response.id);
		answerListView = new AnswerListView({model: answer});
		answerListView.render("radio");
	  },
 		error: function(model,response){
		console.log("failed");
		console.log(response.responseText);
		console.log(response.status);
		console.log(response.statusText);
	  }
	});
     	var questionList = new QuestionList();
     	questionList.fetch({
	  success: function(response){
		console.log("questionList fetch");
		question = questionList.get(33);
		var type = question.attributes.type;
		questionListView = new QuestionListView({model: question});
		questionListView.render();
	  },
	  error: function(response){
		console.log("questionList Failed");
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
  loginLocal: function(){
	// if user is set 
	var userGrab = window.localStorage.getItem("user");
	if (userGrab != null){
		loginStatus = true;
		// get login id
	}
  },
  loginStatus: function(){
	// check to see if user has network connectivity
	networkStatus = navigator.onLine ? 'online' : 'offline';
	// if the user is online attempt to login remotely
	if(networkStatus === 'online' && isDevice == false){
		appRouter.start();
	// if the user is offline and using mobile device attempt to login locally 
	} else if(networkStatus === "offline"){
		loginLocal();
	} else {
	// if neither start backbone app and attempt signup
		appRouter.start();
	}
  },
  lookup: function(p){
	var url = 'http://data.sccwrp.org/shs2/lookup.php';
	//var p = "15625727718";
	message = $.ajax({
		type: 'GET',
		url: url,
		contentType: "application/json",
		dataType: 'jsonp',
		data: {pp: p},
		crossDomain: true,
		timeout: 4000,
		error: function(x,t,m){ 
			 if(t==="timeout"){ alert("Data not Submitted"); }
		}, 
		success: function(data) {
			//alert("status:"+data.status[0]);
			//alert("number:"+data.number[0]);
			//lookup_number = data.number[0];
			//return lookup_number;
			lookup_success(data);
		},
		complete: function(data) {
			//alert("complete:"+data.key);
	        }
    	});
  },
  notify: function(e){
	alert("app.notify");
	alert(e)
	var url = 'http://data.sccwrp.org/shs2/email.php';
	//var p = "15625727718";
	message = $.ajax({
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
	// check login
  	app.loginStatus();
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
