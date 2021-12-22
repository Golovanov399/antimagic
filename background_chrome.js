function obtainHandles(callback) {
	const updated_at = fetch("https://api.github.com/gists/9e4b23c4f6468aa02a1e36b89bdea291/commits")
		.then(response => response.text())
		.then(text => JSON.parse(text))
		.then(result => result[0]["committed_at"]);
	const our_value = chrome.storage.local.get({"updated_at": null}, our => {
		updated_at.then(upd => {
			if (upd !== our.updated_at) {
				chrome.storage.local.set({"updated_at": upd}, () => {
					fetch("https://gist.github.com/Golovanov399/9e4b23c4f6468aa02a1e36b89bdea291/raw/gistfile1.txt")
						.then(response => response.text())
						.then(content => chrome.storage.local.set({"handles": content}))
						.then(_ => console.log("Updated handles"))
						.then(_ => chrome.storage.local.get({"handles": null}, res => callback(res.handles)));
				});
				return;
			}
			chrome.storage.local.get({"handles": null}, res => callback(res.handles));
		});
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
