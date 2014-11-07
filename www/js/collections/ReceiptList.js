var ReceiptList = Backbone.Collection.extend({
	model: Receipt,
	url: 'http://shs.sccwrp.org/shs2/index.php/surveys'
});
