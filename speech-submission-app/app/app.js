function SpeakerApp(rootNode, appConfig) {
	var self = this;
	var root = rootNode;

	var id = '';

	var host = appConfig.api.host;
    var year = appConfig.general.year;

	var hostAuth = host + '/.auth/me';
	var hostProfile = host + '/api/profile/' + year + '/';


    // ======= Model =======

	function parseAuth(authObject) {
		function getClaimValue(claims, type) {
            var claim = claims.filter(function (token) {
                return token.typ === type;
            })[0];

            return claim ? claim.val : '';
        }

        console.log(authObject.user_claims);

		id = getClaimValue(authObject.user_claims, 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier');

        self.speaker.firstName(getClaimValue(authObject.user_claims, 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'));
        self.speaker.lastName(getClaimValue(authObject.user_claims, 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'));
        self.speaker.country(getClaimValue(authObject.user_claims, 'country'));
        self.speaker.city(getClaimValue(authObject.user_claims, 'city'));
        self.speaker.company(getClaimValue(authObject.user_claims, 'extension_Company'));
        self.speaker.jobTitle(getClaimValue(authObject.user_claims, 'jobTitle'));
        self.speaker.email(getClaimValue(authObject.user_claims, 'emails'));
    }

    self.general = {
	    name: appConfig.general.name,
	    year: year,
        country: appConfig.general.country
    };

    self.message = {
	    isVisible: ko.observable(true)
    };

	self.travel = {
		dates: appConfig.details.dates,
		accommodationTypes: appConfig.details.accommodation,
		travelTypes: appConfig.details.travel
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
    	var profile = {};

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

			var profile = getFromForm();
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

        self.message.isVisible(false);
	};

	return self;
}