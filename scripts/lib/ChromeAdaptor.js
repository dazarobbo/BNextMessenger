(function(__scope) {
	"use strict";

  var adaptor = function(){
  };

	//TODO: window/dialog handling

  Object.defineProperties(adaptor.prototype, {

    getLocaleMessage: {
      value: (...args) => {
        return chrome.i18n.getMessage.apply(null, args);
      }
    },

		getSyncValue: {
			value: (key) => {
				return new Promise((resolve, reject) => {
					chrome.storage.sync.get(key, (item) => {

						if(chrome.runtime.error){
							return reject(new Application.Error(
								Application.Error.codes.chrome_storage_sync_error,
								chrome.runtime.console.error,
								key
							));
						}

						return resolve(item[key]);

					});
				});
			}
		},

		setSyncValue: {
			/**
			 * Sets a Chrome sync value
			 * @param  {String} key   [description]
			 * @param  {mixed} value [description]
			 * @return {Promise}       [description]
			 */
			value: (key, value) => {
				return new Promise((resolve, reject) => {

					var obj = {};
					obj[key] = value;

					chrome.storage.sync.set(obj, () => {

						if(chrome.runtime.error){
							return reject(new Application.Error(
								Application.Error.codes.chrome_storage_sync_error,
								chrome.runtime.error,
								key
							));
						}

						return resolve();

					});

				});
			}
		},

		getLocalValue: {
			/**
			 * Gets a Chrome local value
			 * @param  {String} key [description]
			 * @return {Promise}     [description]
			 */
			value: (key) => {
				return new Promise((resolve, reject) => {
					chrome.storage.local.get(key, (item) => {

						if(chrome.runtime.error){
							return reject(new Application.Error(
								Application.Error.codes.chrome_storage_local_error,
								chrome.runtime.error,
								key
							));
						}

						return resolve(item[key]);

					});
				});
			}
		},

		setLocalValue: {
			/**
			 * Sets a Chrome local value
			 * @param  {String} key   [description]
			 * @param  {mixed} value [description]
			 * @return {Promise}       [description]
			 */
			value: (key, value) => {
				return new Promise((resolve, reject) => {

					var obj = {};
					obj[key] = value;

					chrome.storage.local.set(obj, () => {

						if(chrome.runtime.error){
							return reject(new Application.Error(
								Application.Error.codes.chrome_storage_local_error,
								chrome.runtime.error,
								key
							));
						}

						return resolve();

					});

				});
			}
		},

  });

  __scope.ChromeAdaptor = adaptor;
})(this);
