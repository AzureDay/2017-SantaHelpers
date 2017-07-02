function DashboardApp(rootNode) {
    let self = this;
    let root = rootNode;

    const { remote } = require('electron');
    const azureStorage = require('azure-storage');

    let dashboardConfigs = remote.getGlobal('dashboardConfigs');
    let azureStorageBlobService = azureStorage.createBlobService(dashboardConfigs.connectionString);


    // ======= Model =======

    self.message = {
        isVisible: ko.observable(true)
    };

    self.profiles = ko.observableArray([]);


    // ======= Bindings =======

    self.refresh = function() {
        self.message.isVisible(true);

        getBlobsList()
            .then(function (blobs) {
                let promises = blobs.map(function (blob) {
                    return getBlobContent(blob.name);
                });
                return Promise.all(promises);
            }, function (error) {
                console.error(error);
                self.message.isVisible(false);
            })
            .then(function (speakersProfiles) {
                self.profiles(speakersProfiles.sort(function(a, b) {
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
                }));
                self.message.isVisible(false);
            }, function (error) {
                console.error(error);
                self.message.isVisible(false);
            });
    };

    // ======= API =======

    function getBlobsList(blobsList, token) {
        return new Promise(function (resolve, reject) {
            azureStorageBlobService.listBlobsSegmentedWithPrefix('profiles', process.env.AZURE_STORAGE_YEAR, token, function (error, result, response) {
                if (!!error) {
                    reject(error);
                    return;
                }

                if (!blobsList) {
                    blobsList = [];
                }

                blobsList = blobsList.concat(result.entries);

                if (!!result.continuationToken) {
                    getBlobsList(blobsList, result.continuationToken)
                        .then(function (results) {
                            resolve(results);
                        }, function (error) {
                            reject(error);
                        });
                } else {
                    resolve(blobsList);
                }
            })
        });
    }

    function getBlobContent(blobName) {
        return new Promise(function (resolve, reject) {
            azureStorageBlobService.getBlobToText('profiles', blobName, function (error, result, response) {
                if (!!error) {
                    reject(error);
                    return;
                }

                let profile = JSON.parse(result);
                resolve(profile);
            })
        })
    }

    // ======= Initialization =======

    self.init = function () {
        ko.applyBindings(self, root);
        self.refresh();
    };

    return self;
}