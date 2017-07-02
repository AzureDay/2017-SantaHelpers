function DashboardApp(rootNode) {
    let self = this;
    let root = rootNode;

    // ======= Model =======

    self.message = {
        isVisible: ko.observable(true)
    };


    // ======= Bindings =======


    // ======= Initialization =======

    self.init = function () {
        ko.applyBindings(self, root);
        self.message.isVisible(false);
    };

    return self;
}