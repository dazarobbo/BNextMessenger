var thisDialog;
var currentPmPage = 0;
var currentGroupPage = 0;
var navItems = [
  {
    name: chrome.i18n.getMessage("application_menu_private"),
    icon: "mail",
    handler: showPrivateMessages
  },
  {
    name: chrome.i18n.getMessage("application_menu_group"),
    icon: "group",
    handler: showGroupMessages,
  },
  {
    name: chrome.i18n.getMessage("application_menu_settings"),
    icon: "settings",
    handler: showSettings
  },
  {
    name: chrome.i18n.getMessage("application_menu_about"),
    icon: "info",
    handler: showAbout
  }
];


/**
 * [formatBuddy description]
 * @param  {[type]} u [description]
 * @return {[type]}   [description]
 * @deprecated
 */
function formatBuddy(u){
	return new Promise((resolve) => {

		//in the last 30 minutes
		var since = Date.now() - (30 * 60 * 1000);
		var lastActive = u.getLastActiveDate();
		var isOnline = lastActive >= since;

		var li = $("<li>")
			.addClass("collection-item avatar")
			.append(
				$("<img>").attr({
					src: u.getAvatarLink(),
					"class": "circle"
				}),
				$("<span>").css({
					marginRight: "50px",
					wordWrap: "break-word"
				}).addClass("title").text(u.displayName),
				$("<p>").css({
					marginRight: "10px",
					wordWrap: "break-word"
				}).text(u.statusText),
				$("<a>").attr({
					href: "#!",
					title: (() => {

						var str = "last online: ";

						if(lastActive.getFullYear() < 2000){
							str += "not available";
						}
						else{
							str += Application.getLongDateFormat(lastActive);
						}

						return str;

					}),
					"class": "secondary-content center"
				}).text(isOnline ? "online" : "offline")
			)
			.click(() => {
				chrome.windows.create({
					url: "conversation2.html?membershipId=" + u.membershipId,
					type: "popup",
					focused: true,
					width: Application.constants.dialogWindowWidth,
					height: Application.constants.dialogWindowHeight
				});
			});

		if(isOnline){
			li.addClass("user-online");
		}

		return resolve(li);

	});
}

function formatPm(pm){
	return new Promise((resolve) => {
		BungieNet.currentUser.getMembershipId().then((myId) => {

			var others = pm.participants.filter(u => u.membershipId !== myId);

			var li = $("#messageTemplate").find("li").clone();

			li.find("img").attr("src", others.length > 0 ?
				others[0].getAvatarLink() :
				BungieNet.defaultAvatar);
			li.find("span").text(others.length > 0 ?
				others.map(u => u.displayName).join("; ") :
				chrome.i18n.getMessage("error_unknown_user"));
			li.find("p").text(pm.getHtmlDecodedBody());
			li.find("a")
				.attr("title", Application.getLongDateFormat(pm.lastMessageSent))
				.text(Cola.functions.date.relativeTimestamp(pm.lastMessageSent));
			li.click(() => {
        Application.getConversationWindowId(pm.conversationId).then((wndwId) => {
          (new Application.Dialog(wndwId)).focus();
        }, () => {
  				Common.openConversationWindow(pm.conversationId);
        });
			});

			return resolve(li);

		});
	});
}

function formatGroupPm(conv){
	return new Promise((resolve) => {

		var li = $("#messageTemplate").find("li").clone();

		li.find("img").attr("src", conv.group.getAvatarLink());
		li.find("span").text(conv.group.name);
		li.find("p").text(conv.getHtmlDecodedBody());
		li.find("a")
			.attr("title", Application.getLongDateFormat(conv.lastMessageSent))
			.text(Cola.functions.date.relativeTimestamp(conv.lastMessageSent));
		li.click(() => {
      Application.getConversationWindowId(conv.conversationId).then((wndwId) => {
        (new Application.Dialog(wndwId)).focus();
      }, () => {
	     Common.openConversationWindow(conv.conversationId);
     });
		});

		return resolve(li);

	});
}

function getPageableEnder(){

  var ender = $("#pageableEnderTemplate").find("div").clone();

  ender.find("a").text(chrome.i18n.getMessage("application_pageable_load_button"));
  ender.find("span").text(chrome.i18n.getMessage("application_pageable_no_more"));

  return ender;

}

function addLocaleElements(){
  return new Promise((resolve, reject) => {

    $("#private").append(getPageableEnder());

    $("#group").append(getPageableEnder());


    //settings
    var statusSection = $("#settings div.section:eq(0)");
    statusSection.find("h5").text(
      chrome.i18n.getMessage("application_settings_status_updates_heading"));
    statusSection.find("p > label").text(
      chrome.i18n.getMessage("application_settings_status_updates_summary"));

    var emojiSection = $("#settings div.section:eq(1)");
    emojiSection.find("h5").text(
      chrome.i18n.getMessage("application_settings_emoji_heading"));
    emojiSection.find("p > label").text(
      chrome.i18n.getMessage("application_settings_emoji_summary"));

    var themeSection = $("#settings div.section:eq(2)");
    themeSection.find("h5").text(
      chrome.i18n.getMessage("application_settings_theme_heading"));

    var themeName;
    for(var key in Application.constants.themes){
      themeName = Application.constants.themes[key];
      themeSection.append(
        $("<p>").append(
          $("<input>").attr({
            name: "themeGrp",
            type: "radio",
            id: "theme-" + themeName + "-rad",
            value: themeName
          }),
          $("<label>").attr({
            for: "theme-" + themeName + "-rad"
          }).text(chrome.i18n.getMessage(
            "application_settings_theme_option_" + themeName))
        )
      );
    }

    return resolve();

  });
}

function addEventHandlers(){
	return new Promise((resolve) => {

		$("#private").find(".collectionFooter").find("a").click(function(){
			$(this).addClass("disabled");
			loadPrivateMessages().then(() => $(this).removeClass("disabled"));
		});

		$("#group").find(".collectionFooter").find("a").click(function(){
			$(this).addClass("disabled");
			loadGroupMessages().then(() => $(this).removeClass("disabled"));
		});

		//

		$("#updateStatusChk").change(function() {
			Application.setSyncValue(
				Application.constants.storageKeys.statusUpdates, $(this).prop("checked"));
		});

		$("#emojiChk").change(function(){
			Application.setSyncValue(
				Application.constants.storageKeys.emojiSupport, $(this).prop("checked"));
		});

		$("input[name='themeGrp']").change(function(e){
			Application
				.setSyncValue(Application.constants.storageKeys.themeName, $(this).val())
				.then(Common.applyThemeFromStorage());
		});

		return resolve();

	});
}

//

function loadPrivateMessages(){
	return new Promise((resolve) => {
		Application.Conversation.fetchPrivateMessages(++currentPmPage).then((appResp) => {
			Promise.all(appResp.conversations.map(formatPm)).then((elements) => {

				//Append the new conversations
				$("#private").find(".collection").append(elements);

				var ender = $("#private").find("> div").removeClass("hide");

				//Check if there are any more
				if(appResp.response.response.hasMore){
					ender.find("span").addClass("hide");
					ender.find("a").removeClass("hide");
				}
				else{
					ender.find("a").addClass("hide");
					ender.find("span").removeClass("hide");
				}

			});
		}, (err) => {
			currentPmPage = Math.max(0, --currentPmPage);
			Common.handleError(err);
		}).then(() => resolve());
	});
}

function loadGroupMessages(){
	return new Promise((resolve) => {
		Application.Conversation.fetchGroupMessages(++currentGroupPage).then((appResp) => {
			Promise.all(appResp.conversations.map(formatGroupPm)).then((elements) => {

				$("#group").find(".collection").append(elements);

				var ender = $("#group").find("> div").removeClass("hide");

				//Check if there are any more
				if(appResp.response.response.hasMore){
					ender.find("span").addClass("hide");
					ender.find("a").removeClass("hide");
				}
				else{
					ender.find("a").addClass("hide");
					ender.find("span").removeClass("hide");
				}

			});
		}, (err) => {
			currentGroupPage = Math.max(0, --currentGroupPage);
			Common.handleError(err);
		}).then(() => resolve());
	});
}

/**
 * [loadBuddies description]
 * @return {[type]} [description]
 * @deprecated
 */
function loadBuddies(){
	return new Promise((resolve, reject) => {

		Common.showLoader();

		Application.User.fetchFollowedUsers().then((users) => {

			users = users.sort((a, b) => {
				return a.displayName.localeCompare(b.displayName);
			});

			Promise.all(users.map(formatBuddy)).then((elements) => {
				$("#buddies").find(".collection").append(elements);
			});

		}, Common.handleError).then(() => {
			return resolve();
		});

	});
}

//

function showPrivateMessages(){
	return new Promise((resolve) => {

		thisDialog.setPageTitle(
      chrome.i18n.getMessage("application_menu_private").toLocaleLowerCase());

		//Reset
		$("#private")
      .removeClass("hide")
			.find(".collectionFooter").addClass("hide")
			.children().addClass("hide");

		$("#private").find(".collection").empty();

		Common.showLoader();

		currentPmPage = 0;

		loadPrivateMessages().then(() => {
      Common.hideLoader();
      return resolve();
    });

	});
}

function showGroupMessages(){
	return new Promise((resolve) => {

		thisDialog.setPageTitle(
			chrome.i18n.getMessage("application_menu_group").toLocaleLowerCase());

		//Reset
		$("#group")
      .removeClass("hide")
			.find("> div").addClass("hide")
			.children().addClass("hide");

		$("#group").find(".collection").empty();

		Common.showLoader();

		currentGroupPage = 0;

		loadGroupMessages().then(() => {
      Common.hideLoader();
      return resolve();
    });

	});
}

function showBuddies(){
	return new Promise((resolve, reject) => {

		$("#logo").text(
			chrome.i18n.getMessage("application_menu_buddies").toLocaleLowerCase());

		Common.showLoader();
		$("#buddies").find(".collection").empty();

		loadBuddies().then(() => {
			Common.hideLoader();
			resolve();
		});

	});
}

function showSettings(){
	return new Promise((resolve) => {

		thisDialog.setPageTitle(
			chrome.i18n.getMessage("application_menu_settings").toLocaleLowerCase());

    $("#settings")
      .removeClass("hide");

		//Load in existing values

		Application.getSyncValue(Application.constants.storageKeys.statusUpdates)
			.then(checked => $("#updateStatusChk").prop("checked", checked));

		Application.getSyncValue(Application.constants.storageKeys.emojiSupport)
			.then(checked => $("#emojiChk").prop("checked", checked));

		Application.getSyncValue(Application.constants.storageKeys.themeName)
			.then((name) => {
				$("input[name='themeGrp']").each(function(){
					$(this).prop("checked", $(this).val() === name);
				});
			});

		return resolve();

	});
}

function showAbout(){
	return new Promise((resolve) => {

		thisDialog.setPageTitle(
			chrome.i18n.getMessage("application_menu_about").toLocaleLowerCase());

    $("#about")
      .removeClass("hide");

		var strings = [
			chrome.i18n.getMessage("application_about_1"),
			chrome.i18n.getMessage("application_about_2"),
			chrome.i18n.getMessage("application_about_3"),
			chrome.i18n.getMessage(
					"application_about_4",
					Cola.functions.string.htmlEncode(chrome.runtime.getManifest().version)
			)
		];

		$("#about").find("p").each(function(i){
			$(this).html(strings[i]);
		});

		return resolve();

	});
}

//

function dialogReady(){

  Application.User.isAuthenticated().then((result) => {

    if(!result){
      throw new Application.Error(Application.Error.codes.not_authenticated);
    }

    addLocaleElements()
      .then(addEventHandlers)
      .then(showPrivateMessages);

  })
  .catch(Common.handleError);

}

$(document).ready(() => {
  Application.Dialog.fromCurrent().then((dialog) => {
    thisDialog = dialog;
    dialog.init().then(() => {
      return thisDialog.addNavigation(navItems);
    }).then(dialogReady);
  });
});
