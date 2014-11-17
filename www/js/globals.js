//global
var isDevice = false;
var loginStatus = false;
var networkStatus;
var HOME = location.href;
var SESSIONID = +new Date;
var USERID;
var user;
$.ajax({
	url: "questions.json",
	dataType: 'json',
	async: false,
	success: function(qjson){
		//console.log("success");
		var idlist = [];
		for(i in qjson) {
			idlist.push(Number(qjson[i].id));
		};
		MAXQUESTION = Math.max.apply(null, idlist);
	},
	error: function () {/*console.log("error")*/}	
});
var EventBus = _.extend({}, Backbone.Events);


function custom_alert(output_msg, title_msg)
{
	    if (!title_msg)
		            title_msg = 'Alert';

	        if (!output_msg)
			        output_msg = 'No Message to Display.';
		   
		var box = $("<div></div>")	
		box.html(output_msg).dialog({
			            title: title_msg,
			    	    autoOpen: false,
			            resizable: false,
			            modal: true,
			            buttons: {
					    "Ok": function() {
						$( this ).dialog( "close" );
						}
		            	    }
		 });
		box.dialog("open");
};
