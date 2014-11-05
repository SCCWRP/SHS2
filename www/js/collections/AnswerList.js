var AnswerList = Backbone.Collection.extend({
	initialize: function(){
            //alert("AnswerList Start");
        },
	model: Answer,
	url: 'http://54.187.64.245/shs2/index.php/surveys'
});
