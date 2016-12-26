var SearchController = function(){
	var controller = {
		self: null,
		initialize: function(){
			self = this;
			this.bindEvents();
			self.renderSearchView();
		},
		bindEvents: function(){
			$('#search').on('click', onSearchClick);
		},
		onSearchClick: function(){
			var query = $('#search').val();
		},
		// getMessages: function(query)(){
		// 	// code here


		// }

	};
	controller.initialize();
	return controller;

};