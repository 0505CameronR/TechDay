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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2ViU29ja2V0U3ViamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29ic2VydmFibGUvZG9tL1dlYlNvY2tldFN1YmplY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBMEQ7QUFDMUQsK0NBQThDO0FBQzlDLCtDQUE4QztBQUM5QyxtREFBa0Q7QUFFbEQscURBQW9EO0FBRXBELGdEQUErQztBQUMvQyxzREFBcUQ7QUEwQ3JELElBQU0sd0JBQXdCLEdBQWdDO0lBQzVELEdBQUcsRUFBRSxFQUFFO0lBQ1AsWUFBWSxFQUFFLFVBQUMsQ0FBZSxJQUFLLE9BQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQWxCLENBQWtCO0lBQ3JELFVBQVUsRUFBRSxVQUFDLEtBQVUsSUFBSyxPQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQXJCLENBQXFCO0NBQ2xELENBQUM7QUFFRixJQUFNLHFDQUFxQyxHQUN6QyxtSUFBbUksQ0FBQztBQUl0STs7OztHQUlHO0FBQ0g7SUFBeUMsb0NBQW1CO0lBUzFELDBCQUFZLGlCQUFxRSxFQUFFLFdBQXlCO1FBQTVHLFlBQ0UsaUJBQU8sU0F3QlI7UUF2QkMsSUFBSSxpQkFBaUIsWUFBWSx1QkFBVSxFQUFFO1lBQzNDLEtBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1lBQy9CLEtBQUksQ0FBQyxNQUFNLEdBQUcsaUJBQWtDLENBQUM7U0FDbEQ7YUFBTTtZQUNMLElBQU0sTUFBTSxHQUFHLEtBQUksQ0FBQyxPQUFPLGdCQUFRLHdCQUF3QixDQUFFLENBQUM7WUFDOUQsS0FBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLGlCQUFPLEVBQUssQ0FBQztZQUNoQyxJQUFJLE9BQU8saUJBQWlCLEtBQUssUUFBUSxFQUFFO2dCQUN6QyxNQUFNLENBQUMsR0FBRyxHQUFHLGlCQUFpQixDQUFDO2FBQ2hDO2lCQUFNO2dCQUNMLEtBQUssSUFBSSxHQUFHLElBQUksaUJBQWlCLEVBQUU7b0JBQ2pDLElBQUksaUJBQWlCLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUFFO3dCQUN6QyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQ3RDO2lCQUNGO2FBQ0Y7WUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsSUFBSSxTQUFTLEVBQUU7Z0JBQ3RDLE1BQU0sQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFDO2FBQ2xDO2lCQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFO2dCQUNoQyxNQUFNLElBQUksS0FBSyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7YUFDMUQ7WUFDRCxLQUFJLENBQUMsV0FBVyxHQUFHLElBQUksNkJBQWEsRUFBRSxDQUFDO1NBQ3hDOztJQUNILENBQUM7SUFFRCwrQkFBSSxHQUFKLFVBQVEsUUFBd0I7UUFDOUIsSUFBTSxJQUFJLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBSSxJQUFJLENBQUMsT0FBc0MsRUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDMUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbkIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU8sc0NBQVcsR0FBbkI7UUFDRSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNoQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksNkJBQWEsRUFBRSxDQUFDO1NBQ3hDO1FBQ0QsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLGlCQUFPLEVBQUssQ0FBQztJQUNsQyxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7O09BaUJHO0lBQ0gsb0NBQVMsR0FBVCxVQUFVLE1BQWlCLEVBQUUsUUFBbUIsRUFBRSxhQUFvQztRQUNwRixJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsT0FBTyxJQUFJLHVCQUFVLENBQUMsVUFBQyxRQUF1QjtZQUM1QyxJQUFNLE1BQU0sR0FBRyxtQkFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDbEMsSUFBSSxNQUFNLEtBQUsseUJBQVcsRUFBRTtnQkFDMUIsUUFBUSxDQUFDLEtBQUssQ0FBQyx5QkFBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQy9CO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDbkI7WUFFRCxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQUEsQ0FBQztnQkFDakMsSUFBTSxNQUFNLEdBQUcsbUJBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDMUMsSUFBSSxNQUFNLEtBQUsseUJBQVcsRUFBRTtvQkFDMUIsUUFBUSxDQUFDLEtBQUssQ0FBQyx5QkFBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUMvQjtxQkFBTSxJQUFJLE1BQU0sRUFBRTtvQkFDakIsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDbEI7WUFDSCxDQUFDLEVBQ0MsVUFBQSxHQUFHLElBQUksT0FBQSxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFuQixDQUFtQixFQUMxQixjQUFNLE9BQUEsUUFBUSxDQUFDLFFBQVEsRUFBRSxFQUFuQixDQUFtQixDQUFDLENBQUM7WUFFN0IsT0FBTztnQkFDTCxJQUFNLE1BQU0sR0FBRyxtQkFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7Z0JBQ3BDLElBQUksTUFBTSxLQUFLLHlCQUFXLEVBQUU7b0JBQzFCLFFBQVEsQ0FBQyxLQUFLLENBQUMseUJBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDL0I7cUJBQU07b0JBQ0wsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDbkI7Z0JBQ0QsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQzdCLENBQUMsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLHlDQUFjLEdBQXRCO1FBQUEsaUJBbUdDO1FBbEdPLElBQUEsaUJBQTJELEVBQXpELGdDQUFhLEVBQUUsc0JBQVEsRUFBRSxZQUFHLEVBQUUsMEJBQTJCLENBQUM7UUFDbEUsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUU5QixJQUFJLE1BQU0sR0FBYyxJQUFJLENBQUM7UUFDN0IsSUFBSTtZQUNGLE1BQU0sR0FBRyxRQUFRLENBQUMsQ0FBQztnQkFDakIsSUFBSSxhQUFhLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLElBQUksYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1lBQ3RCLElBQUksVUFBVSxFQUFFO2dCQUNkLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQzthQUN0QztTQUNGO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDVixRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLE9BQU87U0FDUjtRQUVELElBQU0sWUFBWSxHQUFHLElBQUksMkJBQVksQ0FBQztZQUNwQyxLQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztZQUNwQixJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsVUFBVSxLQUFLLENBQUMsRUFBRTtnQkFDckMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQ2hCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsTUFBTSxHQUFHLFVBQUMsQ0FBUTtZQUNmLElBQUEseUNBQVksQ0FBa0I7WUFDdEMsSUFBSSxZQUFZLEVBQUU7Z0JBQ2hCLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDdEI7WUFFRCxJQUFNLEtBQUssR0FBRyxLQUFJLENBQUMsV0FBVyxDQUFDO1lBRS9CLEtBQUksQ0FBQyxXQUFXLEdBQUcsdUJBQVUsQ0FBQyxNQUFNLENBQ2xDLFVBQUMsQ0FBQztnQkFDQSxJQUFJLE1BQU0sQ0FBQyxVQUFVLEtBQUssQ0FBQyxFQUFFO29CQUNuQixJQUFBLHFDQUFVLENBQWtCO29CQUNwQyxJQUFNLEdBQUcsR0FBRyxtQkFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNwQyxJQUFJLEdBQUcsS0FBSyx5QkFBVyxFQUFFO3dCQUN2QixLQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyx5QkFBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN0QyxPQUFPO3FCQUNSO29CQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ2xCO1lBQ0gsQ0FBQyxFQUNELFVBQUMsQ0FBQztnQkFDUSxJQUFBLCtDQUFlLENBQWtCO2dCQUN6QyxJQUFJLGVBQWUsRUFBRTtvQkFDbkIsZUFBZSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztpQkFDakM7Z0JBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRTtvQkFDZixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2lCQUNoQztxQkFBTTtvQkFDTCxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksU0FBUyxDQUFDLHFDQUFxQyxDQUFDLENBQUMsQ0FBQztpQkFDdEU7Z0JBQ0QsS0FBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3JCLENBQUMsRUFDRDtnQkFDVSxJQUFBLCtDQUFlLENBQWtCO2dCQUN6QyxJQUFJLGVBQWUsRUFBRTtvQkFDbkIsZUFBZSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztpQkFDakM7Z0JBQ0QsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNmLEtBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNyQixDQUFDLENBQ2lCLENBQUM7WUFFckIsSUFBSSxLQUFLLElBQUksS0FBSyxZQUFZLDZCQUFhLEVBQUU7Z0JBQzNDLFlBQVksQ0FBQyxHQUFHLENBQW9CLEtBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7YUFDekU7UUFDSCxDQUFDLENBQUM7UUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLFVBQUMsQ0FBUTtZQUN4QixLQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbkIsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQixDQUFDLENBQUM7UUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLFVBQUMsQ0FBYTtZQUM3QixLQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDWCxJQUFBLDJDQUFhLENBQWtCO1lBQ3ZDLElBQUksYUFBYSxFQUFFO2dCQUNqQixhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3ZCO1lBQ0QsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFO2dCQUNkLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQzthQUNyQjtpQkFBTTtnQkFDTCxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ25CO1FBQ0gsQ0FBQyxDQUFDO1FBRUYsTUFBTSxDQUFDLFNBQVMsR0FBRyxVQUFDLENBQWU7WUFDekIsSUFBQSx5Q0FBWSxDQUFrQjtZQUN0QyxJQUFNLE1BQU0sR0FBRyxtQkFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLElBQUksTUFBTSxLQUFLLHlCQUFXLEVBQUU7Z0JBQzFCLFFBQVEsQ0FBQyxLQUFLLENBQUMseUJBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUMvQjtpQkFBTTtnQkFDTCxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ3ZCO1FBQ0gsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELHlFQUF5RTtJQUN6RSxxQ0FBVSxHQUFWLFVBQVcsVUFBeUI7UUFBcEMsaUJBbUJDO1FBbEJTLElBQUEsb0JBQU0sQ0FBVTtRQUN4QixJQUFJLE1BQU0sRUFBRTtZQUNWLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNyQztRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2pCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztTQUN2QjtRQUNELElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ25DLFVBQVUsQ0FBQyxHQUFHLENBQUM7WUFDTCxJQUFBLHVCQUFPLENBQVU7WUFDekIsSUFBSSxLQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUN2QyxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBVSxLQUFLLENBQUMsRUFBRTtvQkFDdkMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO2lCQUNqQjtnQkFDRCxLQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7YUFDcEI7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxzQ0FBVyxHQUFYO1FBQ1EsSUFBQSxTQUEwQixFQUF4QixrQkFBTSxFQUFFLG9CQUFnQixDQUFDO1FBQ2pDLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFVLEtBQUssQ0FBQyxFQUFFO1lBQ3ZDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNoQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDcEI7UUFDRCxpQkFBTSxXQUFXLFdBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1gsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLDZCQUFhLEVBQUUsQ0FBQztTQUN4QztJQUNILENBQUM7SUFDSCx1QkFBQztBQUFELENBQUMsQUE1T0QsQ0FBeUMsMEJBQWdCLEdBNE94RDtBQTVPWSw0Q0FBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdWJqZWN0LCBBbm9ueW1vdXNTdWJqZWN0IH0gZnJvbSAnLi4vLi4vU3ViamVjdCc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi8uLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi8uLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBSZXBsYXlTdWJqZWN0IH0gZnJvbSAnLi4vLi4vUmVwbGF5U3ViamVjdCc7XG5pbXBvcnQgeyBPYnNlcnZlciwgTmV4dE9ic2VydmVyIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuaW1wb3J0IHsgdHJ5Q2F0Y2ggfSBmcm9tICcuLi8uLi91dGlsL3RyeUNhdGNoJztcbmltcG9ydCB7IGVycm9yT2JqZWN0IH0gZnJvbSAnLi4vLi4vdXRpbC9lcnJvck9iamVjdCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgV2ViU29ja2V0U3ViamVjdENvbmZpZzxUPiB7XG4gIC8qKiBUaGUgdXJsIG9mIHRoZSBzb2NrZXQgc2VydmVyIHRvIGNvbm5lY3QgdG8gKi9cbiAgdXJsOiBzdHJpbmc7XG4gIC8qKiBUaGUgcHJvdG9jb2wgdG8gdXNlIHRvIGNvbm5lY3QgKi9cbiAgcHJvdG9jb2w/OiBzdHJpbmcgfCBBcnJheTxzdHJpbmc+O1xuICAvKiogQGRlcHJlY2F0ZWQgdXNlIHtAbGluayBkZXNlcmlhbGl6ZXJ9ICovXG4gIHJlc3VsdFNlbGVjdG9yPzogKGU6IE1lc3NhZ2VFdmVudCkgPT4gVDtcbiAgLyoqXG4gICAqIEEgc2VyaWFsaXplciB1c2VkIHRvIGNyZWF0ZSBtZXNzYWdlcyBmcm9tIHBhc3NlZCB2YWx1ZXMgYmVmb3JlIHRoZVxuICAgKiBtZXNzYWdlcyBhcmUgc2VudCB0byB0aGUgc2VydmVyLiBEZWZhdWx0cyB0byBKU09OLnN0cmluZ2lmeS5cbiAgICovXG4gIHNlcmlhbGl6ZXI/OiAodmFsdWU6IFQpID0+IFdlYlNvY2tldE1lc3NhZ2U7XG4gIC8qKlxuICAgKiBBIGRlc2VyaWFsaXplciB1c2VkIGZvciBtZXNzYWdlcyBhcnJpdmluZyBvbiB0aGUgc29ja2V0IGZyb20gdGhlXG4gICAqIHNlcnZlci4gRGVmYXVsdHMgdG8gSlNPTi5wYXJzZS5cbiAgICovXG4gIGRlc2VyaWFsaXplcj86IChlOiBNZXNzYWdlRXZlbnQpID0+IFQ7XG4gIC8qKlxuICAgKiBBbiBPYnNlcnZlciB0aGF0IHdhdGNoZXMgd2hlbiBvcGVuIGV2ZW50cyBvY2N1ciBvbiB0aGUgdW5kZXJseWluZyB3ZWIgc29ja2V0LlxuICAgKi9cbiAgb3Blbk9ic2VydmVyPzogTmV4dE9ic2VydmVyPEV2ZW50PjtcbiAgLyoqXG4gICAqIEFuIE9ic2VydmVyIHRoYW4gd2F0Y2hlcyB3aGVuIGNsb3NlIGV2ZW50cyBvY2N1ciBvbiB0aGUgdW5kZXJseWluZyB3ZWJTb2NrZXRcbiAgICovXG4gIGNsb3NlT2JzZXJ2ZXI/OiBOZXh0T2JzZXJ2ZXI8Q2xvc2VFdmVudD47XG4gIC8qKlxuICAgKiBBbiBPYnNlcnZlciB0aGF0IHdhdGNoZXMgd2hlbiBhIGNsb3NlIGlzIGFib3V0IHRvIG9jY3VyIGR1ZSB0b1xuICAgKiB1bnN1YnNjcmlwdGlvbi5cbiAgICovXG4gIGNsb3NpbmdPYnNlcnZlcj86IE5leHRPYnNlcnZlcjx2b2lkPjtcbiAgLyoqXG4gICAqIEEgV2ViU29ja2V0IGNvbnN0cnVjdG9yIHRvIHVzZS4gVGhpcyBpcyB1c2VmdWwgZm9yIHNpdHVhdGlvbnMgbGlrZSB1c2luZyBhXG4gICAqIFdlYlNvY2tldCBpbXBsIGluIE5vZGUgKFdlYlNvY2tldCBpcyBhIERPTSBBUEkpLCBvciBmb3IgbW9ja2luZyBhIFdlYlNvY2tldFxuICAgKiBmb3IgdGVzdGluZyBwdXJwb3Nlc1xuICAgKi9cbiAgV2ViU29ja2V0Q3Rvcj86IHsgbmV3KHVybDogc3RyaW5nLCBwcm90b2NvbHM/OiBzdHJpbmd8c3RyaW5nW10pOiBXZWJTb2NrZXQgfTtcbiAgLyoqIFNldHMgdGhlIGBiaW5hcnlUeXBlYCBwcm9wZXJ0eSBvZiB0aGUgdW5kZXJseWluZyBXZWJTb2NrZXQuICovXG4gIGJpbmFyeVR5cGU/OiAnYmxvYicgfCAnYXJyYXlidWZmZXInO1xufVxuXG5jb25zdCBERUZBVUxUX1dFQlNPQ0tFVF9DT05GSUc6IFdlYlNvY2tldFN1YmplY3RDb25maWc8YW55PiA9IHtcbiAgdXJsOiAnJyxcbiAgZGVzZXJpYWxpemVyOiAoZTogTWVzc2FnZUV2ZW50KSA9PiBKU09OLnBhcnNlKGUuZGF0YSksXG4gIHNlcmlhbGl6ZXI6ICh2YWx1ZTogYW55KSA9PiBKU09OLnN0cmluZ2lmeSh2YWx1ZSksXG59O1xuXG5jb25zdCBXRUJTT0NLRVRTVUJKRUNUX0lOVkFMSURfRVJST1JfT0JKRUNUID1cbiAgJ1dlYlNvY2tldFN1YmplY3QuZXJyb3IgbXVzdCBiZSBjYWxsZWQgd2l0aCBhbiBvYmplY3Qgd2l0aCBhbiBlcnJvciBjb2RlLCBhbmQgYW4gb3B0aW9uYWwgcmVhc29uOiB7IGNvZGU6IG51bWJlciwgcmVhc29uOiBzdHJpbmcgfSc7XG5cbmV4cG9ydCB0eXBlIFdlYlNvY2tldE1lc3NhZ2UgPSBzdHJpbmcgfCBBcnJheUJ1ZmZlciB8IEJsb2IgfCBBcnJheUJ1ZmZlclZpZXc7XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICogQGhpZGUgdHJ1ZVxuICovXG5leHBvcnQgY2xhc3MgV2ViU29ja2V0U3ViamVjdDxUPiBleHRlbmRzIEFub255bW91c1N1YmplY3Q8VD4ge1xuXG4gIHByaXZhdGUgX2NvbmZpZzogV2ViU29ja2V0U3ViamVjdENvbmZpZzxUPjtcblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF9vdXRwdXQ6IFN1YmplY3Q8VD47XG5cbiAgcHJpdmF0ZSBfc29ja2V0OiBXZWJTb2NrZXQ7XG5cbiAgY29uc3RydWN0b3IodXJsQ29uZmlnT3JTb3VyY2U6IHN0cmluZyB8IFdlYlNvY2tldFN1YmplY3RDb25maWc8VD4gfCBPYnNlcnZhYmxlPFQ+LCBkZXN0aW5hdGlvbj86IE9ic2VydmVyPFQ+KSB7XG4gICAgc3VwZXIoKTtcbiAgICBpZiAodXJsQ29uZmlnT3JTb3VyY2UgaW5zdGFuY2VvZiBPYnNlcnZhYmxlKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uID0gZGVzdGluYXRpb247XG4gICAgICB0aGlzLnNvdXJjZSA9IHVybENvbmZpZ09yU291cmNlIGFzIE9ic2VydmFibGU8VD47XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuX2NvbmZpZyA9IHsgLi4uREVGQVVMVF9XRUJTT0NLRVRfQ09ORklHIH07XG4gICAgICB0aGlzLl9vdXRwdXQgPSBuZXcgU3ViamVjdDxUPigpO1xuICAgICAgaWYgKHR5cGVvZiB1cmxDb25maWdPclNvdXJjZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29uZmlnLnVybCA9IHVybENvbmZpZ09yU291cmNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIHVybENvbmZpZ09yU291cmNlKSB7XG4gICAgICAgICAgaWYgKHVybENvbmZpZ09yU291cmNlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIGNvbmZpZ1trZXldID0gdXJsQ29uZmlnT3JTb3VyY2Vba2V5XTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFjb25maWcuV2ViU29ja2V0Q3RvciAmJiBXZWJTb2NrZXQpIHtcbiAgICAgICAgY29uZmlnLldlYlNvY2tldEN0b3IgPSBXZWJTb2NrZXQ7XG4gICAgICB9IGVsc2UgaWYgKCFjb25maWcuV2ViU29ja2V0Q3Rvcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIFdlYlNvY2tldCBjb25zdHJ1Y3RvciBjYW4gYmUgZm91bmQnKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZGVzdGluYXRpb24gPSBuZXcgUmVwbGF5U3ViamVjdCgpO1xuICAgIH1cbiAgfVxuXG4gIGxpZnQ8Uj4ob3BlcmF0b3I6IE9wZXJhdG9yPFQsIFI+KTogV2ViU29ja2V0U3ViamVjdDxSPiB7XG4gICAgY29uc3Qgc29jayA9IG5ldyBXZWJTb2NrZXRTdWJqZWN0PFI+KHRoaXMuX2NvbmZpZyBhcyBXZWJTb2NrZXRTdWJqZWN0Q29uZmlnPGFueT4sIDxhbnk+IHRoaXMuZGVzdGluYXRpb24pO1xuICAgIHNvY2sub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICBzb2NrLnNvdXJjZSA9IHRoaXM7XG4gICAgcmV0dXJuIHNvY2s7XG4gIH1cblxuICBwcml2YXRlIF9yZXNldFN0YXRlKCkge1xuICAgIHRoaXMuX3NvY2tldCA9IG51bGw7XG4gICAgaWYgKCF0aGlzLnNvdXJjZSkge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IG5ldyBSZXBsYXlTdWJqZWN0KCk7XG4gICAgfVxuICAgIHRoaXMuX291dHB1dCA9IG5ldyBTdWJqZWN0PFQ+KCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiB7QGxpbmsgT2JzZXJ2YWJsZX0sIHRoYXQgd2hlbiBzdWJzY3JpYmVkIHRvLCBzZW5kcyBhIG1lc3NhZ2UsXG4gICAqIGRlZmluZWQgYnkgdGhlIGBzdWJNc2dgIGZ1bmN0aW9uLCB0byB0aGUgc2VydmVyIG92ZXIgdGhlIHNvY2tldCB0byBiZWdpbiBhXG4gICAqIHN1YnNjcmlwdGlvbiB0byBkYXRhIG92ZXIgdGhhdCBzb2NrZXQuIE9uY2UgZGF0YSBhcnJpdmVzLCB0aGVcbiAgICogYG1lc3NhZ2VGaWx0ZXJgIGFyZ3VtZW50IHdpbGwgYmUgdXNlZCB0byBzZWxlY3QgdGhlIGFwcHJvcHJpYXRlIGRhdGEgZm9yXG4gICAqIHRoZSByZXN1bHRpbmcgT2JzZXJ2YWJsZS4gV2hlbiB0ZWFyZG93biBvY2N1cnMsIGVpdGhlciBkdWUgdG9cbiAgICogdW5zdWJzY3JpcHRpb24sIGNvbXBsZXRpb24gb3IgZXJyb3IsIGEgbWVzc2FnZSBkZWZpbmVkIGJ5IHRoZSBgdW5zdWJNc2dgXG4gICAqIGFyZ3VtZW50IHdpbGwgYmUgc2VuZCB0byB0aGUgc2VydmVyIG92ZXIgdGhlIFdlYlNvY2tldFN1YmplY3QuXG4gICAqXG4gICAqIEBwYXJhbSBzdWJNc2cgQSBmdW5jdGlvbiB0byBnZW5lcmF0ZSB0aGUgc3Vic2NyaXB0aW9uIG1lc3NhZ2UgdG8gYmUgc2VudCB0b1xuICAgKiB0aGUgc2VydmVyLiBUaGlzIHdpbGwgc3RpbGwgYmUgcHJvY2Vzc2VkIGJ5IHRoZSBzZXJpYWxpemVyIGluIHRoZVxuICAgKiBXZWJTb2NrZXRTdWJqZWN0J3MgY29uZmlnLiAoV2hpY2ggZGVmYXVsdHMgdG8gSlNPTiBzZXJpYWxpemF0aW9uKVxuICAgKiBAcGFyYW0gdW5zdWJNc2cgQSBmdW5jdGlvbiB0byBnZW5lcmF0ZSB0aGUgdW5zdWJzY3JpcHRpb24gbWVzc2FnZSB0byBiZVxuICAgKiBzZW50IHRvIHRoZSBzZXJ2ZXIgYXQgdGVhcmRvd24uIFRoaXMgd2lsbCBzdGlsbCBiZSBwcm9jZXNzZWQgYnkgdGhlXG4gICAqIHNlcmlhbGl6ZXIgaW4gdGhlIFdlYlNvY2tldFN1YmplY3QncyBjb25maWcuXG4gICAqIEBwYXJhbSBtZXNzYWdlRmlsdGVyIEEgcHJlZGljYXRlIGZvciBzZWxlY3RpbmcgdGhlIGFwcHJvcHJpYXRlIG1lc3NhZ2VzXG4gICAqIGZyb20gdGhlIHNlcnZlciBmb3IgdGhlIG91dHB1dCBzdHJlYW0uXG4gICAqL1xuICBtdWx0aXBsZXgoc3ViTXNnOiAoKSA9PiBhbnksIHVuc3ViTXNnOiAoKSA9PiBhbnksIG1lc3NhZ2VGaWx0ZXI6ICh2YWx1ZTogVCkgPT4gYm9vbGVhbikge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZSgob2JzZXJ2ZXI6IE9ic2VydmVyPGFueT4pID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRyeUNhdGNoKHN1Yk1zZykoKTtcbiAgICAgIGlmIChyZXN1bHQgPT09IGVycm9yT2JqZWN0KSB7XG4gICAgICAgIG9ic2VydmVyLmVycm9yKGVycm9yT2JqZWN0LmUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi5uZXh0KHJlc3VsdCk7XG4gICAgICB9XG5cbiAgICAgIGxldCBzdWJzY3JpcHRpb24gPSBzZWxmLnN1YnNjcmliZSh4ID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdHJ5Q2F0Y2gobWVzc2FnZUZpbHRlcikoeCk7XG4gICAgICAgIGlmIChyZXN1bHQgPT09IGVycm9yT2JqZWN0KSB7XG4gICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IoZXJyb3JPYmplY3QuZSk7XG4gICAgICAgIH0gZWxzZSBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgb2JzZXJ2ZXIubmV4dCh4KTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICAgZXJyID0+IG9ic2VydmVyLmVycm9yKGVyciksXG4gICAgICAgICgpID0+IG9ic2VydmVyLmNvbXBsZXRlKCkpO1xuXG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB0cnlDYXRjaCh1bnN1Yk1zZykoKTtcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZXJyb3JPYmplY3QpIHtcbiAgICAgICAgICBvYnNlcnZlci5lcnJvcihlcnJvck9iamVjdC5lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWxmLm5leHQocmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9jb25uZWN0U29ja2V0KCkge1xuICAgIGNvbnN0IHsgV2ViU29ja2V0Q3RvciwgcHJvdG9jb2wsIHVybCwgYmluYXJ5VHlwZSB9ID0gdGhpcy5fY29uZmlnO1xuICAgIGNvbnN0IG9ic2VydmVyID0gdGhpcy5fb3V0cHV0O1xuXG4gICAgbGV0IHNvY2tldDogV2ViU29ja2V0ID0gbnVsbDtcbiAgICB0cnkge1xuICAgICAgc29ja2V0ID0gcHJvdG9jb2wgP1xuICAgICAgICBuZXcgV2ViU29ja2V0Q3Rvcih1cmwsIHByb3RvY29sKSA6XG4gICAgICAgIG5ldyBXZWJTb2NrZXRDdG9yKHVybCk7XG4gICAgICB0aGlzLl9zb2NrZXQgPSBzb2NrZXQ7XG4gICAgICBpZiAoYmluYXJ5VHlwZSkge1xuICAgICAgICB0aGlzLl9zb2NrZXQuYmluYXJ5VHlwZSA9IGJpbmFyeVR5cGU7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgb2JzZXJ2ZXIuZXJyb3IoZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbigoKSA9PiB7XG4gICAgICB0aGlzLl9zb2NrZXQgPSBudWxsO1xuICAgICAgaWYgKHNvY2tldCAmJiBzb2NrZXQucmVhZHlTdGF0ZSA9PT0gMSkge1xuICAgICAgICBzb2NrZXQuY2xvc2UoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHNvY2tldC5vbm9wZW4gPSAoZTogRXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IHsgb3Blbk9ic2VydmVyIH0gPSB0aGlzLl9jb25maWc7XG4gICAgICBpZiAob3Blbk9ic2VydmVyKSB7XG4gICAgICAgIG9wZW5PYnNlcnZlci5uZXh0KGUpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBxdWV1ZSA9IHRoaXMuZGVzdGluYXRpb247XG5cbiAgICAgIHRoaXMuZGVzdGluYXRpb24gPSBTdWJzY3JpYmVyLmNyZWF0ZTxUPihcbiAgICAgICAgKHgpID0+IHtcbiAgICAgICAgICBpZiAoc29ja2V0LnJlYWR5U3RhdGUgPT09IDEpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgc2VyaWFsaXplciB9ID0gdGhpcy5fY29uZmlnO1xuICAgICAgICAgICAgY29uc3QgbXNnID0gdHJ5Q2F0Y2goc2VyaWFsaXplcikoeCk7XG4gICAgICAgICAgICBpZiAobXNnID09PSBlcnJvck9iamVjdCkge1xuICAgICAgICAgICAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycm9yT2JqZWN0LmUpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzb2NrZXQuc2VuZChtc2cpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgKGUpID0+IHtcbiAgICAgICAgICBjb25zdCB7IGNsb3NpbmdPYnNlcnZlciB9ID0gdGhpcy5fY29uZmlnO1xuICAgICAgICAgIGlmIChjbG9zaW5nT2JzZXJ2ZXIpIHtcbiAgICAgICAgICAgIGNsb3NpbmdPYnNlcnZlci5uZXh0KHVuZGVmaW5lZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChlICYmIGUuY29kZSkge1xuICAgICAgICAgICAgc29ja2V0LmNsb3NlKGUuY29kZSwgZS5yZWFzb24pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvYnNlcnZlci5lcnJvcihuZXcgVHlwZUVycm9yKFdFQlNPQ0tFVFNVQkpFQ1RfSU5WQUxJRF9FUlJPUl9PQkpFQ1QpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5fcmVzZXRTdGF0ZSgpO1xuICAgICAgICB9LFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgeyBjbG9zaW5nT2JzZXJ2ZXIgfSA9IHRoaXMuX2NvbmZpZztcbiAgICAgICAgICBpZiAoY2xvc2luZ09ic2VydmVyKSB7XG4gICAgICAgICAgICBjbG9zaW5nT2JzZXJ2ZXIubmV4dCh1bmRlZmluZWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzb2NrZXQuY2xvc2UoKTtcbiAgICAgICAgICB0aGlzLl9yZXNldFN0YXRlKCk7XG4gICAgICAgIH1cbiAgICAgICkgYXMgU3Vic2NyaWJlcjxhbnk+O1xuXG4gICAgICBpZiAocXVldWUgJiYgcXVldWUgaW5zdGFuY2VvZiBSZXBsYXlTdWJqZWN0KSB7XG4gICAgICAgIHN1YnNjcmlwdGlvbi5hZGQoKDxSZXBsYXlTdWJqZWN0PFQ+PnF1ZXVlKS5zdWJzY3JpYmUodGhpcy5kZXN0aW5hdGlvbikpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBzb2NrZXQub25lcnJvciA9IChlOiBFdmVudCkgPT4ge1xuICAgICAgdGhpcy5fcmVzZXRTdGF0ZSgpO1xuICAgICAgb2JzZXJ2ZXIuZXJyb3IoZSk7XG4gICAgfTtcblxuICAgIHNvY2tldC5vbmNsb3NlID0gKGU6IENsb3NlRXZlbnQpID0+IHtcbiAgICAgIHRoaXMuX3Jlc2V0U3RhdGUoKTtcbiAgICAgIGNvbnN0IHsgY2xvc2VPYnNlcnZlciB9ID0gdGhpcy5fY29uZmlnO1xuICAgICAgaWYgKGNsb3NlT2JzZXJ2ZXIpIHtcbiAgICAgICAgY2xvc2VPYnNlcnZlci5uZXh0KGUpO1xuICAgICAgfVxuICAgICAgaWYgKGUud2FzQ2xlYW4pIHtcbiAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9ic2VydmVyLmVycm9yKGUpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBzb2NrZXQub25tZXNzYWdlID0gKGU6IE1lc3NhZ2VFdmVudCkgPT4ge1xuICAgICAgY29uc3QgeyBkZXNlcmlhbGl6ZXIgfSA9IHRoaXMuX2NvbmZpZztcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRyeUNhdGNoKGRlc2VyaWFsaXplcikoZSk7XG4gICAgICBpZiAocmVzdWx0ID09PSBlcnJvck9iamVjdCkge1xuICAgICAgICBvYnNlcnZlci5lcnJvcihlcnJvck9iamVjdC5lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9ic2VydmVyLm5leHQocmVzdWx0KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfc3Vic2NyaWJlKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pOiBTdWJzY3JpcHRpb24ge1xuICAgIGNvbnN0IHsgc291cmNlIH0gPSB0aGlzO1xuICAgIGlmIChzb3VyY2UpIHtcbiAgICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX3NvY2tldCkge1xuICAgICAgdGhpcy5fY29ubmVjdFNvY2tldCgpO1xuICAgIH1cbiAgICB0aGlzLl9vdXRwdXQuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgIHN1YnNjcmliZXIuYWRkKCgpID0+IHtcbiAgICAgIGNvbnN0IHsgX3NvY2tldCB9ID0gdGhpcztcbiAgICAgIGlmICh0aGlzLl9vdXRwdXQub2JzZXJ2ZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBpZiAoX3NvY2tldCAmJiBfc29ja2V0LnJlYWR5U3RhdGUgPT09IDEpIHtcbiAgICAgICAgICBfc29ja2V0LmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcmVzZXRTdGF0ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBzdWJzY3JpYmVyO1xuICB9XG5cbiAgdW5zdWJzY3JpYmUoKSB7XG4gICAgY29uc3QgeyBzb3VyY2UsIF9zb2NrZXQgfSA9IHRoaXM7XG4gICAgaWYgKF9zb2NrZXQgJiYgX3NvY2tldC5yZWFkeVN0YXRlID09PSAxKSB7XG4gICAgICBfc29ja2V0LmNsb3NlKCk7XG4gICAgICB0aGlzLl9yZXNldFN0YXRlKCk7XG4gICAgfVxuICAgIHN1cGVyLnVuc3Vic2NyaWJlKCk7XG4gICAgaWYgKCFzb3VyY2UpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24gPSBuZXcgUmVwbGF5U3ViamVjdCgpO1xuICAgIH1cbiAgfVxufVxuIl19