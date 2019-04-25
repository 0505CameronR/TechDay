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
                return complete.apply(this, arguments);
            }
        };
    };
    patchObservable();
    patchSubscription();
    patchSubscriber();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnhqcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lb3MvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3pvbmUuanMvbGliL3J4anMvcnhqcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFFekQsSUFBWSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxNQUFXLEVBQUUsSUFBYyxFQUFFLEdBQWlCLEVBQUUsRUFBRTtJQUNwRixNQUFNLE1BQU0sR0FBc0MsSUFBWSxDQUFDLFVBQVUsQ0FBQztJQUMxRSxNQUFNLFVBQVUsR0FBRyxzQkFBc0IsQ0FBQztJQUMxQyxNQUFNLFdBQVcsR0FBRyx1QkFBdUIsQ0FBQztJQUM1QyxNQUFNLGNBQWMsR0FBRywwQkFBMEIsQ0FBQztJQUVsRCxNQUFNLHNCQUFzQixHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztJQUV2RCxNQUFNLGVBQWUsR0FBRztRQUN0QixNQUFNLG1CQUFtQixHQUFRLFVBQVUsQ0FBQyxTQUFTLENBQUM7UUFDdEQsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDOUMsTUFBTSxVQUFVLEdBQUcsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxtQkFBbUIsQ0FBQyxVQUFVLENBQUM7UUFFMUYsc0JBQXNCLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRTtZQUMzQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUks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QU0sV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDakMsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBRXBDLDhDQUE4QztZQUM5QyxpREFBaUQ7WUFDakQsSUFBSSxnQkFBZ0IsSUFBSSxnQkFBZ0IsS0FBSyxXQUFXLEVBQUU7Z0JBQ3hELE9BQU8sZ0JBQWdCLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDO2FBQ3hFO2lCQUFNO2dCQUNMLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7YUFDeEM7UUFDSCxDQUFDLENBQUM7SUFDSixDQUFDLENBQUM7SUFFRixlQUFlLEVBQUUsQ0FBQztJQUNsQixpQkFBaUIsRUFBRSxDQUFDO0lBQ3BCLGVBQWUsRUFBRSxDQUFDO0FBQ3BCLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge09ic2VydmFibGUsIFN1YnNjcmliZXIsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5cbihab25lIGFzIGFueSkuX19sb2FkX3BhdGNoKCdyeGpzJywgKGdsb2JhbDogYW55LCBab25lOiBab25lVHlwZSwgYXBpOiBfWm9uZVByaXZhdGUpID0+IHtcbiAgY29uc3Qgc3ltYm9sOiAoc3ltYm9sU3RyaW5nOiBzdHJpbmcpID0+IHN0cmluZyA9IChab25lIGFzIGFueSkuX19zeW1ib2xfXztcbiAgY29uc3QgbmV4dFNvdXJjZSA9ICdyeGpzLlN1YnNjcmliZXIubmV4dCc7XG4gIGNvbnN0IGVycm9yU291cmNlID0gJ3J4anMuU3Vic2NyaWJlci5lcnJvcic7XG4gIGNvbnN0IGNvbXBsZXRlU291cmNlID0gJ3J4anMuU3Vic2NyaWJlci5jb21wbGV0ZSc7XG5cbiAgY29uc3QgT2JqZWN0RGVmaW5lUHJvcGVydGllcyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzO1xuXG4gIGNvbnN0IHBhdGNoT2JzZXJ2YWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IE9ic2VydmFibGVQcm90b3R5cGU6IGFueSA9IE9ic2VydmFibGUucHJvdG90eXBlO1xuICAgIGNvbnN0IF9zeW1ib2xTdWJzY3JpYmUgPSBzeW1ib2woJ19zdWJzY3JpYmUnKTtcbiAgICBjb25zdCBfc3Vic2NyaWJlID0gT2JzZXJ2YWJsZVByb3RvdHlwZVtfc3ltYm9sU3Vic2NyaWJlXSA9IE9ic2VydmFibGVQcm90b3R5cGUuX3N1YnNjcmliZTtcblxuICAgIE9iamVjdERlZmluZVByb3BlcnRpZXMoT2JzZXJ2YWJsZS5wcm90b3R5cGUsIHtcbiAgICAgIF96b25lOiB7dmFsdWU6IG51bGwsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWV9LFxuICAgICAgX3pvbmVTb3VyY2U6IHt2YWx1ZTogbnVsbCwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZX0sXG4gICAgICBfem9uZVN1YnNjcmliZToge3ZhbHVlOiBudWxsLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlfSxcbiAgICAgIHNvdXJjZToge1xuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGdldDogZnVuY3Rpb24odGhpczogT2JzZXJ2YWJsZTxhbnk+KSB7XG4gICAgICAgICAgcmV0dXJuICh0aGlzIGFzIGFueSkuX3pvbmVTb3VyY2U7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odGhpczogT2JzZXJ2YWJsZTxhbnk+LCBzb3VyY2U6IGFueSkge1xuICAgICAgICAgICh0aGlzIGFzIGFueSkuX3pvbmUgPSBab25lLmN1cnJlbnQ7XG4gICAgICAgICAgKHRoaXMgYXMgYW55KS5fem9uZVNvdXJjZSA9IHNvdXJjZTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIF9zdWJzY3JpYmU6IHtcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uKHRoaXM6IE9ic2VydmFibGU8YW55Pikge1xuICAgICAgICAgIGlmICgodGhpcyBhcyBhbnkpLl96b25lU3Vic2NyaWJlKSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMgYXMgYW55KS5fem9uZVN1YnNjcmliZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY29uc3RydWN0b3IgPT09IE9ic2VydmFibGUpIHtcbiAgICAgICAgICAgIHJldHVybiBfc3Vic2NyaWJlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKTtcbiAgICAgICAgICByZXR1cm4gcHJvdG8gJiYgcHJvdG8uX3N1YnNjcmliZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih0aGlzOiBPYnNlcnZhYmxlPGFueT4sIHN1YnNjcmliZTogYW55KSB7XG4gICAgICAgICAgKHRoaXMgYXMgYW55KS5fem9uZSA9IFpvbmUuY3VycmVudDtcbiAgICAgICAgICAodGhpcyBhcyBhbnkpLl96b25lU3Vic2NyaWJlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fem9uZSAmJiB0aGlzLl96b25lICE9PSBab25lLmN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgY29uc3QgdGVhckRvd24gPSB0aGlzLl96b25lLnJ1bihzdWJzY3JpYmUsIHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgIGlmICh0ZWFyRG93biAmJiB0eXBlb2YgdGVhckRvd24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB6b25lID0gdGhpcy5fem9uZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICBpZiAoem9uZSAhPT0gWm9uZS5jdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB6b25lLnJ1bih0ZWFyRG93biwgdGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHJldHVybiB0ZWFyRG93bi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIHRlYXJEb3duO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN1YnNjcmliZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBzdWJqZWN0RmFjdG9yeToge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiAodGhpcyBhcyBhbnkpLl96b25lU3ViamVjdEZhY3Rvcnk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24oZmFjdG9yeTogYW55KSB7XG4gICAgICAgICAgY29uc3Qgem9uZSA9IHRoaXMuX3pvbmU7XG4gICAgICAgICAgdGhpcy5fem9uZVN1YmplY3RGYWN0b3J5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoem9uZSAmJiB6b25lICE9PSBab25lLmN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHpvbmUucnVuKGZhY3RvcnksIHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFjdG9yeS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBhcGkucGF0Y2hNZXRob2QoT2JzZXJ2YWJsZS5wcm90b3R5cGUsICdsaWZ0JywgKGRlbGVnYXRlOiBhbnkpID0+IChzZWxmOiBhbnksIGFyZ3M6IGFueVtdKSA9PiB7XG4gICAgY29uc3Qgb2JzZXJ2YWJsZTogYW55ID0gZGVsZWdhdGUuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgaWYgKG9ic2VydmFibGUub3BlcmF0b3IpIHtcbiAgICAgIG9ic2VydmFibGUub3BlcmF0b3IuX3pvbmUgPSBab25lLmN1cnJlbnQ7XG4gICAgICBhcGkucGF0Y2hNZXRob2QoXG4gICAgICAgICAgb2JzZXJ2YWJsZS5vcGVyYXRvciwgJ2NhbGwnLFxuICAgICAgICAgIChvcGVyYXRvckRlbGVnYXRlOiBhbnkpID0+IChvcGVyYXRvclNlbGY6IGFueSwgb3BlcmF0b3JBcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICAgICAgaWYgKG9wZXJhdG9yU2VsZi5fem9uZSAmJiBvcGVyYXRvclNlbGYuX3pvbmUgIT09IFpvbmUuY3VycmVudCkge1xuICAgICAgICAgICAgICByZXR1cm4gb3BlcmF0b3JTZWxmLl96b25lLnJ1bihvcGVyYXRvckRlbGVnYXRlLCBvcGVyYXRvclNlbGYsIG9wZXJhdG9yQXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb3BlcmF0b3JEZWxlZ2F0ZS5hcHBseShvcGVyYXRvclNlbGYsIG9wZXJhdG9yQXJncyk7XG4gICAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBvYnNlcnZhYmxlO1xuICB9KTtcblxuICBjb25zdCBwYXRjaFN1YnNjcmlwdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIE9iamVjdERlZmluZVByb3BlcnRpZXMoU3Vic2NyaXB0aW9uLnByb3RvdHlwZSwge1xuICAgICAgX3pvbmU6IHt2YWx1ZTogbnVsbCwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZX0sXG4gICAgICBfem9uZVVuc3Vic2NyaWJlOiB7dmFsdWU6IG51bGwsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWV9LFxuICAgICAgX3Vuc3Vic2NyaWJlOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24odGhpczogU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgaWYgKCh0aGlzIGFzIGFueSkuX3pvbmVVbnN1YnNjcmliZSkge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzIGFzIGFueSkuX3pvbmVVbnN1YnNjcmliZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcyk7XG4gICAgICAgICAgcmV0dXJuIHByb3RvICYmIHByb3RvLl91bnN1YnNjcmliZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih0aGlzOiBTdWJzY3JpcHRpb24sIHVuc3Vic2NyaWJlOiBhbnkpIHtcbiAgICAgICAgICAodGhpcyBhcyBhbnkpLl96b25lID0gWm9uZS5jdXJyZW50O1xuICAgICAgICAgICh0aGlzIGFzIGFueSkuX3pvbmVVbnN1YnNjcmliZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3pvbmUgJiYgdGhpcy5fem9uZSAhPT0gWm9uZS5jdXJyZW50KSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLl96b25lLnJ1bih1bnN1YnNjcmliZSwgdGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB1bnN1YnNjcmliZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBwYXRjaFN1YnNjcmliZXIgPSBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBuZXh0ID0gU3Vic2NyaWJlci5wcm90b3R5cGUubmV4dDtcbiAgICBjb25zdCBlcnJvciA9IFN1YnNjcmliZXIucHJvdG90eXBlLmVycm9yO1xuICAgIGNvbnN0IGNvbXBsZXRlID0gU3Vic2NyaWJlci5wcm90b3R5cGUuY29tcGxldGU7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3Vic2NyaWJlci5wcm90b3R5cGUsICdkZXN0aW5hdGlvbicsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogZnVuY3Rpb24odGhpczogU3Vic2NyaWJlcjxhbnk+KSB7XG4gICAgICAgIHJldHVybiAodGhpcyBhcyBhbnkpLl96b25lRGVzdGluYXRpb247XG4gICAgICB9LFxuICAgICAgc2V0OiBmdW5jdGlvbih0aGlzOiBTdWJzY3JpYmVyPGFueT4sIGRlc3RpbmF0aW9uOiBhbnkpIHtcbiAgICAgICAgKHRoaXMgYXMgYW55KS5fem9uZSA9IFpvbmUuY3VycmVudDtcbiAgICAgICAgKHRoaXMgYXMgYW55KS5fem9uZURlc3RpbmF0aW9uID0gZGVzdGluYXRpb247XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBwYXRjaCBTdWJzY3JpYmVyLm5leHQgdG8gbWFrZSBzdXJlIGl0IHJ1blxuICAgIC8vIGludG8gU3Vic2NyaXB0aW9uWm9uZVxuICAgIFN1YnNjcmliZXIucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRab25lID0gWm9uZS5jdXJyZW50O1xuICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uWm9uZSA9IHRoaXMuX3pvbmU7XG5cbiAgICAgIC8vIGZvciBwZXJmb3JtYW5jZSBjb25jZXJuLCBjaGVjayBab25lLmN1cnJlbnRcbiAgICAgIC8vIGVxdWFsIHdpdGggdGhpcy5fem9uZShTdWJzY3JpcHRpb25ab25lKSBvciBub3RcbiAgICAgIGlmIChzdWJzY3JpcHRpb25ab25lICYmIHN1YnNjcmlwdGlvblpvbmUgIT09IGN1cnJlbnRab25lKSB7XG4gICAgICAgIHJldHVybiBzdWJzY3JpcHRpb25ab25lLnJ1bihuZXh0LCB0aGlzLCBhcmd1bWVudHMsIG5leHRTb3VyY2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5leHQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgU3Vic2NyaWJlci5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRab25lID0gWm9uZS5jdXJyZW50O1xuICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uWm9uZSA9IHRoaXMuX3pvbmU7XG5cbiAgICAgIC8vIGZvciBwZXJmb3JtYW5jZSBjb25jZXJuLCBjaGVjayBab25lLmN1cnJlbnRcbiAgICAgIC8vIGVxdWFsIHdpdGggdGhpcy5fem9uZShTdWJzY3JpcHRpb25ab25lKSBvciBub3RcbiAgICAgIGlmIChzdWJzY3JpcHRpb25ab25lICYmIHN1YnNjcmlwdGlvblpvbmUgIT09IGN1cnJlbnRab25lKSB7XG4gICAgICAgIHJldHVybiBzdWJzY3JpcHRpb25ab25lLnJ1bihlcnJvciwgdGhpcywgYXJndW1lbnRzLCBlcnJvclNvdXJjZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZXJyb3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgU3Vic2NyaWJlci5wcm90b3R5cGUuY29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRab25lID0gWm9uZS5jdXJyZW50O1xuICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uWm9uZSA9IHRoaXMuX3pvbmU7XG5cbiAgICAgIC8vIGZvciBwZXJmb3JtYW5jZSBjb25jZXJuLCBjaGVjayBab25lLmN1cnJlbnRcbiAgICAgIC8vIGVxdWFsIHdpdGggdGhpcy5fem9uZShTdWJzY3JpcHRpb25ab25lKSBvciBub3RcbiAgICAgIGlmIChzdWJzY3JpcHRpb25ab25lICYmIHN1YnNjcmlwdGlvblpvbmUgIT09IGN1cnJlbnRab25lKSB7XG4gICAgICAgIHJldHVybiBzdWJzY3JpcHRpb25ab25lLnJ1bihjb21wbGV0ZSwgdGhpcywgYXJndW1lbnRzLCBjb21wbGV0ZVNvdXJjZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY29tcGxldGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIHBhdGNoT2JzZXJ2YWJsZSgpO1xuICBwYXRjaFN1YnNjcmlwdGlvbigpO1xuICBwYXRjaFN1YnNjcmliZXIoKTtcbn0pO1xuIl19