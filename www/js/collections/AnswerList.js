var AnswerList = Backbone.Collection.extend({
	model: Answer,
	url: 'http://data.sccwrp.org/shs2/index.php/surveys'
});
