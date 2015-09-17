(function(globalScope) {
	"use strict";

	var Cola = {
		database: { },
		exceptions: { },
		functions: { }
	};



	Cola.functions.string = { };
	Object.defineProperties(Cola.functions.string, {

		none: {
			value: ""
		},

		compare: {
			value: (a, b) => {

				if(a < b){
					return -1;
				}
				else if(a > b){
					return 1;
				}

				return 0;

			}
		},

		limitText: {
			value: (str, sentencesToDisplay) => {
			}
		},

		slowEquals: {
			value: (str1, str2) => {

				var l1 = str1.length;
				var l2 = str2.length;
				var diff = str1.length ^ str2.length;

				for(var i = 0; i < l1 && i < l2; ++i){
					diff |= str1.charCodeAt(i) ^ str2.charCodeAt(i);
				}

				return diff === 0;

			}
		},

		contains: {
			value: (str, find) => {
				return str.indexOf(find) >= 0;
			}
		},

		pluralise: {
			value: (str) => {

				if(str.length === 0){
					return str;
				}

				if(str[str.length - 1].toLowerCase() === "s"){
					return str + "'";
				}

				return str + "'s";

			}
		},

		startsWith: {
			value: (str, find) => {
				return str.indexOf(find) === 0;
			}
		},

		endsWith: {
			value: (str, find) => {
				return str.indexOf(find, str.length - find.length) !== -1;
			}
		},

		strMatch: {
			value: (str, regex) => {
				return regex.test(str);
			}
		},

		headerStringToArray: {
			value: (str) => {
			}
		},

		strInArray: {
			value: (arr, str, caseSensitive) => {

				caseSensitive = caseSensitive || true;

				if(!caseSensitive){
					str = str.toLowerCase();
					arr = arr.map(function(s){
						return s.toLowerCase();
					});
				}

				return arr.some(function(s){
					return s === str;
				});

			}
		},

		arrayInStr: {
			value: (keywords, str, caseSensitive) => {

				caseSensitive = caseSensitive || true;

				if(!caseSensitive){
					str = str.toLowerCase();
					keywords = keywords.map((k) => { return k.toLowerCase(); });
				}

				return keywords.some((s) => { return str.indexOf(s) >= 0; });

			}
		},

		htmlEncode: {
			value: (str) => {

				if(document){
					return document.createElement("a").appendChild(
						document.createTextNode(str)).parentNode.innerHTML;
				}

				return str
					.replace(/&/g, "&amp;")
					.replace(/"/g, "&quot;")
					.replace(/'/g, "&#39;")
					.replace(/</g, "&lt;")
					.replace(/>/g, "&gt;");

			}
		},

		htmlDecode: {
			value: (str) => {

				if(document){
					var a = document.createElement("s"); a.innerHTML = str;
					return a.textContent;
				}

				return str
					.replace(/&#(\d+);/g, (match, dec) => {
						return String.fromCharCode(dec);
					})
					.replace(/&quot;/g, "\"")
					.replace(/&apos;/g, "'")
					.replace(/&lt;/g, "<")
					.replace(/&gt;/g, ">")
					.replace(/&amp;/g, "&");

			}
		}

	});

	//////

	Cola.functions.boolean = { };
	Object.defineProperties(Cola.functions.boolean, {

		boolVal: {
			value: (val) => {
				return !!val;
			}
		},

		toString: {
			value: (bool) => {
				return bool ? "true" : "false";
			}
		}

	});

	//////

	Cola.functions.date = { };
	Object.defineProperties(Cola.functions.date, {

		relativeTimestamp: {
			value: (date) => {

				var diff = Date.now() - date.getTime();
				var isPast = diff >= 0;
				var isFuture = !isPast;
				var seconds = Math.abs(diff) / 1000;
				var minutes = seconds / 60;
				var hours = minutes / 60;
				var days = hours / 24;
				var months = days / 31;
				var years = months / 12;

				var str = !isPast ? "in " : "";

				if(years >= 1){
					str += Math.floor(years) + " year" + (Math.floor(years) !== 1 ? "s" : "");
				}
				else if(months >= 1){
					str += Math.floor(months) + " month" + (Math.floor(months) !== 1 ? "s" : "");
				}
				else if(days >= 1){

					if(days >= 1 && days < 2){
						return isPast ? "yesterday" : "tomorrow";
					}

					str += Math.floor(days) + " day" + (Math.floor(days) !== 1 ? "s" : "");

				}
				else if(hours >= 1){
					str += Math.floor(hours) + " hour" + (Math.floor(hours) !== 1 ? "s" : "");
				}
				else if(minutes >= 1){
					str += Math.floor(minutes) + " minute" + (Math.floor(minutes) !== 1 ? "s" : "");
				}
				else{

					if(seconds < 1){
						return "just now";
					}
					else{
						str += Math.floor(seconds) + " second" + (Math.floor(seconds) !== 1 ? "s" : "");
					}

				}

				return str + (isPast ? " ago" : "");

			}
		}

	});

	//////

	Cola.functions.function = { };
	Object.defineProperties(Cola.functions.function, {

		nop: {
			value: () => { }
		}

	});

	//////

	Cola.functions.object = { };
	Object.defineProperties(Cola.functions.object, {

		copy: {
			value: (value) => {
				return Object.assign({}, value);
			}
		},

		propertiesExist: {
			value: (obj) => {

				for(var i = 1, l = arguments.length - 1; i <= l; ++i){
					if(!(arguments[i] in obj)){
						return false;
					}
				}

				return true;

			}
		}

	});

	//////

	Cola.functions.array = { };
	Object.defineProperties(Cola.functions.array, {

		each: {
			value: (arr, action) => {
				for(var i = 0, l = arr.length; i < l; ++i){
					action(arr[i]);
				}
			}
		},

		every: {
			value: (arr, predicate) => {
				return arr.every(predicate);
			}
		},

		filter: {
			value: (arr, predicate) => {
				return arr.filter(predicate);
			}
		},

		find: {
			value: (arr, predicate) => {
				return Cola.functions.array.some(arr, predicate);
			}
		},

		findKey: {
			value: (arr, predicate) => {
				for(var i = 0, l = arr.length; i < l; ++i){
					if(predicate(arr[i])){
						return i;
					}
				}
				return null;
			}
		},

		isAssociative: {
			value: (arr) => {
				return arr !== null && typeof arr === "object";
			}
		},

		keysExist: {
			value: Cola.functions.object.propertiesExist
		},

		last: {
			value: (arr, index) => {
				return arr.length - 1 === index;
			}
		},

		map: {
			value: (arr, callback) => {
				return arr.map(callback);
			}
		},

		single: {
			value: (arr, predicate) => {

				for(var i = 0, l = arr.length; i < l; ++i){
					if(predicate(arr[i])){
						return arr[i];
					}
				}

				return undefined;

			}
		},

		some: {
			value: (arr, predicate) => {
				return arr.some(predicate);
			}
		}

	});

	//

	globalScope.Cola = Cola;

})(this);
