(function() {
	'use strict';

	class mineSweeperApp {
		constructor(name){
			this.storage = new app.Store(name);
			this.template = new app.GameTemplate(this.storage);
			this.controller = new app.GameController(this.template,this.storage);
		}

	}
	
	var bl = new mineSweeperApp("minesweeper");

})();


