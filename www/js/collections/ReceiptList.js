var ReceiptList = Backbone.Collection.extend({
	model: Receipt,
	//url: 'http://data.sccwrp.org/shs2/index.php/question/:id'
	url: 'http://shs.sccwrp.org/shs2/index.php/surveys'
});
