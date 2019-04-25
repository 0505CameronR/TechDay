import { Observable } from '../Observable';
import { Notification } from '../Notification';
import { ColdObservable } from './ColdObservable';
import { HotObservable } from './HotObservable';
import { SubscriptionLog } from './SubscriptionLog';
import { VirtualTimeScheduler, VirtualAction } from '../scheduler/VirtualTimeScheduler';
import { AsyncScheduler } from '../scheduler/AsyncScheduler';
const defaultMaxFrame = 750;
export class TestScheduler extends VirtualTimeScheduler {
    constructor(assertDeepEqual) {
        super(VirtualAction, defaultMaxFrame);
        this.assertDeepEqual = assertDeepEqual;
        this.hotObservables = [];
        this.coldObservables = [];
        this.flushTests = [];
        this.runMode = false;
    }
    createTime(marbles) {
        const indexOf = marbles.indexOf('|');
        if (indexOf === -1) {
            throw new Error('marble diagram for time should have a completion marker "|"');
        }
        return indexOf * TestScheduler.frameTimeFactor;
    }
    /**
     * @param marbles A diagram in the marble DSL. Letters map to keys in `values` if provided.
     * @param values Values to use for the letters in `marbles`. If ommitted, the letters themselves are used.
     * @param error The error to use for the `#` marble (if present).
     */
    createColdObservable(marbles, values, error) {
        if (marbles.indexOf('^') !== -1) {
            throw new Error('cold observable cannot have subscription offset "^"');
        }
        if (marbles.indexOf('!') !== -1) {
            throw new Error('cold observable cannot have unsubscription marker "!"');
        }
        const messages = TestScheduler.parseMarbles(marbles, values, error, undefined, this.runMode);
        const cold = new ColdObservable(messages, this);
        this.coldObservables.push(cold);
        return cold;
    }
    /**
     * @param marbles A diagram in the marble DSL. Letters map to keys in `values` if provided.
     * @param values Values to use for the letters in `marbles`. If ommitted, the letters themselves are used.
     * @param error The error to use for the `#` marble (if present).
     */
    createHotObservable(marbles, values, error) {
        if (marbles.indexOf('!') !== -1) {
            throw new Error('hot observable cannot have unsubscription marker "!"');
        }
        const messages = TestScheduler.parseMarbles(marbles, values, error, undefined, this.runMode);
        const subject = new HotObservable(messages, this);
        this.hotObservables.push(subject);
        return subject;
    }
    materializeInnerObservable(observable, outerFrame) {
        const messages = [];
        observable.subscribe((value) => {
            messages.push({ frame: this.frame - outerFrame, notification: Notification.createNext(value) });
        }, (err) => {
            messages.push({ frame: this.frame - outerFrame, notification: Notification.createError(err) });
        }, () => {
            messages.push({ frame: this.frame - outerFrame, notification: Notification.createComplete() });
        });
        return messages;
    }
    expectObservable(observable, subscriptionMarbles = null) {
        const actual = [];
        const flushTest = { actual, ready: false };
        const subscriptionParsed = TestScheduler.parseMarblesAsSubscriptions(subscriptionMarbles, this.runMode);
        const subscriptionFrame = subscriptionParsed.subscribedFrame === Number.POSITIVE_INFINITY ?
            0 : subscriptionParsed.subscribedFrame;
        const unsubscriptionFrame = subscriptionParsed.unsubscribedFrame;
        let subscription;
        this.schedule(() => {
            subscription = observable.subscribe(x => {
                let value = x;
                // Support Observable-of-Observables
                if (x instanceof Observable) {
                    value = this.materializeInnerObservable(value, this.frame);
                }
                actual.push({ frame: this.frame, notification: Notification.createNext(value) });
            }, (err) => {
                actual.push({ frame: this.frame, notification: Notification.createError(err) });
            }, () => {
                actual.push({ frame: this.frame, notification: Notification.createComplete() });
            });
        }, subscriptionFrame);
        if (unsubscriptionFrame !== Number.POSITIVE_INFINITY) {
            this.schedule(() => subscription.unsubscribe(), unsubscriptionFrame);
        }
        this.flushTests.push(flushTest);
        const { runMode } = this;
        return {
            toBe(marbles, values, errorValue) {
                flushTest.ready = true;
                flushTest.expected = TestScheduler.parseMarbles(marbles, values, errorValue, true, runMode);
            }
        };
    }
    expectSubscriptions(actualSubscriptionLogs) {
        const flushTest = { actual: actualSubscriptionLogs, ready: false };
        this.flushTests.push(flushTest);
        const { runMode } = this;
        return {
            toBe(marbles) {
                const marblesArray = (typeof marbles === 'string') ? [marbles] : marbles;
                flushTest.ready = true;
                flushTest.expected = marblesArray.map(marbles => TestScheduler.parseMarblesAsSubscriptions(marbles, runMode));
            }
        };
    }
    flush() {
        const hotObservables = this.hotObservables;
        while (hotObservables.length > 0) {
            hotObservables.shift().setup();
        }
        super.flush();
        this.flushTests = this.flushTests.filter(test => {
            if (test.ready) {
                this.assertDeepEqual(test.actual, test.expected);
                return false;
            }
            return true;
        });
    }
    /** @nocollapse */
    static parseMarblesAsSubscriptions(marbles, runMode = false) {
        if (typeof marbles !== 'string') {
            return new SubscriptionLog(Number.POSITIVE_INFINITY);
        }
        const len = marbles.length;
        let groupStart = -1;
        let subscriptionFrame = Number.POSITIVE_INFINITY;
        let unsubscriptionFrame = Number.POSITIVE_INFINITY;
        let frame = 0;
        for (let i = 0; i < len; i++) {
            let nextFrame = frame;
            const advanceFrameBy = (count) => {
                nextFrame += count * this.frameTimeFactor;
            };
            const c = marbles[i];
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
                            const buffer = marbles.slice(i);
                            const match = buffer.match(/^([0-9]+(?:\.[0-9]+)?)(ms|s|m) /);
                            if (match) {
                                i += match[0].length - 1;
                                const duration = parseFloat(match[1]);
                                const unit = match[2];
                                let durationInMs;
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
                                advanceFrameBy(durationInMs / this.frameTimeFactor);
                                break;
                            }
                        }
                    }
                    throw new Error('there can only be \'^\' and \'!\' markers in a ' +
                        'subscription marble diagram. Found instead \'' + c + '\'.');
            }
            frame = nextFrame;
        }
        if (unsubscriptionFrame < 0) {
            return new SubscriptionLog(subscriptionFrame);
        }
        else {
            return new SubscriptionLog(subscriptionFrame, unsubscriptionFrame);
        }
    }
    /** @nocollapse */
    static parseMarbles(marbles, values, errorValue, materializeInnerObservables = false, runMode = false) {
        if (marbles.indexOf('!') !== -1) {
            throw new Error('conventional marble diagrams cannot have the ' +
                'unsubscription marker "!"');
        }
        const len = marbles.length;
        const testMessages = [];
        const subIndex = runMode ? marbles.replace(/^[ ]+/, '').indexOf('^') : marbles.indexOf('^');
        let frame = subIndex === -1 ? 0 : (subIndex * -this.frameTimeFactor);
        const getValue = typeof values !== 'object' ?
            (x) => x :
            (x) => {
                // Support Observable-of-Observables
                if (materializeInnerObservables && values[x] instanceof ColdObservable) {
                    return values[x].messages;
                }
                return values[x];
            };
        let groupStart = -1;
        for (let i = 0; i < len; i++) {
            let nextFrame = frame;
            const advanceFrameBy = (count) => {
                nextFrame += count * this.frameTimeFactor;
            };
            let notification;
            const c = marbles[i];
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
                    notification = Notification.createComplete();
                    advanceFrameBy(1);
                    break;
                case '^':
                    advanceFrameBy(1);
                    break;
                case '#':
                    notification = Notification.createError(errorValue || 'error');
                    advanceFrameBy(1);
                    break;
                default:
                    // Might be time progression syntax, or a value literal
                    if (runMode && c.match(/^[0-9]$/)) {
                        // Time progression must be preceeded by at least one space
                        // if it's not at the beginning of the diagram
                        if (i === 0 || marbles[i - 1] === ' ') {
                            const buffer = marbles.slice(i);
                            const match = buffer.match(/^([0-9]+(?:\.[0-9]+)?)(ms|s|m) /);
                            if (match) {
                                i += match[0].length - 1;
                                const duration = parseFloat(match[1]);
                                const unit = match[2];
                                let durationInMs;
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
                                advanceFrameBy(durationInMs / this.frameTimeFactor);
                                break;
                            }
                        }
                    }
                    notification = Notification.createNext(getValue(c));
                    advanceFrameBy(1);
                    break;
            }
            if (notification) {
                testMessages.push({ frame: groupStart > -1 ? groupStart : frame, notification });
            }
            frame = nextFrame;
        }
        return testMessages;
    }
    run(callback) {
        const prevFrameTimeFactor = TestScheduler.frameTimeFactor;
        const prevMaxFrames = this.maxFrames;
        TestScheduler.frameTimeFactor = 1;
        this.maxFrames = Number.POSITIVE_INFINITY;
        this.runMode = true;
        AsyncScheduler.delegate = this;
        const helpers = {
            cold: this.createColdObservable.bind(this),
            hot: this.createHotObservable.bind(this),
            flush: this.flush.bind(this),
            expectObservable: this.expectObservable.bind(this),
            expectSubscriptions: this.expectSubscriptions.bind(this),
        };
        try {
            const ret = callback(helpers);
            this.flush();
            return ret;
        }
        finally {
            TestScheduler.frameTimeFactor = prevFrameTimeFactor;
            this.maxFrames = prevMaxFrames;
            this.runMode = false;
            AsyncScheduler.delegate = undefined;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdFNjaGVkdWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lb3MvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL3Rlc3RpbmcvVGVzdFNjaGVkdWxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDbEQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRWhELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUVwRCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsYUFBYSxFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDeEYsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBRTdELE1BQU0sZUFBZSxHQUFXLEdBQUcsQ0FBQztBQW1CcEMsTUFBTSxPQUFPLGFBQWMsU0FBUSxvQkFBb0I7SUFNckQsWUFBbUIsZUFBK0Q7UUFDaEYsS0FBSyxDQUFDLGFBQWEsRUFBRSxlQUFlLENBQUMsQ0FBQztRQURyQixvQkFBZSxHQUFmLGVBQWUsQ0FBZ0Q7UUFMbEUsbUJBQWMsR0FBeUIsRUFBRSxDQUFDO1FBQzFDLG9CQUFlLEdBQTBCLEVBQUUsQ0FBQztRQUNwRCxlQUFVLEdBQW9CLEVBQUUsQ0FBQztRQUNqQyxZQUFPLEdBQUcsS0FBSyxDQUFDO0lBSXhCLENBQUM7SUFFRCxVQUFVLENBQUMsT0FBZTtRQUN4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LEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDO1FBQzFDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLGNBQWMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBRS9CLE1BQU0sT0FBTyxHQUFHO1lBQ2QsSUFBSSxFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQzFDLEdBQUcsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUN4QyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQzVCLGdCQUFnQixFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ2xELG1CQUFtQixFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1NBQ3pELENBQUM7UUFDRixJQUFJO1lBQ0YsTUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNiLE9BQU8sR0FBRyxDQUFDO1NBQ1o7Z0JBQVM7WUFDUixhQUFhLENBQUMsZUFBZSxHQUFHLG1CQUFtQixDQUFDO1lBQ3BELElBQUksQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFDO1lBQy9CLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1lBQ3JCLGNBQWMsQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO1NBQ3JDO0lBQ0gsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgTm90aWZpY2F0aW9uIH0gZnJvbSAnLi4vTm90aWZpY2F0aW9uJztcbmltcG9ydCB7IENvbGRPYnNlcnZhYmxlIH0gZnJvbSAnLi9Db2xkT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBIb3RPYnNlcnZhYmxlIH0gZnJvbSAnLi9Ib3RPYnNlcnZhYmxlJztcbmltcG9ydCB7IFRlc3RNZXNzYWdlIH0gZnJvbSAnLi9UZXN0TWVzc2FnZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb25Mb2cgfSBmcm9tICcuL1N1YnNjcmlwdGlvbkxvZyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgVmlydHVhbFRpbWVTY2hlZHVsZXIsIFZpcnR1YWxBY3Rpb24gfSBmcm9tICcuLi9zY2hlZHVsZXIvVmlydHVhbFRpbWVTY2hlZHVsZXInO1xuaW1wb3J0IHsgQXN5bmNTY2hlZHVsZXIgfSBmcm9tICcuLi9zY2hlZHVsZXIvQXN5bmNTY2hlZHVsZXInO1xuXG5jb25zdCBkZWZhdWx0TWF4RnJhbWU6IG51bWJlciA9IDc1MDtcblxuZXhwb3J0IGludGVyZmFjZSBSdW5IZWxwZXJzIHtcbiAgY29sZDogdHlwZW9mIFRlc3RTY2hlZHVsZXIucHJvdG90eXBlLmNyZWF0ZUNvbGRPYnNlcnZhYmxlO1xuICBob3Q6IHR5cGVvZiBUZXN0U2NoZWR1bGVyLnByb3RvdHlwZS5jcmVhdGVIb3RPYnNlcnZhYmxlO1xuICBmbHVzaDogdHlwZW9mIFRlc3RTY2hlZHVsZXIucHJvdG90eXBlLmZsdXNoO1xuICBleHBlY3RPYnNlcnZhYmxlOiB0eXBlb2YgVGVzdFNjaGVkdWxlci5wcm90b3R5cGUuZXhwZWN0T2JzZXJ2YWJsZTtcbiAgZXhwZWN0U3Vic2NyaXB0aW9uczogdHlwZW9mIFRlc3RTY2hlZHVsZXIucHJvdG90eXBlLmV4cGVjdFN1YnNjcmlwdGlvbnM7XG59XG5cbmludGVyZmFjZSBGbHVzaGFibGVUZXN0IHtcbiAgcmVhZHk6IGJvb2xlYW47XG4gIGFjdHVhbD86IGFueVtdO1xuICBleHBlY3RlZD86IGFueVtdO1xufVxuXG5leHBvcnQgdHlwZSBvYnNlcnZhYmxlVG9CZUZuID0gKG1hcmJsZXM6IHN0cmluZywgdmFsdWVzPzogYW55LCBlcnJvclZhbHVlPzogYW55KSA9PiB2b2lkO1xuZXhwb3J0IHR5cGUgc3Vic2NyaXB0aW9uTG9nc1RvQmVGbiA9IChtYXJibGVzOiBzdHJpbmcgfCBzdHJpbmdbXSkgPT4gdm9pZDtcblxuZXhwb3J0IGNsYXNzIFRlc3RTY2hlZHVsZXIgZXh0ZW5kcyBWaXJ0dWFsVGltZVNjaGVkdWxlciB7XG4gIHB1YmxpYyByZWFkb25seSBob3RPYnNlcnZhYmxlczogSG90T2JzZXJ2YWJsZTxhbnk+W10gPSBbXTtcbiAgcHVibGljIHJlYWRvbmx5IGNvbGRPYnNlcnZhYmxlczogQ29sZE9ic2VydmFibGU8YW55PltdID0gW107XG4gIHByaXZhdGUgZmx1c2hUZXN0czogRmx1c2hhYmxlVGVzdFtdID0gW107XG4gIHByaXZhdGUgcnVuTW9kZSA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBhc3NlcnREZWVwRXF1YWw6IChhY3R1YWw6IGFueSwgZXhwZWN0ZWQ6IGFueSkgPT4gYm9vbGVhbiB8IHZvaWQpIHtcbiAgICBzdXBlcihWaXJ0dWFsQWN0aW9uLCBkZWZhdWx0TWF4RnJhbWUpO1xuICB9XG5cbiAgY3JlYXRlVGltZShtYXJibGVzOiBzdHJpbmcpOiBudW1iZXIge1xuICAgIGNvbnN0IGluZGV4T2Y6IG51bWJlciA9IG1hcmJsZXMuaW5kZXhPZignfCcpO1xuICAgIGlmIChpbmRleE9mID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYXJibGUgZGlhZ3JhbSBmb3IgdGltZSBzaG91bGQgaGF2ZSBhIGNvbXBsZXRpb24gbWFya2VyIFwifFwiJyk7XG4gICAgfVxuICAgIHJldHVybiBpbmRleE9mICogVGVzdFNjaGVkdWxlci5mcmFtZVRpbWVGYWN0b3I7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIG1hcmJsZXMgQSBkaWFncmFtIGluIHRoZSBtYXJibGUgRFNMLiBMZXR0ZXJzIG1hcCB0byBrZXlzIGluIGB2YWx1ZXNgIGlmIHByb3ZpZGVkLlxuICAgKiBAcGFyYW0gdmFsdWVzIFZhbHVlcyB0byB1c2UgZm9yIHRoZSBsZXR0ZXJzIGluIGBtYXJibGVzYC4gSWYgb21taXR0ZWQsIHRoZSBsZXR0ZXJzIHRoZW1zZWx2ZXMgYXJlIHVzZWQuXG4gICAqIEBwYXJhbSBlcnJvciBUaGUgZXJyb3IgdG8gdXNlIGZvciB0aGUgYCNgIG1hcmJsZSAoaWYgcHJlc2VudCkuXG4gICAqL1xuICBjcmVhdGVDb2xkT2JzZXJ2YWJsZTxUID0gc3RyaW5nPihtYXJibGVzOiBzdHJpbmcsIHZhbHVlcz86IHsgW21hcmJsZTogc3RyaW5nXTogVCB9LCBlcnJvcj86IGFueSk6IENvbGRPYnNlcnZhYmxlPFQ+IHtcbiAgICBpZiAobWFyYmxlcy5pbmRleE9mKCdeJykgIT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvbGQgb2JzZXJ2YWJsZSBjYW5ub3QgaGF2ZSBzdWJzY3JpcHRpb24gb2Zmc2V0IFwiXlwiJyk7XG4gICAgfVxuICAgIGlmIChtYXJibGVzLmluZGV4T2YoJyEnKSAhPT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY29sZCBvYnNlcnZhYmxlIGNhbm5vdCBoYXZlIHVuc3Vic2NyaXB0aW9uIG1hcmtlciBcIiFcIicpO1xuICAgIH1cbiAgICBjb25zdCBtZXNzYWdlcyA9IFRlc3RTY2hlZHVsZXIucGFyc2VNYXJibGVzKG1hcmJsZXMsIHZhbHVlcywgZXJyb3IsIHVuZGVmaW5lZCwgdGhpcy5ydW5Nb2RlKTtcbiAgICBjb25zdCBjb2xkID0gbmV3IENvbGRPYnNlcnZhYmxlPFQ+KG1lc3NhZ2VzLCB0aGlzKTtcbiAgICB0aGlzLmNvbGRPYnNlcnZhYmxlcy5wdXNoKGNvbGQpO1xuICAgIHJldHVybiBjb2xkO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBtYXJibGVzIEEgZGlhZ3JhbSBpbiB0aGUgbWFyYmxlIERTTC4gTGV0dGVycyBtYXAgdG8ga2V5cyBpbiBgdmFsdWVzYCBpZiBwcm92aWRlZC5cbiAgICogQHBhcmFtIHZhbHVlcyBWYWx1ZXMgdG8gdXNlIGZvciB0aGUgbGV0dGVycyBpbiBgbWFyYmxlc2AuIElmIG9tbWl0dGVkLCB0aGUgbGV0dGVycyB0aGVtc2VsdmVzIGFyZSB1c2VkLlxuICAgKiBAcGFyYW0gZXJyb3IgVGhlIGVycm9yIHRvIHVzZSBmb3IgdGhlIGAjYCBtYXJibGUgKGlmIHByZXNlbnQpLlxuICAgKi9cbiAgY3JlYXRlSG90T2JzZXJ2YWJsZTxUID0gc3RyaW5nPihtYXJibGVzOiBzdHJpbmcsIHZhbHVlcz86IHsgW21hcmJsZTogc3RyaW5nXTogVCB9LCBlcnJvcj86IGFueSk6IEhvdE9ic2VydmFibGU8VD4ge1xuICAgIGlmIChtYXJibGVzLmluZGV4T2YoJyEnKSAhPT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaG90IG9ic2VydmFibGUgY2Fubm90IGhhdmUgdW5zdWJzY3JpcHRpb24gbWFya2VyIFwiIVwiJyk7XG4gICAgfVxuICAgIGNvbnN0IG1lc3NhZ2VzID0gVGVzdFNjaGVkdWxlci5wYXJzZU1hcmJsZXMobWFyYmxlcywgdmFsdWVzLCBlcnJvciwgdW5kZWZpbmVkLCB0aGlzLnJ1bk1vZGUpO1xuICAgIGNvbnN0IHN1YmplY3QgPSBuZXcgSG90T2JzZXJ2YWJsZTxUPihtZXNzYWdlcywgdGhpcyk7XG4gICAgdGhpcy5ob3RPYnNlcnZhYmxlcy5wdXNoKHN1YmplY3QpO1xuICAgIHJldHVybiBzdWJqZWN0O1xuICB9XG5cbiAgcHJpdmF0ZSBtYXRlcmlhbGl6ZUlubmVyT2JzZXJ2YWJsZShvYnNlcnZhYmxlOiBPYnNlcnZhYmxlPGFueT4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0ZXJGcmFtZTogbnVtYmVyKTogVGVzdE1lc3NhZ2VbXSB7XG4gICAgY29uc3QgbWVzc2FnZXM6IFRlc3RNZXNzYWdlW10gPSBbXTtcbiAgICBvYnNlcnZhYmxlLnN1YnNjcmliZSgodmFsdWUpID0+IHtcbiAgICAgIG1lc3NhZ2VzLnB1c2goeyBmcmFtZTogdGhpcy5mcmFtZSAtIG91dGVyRnJhbWUsIG5vdGlmaWNhdGlvbjogTm90aWZpY2F0aW9uLmNyZWF0ZU5leHQodmFsdWUpIH0pO1xuICAgIH0sIChlcnIpID0+IHtcbiAgICAgIG1lc3NhZ2VzLnB1c2goeyBmcmFtZTogdGhpcy5mcmFtZSAtIG91dGVyRnJhbWUsIG5vdGlmaWNhdGlvbjogTm90aWZpY2F0aW9uLmNyZWF0ZUVycm9yKGVycikgfSk7XG4gICAgfSwgKCkgPT4ge1xuICAgICAgbWVzc2FnZXMucHVzaCh7IGZyYW1lOiB0aGlzLmZyYW1lIC0gb3V0ZXJGcmFtZSwgbm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb24uY3JlYXRlQ29tcGxldGUoKSB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gbWVzc2FnZXM7XG4gIH1cblxuICBleHBlY3RPYnNlcnZhYmxlKG9ic2VydmFibGU6IE9ic2VydmFibGU8YW55PixcbiAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb25NYXJibGVzOiBzdHJpbmcgPSBudWxsKTogKHsgdG9CZTogb2JzZXJ2YWJsZVRvQmVGbiB9KSB7XG4gICAgY29uc3QgYWN0dWFsOiBUZXN0TWVzc2FnZVtdID0gW107XG4gICAgY29uc3QgZmx1c2hUZXN0OiBGbHVzaGFibGVUZXN0ID0geyBhY3R1YWwsIHJlYWR5OiBmYWxzZSB9O1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvblBhcnNlZCA9IFRlc3RTY2hlZHVsZXIucGFyc2VNYXJibGVzQXNTdWJzY3JpcHRpb25zKHN1YnNjcmlwdGlvbk1hcmJsZXMsIHRoaXMucnVuTW9kZSk7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uRnJhbWUgPSBzdWJzY3JpcHRpb25QYXJzZWQuc3Vic2NyaWJlZEZyYW1lID09PSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkgP1xuICAgICAgMCA6IHN1YnNjcmlwdGlvblBhcnNlZC5zdWJzY3JpYmVkRnJhbWU7XG4gICAgY29uc3QgdW5zdWJzY3JpcHRpb25GcmFtZSA9IHN1YnNjcmlwdGlvblBhcnNlZC51bnN1YnNjcmliZWRGcmFtZTtcbiAgICBsZXQgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgICB0aGlzLnNjaGVkdWxlKCgpID0+IHtcbiAgICAgIHN1YnNjcmlwdGlvbiA9IG9ic2VydmFibGUuc3Vic2NyaWJlKHggPT4ge1xuICAgICAgICBsZXQgdmFsdWUgPSB4O1xuICAgICAgICAvLyBTdXBwb3J0IE9ic2VydmFibGUtb2YtT2JzZXJ2YWJsZXNcbiAgICAgICAgaWYgKHggaW5zdGFuY2VvZiBPYnNlcnZhYmxlKSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLm1hdGVyaWFsaXplSW5uZXJPYnNlcnZhYmxlKHZhbHVlLCB0aGlzLmZyYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBhY3R1YWwucHVzaCh7IGZyYW1lOiB0aGlzLmZyYW1lLCBub3RpZmljYXRpb246IE5vdGlmaWNhdGlvbi5jcmVhdGVOZXh0KHZhbHVlKSB9KTtcbiAgICAgIH0sIChlcnIpID0+IHtcbiAgICAgICAgYWN0dWFsLnB1c2goeyBmcmFtZTogdGhpcy5mcmFtZSwgbm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb24uY3JlYXRlRXJyb3IoZXJyKSB9KTtcbiAgICAgIH0sICgpID0+IHtcbiAgICAgICAgYWN0dWFsLnB1c2goeyBmcmFtZTogdGhpcy5mcmFtZSwgbm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb24uY3JlYXRlQ29tcGxldGUoKSB9KTtcbiAgICAgIH0pO1xuICAgIH0sIHN1YnNjcmlwdGlvbkZyYW1lKTtcblxuICAgIGlmICh1bnN1YnNjcmlwdGlvbkZyYW1lICE9PSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkpIHtcbiAgICAgIHRoaXMuc2NoZWR1bGUoKCkgPT4gc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCksIHVuc3Vic2NyaXB0aW9uRnJhbWUpO1xuICAgIH1cblxuICAgIHRoaXMuZmx1c2hUZXN0cy5wdXNoKGZsdXNoVGVzdCk7XG4gICAgY29uc3QgeyBydW5Nb2RlIH0gPSB0aGlzO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRvQmUobWFyYmxlczogc3RyaW5nLCB2YWx1ZXM/OiBhbnksIGVycm9yVmFsdWU/OiBhbnkpIHtcbiAgICAgICAgZmx1c2hUZXN0LnJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgZmx1c2hUZXN0LmV4cGVjdGVkID0gVGVzdFNjaGVkdWxlci5wYXJzZU1hcmJsZXMobWFyYmxlcywgdmFsdWVzLCBlcnJvclZhbHVlLCB0cnVlLCBydW5Nb2RlKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgZXhwZWN0U3Vic2NyaXB0aW9ucyhhY3R1YWxTdWJzY3JpcHRpb25Mb2dzOiBTdWJzY3JpcHRpb25Mb2dbXSk6ICh7IHRvQmU6IHN1YnNjcmlwdGlvbkxvZ3NUb0JlRm4gfSkge1xuICAgIGNvbnN0IGZsdXNoVGVzdDogRmx1c2hhYmxlVGVzdCA9IHsgYWN0dWFsOiBhY3R1YWxTdWJzY3JpcHRpb25Mb2dzLCByZWFkeTogZmFsc2UgfTtcbiAgICB0aGlzLmZsdXNoVGVzdHMucHVzaChmbHVzaFRlc3QpO1xuICAgIGNvbnN0IHsgcnVuTW9kZSB9ID0gdGhpcztcbiAgICByZXR1cm4ge1xuICAgICAgdG9CZShtYXJibGVzOiBzdHJpbmcgfCBzdHJpbmdbXSkge1xuICAgICAgICBjb25zdCBtYXJibGVzQXJyYXk6IHN0cmluZ1tdID0gKHR5cGVvZiBtYXJibGVzID09PSAnc3RyaW5nJykgPyBbbWFyYmxlc10gOiBtYXJibGVzO1xuICAgICAgICBmbHVzaFRlc3QucmVhZHkgPSB0cnVlO1xuICAgICAgICBmbHVzaFRlc3QuZXhwZWN0ZWQgPSBtYXJibGVzQXJyYXkubWFwKG1hcmJsZXMgPT5cbiAgICAgICAgICBUZXN0U2NoZWR1bGVyLnBhcnNlTWFyYmxlc0FzU3Vic2NyaXB0aW9ucyhtYXJibGVzLCBydW5Nb2RlKVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBmbHVzaCgpIHtcbiAgICBjb25zdCBob3RPYnNlcnZhYmxlcyA9IHRoaXMuaG90T2JzZXJ2YWJsZXM7XG4gICAgd2hpbGUgKGhvdE9ic2VydmFibGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGhvdE9ic2VydmFibGVzLnNoaWZ0KCkuc2V0dXAoKTtcbiAgICB9XG5cbiAgICBzdXBlci5mbHVzaCgpO1xuXG4gICAgdGhpcy5mbHVzaFRlc3RzID0gdGhpcy5mbHVzaFRlc3RzLmZpbHRlcih0ZXN0ID0+IHtcbiAgICAgIGlmICh0ZXN0LnJlYWR5KSB7XG4gICAgICAgIHRoaXMuYXNzZXJ0RGVlcEVxdWFsKHRlc3QuYWN0dWFsLCB0ZXN0LmV4cGVjdGVkKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQG5vY29sbGFwc2UgKi9cbiAgc3RhdGljIHBhcnNlTWFyYmxlc0FzU3Vic2NyaXB0aW9ucyhtYXJibGVzOiBzdHJpbmcsIHJ1bk1vZGUgPSBmYWxzZSk6IFN1YnNjcmlwdGlvbkxvZyB7XG4gICAgaWYgKHR5cGVvZiBtYXJibGVzICE9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIG5ldyBTdWJzY3JpcHRpb25Mb2coTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZKTtcbiAgICB9XG4gICAgY29uc3QgbGVuID0gbWFyYmxlcy5sZW5ndGg7XG4gICAgbGV0IGdyb3VwU3RhcnQgPSAtMTtcbiAgICBsZXQgc3Vic2NyaXB0aW9uRnJhbWUgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG4gICAgbGV0IHVuc3Vic2NyaXB0aW9uRnJhbWUgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG4gICAgbGV0IGZyYW1lID0gMDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGxldCBuZXh0RnJhbWUgPSBmcmFtZTtcbiAgICAgIGNvbnN0IGFkdmFuY2VGcmFtZUJ5ID0gKGNvdW50OiBudW1iZXIpID0+IHtcbiAgICAgICAgbmV4dEZyYW1lICs9IGNvdW50ICogdGhpcy5mcmFtZVRpbWVGYWN0b3I7XG4gICAgICB9O1xuICAgICAgY29uc3QgYyA9IG1hcmJsZXNbaV07XG4gICAgICBzd2l0Y2ggKGMpIHtcbiAgICAgICAgY2FzZSAnICc6XG4gICAgICAgICAgLy8gV2hpdGVzcGFjZSBubyBsb25nZXIgYWR2YW5jZXMgdGltZVxuICAgICAgICAgIGlmICghcnVuTW9kZSkge1xuICAgICAgICAgICAgYWR2YW5jZUZyYW1lQnkoMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICBhZHZhbmNlRnJhbWVCeSgxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnKCc6XG4gICAgICAgICAgZ3JvdXBTdGFydCA9IGZyYW1lO1xuICAgICAgICAgIGFkdmFuY2VGcmFtZUJ5KDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICcpJzpcbiAgICAgICAgICBncm91cFN0YXJ0ID0gLTE7XG4gICAgICAgICAgYWR2YW5jZUZyYW1lQnkoMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ14nOlxuICAgICAgICAgIGlmIChzdWJzY3JpcHRpb25GcmFtZSAhPT0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZvdW5kIGEgc2Vjb25kIHN1YnNjcmlwdGlvbiBwb2ludCBcXCdeXFwnIGluIGEgJyArXG4gICAgICAgICAgICAgICdzdWJzY3JpcHRpb24gbWFyYmxlIGRpYWdyYW0uIFRoZXJlIGNhbiBvbmx5IGJlIG9uZS4nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc3Vic2NyaXB0aW9uRnJhbWUgPSBncm91cFN0YXJ0ID4gLTEgPyBncm91cFN0YXJ0IDogZnJhbWU7XG4gICAgICAgICAgYWR2YW5jZUZyYW1lQnkoMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJyEnOlxuICAgICAgICAgIGlmICh1bnN1YnNjcmlwdGlvbkZyYW1lICE9PSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZm91bmQgYSBzZWNvbmQgc3Vic2NyaXB0aW9uIHBvaW50IFxcJ15cXCcgaW4gYSAnICtcbiAgICAgICAgICAgICAgJ3N1YnNjcmlwdGlvbiBtYXJibGUgZGlhZ3JhbS4gVGhlcmUgY2FuIG9ubHkgYmUgb25lLicpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB1bnN1YnNjcmlwdGlvbkZyYW1lID0gZ3JvdXBTdGFydCA+IC0xID8gZ3JvdXBTdGFydCA6IGZyYW1lO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIC8vIHRpbWUgcHJvZ3Jlc3Npb24gc3ludGF4XG4gICAgICAgICAgaWYgKHJ1bk1vZGUgJiYgYy5tYXRjaCgvXlswLTldJC8pKSB7XG4gICAgICAgICAgICAvLyBUaW1lIHByb2dyZXNzaW9uIG11c3QgYmUgcHJlY2VlZGVkIGJ5IGF0IGxlYXN0IG9uZSBzcGFjZVxuICAgICAgICAgICAgLy8gaWYgaXQncyBub3QgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgZGlhZ3JhbVxuICAgICAgICAgICAgaWYgKGkgPT09IDAgfHwgbWFyYmxlc1tpIC0gMV0gPT09ICcgJykge1xuICAgICAgICAgICAgICBjb25zdCBidWZmZXIgPSBtYXJibGVzLnNsaWNlKGkpO1xuICAgICAgICAgICAgICBjb25zdCBtYXRjaCA9IGJ1ZmZlci5tYXRjaCgvXihbMC05XSsoPzpcXC5bMC05XSspPykobXN8c3xtKSAvKTtcbiAgICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgaSArPSBtYXRjaFswXS5sZW5ndGggLSAxO1xuICAgICAgICAgICAgICAgIGNvbnN0IGR1cmF0aW9uID0gcGFyc2VGbG9hdChtYXRjaFsxXSk7XG4gICAgICAgICAgICAgICAgY29uc3QgdW5pdCA9IG1hdGNoWzJdO1xuICAgICAgICAgICAgICAgIGxldCBkdXJhdGlvbkluTXM6IG51bWJlcjtcblxuICAgICAgICAgICAgICAgIHN3aXRjaCAodW5pdCkge1xuICAgICAgICAgICAgICAgICAgY2FzZSAnbXMnOlxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbkluTXMgPSBkdXJhdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICBjYXNlICdzJzpcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb25Jbk1zID0gZHVyYXRpb24gKiAxMDAwO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIGNhc2UgJ20nOlxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbkluTXMgPSBkdXJhdGlvbiAqIDEwMDAgKiA2MDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBhZHZhbmNlRnJhbWVCeShkdXJhdGlvbkluTXMgLyB0aGlzLmZyYW1lVGltZUZhY3Rvcik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3RoZXJlIGNhbiBvbmx5IGJlIFxcJ15cXCcgYW5kIFxcJyFcXCcgbWFya2VycyBpbiBhICcgK1xuICAgICAgICAgICAgJ3N1YnNjcmlwdGlvbiBtYXJibGUgZGlhZ3JhbS4gRm91bmQgaW5zdGVhZCBcXCcnICsgYyArICdcXCcuJyk7XG4gICAgICB9XG5cbiAgICAgIGZyYW1lID0gbmV4dEZyYW1lO1xuICAgIH1cblxuICAgIGlmICh1bnN1YnNjcmlwdGlvbkZyYW1lIDwgMCkge1xuICAgICAgcmV0dXJuIG5ldyBTdWJzY3JpcHRpb25Mb2coc3Vic2NyaXB0aW9uRnJhbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IFN1YnNjcmlwdGlvbkxvZyhzdWJzY3JpcHRpb25GcmFtZSwgdW5zdWJzY3JpcHRpb25GcmFtZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBub2NvbGxhcHNlICovXG4gIHN0YXRpYyBwYXJzZU1hcmJsZXMobWFyYmxlczogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlcz86IGFueSxcbiAgICAgICAgICAgICAgICAgICAgICBlcnJvclZhbHVlPzogYW55LFxuICAgICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsaXplSW5uZXJPYnNlcnZhYmxlczogYm9vbGVhbiA9IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgIHJ1bk1vZGUgPSBmYWxzZSk6IFRlc3RNZXNzYWdlW10ge1xuICAgIGlmIChtYXJibGVzLmluZGV4T2YoJyEnKSAhPT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY29udmVudGlvbmFsIG1hcmJsZSBkaWFncmFtcyBjYW5ub3QgaGF2ZSB0aGUgJyArXG4gICAgICAgICd1bnN1YnNjcmlwdGlvbiBtYXJrZXIgXCIhXCInKTtcbiAgICB9XG4gICAgY29uc3QgbGVuID0gbWFyYmxlcy5sZW5ndGg7XG4gICAgY29uc3QgdGVzdE1lc3NhZ2VzOiBUZXN0TWVzc2FnZVtdID0gW107XG4gICAgY29uc3Qgc3ViSW5kZXggPSBydW5Nb2RlID8gbWFyYmxlcy5yZXBsYWNlKC9eWyBdKy8sICcnKS5pbmRleE9mKCdeJykgOiBtYXJibGVzLmluZGV4T2YoJ14nKTtcbiAgICBsZXQgZnJhbWUgPSBzdWJJbmRleCA9PT0gLTEgPyAwIDogKHN1YkluZGV4ICogLXRoaXMuZnJhbWVUaW1lRmFjdG9yKTtcbiAgICBjb25zdCBnZXRWYWx1ZSA9IHR5cGVvZiB2YWx1ZXMgIT09ICdvYmplY3QnID9cbiAgICAgICh4OiBhbnkpID0+IHggOlxuICAgICAgKHg6IGFueSkgPT4ge1xuICAgICAgICAvLyBTdXBwb3J0IE9ic2VydmFibGUtb2YtT2JzZXJ2YWJsZXNcbiAgICAgICAgaWYgKG1hdGVyaWFsaXplSW5uZXJPYnNlcnZhYmxlcyAmJiB2YWx1ZXNbeF0gaW5zdGFuY2VvZiBDb2xkT2JzZXJ2YWJsZSkge1xuICAgICAgICAgIHJldHVybiB2YWx1ZXNbeF0ubWVzc2FnZXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlc1t4XTtcbiAgICAgIH07XG4gICAgbGV0IGdyb3VwU3RhcnQgPSAtMTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGxldCBuZXh0RnJhbWUgPSBmcmFtZTtcbiAgICAgIGNvbnN0IGFkdmFuY2VGcmFtZUJ5ID0gKGNvdW50OiBudW1iZXIpID0+IHtcbiAgICAgICAgbmV4dEZyYW1lICs9IGNvdW50ICogdGhpcy5mcmFtZVRpbWVGYWN0b3I7XG4gICAgICB9O1xuXG4gICAgICBsZXQgbm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb248YW55PjtcbiAgICAgIGNvbnN0IGMgPSBtYXJibGVzW2ldO1xuICAgICAgc3dpdGNoIChjKSB7XG4gICAgICAgIGNhc2UgJyAnOlxuICAgICAgICAgIC8vIFdoaXRlc3BhY2Ugbm8gbG9uZ2VyIGFkdmFuY2VzIHRpbWVcbiAgICAgICAgICBpZiAoIXJ1bk1vZGUpIHtcbiAgICAgICAgICAgIGFkdmFuY2VGcmFtZUJ5KDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgYWR2YW5jZUZyYW1lQnkoMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJygnOlxuICAgICAgICAgIGdyb3VwU3RhcnQgPSBmcmFtZTtcbiAgICAgICAgICBhZHZhbmNlRnJhbWVCeSgxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnKSc6XG4gICAgICAgICAgZ3JvdXBTdGFydCA9IC0xO1xuICAgICAgICAgIGFkdmFuY2VGcmFtZUJ5KDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd8JzpcbiAgICAgICAgICBub3RpZmljYXRpb24gPSBOb3RpZmljYXRpb24uY3JlYXRlQ29tcGxldGUoKTtcbiAgICAgICAgICBhZHZhbmNlRnJhbWVCeSgxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnXic6XG4gICAgICAgICAgYWR2YW5jZUZyYW1lQnkoMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJyMnOlxuICAgICAgICAgIG5vdGlmaWNhdGlvbiA9IE5vdGlmaWNhdGlvbi5jcmVhdGVFcnJvcihlcnJvclZhbHVlIHx8ICdlcnJvcicpO1xuICAgICAgICAgIGFkdmFuY2VGcmFtZUJ5KDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIC8vIE1pZ2h0IGJlIHRpbWUgcHJvZ3Jlc3Npb24gc3ludGF4LCBvciBhIHZhbHVlIGxpdGVyYWxcbiAgICAgICAgICBpZiAocnVuTW9kZSAmJiBjLm1hdGNoKC9eWzAtOV0kLykpIHtcbiAgICAgICAgICAgIC8vIFRpbWUgcHJvZ3Jlc3Npb24gbXVzdCBiZSBwcmVjZWVkZWQgYnkgYXQgbGVhc3Qgb25lIHNwYWNlXG4gICAgICAgICAgICAvLyBpZiBpdCdzIG5vdCBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBkaWFncmFtXG4gICAgICAgICAgICBpZiAoaSA9PT0gMCB8fCBtYXJibGVzW2kgLSAxXSA9PT0gJyAnKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGJ1ZmZlciA9IG1hcmJsZXMuc2xpY2UoaSk7XG4gICAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gYnVmZmVyLm1hdGNoKC9eKFswLTldKyg/OlxcLlswLTldKyk/KShtc3xzfG0pIC8pO1xuICAgICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICBpICs9IG1hdGNoWzBdLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICAgICAgY29uc3QgZHVyYXRpb24gPSBwYXJzZUZsb2F0KG1hdGNoWzFdKTtcbiAgICAgICAgICAgICAgICBjb25zdCB1bml0ID0gbWF0Y2hbMl07XG4gICAgICAgICAgICAgICAgbGV0IGR1cmF0aW9uSW5NczogbnVtYmVyO1xuXG4gICAgICAgICAgICAgICAgc3dpdGNoICh1bml0KSB7XG4gICAgICAgICAgICAgICAgICBjYXNlICdtcyc6XG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uSW5NcyA9IGR1cmF0aW9uO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIGNhc2UgJ3MnOlxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbkluTXMgPSBkdXJhdGlvbiAqIDEwMDA7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgY2FzZSAnbSc6XG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uSW5NcyA9IGR1cmF0aW9uICogMTAwMCAqIDYwO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGFkdmFuY2VGcmFtZUJ5KGR1cmF0aW9uSW5NcyAvIHRoaXMuZnJhbWVUaW1lRmFjdG9yKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5vdGlmaWNhdGlvbiA9IE5vdGlmaWNhdGlvbi5jcmVhdGVOZXh0KGdldFZhbHVlKGMpKTtcbiAgICAgICAgICBhZHZhbmNlRnJhbWVCeSgxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgaWYgKG5vdGlmaWNhdGlvbikge1xuICAgICAgICB0ZXN0TWVzc2FnZXMucHVzaCh7IGZyYW1lOiBncm91cFN0YXJ0ID4gLTEgPyBncm91cFN0YXJ0IDogZnJhbWUsIG5vdGlmaWNhdGlvbiB9KTtcbiAgICAgIH1cblxuICAgICAgZnJhbWUgPSBuZXh0RnJhbWU7XG4gICAgfVxuICAgIHJldHVybiB0ZXN0TWVzc2FnZXM7XG4gIH1cblxuICBydW48VD4oY2FsbGJhY2s6IChoZWxwZXJzOiBSdW5IZWxwZXJzKSA9PiBUKTogVCB7XG4gICAgY29uc3QgcHJldkZyYW1lVGltZUZhY3RvciA9IFRlc3RTY2hlZHVsZXIuZnJhbWVUaW1lRmFjdG9yO1xuICAgIGNvbnN0IHByZXZNYXhGcmFtZXMgPSB0aGlzLm1heEZyYW1lcztcblxuICAgIFRlc3RTY2hlZHVsZXIuZnJhbWVUaW1lRmFjdG9yID0gMTtcbiAgICB0aGlzLm1heEZyYW1lcyA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbiAgICB0aGlzLnJ1bk1vZGUgPSB0cnVlO1xuICAgIEFzeW5jU2NoZWR1bGVyLmRlbGVnYXRlID0gdGhpcztcblxuICAgIGNvbnN0IGhlbHBlcnMgPSB7XG4gICAgICBjb2xkOiB0aGlzLmNyZWF0ZUNvbGRPYnNlcnZhYmxlLmJpbmQodGhpcyksXG4gICAgICBob3Q6IHRoaXMuY3JlYXRlSG90T2JzZXJ2YWJsZS5iaW5kKHRoaXMpLFxuICAgICAgZmx1c2g6IHRoaXMuZmx1c2guYmluZCh0aGlzKSxcbiAgICAgIGV4cGVjdE9ic2VydmFibGU6IHRoaXMuZXhwZWN0T2JzZXJ2YWJsZS5iaW5kKHRoaXMpLFxuICAgICAgZXhwZWN0U3Vic2NyaXB0aW9uczogdGhpcy5leHBlY3RTdWJzY3JpcHRpb25zLmJpbmQodGhpcyksXG4gICAgfTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmV0ID0gY2FsbGJhY2soaGVscGVycyk7XG4gICAgICB0aGlzLmZsdXNoKCk7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0gZmluYWxseSB7XG4gICAgICBUZXN0U2NoZWR1bGVyLmZyYW1lVGltZUZhY3RvciA9IHByZXZGcmFtZVRpbWVGYWN0b3I7XG4gICAgICB0aGlzLm1heEZyYW1lcyA9IHByZXZNYXhGcmFtZXM7XG4gICAgICB0aGlzLnJ1bk1vZGUgPSBmYWxzZTtcbiAgICAgIEFzeW5jU2NoZWR1bGVyLmRlbGVnYXRlID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxufVxuIl19