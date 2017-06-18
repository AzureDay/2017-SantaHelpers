function SpeakerApp(rootNode) {
	let self = this;
	let root = rootNode;

	let id = '';

	const host = '';
	const year = '';
	const url = host + '/api/profile/' + year + '/' + id;


    // ======= Model =======

	self.travel = {
		dates: [
			'September 6 or before',
            'September 7',
            'September 8 - workshops day',
            'September 9 - conference day',
            'September 10 - after party day',
            'September 11',
			'September 12 or after'
		],
		accommodationTypes: [
			{ title: '2 speakers', description: '2 speakers description' },
            { title: '1 speaker', description: '1 speaker description' },
            { title: '1 speaker + 1 guest', description: '1 speaker + 1 guest description' }
		],
		travelTypes: [
            { title: 'airplane', description: '' },
            { title: 'train', description: '' },
            { title: 'car', description: '' }
		]
	};

	self.speaker = {
		// speaker profile
		firstName: ko.observable(''),
		lastName: ko.observable(''),
		country: ko.observable(''),
        city: ko.observable(''),
		phone: ko.observable(''),
		email: ko.observable(''),
		photoUrl: ko.observable(''),
		bio: ko.observable(''),
        socialProfiles: ko.observableArray([]),

		// travel profile
		travelWithGuest: ko.observable(false),
		dateOfArrival: ko.observable('September 7'),
		dateOfDeparture: ko.observable('September 11'),
		requireAccommodation: ko.observable(true),
		accommodationType: ko.observable(null),
		requireTravel: ko.observable(true),
		travelType: ko.observable('airplane'),

		// topics
		conferenceTopics: ko.observableArray([]),
		workshopTopics: ko.observableArray([]),

		// other
		notes: ko.observable('')
	};

    // ======= Bindings =======

    function getFromForm() {
    	let profile = {};

    	Object
			.keys(self.speaker)
			.forEach(function (key) {
				profile[key] = self.speaker[key]();
            });

    	if (!self.speaker.requireAccommodation()) {
    		profile.accommodationType = '';
		} else {
            profile.accommodationType = profile.accommodationType.title;
		}

		if (!self.speaker.requireTransfer) {
    		profile.transferType = '';
		}

        return profile;
    }

    function setToForm(profile) {
        if (typeof (profile) === 'string') {
            profile = JSON.parse(profile);
        }

        Object
            .keys(profile)
            .forEach(function (key) {
            	self.speaker[key](profile[key]);
            });
    }

	self.addSocialProfile = function () {
        self.speaker.socialProfiles.push({});
    };

	self.removeSocialProfile = function (obj) {
		self.speaker.socialProfiles.remove(obj);
    };

	self.addConferenceTopic = function () {
        self.speaker.conferenceTopics.push({});
    };

	self.removeConferenceTopic = function (obj) {
        self.speaker.conferenceTopics.remove(obj);
    };

    self.addWorkshopTopic = function () {
        self.speaker.workshopTopics.push({});
    };

    self.removeWorkshopTopic = function (obj) {
        self.speaker.workshopTopics.remove(obj);
    };


	// ======= API =======

    function createProfileIfNotExists() {
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
    }

	self.loadProfile = function () {
		return new Promise(function(resolve, reject) {

		});
	};

	self.saveProfile = function () {
		return new Promise(function(resolve, reject) {
			let profile = getFromForm();
			console.log(profile);
		});
	};


    // ======= Initialization =======

	self.init = function () {
		ko.applyBindings(self, root);
		// createSpeaker()
		// 	.then(function () {
		// 		console.log('speaker profile created');
		// 	}, function (err) {
		// 		console.error(err);
		// 	});
	};

	return self;
}