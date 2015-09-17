$(document).ready(() => {
  Application.Dialog.fromCurrent().then((dialog) => {

    dialog.init().then(() => {
      dialog.focus();
    });

  });
});
