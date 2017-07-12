class DashboardUtils {
    constructor(){
        let electron = require('electron');
        this._remote = electron.remote;
        this._shell = electron.shell;

        this._path = require('path');
        this._url = require('url');
        this._http = require('http');
        this._https = require('https');
    }

    loadURL(newUrl) {
        let absoluteUrl = this._url.format({
            pathname: this._path.join(__dirname, newUrl),
            protocol: 'file:',
            slashes: true
        });

        this._remote.getCurrentWindow().loadURL(absoluteUrl);
    }

    openExternal(url) {
        this._shell.openExternal(url);
    }

    callHttp(requestMethod, requestUrl, requestData) {
        let self = this;

        return new Promise(function(resolve, reject) {
            const url = new self._url.URL(requestUrl);

            const options = {
                hostname: url.hostname,
                port: url.port,
                protocol: url.protocol,
                path: url.pathname + url.search,
                method: requestMethod
            };

            let caller = options.protocol === 'http' ? self._http : self._https;

            let request = caller.request(options, function(response) {
                let responseData = '';
                
                response.setEncoding('utf8');
                
                response.on('data', (chunk) => {
                    responseData += chunk;
                });

                switch(response.statusCode) {
                    case 200:
                        response.on('end', () => {
                            resolve(responseData);
                        });
                        break;
                    default:
                        response.on('end', () => {
                            reject(response.statusMessage);
                        });
                        break;
                }
            })

            request.on('error', (error) => {
                reject(error);
            });

            if (requestData) {
                request.write(requestData);
            }

            request.end();
        });
    }
}