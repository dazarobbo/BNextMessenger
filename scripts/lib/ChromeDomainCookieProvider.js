(function(__scope) {
	"use strict";


	var provider = function(domain){
    this.domain = domain;
  };

	Object.defineProperties(provider.prototype, {

    domain: {
			value: null,
			writable: true
    },

		get: {
			value: function(name) {
				return this.getMatching(c => c.name === name);
			}
		},

		getAll: {
			value: function() {
				return new Promise(resolve => {
					chrome.cookies.getAll({ domain: this.domain }, (cookies) => {
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


	__scope.ChromeDomainCookieProvider = provider;
})(this);
