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
	/*
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
	*/
  },
  weekly: function(){
	console.log("weekly");
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
		/*
     		var questionList = new QuestionList();
     		questionList.fetch({
	  		success: function(response){
				question = questionList.get(33);
				//var type = question.attributes.type;
				//answer.set({'q1.question': question.attributes.title,'q1.type': question.attributes.type});
				questionListView = new QuestionListView({model: question});
				questionListView.render();
	  		},
	  		error: function(response){
				console.log("questionList Failed");
	  		}
		});
		console.log(answer);
		answerListView = new AnswerListView({model: answer});
		answerListView.render("default");
		*/
	  },
 		error: function(model,response){
		console.log("failed");
		console.log(response.responseText);
		console.log(response.status);
		console.log(response.statusText);
	  }
	});
	/*
     	var questionList = new QuestionList();
     	questionList.fetch({
	  success: function(response){
		question = questionList.get(33);
		var type = question.attributes.type;
		questionListView = new QuestionListView({model: question});
		questionListView.render();
	  },
	  error: function(response){
		console.log("questionList Failed");
	  }
	});
	*/
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
