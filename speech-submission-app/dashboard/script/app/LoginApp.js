function LoginApp(rootNode) {
    let self = this;
    let root = rootNode;

    const host = 'https://speaker-dashboard.azurewebsites.net';
    const hostAuth = host + '/api/dashboard/connectionString?code=';

    let dashboardUtils = new DashboardUtils();

    // ======= Model =======

    self.message = {
        isVisible: ko.observable(true)
    };

    self.login = {
        year: ko.observable(''),
        password: ko.observable('')
    };


    // ======= Bindings =======

    function handlePromiseError(error) {
        console.error(error);
        self.message.isVisible(false);
    }

    function tryGetConnectionString() {
        let apiKey = self.login.password();

        return dashboardUtils.callHttp('GET', hostAuth + apiKey);
    }

    self.login.tryLogin = function () {
        self.message.isVisible(true);
        tryGetConnectionString()
            .then(function (response) {
                let responseData = JSON.parse(response);

                let dashboardConfigs = new DashboardConfigs();
                dashboardConfigs.connectionString = responseData.connectionString;
                dashboardConfigs.year = self.login.year();

                dashboardUtils.loadURL('../../view/dashboard/index.html');
            }, handlePromiseError);
    };

    // ======= Initialization =======

    self.init = function () {
        ko.applyBindings(self, root);
        self.message.isVisible(false);
    };

    return self;
}