function LoginApp(rootNode) {
    let self = this;
    let root = rootNode;

    const host = 'https://speaker-dashboard.azurewebsites.net';
    const hostAuth = host + '/api/dashboard/connectionString?code=';

    const { remote } = require('electron');
    const path = require('path');
    const url = require('url');

    // ======= Model =======

    self.message = {
        isVisible: ko.observable(true)
    };

    self.login = {
        year: ko.observable(''),
        password: ko.observable('')
    };


    // ======= Bindings =======

    function tryGetConnectionString() {
        let apiKey = self.login.password();

        return new Promise(function (resolve, reject) {
            $.ajax(hostAuth + apiKey, {
                contentType: 'application/json',
                method: 'get',
                success: function(data) {
                    resolve(data);
                },
                error: function (req, err) {
                    reject(err);
                }
            });
        })
    }

    self.login.tryLogin = function () {
        self.message.isVisible(true);
        tryGetConnectionString()
            .then(function (response) {
                process.env.AZURE_STORAGE_CONNECTION_STRING = response.connectionString;
                process.env.AZURE_STORAGE_YEAR = self.login.year();

                remote.getCurrentWindow().loadURL(url.format({
                    pathname: path.join(__dirname, '..', '..', 'view', 'dashboard', 'index.html'),
                    protocol: 'file:',
                    slashes: true
                }));
            }, function (error) {
                console.error(error);
                self.message.isVisible(false);
            });
    };

    // ======= Initialization =======

    self.init = function () {
        ko.applyBindings(self, root);
        self.message.isVisible(false);
    };

    return self;
}