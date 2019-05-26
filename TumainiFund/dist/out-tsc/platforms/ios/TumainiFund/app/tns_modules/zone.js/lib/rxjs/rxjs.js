/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Observable, Subscriber, Subscription } from 'rxjs';
Zone.__load_patch('rxjs', (global, Zone, api) => {
    const symbol = Zone.__symbol__;
    const nextSource = 'rxjs.Subscriber.next';
    const errorSource = 'rxjs.Subscriber.error';
    const completeSource = 'rxjs.Subscriber.complete';
    const ObjectDefineProperties = Object.defineProperties;
    const patchObservable = function () {
        const ObservablePrototype = Observable.prototype;
        const _symbolSubscribe = symbol('_subscribe');
        const _subscribe = ObservablePrototype[_symbolSubscribe] = ObservablePrototype._subscribe;
        ObjectDefineProperties(Observable.prototype, {
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
                    else if (this.constructor === Observable) {
                        return _subscribe;
                    }
                    const proto = Object.getPrototypeOf(this);
                    return proto && proto._subscribe;
                },
                set: function (subscribe) {
                    this._zone = Zone.current;
                    this._zoneSubscribe = function () {
                        if (this._zone && this._zone !== Zone.current) {
                            const tearDown = this._zone.run(subscribe, this, arguments);
                            if (tearDown && typeof tearDown === 'function') {
                                const zone = this._zone;
                                return function () {
                                    if (zone !== Zone.current) {
                                        return zone.run(tearDown, this, arguments);
                                    }
                                    return tearDown.apply(this, arguments);
                                };
                            }
                            return tearDown;
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
                    const zone = this._zone;
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
    api.patchMethod(Observable.prototype, 'lift', (delegate) => (self, args) => {
        const observable = delegate.apply(self, args);
        if (observable.operator) {
            observable.operator._zone = Zone.current;
            api.patchMethod(observable.operator, 'call', (operatorDelegate) => (operatorSelf, operatorArgs) => {
                if (operatorSelf._zone && operatorSelf._zone !== Zone.current) {
                    return operatorSelf._zone.run(operatorDelegate, operatorSelf, operatorArgs);
                }
                return operatorDelegate.apply(operatorSelf, operatorArgs);
            });
        }
        return observable;
    });
    const patchSubscription = function () {
        ObjectDefineProperties(Subscription.prototype, {
            _zone: { value: null, writable: true, configurable: true },
            _zoneUnsubscribe: { value: null, writable: true, configurable: true },
            _unsubscribe: {
                get: function () {
                    if (this._zoneUnsubscribe) {
                        return this._zoneUnsubscribe;
                    }
                    const proto = Object.getPrototypeOf(this);
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
    const patchSubscriber = function () {
        const next = Subscriber.prototype.next;
        const error = Subscriber.prototype.error;
        const complete = Subscriber.prototype.complete;
        Object.defineProperty(Subscriber.prototype, 'destination', {
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
        Subscriber.prototype.next = function () {
            const currentZone = Zone.current;
            const subscriptionZone = this._zone;
            // for performance concern, check Zone.current
            // equal with this._zone(SubscriptionZone) or not
            if (subscriptionZone && subscriptionZone !== currentZone) {
                return subscriptionZone.run(next, this, arguments, nextSource);
            }
            else {
                return next.apply(this, arguments);
            }
        };
        Subscriber.prototype.error = function () {
            const currentZone = Zone.current;
            const subscriptionZone = this._zone;
            // for performance concern, check Zone.current
            // equal with this._zone(SubscriptionZone) or not
            if (subscriptionZone && subscriptionZone !== currentZone) {
                return subscriptionZone.run(error, this, arguments, errorSource);
            }
            else {
                return error.apply(this, arguments);
            }
        };
        Subscriber.prototype.complete = function () {
            const currentZone = Zone.current;
            const subscriptionZone = this._zone;
            // for performance concern, check Zone.current
            // equal with this._zone(SubscriptionZone) or not
            if (subscriptionZone && subscriptionZone !== currentZone) {
                return subscriptionZone.run(complete, this, arguments, completeSource);
            }
            else {
                return complete.call(this);
            }
        };
    };
    patchObservable();
    patchSubscription();
    patchSubscriber();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnhqcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3pvbmUuanMvbGliL3J4anMvcnhqcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFFekQsSUFBWSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxNQUFXLEVBQUUsSUFBYyxFQUFFLEdBQWlCLEVBQUUsRUFBRTtJQUNwRixNQUFNLE1BQU0sR0FBc0MsSUFBWSxDQUFDLFVBQVUsQ0FBQztJQUMxRSxNQUFNLFVBQVUsR0FBRyxzQkFBc0IsQ0FBQztJQUMxQyxNQUFNLFdBQVcsR0FBRyx1QkFBdUIsQ0FBQztJQUM1QyxNQUFNLGNBQWMsR0FBRywwQkFBMEIsQ0FBQztJQUVsRCxNQUFNLHNCQUFzQixHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztJQUV2RCxNQUFNLGVBQWUsR0FBRztRQUN0QixNQUFNLG1CQUFtQixHQUFRLFVBQVUsQ0FBQyxTQUFTLENBQUM7UUFDdEQsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDOUMsTUFBTSxVQUFVLEdBQUcsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxtQkFBbUIsQ0FBQyxVQUFVLENBQUM7UUFFMUYsc0JBQXNCLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRTtZQUMzQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBQztZQUN4RCxXQUFXLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFB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OENBQThDO1lBQzlDLGlEQUFpRDtZQUNqRCxJQUFJLGdCQUFnQixJQUFJLGdCQUFnQixLQUFLLFdBQVcsRUFBRTtnQkFDeEQsT0FBTyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsY0FBYyxDQUFDLENBQUM7YUFDeEU7aUJBQU07Z0JBQ0wsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzVCO1FBQ0gsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxDQUFDO0lBRUYsZUFBZSxFQUFFLENBQUM7SUFDbEIsaUJBQWlCLEVBQUUsQ0FBQztJQUNwQixlQUFlLEVBQUUsQ0FBQztBQUNwQixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtPYnNlcnZhYmxlLCBTdWJzY3JpYmVyLCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuXG4oWm9uZSBhcyBhbnkpLl9fbG9hZF9wYXRjaCgncnhqcycsIChnbG9iYWw6IGFueSwgWm9uZTogWm9uZVR5cGUsIGFwaTogX1pvbmVQcml2YXRlKSA9PiB7XG4gIGNvbnN0IHN5bWJvbDogKHN5bWJvbFN0cmluZzogc3RyaW5nKSA9PiBzdHJpbmcgPSAoWm9uZSBhcyBhbnkpLl9fc3ltYm9sX187XG4gIGNvbnN0IG5leHRTb3VyY2UgPSAncnhqcy5TdWJzY3JpYmVyLm5leHQnO1xuICBjb25zdCBlcnJvclNvdXJjZSA9ICdyeGpzLlN1YnNjcmliZXIuZXJyb3InO1xuICBjb25zdCBjb21wbGV0ZVNvdXJjZSA9ICdyeGpzLlN1YnNjcmliZXIuY29tcGxldGUnO1xuXG4gIGNvbnN0IE9iamVjdERlZmluZVByb3BlcnRpZXMgPSBPYmplY3QuZGVmaW5lUHJvcGVydGllcztcblxuICBjb25zdCBwYXRjaE9ic2VydmFibGUgPSBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBPYnNlcnZhYmxlUHJvdG90eXBlOiBhbnkgPSBPYnNlcnZhYmxlLnByb3RvdHlwZTtcbiAgICBjb25zdCBfc3ltYm9sU3Vic2NyaWJlID0gc3ltYm9sKCdfc3Vic2NyaWJlJyk7XG4gICAgY29uc3QgX3N1YnNjcmliZSA9IE9ic2VydmFibGVQcm90b3R5cGVbX3N5bWJvbFN1YnNjcmliZV0gPSBPYnNlcnZhYmxlUHJvdG90eXBlLl9zdWJzY3JpYmU7XG5cbiAgICBPYmplY3REZWZpbmVQcm9wZXJ0aWVzKE9ic2VydmFibGUucHJvdG90eXBlLCB7XG4gICAgICBfem9uZToge3ZhbHVlOiBudWxsLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlfSxcbiAgICAgIF96b25lU291cmNlOiB7dmFsdWU6IG51bGwsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWV9LFxuICAgICAgX3pvbmVTdWJzY3JpYmU6IHt2YWx1ZTogbnVsbCwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZX0sXG4gICAgICBzb3VyY2U6IHtcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uKHRoaXM6IE9ic2VydmFibGU8YW55Pikge1xuICAgICAgICAgIHJldHVybiAodGhpcyBhcyBhbnkpLl96b25lU291cmNlO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHRoaXM6IE9ic2VydmFibGU8YW55Piwgc291cmNlOiBhbnkpIHtcbiAgICAgICAgICAodGhpcyBhcyBhbnkpLl96b25lID0gWm9uZS5jdXJyZW50O1xuICAgICAgICAgICh0aGlzIGFzIGFueSkuX3pvbmVTb3VyY2UgPSBzb3VyY2U7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBfc3Vic2NyaWJlOiB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbih0aGlzOiBPYnNlcnZhYmxlPGFueT4pIHtcbiAgICAgICAgICBpZiAoKHRoaXMgYXMgYW55KS5fem9uZVN1YnNjcmliZSkge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzIGFzIGFueSkuX3pvbmVTdWJzY3JpYmU7XG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbnN0cnVjdG9yID09PSBPYnNlcnZhYmxlKSB7XG4gICAgICAgICAgICByZXR1cm4gX3N1YnNjcmliZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcyk7XG4gICAgICAgICAgcmV0dXJuIHByb3RvICYmIHByb3RvLl9zdWJzY3JpYmU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odGhpczogT2JzZXJ2YWJsZTxhbnk+LCBzdWJzY3JpYmU6IGFueSkge1xuICAgICAgICAgICh0aGlzIGFzIGFueSkuX3pvbmUgPSBab25lLmN1cnJlbnQ7XG4gICAgICAgICAgKHRoaXMgYXMgYW55KS5fem9uZVN1YnNjcmliZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3pvbmUgJiYgdGhpcy5fem9uZSAhPT0gWm9uZS5jdXJyZW50KSB7XG4gICAgICAgICAgICAgIGNvbnN0IHRlYXJEb3duID0gdGhpcy5fem9uZS5ydW4oc3Vic2NyaWJlLCB0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICBpZiAodGVhckRvd24gJiYgdHlwZW9mIHRlYXJEb3duID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgem9uZSA9IHRoaXMuX3pvbmU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgaWYgKHpvbmUgIT09IFpvbmUuY3VycmVudCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gem9uZS5ydW4odGVhckRvd24sIHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGVhckRvd24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiB0ZWFyRG93bjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdWJzY3JpYmUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgc3ViamVjdEZhY3Rvcnk6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gKHRoaXMgYXMgYW55KS5fem9uZVN1YmplY3RGYWN0b3J5O1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKGZhY3Rvcnk6IGFueSkge1xuICAgICAgICAgIGNvbnN0IHpvbmUgPSB0aGlzLl96b25lO1xuICAgICAgICAgIHRoaXMuX3pvbmVTdWJqZWN0RmFjdG9yeSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHpvbmUgJiYgem9uZSAhPT0gWm9uZS5jdXJyZW50KSB7XG4gICAgICAgICAgICAgIHJldHVybiB6b25lLnJ1bihmYWN0b3J5LCB0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhY3RvcnkuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgYXBpLnBhdGNoTWV0aG9kKE9ic2VydmFibGUucHJvdG90eXBlLCAnbGlmdCcsIChkZWxlZ2F0ZTogYW55KSA9PiAoc2VsZjogYW55LCBhcmdzOiBhbnlbXSkgPT4ge1xuICAgIGNvbnN0IG9ic2VydmFibGU6IGFueSA9IGRlbGVnYXRlLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgIGlmIChvYnNlcnZhYmxlLm9wZXJhdG9yKSB7XG4gICAgICBvYnNlcnZhYmxlLm9wZXJhdG9yLl96b25lID0gWm9uZS5jdXJyZW50O1xuICAgICAgYXBpLnBhdGNoTWV0aG9kKFxuICAgICAgICAgIG9ic2VydmFibGUub3BlcmF0b3IsICdjYWxsJyxcbiAgICAgICAgICAob3BlcmF0b3JEZWxlZ2F0ZTogYW55KSA9PiAob3BlcmF0b3JTZWxmOiBhbnksIG9wZXJhdG9yQXJnczogYW55W10pID0+IHtcbiAgICAgICAgICAgIGlmIChvcGVyYXRvclNlbGYuX3pvbmUgJiYgb3BlcmF0b3JTZWxmLl96b25lICE9PSBab25lLmN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG9wZXJhdG9yU2VsZi5fem9uZS5ydW4ob3BlcmF0b3JEZWxlZ2F0ZSwgb3BlcmF0b3JTZWxmLCBvcGVyYXRvckFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG9wZXJhdG9yRGVsZWdhdGUuYXBwbHkob3BlcmF0b3JTZWxmLCBvcGVyYXRvckFyZ3MpO1xuICAgICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gb2JzZXJ2YWJsZTtcbiAgfSk7XG5cbiAgY29uc3QgcGF0Y2hTdWJzY3JpcHRpb24gPSBmdW5jdGlvbigpIHtcbiAgICBPYmplY3REZWZpbmVQcm9wZXJ0aWVzKFN1YnNjcmlwdGlvbi5wcm90b3R5cGUsIHtcbiAgICAgIF96b25lOiB7dmFsdWU6IG51bGwsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWV9LFxuICAgICAgX3pvbmVVbnN1YnNjcmliZToge3ZhbHVlOiBudWxsLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlfSxcbiAgICAgIF91bnN1YnNjcmliZToge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKHRoaXM6IFN1YnNjcmlwdGlvbikge1xuICAgICAgICAgIGlmICgodGhpcyBhcyBhbnkpLl96b25lVW5zdWJzY3JpYmUpIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcyBhcyBhbnkpLl96b25lVW5zdWJzY3JpYmU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMpO1xuICAgICAgICAgIHJldHVybiBwcm90byAmJiBwcm90by5fdW5zdWJzY3JpYmU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odGhpczogU3Vic2NyaXB0aW9uLCB1bnN1YnNjcmliZTogYW55KSB7XG4gICAgICAgICAgKHRoaXMgYXMgYW55KS5fem9uZSA9IFpvbmUuY3VycmVudDtcbiAgICAgICAgICAodGhpcyBhcyBhbnkpLl96b25lVW5zdWJzY3JpYmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl96b25lICYmIHRoaXMuX3pvbmUgIT09IFpvbmUuY3VycmVudCkge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fem9uZS5ydW4odW5zdWJzY3JpYmUsIHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdW5zdWJzY3JpYmUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgcGF0Y2hTdWJzY3JpYmVyID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbmV4dCA9IFN1YnNjcmliZXIucHJvdG90eXBlLm5leHQ7XG4gICAgY29uc3QgZXJyb3IgPSBTdWJzY3JpYmVyLnByb3RvdHlwZS5lcnJvcjtcbiAgICBjb25zdCBjb21wbGV0ZSA9IFN1YnNjcmliZXIucHJvdG90eXBlLmNvbXBsZXRlO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN1YnNjcmliZXIucHJvdG90eXBlLCAnZGVzdGluYXRpb24nLCB7XG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICBnZXQ6IGZ1bmN0aW9uKHRoaXM6IFN1YnNjcmliZXI8YW55Pikge1xuICAgICAgICByZXR1cm4gKHRoaXMgYXMgYW55KS5fem9uZURlc3RpbmF0aW9uO1xuICAgICAgfSxcbiAgICAgIHNldDogZnVuY3Rpb24odGhpczogU3Vic2NyaWJlcjxhbnk+LCBkZXN0aW5hdGlvbjogYW55KSB7XG4gICAgICAgICh0aGlzIGFzIGFueSkuX3pvbmUgPSBab25lLmN1cnJlbnQ7XG4gICAgICAgICh0aGlzIGFzIGFueSkuX3pvbmVEZXN0aW5hdGlvbiA9IGRlc3RpbmF0aW9uO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gcGF0Y2ggU3Vic2NyaWJlci5uZXh0IHRvIG1ha2Ugc3VyZSBpdCBydW5cbiAgICAvLyBpbnRvIFN1YnNjcmlwdGlvblpvbmVcbiAgICBTdWJzY3JpYmVyLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBjdXJyZW50Wm9uZSA9IFpvbmUuY3VycmVudDtcbiAgICAgIGNvbnN0IHN1YnNjcmlwdGlvblpvbmUgPSB0aGlzLl96b25lO1xuXG4gICAgICAvLyBmb3IgcGVyZm9ybWFuY2UgY29uY2VybiwgY2hlY2sgWm9uZS5jdXJyZW50XG4gICAgICAvLyBlcXVhbCB3aXRoIHRoaXMuX3pvbmUoU3Vic2NyaXB0aW9uWm9uZSkgb3Igbm90XG4gICAgICBpZiAoc3Vic2NyaXB0aW9uWm9uZSAmJiBzdWJzY3JpcHRpb25ab25lICE9PSBjdXJyZW50Wm9uZSkge1xuICAgICAgICByZXR1cm4gc3Vic2NyaXB0aW9uWm9uZS5ydW4obmV4dCwgdGhpcywgYXJndW1lbnRzLCBuZXh0U291cmNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXh0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyBhcyBhbnkpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBTdWJzY3JpYmVyLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgY3VycmVudFpvbmUgPSBab25lLmN1cnJlbnQ7XG4gICAgICBjb25zdCBzdWJzY3JpcHRpb25ab25lID0gdGhpcy5fem9uZTtcblxuICAgICAgLy8gZm9yIHBlcmZvcm1hbmNlIGNvbmNlcm4sIGNoZWNrIFpvbmUuY3VycmVudFxuICAgICAgLy8gZXF1YWwgd2l0aCB0aGlzLl96b25lKFN1YnNjcmlwdGlvblpvbmUpIG9yIG5vdFxuICAgICAgaWYgKHN1YnNjcmlwdGlvblpvbmUgJiYgc3Vic2NyaXB0aW9uWm9uZSAhPT0gY3VycmVudFpvbmUpIHtcbiAgICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvblpvbmUucnVuKGVycm9yLCB0aGlzLCBhcmd1bWVudHMsIGVycm9yU291cmNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBlcnJvci5hcHBseSh0aGlzLCBhcmd1bWVudHMgYXMgYW55KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgU3Vic2NyaWJlci5wcm90b3R5cGUuY29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRab25lID0gWm9uZS5jdXJyZW50O1xuICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uWm9uZSA9IHRoaXMuX3pvbmU7XG5cbiAgICAgIC8vIGZvciBwZXJmb3JtYW5jZSBjb25jZXJuLCBjaGVjayBab25lLmN1cnJlbnRcbiAgICAgIC8vIGVxdWFsIHdpdGggdGhpcy5fem9uZShTdWJzY3JpcHRpb25ab25lKSBvciBub3RcbiAgICAgIGlmIChzdWJzY3JpcHRpb25ab25lICYmIHN1YnNjcmlwdGlvblpvbmUgIT09IGN1cnJlbnRab25lKSB7XG4gICAgICAgIHJldHVybiBzdWJzY3JpcHRpb25ab25lLnJ1bihjb21wbGV0ZSwgdGhpcywgYXJndW1lbnRzLCBjb21wbGV0ZVNvdXJjZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY29tcGxldGUuY2FsbCh0aGlzKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIHBhdGNoT2JzZXJ2YWJsZSgpO1xuICBwYXRjaFN1YnNjcmlwdGlvbigpO1xuICBwYXRjaFN1YnNjcmliZXIoKTtcbn0pO1xuIl19