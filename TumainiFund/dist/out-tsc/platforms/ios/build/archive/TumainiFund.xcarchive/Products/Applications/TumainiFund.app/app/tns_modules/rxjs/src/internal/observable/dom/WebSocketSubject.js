"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Subject_1 = require("../../Subject");
var Subscriber_1 = require("../../Subscriber");
var Observable_1 = require("../../Observable");
var Subscription_1 = require("../../Subscription");
var ReplaySubject_1 = require("../../ReplaySubject");
var tryCatch_1 = require("../../util/tryCatch");
var errorObject_1 = require("../../util/errorObject");
var DEFAULT_WEBSOCKET_CONFIG = {
    url: '',
    deserializer: function (e) { return JSON.parse(e.data); },
    serializer: function (value) { return JSON.stringify(value); },
};
var WEBSOCKETSUBJECT_INVALID_ERROR_OBJECT = 'WebSocketSubject.error must be called with an object with an error code, and an optional reason: { code: number, reason: string }';
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var WebSocketSubject = /** @class */ (function (_super) {
    __extends(WebSocketSubject, _super);
    function WebSocketSubject(urlConfigOrSource, destination) {
        var _this = _super.call(this) || this;
        if (urlConfigOrSource instanceof Observable_1.Observable) {
            _this.destination = destination;
            _this.source = urlConfigOrSource;
        }
        else {
            var config = _this._config = __assign({}, DEFAULT_WEBSOCKET_CONFIG);
            _this._output = new Subject_1.Subject();
            if (typeof urlConfigOrSource === 'string') {
                config.url = urlConfigOrSource;
            }
            else {
                for (var key in urlConfigOrSource) {
                    if (urlConfigOrSource.hasOwnProperty(key)) {
                        config[key] = urlConfigOrSource[key];
                    }
                }
            }
            if (!config.WebSocketCtor && WebSocket) {
                config.WebSocketCtor = WebSocket;
            }
            else if (!config.WebSocketCtor) {
                throw new Error('no WebSocket constructor can be found');
            }
            _this.destination = new ReplaySubject_1.ReplaySubject();
        }
        return _this;
    }
    WebSocketSubject.prototype.lift = function (operator) {
        var sock = new WebSocketSubject(this._config, this.destination);
        sock.operator = operator;
        sock.source = this;
        return sock;
    };
    WebSocketSubject.prototype._resetState = function () {
        this._socket = null;
        if (!this.source) {
            this.destination = new ReplaySubject_1.ReplaySubject();
        }
        this._output = new Subject_1.Subject();
    };
    /**
     * Creates an {@link Observable}, that when subscribed to, sends a message,
     * defined by the `subMsg` function, to the server over the socket to begin a
     * subscription to data over that socket. Once data arrives, the
     * `messageFilter` argument will be used to select the appropriate data for
     * the resulting Observable. When teardown occurs, either due to
     * unsubscription, completion or error, a message defined by the `unsubMsg`
     * argument will be send to the server over the WebSocketSubject.
     *
     * @param subMsg A function to generate the subscription message to be sent to
     * the server. This will still be processed by the serializer in the
     * WebSocketSubject's config. (Which defaults to JSON serialization)
     * @param unsubMsg A function to generate the unsubscription message to be
     * sent to the server at teardown. This will still be processed by the
     * serializer in the WebSocketSubject's config.
     * @param messageFilter A predicate for selecting the appropriate messages
     * from the server for the output stream.
     */
    WebSocketSubject.prototype.multiplex = function (subMsg, unsubMsg, messageFilter) {
        var self = this;
        return new Observable_1.Observable(function (observer) {
            var result = tryCatch_1.tryCatch(subMsg)();
            if (result === errorObject_1.errorObject) {
                observer.error(errorObject_1.errorObject.e);
            }
            else {
                self.next(result);
            }
            var subscription = self.subscribe(function (x) {
                var result = tryCatch_1.tryCatch(messageFilter)(x);
                if (result === errorObject_1.errorObject) {
                    observer.error(errorObject_1.errorObject.e);
                }
                else if (result) {
                    observer.next(x);
                }
            }, function (err) { return observer.error(err); }, function () { return observer.complete(); });
            return function () {
                var result = tryCatch_1.tryCatch(unsubMsg)();
                if (result === errorObject_1.errorObject) {
                    observer.error(errorObject_1.errorObject.e);
                }
                else {
                    self.next(result);
                }
                subscription.unsubscribe();
            };
        });
    };
    WebSocketSubject.prototype._connectSocket = function () {
        var _this = this;
        var _a = this._config, WebSocketCtor = _a.WebSocketCtor, protocol = _a.protocol, url = _a.url, binaryType = _a.binaryType;
        var observer = this._output;
        var socket = null;
        try {
            socket = protocol ?
                new WebSocketCtor(url, protocol) :
                new WebSocketCtor(url);
            this._socket = socket;
            if (binaryType) {
                this._socket.binaryType = binaryType;
            }
        }
        catch (e) {
            observer.error(e);
            return;
        }
        var subscription = new Subscription_1.Subscription(function () {
            _this._socket = null;
            if (socket && socket.readyState === 1) {
                socket.close();
            }
        });
        socket.onopen = function (e) {
            var openObserver = _this._config.openObserver;
            if (openObserver) {
                openObserver.next(e);
            }
            var queue = _this.destination;
            _this.destination = Subscriber_1.Subscriber.create(function (x) {
                if (socket.readyState === 1) {
                    var serializer = _this._config.serializer;
                    var msg = tryCatch_1.tryCatch(serializer)(x);
                    if (msg === errorObject_1.errorObject) {
                        _this.destination.error(errorObject_1.errorObject.e);
                        return;
                    }
                    socket.send(msg);
                }
            }, function (e) {
                var closingObserver = _this._config.closingObserver;
                if (closingObserver) {
                    closingObserver.next(undefined);
                }
                if (e && e.code) {
                    socket.close(e.code, e.reason);
                }
                else {
                    observer.error(new TypeError(WEBSOCKETSUBJECT_INVALID_ERROR_OBJECT));
                }
                _this._resetState();
            }, function () {
                var closingObserver = _this._config.closingObserver;
                if (closingObserver) {
                    closingObserver.next(undefined);
                }
                socket.close();
                _this._resetState();
            });
            if (queue && queue instanceof ReplaySubject_1.ReplaySubject) {
                subscription.add(queue.subscribe(_this.destination));
            }
        };
        socket.onerror = function (e) {
            _this._resetState();
            observer.error(e);
        };
        socket.onclose = function (e) {
            _this._resetState();
            var closeObserver = _this._config.closeObserver;
            if (closeObserver) {
                closeObserver.next(e);
            }
            if (e.wasClean) {
                observer.complete();
            }
            else {
                observer.error(e);
            }
        };
        socket.onmessage = function (e) {
            var deserializer = _this._config.deserializer;
            var result = tryCatch_1.tryCatch(deserializer)(e);
            if (result === errorObject_1.errorObject) {
                observer.error(errorObject_1.errorObject.e);
            }
            else {
                observer.next(result);
            }
        };
    };
    /** @deprecated This is an internal implementation detail, do not use. */
    WebSocketSubject.prototype._subscribe = function (subscriber) {
        var _this = this;
        var source = this.source;
        if (source) {
            return source.subscribe(subscriber);
        }
        if (!this._socket) {
            this._connectSocket();
        }
        this._output.subscribe(subscriber);
        subscriber.add(function () {
            var _socket = _this._socket;
            if (_this._output.observers.length === 0) {
                if (_socket && _socket.readyState === 1) {
                    _socket.close();
                }
                _this._resetState();
            }
        });
        return subscriber;
    };
    WebSocketSubject.prototype.unsubscribe = function () {
        var _a = this, source = _a.source, _socket = _a._socket;
        if (_socket && _socket.readyState === 1) {
            _socket.close();
            this._resetState();
        }
        _super.prototype.unsubscribe.call(this);
        if (!source) {
            this.destination = new ReplaySubject_1.ReplaySubject();
        }
    };
    return WebSocketSubject;
}(Subject_1.AnonymousSubject));
exports.WebSocketSubject = WebSocketSubject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2ViU29ja2V0U3ViamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb2JzZXJ2YWJsZS9kb20vV2ViU29ja2V0U3ViamVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUEwRDtBQUMxRCwrQ0FBOEM7QUFDOUMsK0NBQThDO0FBQzlDLG1EQUFrRDtBQUVsRCxxREFBb0Q7QUFFcEQsZ0RBQStDO0FBQy9DLHNEQUFxRDtBQTBDckQsSUFBTSx3QkFBd0IsR0FBZ0M7SUFDNUQsR0FBRyxFQUFFLEVBQUU7SUFDUCxZQUFZLEVBQUUsVUFBQyxDQUFlLElBQUssT0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBbEIsQ0FBa0I7SUFDckQsVUFBVSxFQUFFLFVBQUMsS0FBVSxJQUFLLE9BQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBckIsQ0FBcUI7Q0FDbEQsQ0FBQztBQUVGLElBQU0scUNBQXFDLEdBQ3pDLG1JQUFtSSxDQUFDO0FBSXRJOzs7O0dBSUc7QUFDSDtJQUF5QyxvQ0FBbUI7SUFTMUQsMEJBQVksaUJBQXFFLEVBQUUsV0FBeUI7UUFBNUcsWUFDRSxpQkFBTyxTQXdCUjtRQXZCQyxJQUFJLGlCQUFpQixZQUFZLHVCQUFVLEVBQUU7WUFDM0MsS0FBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7WUFDL0IsS0FBSSxDQUFDLE1BQU0sR0FBRyxpQkFBa0MsQ0FBQztTQUNsRDthQUFNO1lBQ0wsSUFBTSxNQUFNLEdBQUcs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VyxHQUFHLElBQUksNkJBQWEsRUFBRSxDQUFDO1NBQ3hDO0lBQ0gsQ0FBQztJQUNILHVCQUFDO0FBQUQsQ0FBQyxBQTVPRCxDQUF5QywwQkFBZ0IsR0E0T3hEO0FBNU9ZLDRDQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN1YmplY3QsIEFub255bW91c1N1YmplY3QgfSBmcm9tICcuLi8uLi9TdWJqZWN0JztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi8uLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi8uLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uLy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uLy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFJlcGxheVN1YmplY3QgfSBmcm9tICcuLi8uLi9SZXBsYXlTdWJqZWN0JztcbmltcG9ydCB7IE9ic2VydmVyLCBOZXh0T2JzZXJ2ZXIgfSBmcm9tICcuLi8uLi90eXBlcyc7XG5pbXBvcnQgeyB0cnlDYXRjaCB9IGZyb20gJy4uLy4uL3V0aWwvdHJ5Q2F0Y2gnO1xuaW1wb3J0IHsgZXJyb3JPYmplY3QgfSBmcm9tICcuLi8uLi91dGlsL2Vycm9yT2JqZWN0JztcblxuZXhwb3J0IGludGVyZmFjZSBXZWJTb2NrZXRTdWJqZWN0Q29uZmlnPFQ+IHtcbiAgLyoqIFRoZSB1cmwgb2YgdGhlIHNvY2tldCBzZXJ2ZXIgdG8gY29ubmVjdCB0byAqL1xuICB1cmw6IHN0cmluZztcbiAgLyoqIFRoZSBwcm90b2NvbCB0byB1c2UgdG8gY29ubmVjdCAqL1xuICBwcm90b2NvbD86IHN0cmluZyB8IEFycmF5PHN0cmluZz47XG4gIC8qKiBAZGVwcmVjYXRlZCB1c2Uge0BsaW5rIGRlc2VyaWFsaXplcn0gKi9cbiAgcmVzdWx0U2VsZWN0b3I/OiAoZTogTWVzc2FnZUV2ZW50KSA9PiBUO1xuICAvKipcbiAgICogQSBzZXJpYWxpemVyIHVzZWQgdG8gY3JlYXRlIG1lc3NhZ2VzIGZyb20gcGFzc2VkIHZhbHVlcyBiZWZvcmUgdGhlXG4gICAqIG1lc3NhZ2VzIGFyZSBzZW50IHRvIHRoZSBzZXJ2ZXIuIERlZmF1bHRzIHRvIEpTT04uc3RyaW5naWZ5LlxuICAgKi9cbiAgc2VyaWFsaXplcj86ICh2YWx1ZTogVCkgPT4gV2ViU29ja2V0TWVzc2FnZTtcbiAgLyoqXG4gICAqIEEgZGVzZXJpYWxpemVyIHVzZWQgZm9yIG1lc3NhZ2VzIGFycml2aW5nIG9uIHRoZSBzb2NrZXQgZnJvbSB0aGVcbiAgICogc2VydmVyLiBEZWZhdWx0cyB0byBKU09OLnBhcnNlLlxuICAgKi9cbiAgZGVzZXJpYWxpemVyPzogKGU6IE1lc3NhZ2VFdmVudCkgPT4gVDtcbiAgLyoqXG4gICAqIEFuIE9ic2VydmVyIHRoYXQgd2F0Y2hlcyB3aGVuIG9wZW4gZXZlbnRzIG9jY3VyIG9uIHRoZSB1bmRlcmx5aW5nIHdlYiBzb2NrZXQuXG4gICAqL1xuICBvcGVuT2JzZXJ2ZXI/OiBOZXh0T2JzZXJ2ZXI8RXZlbnQ+O1xuICAvKipcbiAgICogQW4gT2JzZXJ2ZXIgdGhhbiB3YXRjaGVzIHdoZW4gY2xvc2UgZXZlbnRzIG9jY3VyIG9uIHRoZSB1bmRlcmx5aW5nIHdlYlNvY2tldFxuICAgKi9cbiAgY2xvc2VPYnNlcnZlcj86IE5leHRPYnNlcnZlcjxDbG9zZUV2ZW50PjtcbiAgLyoqXG4gICAqIEFuIE9ic2VydmVyIHRoYXQgd2F0Y2hlcyB3aGVuIGEgY2xvc2UgaXMgYWJvdXQgdG8gb2NjdXIgZHVlIHRvXG4gICAqIHVuc3Vic2NyaXB0aW9uLlxuICAgKi9cbiAgY2xvc2luZ09ic2VydmVyPzogTmV4dE9ic2VydmVyPHZvaWQ+O1xuICAvKipcbiAgICogQSBXZWJTb2NrZXQgY29uc3RydWN0b3IgdG8gdXNlLiBUaGlzIGlzIHVzZWZ1bCBmb3Igc2l0dWF0aW9ucyBsaWtlIHVzaW5nIGFcbiAgICogV2ViU29ja2V0IGltcGwgaW4gTm9kZSAoV2ViU29ja2V0IGlzIGEgRE9NIEFQSSksIG9yIGZvciBtb2NraW5nIGEgV2ViU29ja2V0XG4gICAqIGZvciB0ZXN0aW5nIHB1cnBvc2VzXG4gICAqL1xuICBXZWJTb2NrZXRDdG9yPzogeyBuZXcodXJsOiBzdHJpbmcsIHByb3RvY29scz86IHN0cmluZ3xzdHJpbmdbXSk6IFdlYlNvY2tldCB9O1xuICAvKiogU2V0cyB0aGUgYGJpbmFyeVR5cGVgIHByb3BlcnR5IG9mIHRoZSB1bmRlcmx5aW5nIFdlYlNvY2tldC4gKi9cbiAgYmluYXJ5VHlwZT86ICdibG9iJyB8ICdhcnJheWJ1ZmZlcic7XG59XG5cbmNvbnN0IERFRkFVTFRfV0VCU09DS0VUX0NPTkZJRzogV2ViU29ja2V0U3ViamVjdENvbmZpZzxhbnk+ID0ge1xuICB1cmw6ICcnLFxuICBkZXNlcmlhbGl6ZXI6IChlOiBNZXNzYWdlRXZlbnQpID0+IEpTT04ucGFyc2UoZS5kYXRhKSxcbiAgc2VyaWFsaXplcjogKHZhbHVlOiBhbnkpID0+IEpTT04uc3RyaW5naWZ5KHZhbHVlKSxcbn07XG5cbmNvbnN0IFdFQlNPQ0tFVFNVQkpFQ1RfSU5WQUxJRF9FUlJPUl9PQkpFQ1QgPVxuICAnV2ViU29ja2V0U3ViamVjdC5lcnJvciBtdXN0IGJlIGNhbGxlZCB3aXRoIGFuIG9iamVjdCB3aXRoIGFuIGVycm9yIGNvZGUsIGFuZCBhbiBvcHRpb25hbCByZWFzb246IHsgY29kZTogbnVtYmVyLCByZWFzb246IHN0cmluZyB9JztcblxuZXhwb3J0IHR5cGUgV2ViU29ja2V0TWVzc2FnZSA9IHN0cmluZyB8IEFycmF5QnVmZmVyIHwgQmxvYiB8IEFycmF5QnVmZmVyVmlldztcblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKiBAaGlkZSB0cnVlXG4gKi9cbmV4cG9ydCBjbGFzcyBXZWJTb2NrZXRTdWJqZWN0PFQ+IGV4dGVuZHMgQW5vbnltb3VzU3ViamVjdDxUPiB7XG5cbiAgcHJpdmF0ZSBfY29uZmlnOiBXZWJTb2NrZXRTdWJqZWN0Q29uZmlnPFQ+O1xuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX291dHB1dDogU3ViamVjdDxUPjtcblxuICBwcml2YXRlIF9zb2NrZXQ6IFdlYlNvY2tldDtcblxuICBjb25zdHJ1Y3Rvcih1cmxDb25maWdPclNvdXJjZTogc3RyaW5nIHwgV2ViU29ja2V0U3ViamVjdENvbmZpZzxUPiB8IE9ic2VydmFibGU8VD4sIGRlc3RpbmF0aW9uPzogT2JzZXJ2ZXI8VD4pIHtcbiAgICBzdXBlcigpO1xuICAgIGlmICh1cmxDb25maWdPclNvdXJjZSBpbnN0YW5jZW9mIE9ic2VydmFibGUpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24gPSBkZXN0aW5hdGlvbjtcbiAgICAgIHRoaXMuc291cmNlID0gdXJsQ29uZmlnT3JTb3VyY2UgYXMgT2JzZXJ2YWJsZTxUPjtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5fY29uZmlnID0geyAuLi5ERUZBVUxUX1dFQlNPQ0tFVF9DT05GSUcgfTtcbiAgICAgIHRoaXMuX291dHB1dCA9IG5ldyBTdWJqZWN0PFQ+KCk7XG4gICAgICBpZiAodHlwZW9mIHVybENvbmZpZ09yU291cmNlID09PSAnc3RyaW5nJykge1xuICAgICAgICBjb25maWcudXJsID0gdXJsQ29uZmlnT3JTb3VyY2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gdXJsQ29uZmlnT3JTb3VyY2UpIHtcbiAgICAgICAgICBpZiAodXJsQ29uZmlnT3JTb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgY29uZmlnW2tleV0gPSB1cmxDb25maWdPclNvdXJjZVtrZXldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIWNvbmZpZy5XZWJTb2NrZXRDdG9yICYmIFdlYlNvY2tldCkge1xuICAgICAgICBjb25maWcuV2ViU29ja2V0Q3RvciA9IFdlYlNvY2tldDtcbiAgICAgIH0gZWxzZSBpZiAoIWNvbmZpZy5XZWJTb2NrZXRDdG9yKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbm8gV2ViU29ja2V0IGNvbnN0cnVjdG9yIGNhbiBiZSBmb3VuZCcpO1xuICAgICAgfVxuICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IG5ldyBSZXBsYXlTdWJqZWN0KCk7XG4gICAgfVxuICB9XG5cbiAgbGlmdDxSPihvcGVyYXRvcjogT3BlcmF0b3I8VCwgUj4pOiBXZWJTb2NrZXRTdWJqZWN0PFI+IHtcbiAgICBjb25zdCBzb2NrID0gbmV3IFdlYlNvY2tldFN1YmplY3Q8Uj4odGhpcy5fY29uZmlnIGFzIFdlYlNvY2tldFN1YmplY3RDb25maWc8YW55PiwgPGFueT4gdGhpcy5kZXN0aW5hdGlvbik7XG4gICAgc29jay5vcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgIHNvY2suc291cmNlID0gdGhpcztcbiAgICByZXR1cm4gc29jaztcbiAgfVxuXG4gIHByaXZhdGUgX3Jlc2V0U3RhdGUoKSB7XG4gICAgdGhpcy5fc29ja2V0ID0gbnVsbDtcbiAgICBpZiAoIXRoaXMuc291cmNlKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uID0gbmV3IFJlcGxheVN1YmplY3QoKTtcbiAgICB9XG4gICAgdGhpcy5fb3V0cHV0ID0gbmV3IFN1YmplY3Q8VD4oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIHtAbGluayBPYnNlcnZhYmxlfSwgdGhhdCB3aGVuIHN1YnNjcmliZWQgdG8sIHNlbmRzIGEgbWVzc2FnZSxcbiAgICogZGVmaW5lZCBieSB0aGUgYHN1Yk1zZ2AgZnVuY3Rpb24sIHRvIHRoZSBzZXJ2ZXIgb3ZlciB0aGUgc29ja2V0IHRvIGJlZ2luIGFcbiAgICogc3Vic2NyaXB0aW9uIHRvIGRhdGEgb3ZlciB0aGF0IHNvY2tldC4gT25jZSBkYXRhIGFycml2ZXMsIHRoZVxuICAgKiBgbWVzc2FnZUZpbHRlcmAgYXJndW1lbnQgd2lsbCBiZSB1c2VkIHRvIHNlbGVjdCB0aGUgYXBwcm9wcmlhdGUgZGF0YSBmb3JcbiAgICogdGhlIHJlc3VsdGluZyBPYnNlcnZhYmxlLiBXaGVuIHRlYXJkb3duIG9jY3VycywgZWl0aGVyIGR1ZSB0b1xuICAgKiB1bnN1YnNjcmlwdGlvbiwgY29tcGxldGlvbiBvciBlcnJvciwgYSBtZXNzYWdlIGRlZmluZWQgYnkgdGhlIGB1bnN1Yk1zZ2BcbiAgICogYXJndW1lbnQgd2lsbCBiZSBzZW5kIHRvIHRoZSBzZXJ2ZXIgb3ZlciB0aGUgV2ViU29ja2V0U3ViamVjdC5cbiAgICpcbiAgICogQHBhcmFtIHN1Yk1zZyBBIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIHRoZSBzdWJzY3JpcHRpb24gbWVzc2FnZSB0byBiZSBzZW50IHRvXG4gICAqIHRoZSBzZXJ2ZXIuIFRoaXMgd2lsbCBzdGlsbCBiZSBwcm9jZXNzZWQgYnkgdGhlIHNlcmlhbGl6ZXIgaW4gdGhlXG4gICAqIFdlYlNvY2tldFN1YmplY3QncyBjb25maWcuIChXaGljaCBkZWZhdWx0cyB0byBKU09OIHNlcmlhbGl6YXRpb24pXG4gICAqIEBwYXJhbSB1bnN1Yk1zZyBBIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIHRoZSB1bnN1YnNjcmlwdGlvbiBtZXNzYWdlIHRvIGJlXG4gICAqIHNlbnQgdG8gdGhlIHNlcnZlciBhdCB0ZWFyZG93bi4gVGhpcyB3aWxsIHN0aWxsIGJlIHByb2Nlc3NlZCBieSB0aGVcbiAgICogc2VyaWFsaXplciBpbiB0aGUgV2ViU29ja2V0U3ViamVjdCdzIGNvbmZpZy5cbiAgICogQHBhcmFtIG1lc3NhZ2VGaWx0ZXIgQSBwcmVkaWNhdGUgZm9yIHNlbGVjdGluZyB0aGUgYXBwcm9wcmlhdGUgbWVzc2FnZXNcbiAgICogZnJvbSB0aGUgc2VydmVyIGZvciB0aGUgb3V0cHV0IHN0cmVhbS5cbiAgICovXG4gIG11bHRpcGxleChzdWJNc2c6ICgpID0+IGFueSwgdW5zdWJNc2c6ICgpID0+IGFueSwgbWVzc2FnZUZpbHRlcjogKHZhbHVlOiBUKSA9PiBib29sZWFuKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKChvYnNlcnZlcjogT2JzZXJ2ZXI8YW55PikgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gdHJ5Q2F0Y2goc3ViTXNnKSgpO1xuICAgICAgaWYgKHJlc3VsdCA9PT0gZXJyb3JPYmplY3QpIHtcbiAgICAgICAgb2JzZXJ2ZXIuZXJyb3IoZXJyb3JPYmplY3QuZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLm5leHQocmVzdWx0KTtcbiAgICAgIH1cblxuICAgICAgbGV0IHN1YnNjcmlwdGlvbiA9IHNlbGYuc3Vic2NyaWJlKHggPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB0cnlDYXRjaChtZXNzYWdlRmlsdGVyKSh4KTtcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZXJyb3JPYmplY3QpIHtcbiAgICAgICAgICBvYnNlcnZlci5lcnJvcihlcnJvck9iamVjdC5lKTtcbiAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICBvYnNlcnZlci5uZXh0KHgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgICBlcnIgPT4gb2JzZXJ2ZXIuZXJyb3IoZXJyKSxcbiAgICAgICAgKCkgPT4gb2JzZXJ2ZXIuY29tcGxldGUoKSk7XG5cbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHRyeUNhdGNoKHVuc3ViTXNnKSgpO1xuICAgICAgICBpZiAocmVzdWx0ID09PSBlcnJvck9iamVjdCkge1xuICAgICAgICAgIG9ic2VydmVyLmVycm9yKGVycm9yT2JqZWN0LmUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlbGYubmV4dChyZXN1bHQpO1xuICAgICAgICB9XG4gICAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2Nvbm5lY3RTb2NrZXQoKSB7XG4gICAgY29uc3QgeyBXZWJTb2NrZXRDdG9yLCBwcm90b2NvbCwgdXJsLCBiaW5hcnlUeXBlIH0gPSB0aGlzLl9jb25maWc7XG4gICAgY29uc3Qgb2JzZXJ2ZXIgPSB0aGlzLl9vdXRwdXQ7XG5cbiAgICBsZXQgc29ja2V0OiBXZWJTb2NrZXQgPSBudWxsO1xuICAgIHRyeSB7XG4gICAgICBzb2NrZXQgPSBwcm90b2NvbCA/XG4gICAgICAgIG5ldyBXZWJTb2NrZXRDdG9yKHVybCwgcHJvdG9jb2wpIDpcbiAgICAgICAgbmV3IFdlYlNvY2tldEN0b3IodXJsKTtcbiAgICAgIHRoaXMuX3NvY2tldCA9IHNvY2tldDtcbiAgICAgIGlmIChiaW5hcnlUeXBlKSB7XG4gICAgICAgIHRoaXMuX3NvY2tldC5iaW5hcnlUeXBlID0gYmluYXJ5VHlwZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBvYnNlcnZlci5lcnJvcihlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCgpID0+IHtcbiAgICAgIHRoaXMuX3NvY2tldCA9IG51bGw7XG4gICAgICBpZiAoc29ja2V0ICYmIHNvY2tldC5yZWFkeVN0YXRlID09PSAxKSB7XG4gICAgICAgIHNvY2tldC5jbG9zZSgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgc29ja2V0Lm9ub3BlbiA9IChlOiBFdmVudCkgPT4ge1xuICAgICAgY29uc3QgeyBvcGVuT2JzZXJ2ZXIgfSA9IHRoaXMuX2NvbmZpZztcbiAgICAgIGlmIChvcGVuT2JzZXJ2ZXIpIHtcbiAgICAgICAgb3Blbk9ic2VydmVyLm5leHQoZSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHF1ZXVlID0gdGhpcy5kZXN0aW5hdGlvbjtcblxuICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IFN1YnNjcmliZXIuY3JlYXRlPFQ+KFxuICAgICAgICAoeCkgPT4ge1xuICAgICAgICAgIGlmIChzb2NrZXQucmVhZHlTdGF0ZSA9PT0gMSkge1xuICAgICAgICAgICAgY29uc3QgeyBzZXJpYWxpemVyIH0gPSB0aGlzLl9jb25maWc7XG4gICAgICAgICAgICBjb25zdCBtc2cgPSB0cnlDYXRjaChzZXJpYWxpemVyKSh4KTtcbiAgICAgICAgICAgIGlmIChtc2cgPT09IGVycm9yT2JqZWN0KSB7XG4gICAgICAgICAgICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyb3JPYmplY3QuZSk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNvY2tldC5zZW5kKG1zZyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAoZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHsgY2xvc2luZ09ic2VydmVyIH0gPSB0aGlzLl9jb25maWc7XG4gICAgICAgICAgaWYgKGNsb3NpbmdPYnNlcnZlcikge1xuICAgICAgICAgICAgY2xvc2luZ09ic2VydmVyLm5leHQodW5kZWZpbmVkKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGUgJiYgZS5jb2RlKSB7XG4gICAgICAgICAgICBzb2NrZXQuY2xvc2UoZS5jb2RlLCBlLnJlYXNvbik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9ic2VydmVyLmVycm9yKG5ldyBUeXBlRXJyb3IoV0VCU09DS0VUU1VCSkVDVF9JTlZBTElEX0VSUk9SX09CSkVDVCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLl9yZXNldFN0YXRlKCk7XG4gICAgICAgIH0sXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICBjb25zdCB7IGNsb3NpbmdPYnNlcnZlciB9ID0gdGhpcy5fY29uZmlnO1xuICAgICAgICAgIGlmIChjbG9zaW5nT2JzZXJ2ZXIpIHtcbiAgICAgICAgICAgIGNsb3NpbmdPYnNlcnZlci5uZXh0KHVuZGVmaW5lZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNvY2tldC5jbG9zZSgpO1xuICAgICAgICAgIHRoaXMuX3Jlc2V0U3RhdGUoKTtcbiAgICAgICAgfVxuICAgICAgKSBhcyBTdWJzY3JpYmVyPGFueT47XG5cbiAgICAgIGlmIChxdWV1ZSAmJiBxdWV1ZSBpbnN0YW5jZW9mIFJlcGxheVN1YmplY3QpIHtcbiAgICAgICAgc3Vic2NyaXB0aW9uLmFkZCgoPFJlcGxheVN1YmplY3Q8VD4+cXVldWUpLnN1YnNjcmliZSh0aGlzLmRlc3RpbmF0aW9uKSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHNvY2tldC5vbmVycm9yID0gKGU6IEV2ZW50KSA9PiB7XG4gICAgICB0aGlzLl9yZXNldFN0YXRlKCk7XG4gICAgICBvYnNlcnZlci5lcnJvcihlKTtcbiAgICB9O1xuXG4gICAgc29ja2V0Lm9uY2xvc2UgPSAoZTogQ2xvc2VFdmVudCkgPT4ge1xuICAgICAgdGhpcy5fcmVzZXRTdGF0ZSgpO1xuICAgICAgY29uc3QgeyBjbG9zZU9ic2VydmVyIH0gPSB0aGlzLl9jb25maWc7XG4gICAgICBpZiAoY2xvc2VPYnNlcnZlcikge1xuICAgICAgICBjbG9zZU9ic2VydmVyLm5leHQoZSk7XG4gICAgICB9XG4gICAgICBpZiAoZS53YXNDbGVhbikge1xuICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb2JzZXJ2ZXIuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHNvY2tldC5vbm1lc3NhZ2UgPSAoZTogTWVzc2FnZUV2ZW50KSA9PiB7XG4gICAgICBjb25zdCB7IGRlc2VyaWFsaXplciB9ID0gdGhpcy5fY29uZmlnO1xuICAgICAgY29uc3QgcmVzdWx0ID0gdHJ5Q2F0Y2goZGVzZXJpYWxpemVyKShlKTtcbiAgICAgIGlmIChyZXN1bHQgPT09IGVycm9yT2JqZWN0KSB7XG4gICAgICAgIG9ic2VydmVyLmVycm9yKGVycm9yT2JqZWN0LmUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb2JzZXJ2ZXIubmV4dChyZXN1bHQpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF9zdWJzY3JpYmUoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPik6IFN1YnNjcmlwdGlvbiB7XG4gICAgY29uc3QgeyBzb3VyY2UgfSA9IHRoaXM7XG4gICAgaWYgKHNvdXJjZSkge1xuICAgICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgfVxuICAgIGlmICghdGhpcy5fc29ja2V0KSB7XG4gICAgICB0aGlzLl9jb25uZWN0U29ja2V0KCk7XG4gICAgfVxuICAgIHRoaXMuX291dHB1dC5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgc3Vic2NyaWJlci5hZGQoKCkgPT4ge1xuICAgICAgY29uc3QgeyBfc29ja2V0IH0gPSB0aGlzO1xuICAgICAgaWYgKHRoaXMuX291dHB1dC5vYnNlcnZlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGlmIChfc29ja2V0ICYmIF9zb2NrZXQucmVhZHlTdGF0ZSA9PT0gMSkge1xuICAgICAgICAgIF9zb2NrZXQuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9yZXNldFN0YXRlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHN1YnNjcmliZXI7XG4gIH1cblxuICB1bnN1YnNjcmliZSgpIHtcbiAgICBjb25zdCB7IHNvdXJjZSwgX3NvY2tldCB9ID0gdGhpcztcbiAgICBpZiAoX3NvY2tldCAmJiBfc29ja2V0LnJlYWR5U3RhdGUgPT09IDEpIHtcbiAgICAgIF9zb2NrZXQuY2xvc2UoKTtcbiAgICAgIHRoaXMuX3Jlc2V0U3RhdGUoKTtcbiAgICB9XG4gICAgc3VwZXIudW5zdWJzY3JpYmUoKTtcbiAgICBpZiAoIXNvdXJjZSkge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IG5ldyBSZXBsYXlTdWJqZWN0KCk7XG4gICAgfVxuICB9XG59XG4iXX0=