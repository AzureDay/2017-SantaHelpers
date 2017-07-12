class DashboardConfigs {
    constructor() {
        this._remote = require('electron').remote;
        this._configVariableName = 'dashboardConfigs';
    }

    _getConfig(name) {
        return this._remote.getGlobal(this._configVariableName)[name];
    }

    _setConfig(name, val) {
        this._remote.getGlobal(this._configVariableName)[name] = val;
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
}