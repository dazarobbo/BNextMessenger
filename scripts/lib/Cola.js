class Cola{

}

//

Cola.String = class{

	static compare(a, b){

		if(a < b){
			return -1;
		}
		else if(a > b){
			return 1;
		}

		return 0;

	}

	static limitText(str, sentencesToDisplay = 2){
		//TODO: implement
	}

	static slowEquals(str1, str2){

		let l1 = str1.length;
		let l2 = str2.length;
		let diff = str1.length ^ str2.length;

		for(let i = 0; i < l1 && i < l2; ++i){
			diff |= str1.charCodeAt(i) ^ str2.charCodeAt(i);
		}

		return diff === 0;

	}

	static contains(str, find){
		return str.indexOf(find) >= 0;
	}

	static pluralise(str){

		if(str.length === 0){
			return str;
		}

		if(str[str.length - 1].toLowerCase() === "s"){
			return `${str}'`;
		}

		return `${str}'s`;

	}

	static startsWith(str, find){
		return str.indexOf(find) === 0;
	}

	static endsWith(str, find){
		return str.indexOf(find, str.length - find.length) !== -1;
	}

	static strMatch(str, regex){
		return regex.test(str);
	}

	static headerStringToArray(str){
		//TODO: implement
	}

	static strInArray(arr, str, caseSensitive = true){

		let keywords = arr;
		let tempStr = str;

		if(!caseSensitive){
			tempStr = tempStr.toLowerCase();
			keywords = keywords.map(s => s.toLowerCase());
		}

		return keywords.some(s => s === str);

	}

	static arrayInStr(arr, str, caseSensitive = true){

		let tempStr = str;
		let keywords = arr;

		if(!caseSensitive){
			tempStr = tempStr.toLowerCase();
			keywords = keywords.map(k => k.toLowerCase());
		}

		return keywords.some(s => str.indexOf(s) >= 0);

	}

	static htmlEncode(str){

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

	static htmlDecode(str){

		if(document){
			let a = document.createElement("s"); a.innerHTML = str;
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

};

Cola.String.none = "";

//

Cola.Boolean = class{

	static boolVal(val){
		return !!val;
	}

	static toString(val){
		return val ? "true" : "false";
	}

};

//

Cola.Date = class{

	static relativeTimestamp(date){

		let diff = Date.now() - date.getTime();
		let isPast = diff >= 0;
		let isFuture = !isPast;
		let seconds = Math.abs(diff) / 1000;
		let minutes = seconds / 60;
		let hours = minutes / 60;
		let days = hours / 24;
		let months = days / 31;
		let years = months / 12;

		let str = !isPast ? "in " : "";

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

};

//

Cola.Function = class{

	static nop(){

	}

};

//

Cola.Object = class{

	static copy(value){
		return Object.assign({}, value);
	}

	static propertiesExist(obj, ...args){
		//TODO: pop?
		let keys = Object.keys(obj);
		return args.every(p => keys.find(p));
	}

};

//

Cola.Array = class{

	static isAssociative(arr){
		return arr !== null && typeof arr === "object";
	}

};
