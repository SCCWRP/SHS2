//global
var isDevice = false;
var loginStatus = false;
var networkStatus;
var CONTACTID;
var SESSIONID = +new Date;
var USERID;
var user;
$.ajax({
	url: "questions.json",
	dataType: 'json',
	async: false,
	success: function(qjson){
		console.log("success");
		var idlist = [];
		for(i in qjson) {
			idlist.push(Number(qjson[i].id));
		};
		MAXQUESTION = Math.max.apply(null, idlist);
	},
	error: function () {console.log("error")}	
});
var EventBus = _.extend({}, Backbone.Events);
