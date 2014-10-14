var appRouter = new (Backbone.Router.extend({
  routes: {
    "shs2/receipt/:appid": "receipt",
    "": "signup",
    "shs2/www/": "start",
    "": "start"
  },
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
  css: function(){
	     console.log("css");
	     appRouter.resizePage();
  },
  gift: function(giftid){
	var gift = new Gift({id: giftid});
	 /* gift will require its own view to create a temporary sticky popup on footer bar */
	 gift.fetch({success: setMessage,error: errorMessage});
	 function setMessage(response){
		 var message = "You have completed "+ response.attributes.user_visits + " follow-up surveys when you reach " + response.attributes.gift_visits + " you will receive a "+ response.attributes.gift + "<a href='#' id='popupClose' data-rel='back' data-role='button' data-icon='delete' data-iconpos='notext' class='ui-btn-right'>Close</a>";
		 //alert(message);
		 //$("#notify").fadeIn("slow").append(message);
		 $("#popupInfo").popup("open");
		 //$("#popupInfo").html(message).enhanceWithin().popup("refresh"); 
		 $("#popupInfo").html(message);
		 $("#popupClose").click(function(){
			 $("#popupInfo").popup("close");
		 });

		 //console.log(response);
	 }
	 function errorMessage(response){
		 console.log(response);
	 }
  },	
  history: function(historyid){
	var history = new History({id: historyid});
	/* for some reason the code below in setMessage when applied to render historyView wont work - maybe history is special word -- need to put click event for each li into view */
	history.fetch({success: setMessage,error: errorMessage});
	 function setMessage(response){
		 /* backbonify later */
		 historyView = new HistoryView({model: history});
	 	 //historyView.render(response);
		 //console.log(response.attributes);
		 $("#content").html("");
		 $("#content").append("<ul id='aid' data-role='listview'>Under Construction/Read-Only<br><input type='button' value='Continue' class='history-skip'/ >");
		 $.each(response.attributes, function(key, value){
			 var unixTimestamp = response.attributes[key].timestamp;
			 var returnTime = new Date(+unixTimestamp);
			 //console.log(response.attributes[key].id+"-"+returnTime.toLocaleString());
			 var qtext = "Session "+ returnTime.toLocaleString() + " was saved would you like to <input type='button' id='"+response.attributes[key].id+"' value='Edit' class='history-edit'/ > or <input type='button' id='"+response.attributes[key].id+"'value='Forget' class='history-forget'/ >?"; 
	 	 	$("#content").append("<li>"+qtext+"</li>");
		 $("#content").append("</ul>");
		 });
		 //var dialogView = new DialogView();
		 //dialogView.render();
	 	 $("#content").append("</ul>");
	 }
	 function errorMessage(response){
		 console.log(response);
	 }
	 /*
	var query = confirm("Save session?")
	if(query){
		alert("Saving");
	} else {
		alert("Don't Save");
	}
	*/
  },
  question: function(){
	questionList = new QuestionList();
        questionList.fetch({ success: function(response){ console.log("questionList fetch - success"); questionList.getQuestion(); } });
  },
  positionFooter: function(){
	$footer = $("#footer");
	footerHeight = $footer.height();
	var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
	if (deviceType != "iPhone") { 
		$('#footer').css('visibility','visible');
	}
	var drop = (deviceType == "iPhone") ? /*-59*/3:3;
	footerTop = ($(window).scrollTop()+$(window).height()-footerHeight)-drop+"px";       
	$footer.css({
		position: "fixed",
		bottom: 0,
		left:0,
		right:0
	});
  },
  receipt: function(appid){
	 console.log("receipt");
	 var receipt = new Receipt({id: appid});
	 console.log(receipt);
	 receiptView = new ReceiptView({model: receipt});
	 receipt.fetch({error: errorMessage});
	 function errorMessage(response){
		 console.log(response);
	 }
  },
  resizePage: function(){
	/* in the beta version this functin was used with unique form element names
	   in full study all (maybe) form elements derive from .ui-field-contain */
	// total size of form element and amount of space from top
	var formSize = Math.round($('.ui-field-contain').offset().top+$('.ui-field-contain').height());
	// size of page minus footer - changed from one to content for full study
	var stageSize = Math.round($('#content').height()-$('#footer').height());
	//console.log("stageSize: "+ stageSize);
	// total size of form element with some padding
	var minHeight = "" + (formSize + 400) + "px";
	// current size of entire page
	var oneHeight = (formSize > stageSize) ? minHeight:("" + $('#one').height() + "px");
	/* in old app may not need
	if(formName == 'text-btn'){
		$('#one').css('height',1024);
	} else {
		$('#one').css('height',oneHeight);
	}
	*/
	$('#one').css('height',oneHeight);
  },
  signup: function(){
	console.log("signup");
	// create initial record in database - set timestamp
	questionList = new QuestionList();
	questionList.fetch({
	  success: function(response){
		console.log("questionList fetch - success");
	  }
	});
	user = new User();
	var seedEmail = chance.email();
	var seedPhone = chance.phone();
	var userCreate = user.save({email: seedEmail, phone: seedPhone, visits: 0}, {
	  	wait: true,
	      	success: function(response){
			console.log("user - success");
	  		//console.log(response.toJSON());
			USERID = response.id;
			startSignup(seedEmail,seedPhone);
		  },
		error: function(model,response){
	       		console.log("failed");
			console.log(response.responseText);
			console.log(response.status);
			console.log(response.statusText);
		}
	});
	//userView = new UserView({model: user});
	function startSignup(seedEmail,seedPhone){
	  answerList = new AnswerList();
	  var answerCreate = answerList.create({q6: seedPhone, q7: seedPhone, q8: seedEmail, q9: seedEmail, qcount: 1, timestamp: SESSIONID, survey_type: "enrollment"}, {
	    success: function(response){
		console.log("start - success");
		var answer = answerList.get(response.id);
		answerListView = new AnswerListView({model: answer});
	    },
 	    error: function(model, response){
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
	// this should probably get moved to LoginView
  	if (networkStatus != 'offline'){
		var dirtyKey = window.localStorage.getItem("http://data.sccwrp.org/shs2/index.php/surveys_dirty");
		if (dirtyKey){
			alert(dirtyKey);
			//submitLocal(dirtyKey, startWeekly);
			submitLocal(dirtyKey);
			startWeekly();
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
			console.log("startWeekly");
			answerList = new AnswerList();
			//this.answerList = answerList;
			answerList.create({qcount: 73, user_id: USERID, timestamp: SESSIONID, survey_type: "followup"}, {
	  		  wait: true,
	  		  success: function(model,response){
				answer = answerList.get(response.id);
				answerListView = new AnswerListView({model: answer});
	  		  },
 			  error: function(model,response){
				if(response.status == 500){
					console.log("failed");
					alert("Failed to Start Weekly");
					console.log(response.responseText);
					console.log(response.status);
					loginView = new LoginView;
				}
			  }
			});
	}
  },
  start: function(){
	console.log("start");
	//appRouter.navigate('shs2/receipt/341', {trigger: true});
	//appRouter.checksum();
	introView = new IntroView();
	introView.render();
	//$("#content").html( new IntroView().render().el );
	//$("#landList").trigger("create");
	//$("#landList").listview();
	//$("#landList").listview('refresh');
	// not sure whether this is the best place to load the questions collection
	appRouter.question();
        $(window).scroll(appRouter.positionFooter).resize(appRouter.positionFooter)
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
