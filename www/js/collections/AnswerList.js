var AnswerList = Backbone.Collection.extend({
	initialize: function(){
        },
	model: Answer,
	url: 'http://shs.sccwrp.org/shs2/index.php/surveys'
});
