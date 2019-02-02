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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdFNjaGVkdWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL3Rlc3RpbmcvVGVzdFNjaGVkdWxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSw0Q0FBMkM7QUFDM0MsZ0RBQStDO0FBQy9DLG1EQUFrRDtBQUNsRCxpREFBZ0Q7QUFFaEQscURBQW9EO0FBRXBELDBFQUF3RjtBQUN4Riw4REFBNkQ7QUFFN0QsSUFBTSxlQUFlLEdBQVcsR0FBRyxDQUFDO0FBbUJwQztJQUFtQyxpQ0FBb0I7SUFNckQsdUJBQW1CLGVBQStEO1FBQWxGLFlBQ0Usa0JBQU0sb0NBQWEsRUFBRSxlQUFlLENBQUMsU0FDdEM7UUFGa0IscUJBQWUsR0FBZixlQUFlLENBQWdEO1FBTGxFLG9CQUFjLEdBQXlCLEVBQUUsQ0FBQztRQUMxQyxxQkFBZSxHQUEwQixFQUFFLENBQUM7UUFDcEQsZ0JBQVUsR0FBb0IsRUFBRSxDQUFDO1FBQ2pDLGFBQU8sR0FBRyxLQUFLLENBQUM7O0lBSXhCLENBQUM7SUFFRCxrQ0FBVSxHQUFWLFVBQVcsT0FBZTtRQUN4QixJQUFNLE9BQU8sR0FBVyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdDLElBQUksT0FBTyxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBQ2xCLE1BQU0sSUFBSSxLQUFLLENBQUMsNkRBQTZELENBQUMsQ0FBQztTQUNoRjtRQUNELE9BQU8sT0FBTyxHQUFHLGFBQWEsQ0FBQyxlQUFlLENBQUM7SUFDakQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCw0Q0FBb0IsR0FBcEIsVUFBaUMsT0FBZSxFQUFFLE1BQWdDLEVBQUUsS0FBVztRQUM3RixJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFD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RUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUMxQyxHQUFHLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDeEMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUM1QixnQkFBZ0IsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNsRCxtQkFBbUIsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztTQUN6RCxDQUFDO1FBQ0YsSUFBSTtZQUNGLElBQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDYixPQUFPLEdBQUcsQ0FBQztTQUNaO2dCQUFTO1lBQ1IsYUFBYSxDQUFDLGVBQWUsR0FBRyxtQkFBbUIsQ0FBQztZQUNwRCxJQUFJLENBQUMsU0FBUyxHQUFHLGFBQWEsQ0FBQztZQUMvQixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztZQUNyQiwrQkFBYyxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7U0FDckM7SUFDSCxDQUFDO0lBQ0gsb0JBQUM7QUFBRCxDQUFDLEFBblhELENBQW1DLDJDQUFvQixHQW1YdEQ7QUFuWFksc0NBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBOb3RpZmljYXRpb24gfSBmcm9tICcuLi9Ob3RpZmljYXRpb24nO1xuaW1wb3J0IHsgQ29sZE9ic2VydmFibGUgfSBmcm9tICcuL0NvbGRPYnNlcnZhYmxlJztcbmltcG9ydCB7IEhvdE9ic2VydmFibGUgfSBmcm9tICcuL0hvdE9ic2VydmFibGUnO1xuaW1wb3J0IHsgVGVzdE1lc3NhZ2UgfSBmcm9tICcuL1Rlc3RNZXNzYWdlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbkxvZyB9IGZyb20gJy4vU3Vic2NyaXB0aW9uTG9nJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBWaXJ0dWFsVGltZVNjaGVkdWxlciwgVmlydHVhbEFjdGlvbiB9IGZyb20gJy4uL3NjaGVkdWxlci9WaXJ0dWFsVGltZVNjaGVkdWxlcic7XG5pbXBvcnQgeyBBc3luY1NjaGVkdWxlciB9IGZyb20gJy4uL3NjaGVkdWxlci9Bc3luY1NjaGVkdWxlcic7XG5cbmNvbnN0IGRlZmF1bHRNYXhGcmFtZTogbnVtYmVyID0gNzUwO1xuXG5leHBvcnQgaW50ZXJmYWNlIFJ1bkhlbHBlcnMge1xuICBjb2xkOiB0eXBlb2YgVGVzdFNjaGVkdWxlci5wcm90b3R5cGUuY3JlYXRlQ29sZE9ic2VydmFibGU7XG4gIGhvdDogdHlwZW9mIFRlc3RTY2hlZHVsZXIucHJvdG90eXBlLmNyZWF0ZUhvdE9ic2VydmFibGU7XG4gIGZsdXNoOiB0eXBlb2YgVGVzdFNjaGVkdWxlci5wcm90b3R5cGUuZmx1c2g7XG4gIGV4cGVjdE9ic2VydmFibGU6IHR5cGVvZiBUZXN0U2NoZWR1bGVyLnByb3RvdHlwZS5leHBlY3RPYnNlcnZhYmxlO1xuICBleHBlY3RTdWJzY3JpcHRpb25zOiB0eXBlb2YgVGVzdFNjaGVkdWxlci5wcm90b3R5cGUuZXhwZWN0U3Vic2NyaXB0aW9ucztcbn1cblxuaW50ZXJmYWNlIEZsdXNoYWJsZVRlc3Qge1xuICByZWFkeTogYm9vbGVhbjtcbiAgYWN0dWFsPzogYW55W107XG4gIGV4cGVjdGVkPzogYW55W107XG59XG5cbmV4cG9ydCB0eXBlIG9ic2VydmFibGVUb0JlRm4gPSAobWFyYmxlczogc3RyaW5nLCB2YWx1ZXM/OiBhbnksIGVycm9yVmFsdWU/OiBhbnkpID0+IHZvaWQ7XG5leHBvcnQgdHlwZSBzdWJzY3JpcHRpb25Mb2dzVG9CZUZuID0gKG1hcmJsZXM6IHN0cmluZyB8IHN0cmluZ1tdKSA9PiB2b2lkO1xuXG5leHBvcnQgY2xhc3MgVGVzdFNjaGVkdWxlciBleHRlbmRzIFZpcnR1YWxUaW1lU2NoZWR1bGVyIHtcbiAgcHVibGljIHJlYWRvbmx5IGhvdE9ic2VydmFibGVzOiBIb3RPYnNlcnZhYmxlPGFueT5bXSA9IFtdO1xuICBwdWJsaWMgcmVhZG9ubHkgY29sZE9ic2VydmFibGVzOiBDb2xkT2JzZXJ2YWJsZTxhbnk+W10gPSBbXTtcbiAgcHJpdmF0ZSBmbHVzaFRlc3RzOiBGbHVzaGFibGVUZXN0W10gPSBbXTtcbiAgcHJpdmF0ZSBydW5Nb2RlID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGFzc2VydERlZXBFcXVhbDogKGFjdHVhbDogYW55LCBleHBlY3RlZDogYW55KSA9PiBib29sZWFuIHwgdm9pZCkge1xuICAgIHN1cGVyKFZpcnR1YWxBY3Rpb24sIGRlZmF1bHRNYXhGcmFtZSk7XG4gIH1cblxuICBjcmVhdGVUaW1lKG1hcmJsZXM6IHN0cmluZyk6IG51bWJlciB7XG4gICAgY29uc3QgaW5kZXhPZjogbnVtYmVyID0gbWFyYmxlcy5pbmRleE9mKCd8Jyk7XG4gICAgaWYgKGluZGV4T2YgPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hcmJsZSBkaWFncmFtIGZvciB0aW1lIHNob3VsZCBoYXZlIGEgY29tcGxldGlvbiBtYXJrZXIgXCJ8XCInKTtcbiAgICB9XG4gICAgcmV0dXJuIGluZGV4T2YgKiBUZXN0U2NoZWR1bGVyLmZyYW1lVGltZUZhY3RvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gbWFyYmxlcyBBIGRpYWdyYW0gaW4gdGhlIG1hcmJsZSBEU0wuIExldHRlcnMgbWFwIHRvIGtleXMgaW4gYHZhbHVlc2AgaWYgcHJvdmlkZWQuXG4gICAqIEBwYXJhbSB2YWx1ZXMgVmFsdWVzIHRvIHVzZSBmb3IgdGhlIGxldHRlcnMgaW4gYG1hcmJsZXNgLiBJZiBvbW1pdHRlZCwgdGhlIGxldHRlcnMgdGhlbXNlbHZlcyBhcmUgdXNlZC5cbiAgICogQHBhcmFtIGVycm9yIFRoZSBlcnJvciB0byB1c2UgZm9yIHRoZSBgI2AgbWFyYmxlIChpZiBwcmVzZW50KS5cbiAgICovXG4gIGNyZWF0ZUNvbGRPYnNlcnZhYmxlPFQgPSBzdHJpbmc+KG1hcmJsZXM6IHN0cmluZywgdmFsdWVzPzogeyBbbWFyYmxlOiBzdHJpbmddOiBUIH0sIGVycm9yPzogYW55KTogQ29sZE9ic2VydmFibGU8VD4ge1xuICAgIGlmIChtYXJibGVzLmluZGV4T2YoJ14nKSAhPT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY29sZCBvYnNlcnZhYmxlIGNhbm5vdCBoYXZlIHN1YnNjcmlwdGlvbiBvZmZzZXQgXCJeXCInKTtcbiAgICB9XG4gICAgaWYgKG1hcmJsZXMuaW5kZXhPZignIScpICE9PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb2xkIG9ic2VydmFibGUgY2Fubm90IGhhdmUgdW5zdWJzY3JpcHRpb24gbWFya2VyIFwiIVwiJyk7XG4gICAgfVxuICAgIGNvbnN0IG1lc3NhZ2VzID0gVGVzdFNjaGVkdWxlci5wYXJzZU1hcmJsZXMobWFyYmxlcywgdmFsdWVzLCBlcnJvciwgdW5kZWZpbmVkLCB0aGlzLnJ1bk1vZGUpO1xuICAgIGNvbnN0IGNvbGQgPSBuZXcgQ29sZE9ic2VydmFibGU8VD4obWVzc2FnZXMsIHRoaXMpO1xuICAgIHRoaXMuY29sZE9ic2VydmFibGVzLnB1c2goY29sZCk7XG4gICAgcmV0dXJuIGNvbGQ7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIG1hcmJsZXMgQSBkaWFncmFtIGluIHRoZSBtYXJibGUgRFNMLiBMZXR0ZXJzIG1hcCB0byBrZXlzIGluIGB2YWx1ZXNgIGlmIHByb3ZpZGVkLlxuICAgKiBAcGFyYW0gdmFsdWVzIFZhbHVlcyB0byB1c2UgZm9yIHRoZSBsZXR0ZXJzIGluIGBtYXJibGVzYC4gSWYgb21taXR0ZWQsIHRoZSBsZXR0ZXJzIHRoZW1zZWx2ZXMgYXJlIHVzZWQuXG4gICAqIEBwYXJhbSBlcnJvciBUaGUgZXJyb3IgdG8gdXNlIGZvciB0aGUgYCNgIG1hcmJsZSAoaWYgcHJlc2VudCkuXG4gICAqL1xuICBjcmVhdGVIb3RPYnNlcnZhYmxlPFQgPSBzdHJpbmc+KG1hcmJsZXM6IHN0cmluZywgdmFsdWVzPzogeyBbbWFyYmxlOiBzdHJpbmddOiBUIH0sIGVycm9yPzogYW55KTogSG90T2JzZXJ2YWJsZTxUPiB7XG4gICAgaWYgKG1hcmJsZXMuaW5kZXhPZignIScpICE9PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdob3Qgb2JzZXJ2YWJsZSBjYW5ub3QgaGF2ZSB1bnN1YnNjcmlwdGlvbiBtYXJrZXIgXCIhXCInKTtcbiAgICB9XG4gICAgY29uc3QgbWVzc2FnZXMgPSBUZXN0U2NoZWR1bGVyLnBhcnNlTWFyYmxlcyhtYXJibGVzLCB2YWx1ZXMsIGVycm9yLCB1bmRlZmluZWQsIHRoaXMucnVuTW9kZSk7XG4gICAgY29uc3Qgc3ViamVjdCA9IG5ldyBIb3RPYnNlcnZhYmxlPFQ+KG1lc3NhZ2VzLCB0aGlzKTtcbiAgICB0aGlzLmhvdE9ic2VydmFibGVzLnB1c2goc3ViamVjdCk7XG4gICAgcmV0dXJuIHN1YmplY3Q7XG4gIH1cblxuICBwcml2YXRlIG1hdGVyaWFsaXplSW5uZXJPYnNlcnZhYmxlKG9ic2VydmFibGU6IE9ic2VydmFibGU8YW55PixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRlckZyYW1lOiBudW1iZXIpOiBUZXN0TWVzc2FnZVtdIHtcbiAgICBjb25zdCBtZXNzYWdlczogVGVzdE1lc3NhZ2VbXSA9IFtdO1xuICAgIG9ic2VydmFibGUuc3Vic2NyaWJlKCh2YWx1ZSkgPT4ge1xuICAgICAgbWVzc2FnZXMucHVzaCh7IGZyYW1lOiB0aGlzLmZyYW1lIC0gb3V0ZXJGcmFtZSwgbm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb24uY3JlYXRlTmV4dCh2YWx1ZSkgfSk7XG4gICAgfSwgKGVycikgPT4ge1xuICAgICAgbWVzc2FnZXMucHVzaCh7IGZyYW1lOiB0aGlzLmZyYW1lIC0gb3V0ZXJGcmFtZSwgbm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb24uY3JlYXRlRXJyb3IoZXJyKSB9KTtcbiAgICB9LCAoKSA9PiB7XG4gICAgICBtZXNzYWdlcy5wdXNoKHsgZnJhbWU6IHRoaXMuZnJhbWUgLSBvdXRlckZyYW1lLCBub3RpZmljYXRpb246IE5vdGlmaWNhdGlvbi5jcmVhdGVDb21wbGV0ZSgpIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBtZXNzYWdlcztcbiAgfVxuXG4gIGV4cGVjdE9ic2VydmFibGUob2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxhbnk+LFxuICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbk1hcmJsZXM6IHN0cmluZyA9IG51bGwpOiAoeyB0b0JlOiBvYnNlcnZhYmxlVG9CZUZuIH0pIHtcbiAgICBjb25zdCBhY3R1YWw6IFRlc3RNZXNzYWdlW10gPSBbXTtcbiAgICBjb25zdCBmbHVzaFRlc3Q6IEZsdXNoYWJsZVRlc3QgPSB7IGFjdHVhbCwgcmVhZHk6IGZhbHNlIH07XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uUGFyc2VkID0gVGVzdFNjaGVkdWxlci5wYXJzZU1hcmJsZXNBc1N1YnNjcmlwdGlvbnMoc3Vic2NyaXB0aW9uTWFyYmxlcywgdGhpcy5ydW5Nb2RlKTtcbiAgICBjb25zdCBzdWJzY3JpcHRpb25GcmFtZSA9IHN1YnNjcmlwdGlvblBhcnNlZC5zdWJzY3JpYmVkRnJhbWUgPT09IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSA/XG4gICAgICAwIDogc3Vic2NyaXB0aW9uUGFyc2VkLnN1YnNjcmliZWRGcmFtZTtcbiAgICBjb25zdCB1bnN1YnNjcmlwdGlvbkZyYW1lID0gc3Vic2NyaXB0aW9uUGFyc2VkLnVuc3Vic2NyaWJlZEZyYW1lO1xuICAgIGxldCBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAgIHRoaXMuc2NoZWR1bGUoKCkgPT4ge1xuICAgICAgc3Vic2NyaXB0aW9uID0gb2JzZXJ2YWJsZS5zdWJzY3JpYmUoeCA9PiB7XG4gICAgICAgIGxldCB2YWx1ZSA9IHg7XG4gICAgICAgIC8vIFN1cHBvcnQgT2JzZXJ2YWJsZS1vZi1PYnNlcnZhYmxlc1xuICAgICAgICBpZiAoeCBpbnN0YW5jZW9mIE9ic2VydmFibGUpIHtcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMubWF0ZXJpYWxpemVJbm5lck9ic2VydmFibGUodmFsdWUsIHRoaXMuZnJhbWUpO1xuICAgICAgICB9XG4gICAgICAgIGFjdHVhbC5wdXNoKHsgZnJhbWU6IHRoaXMuZnJhbWUsIG5vdGlmaWNhdGlvbjogTm90aWZpY2F0aW9uLmNyZWF0ZU5leHQodmFsdWUpIH0pO1xuICAgICAgfSwgKGVycikgPT4ge1xuICAgICAgICBhY3R1YWwucHVzaCh7IGZyYW1lOiB0aGlzLmZyYW1lLCBub3RpZmljYXRpb246IE5vdGlmaWNhdGlvbi5jcmVhdGVFcnJvcihlcnIpIH0pO1xuICAgICAgfSwgKCkgPT4ge1xuICAgICAgICBhY3R1YWwucHVzaCh7IGZyYW1lOiB0aGlzLmZyYW1lLCBub3RpZmljYXRpb246IE5vdGlmaWNhdGlvbi5jcmVhdGVDb21wbGV0ZSgpIH0pO1xuICAgICAgfSk7XG4gICAgfSwgc3Vic2NyaXB0aW9uRnJhbWUpO1xuXG4gICAgaWYgKHVuc3Vic2NyaXB0aW9uRnJhbWUgIT09IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSkge1xuICAgICAgdGhpcy5zY2hlZHVsZSgoKSA9PiBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKSwgdW5zdWJzY3JpcHRpb25GcmFtZSk7XG4gICAgfVxuXG4gICAgdGhpcy5mbHVzaFRlc3RzLnB1c2goZmx1c2hUZXN0KTtcbiAgICBjb25zdCB7IHJ1bk1vZGUgfSA9IHRoaXM7XG5cbiAgICByZXR1cm4ge1xuICAgICAgdG9CZShtYXJibGVzOiBzdHJpbmcsIHZhbHVlcz86IGFueSwgZXJyb3JWYWx1ZT86IGFueSkge1xuICAgICAgICBmbHVzaFRlc3QucmVhZHkgPSB0cnVlO1xuICAgICAgICBmbHVzaFRlc3QuZXhwZWN0ZWQgPSBUZXN0U2NoZWR1bGVyLnBhcnNlTWFyYmxlcyhtYXJibGVzLCB2YWx1ZXMsIGVycm9yVmFsdWUsIHRydWUsIHJ1bk1vZGUpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBleHBlY3RTdWJzY3JpcHRpb25zKGFjdHVhbFN1YnNjcmlwdGlvbkxvZ3M6IFN1YnNjcmlwdGlvbkxvZ1tdKTogKHsgdG9CZTogc3Vic2NyaXB0aW9uTG9nc1RvQmVGbiB9KSB7XG4gICAgY29uc3QgZmx1c2hUZXN0OiBGbHVzaGFibGVUZXN0ID0geyBhY3R1YWw6IGFjdHVhbFN1YnNjcmlwdGlvbkxvZ3MsIHJlYWR5OiBmYWxzZSB9O1xuICAgIHRoaXMuZmx1c2hUZXN0cy5wdXNoKGZsdXNoVGVzdCk7XG4gICAgY29uc3QgeyBydW5Nb2RlIH0gPSB0aGlzO1xuICAgIHJldHVybiB7XG4gICAgICB0b0JlKG1hcmJsZXM6IHN0cmluZyB8IHN0cmluZ1tdKSB7XG4gICAgICAgIGNvbnN0IG1hcmJsZXNBcnJheTogc3RyaW5nW10gPSAodHlwZW9mIG1hcmJsZXMgPT09ICdzdHJpbmcnKSA/IFttYXJibGVzXSA6IG1hcmJsZXM7XG4gICAgICAgIGZsdXNoVGVzdC5yZWFkeSA9IHRydWU7XG4gICAgICAgIGZsdXNoVGVzdC5leHBlY3RlZCA9IG1hcmJsZXNBcnJheS5tYXAobWFyYmxlcyA9PlxuICAgICAgICAgIFRlc3RTY2hlZHVsZXIucGFyc2VNYXJibGVzQXNTdWJzY3JpcHRpb25zKG1hcmJsZXMsIHJ1bk1vZGUpXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGZsdXNoKCkge1xuICAgIGNvbnN0IGhvdE9ic2VydmFibGVzID0gdGhpcy5ob3RPYnNlcnZhYmxlcztcbiAgICB3aGlsZSAoaG90T2JzZXJ2YWJsZXMubGVuZ3RoID4gMCkge1xuICAgICAgaG90T2JzZXJ2YWJsZXMuc2hpZnQoKS5zZXR1cCgpO1xuICAgIH1cblxuICAgIHN1cGVyLmZsdXNoKCk7XG5cbiAgICB0aGlzLmZsdXNoVGVzdHMgPSB0aGlzLmZsdXNoVGVzdHMuZmlsdGVyKHRlc3QgPT4ge1xuICAgICAgaWYgKHRlc3QucmVhZHkpIHtcbiAgICAgICAgdGhpcy5hc3NlcnREZWVwRXF1YWwodGVzdC5hY3R1YWwsIHRlc3QuZXhwZWN0ZWQpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBAbm9jb2xsYXBzZSAqL1xuICBzdGF0aWMgcGFyc2VNYXJibGVzQXNTdWJzY3JpcHRpb25zKG1hcmJsZXM6IHN0cmluZywgcnVuTW9kZSA9IGZhbHNlKTogU3Vic2NyaXB0aW9uTG9nIHtcbiAgICBpZiAodHlwZW9mIG1hcmJsZXMgIT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gbmV3IFN1YnNjcmlwdGlvbkxvZyhOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkpO1xuICAgIH1cbiAgICBjb25zdCBsZW4gPSBtYXJibGVzLmxlbmd0aDtcbiAgICBsZXQgZ3JvdXBTdGFydCA9IC0xO1xuICAgIGxldCBzdWJzY3JpcHRpb25GcmFtZSA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbiAgICBsZXQgdW5zdWJzY3JpcHRpb25GcmFtZSA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbiAgICBsZXQgZnJhbWUgPSAwO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgbGV0IG5leHRGcmFtZSA9IGZyYW1lO1xuICAgICAgY29uc3QgYWR2YW5jZUZyYW1lQnkgPSAoY291bnQ6IG51bWJlcikgPT4ge1xuICAgICAgICBuZXh0RnJhbWUgKz0gY291bnQgKiB0aGlzLmZyYW1lVGltZUZhY3RvcjtcbiAgICAgIH07XG4gICAgICBjb25zdCBjID0gbWFyYmxlc1tpXTtcbiAgICAgIHN3aXRjaCAoYykge1xuICAgICAgICBjYXNlICcgJzpcbiAgICAgICAgICAvLyBXaGl0ZXNwYWNlIG5vIGxvbmdlciBhZHZhbmNlcyB0aW1lXG4gICAgICAgICAgaWYgKCFydW5Nb2RlKSB7XG4gICAgICAgICAgICBhZHZhbmNlRnJhbWVCeSgxKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgIGFkdmFuY2VGcmFtZUJ5KDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICcoJzpcbiAgICAgICAgICBncm91cFN0YXJ0ID0gZnJhbWU7XG4gICAgICAgICAgYWR2YW5jZUZyYW1lQnkoMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJyknOlxuICAgICAgICAgIGdyb3VwU3RhcnQgPSAtMTtcbiAgICAgICAgICBhZHZhbmNlRnJhbWVCeSgxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnXic6XG4gICAgICAgICAgaWYgKHN1YnNjcmlwdGlvbkZyYW1lICE9PSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZm91bmQgYSBzZWNvbmQgc3Vic2NyaXB0aW9uIHBvaW50IFxcJ15cXCcgaW4gYSAnICtcbiAgICAgICAgICAgICAgJ3N1YnNjcmlwdGlvbiBtYXJibGUgZGlhZ3JhbS4gVGhlcmUgY2FuIG9ubHkgYmUgb25lLicpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzdWJzY3JpcHRpb25GcmFtZSA9IGdyb3VwU3RhcnQgPiAtMSA/IGdyb3VwU3RhcnQgOiBmcmFtZTtcbiAgICAgICAgICBhZHZhbmNlRnJhbWVCeSgxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnISc6XG4gICAgICAgICAgaWYgKHVuc3Vic2NyaXB0aW9uRnJhbWUgIT09IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdmb3VuZCBhIHNlY29uZCBzdWJzY3JpcHRpb24gcG9pbnQgXFwnXlxcJyBpbiBhICcgK1xuICAgICAgICAgICAgICAnc3Vic2NyaXB0aW9uIG1hcmJsZSBkaWFncmFtLiBUaGVyZSBjYW4gb25seSBiZSBvbmUuJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHVuc3Vic2NyaXB0aW9uRnJhbWUgPSBncm91cFN0YXJ0ID4gLTEgPyBncm91cFN0YXJ0IDogZnJhbWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgLy8gdGltZSBwcm9ncmVzc2lvbiBzeW50YXhcbiAgICAgICAgICBpZiAocnVuTW9kZSAmJiBjLm1hdGNoKC9eWzAtOV0kLykpIHtcbiAgICAgICAgICAgIC8vIFRpbWUgcHJvZ3Jlc3Npb24gbXVzdCBiZSBwcmVjZWVkZWQgYnkgYXQgbGVhc3Qgb25lIHNwYWNlXG4gICAgICAgICAgICAvLyBpZiBpdCdzIG5vdCBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBkaWFncmFtXG4gICAgICAgICAgICBpZiAoaSA9PT0gMCB8fCBtYXJibGVzW2kgLSAxXSA9PT0gJyAnKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGJ1ZmZlciA9IG1hcmJsZXMuc2xpY2UoaSk7XG4gICAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gYnVmZmVyLm1hdGNoKC9eKFswLTldKyg/OlxcLlswLTldKyk/KShtc3xzfG0pIC8pO1xuICAgICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICBpICs9IG1hdGNoWzBdLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICAgICAgY29uc3QgZHVyYXRpb24gPSBwYXJzZUZsb2F0KG1hdGNoWzFdKTtcbiAgICAgICAgICAgICAgICBjb25zdCB1bml0ID0gbWF0Y2hbMl07XG4gICAgICAgICAgICAgICAgbGV0IGR1cmF0aW9uSW5NczogbnVtYmVyO1xuXG4gICAgICAgICAgICAgICAgc3dpdGNoICh1bml0KSB7XG4gICAgICAgICAgICAgICAgICBjYXNlICdtcyc6XG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uSW5NcyA9IGR1cmF0aW9uO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIGNhc2UgJ3MnOlxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbkluTXMgPSBkdXJhdGlvbiAqIDEwMDA7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgY2FzZSAnbSc6XG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uSW5NcyA9IGR1cmF0aW9uICogMTAwMCAqIDYwO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGFkdmFuY2VGcmFtZUJ5KGR1cmF0aW9uSW5NcyAvIHRoaXMuZnJhbWVUaW1lRmFjdG9yKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcigndGhlcmUgY2FuIG9ubHkgYmUgXFwnXlxcJyBhbmQgXFwnIVxcJyBtYXJrZXJzIGluIGEgJyArXG4gICAgICAgICAgICAnc3Vic2NyaXB0aW9uIG1hcmJsZSBkaWFncmFtLiBGb3VuZCBpbnN0ZWFkIFxcJycgKyBjICsgJ1xcJy4nKTtcbiAgICAgIH1cblxuICAgICAgZnJhbWUgPSBuZXh0RnJhbWU7XG4gICAgfVxuXG4gICAgaWYgKHVuc3Vic2NyaXB0aW9uRnJhbWUgPCAwKSB7XG4gICAgICByZXR1cm4gbmV3IFN1YnNjcmlwdGlvbkxvZyhzdWJzY3JpcHRpb25GcmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgU3Vic2NyaXB0aW9uTG9nKHN1YnNjcmlwdGlvbkZyYW1lLCB1bnN1YnNjcmlwdGlvbkZyYW1lKTtcbiAgICB9XG4gIH1cblxuICAvKiogQG5vY29sbGFwc2UgKi9cbiAgc3RhdGljIHBhcnNlTWFyYmxlcyhtYXJibGVzOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWVzPzogYW55LFxuICAgICAgICAgICAgICAgICAgICAgIGVycm9yVmFsdWU/OiBhbnksXG4gICAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWxpemVJbm5lck9ic2VydmFibGVzOiBib29sZWFuID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgcnVuTW9kZSA9IGZhbHNlKTogVGVzdE1lc3NhZ2VbXSB7XG4gICAgaWYgKG1hcmJsZXMuaW5kZXhPZignIScpICE9PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb252ZW50aW9uYWwgbWFyYmxlIGRpYWdyYW1zIGNhbm5vdCBoYXZlIHRoZSAnICtcbiAgICAgICAgJ3Vuc3Vic2NyaXB0aW9uIG1hcmtlciBcIiFcIicpO1xuICAgIH1cbiAgICBjb25zdCBsZW4gPSBtYXJibGVzLmxlbmd0aDtcbiAgICBjb25zdCB0ZXN0TWVzc2FnZXM6IFRlc3RNZXNzYWdlW10gPSBbXTtcbiAgICBjb25zdCBzdWJJbmRleCA9IHJ1bk1vZGUgPyBtYXJibGVzLnJlcGxhY2UoL15bIF0rLywgJycpLmluZGV4T2YoJ14nKSA6IG1hcmJsZXMuaW5kZXhPZignXicpO1xuICAgIGxldCBmcmFtZSA9IHN1YkluZGV4ID09PSAtMSA/IDAgOiAoc3ViSW5kZXggKiAtdGhpcy5mcmFtZVRpbWVGYWN0b3IpO1xuICAgIGNvbnN0IGdldFZhbHVlID0gdHlwZW9mIHZhbHVlcyAhPT0gJ29iamVjdCcgP1xuICAgICAgKHg6IGFueSkgPT4geCA6XG4gICAgICAoeDogYW55KSA9PiB7XG4gICAgICAgIC8vIFN1cHBvcnQgT2JzZXJ2YWJsZS1vZi1PYnNlcnZhYmxlc1xuICAgICAgICBpZiAobWF0ZXJpYWxpemVJbm5lck9ic2VydmFibGVzICYmIHZhbHVlc1t4XSBpbnN0YW5jZW9mIENvbGRPYnNlcnZhYmxlKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlc1t4XS5tZXNzYWdlcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWVzW3hdO1xuICAgICAgfTtcbiAgICBsZXQgZ3JvdXBTdGFydCA9IC0xO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgbGV0IG5leHRGcmFtZSA9IGZyYW1lO1xuICAgICAgY29uc3QgYWR2YW5jZUZyYW1lQnkgPSAoY291bnQ6IG51bWJlcikgPT4ge1xuICAgICAgICBuZXh0RnJhbWUgKz0gY291bnQgKiB0aGlzLmZyYW1lVGltZUZhY3RvcjtcbiAgICAgIH07XG5cbiAgICAgIGxldCBub3RpZmljYXRpb246IE5vdGlmaWNhdGlvbjxhbnk+O1xuICAgICAgY29uc3QgYyA9IG1hcmJsZXNbaV07XG4gICAgICBzd2l0Y2ggKGMpIHtcbiAgICAgICAgY2FzZSAnICc6XG4gICAgICAgICAgLy8gV2hpdGVzcGFjZSBubyBsb25nZXIgYWR2YW5jZXMgdGltZVxuICAgICAgICAgIGlmICghcnVuTW9kZSkge1xuICAgICAgICAgICAgYWR2YW5jZUZyYW1lQnkoMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICBhZHZhbmNlRnJhbWVCeSgxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnKCc6XG4gICAgICAgICAgZ3JvdXBTdGFydCA9IGZyYW1lO1xuICAgICAgICAgIGFkdmFuY2VGcmFtZUJ5KDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICcpJzpcbiAgICAgICAgICBncm91cFN0YXJ0ID0gLTE7XG4gICAgICAgICAgYWR2YW5jZUZyYW1lQnkoMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3wnOlxuICAgICAgICAgIG5vdGlmaWNhdGlvbiA9IE5vdGlmaWNhdGlvbi5jcmVhdGVDb21wbGV0ZSgpO1xuICAgICAgICAgIGFkdmFuY2VGcmFtZUJ5KDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdeJzpcbiAgICAgICAgICBhZHZhbmNlRnJhbWVCeSgxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnIyc6XG4gICAgICAgICAgbm90aWZpY2F0aW9uID0gTm90aWZpY2F0aW9uLmNyZWF0ZUVycm9yKGVycm9yVmFsdWUgfHwgJ2Vycm9yJyk7XG4gICAgICAgICAgYWR2YW5jZUZyYW1lQnkoMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgLy8gTWlnaHQgYmUgdGltZSBwcm9ncmVzc2lvbiBzeW50YXgsIG9yIGEgdmFsdWUgbGl0ZXJhbFxuICAgICAgICAgIGlmIChydW5Nb2RlICYmIGMubWF0Y2goL15bMC05XSQvKSkge1xuICAgICAgICAgICAgLy8gVGltZSBwcm9ncmVzc2lvbiBtdXN0IGJlIHByZWNlZWRlZCBieSBhdCBsZWFzdCBvbmUgc3BhY2VcbiAgICAgICAgICAgIC8vIGlmIGl0J3Mgbm90IGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIGRpYWdyYW1cbiAgICAgICAgICAgIGlmIChpID09PSAwIHx8IG1hcmJsZXNbaSAtIDFdID09PSAnICcpIHtcbiAgICAgICAgICAgICAgY29uc3QgYnVmZmVyID0gbWFyYmxlcy5zbGljZShpKTtcbiAgICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBidWZmZXIubWF0Y2goL14oWzAtOV0rKD86XFwuWzAtOV0rKT8pKG1zfHN8bSkgLyk7XG4gICAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgIGkgKz0gbWF0Y2hbMF0ubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgICBjb25zdCBkdXJhdGlvbiA9IHBhcnNlRmxvYXQobWF0Y2hbMV0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IHVuaXQgPSBtYXRjaFsyXTtcbiAgICAgICAgICAgICAgICBsZXQgZHVyYXRpb25Jbk1zOiBudW1iZXI7XG5cbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHVuaXQpIHtcbiAgICAgICAgICAgICAgICAgIGNhc2UgJ21zJzpcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb25Jbk1zID0gZHVyYXRpb247XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgY2FzZSAncyc6XG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uSW5NcyA9IGR1cmF0aW9uICogMTAwMDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICBjYXNlICdtJzpcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb25Jbk1zID0gZHVyYXRpb24gKiAxMDAwICogNjA7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYWR2YW5jZUZyYW1lQnkoZHVyYXRpb25Jbk1zIC8gdGhpcy5mcmFtZVRpbWVGYWN0b3IpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbm90aWZpY2F0aW9uID0gTm90aWZpY2F0aW9uLmNyZWF0ZU5leHQoZ2V0VmFsdWUoYykpO1xuICAgICAgICAgIGFkdmFuY2VGcmFtZUJ5KDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBpZiAobm90aWZpY2F0aW9uKSB7XG4gICAgICAgIHRlc3RNZXNzYWdlcy5wdXNoKHsgZnJhbWU6IGdyb3VwU3RhcnQgPiAtMSA/IGdyb3VwU3RhcnQgOiBmcmFtZSwgbm90aWZpY2F0aW9uIH0pO1xuICAgICAgfVxuXG4gICAgICBmcmFtZSA9IG5leHRGcmFtZTtcbiAgICB9XG4gICAgcmV0dXJuIHRlc3RNZXNzYWdlcztcbiAgfVxuXG4gIHJ1bjxUPihjYWxsYmFjazogKGhlbHBlcnM6IFJ1bkhlbHBlcnMpID0+IFQpOiBUIHtcbiAgICBjb25zdCBwcmV2RnJhbWVUaW1lRmFjdG9yID0gVGVzdFNjaGVkdWxlci5mcmFtZVRpbWVGYWN0b3I7XG4gICAgY29uc3QgcHJldk1heEZyYW1lcyA9IHRoaXMubWF4RnJhbWVzO1xuXG4gICAgVGVzdFNjaGVkdWxlci5mcmFtZVRpbWVGYWN0b3IgPSAxO1xuICAgIHRoaXMubWF4RnJhbWVzID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuICAgIHRoaXMucnVuTW9kZSA9IHRydWU7XG4gICAgQXN5bmNTY2hlZHVsZXIuZGVsZWdhdGUgPSB0aGlzO1xuXG4gICAgY29uc3QgaGVscGVycyA9IHtcbiAgICAgIGNvbGQ6IHRoaXMuY3JlYXRlQ29sZE9ic2VydmFibGUuYmluZCh0aGlzKSxcbiAgICAgIGhvdDogdGhpcy5jcmVhdGVIb3RPYnNlcnZhYmxlLmJpbmQodGhpcyksXG4gICAgICBmbHVzaDogdGhpcy5mbHVzaC5iaW5kKHRoaXMpLFxuICAgICAgZXhwZWN0T2JzZXJ2YWJsZTogdGhpcy5leHBlY3RPYnNlcnZhYmxlLmJpbmQodGhpcyksXG4gICAgICBleHBlY3RTdWJzY3JpcHRpb25zOiB0aGlzLmV4cGVjdFN1YnNjcmlwdGlvbnMuYmluZCh0aGlzKSxcbiAgICB9O1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXQgPSBjYWxsYmFjayhoZWxwZXJzKTtcbiAgICAgIHRoaXMuZmx1c2goKTtcbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIFRlc3RTY2hlZHVsZXIuZnJhbWVUaW1lRmFjdG9yID0gcHJldkZyYW1lVGltZUZhY3RvcjtcbiAgICAgIHRoaXMubWF4RnJhbWVzID0gcHJldk1heEZyYW1lcztcbiAgICAgIHRoaXMucnVuTW9kZSA9IGZhbHNlO1xuICAgICAgQXN5bmNTY2hlZHVsZXIuZGVsZWdhdGUgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG59XG4iXX0=