
//Create alarm for updating status
chrome.alarms.create(Application.constants.alarmKeys.statusUpdates, {
	periodInMinutes: Math.ceil(Application.constants.statusUpdateInterval / 60)
});

chrome.alarms.onAlarm.addListener((alarm) => {

	if(!(alarm && alarm.name === Application.constants.alarmKeys.statusUpdates)){
		return;
	}

	chrome.idle.queryState(Application.constants.statusUpdateInterval, (state) => {

		if(state !== chrome.idle.IdleState.ACTIVE){
			return;
		}

		Application
			.getSyncValue(Application.constants.storageKeys.statusUpdates)
			.then((shouldUpdate) => {

				if(!shouldUpdate){
					return;
				}

				Application.log("Attempting to update status...");

				Application.User.updateStatus(Application.getStatusUpdateMessage())
					.then(
						() => Application.log("Status updated"),
						(ex) => Application.log(`Status update failed: ${ex.toString()}`)
					);

			});

	});
});
