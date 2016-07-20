
chrome.runtime.onInstalled.addListener((details) => {

  if(details.reason !== chrome.runtime.OnInstalledReason.INSTALL){
    return;
  }

  //Set storage defaults
  let obj = {};

  obj[Application.constants.storageKeys.themeName] =
    Application.constants.themes.light;
  obj[Application.constants.storageKeys.emojiSupport] = true;
  obj[Application.constants.storageKeys.statusUpdates] = false;

  Application.log("Storage defaults installed");
  chrome.storage.sync.set(obj); //TODO: what about errors?

  //Set uninstall URL
  chrome.runtime.setUninstallURL(
    "https://www.bungie.net/en/Clan/Post/1138602/154853377");

});
