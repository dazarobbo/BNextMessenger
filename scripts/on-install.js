
chrome.runtime.onInstalled.addListener((details) => {

  if(details.reason !== chrome.runtime.OnInstalledReason.INSTALL){
    return;
  }

  //Set storage defaults
  var obj = {};

  obj[Application.constants.storageKeys.themeName] =
    Application.constants.themes.light;
  obj[Application.constants.storageKeys.emojiSupport] = true;
  obj[Application.constants.storageKeys.statusUpdates] = false;

  console.log("Storage defaults installed");
  chrome.storage.sync.set(obj);

});
