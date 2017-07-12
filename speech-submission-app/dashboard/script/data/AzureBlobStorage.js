class AzureBlobStorage {
    constructor(connectionString, year) {
        this._profileContainerName = 'profiles';
        this._year = year;

        this._azureStorageBlobService = require('azure-storage').createBlobService(connectionString);
    }

    getBlobsList(blobsList, token) {
        var self = this;

        return new Promise(function (resolve, reject) {
            self._azureStorageBlobService.listBlobsSegmentedWithPrefix(self._profileContainerName, self._year, token, function (error, result, response) {
                if (!!error) {
                    reject(error);
                    return;
                }

                if (!blobsList) {
                    blobsList = [];
                }

                blobsList = blobsList.concat(result.entries);

                if (!!result.continuationToken) {
                    self.getBlobsList(blobsList, result.continuationToken)
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

    getBlobAsJson(blobName) {
        var self = this;

        return new Promise(function (resolve, reject) {
            self._azureStorageBlobService.getBlobToText(self._profileContainerName, blobName, function (error, result, response) {
                if (!!error) {
                    reject(error);
                    return;
                }

                let profile = JSON.parse(result);

                if (Object.keys(profile).length === 0) {
                    resolve(null);
                } else {
                    resolve(profile);
                }
            })
        })
    }
}