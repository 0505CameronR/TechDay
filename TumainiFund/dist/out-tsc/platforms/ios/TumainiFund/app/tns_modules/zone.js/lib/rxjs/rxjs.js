"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
Zone.__load_patch('rxjs', function (global, Zone, api) {
    var symbol = Zone.__symbol__;
    var nextSource = 'rxjs.Subscriber.next';
    var errorSource = 'rxjs.Subscriber.error';
    var completeSource = 'rxjs.Subscriber.complete';
    var ObjectDefineProperties = Object.defineProperties;
    var patchObservable = function () {
        var ObservablePrototype = rxjs_1.Observable.prototype;
        var _symbolSubscribe = symbol('_subscribe');
        var _subscribe = ObservablePrototype[_symbolSubscribe] = ObservablePrototype._subscribe;
        ObjectDefineProperties(rxjs_1.Observable.prototype, {
            _zone: { value: null, writable: true, configurable: true },
            _zoneSource: { value: null, writable: true, configurable: true },
            _zoneSubscribe: { value: null, writable: true, configurable: true },
            source: {
                configurable: true,
                get: function () {
                    return this._zoneSource;
                },
                set: function (source) {
                    this._zone = Zone.current;
                    this._zoneSource = source;
                }
            },
            _subscribe: {
                configurable: true,
                get: function () {
                    if (this._zoneSubscribe) {
                        return this._zoneSubscribe;
                    }
                    else if (this.constructor === rxjs_1.Observable) {
                        return _subscribe;
                    }
                    var proto = Object.getPrototypeOf(this);
                    return proto && proto._subscribe;
                },
                set: function (subscribe) {
                    this._zone = Zone.current;
                    this._zoneSubscribe = function () {
                        if (this._zone && this._zone !== Zone.current) {
                            var tearDown_1 = this._zone.run(subscribe, this, arguments);
                            if (tearDown_1 && typeof tearDown_1 === 'function') {
                                var zone_1 = this._zone;
                                return function () {
                                    if (zone_1 !== Zone.current) {
                                        return zone_1.run(tearDown_1, this, arguments);
                                    }
                                    return tearDown_1.apply(this, arguments);
                                };
                            }
                            return tearDown_1;
                        }
                        return subscribe.apply(this, arguments);
                    };
                }
            },
            subjectFactory: {
                get: function () {
                    return this._zoneSubjectFactory;
                },
                set: function (factory) {
                    var zone = this._zone;
                    this._zoneSubjectFactory = function () {
                        if (zone && zone !== Zone.current) {
                            return zone.run(factory, this, arguments);
                        }
                        return factory.apply(this, arguments);
                    };
                }
            }
        });
    };
    api.patchMethod(rxjs_1.Observable.prototype, 'lift', function (delegate) { return function (self, args) {
        var observable = delegate.apply(self, args);
        if (observable.operator) {
            observable.operator._zone = Zone.current;
            api.patchMethod(observable.operator, 'call', function (operatorDelegate) { return function (operatorSelf, operatorArgs) {
                if (operatorSelf._zone && operatorSelf._zone !== Zone.current) {
                    return operatorSelf._zone.run(operatorDelegate, operatorSelf, operatorArgs);
                }
                return operatorDelegate.apply(operatorSelf, operatorArgs);
            }; });
        }
        return observable;
    }; });
    var patchSubscription = function () {
        ObjectDefineProperties(rxjs_1.Subscription.prototype, {
            _zone: { value: null, writable: true, configurable: true },
            _zoneUnsubscribe: { value: null, writable: true, configurable: true },
            _unsubscribe: {
                get: function () {
                    if (this._zoneUnsubscribe) {
                        return this._zoneUnsubscribe;
                    }
                    var proto = Object.getPrototypeOf(this);
                    return proto && proto._unsubscribe;
                },
                set: function (unsubscribe) {
                    this._zone = Zone.current;
                    this._zoneUnsubscribe = function () {
                        if (this._zone && this._zone !== Zone.current) {
                            return this._zone.run(unsubscribe, this, arguments);
                        }
                        return unsubscribe.apply(this, arguments);
                    };
                }
            }
        });
    };
    var patchSubscriber = function () {
        var next = rxjs_1.Subscriber.prototype.next;
        var error = rxjs_1.Subscriber.prototype.error;
        var complete = rxjs_1.Subscriber.prototype.complete;
        Object.defineProperty(rxjs_1.Subscriber.prototype, 'destination', {
            configurable: true,
            get: function () {
                return this._zoneDestination;
            },
            set: function (destination) {
                this._zone = Zone.current;
                this._zoneDestination = destination;
            }
        });
        // patch Subscriber.next to make sure it run
        // into SubscriptionZone
        rxjs_1.Subscriber.prototype.next = function () {
            var currentZone = Zone.current;
            var subscriptionZone = this._zone;
            // for performance concern, check Zone.current
            // equal with this._zone(SubscriptionZone) or not
            if (subscriptionZone && subscriptionZone !== currentZone) {
                return subscriptionZone.run(next, this, arguments, nextSource);
            }
            else {
                return next.apply(this, arguments);
            }
        };
        rxjs_1.Subscriber.prototype.error = function () {
            var currentZone = Zone.current;
            var subscriptionZone = this._zone;
            // for performance concern, check Zone.current
            // equal with this._zone(SubscriptionZone) or not
            if (subscriptionZone && subscriptionZone !== currentZone) {
                return subscriptionZone.run(error, this, arguments, errorSource);
            }
            else {
                return error.apply(this, arguments);
            }
        };
        rxjs_1.Subscriber.prototype.complete = function () {
            var currentZone = Zone.current;
            var subscriptionZone = this._zone;
            // for performance concern, check Zone.current
            // equal with this._zone(SubscriptionZone) or not
            if (subscriptionZone && subscriptionZone !== currentZone) {
                return subscriptionZone.run(complete, this, arguments, completeSource);
            }
            else {
                return complete.apply(this, arguments);
            }
        };
    };
    patchObservable();
    patchSubscription();
    patchSubscriber();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnhqcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3pvbmUuanMvbGliL3J4anMvcnhqcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDZCQUEwRDtBQUV6RCxJQUFZLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxVQUFDLE1BQVcsRUFBRSxJQUFjLEVBQUUsR0FBaUI7SUFDaEYsSUFBTSxNQUFNLEdBQXNDLElBQVksQ0FBQyxVQUFVLENBQUM7SUFDMUUsSUFBTSxVQUFVLEdBQUcsc0JBQXNCLENBQUM7SUFDMUMsSUFBTSxXQUFXLEdBQUcsdUJBQXVCLENBQUM7SUFDNUMsSUFBTSxjQUFjLEdBQUcsMEJBQTBCLENBQUM7SUFFbEQsSUFBTSxzQkFBc0IsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7SUFFdkQsSUFBTSxlQUFlLEdBQUc7UUFDdEIsSUFBTSxtQkFBbUIsR0FBUSxpQkFBVSxDQUFDLFNBQVMsQ0FBQztRQUN0RCxJQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUM5QyxJQUFNLFVBQVUsR0FBRyxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLG1CQUFtQixDQUFDLFVBQVUsQ0FBQztRQUUxRixzQkFBc0IsQ0FBQyxpQkFBVSxDQUFDLFNBQVMsRUFBRTtZQUMzQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBQztZQUN4RCxXQUFXLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBQztZQUM5RCxjQUFjLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJ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QUssV0FBVyxFQUFFO2dCQUN4RCxPQUFPLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxjQUFjLENBQUMsQ0FBQzthQUN4RTtpQkFBTTtnQkFDTCxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO2FBQ3hDO1FBQ0gsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxDQUFDO0lBRUYsZUFBZSxFQUFFLENBQUM7SUFDbEIsaUJBQWlCLEVBQUUsQ0FBQztJQUNwQixlQUFlLEVBQUUsQ0FBQztBQUNwQixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtPYnNlcnZhYmxlLCBTdWJzY3JpYmVyLCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuXG4oWm9uZSBhcyBhbnkpLl9fbG9hZF9wYXRjaCgncnhqcycsIChnbG9iYWw6IGFueSwgWm9uZTogWm9uZVR5cGUsIGFwaTogX1pvbmVQcml2YXRlKSA9PiB7XG4gIGNvbnN0IHN5bWJvbDogKHN5bWJvbFN0cmluZzogc3RyaW5nKSA9PiBzdHJpbmcgPSAoWm9uZSBhcyBhbnkpLl9fc3ltYm9sX187XG4gIGNvbnN0IG5leHRTb3VyY2UgPSAncnhqcy5TdWJzY3JpYmVyLm5leHQnO1xuICBjb25zdCBlcnJvclNvdXJjZSA9ICdyeGpzLlN1YnNjcmliZXIuZXJyb3InO1xuICBjb25zdCBjb21wbGV0ZVNvdXJjZSA9ICdyeGpzLlN1YnNjcmliZXIuY29tcGxldGUnO1xuXG4gIGNvbnN0IE9iamVjdERlZmluZVByb3BlcnRpZXMgPSBPYmplY3QuZGVmaW5lUHJvcGVydGllcztcblxuICBjb25zdCBwYXRjaE9ic2VydmFibGUgPSBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBPYnNlcnZhYmxlUHJvdG90eXBlOiBhbnkgPSBPYnNlcnZhYmxlLnByb3RvdHlwZTtcbiAgICBjb25zdCBfc3ltYm9sU3Vic2NyaWJlID0gc3ltYm9sKCdfc3Vic2NyaWJlJyk7XG4gICAgY29uc3QgX3N1YnNjcmliZSA9IE9ic2VydmFibGVQcm90b3R5cGVbX3N5bWJvbFN1YnNjcmliZV0gPSBPYnNlcnZhYmxlUHJvdG90eXBlLl9zdWJzY3JpYmU7XG5cbiAgICBPYmplY3REZWZpbmVQcm9wZXJ0aWVzKE9ic2VydmFibGUucHJvdG90eXBlLCB7XG4gICAgICBfem9uZToge3ZhbHVlOiBudWxsLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlfSxcbiAgICAgIF96b25lU291cmNlOiB7dmFsdWU6IG51bGwsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWV9LFxuICAgICAgX3pvbmVTdWJzY3JpYmU6IHt2YWx1ZTogbnVsbCwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZX0sXG4gICAgICBzb3VyY2U6IHtcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uKHRoaXM6IE9ic2VydmFibGU8YW55Pikge1xuICAgICAgICAgIHJldHVybiAodGhpcyBhcyBhbnkpLl96b25lU291cmNlO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHRoaXM6IE9ic2VydmFibGU8YW55Piwgc291cmNlOiBhbnkpIHtcbiAgICAgICAgICAodGhpcyBhcyBhbnkpLl96b25lID0gWm9uZS5jdXJyZW50O1xuICAgICAgICAgICh0aGlzIGFzIGFueSkuX3pvbmVTb3VyY2UgPSBzb3VyY2U7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBfc3Vic2NyaWJlOiB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbih0aGlzOiBPYnNlcnZhYmxlPGFueT4pIHtcbiAgICAgICAgICBpZiAoKHRoaXMgYXMgYW55KS5fem9uZVN1YnNjcmliZSkge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzIGFzIGFueSkuX3pvbmVTdWJzY3JpYmU7XG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbnN0cnVjdG9yID09PSBPYnNlcnZhYmxlKSB7XG4gICAgICAgICAgICByZXR1cm4gX3N1YnNjcmliZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcyk7XG4gICAgICAgICAgcmV0dXJuIHByb3RvICYmIHByb3RvLl9zdWJzY3JpYmU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odGhpczogT2JzZXJ2YWJsZTxhbnk+LCBzdWJzY3JpYmU6IGFueSkge1xuICAgICAgICAgICh0aGlzIGFzIGFueSkuX3pvbmUgPSBab25lLmN1cnJlbnQ7XG4gICAgICAgICAgKHRoaXMgYXMgYW55KS5fem9uZVN1YnNjcmliZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3pvbmUgJiYgdGhpcy5fem9uZSAhPT0gWm9uZS5jdXJyZW50KSB7XG4gICAgICAgICAgICAgIGNvbnN0IHRlYXJEb3duID0gdGhpcy5fem9uZS5ydW4oc3Vic2NyaWJlLCB0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICBpZiAodGVhckRvd24gJiYgdHlwZW9mIHRlYXJEb3duID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgem9uZSA9IHRoaXMuX3pvbmU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgaWYgKHpvbmUgIT09IFpvbmUuY3VycmVudCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gem9uZS5ydW4odGVhckRvd24sIHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGVhckRvd24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiB0ZWFyRG93bjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdWJzY3JpYmUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgc3ViamVjdEZhY3Rvcnk6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gKHRoaXMgYXMgYW55KS5fem9uZVN1YmplY3RGYWN0b3J5O1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKGZhY3Rvcnk6IGFueSkge1xuICAgICAgICAgIGNvbnN0IHpvbmUgPSB0aGlzLl96b25lO1xuICAgICAgICAgIHRoaXMuX3pvbmVTdWJqZWN0RmFjdG9yeSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHpvbmUgJiYgem9uZSAhPT0gWm9uZS5jdXJyZW50KSB7XG4gICAgICAgICAgICAgIHJldHVybiB6b25lLnJ1bihmYWN0b3J5LCB0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhY3RvcnkuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgYXBpLnBhdGNoTWV0aG9kKE9ic2VydmFibGUucHJvdG90eXBlLCAnbGlmdCcsIChkZWxlZ2F0ZTogYW55KSA9PiAoc2VsZjogYW55LCBhcmdzOiBhbnlbXSkgPT4ge1xuICAgIGNvbnN0IG9ic2VydmFibGU6IGFueSA9IGRlbGVnYXRlLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgIGlmIChvYnNlcnZhYmxlLm9wZXJhdG9yKSB7XG4gICAgICBvYnNlcnZhYmxlLm9wZXJhdG9yLl96b25lID0gWm9uZS5jdXJyZW50O1xuICAgICAgYXBpLnBhdGNoTWV0aG9kKFxuICAgICAgICAgIG9ic2VydmFibGUub3BlcmF0b3IsICdjYWxsJyxcbiAgICAgICAgICAob3BlcmF0b3JEZWxlZ2F0ZTogYW55KSA9PiAob3BlcmF0b3JTZWxmOiBhbnksIG9wZXJhdG9yQXJnczogYW55W10pID0+IHtcbiAgICAgICAgICAgIGlmIChvcGVyYXRvclNlbGYuX3pvbmUgJiYgb3BlcmF0b3JTZWxmLl96b25lICE9PSBab25lLmN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG9wZXJhdG9yU2VsZi5fem9uZS5ydW4ob3BlcmF0b3JEZWxlZ2F0ZSwgb3BlcmF0b3JTZWxmLCBvcGVyYXRvckFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG9wZXJhdG9yRGVsZWdhdGUuYXBwbHkob3BlcmF0b3JTZWxmLCBvcGVyYXRvckFyZ3MpO1xuICAgICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gb2JzZXJ2YWJsZTtcbiAgfSk7XG5cbiAgY29uc3QgcGF0Y2hTdWJzY3JpcHRpb24gPSBmdW5jdGlvbigpIHtcbiAgICBPYmplY3REZWZpbmVQcm9wZXJ0aWVzKFN1YnNjcmlwdGlvbi5wcm90b3R5cGUsIHtcbiAgICAgIF96b25lOiB7dmFsdWU6IG51bGwsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWV9LFxuICAgICAgX3pvbmVVbnN1YnNjcmliZToge3ZhbHVlOiBudWxsLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlfSxcbiAgICAgIF91bnN1YnNjcmliZToge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKHRoaXM6IFN1YnNjcmlwdGlvbikge1xuICAgICAgICAgIGlmICgodGhpcyBhcyBhbnkpLl96b25lVW5zdWJzY3JpYmUpIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcyBhcyBhbnkpLl96b25lVW5zdWJzY3JpYmU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMpO1xuICAgICAgICAgIHJldHVybiBwcm90byAmJiBwcm90by5fdW5zdWJzY3JpYmU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odGhpczogU3Vic2NyaXB0aW9uLCB1bnN1YnNjcmliZTogYW55KSB7XG4gICAgICAgICAgKHRoaXMgYXMgYW55KS5fem9uZSA9IFpvbmUuY3VycmVudDtcbiAgICAgICAgICAodGhpcyBhcyBhbnkpLl96b25lVW5zdWJzY3JpYmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl96b25lICYmIHRoaXMuX3pvbmUgIT09IFpvbmUuY3VycmVudCkge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fem9uZS5ydW4odW5zdWJzY3JpYmUsIHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdW5zdWJzY3JpYmUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgcGF0Y2hTdWJzY3JpYmVyID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbmV4dCA9IFN1YnNjcmliZXIucHJvdG90eXBlLm5leHQ7XG4gICAgY29uc3QgZXJyb3IgPSBTdWJzY3JpYmVyLnByb3RvdHlwZS5lcnJvcjtcbiAgICBjb25zdCBjb21wbGV0ZSA9IFN1YnNjcmliZXIucHJvdG90eXBlLmNvbXBsZXRlO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN1YnNjcmliZXIucHJvdG90eXBlLCAnZGVzdGluYXRpb24nLCB7XG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICBnZXQ6IGZ1bmN0aW9uKHRoaXM6IFN1YnNjcmliZXI8YW55Pikge1xuICAgICAgICByZXR1cm4gKHRoaXMgYXMgYW55KS5fem9uZURlc3RpbmF0aW9uO1xuICAgICAgfSxcbiAgICAgIHNldDogZnVuY3Rpb24odGhpczogU3Vic2NyaWJlcjxhbnk+LCBkZXN0aW5hdGlvbjogYW55KSB7XG4gICAgICAgICh0aGlzIGFzIGFueSkuX3pvbmUgPSBab25lLmN1cnJlbnQ7XG4gICAgICAgICh0aGlzIGFzIGFueSkuX3pvbmVEZXN0aW5hdGlvbiA9IGRlc3RpbmF0aW9uO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gcGF0Y2ggU3Vic2NyaWJlci5uZXh0IHRvIG1ha2Ugc3VyZSBpdCBydW5cbiAgICAvLyBpbnRvIFN1YnNjcmlwdGlvblpvbmVcbiAgICBTdWJzY3JpYmVyLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBjdXJyZW50Wm9uZSA9IFpvbmUuY3VycmVudDtcbiAgICAgIGNvbnN0IHN1YnNjcmlwdGlvblpvbmUgPSB0aGlzLl96b25lO1xuXG4gICAgICAvLyBmb3IgcGVyZm9ybWFuY2UgY29uY2VybiwgY2hlY2sgWm9uZS5jdXJyZW50XG4gICAgICAvLyBlcXVhbCB3aXRoIHRoaXMuX3pvbmUoU3Vic2NyaXB0aW9uWm9uZSkgb3Igbm90XG4gICAgICBpZiAoc3Vic2NyaXB0aW9uWm9uZSAmJiBzdWJzY3JpcHRpb25ab25lICE9PSBjdXJyZW50Wm9uZSkge1xuICAgICAgICByZXR1cm4gc3Vic2NyaXB0aW9uWm9uZS5ydW4obmV4dCwgdGhpcywgYXJndW1lbnRzLCBuZXh0U291cmNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXh0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIFN1YnNjcmliZXIucHJvdG90eXBlLmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBjdXJyZW50Wm9uZSA9IFpvbmUuY3VycmVudDtcbiAgICAgIGNvbnN0IHN1YnNjcmlwdGlvblpvbmUgPSB0aGlzLl96b25lO1xuXG4gICAgICAvLyBmb3IgcGVyZm9ybWFuY2UgY29uY2VybiwgY2hlY2sgWm9uZS5jdXJyZW50XG4gICAgICAvLyBlcXVhbCB3aXRoIHRoaXMuX3pvbmUoU3Vic2NyaXB0aW9uWm9uZSkgb3Igbm90XG4gICAgICBpZiAoc3Vic2NyaXB0aW9uWm9uZSAmJiBzdWJzY3JpcHRpb25ab25lICE9PSBjdXJyZW50Wm9uZSkge1xuICAgICAgICByZXR1cm4gc3Vic2NyaXB0aW9uWm9uZS5ydW4oZXJyb3IsIHRoaXMsIGFyZ3VtZW50cywgZXJyb3JTb3VyY2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGVycm9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIFN1YnNjcmliZXIucHJvdG90eXBlLmNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBjdXJyZW50Wm9uZSA9IFpvbmUuY3VycmVudDtcbiAgICAgIGNvbnN0IHN1YnNjcmlwdGlvblpvbmUgPSB0aGlzLl96b25lO1xuXG4gICAgICAvLyBmb3IgcGVyZm9ybWFuY2UgY29uY2VybiwgY2hlY2sgWm9uZS5jdXJyZW50XG4gICAgICAvLyBlcXVhbCB3aXRoIHRoaXMuX3pvbmUoU3Vic2NyaXB0aW9uWm9uZSkgb3Igbm90XG4gICAgICBpZiAoc3Vic2NyaXB0aW9uWm9uZSAmJiBzdWJzY3JpcHRpb25ab25lICE9PSBjdXJyZW50Wm9uZSkge1xuICAgICAgICByZXR1cm4gc3Vic2NyaXB0aW9uWm9uZS5ydW4oY29tcGxldGUsIHRoaXMsIGFyZ3VtZW50cywgY29tcGxldGVTb3VyY2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGNvbXBsZXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICBwYXRjaE9ic2VydmFibGUoKTtcbiAgcGF0Y2hTdWJzY3JpcHRpb24oKTtcbiAgcGF0Y2hTdWJzY3JpYmVyKCk7XG59KTtcbiJdfQ==