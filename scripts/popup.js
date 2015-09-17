
window.resizeTo(0, 0);

$(document).ready(() => {

  Application.getMainWindowId().then((windowId) => {
    var dialog = new Application.Dialog(windowId);
    dialog.focus();
  }, () => {
    Application.Dialog.create("main.html");
  }).then(() => {
    window.close();
  });

});
