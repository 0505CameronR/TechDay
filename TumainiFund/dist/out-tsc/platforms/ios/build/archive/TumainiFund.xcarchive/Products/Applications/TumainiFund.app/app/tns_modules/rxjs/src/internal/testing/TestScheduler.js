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
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("../Observable");
var Notification_1 = require("../Notification");
var ColdObservable_1 = require("./ColdObservable");
var HotObservable_1 = require("./HotObservable");
var SubscriptionLog_1 = require("./SubscriptionLog");
var VirtualTimeScheduler_1 = require("../scheduler/VirtualTimeScheduler");
var AsyncScheduler_1 = require("../scheduler/AsyncScheduler");
var defaultMaxFrame = 750;
var TestScheduler = /** @class */ (function (_super) {
    __extends(TestScheduler, _super);
    function TestScheduler(assertDeepEqual) {
        var _this = _super.call(this, VirtualTimeScheduler_1.VirtualAction, defaultMaxFrame) || this;
        _this.assertDeepEqual = assertDeepEqual;
        _this.hotObservables = [];
        _this.coldObservables = [];
        _this.flushTests = [];
        _this.runMode = false;
        return _this;
    }
    TestScheduler.prototype.createTime = function (marbles) {
        var indexOf = marbles.indexOf('|');
        if (indexOf === -1) {
            throw new Error('marble diagram for time should have a completion marker "|"');
        }
        return indexOf * TestScheduler.frameTimeFactor;
    };
    /**
     * @param marbles A diagram in the marble DSL. Letters map to keys in `values` if provided.
     * @param values Values to use for the letters in `marbles`. If ommitted, the letters themselves are used.
     * @param error The error to use for the `#` marble (if present).
     */
    TestScheduler.prototype.createColdObservable = function (marbles, values, error) {
        if (marbles.indexOf('^') !== -1) {
            throw new Error('cold observable cannot have subscription offset "^"');
        }
        if (marbles.indexOf('!') !== -1) {
            throw new Error('cold observable cannot have unsubscription marker "!"');
        }
        var messages = TestScheduler.parseMarbles(marbles, values, error, undefined, this.runMode);
        var cold = new ColdObservable_1.ColdObservable(messages, this);
        this.coldObservables.push(cold);
        return cold;
    };
    /**
     * @param marbles A diagram in the marble DSL. Letters map to keys in `values` if provided.
     * @param values Values to use for the letters in `marbles`. If ommitted, the letters themselves are used.
     * @param error The error to use for the `#` marble (if present).
     */
    TestScheduler.prototype.createHotObservable = function (marbles, values, error) {
        if (marbles.indexOf('!') !== -1) {
            throw new Error('hot observable cannot have unsubscription marker "!"');
        }
        var messages = TestScheduler.parseMarbles(marbles, values, error, undefined, this.runMode);
        var subject = new HotObservable_1.HotObservable(messages, this);
        this.hotObservables.push(subject);
        return subject;
    };
    TestScheduler.prototype.materializeInnerObservable = function (observable, outerFrame) {
        var _this = this;
        var messages = [];
        observable.subscribe(function (value) {
            messages.push({ frame: _this.frame - outerFrame, notification: Notification_1.Notification.createNext(value) });
        }, function (err) {
            messages.push({ frame: _this.frame - outerFrame, notification: Notification_1.Notification.createError(err) });
        }, function () {
            messages.push({ frame: _this.frame - outerFrame, notification: Notification_1.Notification.createComplete() });
        });
        return messages;
    };
    TestScheduler.prototype.expectObservable = function (observable, subscriptionMarbles) {
        var _this = this;
        if (subscriptionMarbles === void 0) { subscriptionMarbles = null; }
        var actual = [];
        var flushTest = { actual: actual, ready: false };
        var subscriptionParsed = TestScheduler.parseMarblesAsSubscriptions(subscriptionMarbles, this.runMode);
        var subscriptionFrame = subscriptionParsed.subscribedFrame === Number.POSITIVE_INFINITY ?
            0 : subscriptionParsed.subscribedFrame;
        var unsubscriptionFrame = subscriptionParsed.unsubscribedFrame;
        var subscription;
        this.schedule(function () {
            subscription = observable.subscribe(function (x) {
                var value = x;
                // Support Observable-of-Observables
                if (x instanceof Observable_1.Observable) {
                    value = _this.materializeInnerObservable(value, _this.frame);
                }
                actual.push({ frame: _this.frame, notification: Notification_1.Notification.createNext(value) });
            }, function (err) {
                actual.push({ frame: _this.frame, notification: Notification_1.Notification.createError(err) });
            }, function () {
                actual.push({ frame: _this.frame, notification: Notification_1.Notification.createComplete() });
            });
        }, subscriptionFrame);
        if (unsubscriptionFrame !== Number.POSITIVE_INFINITY) {
            this.schedule(function () { return subscription.unsubscribe(); }, unsubscriptionFrame);
        }
        this.flushTests.push(flushTest);
        var runMode = this.runMode;
        return {
            toBe: function (marbles, values, errorValue) {
                flushTest.ready = true;
                flushTest.expected = TestScheduler.parseMarbles(marbles, values, errorValue, true, runMode);
            }
        };
    };
    TestScheduler.prototype.expectSubscriptions = function (actualSubscriptionLogs) {
        var flushTest = { actual: actualSubscriptionLogs, ready: false };
        this.flushTests.push(flushTest);
        var runMode = this.runMode;
        return {
            toBe: function (marbles) {
                var marblesArray = (typeof marbles === 'string') ? [marbles] : marbles;
                flushTest.ready = true;
                flushTest.expected = marblesArray.map(function (marbles) {
                    return TestScheduler.parseMarblesAsSubscriptions(marbles, runMode);
                });
            }
        };
    };
    TestScheduler.prototype.flush = function () {
        var _this = this;
        var hotObservables = this.hotObservables;
        while (hotObservables.length > 0) {
            hotObservables.shift().setup();
        }
        _super.prototype.flush.call(this);
        this.flushTests = this.flushTests.filter(function (test) {
            if (test.ready) {
                _this.assertDeepEqual(test.actual, test.expected);
                return false;
            }
            return true;
        });
    };
    /** @nocollapse */
    TestScheduler.parseMarblesAsSubscriptions = function (marbles, runMode) {
        var _this = this;
        if (runMode === void 0) { runMode = false; }
        if (typeof marbles !== 'string') {
            return new SubscriptionLog_1.SubscriptionLog(Number.POSITIVE_INFINITY);
        }
        var len = marbles.length;
        var groupStart = -1;
        var subscriptionFrame = Number.POSITIVE_INFINITY;
        var unsubscriptionFrame = Number.POSITIVE_INFINITY;
        var frame = 0;
        var _loop_1 = function (i) {
            var nextFrame = frame;
            var advanceFrameBy = function (count) {
                nextFrame += count * _this.frameTimeFactor;
            };
            var c = marbles[i];
            switch (c) {
                case ' ':
                    // Whitespace no longer advances time
                    if (!runMode) {
                        advanceFrameBy(1);
                    }
                    break;
                case '-':
                    advanceFrameBy(1);
                    break;
                case '(':
                    groupStart = frame;
                    advanceFrameBy(1);
                    break;
                case ')':
                    groupStart = -1;
                    advanceFrameBy(1);
                    break;
                case '^':
                    if (subscriptionFrame !== Number.POSITIVE_INFINITY) {
                        throw new Error('found a second subscription point \'^\' in a ' +
                            'subscription marble diagram. There can only be one.');
                    }
                    subscriptionFrame = groupStart > -1 ? groupStart : frame;
                    advanceFrameBy(1);
                    break;
                case '!':
                    if (unsubscriptionFrame !== Number.POSITIVE_INFINITY) {
                        throw new Error('found a second subscription point \'^\' in a ' +
                            'subscription marble diagram. There can only be one.');
                    }
                    unsubscriptionFrame = groupStart > -1 ? groupStart : frame;
                    break;
                default:
                    // time progression syntax
                    if (runMode && c.match(/^[0-9]$/)) {
                        // Time progression must be preceeded by at least one space
                        // if it's not at the beginning of the diagram
                        if (i === 0 || marbles[i - 1] === ' ') {
                            var buffer = marbles.slice(i);
                            var match = buffer.match(/^([0-9]+(?:\.[0-9]+)?)(ms|s|m) /);
                            if (match) {
                                i += match[0].length - 1;
                                var duration = parseFloat(match[1]);
                                var unit = match[2];
                                var durationInMs = void 0;
                                switch (unit) {
                                    case 'ms':
                                        durationInMs = duration;
                                        break;
                                    case 's':
                                        durationInMs = duration * 1000;
                                        break;
                                    case 'm':
                                        durationInMs = duration * 1000 * 60;
                                        break;
                                    default:
                                        break;
                                }
                                advanceFrameBy(durationInMs / this_1.frameTimeFactor);
                                break;
                            }
                        }
                    }
                    throw new Error('there can only be \'^\' and \'!\' markers in a ' +
                        'subscription marble diagram. Found instead \'' + c + '\'.');
            }
            frame = nextFrame;
            out_i_1 = i;
        };
        var this_1 = this, out_i_1;
        for (var i = 0; i < len; i++) {
            _loop_1(i);
            i = out_i_1;
        }
        if (unsubscriptionFrame < 0) {
            return new SubscriptionLog_1.SubscriptionLog(subscriptionFrame);
        }
        else {
            return new SubscriptionLog_1.SubscriptionLog(subscriptionFrame, unsubscriptionFrame);
        }
    };
    /** @nocollapse */
    TestScheduler.parseMarbles = function (marbles, values, errorValue, materializeInnerObservables, runMode) {
        var _this = this;
        if (materializeInnerObservables === void 0) { materializeInnerObservables = false; }
        if (runMode === void 0) { runMode = false; }
        if (marbles.indexOf('!') !== -1) {
            throw new Error('conventional marble diagrams cannot have the ' +
                'unsubscription marker "!"');
        }
        var len = marbles.length;
        var testMessages = [];
        var subIndex = runMode ? marbles.replace(/^[ ]+/, '').indexOf('^') : marbles.indexOf('^');
        var frame = subIndex === -1 ? 0 : (subIndex * -this.frameTimeFactor);
        var getValue = typeof values !== 'object' ?
            function (x) { return x; } :
            function (x) {
                // Support Observable-of-Observables
                if (materializeInnerObservables && values[x] instanceof ColdObservable_1.ColdObservable) {
                    return values[x].messages;
                }
                return values[x];
            };
        var groupStart = -1;
        var _loop_2 = function (i) {
            var nextFrame = frame;
            var advanceFrameBy = function (count) {
                nextFrame += count * _this.frameTimeFactor;
            };
            var notification = void 0;
            var c = marbles[i];
            switch (c) {
                case ' ':
                    // Whitespace no longer advances time
                    if (!runMode) {
                        advanceFrameBy(1);
                    }
                    break;
                case '-':
                    advanceFrameBy(1);
                    break;
                case '(':
                    groupStart = frame;
                    advanceFrameBy(1);
                    break;
                case ')':
                    groupStart = -1;
                    advanceFrameBy(1);
                    break;
                case '|':
                    notification = Notification_1.Notification.createComplete();
                    advanceFrameBy(1);
                    break;
                case '^':
                    advanceFrameBy(1);
                    break;
                case '#':
                    notification = Notification_1.Notification.createError(errorValue || 'error');
                    advanceFrameBy(1);
                    break;
                default:
                    // Might be time progression syntax, or a value literal
                    if (runMode && c.match(/^[0-9]$/)) {
                        // Time progression must be preceeded by at least one space
                        // if it's not at the beginning of the diagram
                        if (i === 0 || marbles[i - 1] === ' ') {
                            var buffer = marbles.slice(i);
                            var match = buffer.match(/^([0-9]+(?:\.[0-9]+)?)(ms|s|m) /);
                            if (match) {
                                i += match[0].length - 1;
                                var duration = parseFloat(match[1]);
                                var unit = match[2];
                                var durationInMs = void 0;
                                switch (unit) {
                                    case 'ms':
                                        durationInMs = duration;
                                        break;
                                    case 's':
                                        durationInMs = duration * 1000;
                                        break;
                                    case 'm':
                                        durationInMs = duration * 1000 * 60;
                                        break;
                                    default:
                                        break;
                                }
                                advanceFrameBy(durationInMs / this_2.frameTimeFactor);
                                break;
                            }
                        }
                    }
                    notification = Notification_1.Notification.createNext(getValue(c));
                    advanceFrameBy(1);
                    break;
            }
            if (notification) {
                testMessages.push({ frame: groupStart > -1 ? groupStart : frame, notification: notification });
            }
            frame = nextFrame;
            out_i_2 = i;
        };
        var this_2 = this, out_i_2;
        for (var i = 0; i < len; i++) {
            _loop_2(i);
            i = out_i_2;
        }
        return testMessages;
    };
    TestScheduler.prototype.run = function (callback) {
        var prevFrameTimeFactor = TestScheduler.frameTimeFactor;
        var prevMaxFrames = this.maxFrames;
        TestScheduler.frameTimeFactor = 1;
        this.maxFrames = Number.POSITIVE_INFINITY;
        this.runMode = true;
        AsyncScheduler_1.AsyncScheduler.delegate = this;
        var helpers = {
            cold: this.createColdObservable.bind(this),
            hot: this.createHotObservable.bind(this),
            flush: this.flush.bind(this),
            expectObservable: this.expectObservable.bind(this),
            expectSubscriptions: this.expectSubscriptions.bind(this),
        };
        try {
            var ret = callback(helpers);
            this.flush();
            return ret;
        }
        finally {
            TestScheduler.frameTimeFactor = prevFrameTimeFactor;
            this.maxFrames = prevMaxFrames;
            this.runMode = false;
            AsyncScheduler_1.AsyncScheduler.delegate = undefined;
        }
    };
    return TestScheduler;
}(VirtualTimeScheduler_1.VirtualTimeScheduler));
exports.TestScheduler = TestScheduler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdFNjaGVkdWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvdGVzdGluZy9UZXN0U2NoZWR1bGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDRDQUEyQztBQUMzQyxnREFBK0M7QUFDL0MsbURBQWtEO0FBQ2xELGlEQUFnRDtBQUVoRCxxREFBb0Q7QUFFcEQsMEVBQXdGO0FBQ3hGLDhEQUE2RDtBQUU3RCxJQUFNLGVBQWUsR0FBVyxHQUFHLENBQUM7QUFtQnBDO0lBQW1DLGlDQUFvQjtJQU1yRCx1QkFBbUIsZUFBK0Q7UUFBbEYsWUFDRSxrQkFBTSxvQ0FBYSxFQUFFLGVBQWUsQ0FBQyxTQUN0QztRQUZrQixxQkFBZSxHQUFmLGVBQWUsQ0FBZ0Q7UUFMbEUsb0JBQWMsR0FBeUIsRUFBRSxDQUFDO1FBQzFDLHFCQUFlLEdBQTBCLEVBQUUsQ0FBQztRQUNwRCxnQkFBVSxHQUFvQixFQUFFLENBQUM7UUFDakMsYUFBTyxHQUFHLEtBQUssQ0FBQzs7SUFJeEIsQ0FBQztJQUVELGtDQUFVLEdBQVYsVUFBVyxPQUFlO1FBQ3hCLElBQU0sT0FBTyxHQUFXLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDN0MsSUFBSSxPQUFPLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDbEIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2REFBNkQsQ0FBQyxDQUFDO1NBQ2hGO1FBQ0QsT0FBTyxPQUFPLEdBQUcsYUFBYSxDQUFDLGVBQWUsQ0FBQztJQUNqRCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILDRDQUFvQixH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QUFJLENBQUM7UUFDcEIsK0JBQWMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBRS9CLElBQU0sT0FBTyxHQUFHO1lBQ2QsSUFBSSxFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQzFDLEdBQUcsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUN4QyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQzVCLGdCQUFnQixFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ2xELG1CQUFtQixFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1NBQ3pELENBQUM7UUFDRixJQUFJO1lBQ0YsSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNiLE9BQU8sR0FBRyxDQUFDO1NBQ1o7Z0JBQVM7WUFDUixhQUFhLENBQUMsZUFBZSxHQUFHLG1CQUFtQixDQUFDO1lBQ3BELElBQUksQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFDO1lBQy9CLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1lBQ3JCLCtCQUFjLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQztTQUNyQztJQUNILENBQUM7SUFDSCxvQkFBQztBQUFELENBQUMsQUFuWEQsQ0FBbUMsMkNBQW9CLEdBbVh0RDtBQW5YWSxzQ0FBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE5vdGlmaWNhdGlvbiB9IGZyb20gJy4uL05vdGlmaWNhdGlvbic7XG5pbXBvcnQgeyBDb2xkT2JzZXJ2YWJsZSB9IGZyb20gJy4vQ29sZE9ic2VydmFibGUnO1xuaW1wb3J0IHsgSG90T2JzZXJ2YWJsZSB9IGZyb20gJy4vSG90T2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBUZXN0TWVzc2FnZSB9IGZyb20gJy4vVGVzdE1lc3NhZ2UnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uTG9nIH0gZnJvbSAnLi9TdWJzY3JpcHRpb25Mb2cnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IFZpcnR1YWxUaW1lU2NoZWR1bGVyLCBWaXJ0dWFsQWN0aW9uIH0gZnJvbSAnLi4vc2NoZWR1bGVyL1ZpcnR1YWxUaW1lU2NoZWR1bGVyJztcbmltcG9ydCB7IEFzeW5jU2NoZWR1bGVyIH0gZnJvbSAnLi4vc2NoZWR1bGVyL0FzeW5jU2NoZWR1bGVyJztcblxuY29uc3QgZGVmYXVsdE1heEZyYW1lOiBudW1iZXIgPSA3NTA7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUnVuSGVscGVycyB7XG4gIGNvbGQ6IHR5cGVvZiBUZXN0U2NoZWR1bGVyLnByb3RvdHlwZS5jcmVhdGVDb2xkT2JzZXJ2YWJsZTtcbiAgaG90OiB0eXBlb2YgVGVzdFNjaGVkdWxlci5wcm90b3R5cGUuY3JlYXRlSG90T2JzZXJ2YWJsZTtcbiAgZmx1c2g6IHR5cGVvZiBUZXN0U2NoZWR1bGVyLnByb3RvdHlwZS5mbHVzaDtcbiAgZXhwZWN0T2JzZXJ2YWJsZTogdHlwZW9mIFRlc3RTY2hlZHVsZXIucHJvdG90eXBlLmV4cGVjdE9ic2VydmFibGU7XG4gIGV4cGVjdFN1YnNjcmlwdGlvbnM6IHR5cGVvZiBUZXN0U2NoZWR1bGVyLnByb3RvdHlwZS5leHBlY3RTdWJzY3JpcHRpb25zO1xufVxuXG5pbnRlcmZhY2UgRmx1c2hhYmxlVGVzdCB7XG4gIHJlYWR5OiBib29sZWFuO1xuICBhY3R1YWw/OiBhbnlbXTtcbiAgZXhwZWN0ZWQ/OiBhbnlbXTtcbn1cblxuZXhwb3J0IHR5cGUgb2JzZXJ2YWJsZVRvQmVGbiA9IChtYXJibGVzOiBzdHJpbmcsIHZhbHVlcz86IGFueSwgZXJyb3JWYWx1ZT86IGFueSkgPT4gdm9pZDtcbmV4cG9ydCB0eXBlIHN1YnNjcmlwdGlvbkxvZ3NUb0JlRm4gPSAobWFyYmxlczogc3RyaW5nIHwgc3RyaW5nW10pID0+IHZvaWQ7XG5cbmV4cG9ydCBjbGFzcyBUZXN0U2NoZWR1bGVyIGV4dGVuZHMgVmlydHVhbFRpbWVTY2hlZHVsZXIge1xuICBwdWJsaWMgcmVhZG9ubHkgaG90T2JzZXJ2YWJsZXM6IEhvdE9ic2VydmFibGU8YW55PltdID0gW107XG4gIHB1YmxpYyByZWFkb25seSBjb2xkT2JzZXJ2YWJsZXM6IENvbGRPYnNlcnZhYmxlPGFueT5bXSA9IFtdO1xuICBwcml2YXRlIGZsdXNoVGVzdHM6IEZsdXNoYWJsZVRlc3RbXSA9IFtdO1xuICBwcml2YXRlIHJ1bk1vZGUgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgYXNzZXJ0RGVlcEVxdWFsOiAoYWN0dWFsOiBhbnksIGV4cGVjdGVkOiBhbnkpID0+IGJvb2xlYW4gfCB2b2lkKSB7XG4gICAgc3VwZXIoVmlydHVhbEFjdGlvbiwgZGVmYXVsdE1heEZyYW1lKTtcbiAgfVxuXG4gIGNyZWF0ZVRpbWUobWFyYmxlczogc3RyaW5nKTogbnVtYmVyIHtcbiAgICBjb25zdCBpbmRleE9mOiBudW1iZXIgPSBtYXJibGVzLmluZGV4T2YoJ3wnKTtcbiAgICBpZiAoaW5kZXhPZiA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbWFyYmxlIGRpYWdyYW0gZm9yIHRpbWUgc2hvdWxkIGhhdmUgYSBjb21wbGV0aW9uIG1hcmtlciBcInxcIicpO1xuICAgIH1cbiAgICByZXR1cm4gaW5kZXhPZiAqIFRlc3RTY2hlZHVsZXIuZnJhbWVUaW1lRmFjdG9yO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBtYXJibGVzIEEgZGlhZ3JhbSBpbiB0aGUgbWFyYmxlIERTTC4gTGV0dGVycyBtYXAgdG8ga2V5cyBpbiBgdmFsdWVzYCBpZiBwcm92aWRlZC5cbiAgICogQHBhcmFtIHZhbHVlcyBWYWx1ZXMgdG8gdXNlIGZvciB0aGUgbGV0dGVycyBpbiBgbWFyYmxlc2AuIElmIG9tbWl0dGVkLCB0aGUgbGV0dGVycyB0aGVtc2VsdmVzIGFyZSB1c2VkLlxuICAgKiBAcGFyYW0gZXJyb3IgVGhlIGVycm9yIHRvIHVzZSBmb3IgdGhlIGAjYCBtYXJibGUgKGlmIHByZXNlbnQpLlxuICAgKi9cbiAgY3JlYXRlQ29sZE9ic2VydmFibGU8VCA9IHN0cmluZz4obWFyYmxlczogc3RyaW5nLCB2YWx1ZXM/OiB7IFttYXJibGU6IHN0cmluZ106IFQgfSwgZXJyb3I/OiBhbnkpOiBDb2xkT2JzZXJ2YWJsZTxUPiB7XG4gICAgaWYgKG1hcmJsZXMuaW5kZXhPZignXicpICE9PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb2xkIG9ic2VydmFibGUgY2Fubm90IGhhdmUgc3Vic2NyaXB0aW9uIG9mZnNldCBcIl5cIicpO1xuICAgIH1cbiAgICBpZiAobWFyYmxlcy5pbmRleE9mKCchJykgIT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvbGQgb2JzZXJ2YWJsZSBjYW5ub3QgaGF2ZSB1bnN1YnNjcmlwdGlvbiBtYXJrZXIgXCIhXCInKTtcbiAgICB9XG4gICAgY29uc3QgbWVzc2FnZXMgPSBUZXN0U2NoZWR1bGVyLnBhcnNlTWFyYmxlcyhtYXJibGVzLCB2YWx1ZXMsIGVycm9yLCB1bmRlZmluZWQsIHRoaXMucnVuTW9kZSk7XG4gICAgY29uc3QgY29sZCA9IG5ldyBDb2xkT2JzZXJ2YWJsZTxUPihtZXNzYWdlcywgdGhpcyk7XG4gICAgdGhpcy5jb2xkT2JzZXJ2YWJsZXMucHVzaChjb2xkKTtcbiAgICByZXR1cm4gY29sZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gbWFyYmxlcyBBIGRpYWdyYW0gaW4gdGhlIG1hcmJsZSBEU0wuIExldHRlcnMgbWFwIHRvIGtleXMgaW4gYHZhbHVlc2AgaWYgcHJvdmlkZWQuXG4gICAqIEBwYXJhbSB2YWx1ZXMgVmFsdWVzIHRvIHVzZSBmb3IgdGhlIGxldHRlcnMgaW4gYG1hcmJsZXNgLiBJZiBvbW1pdHRlZCwgdGhlIGxldHRlcnMgdGhlbXNlbHZlcyBhcmUgdXNlZC5cbiAgICogQHBhcmFtIGVycm9yIFRoZSBlcnJvciB0byB1c2UgZm9yIHRoZSBgI2AgbWFyYmxlIChpZiBwcmVzZW50KS5cbiAgICovXG4gIGNyZWF0ZUhvdE9ic2VydmFibGU8VCA9IHN0cmluZz4obWFyYmxlczogc3RyaW5nLCB2YWx1ZXM/OiB7IFttYXJibGU6IHN0cmluZ106IFQgfSwgZXJyb3I/OiBhbnkpOiBIb3RPYnNlcnZhYmxlPFQ+IHtcbiAgICBpZiAobWFyYmxlcy5pbmRleE9mKCchJykgIT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2hvdCBvYnNlcnZhYmxlIGNhbm5vdCBoYXZlIHVuc3Vic2NyaXB0aW9uIG1hcmtlciBcIiFcIicpO1xuICAgIH1cbiAgICBjb25zdCBtZXNzYWdlcyA9IFRlc3RTY2hlZHVsZXIucGFyc2VNYXJibGVzKG1hcmJsZXMsIHZhbHVlcywgZXJyb3IsIHVuZGVmaW5lZCwgdGhpcy5ydW5Nb2RlKTtcbiAgICBjb25zdCBzdWJqZWN0ID0gbmV3IEhvdE9ic2VydmFibGU8VD4obWVzc2FnZXMsIHRoaXMpO1xuICAgIHRoaXMuaG90T2JzZXJ2YWJsZXMucHVzaChzdWJqZWN0KTtcbiAgICByZXR1cm4gc3ViamVjdDtcbiAgfVxuXG4gIHByaXZhdGUgbWF0ZXJpYWxpemVJbm5lck9ic2VydmFibGUob2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxhbnk+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dGVyRnJhbWU6IG51bWJlcik6IFRlc3RNZXNzYWdlW10ge1xuICAgIGNvbnN0IG1lc3NhZ2VzOiBUZXN0TWVzc2FnZVtdID0gW107XG4gICAgb2JzZXJ2YWJsZS5zdWJzY3JpYmUoKHZhbHVlKSA9PiB7XG4gICAgICBtZXNzYWdlcy5wdXNoKHsgZnJhbWU6IHRoaXMuZnJhbWUgLSBvdXRlckZyYW1lLCBub3RpZmljYXRpb246IE5vdGlmaWNhdGlvbi5jcmVhdGVOZXh0KHZhbHVlKSB9KTtcbiAgICB9LCAoZXJyKSA9PiB7XG4gICAgICBtZXNzYWdlcy5wdXNoKHsgZnJhbWU6IHRoaXMuZnJhbWUgLSBvdXRlckZyYW1lLCBub3RpZmljYXRpb246IE5vdGlmaWNhdGlvbi5jcmVhdGVFcnJvcihlcnIpIH0pO1xuICAgIH0sICgpID0+IHtcbiAgICAgIG1lc3NhZ2VzLnB1c2goeyBmcmFtZTogdGhpcy5mcmFtZSAtIG91dGVyRnJhbWUsIG5vdGlmaWNhdGlvbjogTm90aWZpY2F0aW9uLmNyZWF0ZUNvbXBsZXRlKCkgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG1lc3NhZ2VzO1xuICB9XG5cbiAgZXhwZWN0T2JzZXJ2YWJsZShvYnNlcnZhYmxlOiBPYnNlcnZhYmxlPGFueT4sXG4gICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uTWFyYmxlczogc3RyaW5nID0gbnVsbCk6ICh7IHRvQmU6IG9ic2VydmFibGVUb0JlRm4gfSkge1xuICAgIGNvbnN0IGFjdHVhbDogVGVzdE1lc3NhZ2VbXSA9IFtdO1xuICAgIGNvbnN0IGZsdXNoVGVzdDogRmx1c2hhYmxlVGVzdCA9IHsgYWN0dWFsLCByZWFkeTogZmFsc2UgfTtcbiAgICBjb25zdCBzdWJzY3JpcHRpb25QYXJzZWQgPSBUZXN0U2NoZWR1bGVyLnBhcnNlTWFyYmxlc0FzU3Vic2NyaXB0aW9ucyhzdWJzY3JpcHRpb25NYXJibGVzLCB0aGlzLnJ1bk1vZGUpO1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbkZyYW1lID0gc3Vic2NyaXB0aW9uUGFyc2VkLnN1YnNjcmliZWRGcmFtZSA9PT0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZID9cbiAgICAgIDAgOiBzdWJzY3JpcHRpb25QYXJzZWQuc3Vic2NyaWJlZEZyYW1lO1xuICAgIGNvbnN0IHVuc3Vic2NyaXB0aW9uRnJhbWUgPSBzdWJzY3JpcHRpb25QYXJzZWQudW5zdWJzY3JpYmVkRnJhbWU7XG4gICAgbGV0IHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gICAgdGhpcy5zY2hlZHVsZSgoKSA9PiB7XG4gICAgICBzdWJzY3JpcHRpb24gPSBvYnNlcnZhYmxlLnN1YnNjcmliZSh4ID0+IHtcbiAgICAgICAgbGV0IHZhbHVlID0geDtcbiAgICAgICAgLy8gU3VwcG9ydCBPYnNlcnZhYmxlLW9mLU9ic2VydmFibGVzXG4gICAgICAgIGlmICh4IGluc3RhbmNlb2YgT2JzZXJ2YWJsZSkge1xuICAgICAgICAgIHZhbHVlID0gdGhpcy5tYXRlcmlhbGl6ZUlubmVyT2JzZXJ2YWJsZSh2YWx1ZSwgdGhpcy5mcmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgYWN0dWFsLnB1c2goeyBmcmFtZTogdGhpcy5mcmFtZSwgbm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb24uY3JlYXRlTmV4dCh2YWx1ZSkgfSk7XG4gICAgICB9LCAoZXJyKSA9PiB7XG4gICAgICAgIGFjdHVhbC5wdXNoKHsgZnJhbWU6IHRoaXMuZnJhbWUsIG5vdGlmaWNhdGlvbjogTm90aWZpY2F0aW9uLmNyZWF0ZUVycm9yKGVycikgfSk7XG4gICAgICB9LCAoKSA9PiB7XG4gICAgICAgIGFjdHVhbC5wdXNoKHsgZnJhbWU6IHRoaXMuZnJhbWUsIG5vdGlmaWNhdGlvbjogTm90aWZpY2F0aW9uLmNyZWF0ZUNvbXBsZXRlKCkgfSk7XG4gICAgICB9KTtcbiAgICB9LCBzdWJzY3JpcHRpb25GcmFtZSk7XG5cbiAgICBpZiAodW5zdWJzY3JpcHRpb25GcmFtZSAhPT0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZKSB7XG4gICAgICB0aGlzLnNjaGVkdWxlKCgpID0+IHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpLCB1bnN1YnNjcmlwdGlvbkZyYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLmZsdXNoVGVzdHMucHVzaChmbHVzaFRlc3QpO1xuICAgIGNvbnN0IHsgcnVuTW9kZSB9ID0gdGhpcztcblxuICAgIHJldHVybiB7XG4gICAgICB0b0JlKG1hcmJsZXM6IHN0cmluZywgdmFsdWVzPzogYW55LCBlcnJvclZhbHVlPzogYW55KSB7XG4gICAgICAgIGZsdXNoVGVzdC5yZWFkeSA9IHRydWU7XG4gICAgICAgIGZsdXNoVGVzdC5leHBlY3RlZCA9IFRlc3RTY2hlZHVsZXIucGFyc2VNYXJibGVzKG1hcmJsZXMsIHZhbHVlcywgZXJyb3JWYWx1ZSwgdHJ1ZSwgcnVuTW9kZSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGV4cGVjdFN1YnNjcmlwdGlvbnMoYWN0dWFsU3Vic2NyaXB0aW9uTG9nczogU3Vic2NyaXB0aW9uTG9nW10pOiAoeyB0b0JlOiBzdWJzY3JpcHRpb25Mb2dzVG9CZUZuIH0pIHtcbiAgICBjb25zdCBmbHVzaFRlc3Q6IEZsdXNoYWJsZVRlc3QgPSB7IGFjdHVhbDogYWN0dWFsU3Vic2NyaXB0aW9uTG9ncywgcmVhZHk6IGZhbHNlIH07XG4gICAgdGhpcy5mbHVzaFRlc3RzLnB1c2goZmx1c2hUZXN0KTtcbiAgICBjb25zdCB7IHJ1bk1vZGUgfSA9IHRoaXM7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRvQmUobWFyYmxlczogc3RyaW5nIHwgc3RyaW5nW10pIHtcbiAgICAgICAgY29uc3QgbWFyYmxlc0FycmF5OiBzdHJpbmdbXSA9ICh0eXBlb2YgbWFyYmxlcyA9PT0gJ3N0cmluZycpID8gW21hcmJsZXNdIDogbWFyYmxlcztcbiAgICAgICAgZmx1c2hUZXN0LnJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgZmx1c2hUZXN0LmV4cGVjdGVkID0gbWFyYmxlc0FycmF5Lm1hcChtYXJibGVzID0+XG4gICAgICAgICAgVGVzdFNjaGVkdWxlci5wYXJzZU1hcmJsZXNBc1N1YnNjcmlwdGlvbnMobWFyYmxlcywgcnVuTW9kZSlcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgZmx1c2goKSB7XG4gICAgY29uc3QgaG90T2JzZXJ2YWJsZXMgPSB0aGlzLmhvdE9ic2VydmFibGVzO1xuICAgIHdoaWxlIChob3RPYnNlcnZhYmxlcy5sZW5ndGggPiAwKSB7XG4gICAgICBob3RPYnNlcnZhYmxlcy5zaGlmdCgpLnNldHVwKCk7XG4gICAgfVxuXG4gICAgc3VwZXIuZmx1c2goKTtcblxuICAgIHRoaXMuZmx1c2hUZXN0cyA9IHRoaXMuZmx1c2hUZXN0cy5maWx0ZXIodGVzdCA9PiB7XG4gICAgICBpZiAodGVzdC5yZWFkeSkge1xuICAgICAgICB0aGlzLmFzc2VydERlZXBFcXVhbCh0ZXN0LmFjdHVhbCwgdGVzdC5leHBlY3RlZCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIEBub2NvbGxhcHNlICovXG4gIHN0YXRpYyBwYXJzZU1hcmJsZXNBc1N1YnNjcmlwdGlvbnMobWFyYmxlczogc3RyaW5nLCBydW5Nb2RlID0gZmFsc2UpOiBTdWJzY3JpcHRpb25Mb2cge1xuICAgIGlmICh0eXBlb2YgbWFyYmxlcyAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBuZXcgU3Vic2NyaXB0aW9uTG9nKE51bWJlci5QT1NJVElWRV9JTkZJTklUWSk7XG4gICAgfVxuICAgIGNvbnN0IGxlbiA9IG1hcmJsZXMubGVuZ3RoO1xuICAgIGxldCBncm91cFN0YXJ0ID0gLTE7XG4gICAgbGV0IHN1YnNjcmlwdGlvbkZyYW1lID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuICAgIGxldCB1bnN1YnNjcmlwdGlvbkZyYW1lID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuICAgIGxldCBmcmFtZSA9IDA7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBsZXQgbmV4dEZyYW1lID0gZnJhbWU7XG4gICAgICBjb25zdCBhZHZhbmNlRnJhbWVCeSA9IChjb3VudDogbnVtYmVyKSA9PiB7XG4gICAgICAgIG5leHRGcmFtZSArPSBjb3VudCAqIHRoaXMuZnJhbWVUaW1lRmFjdG9yO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IGMgPSBtYXJibGVzW2ldO1xuICAgICAgc3dpdGNoIChjKSB7XG4gICAgICAgIGNhc2UgJyAnOlxuICAgICAgICAgIC8vIFdoaXRlc3BhY2Ugbm8gbG9uZ2VyIGFkdmFuY2VzIHRpbWVcbiAgICAgICAgICBpZiAoIXJ1bk1vZGUpIHtcbiAgICAgICAgICAgIGFkdmFuY2VGcmFtZUJ5KDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgYWR2YW5jZUZyYW1lQnkoMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJygnOlxuICAgICAgICAgIGdyb3VwU3RhcnQgPSBmcmFtZTtcbiAgICAgICAgICBhZHZhbmNlRnJhbWVCeSgxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnKSc6XG4gICAgICAgICAgZ3JvdXBTdGFydCA9IC0xO1xuICAgICAgICAgIGFkdmFuY2VGcmFtZUJ5KDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdeJzpcbiAgICAgICAgICBpZiAoc3Vic2NyaXB0aW9uRnJhbWUgIT09IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdmb3VuZCBhIHNlY29uZCBzdWJzY3JpcHRpb24gcG9pbnQgXFwnXlxcJyBpbiBhICcgK1xuICAgICAgICAgICAgICAnc3Vic2NyaXB0aW9uIG1hcmJsZSBkaWFncmFtLiBUaGVyZSBjYW4gb25seSBiZSBvbmUuJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHN1YnNjcmlwdGlvbkZyYW1lID0gZ3JvdXBTdGFydCA+IC0xID8gZ3JvdXBTdGFydCA6IGZyYW1lO1xuICAgICAgICAgIGFkdmFuY2VGcmFtZUJ5KDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICchJzpcbiAgICAgICAgICBpZiAodW5zdWJzY3JpcHRpb25GcmFtZSAhPT0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZvdW5kIGEgc2Vjb25kIHN1YnNjcmlwdGlvbiBwb2ludCBcXCdeXFwnIGluIGEgJyArXG4gICAgICAgICAgICAgICdzdWJzY3JpcHRpb24gbWFyYmxlIGRpYWdyYW0uIFRoZXJlIGNhbiBvbmx5IGJlIG9uZS4nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdW5zdWJzY3JpcHRpb25GcmFtZSA9IGdyb3VwU3RhcnQgPiAtMSA/IGdyb3VwU3RhcnQgOiBmcmFtZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAvLyB0aW1lIHByb2dyZXNzaW9uIHN5bnRheFxuICAgICAgICAgIGlmIChydW5Nb2RlICYmIGMubWF0Y2goL15bMC05XSQvKSkge1xuICAgICAgICAgICAgLy8gVGltZSBwcm9ncmVzc2lvbiBtdXN0IGJlIHByZWNlZWRlZCBieSBhdCBsZWFzdCBvbmUgc3BhY2VcbiAgICAgICAgICAgIC8vIGlmIGl0J3Mgbm90IGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIGRpYWdyYW1cbiAgICAgICAgICAgIGlmIChpID09PSAwIHx8IG1hcmJsZXNbaSAtIDFdID09PSAnICcpIHtcbiAgICAgICAgICAgICAgY29uc3QgYnVmZmVyID0gbWFyYmxlcy5zbGljZShpKTtcbiAgICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBidWZmZXIubWF0Y2goL14oWzAtOV0rKD86XFwuWzAtOV0rKT8pKG1zfHN8bSkgLyk7XG4gICAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgIGkgKz0gbWF0Y2hbMF0ubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgICBjb25zdCBkdXJhdGlvbiA9IHBhcnNlRmxvYXQobWF0Y2hbMV0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IHVuaXQgPSBtYXRjaFsyXTtcbiAgICAgICAgICAgICAgICBsZXQgZHVyYXRpb25Jbk1zOiBudW1iZXI7XG5cbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHVuaXQpIHtcbiAgICAgICAgICAgICAgICAgIGNhc2UgJ21zJzpcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb25Jbk1zID0gZHVyYXRpb247XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgY2FzZSAncyc6XG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uSW5NcyA9IGR1cmF0aW9uICogMTAwMDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICBjYXNlICdtJzpcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb25Jbk1zID0gZHVyYXRpb24gKiAxMDAwICogNjA7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYWR2YW5jZUZyYW1lQnkoZHVyYXRpb25Jbk1zIC8gdGhpcy5mcmFtZVRpbWVGYWN0b3IpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd0aGVyZSBjYW4gb25seSBiZSBcXCdeXFwnIGFuZCBcXCchXFwnIG1hcmtlcnMgaW4gYSAnICtcbiAgICAgICAgICAgICdzdWJzY3JpcHRpb24gbWFyYmxlIGRpYWdyYW0uIEZvdW5kIGluc3RlYWQgXFwnJyArIGMgKyAnXFwnLicpO1xuICAgICAgfVxuXG4gICAgICBmcmFtZSA9IG5leHRGcmFtZTtcbiAgICB9XG5cbiAgICBpZiAodW5zdWJzY3JpcHRpb25GcmFtZSA8IDApIHtcbiAgICAgIHJldHVybiBuZXcgU3Vic2NyaXB0aW9uTG9nKHN1YnNjcmlwdGlvbkZyYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5ldyBTdWJzY3JpcHRpb25Mb2coc3Vic2NyaXB0aW9uRnJhbWUsIHVuc3Vic2NyaXB0aW9uRnJhbWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAbm9jb2xsYXBzZSAqL1xuICBzdGF0aWMgcGFyc2VNYXJibGVzKG1hcmJsZXM6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM/OiBhbnksXG4gICAgICAgICAgICAgICAgICAgICAgZXJyb3JWYWx1ZT86IGFueSxcbiAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbGl6ZUlubmVyT2JzZXJ2YWJsZXM6IGJvb2xlYW4gPSBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICBydW5Nb2RlID0gZmFsc2UpOiBUZXN0TWVzc2FnZVtdIHtcbiAgICBpZiAobWFyYmxlcy5pbmRleE9mKCchJykgIT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvbnZlbnRpb25hbCBtYXJibGUgZGlhZ3JhbXMgY2Fubm90IGhhdmUgdGhlICcgK1xuICAgICAgICAndW5zdWJzY3JpcHRpb24gbWFya2VyIFwiIVwiJyk7XG4gICAgfVxuICAgIGNvbnN0IGxlbiA9IG1hcmJsZXMubGVuZ3RoO1xuICAgIGNvbnN0IHRlc3RNZXNzYWdlczogVGVzdE1lc3NhZ2VbXSA9IFtdO1xuICAgIGNvbnN0IHN1YkluZGV4ID0gcnVuTW9kZSA/IG1hcmJsZXMucmVwbGFjZSgvXlsgXSsvLCAnJykuaW5kZXhPZignXicpIDogbWFyYmxlcy5pbmRleE9mKCdeJyk7XG4gICAgbGV0IGZyYW1lID0gc3ViSW5kZXggPT09IC0xID8gMCA6IChzdWJJbmRleCAqIC10aGlzLmZyYW1lVGltZUZhY3Rvcik7XG4gICAgY29uc3QgZ2V0VmFsdWUgPSB0eXBlb2YgdmFsdWVzICE9PSAnb2JqZWN0JyA/XG4gICAgICAoeDogYW55KSA9PiB4IDpcbiAgICAgICh4OiBhbnkpID0+IHtcbiAgICAgICAgLy8gU3VwcG9ydCBPYnNlcnZhYmxlLW9mLU9ic2VydmFibGVzXG4gICAgICAgIGlmIChtYXRlcmlhbGl6ZUlubmVyT2JzZXJ2YWJsZXMgJiYgdmFsdWVzW3hdIGluc3RhbmNlb2YgQ29sZE9ic2VydmFibGUpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWVzW3hdLm1lc3NhZ2VzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZXNbeF07XG4gICAgICB9O1xuICAgIGxldCBncm91cFN0YXJ0ID0gLTE7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBsZXQgbmV4dEZyYW1lID0gZnJhbWU7XG4gICAgICBjb25zdCBhZHZhbmNlRnJhbWVCeSA9IChjb3VudDogbnVtYmVyKSA9PiB7XG4gICAgICAgIG5leHRGcmFtZSArPSBjb3VudCAqIHRoaXMuZnJhbWVUaW1lRmFjdG9yO1xuICAgICAgfTtcblxuICAgICAgbGV0IG5vdGlmaWNhdGlvbjogTm90aWZpY2F0aW9uPGFueT47XG4gICAgICBjb25zdCBjID0gbWFyYmxlc1tpXTtcbiAgICAgIHN3aXRjaCAoYykge1xuICAgICAgICBjYXNlICcgJzpcbiAgICAgICAgICAvLyBXaGl0ZXNwYWNlIG5vIGxvbmdlciBhZHZhbmNlcyB0aW1lXG4gICAgICAgICAgaWYgKCFydW5Nb2RlKSB7XG4gICAgICAgICAgICBhZHZhbmNlRnJhbWVCeSgxKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgIGFkdmFuY2VGcmFtZUJ5KDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICcoJzpcbiAgICAgICAgICBncm91cFN0YXJ0ID0gZnJhbWU7XG4gICAgICAgICAgYWR2YW5jZUZyYW1lQnkoMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJyknOlxuICAgICAgICAgIGdyb3VwU3RhcnQgPSAtMTtcbiAgICAgICAgICBhZHZhbmNlRnJhbWVCeSgxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnfCc6XG4gICAgICAgICAgbm90aWZpY2F0aW9uID0gTm90aWZpY2F0aW9uLmNyZWF0ZUNvbXBsZXRlKCk7XG4gICAgICAgICAgYWR2YW5jZUZyYW1lQnkoMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ14nOlxuICAgICAgICAgIGFkdmFuY2VGcmFtZUJ5KDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICcjJzpcbiAgICAgICAgICBub3RpZmljYXRpb24gPSBOb3RpZmljYXRpb24uY3JlYXRlRXJyb3IoZXJyb3JWYWx1ZSB8fCAnZXJyb3InKTtcbiAgICAgICAgICBhZHZhbmNlRnJhbWVCeSgxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAvLyBNaWdodCBiZSB0aW1lIHByb2dyZXNzaW9uIHN5bnRheCwgb3IgYSB2YWx1ZSBsaXRlcmFsXG4gICAgICAgICAgaWYgKHJ1bk1vZGUgJiYgYy5tYXRjaCgvXlswLTldJC8pKSB7XG4gICAgICAgICAgICAvLyBUaW1lIHByb2dyZXNzaW9uIG11c3QgYmUgcHJlY2VlZGVkIGJ5IGF0IGxlYXN0IG9uZSBzcGFjZVxuICAgICAgICAgICAgLy8gaWYgaXQncyBub3QgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgZGlhZ3JhbVxuICAgICAgICAgICAgaWYgKGkgPT09IDAgfHwgbWFyYmxlc1tpIC0gMV0gPT09ICcgJykge1xuICAgICAgICAgICAgICBjb25zdCBidWZmZXIgPSBtYXJibGVzLnNsaWNlKGkpO1xuICAgICAgICAgICAgICBjb25zdCBtYXRjaCA9IGJ1ZmZlci5tYXRjaCgvXihbMC05XSsoPzpcXC5bMC05XSspPykobXN8c3xtKSAvKTtcbiAgICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgaSArPSBtYXRjaFswXS5sZW5ndGggLSAxO1xuICAgICAgICAgICAgICAgIGNvbnN0IGR1cmF0aW9uID0gcGFyc2VGbG9hdChtYXRjaFsxXSk7XG4gICAgICAgICAgICAgICAgY29uc3QgdW5pdCA9IG1hdGNoWzJdO1xuICAgICAgICAgICAgICAgIGxldCBkdXJhdGlvbkluTXM6IG51bWJlcjtcblxuICAgICAgICAgICAgICAgIHN3aXRjaCAodW5pdCkge1xuICAgICAgICAgICAgICAgICAgY2FzZSAnbXMnOlxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbkluTXMgPSBkdXJhdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICBjYXNlICdzJzpcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb25Jbk1zID0gZHVyYXRpb24gKiAxMDAwO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIGNhc2UgJ20nOlxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbkluTXMgPSBkdXJhdGlvbiAqIDEwMDAgKiA2MDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBhZHZhbmNlRnJhbWVCeShkdXJhdGlvbkluTXMgLyB0aGlzLmZyYW1lVGltZUZhY3Rvcik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBub3RpZmljYXRpb24gPSBOb3RpZmljYXRpb24uY3JlYXRlTmV4dChnZXRWYWx1ZShjKSk7XG4gICAgICAgICAgYWR2YW5jZUZyYW1lQnkoMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGlmIChub3RpZmljYXRpb24pIHtcbiAgICAgICAgdGVzdE1lc3NhZ2VzLnB1c2goeyBmcmFtZTogZ3JvdXBTdGFydCA+IC0xID8gZ3JvdXBTdGFydCA6IGZyYW1lLCBub3RpZmljYXRpb24gfSk7XG4gICAgICB9XG5cbiAgICAgIGZyYW1lID0gbmV4dEZyYW1lO1xuICAgIH1cbiAgICByZXR1cm4gdGVzdE1lc3NhZ2VzO1xuICB9XG5cbiAgcnVuPFQ+KGNhbGxiYWNrOiAoaGVscGVyczogUnVuSGVscGVycykgPT4gVCk6IFQge1xuICAgIGNvbnN0IHByZXZGcmFtZVRpbWVGYWN0b3IgPSBUZXN0U2NoZWR1bGVyLmZyYW1lVGltZUZhY3RvcjtcbiAgICBjb25zdCBwcmV2TWF4RnJhbWVzID0gdGhpcy5tYXhGcmFtZXM7XG5cbiAgICBUZXN0U2NoZWR1bGVyLmZyYW1lVGltZUZhY3RvciA9IDE7XG4gICAgdGhpcy5tYXhGcmFtZXMgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG4gICAgdGhpcy5ydW5Nb2RlID0gdHJ1ZTtcbiAgICBBc3luY1NjaGVkdWxlci5kZWxlZ2F0ZSA9IHRoaXM7XG5cbiAgICBjb25zdCBoZWxwZXJzID0ge1xuICAgICAgY29sZDogdGhpcy5jcmVhdGVDb2xkT2JzZXJ2YWJsZS5iaW5kKHRoaXMpLFxuICAgICAgaG90OiB0aGlzLmNyZWF0ZUhvdE9ic2VydmFibGUuYmluZCh0aGlzKSxcbiAgICAgIGZsdXNoOiB0aGlzLmZsdXNoLmJpbmQodGhpcyksXG4gICAgICBleHBlY3RPYnNlcnZhYmxlOiB0aGlzLmV4cGVjdE9ic2VydmFibGUuYmluZCh0aGlzKSxcbiAgICAgIGV4cGVjdFN1YnNjcmlwdGlvbnM6IHRoaXMuZXhwZWN0U3Vic2NyaXB0aW9ucy5iaW5kKHRoaXMpLFxuICAgIH07XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJldCA9IGNhbGxiYWNrKGhlbHBlcnMpO1xuICAgICAgdGhpcy5mbHVzaCgpO1xuICAgICAgcmV0dXJuIHJldDtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgVGVzdFNjaGVkdWxlci5mcmFtZVRpbWVGYWN0b3IgPSBwcmV2RnJhbWVUaW1lRmFjdG9yO1xuICAgICAgdGhpcy5tYXhGcmFtZXMgPSBwcmV2TWF4RnJhbWVzO1xuICAgICAgdGhpcy5ydW5Nb2RlID0gZmFsc2U7XG4gICAgICBBc3luY1NjaGVkdWxlci5kZWxlZ2F0ZSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cbn1cbiJdfQ==