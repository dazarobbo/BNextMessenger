
chrome.runtime.onInstalled.addListener((reason) => {

  if(reason !== chrome.runtime.OnInstalledReason.INSTALL){
    return;
  }

  //Set storage defaults
  var obj = {};

  obj[Application.constants.storageKeys.themeName] =
    Application.constants.themes.light;
  obj[Application.constants.storageKeys.emojiSupport] = true;
  obj[Application.constants.storageKeys.statusUpdates] = false;

  chrome.storage.sync.set(obj);

});
