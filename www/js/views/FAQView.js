var FAQView = Backbone.View.extend({
	el: '#content',
	template:_.template($('#tpl-faq-details').html()),
	initialize: function(){
		//console.log("init");
		var self = this;
		this.FAQcol = new FAQList();
		this.FAQcol.fetch({
		       	success: function(col, response){ self.render(); },
	      	 	error: function (response, xhr, options) { console.log("FAQ fail"); }
	       	}); 
	},
	render: function(){
		//console.log("faq");
		$("#landing").hide();
		$(headerView.el).show();
		$('#question').html("FAQ");
		$(this.el).html("");
		$(this.el).html(this.template({FAquestions: this.FAQcol.toJSON() }));	
		$('#formFAQ').trigger('create');
	}
});
