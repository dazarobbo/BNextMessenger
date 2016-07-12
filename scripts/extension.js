//init

//if browser is chrome
Application.browserAdaptor = new ChromeAdaptor();
//else
//something, something firefox

BungieNet.cookies.provider = new ChromeDomainCookieProvider(BungieNet.domain);
