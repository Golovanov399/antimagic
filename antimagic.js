function makeNotLegendary(user) {
	if (user.childNodes.length > 1) {
		user.childNodes[1].textContent = user.childNodes[0].textContent + user.childNodes[1].textContent;
		user.removeChild(user.childNodes[0]);
	}
}

function makeLegendary(user) {
	if (user.childNodes.length == 1) {
		span = document.createElement('span');
		span.classList.add("legendary-user-first-letter");
		span.textContent = user.firstChild.textContent[0];
		user.firstChild.textContent = user.firstChild.textContent.slice(1);
		user.insertBefore(span, user.firstChild);
	}
}

users = document.getElementsByClassName('rated-user');

function fixColors(text) {
	var rated_guys = [];
	var tmp = text.split("\n");
	for (var i = 0; i < tmp.length; ++i) {
		rated_guys.push(new Set());
		var cur_tmp = tmp[i].split(" ");
		for (var j = 0; j < cur_tmp.length; ++j) {
			if (cur_tmp[j] != "") {
				rated_guys[i].add(cur_tmp[j]);
			}
		}
	}

	colors = ["user-legendary", "user-red", "user-red", "user-orange", "user-orange", "user-violet", "user-blue", "user-cyan", "user-green", "user-gray"];
	en_titles = [
		"Legendary Grandmaster",
		"International Grandmaster",
		"Grandmaster",
		"International master",
		"Master",
		"Candidate Master",
		"Expert",
		"Specialist",
		"Pupil",
		"Newbie"
	]
	ru_titles = [
		"Легендарный гроссмейстер",
		"Международный гроссмейстер",
		"Гроссмейстер",
		"Международный мастер",
		"Мастер",
		"Кандидат в мастера",
		"Эксперт",
		"Специалист",
		"Ученик",
		"Новичок"
	]

	var en = (document.getElementsByClassName("menu-list-container")[0].children[0].children[0].textContent == "Home");

	for (var i = 0; i < users.length; ++i) {
		user = users[i];
		if (user.textContent === "MikeMirzayanov") {
			continue;
		}
		username = user.attributes["href"].textContent.slice(9);
		var set_color = "";
		var real_color = "user-black";
		var real_idx = -1;
		for (var j = 0; j < colors.length; ++j) {
			if (rated_guys[j].has(username)) {
				real_color = colors[j];
				real_idx = j;
			}
		}
		user.classList.forEach(function(title) {
			if (!title.startsWith("user-")) {
				return;
			}
			set_color = title;

			if (title == real_color) {
				return;
			}

			if (title == "user-legendary") {
				makeNotLegendary(user);
			}
		});
		if (set_color != real_color) {
			if (real_color == "user-legendary") {
				makeLegendary(user);
			}
			user.classList.replace(set_color, real_color);
			user.title = (en ? en_titles : ru_titles)[real_idx] + " " + user.textContent;
		}
	}
}

chrome.runtime.sendMessage({contentScriptQuery: "fixColors"}, text => fixColors(text));