var AnswerList = Backbone.Collection.extend({
	initialize: function(){
            alert("Answer Start");
        },
	model: Answer,
	url: 'http://data.sccwrp.org/shs2/index.php/surveys'
});
