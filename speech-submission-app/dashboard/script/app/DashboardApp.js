function DashboardApp(rootNode) {
    let self = this;
    let root = rootNode;

    let dashboardUtils = new DashboardUtils();
    let dashboardConfigs = new DashboardConfigs();
    let azureBlobStorage = new AzureBlobStorage(dashboardConfigs.connectionString);


    // ======= Model =======

    self.message = {
        isVisible: ko.observable(true)
    };

    self.profiles = ko.observableArray([]);

    self.travelRequests = ko.computed(function() {
        return self.profiles()
            .filter(function(profile) {
                return profile.requireTravel;
            });
    });

    self.accommodationRequests = ko.computed(function() {
        return self.profiles()
            .filter(function(profile) {
                return profile.requireAccommodation;
            });
    });

    // ======= Bindings =======

    function handlePromiseError(error) {
        console.error(error);
        self.message.isVisible(false);
    }

    self.refresh = function() {
        self.message.isVisible(true);

        azureBlobStorage.getBlobsList()
            .then(function (blobs) {
                let promises = blobs.map(function (blob) {
                    return azureBlobStorage.getBlobAsJson(blob.name);
                });
                return Promise.all(promises);
            }, handlePromiseError)
            .then(function (speakersProfiles) {
                let profiles = speakersProfiles
                    .filter(function (profile) {
                        return !!profile;
                    })
                    .sort(function(a, b) {
                        if (a.lastName > b.lastName) {
                            return 1;
                        } else if (a.lastName < b.lastName) {
                            return -1;
                        } else if (a.lastName === b.lastName) {
                            if (a.firstName > b.firstName) {
                                return 1;
                            } else if (a.firstName < b.firstName) {
                                return -1;
                            } else if (a.firstName === b.firstName) {
                                return 0;
                            }
                        }
                    });

                self.profiles(profiles);
                self.message.isVisible(false);
            }, handlePromiseError);
    };

    self.openPhotoUrl = function(data, event) {
        dashboardUtils.openExternal(data.photoUrl);
    };

    self.openSocialUrl = function(data, event) {
        dashboardUtils.openExternal(data.url);
    };


    // ======= Initialization =======

    self.init = function () {
        ko.applyBindings(self, root);
        self.refresh();
    };

    return self;
}