(function(__scope) {
	"use strict";

	var provider = function(){ };

	Object.defineProperties(provider.prototype, {

		get: {
			value: function(name) {
				return this.getMatching(c => c.name === name);
			}
		},

		getAll: {
			value: function() {
				return new Promise(resolve => {
					chrome.cookies.getAll({}, (cookies) => {
						return resolve(Array.from(cookies));
					});
				});
			}
		},

		getMatching: {
			value: function(predicate) {
				return new Promise(resolve => {
					this.getAll().then(cookies => resolve(cookies.filter(predicate)));
				});
			}
		}

	});

	__scope.CookieProvider = provider;
	
})(this);
