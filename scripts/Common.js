

var Common = {

	populateNav: (items) => {
		return new Promise((resolve) => {

      //{
      //  name: "name in the menu",
      //  title: "top of page text",
      //  icon: "material icon name",
      //  target: "jquery object of target page to show",
      //  handler: function callback when item is clicked
      //}

			$("#sideMenu").append(items.map((item) => {

				return $("<li>").css("cursor", "pointer").addClass("valign-wrapper").append(

          $("<i>").addClass("material-icons left valign").css({
						color: "rgba(0, 0, 0, 0.54)",
						margin: 0
					}).text(item.icon ? item.icon : ""),

					$("<a>").attr("href", "#!").text(item.name)

				).click(() => {

          //Hide all shown pages
          $("#content").find("> section").addClass("hide");

          //Hide the nav
					$(".button-collapse").sideNav("hide");

          //Show target page
          if(item.target){
            item.target.removeClass("hide");
          }

					item.handler();

				});

			}));

			$(".button-collapse").sideNav({
				menuWidth: 150,
				edge: "left",
				closeOnClick: true
			});

			resolve();

		});
	},

	showLoader: () => {
		return new Promise((resolve) => {
			$("#loader").slideDown();
			resolve();
		});
	},

	hideLoader: () => {
		return new Promise((resolve) => {
			$("#loader").slideUp();
			resolve();
		});
	},

	displayMessage: (msg) => {
		return new Promise((resolve) => {
			Materialize.toast(msg, 5000);
			resolve();
		});
	},

	applyThemeFromName: (themeName) => {
		return new Promise((resolve) => {
			$("link[rel='alternate stylesheet']").each(function(){
				$(this).prop("disabled", $(this).attr("title") !== themeName);
			});
			resolve();
		});
	},

  applyThemeFromStorage: () => {
    return new Promise((resolve) => {
      Application
        .getSyncValue(Application.constants.storageKeys.themeName)
        .then((themeName) => {
          Common.applyThemeFromName(themeName)
						.then(() => resolve());
        });
    });
  },

	loadStylesheets: () => {

		for(var name in Application.constants.themes){
			$("<link>").attr({
				type: "text/css",
				rel: "alternate stylesheet",
				href: "css/" + name + "-theme.css",
				title: name,
				disabled: "disabled"
			}).appendTo("head");
		}

	},

  applySizing: () => {
    return new Promise((resolve) => {

      //$(document.body).css({
      //  width: Application.constants.dialogWindowWidth,
      //  height: Application.constants.dialogWindowHeight
      //});

      //Prevent resize
      $(window).resize(() => {

        var height = window.outerHeight;
        var width = window.outerWidth;

        if(height < Application.constants.dialogWindowMinHeight){
          height = Application.constants.dialogWindowMinHeight;
        }

        if(width !== Application.constants.dialogWindowWidth){
          width = Application.constants.dialogWindowWidth;
        }

        window.resizeTo(width, height);

      });

			//initial size
			window.resizeTo(
				Application.constants.dialogWindowWidth,
				Application.constants.dialogWindowHeight
			);

      resolve();

    });
  },

  handleError: (err) => {

		console.log("Error thrown...");
		console.log(err);

		var str;

		if(err instanceof Error){
			str = err.toString();
		}
		else{
			str = chrome.i18n.getMessage("application_error_unknown");
		}

		Common.displayMessage(Cola.functions.string.htmlEncode(str));

  },

	openConversationWindow: (conversationId) => {
		chrome.windows.create({
			url: "conversation.html?conversationId=" + conversationId,
			type: "popup",
			focused: true,
			width: Application.constants.dialogWindowWidth,
			height: Application.constants.dialogWindowHeight
		});
	},

	getAttention: () => {
		chrome.windows.update(
			chrome.windows.WINDOW_ID_CURRENT,
			{
				drawAttention: true
			}
		);
	},

	platformRequestErrorHandler: (appErr) => {

		//TODO: use of this should be replace with error handler above

		if("code" in appErr){

			if(appErr.code === Application.Error.codes.bungie_net_error){
				Common.displayMessage(chrome.i18n.getMessage("application_error_code_1", [
					appErr.data.errorCode,
					appErr.data.errorStatus
				]));
			}
			else{
				Common.displayMessage(chrome.i18n.getMessage(
					"application_error_code_" + appErr.code));
			}

		}
		else{
			Common.displayMessage(chrome.i18n.getMessage("application_error_unknown"));
		}

	}

};