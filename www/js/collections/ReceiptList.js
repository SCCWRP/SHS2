var ReceiptList = Backbone.Collection.extend({
	model: Receipt,
	//url: 'http://data.sccwrp.org/shs2/index.php/question/:id'
	url: 'http://54.187.64.245/shs2/index.php/surveys'
});
