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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnhqcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvcnhqcy9yeGpzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsNkJBQTBEO0FBRXpELElBQVksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFVBQUMsTUFBVyxFQUFFLElBQWMsRUFBRSxHQUFpQjtJQUNoRixJQUFNLE1BQU0sR0FBc0MsSUFBWSxDQUFDLFVBQVUsQ0FBQztJQUMxRSxJQUFNLFVBQVUsR0FBRyxzQkFBc0IsQ0FBQztJQUMxQyxJQUFNLFdBQVcsR0FBRyx1QkFBdUIsQ0FBQztJQUM1QyxJQUFNLGNBQWMsR0FBRywwQkFBMEIsQ0FBQztJQUVsRCxJQUFNLHNCQUFzQixHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztJQUV2RCxJQUFNLGVBQWUsR0FBRztRQUN0QixJQUFNLG1CQUFtQixHQUFRLGlCQUFVLENBQUMsU0FBUyxDQUFDO1FBQ3RELElBQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzlDLElBQU0sVUFBVSxHQUFHLG1CQUFtQixDQUFDLGdCQUFnQixDQUFDLEdBQUcsbUJBQW1CLENBQUMsVUFBVSxDQUFDO1FBRTFGLHNCQUFzQixDQUFDLGlCQUFVLENBQUMsU0FBUyxFQUFFO1lBQzNDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFDO1lBQ3hELFdBQVcsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUks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QUFJLENBQUMsS0FBSyxDQUFDO1lBRXBDLDhDQUE4QztZQUM5QyxpREFBaUQ7WUFDakQsSUFBSSxnQkFBZ0IsSUFBSSxnQkFBZ0IsS0FBSyxXQUFXLEVBQUU7Z0JBQ3hELE9BQU8sZ0JBQWdCLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDO2FBQ3hFO2lCQUFNO2dCQUNMLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7YUFDeEM7UUFDSCxDQUFDLENBQUM7SUFDSixDQUFDLENBQUM7SUFFRixlQUFlLEVBQUUsQ0FBQztJQUNsQixpQkFBaUIsRUFBRSxDQUFDO0lBQ3BCLGVBQWUsRUFBRSxDQUFDO0FBQ3BCLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge09ic2VydmFibGUsIFN1YnNjcmliZXIsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5cbihab25lIGFzIGFueSkuX19sb2FkX3BhdGNoKCdyeGpzJywgKGdsb2JhbDogYW55LCBab25lOiBab25lVHlwZSwgYXBpOiBfWm9uZVByaXZhdGUpID0+IHtcbiAgY29uc3Qgc3ltYm9sOiAoc3ltYm9sU3RyaW5nOiBzdHJpbmcpID0+IHN0cmluZyA9IChab25lIGFzIGFueSkuX19zeW1ib2xfXztcbiAgY29uc3QgbmV4dFNvdXJjZSA9ICdyeGpzLlN1YnNjcmliZXIubmV4dCc7XG4gIGNvbnN0IGVycm9yU291cmNlID0gJ3J4anMuU3Vic2NyaWJlci5lcnJvcic7XG4gIGNvbnN0IGNvbXBsZXRlU291cmNlID0gJ3J4anMuU3Vic2NyaWJlci5jb21wbGV0ZSc7XG5cbiAgY29uc3QgT2JqZWN0RGVmaW5lUHJvcGVydGllcyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzO1xuXG4gIGNvbnN0IHBhdGNoT2JzZXJ2YWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IE9ic2VydmFibGVQcm90b3R5cGU6IGFueSA9IE9ic2VydmFibGUucHJvdG90eXBlO1xuICAgIGNvbnN0IF9zeW1ib2xTdWJzY3JpYmUgPSBzeW1ib2woJ19zdWJzY3JpYmUnKTtcbiAgICBjb25zdCBfc3Vic2NyaWJlID0gT2JzZXJ2YWJsZVByb3RvdHlwZVtfc3ltYm9sU3Vic2NyaWJlXSA9IE9ic2VydmFibGVQcm90b3R5cGUuX3N1YnNjcmliZTtcblxuICAgIE9iamVjdERlZmluZVByb3BlcnRpZXMoT2JzZXJ2YWJsZS5wcm90b3R5cGUsIHtcbiAgICAgIF96b25lOiB7dmFsdWU6IG51bGwsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWV9LFxuICAgICAgX3pvbmVTb3VyY2U6IHt2YWx1ZTogbnVsbCwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZX0sXG4gICAgICBfem9uZVN1YnNjcmliZToge3ZhbHVlOiBudWxsLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlfSxcbiAgICAgIHNvdXJjZToge1xuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGdldDogZnVuY3Rpb24odGhpczogT2JzZXJ2YWJsZTxhbnk+KSB7XG4gICAgICAgICAgcmV0dXJuICh0aGlzIGFzIGFueSkuX3pvbmVTb3VyY2U7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odGhpczogT2JzZXJ2YWJsZTxhbnk+LCBzb3VyY2U6IGFueSkge1xuICAgICAgICAgICh0aGlzIGFzIGFueSkuX3pvbmUgPSBab25lLmN1cnJlbnQ7XG4gICAgICAgICAgKHRoaXMgYXMgYW55KS5fem9uZVNvdXJjZSA9IHNvdXJjZTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIF9zdWJzY3JpYmU6IHtcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uKHRoaXM6IE9ic2VydmFibGU8YW55Pikge1xuICAgICAgICAgIGlmICgodGhpcyBhcyBhbnkpLl96b25lU3Vic2NyaWJlKSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMgYXMgYW55KS5fem9uZVN1YnNjcmliZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY29uc3RydWN0b3IgPT09IE9ic2VydmFibGUpIHtcbiAgICAgICAgICAgIHJldHVybiBfc3Vic2NyaWJlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKTtcbiAgICAgICAgICByZXR1cm4gcHJvdG8gJiYgcHJvdG8uX3N1YnNjcmliZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih0aGlzOiBPYnNlcnZhYmxlPGFueT4sIHN1YnNjcmliZTogYW55KSB7XG4gICAgICAgICAgKHRoaXMgYXMgYW55KS5fem9uZSA9IFpvbmUuY3VycmVudDtcbiAgICAgICAgICAodGhpcyBhcyBhbnkpLl96b25lU3Vic2NyaWJlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fem9uZSAmJiB0aGlzLl96b25lICE9PSBab25lLmN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgY29uc3QgdGVhckRvd24gPSB0aGlzLl96b25lLnJ1bihzdWJzY3JpYmUsIHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgIGlmICh0ZWFyRG93biAmJiB0eXBlb2YgdGVhckRvd24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB6b25lID0gdGhpcy5fem9uZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICBpZiAoem9uZSAhPT0gWm9uZS5jdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB6b25lLnJ1bih0ZWFyRG93biwgdGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHJldHVybiB0ZWFyRG93bi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIHRlYXJEb3duO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN1YnNjcmliZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBzdWJqZWN0RmFjdG9yeToge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiAodGhpcyBhcyBhbnkpLl96b25lU3ViamVjdEZhY3Rvcnk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24oZmFjdG9yeTogYW55KSB7XG4gICAgICAgICAgY29uc3Qgem9uZSA9IHRoaXMuX3pvbmU7XG4gICAgICAgICAgdGhpcy5fem9uZVN1YmplY3RGYWN0b3J5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoem9uZSAmJiB6b25lICE9PSBab25lLmN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHpvbmUucnVuKGZhY3RvcnksIHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFjdG9yeS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBhcGkucGF0Y2hNZXRob2QoT2JzZXJ2YWJsZS5wcm90b3R5cGUsICdsaWZ0JywgKGRlbGVnYXRlOiBhbnkpID0+IChzZWxmOiBhbnksIGFyZ3M6IGFueVtdKSA9PiB7XG4gICAgY29uc3Qgb2JzZXJ2YWJsZTogYW55ID0gZGVsZWdhdGUuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgaWYgKG9ic2VydmFibGUub3BlcmF0b3IpIHtcbiAgICAgIG9ic2VydmFibGUub3BlcmF0b3IuX3pvbmUgPSBab25lLmN1cnJlbnQ7XG4gICAgICBhcGkucGF0Y2hNZXRob2QoXG4gICAgICAgICAgb2JzZXJ2YWJsZS5vcGVyYXRvciwgJ2NhbGwnLFxuICAgICAgICAgIChvcGVyYXRvckRlbGVnYXRlOiBhbnkpID0+IChvcGVyYXRvclNlbGY6IGFueSwgb3BlcmF0b3JBcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICAgICAgaWYgKG9wZXJhdG9yU2VsZi5fem9uZSAmJiBvcGVyYXRvclNlbGYuX3pvbmUgIT09IFpvbmUuY3VycmVudCkge1xuICAgICAgICAgICAgICByZXR1cm4gb3BlcmF0b3JTZWxmLl96b25lLnJ1bihvcGVyYXRvckRlbGVnYXRlLCBvcGVyYXRvclNlbGYsIG9wZXJhdG9yQXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb3BlcmF0b3JEZWxlZ2F0ZS5hcHBseShvcGVyYXRvclNlbGYsIG9wZXJhdG9yQXJncyk7XG4gICAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBvYnNlcnZhYmxlO1xuICB9KTtcblxuICBjb25zdCBwYXRjaFN1YnNjcmlwdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIE9iamVjdERlZmluZVByb3BlcnRpZXMoU3Vic2NyaXB0aW9uLnByb3RvdHlwZSwge1xuICAgICAgX3pvbmU6IHt2YWx1ZTogbnVsbCwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZX0sXG4gICAgICBfem9uZVVuc3Vic2NyaWJlOiB7dmFsdWU6IG51bGwsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWV9LFxuICAgICAgX3Vuc3Vic2NyaWJlOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24odGhpczogU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgaWYgKCh0aGlzIGFzIGFueSkuX3pvbmVVbnN1YnNjcmliZSkge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzIGFzIGFueSkuX3pvbmVVbnN1YnNjcmliZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcyk7XG4gICAgICAgICAgcmV0dXJuIHByb3RvICYmIHByb3RvLl91bnN1YnNjcmliZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih0aGlzOiBTdWJzY3JpcHRpb24sIHVuc3Vic2NyaWJlOiBhbnkpIHtcbiAgICAgICAgICAodGhpcyBhcyBhbnkpLl96b25lID0gWm9uZS5jdXJyZW50O1xuICAgICAgICAgICh0aGlzIGFzIGFueSkuX3pvbmVVbnN1YnNjcmliZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3pvbmUgJiYgdGhpcy5fem9uZSAhPT0gWm9uZS5jdXJyZW50KSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLl96b25lLnJ1bih1bnN1YnNjcmliZSwgdGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB1bnN1YnNjcmliZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBwYXRjaFN1YnNjcmliZXIgPSBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBuZXh0ID0gU3Vic2NyaWJlci5wcm90b3R5cGUubmV4dDtcbiAgICBjb25zdCBlcnJvciA9IFN1YnNjcmliZXIucHJvdG90eXBlLmVycm9yO1xuICAgIGNvbnN0IGNvbXBsZXRlID0gU3Vic2NyaWJlci5wcm90b3R5cGUuY29tcGxldGU7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3Vic2NyaWJlci5wcm90b3R5cGUsICdkZXN0aW5hdGlvbicsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogZnVuY3Rpb24odGhpczogU3Vic2NyaWJlcjxhbnk+KSB7XG4gICAgICAgIHJldHVybiAodGhpcyBhcyBhbnkpLl96b25lRGVzdGluYXRpb247XG4gICAgICB9LFxuICAgICAgc2V0OiBmdW5jdGlvbih0aGlzOiBTdWJzY3JpYmVyPGFueT4sIGRlc3RpbmF0aW9uOiBhbnkpIHtcbiAgICAgICAgKHRoaXMgYXMgYW55KS5fem9uZSA9IFpvbmUuY3VycmVudDtcbiAgICAgICAgKHRoaXMgYXMgYW55KS5fem9uZURlc3RpbmF0aW9uID0gZGVzdGluYXRpb247XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBwYXRjaCBTdWJzY3JpYmVyLm5leHQgdG8gbWFrZSBzdXJlIGl0IHJ1blxuICAgIC8vIGludG8gU3Vic2NyaXB0aW9uWm9uZVxuICAgIFN1YnNjcmliZXIucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRab25lID0gWm9uZS5jdXJyZW50O1xuICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uWm9uZSA9IHRoaXMuX3pvbmU7XG5cbiAgICAgIC8vIGZvciBwZXJmb3JtYW5jZSBjb25jZXJuLCBjaGVjayBab25lLmN1cnJlbnRcbiAgICAgIC8vIGVxdWFsIHdpdGggdGhpcy5fem9uZShTdWJzY3JpcHRpb25ab25lKSBvciBub3RcbiAgICAgIGlmIChzdWJzY3JpcHRpb25ab25lICYmIHN1YnNjcmlwdGlvblpvbmUgIT09IGN1cnJlbnRab25lKSB7XG4gICAgICAgIHJldHVybiBzdWJzY3JpcHRpb25ab25lLnJ1bihuZXh0LCB0aGlzLCBhcmd1bWVudHMsIG5leHRTb3VyY2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5leHQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgU3Vic2NyaWJlci5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRab25lID0gWm9uZS5jdXJyZW50O1xuICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uWm9uZSA9IHRoaXMuX3pvbmU7XG5cbiAgICAgIC8vIGZvciBwZXJmb3JtYW5jZSBjb25jZXJuLCBjaGVjayBab25lLmN1cnJlbnRcbiAgICAgIC8vIGVxdWFsIHdpdGggdGhpcy5fem9uZShTdWJzY3JpcHRpb25ab25lKSBvciBub3RcbiAgICAgIGlmIChzdWJzY3JpcHRpb25ab25lICYmIHN1YnNjcmlwdGlvblpvbmUgIT09IGN1cnJlbnRab25lKSB7XG4gICAgICAgIHJldHVybiBzdWJzY3JpcHRpb25ab25lLnJ1bihlcnJvciwgdGhpcywgYXJndW1lbnRzLCBlcnJvclNvdXJjZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZXJyb3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgU3Vic2NyaWJlci5wcm90b3R5cGUuY29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRab25lID0gWm9uZS5jdXJyZW50O1xuICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uWm9uZSA9IHRoaXMuX3pvbmU7XG5cbiAgICAgIC8vIGZvciBwZXJmb3JtYW5jZSBjb25jZXJuLCBjaGVjayBab25lLmN1cnJlbnRcbiAgICAgIC8vIGVxdWFsIHdpdGggdGhpcy5fem9uZShTdWJzY3JpcHRpb25ab25lKSBvciBub3RcbiAgICAgIGlmIChzdWJzY3JpcHRpb25ab25lICYmIHN1YnNjcmlwdGlvblpvbmUgIT09IGN1cnJlbnRab25lKSB7XG4gICAgICAgIHJldHVybiBzdWJzY3JpcHRpb25ab25lLnJ1bihjb21wbGV0ZSwgdGhpcywgYXJndW1lbnRzLCBjb21wbGV0ZVNvdXJjZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY29tcGxldGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIHBhdGNoT2JzZXJ2YWJsZSgpO1xuICBwYXRjaFN1YnNjcmlwdGlvbigpO1xuICBwYXRjaFN1YnNjcmliZXIoKTtcbn0pO1xuIl19