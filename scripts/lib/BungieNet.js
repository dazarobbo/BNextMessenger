/* jshint sub: true */

((__scope) => {
	"use strict";

	var cookieProvider = null;

	//

	var BungieNet = { };
	Object.defineProperties(BungieNet, {

		defaultLocale: {
			value: "en"
		},

		scheme: {
			value: "https"
		},

		domain: {
			value: "bungie.net"
		},

		host: {
			get: () => {
				return "www." + BungieNet.domain;
			}
		},

		base: {
			/**
			 * [description]
			 * @return {URI} [description]
			 */
			get: () => {
				return new URI({
					protocol: BungieNet.scheme,
					hostname: BungieNet.host
				});
			}
		},

		getLocaleBase: {
			/**
			 * [description]
			 * @return {Promise} [description]
			 */
			value: () => {
				return new Promise((resolve, reject) => {
					BungieNet.getLocale().then((loc) => {
						return resolve(BungieNet.base.segment(loc));
					}, reject);
				});
			}
		},

		platformPath: {
			/**
			 * [description]
			 * @return {URI} [description]
			 */
			get: () => {
				return BungieNet.base.segment("Platform");
			}
		},

		cookieProvider: {
			get: () => {

				if(cookieProvider === null){
					cookieProvider = new CookieProvider();
				}

				return cookieProvider;

			},
			set: (provider) => {
				cookieProvider = provider;
			}
		},

		getLocale: {
			value: () => {
				return new Promise((resolve, reject) => {
					//Use the current user's default locale if it exists
					//otherwise use the default locale
					BungieNet.currentUser.getLocale().then((loc) => {
						return resolve(loc);
					}, () => {
						return resolve(BungieNet.defaultLocale);
					});
				});
			}
		}

	});

	BungieNet.enums = {

		aclEnum: {
			none: 0,
			bnext_forum_ninja: 1,
			bnext_unlimited_groups: 2,
			bnext_founder_in_all_groups: 3,
			bnext_bungie_gold: 4,
			bnext_ninja_colors: 5,
			bnext_make_official_topics: 6,
			bnext_make_ninja_topics: 7,
			bnext_delete_forum_topics: 8,
			bnext_overturn_reports: 9,
			bnext_browse_reports: 10,
			bnext_global_ignore: 11,
			bnext_edit_any_public_post: 12,
			bnext_edit_users: 13,
			bnext_ultra_ban: 14,
			bnext_forum_mentor: 15,
			tiger_ban: 16,
			bnext_forum_curator: 17,
			bnext_big_likes: 18,
			bnext_player_support: 19,
			bnext_pin_topics: 20,
			bnext_lock_topics: 21
		},

		activityAggregationType: {
			none: 0,
			activities: 1,
			followers: 2
		},

		activityItemOrigin: {
			undetermined: -1,
			followed_group: 0,
			followed_user: 1,
			activities_about_me: 2,
			my_activities: 3
		},

		activityQueryFilter: {
			all: 0,
			friends: 1,
			followers: 2,
			groups: 3,
			mine: 4,
			tags: 5,
			clans: 6
		},

		activityStatus: {
			processing: 0,
			failed: 1,
			skipped: 2,
			complete: 3
		},

		activityType: {
			create: 0,
			edit: 1,
			"delete": 2,
			rate: 3,
			follow: 4,
			unfollow: 5,
			apply: 6,
			rescind: 7,
			approve: 8,
			deny: 9,
			kick: 10,
			edit_membership_type: 11,
			like: 12,
			unlike: 13,
			share: 14,
			tagged_group: 15,
			tagged_topic: 16,
			avatar_changed: 17,
			display_name_changed: 18,
			title_changed: 19,
			title_unlocked: 20,
			group_topic_create: 21,
			group_reply_create: 22,
			reply: 23,
			change_clan_name: 24,
			group_alliance_rejected: 26
		},

		affectedItemType: {
			none: -1,
			user: 0,
			post: 1,
			topic: 2,
			group: 3,
			tag: 4
		},

		bucketCategory: {
			invisible: 0,
			item: 1,
			currency: 2,
			equippable: 3,
			ignored: 4
		},

		bungieCredentialType: {
			none: 0,
			xuid: 1,
			psnid: 2,
			wlid: 3,
			fake: 4,
			facebook: 5,
			google: 8,
			windows: 9,
			demonid: 10
		},

		bungieMembershipType: {
			all: -1,
			none: 0,
			tiger_xbox: 1,
			tiget_psn: 2,
			tiger_demon: 10,
			bungie_next: 254
		},

		clientDeviceType: {
			unknown: 0,
			xbox360: 1,
			playstation3: 2,
			android_phone: 3,
			android_tablet: 4,
			apple_phone: 5,
			apple_tablet: 6,
			web_browser: 7,
			native_windows: 8,
			native_mac: 9,
			windows_phone: 10,
			windows_tablet: 11,
			xbox_one: 12,
			playstation4: 13,
			fake: 255
		},

		contentDateRange: {
			all: 0,
			today: 1,
			yesterday: 2,
			this_month: 3,
			this_year: 4,
			last_year: 5,
			earlier_than_last_year: 6
		},

		contentDateType: {
			specific: 0,
			month_only: 1,
			custom: 2
		},

		contentSortBy: {
			creation_date: 0,
			cms_path: 1,
			modified_date: 2
		},

		damageType: {
			none: 0,
			kinetic: 1,
			arc: 2,
			thermal: 3,
			"void": 4,
			raid: 5
		},

		destinyActivityModeType: {
			none: 0,
			story: 2,
			strike: 3,
			raid: 4,
			all_pvp: 5,
			patrol: 6,
			all_pve: 7,
			pvp_introduction: 8,
			three_vs_three: 9,
			control: 10,
			lockdown: 11,
			team: 12,
			free_for_all: 13,
			trials_of_osiris: 14,
			doubles: 15,
			nightfall: 16,
			heroic: 17,
			all_strikes: 18,
			iron_banner: 19,
			all_arena: 20,
			arena: 21,
			arena_challenge: 22
		},

		destinyClass: {
			titan: 0,
			hunter: 1,
			warlock: 2,
			unknown: 3
		},

		destinyDefinitionType: {
			none: 0,
			activity: 1,
			activity_type: 2,
			"class": 3,
			gender: 4,
			inventory_bucket: 5,
			inventory_item: 6,
			progression: 7,
			race: 8,
			stat: 9,
			talent_grid: 10,
			stat_group: 11,
			unlock_flag: 12,
			vendor: 13,
			destination: 14,
			place: 15,
			directory_book: 16,
			material_requirement: 17,
			sandbox_perk: 18,
			art_dye: 19,
			art_dye_channel: 20,
			activity_bundle: 21,
			gear_asset: 22
		},

		destinyExplorerBuckets: {
			none: 0,
			artifact: 1,
			materials: 2,
			consumables: 4,
			mission: 8,
			bounties: 16,
			build: 32,
			primary_weapon: 64,
			special_weapon: 128,
			heavy_weapon: 256,
			head: 512,
			arms: 1024,
			chest: 2048,
			legs: 4096,
			class_items: 8192,
			ghost: 16384,
			vehicle: 32758,
			ship: 65536,
			shader: 131072,
			emblem: 262144
		},

		destinyExplorerOrderBy: {
			none: 0,
			name: 1,
			item_type: 2,
			rarity: 3,
			item_type_name: 4,
			item_stat_hash: 5,
			minimum_required_level: 6,
			maximum_required_level: 7
		},

		destinyGender: {
			male: 0,
			female: 1,
			unknown: 2
		},

		destinyItemSubType: {
			none: 0,
			crucible: 1,
			vanguard: 2,
			iron_banner: 3,
			queen: 4,
			exotic: 5,
			auto_rifle: 6,
			shotgun: 7,
			machinegun: 8,
			hand_cannon: 9,
			rocket_launcher: 10,
			fusion_rifle: 11,
			sniper_rifle: 12,
			pulse_rifle: 13,
			scout_rifle: 14,
			camera: 15,
			crm: 16,
			sidearm: 17
		},

		destinyItemType: {
			none: 0,
			currency: 1,
			armor: 2,
			weapon: 3,
			bounty: 4,
			completed_bounty: 5,
			bounty_reward: 6,
			message: 7,
			engram: 8,
			consumable: 9,
			exchange_material: 10,
			mission_reward: 11,
			quest_step: 12,
			quest_step_complete: 13
		},

		destinyRace: {
			human: 0,
			awoken: 1,
			exo: 2,
			unknown: 3
		},

		destinyStatsGroupType: {
			none: 0,
			general: 1,
			weapons: 2,
			medals: 3,
			enemies: 4,
			reserved_groups: 100,
			leaderboard: 101,
			activity: 102,
			unique_weapon: 103,
			internal: 104
		},

		destinyTalentNodeState: {
			invalid: 0,
			can_upgrade: 1,
			no_points: 2,
			no_prerequisites: 3,
			no_steps: 4,
			no_unlock: 5,
			no_material: 6,
			no_grid_level: 7,
			swapping_locked: 8,
			must_swap: 9,
			complete: 10,
			unknown: 11,
			creation_only: 12
		},

		entityType: {
			none: 0,
			user: 1,
			group: 2,
			post: 3,
			invitation: 4,
			report: 5,
			activity: 6,
			conversation: 7,
			tag: 8
		},

		equipFailureReason: {
			none: 0,
			item_unequippable: 1,
			item_unique_equip_restricted: 2,
			item_failed_unlock_check: 4,
			item_failed_level_check: 8,
			item_not_on_character: 16
		},

		externalService: {
			none: 0,
			twitter: 1,
			facebook: 2,
			youtube: 3,
			twitter_help: 4
		},

		forumFlagsEnum: {
			none: 0,
			bungie_staff_post: 1,
			forum_ninja_post: 2,
			forum_mentor_post: 4,
			topic_bungie_staff_posted: 8,
			topic_bungie_volunteer_posted: 16,
			question_answered_by_bungie: 32,
			question_answered_by_ninja: 64
		},

		forumPostCategory: {
			none: 0,
			text_only: 1,
			media: 2,
			link: 4,
			poll: 8,
			question: 16,
			answered: 32,
			announcement: 64,
			content_comment: 128,
			bungie_official: 256
		},

		forumPostCategoryEnums: {
			none: 0,
			text_only: 1,
			media: 2,
			link: 4,
			poll: 5,
			question: 16,
			answered: 32,
			announcement: 64,
			content_comment: 128,
			bungie_official: 256,
			ninja_official: 512
		},

		forumPostPopularity: {
			empty: 0,
			"default": 1,
			discussed: 2,
			cool_story: 3,
			heating_up: 4,
			hot: 5
		},

		forumPostSortEnum: {
			"default": 0,
			oldest_first: 1
		},

		forumTopicsCategoryFilters: {
			none: 0,
			links: 1,
			questions: 2,
			answered_questions: 4,
			media: 8,
			text_only: 16,
			announcement: 32,
			bungie_official: 64,
			polls: 128
		},

		forumTopicsCategoryFiltersEnum: {
			none: 0,
			links: 1,
			questions: 2,
			answered_questions: 4,
			media: 8,
			text_only: 16,
			announcement: 32,
			bungie_official: 64,
			polls: 128
		},

		forumTopicsQuickDate: {
			all: 0,
			last_year: 1,
			last_month: 2,
			last_week: 3,
			last_day: 4
		},

		forumTopicsQuickDateEnum: {
			all: 0,
			last_year: 1,
			last_month: 2,
			last_week: 3,
			last_day: 4
		},

		forumTopicsSort: {
			"default": 0,
			last_replied: 1,
			most_replied: 2,
			popularity: 3,
			controversiality: 4,
			liked: 5,
			highest_rated: 6
		},

		forumTopicsSortEnum: {
			"default": 0,
			last_replied: 1,
			most_replied: 2,
			popularity: 3,
			controversiality: 4,
			liked: 5,
			highest_rated: 6
		},

		forumTypeEnum: {
			"public": 0,
			news: 1,
			group: 2,
			alliance: 3
		},

		friendOnlineStatus: {
			offline: 0,
			online: 1,
			idle: 2
		},

		groupClanEnableStatus: {
			not_applicable: 0,
			clan_enabled_success: 1,
			clan_enabled_failure: 2
		},

		groupDateRange: {
			all: 0,
			past_day: 1,
			past_week: 2,
			past_month: 3,
			past_year: 4
		},

		groupHomepage: {
			wall: 0,
			forum: 1,
			alliance_forum: 2
		},

		groupMemberCountFilter: {
			all: 0,
			one_to_ten: 1,
			eleven_to_one_hundred: 2,
			greater_than_one_hundred: 3
		},

		groupSortBy: {
			name: 0,
			date: 1,
			popularity: 2,
			id: 3
		},

		groupTypeSearchFilter: {
			all: 0,
			group: 1,
			clan: 2
		},

		ignoreLength: {
			none: 0,
			week: 1,
			two_weeks: 2,
			three_weeks: 3,
			month: 4,
			three_months: 5,
			six_months: 6,
			year: 7,
			forever: 8,
			three_minutes: 9,
			hour: 10
		},

		ignoreStatus: {
			not_ignored: 0,
			ignored_user: 1,
			ignored_group: 2,
			ignored_by_group: 4,
			ignored_post: 8,
			ignored_tag: 16,
			ignored_global: 32
		},

		ignoredItemType: {
			all: 0,
			post: 1,
			group: 2,
			user: 3,
			tag: 4
		},

		invitationResponseState: {
			unreviewed: 0,
			approved: 1,
			rejected: 2
		},

		itemBindStatus: {
			not_bound: 0,
			bound_to_character: 1,
			bound_to_account: 2,
			bound_to_guild: 3
		},

		itemLocation: {
			unknown: 0,
			inventory: 1,
			vault: 2,
			vendor: 3,
			postmaster: 4
		},

		membershipOption: {
			reviewed: 0,
			open: 1,
			closed: 2
		},

		notificationMethod: {
			email: 1,
			mobile_push: 2,
			web_only: 4
		},

		notificationType: {
			message: 1,
			forum_reply: 2,
			new_activity_rollup: 3,
			settings_change: 4,
			group_acceptance: 5,
			group_join_request: 6,
			follow_user_activity: 7,
			friend_user_activity: 8,
			forum_like: 9,
			followed: 10,
			group_banned: 11,
			banned: 12,
			unbanned: 13,
			group_open_join: 14,
			group_alliance_join_requested: 15,
			group_alliance_join_rejected: 16,
			group_alliance_join_approved: 17,
			group_alliance_broken: 18,
			group_denial: 19,
			warned: 20,
			clan_disabled: 21,
			group_alliance_invite_requested: 22,
			group_alliance_invite_rejected: 23,
			group_alliance_invite_approved: 24,
			group_followed_by_group: 25,
			grimoire_unobserved_cards: 26
		},

		offerRedeemMode: {
			off: 0,
			unlock: 1,
			platform: 2,
			expired: 3,
			consumable: 4
		},

		optInFlags: {
			newsletter: 1,
			system: 2,
			marketing: 4,
			user_research: 8,
			customer_service: 16
		},

		periodType: {
			none: 0,
			daily: 1,
			monthly: 2,
			all_time: 3,
			activity: 4
		},

		reportResolutionStatus: {
			unresolved: 0,
			innocent: 1,
			guilty_ban: 2,
			guilty_blast_ban: 3,
			guilty_warn: 4,
			guilty_alias: 5,
			resolve_no_action: 6
		},

		requestedPunishment: {
			ban: 0,
			warn: 1,
			blast_ban: 2
		},

		statFeedbackState: {
			good: 0,
			too_high: 1,
			too_low: 2,
			wrong_name: 4
		},

		successMessages: {
			following: 1,
			unfollowing: 2,
			managing_group_members: 8,
			updating_settings: 16,
			managing_groups: 32
		},

		surveyCompletionFlags: {
			none: 0,
			user_research_web_page_one: 1,
			user_research_web_page_two: 2
		},

		textParameterSearchType: {
			contains: 0,
			exact: 1,
			starts_with: 2,
			ends_with: 3
		},

		tierType: {
			unknown: 0,
			currency: 1,
			basic: 2,
			common: 3,
			rare: 4,
			superior: 5,
			exotic: 6
		},

		unitType: {
			none: 0,
			count: 1,
			per_game: 2,
			seconds: 3,
			points: 4,
			team: 5,
			distance: 6,
			percent: 7,
			ratio: 8,
			boolean: 9,
			weapon_type: 10,
			standing: 11
		},

		vendorItemStatus: {
			success: 0,
			no_inventory_space: 1,
			no_funds: 2,
			no_progression: 4,
			no_unlock: 8,
			no_quantity: 16,
			outside_purchase_window: 32,
			not_available: 64,
			uniqueness_violation: 128,
			unknown_error: 256,
			already_selling: 512,
			unsellable: 1024,
			selling_inhibited: 2048
		}

	};

	BungieNet.Error = function(code, message, data){
		this.code = code;
		this.message = message || "";
		this.data = data;
		this.stack = (new Error()).stack;
	};
	BungieNet.Error.prototype = Object.create(Error.prototype);
	BungieNet.Error.prototype.constructor = BungieNet.Error;

	Object.defineProperties(BungieNet.Error, {
		codes: {
			value: {

				no_cookie_by_name: 1,
				network_error: 2,
				no_csrf_token: 3,
				corrupt_response: 4

			}
		}
	});

	BungieNet.cookies = { };
	Object.defineProperties(BungieNet.cookies, {

		get: {
			value: (name) => {
				return new Promise((resolve, reject) => {
					BungieNet.cookies
						.getMatching(c => c.name === name)
						.then((cookies) => {

							if(cookies.length === 0){
								return reject(new BungieNet.Error(
									BungieNet.Error.codes.no_cookie_by_name
								));
							}

							return resolve(cookies[0]);

						});
				});
			}
		},

		getAll: {
			value: () => {
				return BungieNet.cookieProvider
					.getMatching(c => c.domain.endsWith(BungieNet.domain));
			}
		},

		getMatching: {
			value: (predicate) => {
				return new Promise((resolve) => {
					BungieNet.cookies
						.getAll()
						.then(cookies => resolve(cookies.filter(predicate)));
				});
			}
		},

		getSessionCookies: {
			value: () => {
				return BungieNet.cookies.getMatching(c => c.session);
			}
		},

		getValue: {
			value: (name) => {
				return new Promise((resolve, reject) => {
					BungieNet.cookies
						.get(name)
						.then(cookie => resolve(cookie.value), reject);
				});
			}
		}

	});

	BungieNet.currentUser = { };
	Object.defineProperties(BungieNet.currentUser, {

		authenticated: {
			/**
			 * Returns a bool for whether the user is signed in
			 * based on cookie existence
			 * @return {Promise} [description]
			 */
			value: () => {
				return new Promise((resolve) => {

					//if cookie found, resolve as true
					//if it isn't found, resolve as false
					BungieNet.cookies
						.get("bungleatk")
						.then(
							() => resolve(true),
							() => resolve(false)
						);

				});
			}
		},

		getCsrfToken: {
			value: () => {
				return BungieNet.cookies.getValue("bungled");
			}
		},

		getMembershipId: {
			value: () => {
				return new Promise((resolve, reject) => {
					BungieNet.cookies
						.getValue("bungleme")
						.then(id => resolve(parseInt(id, 10)), reject);
				});
			}
		},

		getTheme: {
			value: () => {
				return BungieNet.cookies.getValue("bungletheme");
			}
		},

		getLocale: {
			value: () => {
				return new Promise((resolve, reject) => {
					BungieNet.cookies
						.getValue("bungleloc")
						.then((str) => {
							var arr = /&?lc=(.+?)(?:$|&)/i.exec(str);
							return resolve(arr[1]);
						}, reject);
				});
			}
		}

	});

	BungieNet.Platform = function(opts) {

		this._options = {
			apiKey: "",
			userContext: true,
			timeout: 5000,
			beforeSend: Cola.functions.function.nop,
			onStateChange: Cola.functions.function.nop
		};

		for(var x in this._options){
			if(opts.hasOwnProperty(x)){
				this._options[x] = opts[x];
			}
		}

		this.services = BungieNet.Platform.Service.getServices(this);

	};
	Object.defineProperties(BungieNet.Platform, {

		headers: {
			value: {
				apiKey: "X-API-Key",
				csrf: "X-CSRF"
			}
		}

	});
	Object.defineProperties(BungieNet.Platform.prototype, {

		/**
		 * @param {string} method
		 * @param {URI} uri
		 * @param {string} data
		 * @returns {Promise}
		 */
		httpRequest: {
			value: function(method, uri, data) {
				return new Promise((resolve, reject) => {

					var promises = [];

					var xhr = new XMLHttpRequest();
					xhr.open(method, uri.toString(), true);
					xhr.setRequestHeader(BungieNet.Platform.headers.apiKey, this._options["apiKey"]);
					xhr.timeout = this._options["timeout"];

					xhr.onreadystatechange = () => {

						this._options.onStateChange(xhr);

						if(xhr.readyState === 4){
							if(xhr.status === 200){
								return resolve(xhr.responseText);
							}
							else{
								return reject(new BungieNet.Error(
									BungieNet.Error.codes.network_error,
									xhr.status,
									xhr
								));
							}
						}

					};

					if(this._options["userContext"]){
						promises.push(BungieNet.currentUser.getCsrfToken()
							.then((token) => {
								xhr.withCredentials = true;
								xhr.setRequestHeader(BungieNet.Platform.headers.csrf, token);
							}, () => {
								return reject(new BungieNet.Error(
									BungieNet.Error.codes.no_csrf_token
								));
							})
						);
					}

					Promise.all(promises).then(() => {
						this._options.beforeSend(xhr);
						xhr.send(data ? data : void(0));
					});

				});
			}
		},

		key: {
			set: function(key) {
				this._options["apiKey"] = key;
			},
			get: function() {
				return this._options["apiKey"];
			}
		},

		userContext: {
			set: function(ok) {
				this._options["userContext"] = Cola.functions.boolean.boolVal(ok);
			},
			get: function() {
				return this._options["userContext"];
			}
		},

		timeout: {
			set: function(timeout) {
				this._options["timeout"] = timeout;
			},
			get: function() {
				return this._options["timeout"];
			}
		},

		services: {
			value: { },
			writable: true
		}

	});

	BungieNet.Platform.Service = function(namespace, platform, endpoints) {

		this._getNamespace = () => namespace;
		this._getPlatform = () => platform;

		for(var endpointName in endpoints){
			if(endpoints.hasOwnProperty(endpointName)){
				this[endpointName] = endpoints[endpointName].bind(this);
			}
		}

	};
	Object.defineProperties(BungieNet.Platform.Service.prototype, {

		_serviceRequest: {
			/**
			 * @param {URI} endpoint
			 * @param {string} method
			 * @param {string|void} data
			 * @returns {Promise}
			 */
			value: function(endpoint, method, data) {

				method = method || "GET";

				var fullUri = BungieNet.platformPath
						.segment(this._getNamespace())
						.segment(endpoint.resource());

				return new Promise((resolve, reject) => {
					BungieNet.getLocale().then((loc) => {
						fullUri.addQuery("lc", loc);
						this._getPlatform()
							.httpRequest(method, fullUri, JSON.stringify(data))
							.then((respText) => {

								var obj;

								try{
									obj = JSON.parse(respText);
								}
								catch(err){
									return reject(new BungieNet.Error(
										BungieNet.Error.codes.corrupt_response
									));
								}

								return resolve(BungieNet.Platform.Response.parse(obj));

							}, reject);
					});
				});

			}
		}

	});
	Object.defineProperties(BungieNet.Platform.Service, {

		getServices: {
			value: (platform) => {
				return {

					//Activity service
					activity: new BungieNet.Platform.Service("Activity", platform, {

						getUsersFollowed: function() {
							return this._serviceRequest(new URI(
									"Following/Users/"));
						}

					}),

					//Message service
					message: new BungieNet.Platform.Service("Message", platform, {

						createConversation: function(membersToId, body) {
							return this._serviceRequest(
								new URI("CreateConversation/"),
								"POST",
								{
									membersToId: membersToId,
									body: body
								}
							);
						},

						getConversationsV5: function(page) {
							return this._serviceRequest(URI.expand(
								"GetConversationsV5/{page}/", {
								page: page
							}));
						},

						getConversationByIdV2: function(id) {
							return this._serviceRequest(URI.expand(
								"GetConversationByIdV2/{id}/", {
								id: id
							}));
						},

						getConversationThreadV3: function(id, page) {
							return this._serviceRequest(URI.expand(
								"GetConversationThreadV3/{id}/{page}/", {
								id: id,
								page: page
							}));
						},

						getConversationWithMemberIdV2: function(mId) {
							return this._serviceRequest(URI.expand(
								"/GetConversationWithMemberV2/{id}/", {
								id: mId
							}));
						},

						getGroupConversations: function(page) {
							return this._serviceRequest(URI.expand(
								"GetGroupConversations/{page}/", {
								page: page
							}));
						},

						leaveConversation: function(conversationId){
							return this._serviceRequest(URI.expand(
								"LeaveConversation/{id}/", {
									id: conversationId
								}
							));
						},

						saveMessageV3: function(body, conversationId) {
							return this._serviceRequest(
								new URI("SaveMessageV3/"),
								"POST",
								{
									body: body,
									conversationId: conversationId
								});
						},

						userIsTyping: function(conversationId) {
							return this._serviceRequest(
									new URI("UserIsTyping/"),
									"POST",
									{
										conversationId: conversationId
									});
						}

					}),

					//User service
					user: new BungieNet.Platform.Service("User", platform, {

						getAvailableAvatars: function() {
							return this._serviceRequest(new URI(
									"GetAvailableAvatars/"));
						},

						getAvailableThemes: function() {
							return this._serviceRequest(new URI(
									"GetAvailableThemes/"));
						},

						getBungieAccount: function(membershipType, membershipId) {
							return this._serviceRequest(URI.expand(
									"GetBungieAccount/{membershipType}/{membershipId}/", {
										membershipType: membershipType,
										membershipId: membershipId
									}));
						},

						getCountsForCurrentUser: function() {
							return this._serviceRequest(new URI(
									"GetCounts/"));
						},

						getCurrentUser: function() {
							return this._serviceRequest(new URI(
									"GetBungieNetUser/"));
						},

						updateUser: function(opts) {
							return this._serviceRequest(new URI(
									"UpdateUser/"), "POST", opts);
						}

					})

				};
			}
		}

	});

	BungieNet.Platform.Response = function(){ };
	Object.defineProperties(BungieNet.Platform.Response.prototype, {

		response: {
			value: { },
			writable: true
		},

		errorCode: {
			value: 0,
			writable: true
		},

		throttleSeconds: {
			value: 0,
			writable: true
		},

		errorStatus: {
			value: 0,
			writable: true
		},

		message: {
			value: "",
			writable: true
		},

		messageData: {
			value: { },
			writable: true
		},

		//

		isError: {
			get: function() {
				return this.errorCode !== 1;
			}
		}

	});
	Object.defineProperties(BungieNet.Platform.Response, {

		parse: {
			value: (o) => {

				var r = new BungieNet.Platform.Response();

				r.errorCode = o.ErrorCode;
				r.errorStatus = o.ErrorStatus;
				r.message = o.Message;
				r.messageData = o.MessageData;
				r.response = o.Response;
				r.throttleSeconds = o.throttleSeconds;

				return r;

			}
		}

	});

	BungieNet.User = function(){ };
	Object.defineProperties(BungieNet.User.prototype, {

		about: {
			value: "",
			writable: true
		},

		context: {
			value: null,
			writable: true
		},

		ignoreStatus: {
			value: null,
			writable: true
		},

		isFollowing: {
			value: false,
			writable: true
		},

		displayName: {
			value: "",
			writable: true
		},

		firstAccess: {
			value: new Date(0),
			writable: true
		},

		followerCount: {
			value: 0,
			writable: true
		},

		followingUserCount: {
			value: 0,
			writable: true
		},

		isDeleted: {
			value: false,
			writable: true
		},

		lastBanReportId: {
			value: "0",
			writable: true
		},

		lastUpdate: {
			value: new Date(0),
			writable: true
		},

		locale: {
			value: "en",
			writable: true
		},

		localeInheritDefault: {
			value: true,
			writable: true
		},

		membershipId: {
			value: "0",
			writable: true
		},

		profilePicture: {
			value: 0,
			writable: true
		},

		profilePicturePath: {
			value: "/",
			writable: true
		},

		profileTheme: {
			value: 0,
			writable: true
		},

		profileThemeName: {
			value: "",
			writable: true
		},

		psnDisplayName: {
			value: "",
			writable: true
		},

		showActivity: {
			value: true,
			writable: true
		},

		showGroupMessaging: {
			value: true,
			writable: true
		},

		statusDate: {
			value: new Date(0),
			writable: true
		},

		statusText: {
			value: "",
			writable: true
		},

		successMessageFlags: {
			value: "0",
			writable: true
		},

		uniqueName: {
			value: "",
			writable: true
		},

		userTitle: {
			value: 0,
			writable: true
		},

		userTitleDisplay: {
			value: "",
			writable: true
		},

		xboxDisplayName: {
			value: "",
			writable: true
		},

		////// - CUSTOM - //////

		getAboutText: {
			value: function() {
				return Cola.functions.string.htmlDecode(this.about);
			}
		},

		getAccountAge: {
			value: function() {
				return Date.getTime() - this.firstAccess.getTime();
			}
		},

		getAvatarLink: {
			value: function() {

				var uri = new URI(this.profilePicturePath);

				if(uri.is("relative")){
					uri = BungieNet.base.resource(uri.resource());
				}

				return uri;

			}
		},

		getProfileLink: {
			value: () => {
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
		}

	});
	Object.defineProperties(BungieNet.User, {

		defaultAvatar: {
			get: () => {
				return BungieNet.base.path("/img/profile/avatars/default_avatar.gif");
			}
		},

		parse: {
			value: (o) => {

				var u = new BungieNet.User();

				u.about = o.about;
				u.context = o.context;
				u.ignoreStatus = o.ignoreStatus;
				u.isFollowing = o.isFollowing;
				u.displayName = o.displayName;
				u.firstAccess = new Date(o.firstAccess);
				u.followerCount = o.followerCount;
				u.followingUserCount = o.followingUserCount;
				u.isDeleted = o.isDeleted;
				u.lastBanReportId = o.lastBanReportId;
				u.lastUpdate = new Date(o.lastUpdate);
				u.locale = o.locale;
				u.localeInheritDefault = o.localeInheritDefault;
				u.membershipId = o.membershipId;
				u.profilePicture = o.profilePicture;
				u.profilePicturePath = o.profilePicturePath;
				u.profileTheme = o.profileTheme;
				u.profileThemeName = o.profileThemeName;
				u.psnDisplayName = o.psnDisplayName;
				u.showActivity = o.showActivity;
				u.showGroupMessaging = o.showGroupMessaging;
				u.statusDate = new Date(o.statusDate);
				u.statusText = o.statusText;
				u.successMessageFlags = o.successMessageFlags;
				u.uniqueName = o.uniqueName;
				u.userTitle = o.userTitle;
				u.userTitleDisplay = o.userTitleDisplay;
				u.xboxDisplayName = o.xboxDisplayName;

				return u;

			}
		}

	});


	__scope.BungieNet = BungieNet;

})(this);
