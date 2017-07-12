class DashboardConfigs {
    constructor() {
        this._remote = require('electron').remote;

        this._configVariableName = 'dashboardConfigs';

        this._apiHost = null;

        this._fs = require('fs');
        this._path = require('path');
    }

    get apiHost() {
        debugger;

        if (!this._apiHost) {
            let configFilePath = this._path.join(this.root, 'config.json');
            let configFileContent = this._fs.readFileSync(configFilePath, 'utf8');

            this._apiHost = JSON.parse(configFileContent).apiHost;
        }

        return this._apiHost;
    }

    get connectionString() {
        return this._getConfig('connectionString');
    }

    set connectionString(val) {
        this._setConfig('connectionString', val);
    }

    get year() {
        return this._getConfig('year');
    }

    set year(val) {
        this._setConfig('year', val);
    }

    get root() {
        return this._getConfig('root');
    }

    set root(val) {
        this._setConfig('root', val);
    }

    _getConfig(name) {
        return this._remote.getGlobal(this._configVariableName)[name];
    }

    _setConfig(name, val) {
        this._remote.getGlobal(this._configVariableName)[name] = val;
    }
}