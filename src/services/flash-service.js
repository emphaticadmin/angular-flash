/* global angular */

(function () {
    'use strict';

    var Flash = function (options) {
        var _options = angular.extend({
            id: null,
            subscribers: [],
            classnames: {
                error: [],
                warn: [],
                info: [],
                success: []
            }
        }, options);

        var _self = this;
        var _success;
        var _info;
        var _warn;
        var _error;
        var _type;

        function _notify(type, message) {
            angular.forEach(_options.subscribers, function (subscriber) {
                var matchesType = !subscriber.type || subscriber.type === type;
                var matchesId = (!_options.id && !subscriber.id) || subscriber.id === _options.id;
                if (matchesType && matchesId) {
                    subscriber.cb(message, type);
                }
            });
        }

        this.clean = function () {
            _options.subscribers = [];
            _success = null;
            _info = null;
            _warn = null;
            _error = null;
            _type = null;
        };

        this.subscribe = function (subscriber, type, id) {
            _options.subscribers.push({
                cb: subscriber,
                type: type,
                id: id
            });
        };

        this.to = function (id) {
            var options = angular.copy(_options);
            options.id = id;
            return new Flash(options);
        };

        this.success = function (message) {
            if (message) {
                _success = message;
                _type = 'success';
                _notify(_type, message);
            } else {
                return _success;
            }
        };

        this.info = function (message) {
            if (message) {
                _success = message;
                _type = 'info';
                _notify(_type, message);
            } else {
                return _info;
            }
        };

        this.warn = function (message) {
            if (message) {
                _success = message;
                _type = 'warn';
                _notify(_type, message);
            } else {
                return _warn;
            }
        };

        this.error = function (message) {
            if (message) {
                _success = message;
                _type = 'error';
                _notify(_type, message);
            } else {
                return _error;
            }
        };

        this.type = function () {
            return _type;
        };

        this.message = function () {
            return _type ? _self[_type] : null;
        };

        this.classnames = function () {
            return _options.classnames;
        };

        this.id = function () {
            return _options.id;
        };
    };

    angular.module('angular-flash.service', [])
        .provider('flash', function () {
            var _self = this;
            this.errorClassnames = ['alert-error'];
            this.warnClassnames = ['alert-warn'];
            this.infoClassnames = ['alert-info'];
            this.successClassnames = ['alert-success'];

            this.$get = function () {
                return new Flash({
                    classnames: {
                        error: _self.errorClassnames,
                        warn: _self.warnClassnames,
                        info: _self.infoClassnames,
                        success: _self.successClassnames
                    }
                });
            };
        });

}());
