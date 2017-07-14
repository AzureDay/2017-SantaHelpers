function SpeakerApp(rootNode) {
	let self = this;
	let root = rootNode;

	let id = '';

	const host = 'https://speaker-submission-test.azurewebsites.net';
    const year = '2017';

	const hostAuth = host + '/.auth/me';
	const hostProfile = host + '/api/profile/' + year + '/';


    // ======= Model =======

	function parseAuth(authObject) {
		function getClaimValue(claims, type) {
            let claim = claims.filter(function (token) {
                return token.typ === type;
            })[0];

            return claim ? claim.val : ''; 
        }

        id = getClaimValue(authObject.user_claims, 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier');
		self.speaker.firstName(getClaimValue(authObject.user_claims, 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'));
        self.speaker.lastName(getClaimValue(authObject.user_claims, 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'));
        self.speaker.email(getClaimValue(authObject.user_claims, 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'));
    }

    self.message = {
	    isVisible: ko.observable(true)
    };

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
			{ title: '2 speakers', description: 'two speakers in one twin room' },
            { title: '1 speaker', description: 'one speaker in one single room' },
            { title: '1 speaker + 1 guest', description: 'one speaker and one guest in twin room' }
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
        company: ko.observable(''),
        jobTitle: ko.observable(''),
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

		if (!self.speaker.requireTravel()) {
    		profile.travelType = '';
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

    function authenticate() {
        return new Promise(function (resolve, reject) {
            $.ajax(hostAuth, {
                contentType: 'application/json',
                method: 'get',
                success: function(data) {
                    resolve(data);
                },
                error: function (req, err) {
                    reject(err);
                }
            });
        });
    }

    function createProfileIfNotExists() {
        return new Promise(function(resolve, reject) {
            $.ajax(hostProfile + id, {
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

	function loadProfile() {
		return new Promise(function(resolve, reject) {
			$.ajax(hostProfile + id, {
				contentType: 'application/json',
				method: 'get',
				success: function(data) {
					resolve(data);
				},
				error: function (req, err) {
					reject(err);
				}
			});
		});
	}

	self.saveProfile = function () {
		return new Promise(function(resolve, reject) {
            self.message.isVisible(true);

			let profile = getFromForm();
            $.ajax(hostProfile + id, {
                contentType: 'application/json',
                method: 'put',
				data: JSON.stringify(profile),
                success: function() {
                    self.message.isVisible(false);
                    resolve();
                },
                error: function (req, err) {
                    reject(err);
                }
            });
		});
	};


    // ======= Initialization =======

	self.init = function () {
	    self.message.isVisible(true);
		ko.applyBindings(self, root);

        authenticate()
            .then(function (authObject) {
                parseAuth(authObject[0]);
                return createProfileIfNotExists();
            }, function (err) {
                console.error(err);
            })
			.then(function () {
				return loadProfile();
            }, function (err) {
                console.error(err);
            })
			.then(function (profile) {
				setToForm(profile);
                self.message.isVisible(false);
			}, function (err) {
				console.error(err);
			});
	};

	return self;
}