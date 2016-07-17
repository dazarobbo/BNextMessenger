var thisDialog;
var messages = [];
var convDetails = null;
var needsRefocus = false;
var timeoutId;
var intervals = {
  min: 7000,
	default: 15000,
	max: 60000
};
var navItems = [
  {
    name: "Conversation",
    icon: "chat",
    handler: showConversation
  },
  {
    name: "Details",
    icon: "info_outline",
    handler: showDetails
  },
  {
    name: "Settings",
    icon: "settings",
    handler: showSettings
  }
];

//

function showMoreArrow(){
	return new Promise((resolve) => {
		$("#conversation > div > i.material-icons").removeClass("hide");
		return resolve();
	});
}

function hideMoreArrow(){
	return new Promise((resolve) => {
		$("#conversation > div > i.material-icons").addClass("hide");
		return resolve();
	});
}

//

function formatBody(html){

	return Promise.resolve(Cola.functions.string.htmlEncode(html))
		.then((str) => {

			//Basic replacements
			str = str.replace(/\[b\](.*?)\[\/b\]/ig, (_, txt) => {
				return "<b>" + txt + "</b>";
			});

			str = str.replace(/\[i\](.*?)\[\/i\]/ig, (_, txt) => {
				return "<i>" + txt + "<i>";
			});

			str = str.replace(/\[u\](.*?)\[\/u\]/ig, (_, txt) => {
				return "<u>" + txt + "</u>";
			});

			//Don't loop this!
			//Only allow one [quote]text[/quote] nesting
			str = str.replace(/\[quote\](.*?)\[\/quote\]/igm, (_, txt) => {
				return "<blockquote>" + txt + "</blockquote>";
			});

			str = str.replace(/\[spoiler\]([\s\S]*?)\[\/spoiler\]/ig, (_, txt) => {
				return "<span class=\"spoiler\">" + txt + "</span>";
			});

			//Condense extraneous lines
			str = str.replace(/(\r?\n){2,}/g, "<br><br>");
			str = str.replace(/\r?\n/g, "<br>");

			return Promise.resolve(str);

		})
		.then((str) => {

			//Hyperlinks
			var regex = /(\bhttps?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

			str = str.replace(regex, (_, p1) => {
				return $("<a>").attr({
					href: Cola.functions.string.htmlEncode(encodeURI(p1)),
					target: "_blank",
					title: Cola.functions.string.htmlEncode(p1)
				}).text(p1)[0].outerHTML;
			});

			return Promise.resolve(str);

		})
		.then((str) => {
			return new Promise((resolve) => {

				//TODO: This regex is too loose!
				var regex = /@([^\s]{1,25})/ig;
				var matches = (() => {
					var m;
					var arr = [];
					while((m = regex.exec(str))){
						arr.push(m[1]);
					}
					return arr;
				})();
				var promises = [];

				//if there are no matches just exit
				if(matches.length === 0){
					return resolve(str);
				}

				//1. lower case all matched usernames
				//2. generate unique array
				//3. map the usernames to user objects where possible
				//4. filter out nulls
				//5. generate promises which resolve profile links
				promises = matches
					.map(s => s.toLocaleLowerCase())
					.filter((v, i, arr) => arr.indexOf(v) === i)
					.map((username) => {

						var participantMatches = convDetails.participants
							.filter(u => u.displayName.toLocaleLowerCase() === username);

						if(participantMatches.length > 0){
							return participantMatches[0];
						}

						var messageMatches = messages
							.map(record => record.msg.sender)
							.filter(u => u.displayName.toLocaleLowerCase() === username);

						if(messageMatches.length > 0){
							return messageMatches[0];
						}

						return null;

					})
					.filter(user => user !== null)
					.map((user) => {
						return new Promise((resolve) => {
							user.getProfileLink().then((link) => {
								resolve({
									user: user,
									profileLink: link
								});
							});
						});
					});

				//With all promises resolved, start replacing the usernames
				//with the resolves links from above
				Promise.all(promises).then((users) => {

					str = str.replace(regex, (match, name) => {

						var theUser = users.filter((u) => {
							return u.user.displayName.toLocaleLowerCase() === name.toLocaleLowerCase();
						})[0];

						//No user available so just return the string
						if(!theUser){
							return match;
						}

						var anchor = $("<a>").attr({
							target: "_blank",
							href:  Cola.functions.string.htmlEncode(encodeURI(theUser.profileLink)),
							title: Cola.functions.string.htmlEncode(theUser.user.displayName)
						})
						.text("@" + theUser.user.displayName);

						return anchor[0].outerHTML;

					});

					//when all replacements done, resolve the string
					return resolve(str);

				});

			});
		})
		.then((str) => {
			return new Promise((resolve) => {
				BungieNet.getLocaleBase().then((base) => {

					//#tag
					var regex = /(\#([a-zA-Z\u00C0-\u017F\u01FA-\u0217][a-zA-Z\u00C0-\u017F\u01FA-\u0217_0-9]{2,29}))(?!.*?\[\/(url|google)\])/gi;

					str = str.replace(regex, (match, _, tag) => {

						var href = base
							.segment("Forum")
							.segment("Topics")
							.segment("0") //page
							.segment(BungieNet.enums.forumTopicsSort.last_replied.toString()) //latest
							.segment(BungieNet.enums.forumTopicsCategoryFilters.none.toString()) //no filter
							.segment(tag.toLocaleLowerCase())
							.toString();

						var anchor = $("<a>")
							//.css({ fontWeight: "bold" })
							.attr({
								target: "_blank",
								href:  Cola.functions.string.htmlEncode(href),
								title: "#" + Cola.functions.string.htmlEncode(tag.toLocaleLowerCase())
							})
							.text("#" + tag.toLocaleLowerCase());

						return anchor[0].outerHTML;

					});

					return resolve(str);

				});
			});
		})
		.then((str) => {
			return new Promise((resolve) => {
				Application.getSyncValue(Application.constants.storageKeys.emojiSupport).then((doEmoji) => {

					var regex = /^([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])$/;
					var onlyEmoji = regex.test(str.trim());

					if(doEmoji){

            //if string only contains an emoji
						if(onlyEmoji){
							str = str.trim();
						}

						str = twemoji.parse(str, (iconId, opts) => {
              //default size under v2 is now 72x72, this is too big!
							return "".concat(opts.base, opts.size, "/", iconId, opts.ext);
						});

					}

					return resolve(str);

				});
			});
		});

}

function formatMessage(m){
	return new Promise((resolve) => {

		var li = $("#messageTemplate").find("li").clone();

		li.find("img").attr("src", m.sender.getAvatarLink());
		li.find("span").text(m.sender.displayName);
		li.find("a")
			.attr("title", Application.getLongDateFormat(m.dateSent))
			.text((() => {

				var yesterday = new Date();
				yesterday.setDate(yesterday.getDate() - 1);

				var options = {
					hour12: true
				};

				if(m.dateSent >= yesterday){
					options.hour = "numeric";
					options.minute = "2-digit";
				}
				else{
					options.day = "numeric";
					options.month = "numeric";
					options.year = "numeric";
				}

				return m.dateSent.toLocaleString([], options);

			})());

		formatBody(m.getRawBody()).then((html) => {
			li.find("p").html(html);
			return resolve(li);
		});

	});
}

//

function getMessagePage(page){
	return Application.Conversation
    .fetchFromConversationId(convDetails.conversationId, page);
}

function getNewMessages(){
	return new Promise((resolve, reject) => {
		getMessagePage(0).then((appResp) => {

			//find the existing last id seen
			var lastId = messages.length > 0 ?
				messages
					.map(record => record.msg.messageId)
					.reduce((a, b) => Math.max(a, b), -1)
				: -1;

			//add new messages
			appResp.messages.forEach((msg) => {
				if(!messages.some(record => record.msg.messageId === msg.messageId)){
					messages.push({
						msg: msg,
						dateSeen: null,
						dateRetrieved: new Date()
					});
				}
			});

			//order them
			messages = messages.sort((a, b) => {
				if(a.msg.messageId < b.msg.messageId){
					return -1;
				}
				else if(a.msg.messageId == b.msg.messageId){
					return 0;
				}
				return 1;
			});

			//return only the new messages
			var ret = appResp.messages.filter(m => m.messageId > lastId);

			return resolve(ret);

		}, reject);
	});
}

function appendMessages(messages){
	return new Promise((resolve) => {
		Promise.all(messages.map(formatMessage)).then((elems) => {
			$("#conversation").find(".collection").append(elems);
			return resolve();
		});
	});
}

function scrollConvToBottom(){
	return new Promise((resolve) => {
		var convContainer = $("#conversation").find(".collection").parent();
		convContainer.scrollTop(convContainer[0].scrollHeight);
		return resolve();
	});
}

function updateConversation(){
	return new Promise((resolve, reject) => {
		getNewMessages().then((msgs) => {

			//If empty, do nothing
			if(msgs.length === 0){
				return resolve();
			}

			var convContainer = $("#conversation").find(".collection").parent();

			//this should just check if the last element is in view
			//or subtract its height
			var scrolledDown = (() => {

				var buffer = (() => {
					var lastChild = $("#conversation").find(".collection").find("li").last();
					return lastChild ? lastChild.height() : 0;
				})();

				return convContainer[0].scrollTop >=
					(convContainer[0].scrollHeight - convContainer[0].offsetHeight -
					buffer);

			})();

			appendMessages(msgs.reverse()).then(() => {

				var unseenCount = messages
					.filter(record => record.dateSeen === null).length;

				//only update if there are unseen messages
				if(unseenCount > 0){

					if(!document.hasFocus()){
						updateTitle(unseenCount);
						Common.getAttention();
					}

					if(scrolledDown){
						scrollConvToBottom();
					}
					else{
						if(!document.hasFocus()){
							showMoreArrow();
							needsRefocus = true;
						}
					}

				}

				return resolve();

			});

		}, Common.handleError);
	});
}

function handleSendMessage(evt){

	//allow newlines
	//only send if enter hit and not shifted
	if(!(evt.which === 13 && !evt.shiftKey)){
		return;
	}

	this.disabled = true;

	Application.Conversation.sendMessage(this.value, convDetails.conversationId)
		.then((appResp) => {
			this.value = "";

			//clear existing timer and restart it
			window.clearTimeout(timeoutId);
			updateProxy();

		}, Common.handleError)
		.then(() => {
      this.disabled = false;
      this.focus();
    });

	evt.preventDefault();
	evt.stopPropagation();

	return false;

}

function handleWindowFocus(evt){
	return new Promise((resolve) => {
		needsRefocus = false;
		updateTitle(0);
		hideMoreArrow();
		messages
			.filter(m => m.dateSeen === null)
			.forEach(m => m.dateSeen = new Date());
		return resolve();
	});
}

function getConversationDetails(id){
	return Application.Conversation.getDetails(id);
}

function displayDetails(){
	return new Promise((resolve) => {
		Application.Conversation.getDetails(convDetails.conversationId)
      .then((appResp) => {

  			//Update cached copy
  			convDetails = appResp.details;

  			var details = [
  				{
  					heading: "Conversation Id",
  					text: convDetails.conversationId
  				},
  				{
  					heading: "Started",
  					text: (() => {
  						return (
  							Application.getLongDateFormat(convDetails.dateStarted) +
  							" (" +
  							Cola.functions.date.relativeTimestamp(convDetails.dateStarted) +
  							")");
  					})()
  				},
  				{
  					heading: "Messages",
  					text: convDetails.totalMessageCount.toLocaleString([], {
  						useGrouping: true
  					})
  				},
  				{
  					heading: "Last Active",
  					text: (() => {
  						return (
  							Application.getLongDateFormat(convDetails.lastMessageSent) +
  							" (" +
  							Cola.functions.date.relativeTimestamp(convDetails.lastMessageSent) +
  							")");
  					})()
  				},
  				{
  					heading: "Last Read",
  					text: (() => {
  						return (
  							Application.getLongDateFormat(convDetails.lastRead) +
  							" (" +
  							Cola.functions.date.relativeTimestamp(convDetails.lastRead) +
  							")");
  					})()
  				}
  			];

  			if(convDetails.ownerEntityType === BungieNet.enums.entityType.group){
  				details.push({
  					heading: "Group",
  					text: (() => {

  						var anchor = $("<a>").text(convDetails.group.name).attr({
  							target: "_blank",
  							href: (() => {
  								convDetails.group.getLink().then(link => anchor.attr("href", link));
  							})
  						});

  						return anchor;

  					})()
  				});
  			}
  			else{

  				details.push({
  					heading: "Started By",
  					text: (() => {

  						var starter = convDetails.getStarter();
  						var anchor = $("<a>").text(starter.displayName).attr({
  							target: "_blank",
  							href: (() => {
  								starter.getProfileLink().then(link => anchor.attr("href", link));
  							})
  						});

  						return anchor;

  					})()
  				});

  				details.push({
  					heading: "Participants",
  					text: (() => {

  						var promises = convDetails.participants.map((u) => {
  							return new Promise((resolve) => {

  								var anchor = $("<a>").text(u.displayName).attr({
  									target: "_blank"
  								});

  								u.getProfileLink().then((link) => {
  									anchor.attr("href", link);
  									return resolve(anchor);
  								});

  							});
  						});

  						var target = $("<span>");

  						Promise.all(promises).then((anchors) => {
  							target.append(anchors.map(a => a[0].outerHTML).join("; "));
  						});

  						return target;

  					})()
  				});

        }

  			var div = $("<div>").addClass("container section").css("fontSize", "14px");

  			div.append(details.map((d) => {
  				return $("<div>").append(
  					$("<b>").text(d.heading),
  					": ",
  					d.text
  				);
  			}));

  			$("#details").append(div);

  			return resolve();

		});
	});
}

function displaySettings(){
  //nothing to add
}

function handleFileDrop(evt){

	var file = evt.originalEvent.dataTransfer.files[0];
	var item = evt.originalEvent.dataTransfer.items[0];
	var url = evt.originalEvent.dataTransfer.getData("URL");

	if(url){
		this.value += url;
	}
	else if(file && file.type.match(/image.*/)){

		this.disabled = true;
		Common.showLoader();

		Application.uploadToImgur(file)
			.then(
				resp => this.value += resp.data.link,
				Common.handleError
			)
			.then(() => {
				Common.hideLoader();
				this.disabled = false;
			});

	}

	evt.preventDefault();
	evt.stopPropagation();

	return false;

}

//

function showConversation(){
	return new Promise((resolve) => {
		$("#conversation").removeClass("hide");
		return resolve();
	});
}

function showSettings(){
	return new Promise((resolve) => {
		$("#settings").removeClass("hide");
		displaySettings();
		return resolve();
	});
}

function showDetails(){
	return new Promise((resolve) => {
		$("#details").removeClass("hide").empty();
		displayDetails();
		return resolve();
	});
}

//

function updateTitle(count = 0){
	return new Promise((resolve) => {
    
		var promise;

		if(convDetails.ownerEntityType === BungieNet.enums.entityType.group){
			promise = Promise.resolve(convDetails.group.name);
		}
		else{
			promise = new Promise((resolve) => {
				BungieNet.currentUser.getMembershipId().then((myId) => {

					var str = convDetails.participants
						.filter(p => p.membershipId !== myId)
						.map(u => u.displayName)
						.join("; ");

					return resolve(str);

				});
			});
		}

		promise.then((str) => {

			if(count > 0){
				str = "(" + count.toLocaleString() + ") " + str;
			}

			document.title = str;

			return resolve();

		});

	});
}

function calculateInterval(){

	if(messages.length === 0){
		return intervals.default;
	}

	var delta = messages
		.map(record => record.msg.dateSent.getTime())
		.reduce((p, v) => (p > v ? p : v));

	if(delta <= delta - intervals.max){
		delta = intervals.max + delta;
	}

	var diff = Date.now() - delta;
	var x = diff / intervals.max;
	var y = Math.pow(x, 2.3);
	var total = (y + 1) * diff;

	total = Math.max(intervals.min, total);
	total = Math.min(intervals.max, total);

	return total;

}

function updateProxy(){
	return updateConversation().then(() => {
		var milli = calculateInterval();
		Application.log("Checking again in " + (milli / 1000) + " seconds");
    window.clearTimeout(timeoutId); //clear any existing timeouts just in case...
		timeoutId = window.setTimeout(updateProxy, milli);
	});
}

//

function getPageableEnder(){

  var ender = $("#pageableEnderTemplate").find("div").clone();

  ender.find("a").text(chrome.i18n.getMessage("application_pageable_load_button"));
  ender.find("span").text(chrome.i18n.getMessage("application_pageable_no_more"));

  return ender;

}

function addLocaleElements(){
  return new Promise((resolve, reject) => {

    $("#conversation").prepend(getPageableEnder());

    $("#msgInput").attr({
      placeholder: chrome.i18n.getMessage(
        "application_conversation_messagebox_placeholder")
    });

    $("#leaveBtn").text(chrome.i18n.getMessage(
      "application_conversation_leave_btn"));

    return resolve();

  });
}

function addEventHandlers(){
  return new Promise((resolve, reject) => {

    $(window).focus(handleWindowFocus);

    $("#msgInput")
      .keydown(handleSendMessage)
      .on("dragover dragenter", (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        return false;
      })
      .on("drop", handleFileDrop);

    $("#leaveBtn").click(() => {
        Application.Conversation.leave(convDetails.conversationId).then(
          resp => window.close(),
          Common.handleError
        );
      });

    return resolve();

  });
}


function dialogReady(){

  addLocaleElements()
    .then(addEventHandlers)
    .then(() => {
      return new Promise((resolve, reject) => {
        getConversationDetails(Application.queryString["conversationId"])
          .then((appResp) => {
            convDetails = appResp.details;
            updateTitle(0); //cancel out the initial unread count
            return resolve();
          }, reject);
      });
    })
    .then(showConversation)
    .then(() => {
      return new Promise((resolve, reject) => {
        updateProxy().then(() => {
          updateTitle(0);
          scrollConvToBottom();
        });
        return resolve();
      });
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
