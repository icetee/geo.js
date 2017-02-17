class Geo {
    constructor(params) {
        this.opt = {};
        Object.assign(this.opt, {
            maxDistance: 1.5,
            geoOptions: {
                enableHighAccuracy: false,
                timeout: 5000,
                maximumAge: 10000
            },
            google: {
                api_key: ''
            }
        }, params);

        this.isSupperted = {};
        this.watchID = 0;

        this.checkSupported();
        this.init();
    }

    init() {
        if (!this.isSupperted.navigator) return;
        this.geo = window.navigator.geolocation;
    }

    checkSupported() {
        this.isSupperted.navigator = (window.navigator) ? true : false;
        this.isSupperted.notification = (window.Notification) ? true : false;
    }

    watchLocation(opt) {
        return new Promise((resolve, reject) => {
            this.geo.watchPosition((success) => {
                resolve(success);
            }, (err) => {
                reject(err);
            }, this.opt);
        });
    }

    getDistance(lat1, lon1, lat2, lon2) {
        let R = 6371; // Radius of the earth in km
        let dLat = this._deg2rad(lat2 - lat1);  // deg2rad below
        let dLon = this._deg2rad(lon2 - lon1);
        let a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this._deg2rad(lat1)) * Math.cos(this._deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c; // Distance in km
        return d;
    }

    _deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    getLocation() {
        return new Promise((resolve, reject) => {
            this.geo.getCurrentPosition(resolve, reject, this.opt);
        });
    }

    getNotificationPermission() {
        return new Promise(function(resolve, reject) {
            Notification.requestPermission((status) => {
                if (status === "granted") {
                    resolve(status);
                } else {
                    reject("Notification status " + status);
                }
            });
        });
    }

    getJson(response) {
        let contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json();
        } else {
            console.warn("Oops, we haven't got JSON!");
        }
    }

    getGoogleLocation() {
        let url = "https://www.googleapis.com/geolocation/v1/geolocate?key=" + this.opt.google.api_key,
            opts = {
                method: 'POST'
            };

        return fetch(url, opts).then(this.getJson);
    }
}
