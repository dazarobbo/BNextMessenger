class ChromeAdaptor{

	//TODO:
	//move app errors out of this class

	constructor(){
	}

	/**
	 * Returns a locale-specific message
	 * @param  {Array} ...args
	 * @return {String}
	 */
	getLocaleMessage(...args){
		return chrome.i18n.getMessage.apply(null, args);
	}

	/**
	 * Gets a value synchronised with Google
	 * @param  {String} key
	 * @return {Promise}
	 */
	getSyncValue(key){
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

	/**
	 * Sets a value to be synchronised with Google
	 * @param {String} key
	 * @param {mixed} value
	 * @return {Promise}
	 */
	setSyncValue(key, value){
		return new Promise((resolve, reject) => {

			let obj = {};
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

	/**
	 * Gets a value stored locally within the extension
	 * @param  {String} key
	 * @return {Promise}
	 */
	getLocaleValue(key){
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

	/**
	 * Sets a value locally stored in the extension
	 * @param {String} key
	 * @param {mixed} value
	 * @return {Promise}
	 */
	setLocalValue(key, value){
		return new Promise((resolve, reject) => {

			let obj = {};
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

}
