var AnswerList = Backbone.Collection.extend({
	initialize: function(){
            //alert("AnswerList Start");
        },
	model: Answer,
	url: 'http://data.sccwrp.org/shs2/index.php/surveys'
});
