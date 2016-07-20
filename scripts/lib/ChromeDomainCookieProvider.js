class ChromeDomainCookieProvider{

	constructor(domain){
		this.domain = domain;
	}

	get(name){
		return this.getMatching(c => c.name === name);
	}

	getAll(){
		return new Promise(resolve => {
			chrome.cookies.getAll({ domain: this.domain }, (cookies) => {
				return resolve(Array.from(cookies));
			});
		});
	}

	getMatching(predicate){
		return new Promise(resolve => {
			this.getAll().then(cookies => resolve(cookies.filter(predicate)));
		});
	}

	toString(){
		return `Domain: ${this.domain}`;
	}

}
