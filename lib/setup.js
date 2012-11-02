var async = require('async'),
	path = require('path'),
	fs = require('fs'),
	
	registery = require('./registery'),
	Controller = require('./controller'),
	requires = require('./requires'),
	
	
setup = module.exports = function(options, callback) {
	callback = callback || function(err) { if(err) throw err; }
	
	// fisrt set all values
	for(var key in options) {
		registery[key] = options[key];
	}
	
	// then, call setup methods
	async.forEachSeries(Object.keys(setup.methods), function (key, callback){ 
		if(typeof registery[key] === 'undefined' || registery[key] === null) {
			return callback();
		}
		
		setup.methods[key].call(registery, registery[key], callback);
	}, callback);
};

// Setup app on each Controller
setup.methods = {
	// Setup controllers path
	controllers: function(path, callback) {
		// no app path
		if(!this.path)
			return;

		this.requires.push(path);
		callback();
	},

	requires: function(paths, callback) {
		callback(null, requires(paths, true));
	},
	
	app: function(app, callback) {
		Controller.forEach(function(controller) {
			controller.setup(app);
		});

		callback();
	}
}
