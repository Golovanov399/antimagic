function obtainHandles(callback) {
	const updated_at = fetch("https://api.github.com/gists/9e4b23c4f6468aa02a1e36b89bdea291/commits")
		.then(response => response.text())
		.then(text => JSON.parse(text))
		.then(result => result[0]["committed_at"]);
	const our_value = browser.storage.local.get({"updated_at": null});
	updated_at.then(upd => {
		our_value.then(our => {
			if (upd !== our["updated_at"]) {
				browser.storage.local.set({"updated_at": upd});
				fetch("https://gist.github.com/Golovanov399/9e4b23c4f6468aa02a1e36b89bdea291/raw/gistfile1.txt")
					.then(response => response.text())
					.then(content => browser.storage.local.set({"handles": content}));
				console.log("Updated handles");
			}
		});
		browser.storage.local.get({"handles": null}).then(res => callback(res["handles"]));
	});
}

// obtainHandles(console.log);

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.contentScriptQuery == "fixColors") {
			obtainHandles(sendResponse);
			return true;
		}
	}
);
