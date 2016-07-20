
//we want the button clickable and to open up the main chat window
//but we don't want to actually show the window which appears
window.resizeTo(0, 0);

$(document).ready(() => {

  //if the main window is already open, grab a ref and focus
  //on it
  Application.getMainWindowId().then((windowId) => {
    let dialog = new Application.Dialog(windowId);
    dialog.focus();
  }, () => {
    //if not, create it
    Application.Dialog.create("/html/main.html");
  }).then(() => {
    //and immediately get rid of the popup window
    window.close();
  });

});
