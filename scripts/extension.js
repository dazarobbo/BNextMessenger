//init

//TODO: all message id should be treated as bigints
//TODO: use @@ui_locale to better display messages
//TODO: maybe switch to moment.js

Application.browserAdaptor = new ChromeAdaptor();
BungieNet.Cookies.provider = new ChromeDomainCookieProvider(BungieNet.domain);
