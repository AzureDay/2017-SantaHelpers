function SpeakerApp(rootNode) {
	let self = this;
	let root = rootNode;

	let id = '';

	const host = '';
	const year = '';
	const url = host + '/api/profile/' + year + '/' + id;

	self.speaker = {
		firstName: ko.observable(''),
		lastName: ko.observable('')
	};

	self.createSpeaker = function () {
		return new Promise(function(resolve, reject) {
			$.ajax(url, {
				contentType: 'application/json',
				method: 'post',
				success: function() {
					resolve();
				},
				error: function (req, err) {
					reject(err);
				}
			});
		});
	};

	self.loadSpeaker = function () {
		return new Promise(function(resolve, reject) {

		});
	};

	self.saveSpeaker = function () {
		return new Promise(function(resolve, reject) {

		});
	};

	self.init = function () {
		ko.applyBindings(self, root);
		self.createSpeaker()
			.then(function () {
				console.log('speaker profile created');
			}, function (err) {
				console.error(err);
			});
	};

	return self;
}