function LoginApp(rootNode) {
    let self = this;
    let root = rootNode;

    debugger;

    let dashboardUtils = new DashboardUtils();
    let dashboardConfigs = new DashboardConfigs();

    const hostAuth = dashboardConfigs.apiHost + '/api/dashboard/connectionString?code=';

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
                
                dashboardConfigs.connectionString = responseData.connectionString;
                dashboardConfigs.year = self.login.year();

                dashboardUtils.setCurrentWindowUrl('../../view/dashboard/index.html');
            }, handlePromiseError);
    };

    // ======= Initialization =======

    self.init = function () {
        ko.applyBindings(self, root);
        self.message.isVisible(false);
    };

    return self;
}