
var Application = {};
Object.defineProperties(Application, {

	/**
	 * Interface adaptor for browser-agnosticism
	 * @type {Object}
	 */
	browserAdaptor: {
		writable: true,
		value: null
	},

	getLongDateFormat: {
		/**
		 * Returns a long date string in a locale-aware format
		 * @name Application.getLongDateFormat
		 * @param {Date} d - the date to format
		 */
		value: (d) => {
			return d.toLocaleString([], {
					hour12: true,
					weekday: "long",
					year: "numeric",
					month: "long",
					day: "2-digit",
					hour: "numeric",
					minute: "2-digit",
					second: "2-digit"
				}
			);
		}
	},

	getPlatformInstance: {
		/**
		 * Generates a new platform instance
		 * @return {Promise} [description]
		 */
		value: () => {
			return new Promise((resolve) => {

				var p = new BungieNet.Platform({
					apiKey: Application.constants.apiKey
				});

				return resolve(p);

			});
		}
	},

	getStatusUpdateMessage: {
		/**
		 * Generates a random string for a status update
		 * @return {String} [description]
		 */
		value: () => {

			//Could also use Date.now instead
			var nonceLength = Application.constants.statusUpdateNonceLength;
			var max = parseInt("9".repeat(nonceLength), 10);
			var min = parseInt("1" + "0".repeat(nonceLength - 1), 10);
			var nonce = (Math.random() * (max - min) + min).toFixed(0);

			return "online-" + nonce;

		}
	},

	getMainWindowId: {
		/**
		 * Finds the ID of the main chat app window
		 * @return {Promise}
		 */
		value: () => {
			return new Promise((resolve, reject) => {
				chrome.windows.getAll({ populate: true }, (wndws) => {

					var uri = new URI("")
						.protocol("chrome-extension")
						.segment(chrome.runtime.id.toString())
						.segment("main.html")
						.toString()
						.trim()
						.toLowerCase();

					var matchedWindows = wndws
						.filter(w => {
							return w.tabs
								.filter(t => t.url.trim().toLowerCase().startsWith(uri))
								.length > 0;
						});

					if(matchedWindows.length > 0){
						return resolve(matchedWindows[0].id);
					}

					//no window open
					return reject();

				});
			});
		}
	},

	getConversationWindowId: {
		/**
		 * Finds the ID of the window with the given chat id
		 * @param  {Number} convId [description]
		 * @return {Promise}        [description]
		 */
		value: (convId) => {
			return new Promise((resolve, reject) => {
				chrome.windows.getAll({ populate: true }, (wndws) => {

					var base = new URI("")
						.protocol("chrome-extension")
						.segment(chrome.runtime.id.toString())
						.segment("conversation.html")
						.toString()
						.trim()
						.toLowerCase();

					var matchedWindows = wndws
						.filter(w => {
							return w.tabs
								.filter(t => {
									var uri = new URI(t.url);
									//TODO: this can probably better make use of URI.js methods
									return uri.toString().startsWith(base) &&
										uri.hasQuery("conversationId", convId.toString(), true);
								}).length > 0;
						});

					if(matchedWindows.length > 0){
						return resolve(matchedWindows[0].id);
					}

					//no window open
					return reject();

				});
			});
		}
	},

	getLocaleMessage: {
		/**
		 * Gets the relevant locale message with a given key
		 * @param mixed
		 * @return {String}
		 */
		value: (...args) => {
			return Application.browserAdaptor.getLocaleMessage.apply(null, args);
		}
	},

	log: {
		/**
		 * Log an application-level message
		 * @param  {mixed} o [description]
		 * @return {void}   [description]
		 */
		value: (o) => {
			console.log(Application.getLongDateFormat(new Date()), o);
		}
	},

	queryString: {
		/**
		 * Object containing query string parameters
		 * @see http://stackoverflow.com/a/979995/570787
		 * @return {Object} [description]
		 */
		value: (() => {

			var query_string = { };
			var query = window.location.search.substring(1);
			var vars = query.split("&");

			for(var i = 0; i < vars.length; ++i){

				var pair = vars[i].split("=");

				if(typeof query_string[pair[0]] === "undefined"){
					query_string[pair[0]] = decodeURIComponent(pair[1]);
				}
				else if(typeof query_string[pair[0]] === "string"){
					var arr = [query_string[pair[0]],decodeURIComponent(pair[1])];
					query_string[pair[0]] = arr;
				}
				else{
					query_string[pair[0]].push(decodeURIComponent(pair[1]));
				}

			}

			return query_string;

		})()
	},

	getSyncValue: {
		/**
		 * Gets a Chrome sync value
		 * @param  {String} key [description]
		 * @return {Promise}     [description]
		 */
		value: (...args) => {
			return Application
				.browserAdaptor
				.getSyncValue
				.apply(null, args);
		}
	},

	setSyncValue: {
		/**
		 * Sets a Chrome sync value
		 * @param  {String} key   [description]
		 * @param  {mixed} value [description]
		 * @return {Promise}       [description]
		 */
		value: (...args) => {
			return Application
				.browserAdaptor
				.setSyncValue
				.apply(null, args);
		}
	},

	getLocalValue: {
		/**
		 * Gets a Chrome local value
		 * @param  {String} key [description]
		 * @return {Promise}     [description]
		 */
		value: (...args) => {
			return Application
				.browserAdaptor
				.getLocalValue
				.apply(null, args);
		}
	},

	setLocalValue: {
		/**
		 * Sets a Chrome local value
		 * @param  {String} key   [description]
		 * @param  {mixed} value [description]
		 * @return {Promise}       [description]
		 */
		value: (...args) => {
			return Application
				.browserAdaptor
				.setLocalValue
				.apply(null, args);
		}
	},

	uploadToImgur: {
		/**
		 * Uploads an image file to imgur
		 * @param  {File} file [description]
		 * @return {Promise}      [description]
		 */
		value: (file) => {
			return new Promise((resolve, reject) => {

				var fd = new FormData();
				fd.append("image", file);

				$.ajax({
					url: "https://api.imgur.com/3/image",
					headers: {
						"Authorization": "Client-ID " + Application.constants.imgurClientId
					},
					type: "POST",
					data: fd,
					processData: false,
					contentType: false,
					success: (resp) => {

						if(resp.success){
							return resolve(resp);
						}
						else{
							return reject(new Application.Error(
								Application.Error.codes.imgur_upload_failed,
								"",
								resp
							));
						}

					},
					error: () => {
						return reject(new Application.Error(
							Application.Error.codes.imgur_upload_failed));
					}
				});

			});
		}
	}

});

Object.defineProperties(Application, { Dialog: {
	value: function(windowId){
		this.windowId = windowId || chrome.windows.WINDOW_ID_NONE;
	}
}});
Object.defineProperties(Application.Dialog, {

	create: {
		/**
		 * Create a new dialog-type window
		 * @param  {String} url [description]
		 * @return {Promise}     new window ID
		 */
		value: (url) => {
			return new Promise((resolve) => {
				chrome.windows.create({
					url: url,
					type: chrome.windows.CreateType.POPUP,
					width: 0,
					height: 0
				}, (wndw) => {
					return resolve(new Application.Dialog(wndw.id));
				});
			});
		}
	},

	fromCurrent: {
		/**
		 * Create a new application dialog type from the current window ID
		 * @return {Dialog} [description]
		 */
		value: () => {
			return new Promise((resolve) => {
				chrome.windows.getCurrent({}, (wndw) => {
					return resolve(new Application.Dialog(wndw.id));
				});
			});
		}
	}

});
Object.defineProperties(Application.Dialog.prototype, {

	init: {
		/**
		 * Initialise the dialog
		 * @return {Promise} [description]
		 */
		value: function() {
			return new Promise((resolve) => {
				document.title = Application.getLocaleMessage("chrome_ext_name");
				Common.loadStylesheets()
					.then(Common.applyThemeFromStorage)
					.then(Common.applySizing)
					.then(() => resolve());
			});
		}
	},

	close: {
		/**
		 * Close a dialog
		 * @return {Promise} [description]
		 */
		value: function(){
			return new Promise((resolve) => {
				chrome.windows.remove(this.windowId, () => resolve());
			});
		}
	},

	focus: {
		/**
		 * Focus on the dialog
		 * @return {Promise} [description]
		 */
		value: function() {
			return new Promise((resolve) => {
				chrome.windows.update(
					this.windowId, {
						focused: true
					}, () => resolve()
				);
			});
		}
	},

	getAttention: {
		/**
		 * Grab user's attention to the dialog
		 * @return {Promise} [description]
		 */
		value: function(){
			return new Promise((resolve) => {
				chrome.windows.update(
					this.windowId, {
						drawAttention: true
					}, () => resolve()
				);
			});
		}
	},

	addNavigation: {
		/**
		 * Adds navigation information to the dialog
		 * @param  {Array} arr array of navigation items
		 * @return {Promise}     [description]
		 */
		value: function(arr = []){
			return Common.populateNav(arr);
		}
	},

	displayMessage: {
		/**
		 * Displays a popup message
		 * @param  {String} str html string
		 * @return {void}     [description]
		 */
		value: function(str){
			//TODO: async?
			Materialize.toast(str, 5000);
		}
	},

	setPageTitle: {
		/**
		 * Sets the dialog's title
		 * @param  {String} str [description
		 * @return {[type]}     [description]
		 */
		value: function(str){
			$("#logo").text(str);
		}
	}

});

Object.defineProperties(Application, { Error: {
	value: function(code, message = "", data = null){
		this.code = code;
		this.message = message;
		this.data = data;
		this.stack = (new Error()).stack;
	}
}});
Application.Error.prototype = Object.create(Error.prototype);
Application.Error.prototype.constructor = Application.Error;
Object.defineProperties(Application.Error.prototype, {

	toString: {
		/**
		 * toString override; see translateError
		 * @return {String} [description]
		 */
		value: function(){
			return this.translateError();
		}
	},

	translateError: {
		/**
		 * Translates error into a friendly message
		 * @return {String} [description]
		 */
		value: function() {

			var predefined = Application.getLocaleMessage(
				"application_error_code_" + this.code);

			if(predefined !== ""){
				return predefined;
			}
			else if(this.message !== ""){
				return this.message;
			}
			else if(this.code !== null){

				if(this.code === Application.Error.codes.bungie_net_error){
					return Application.getLocaleMessage(
						"application_error_bungie_net", [
						this.data.errorCode,
						this.data.message
					]);
				}

				return Application.getLocaleMessage("application_error_unknown") +
					" (" + this.code + ")";

			}
			else if(this.stack){
				return this.stack;
			}
			else if(this.data !== undefined){
				return this.data;
			}

			return Application.getLocaleMessage("application_error_unknown");

		}
	}

});
Object.defineProperties(Application.Error, {
	codes: {
		/**
		 * Application-level error codes
		 * @type {Object}
		 */
		value: {
			not_authenticated: 1,
			bungie_net_error: 2,
			chrome_storage_sync_error: 3,
			chrome_storage_local_error: 4,
			status_update_failed: 5,
			imgur_upload_failed: 6,
		}
	}
});

Object.defineProperties(Application, { constants: {
	value: { }
} });
Object.defineProperties(Application.constants, {

	storageKeys: {
		/**
		 * Key names for storing data
		 * @type {Object}
		 */
		value: {
			themeName: "sync_themeName",
			emojiSupport: "sync_emojiEnabled",
			statusUpdates: "sync_statusUpdates"
		}
	},

	themes: {
		/**
		 * Key names for themes
		 * @type {Object}
		 */
		value: {
			light: "light",
			dark: "dark"
		}
	},

	alarmKeys: {
		/**
		 * Key names for Chrome alarms
		 * @type {Object}
		 */
		value: {
			statusUpdates: "chrome_alarm_statusUpdates"
		}
	},

	apiKey: {
		/**
		 * Bungie.net API key
		 * @type {String}
		 */
		value: "d1207b9704f141d7938d69a874f4fdf3"
	},

	imgurClientId: {
		/**
		 * Imgur API client id
		 * @type {String}
		 */
		value: "7ac2508308cdec3"
	},

	dialogWindowWidth: {
		/**
		 * Width of the dialog window
		 * @type {Number}
		 */
		value: 330
	},

	dialogWindowMinHeight: {
		/**
		 * Minimum dialog window height
		 * @type {Number}
		 */
		value: 200
	},

	dialogWindowHeight: {
		/**
		 * Dialog window height
		 * @type {Number}
		 */
		value: 600
	},

	statusUpdateInterval: {
		/**
		 * Interval of status updates in seconds
		 * @type {Number}
		 */
		value: 300
	},

	statusUpdateNonceLength: {
		/**
		 * Length of the random number used in a status update
		 * @type {Number}
		 */
		value: 9
	}

});

Object.defineProperties(Application, { Conversation: {
	value: function(){ }
}});
Object.defineProperties(Application.Conversation, {

	parseResult: {
		/**
		 * Parses a conversation response from bungie.net
		 * @param  {Object} result   [description]
		 * @param  {Object} response [description]
		 * @return {Conversation}          [description]
		 */
		value: (result, response) => {

			var conv = new Application.Conversation();

			//Copy all the properties
			for(var prop in result.detail){
				conv[prop] = result.detail[prop];
			}

			conv.conversationId = parseInt(conv.conversationId, 10);
			conv.dateStarted = new Date(conv.dateStarted);
			conv.invitationId = parseInt(conv.invitationId, 10);
			conv.isAutoResponse = parseInt(conv.isAutoResponse, 10);
			conv.lastMessageId = parseInt(conv.lastMessageId, 10);
			conv.lastMessageSent = new Date(conv.lastMessageSent);
			conv.lastRead = new Date(conv.lastRead);
			conv.memberFromId = parseInt(conv.memberFromId, 10);
			conv.ownerEntityId = parseInt(conv.ownerEntityId, 10);
			conv.ownerEntityType = parseInt(conv.ownerEntityType, 10);
			conv.starter = parseInt(conv.starter, 10);
			conv.targetMembershipId = parseInt(conv.targetMembershipId, 10);
			conv.totalMessageCount = parseInt(conv.totalMessageCount, 10);

			conv.participants = result.participants.map((p) => {
				return Application.User.parseResult(response.users[p.membershipId]);
			});

			if(conv.ownerEntityType === BungieNet.enums.entityType.group){
				conv.group = Application.Group.parseResult(result.group);
			}

			return conv;

		}
	},

	getDetails: {
		/**
		 * Gets details about a given conversation
		 * @param  {Number} conversationId [description]
		 * @return {Promise}                [description]
		 */
		value: (conversationId) => {
			return new Promise((resolve, reject) => {
				Application.getPlatformInstance().then((platform) => {
					platform.services.message.getConversationByIdV2(conversationId).then((resp) => {

						if(resp.isError){
							return reject(new Application.Error(
								Application.Error.codes.bungie_net_error,
								"",
								resp
							));
						}

						var conv = Application.Conversation.parseResult(resp.response, resp.response);

						return resolve({
							details: conv,
							response: resp
						});

					}, reject);
				});
			});
		}
	},

	fetchFromConversationId: {
		/**
		 * Fetches a conversation according to its id and optionally page
		 * @param  {Number} conversationId [description]
		 * @param  {Number} page           [description]
		 * @return {Promise}                [description]
		 */
		value: (conversationId, page = 1) => {
			return new Promise((resolve, reject) => {
				Application.getPlatformInstance().then((platform) => {
					platform.services.message.getConversationThreadV3(conversationId, page).then((resp) => {

						if(resp.isError){
							return reject(new Application.Error(
								Application.Error.codes.bungie_net_error,
								"",
								resp
							));
						}

						var messages = resp.response.results.map((m) => {
							var usr = Application.User.parseResult(resp.response.users[m.memberFromId]);
							return Application.Message.parseResult(m, usr);
						});

						return resolve({
							messages: messages,
							response: resp
						});

					}, reject);
				});
			});
		}
	},

	sendMessage: {
		/**
		 * Adds a message to a conversation
		 * @param  {String} body           [description]
		 * @param  {Number} conversationId [description]
		 * @return {Promise}                [description]
		 */
		value: (body, conversationId) => {
			return new Promise((resolve, reject) => {
				Application.getPlatformInstance().then((platform) => {
					platform.services.message.saveMessageV3(body, conversationId).then((resp) => {

						if(resp.isError){
							return reject(new Application.Error(
								Application.Error.codes.bungie_net_error,
								"",
								resp
							));
						}

						return resolve({
							response: resp
						});

					}, reject);
				});
			});
		}
	},

	fetchGroupMessages: {
		/**
		 * Fetches this user's group messages
		 * @param  {Number} page [description]
		 * @return {Promise}      [description]
		 */
		value: (page = 1) => {
			return new Promise((resolve, reject) => {
				Application.getPlatformInstance().then((platform) => {
					platform.services.message.getGroupConversations(page).then((resp) => {

						if(resp.isError){
							return reject(new Application.Error(
								Application.Error.codes.bungie_net_error,
								"",
								resp
							));
						}

						var groups = Object.keys(resp.response.groups).map((gId) => {
							return Application.Group.parseResult(resp.response.groups[gId]);
						});

						var users = Object.keys(resp.response.users).map((id) => {
							return Application.User.parseResult(resp.response.users[id]);
						});

						var conversations = resp.response.results.map((result) => {

							var c = Application.Conversation.parseResult(result, resp.reasponse);

							//Grab the last user
							c.participants.push(users
								.filter(u => u.membershipId == c.memberFromId)[0]);

							//Grab the group
							c.group = groups
								.filter(g => g.conversationId == c.conversationId)[0];

							return c;

						});

						return resolve({
							conversations: conversations,
							groups: groups,
							users: users,
							response: resp
						});

					}, reject);
				});
			});
		}
	},

	fetchPrivateMessages: {
		/**
		 * Fetches this user's private messages
		 * @param  {Number} page [description]
		 * @return {Promise}      [description]
		 */
		value: (page = 1) => {
			return new Promise((resolve, reject) => {
				Application.getPlatformInstance().then((platform) => {
					platform.services.message.getConversationsV5(page).then((resp) => {

						if(resp.isError){
							return reject(new Application.Error(
								Application.Error.codes.bungie_net_error,
								"",
								resp
							));
						}

						var conversations = [];

						resp.response.results.forEach((result) => {
							conversations.push(Application.Conversation.parseResult(
								result, resp.response));
						});

						return resolve({
							conversations: conversations,
							response: resp
						});

					}, reject);
				});
			});
		}
	},

	create: {
		/**
		 * Create a new conversation when no conversationId exists
		 * @param  {array} membersTo array of membership id values as strings, including sender
		 * @param  {string} body      content of the message
		 * @return {Promise}           new conversation id is returned
		 */
		value: (membersTo, body = "") => {
			return new Promise((resolve, reject) => {
				Application.getPlatformInstance().then((platform) => {
					platform.services.message.createConversation(membersTo, body).then((resp) => {

						if(resp.isError){
							return reject(new Application.Error(
								Application.Error.codes.bungie_net_error,
								"",
								resp
							));
						}

						var conversationId = parseInt(resp.response, 10);

						return resolve({
							conversationId: conversationId,
							resp: resp
						});

					}, reject);
				});
			});
		}
	},

	leave: {
		value: (conversationId) => {
			return new Promise((resolve, reject) => {
				Application.getPlatformInstance().then((platform) => {
					platform.services.message.leaveConversation(conversationId).then((resp) => {

						if(resp.isError){
							return reject(new Application.Error(
								Application.Error.codes.bungie_net_error,
								"",
								resp
							));
						}

						return resolve({
							resp: resp
						});

					}, reject);
				});
			});
		}
	}

});
Object.defineProperties(Application.Conversation.prototype, {

	participants: {
		value: [],
		writable: true
	},

	messages: {
		value: [],
		writable: true
	},

	group: {
		value: null,
		writable: true
	},

	getLastSender: {
		/**
		 * Returns the last sender User object
		 * @return {User} [description]
		 */
		value: function() {
			var arr = this.participants
				.filter(u => u.membershipId === this.memberFromId);
			return arr.length > 0 ? arr[0] : null;
		}
	},

	getStarter: {
		/**
		 * Returns the User object for the starting user
		 * @return {User} [description]
		 */
		value: function() {
			var arr = this.participants
				.filter(u => u.membershipId === this.starter);
			return arr.length > 0 ? arr[0] : null;
		}
	},

	getTargetRecipient: {
		/**
		 * Returns the User object for the target recipient
		 * @return {User} [description]
		 */
		value: function() {
			var arr = this.participants
				.filter(u => u.membershipId === this.targetMembershipId);
			return arr.length > 0 ? arr[0] : null;
		}
	},

	getHtmlEncodedBody: {
		/**
		 * Returns the body without HTML encoding
		 * @return {String} [description]
		 */
		value: function() {
			return this.body;
		}
	},

	getHtmlDecodedBody: {
		/**
		 * Returns the body after HTML encoding
		 * @return {String} [description]
		 */
		value: function() {
			return Cola.functions.string.htmlDecode(this.body);
		}
	},

	getSummaryText: {
		/**
		 * Returns a summary of the body after HTML encoding
		 * @param  {Number} maxLength [description]
		 * @return {String}           [description]
		 */
		value: function(maxLength = 100) {

			var str = this.getHtmlDecodedBody();

			if(str.length > maxLength){
				return str.substring(0, maxLength) + "...";
			}

			return str;

		}
	}

});

Object.defineProperties(Application, { Group: {
	value: function(){ }
} });
Object.defineProperties(Application.Group, {

	parseResult: {
		/**
		 * Parses a group object from bungie.net
		 * @param  {Object} result [description]
		 * @return {Group}        [description]
		 */
		value: (result) => {

			var g = new Application.Group();

			//Copy values
			for(var prop in result){
				g[prop] = result[prop];
			}

			g.creationDate = new Date(g.creationDate);
			g.deletionDate = new Date(g.deletionDate);
			g.modificationDate = new Date(g.modificationDate);

			return g;

		}
	}

});
Object.defineProperties(Application.Group.prototype, {

	getAvatarLink: {
		/**
		 * Returns a URI with the group's avatar link
		 * @return {URI} [description]
		 */
		value: function() {
			return BungieNet.base.resource(this.avatarPath);
		}
	},

	getBannerPath: {
		/**
		 * Returns a URI with the group's banner link
		 * @return {URI} [description]
		 */
		value: function() {
			return BungieNet.base.resource(this.bannerPath);
		}
	},

	getLink: {
		/**
		 * Generates a URI pointing to the group's home
		 * @return {Promise} [description]
		 */
		value: function() {
			return new Promise((resolve) => {
				BungieNet.getLocaleBase().then((base) => {

					var link = base
						.segment("Clan")
						.segment("Forum")
						.segment(this.groupId.toString());

					return resolve(link);

				});
			});
		}
	},

	getForumLink: {
		/**
		 * Generates a URI pointing to the group's forum
		 * @return {Promise} [description]
		 */
		value: function() {
			return new Promise((resolve) => {
				BungieNet.getLocaleBase().then((base) => {

					var link = base
						.segment("Clan")
						.segment("Forum")
						.segment(this.groupId.toString())
						.segment("0") //0th page
						.segment(BungieNet.enums.forumTopicsSort.last_replied.toString())
						.segment(BungieNet.enums.forumTopicsCategoryFilters.none.toString());

					return resolve(link);

				});
			});
		}
	}

});

Object.defineProperties(Application, { Message: {
	value: function(){ }
} });
Object.defineProperties(Application.Message, {

	parseResult: {
		/**
		 * Parses a message response from bungie.net
		 * @param  {Object} result [description]
		 * @param  {Object} user   [description]
		 * @return {Message}        [description]
		 */
		value: (result, user) => {

			var msg = new Application.Message();

			for(var prop in result){
				if(result.hasOwnProperty(prop)){
					msg[prop] = result[prop];
				}
			}

			msg.conversationId = parseInt(msg.conversationId, 10);
			msg.dateSent = new Date(msg.dateSent);
			msg.invitationId = parseInt(msg.invitationId, 10);
			msg.memberFromId = parseInt(msg.memberFromId, 10);
			msg.messageId = parseInt(result.messageId, 10);

			msg.sender = user;

			return msg;

		}
	}

});
Object.defineProperties(Application.Message.prototype, {

	sender: {
		/**
		 * @type {User}
		 */
		value: null,
		writable: true
	},

	getRawBody: {
		value: function() {
			return Cola.functions.string.htmlDecode(this.body);
		}
	},

	getHtmlDecodedBody: {
		value: function() {
			return this.body;
		}
	}

});

Object.defineProperties(Application, { User: {
	value: function(){ }
} });
Object.defineProperties(Application.User, {

	parseResult: {
		/**
		 * Parses a user object from bungie.net
		 * @param  {Object} result [description]
		 * @return {User}        [description]
		 */
		value: (result) => {

			var u = new Application.User();

			for(var prop in result){
				u[prop] = result[prop];
			}

			u.firstAccess = new Date(u.firstAccess);
			u.followerCount = parseInt(u.followerCount, 10);
			u.followingUserCount = parseInt(u.followingUserCount, 10);
			u.lastBanReportId = parseInt(u.lastBanReportId, 10);
			u.lastUpdate = new Date(u.lastUpdate);
			u.membershipId = parseInt(u.membershipId, 10);
			u.statusDate = new Date(u.statusDate);
			u.successMessageFlags = parseInt(u.successMessageFlags, 10);

			return u;

		}
	},

	fetchFollowedUsers: {
		/**
		 * Fetches this user's followed users
		 * @return {Promise} [description]
		 */
		value: () => {
			return new Promise((resolve, reject) => {
				Application.getPlatformInstance().then((platform) => {
					platform.services.activity.getUsersFollowed().then((resp) => {

						if(resp.isError){
							return reject(new Application.Error(
								Application.Error.codes.bungie_net_error,
								"",
								resp
							));
						}

						var users = resp.response.results.map((u) => {
							return Application.User.parseResult(u.user);
						});

						return resolve(users);

					}, reject);
				});
			});
		}
	},

	updateStatus: {
		/**
		 * Updates this user's status
		 * @param  {String} text [description]
		 * @return {Promise}      [description]
		 */
		value: (text) => {
			return new Promise((resolve, reject) => {
				var opts = { statusText: text };
				Application.getPlatformInstance().then((platform) => {
					platform.services.user.updateUser(opts).then((resp) => {

						if(resp.isError){
							return reject(new Application.Error(
								Application.Error.codes.bungie_net_error,
								"",
								resp
							));
						}

						return resolve(resp);

					}, reject);
				});
			});
		}
	},

	isAuthenticated: {
		value: () => {
			return new Promise((resolve, reject) => {
				BungieNet.currentUser.authenticated().then(resolve, reject);
			});
		}
	}

});
Object.defineProperties(Application.User.prototype, {

	getHtmlDecodedAbout: {
		value: function() {
			return Cola.functions.string.htmlDecode(this.about);
		}
	},

	getAccountAge: {
		/**
		 * Returns the number of milliseconds this user has been a member for
		 * @return {Number} [description]
		 */
		value: function() {
			return Date.getTime() - this.firstAccess.getTime();
		}
	},

	getAvatarLink: {
		/**
		 * Returns a URI of this user's avatar
		 * @return {URI} [description]
		 */
		value: function() {

			var uri = new URI(this.profilePicturePath);

			if(uri.is("relative")){
				uri = BungieNet.base.resource(uri.resource());
			}

			return uri;

		}
	},

	getLastActiveDate: {
		/**
		 * Returns the most recent date this user's profile has changed
		 * @return {Date} [description]
		 */
		value: function() {

			var dates = [
				this.firstAccess,
				this.lastUpdate,
				this.statusDate
			].map(d => d);

			if(dates.length === 0){
				return null;
			}
			else if(dates.length === 1){
				return dates[0];
			}

			return dates.reduce((a, b) => {
				return a > b ? a : b;
			});

		}
	},

	getProfileLink: {
		/**
		 * Generates a link to this user's profile
		 * @return {Promise} [description]
		 */
		value: function() {
			return new Promise((resolve) => {
				BungieNet.getLocaleBase().then((uri) => {

					uri
						.segment("Profile")
						.segment(BungieNet.enums.bungieMembershipType.bungie_next.toString())
						.segment(this.membershipId.toString());

					return resolve(uri);

				});
			});
		}
	},

	getStatusText: {
		/**
		 * Returns HTML decoded status text
		 * @return {String} [description]
		 */
		value: function() {
			return Cola.functions.string.htmlDecode(this.statusText);
		}
	}

});
