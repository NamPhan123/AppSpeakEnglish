const $ = (selector, parent = document) => parent.querySelector(selector); 
const $$ = (selector, parent = document) => parent.querySelectorAll(selector);

const fulledTopic = [];
const stateTopic = {};

const util = {
	topicIsFulled: function(topicName) {
		return fulledTopic.includes(topicName);
	},
	randomFrom1ToN: function(n) {
		return 1 + Math.floor(n * Math.random());
	},
	usedSong: function(songName, topicName) {
		return stateTopic[topicName] && stateTopic[topicName].includes(songName);
	},
	addUsedSongToTopic: function(songName, topicName) {
		let listSongOfTopic = stateTopic[topicName];
		if(!listSongOfTopic) {
			stateTopic[topicName] = [];
		}
		stateTopic[topicName].push(songName);
	}
};

const model = {
	getSongName: function(topicName) {
		if(util.topicIsFulled(topicName)) {
			return null;
		}

		let songName = null;
		do {
			songName = util.randomFrom1ToN(sources[topicName]);
		} while(util.usedSong(songName, topicName));

		util.addUsedSongToTopic(songName, topicName);
		if(stateTopic[topicName].length == sources[topicName]) {
			fulledTopic.push(topicName);
			view.removeTopic(topicName);
			view.selectAllTopic();
		}

		return songName;
	},
	play: function(songName, topicName) {
		const audio = document.createElement('audio');
		const songPath = `${rootPath}/${topicName}/${songName}.mp3`;
		audio.src = songPath;
		audio.play();
	}
};

const view = {
	renderListTopic: function() {
		const listTopic = Object.keys(sources);
		
		let htmlListTopic = '';
		listTopic.forEach(topicName => {
			htmlListTopic += `
				<div class="topic">
					<input type="radio" name="topic" id="${topicName}">
					<label for="${topicName}">${topicName}</label>
				</div>`;
		});

		htmlListTopic += `
					<div class="topic">
						<input type="radio" name="topic" id="all" checked>
						<label for="all">All topic</label>
					</div>`;

		$('.listTopic').innerHTML = htmlListTopic;
	},
	getTopicName: function() {
		const listTopicName = Object.keys(sources);
		if(fulledTopic.length == listTopicName.length) {
			return null;
		}

		let topicName = $('.topic input:checked').id;
		if(util.topicIsFulled(topicName)) {
			return null;
		}

		if(topicName == 'all') {
			do {
				topicName = listTopicName[util.randomFrom1ToN(listTopicName.length)-1];
			} while(util.topicIsFulled(topicName));
		}
		return topicName;
	},
	removeTopic: function(topicName) {
		const topicElement = $(`#${topicName}`).parentElement;
		$('.listTopic').removeChild(topicElement);
	},
	selectAllTopic: function() {
		$('#all').checked = true;
	},
	renderReloadBtn: function() {
		const reloadBtn = document.createElement('button');
		reloadBtn.classList.add('reload');
		reloadBtn.innerText = 'Reload';
		$('.app').appendChild(reloadBtn);
		reloadBtn.onclick = () => location.reload();
	}
};


const controller = {
	nextSong: function() {
		let topicName = null;
		let songName = null;
		do {
			topicName = view.getTopicName();
			if(!topicName) {
				alert('Het danh sach!');
				return;
			}

			songName = model.getSongName(topicName);
		} while(!songName);

		model.play(songName, topicName);
	}
};



/* event */
$('button').onclick = function() {
	controller['nextSong']();
}


/* main */
view.renderListTopic();
view.renderReloadBtn();
