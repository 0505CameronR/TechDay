import { isFunction } from './util/isFunction';
import { empty as emptyObserver } from './Observer';
import { Subscription } from './Subscription';
import { rxSubscriber as rxSubscriberSymbol } from '../internal/symbol/rxSubscriber';
import { config } from './config';
import { hostReportError } from './util/hostReportError';
/**
 * Implements the {@link Observer} interface and extends the
 * {@link Subscription} class. While the {@link Observer} is the public API for
 * consuming the values of an {@link Observable}, all Observers get converted to
 * a Subscriber, in order to provide Subscription-like capabilities such as
 * `unsubscribe`. Subscriber is a common type in RxJS, and crucial for
 * implementing operators, but it is rarely used as a public API.
 *
 * @class Subscriber<T>
 */
export class Subscriber extends Subscription {
    /**
     * @param {Observer|function(value: T): void} [destinationOrNext] A partially
     * defined Observer or a `next` callback function.
     * @param {function(e: ?any): void} [error] The `error` callback of an
     * Observer.
     * @param {function(): void} [complete] The `complete` callback of an
     * Observer.
     */
    constructor(destinationOrNext, error, complete) {
        super();
        /** @internal */ this.syncErrorValue = null;
        /** @internal */ this.syncErrorThrown = false;
        /** @internal */ this.syncErrorThrowable = false;
        this.isStopped = false;
        this._parentSubscription = null;
        switch (arguments.length) {
            case 0:
                this.destination = emptyObserver;
                break;
            case 1:
                if (!destinationOrNext) {
                    this.destination = emptyObserver;
                    break;
                }
                if (typeof destinationOrNext === 'object') {
                    if (destinationOrNext instanceof Subscriber) {
                        this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
                        this.destination = destinationOrNext;
                        destinationOrNext.add(this);
                    }
                    else {
                        this.syncErrorThrowable = true;
                        this.destination = new SafeSubscriber(this, destinationOrNext);
                    }
                    break;
                }
            default:
                this.syncErrorThrowable = true;
                this.destination = new SafeSubscriber(this, destinationOrNext, error, complete);
                break;
        }
    }
    [rxSubscriberSymbol]() { return this; }
    /**
     * A static factory for a Subscriber, given a (potentially partial) definition
     * of an Observer.
     * @param {function(x: ?T): void} [next] The `next` callback of an Observer.
     * @param {function(e: ?any): void} [error] The `error` callback of an
     * Observer.
     * @param {function(): void} [complete] The `complete` callback of an
     * Observer.
     * @return {Subscriber<T>} A Subscriber wrapping the (partially defined)
     * Observer represented by the given arguments.
     * @nocollapse
     */
    static create(next, error, complete) {
        const subscriber = new Subscriber(next, error, complete);
        subscriber.syncErrorThrowable = false;
        return subscriber;
    }
    /**
     * The {@link Observer} callback to receive notifications of type `next` from
     * the Observable, with a value. The Observable may call this method 0 or more
     * times.
     * @param {T} [value] The `next` value.
     * @return {void}
     */
    next(value) {
        if (!this.isStopped) {
            this._next(value);
        }
    }
    /**
     * The {@link Observer} callback to receive notifications of type `error` from
     * the Observable, with an attached `Error`. Notifies the Observer that
     * the Observable has experienced an error condition.
     * @param {any} [err] The `error` exception.
     * @return {void}
     */
    error(err) {
        if (!this.isStopped) {
            this.isStopped = true;
            this._error(err);
        }
    }
    /**
     * The {@link Observer} callback to receive a valueless notification of type
     * `complete` from the Observable. Notifies the Observer that the Observable
     * has finished sending push-based notifications.
     * @return {void}
     */
    complete() {
        if (!this.isStopped) {
            this.isStopped = true;
            this._complete();
        }
    }
    unsubscribe() {
        if (this.closed) {
            return;
        }
        this.isStopped = true;
        super.unsubscribe();
    }
    _next(value) {
        this.destination.next(value);
    }
    _error(err) {
        this.destination.error(err);
        this.unsubscribe();
    }
    _complete() {
        this.destination.complete();
        this.unsubscribe();
    }
    /** @deprecated This is an internal implementation detail, do not use. */
    _unsubscribeAndRecycle() {
        const { _parent, _parents } = this;
        this._parent = null;
        this._parents = null;
        this.unsubscribe();
        this.closed = false;
        this.isStopped = false;
        this._parent = _parent;
        this._parents = _parents;
        this._parentSubscription = null;
        return this;
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
export class SafeSubscriber extends Subscriber {
    constructor(_parentSubscriber, observerOrNext, error, complete) {
        super();
        this._parentSubscriber = _parentSubscriber;
        let next;
        let context = this;
        if (isFunction(observerOrNext)) {
            next = observerOrNext;
        }
        else if (observerOrNext) {
            next = observerOrNext.next;
            error = observerOrNext.error;
            complete = observerOrNext.complete;
            if (observerOrNext !== emptyObserver) {
                context = Object.create(observerOrNext);
                if (isFunction(context.unsubscribe)) {
                    this.add(context.unsubscribe.bind(context));
                }
                context.unsubscribe = this.unsubscribe.bind(this);
            }
        }
        this._context = context;
        this._next = next;
        this._error = error;
        this._complete = complete;
    }
    next(value) {
        if (!this.isStopped && this._next) {
            const { _parentSubscriber } = this;
            if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                this.__tryOrUnsub(this._next, value);
            }
            else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
                this.unsubscribe();
            }
        }
    }
    error(err) {
        if (!this.isStopped) {
            const { _parentSubscriber } = this;
            const { useDeprecatedSynchronousErrorHandling } = config;
            if (this._error) {
                if (!useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(this._error, err);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, this._error, err);
                    this.unsubscribe();
                }
            }
            else if (!_parentSubscriber.syncErrorThrowable) {
                this.unsubscribe();
                if (useDeprecatedSynchronousErrorHandling) {
                    throw err;
                }
                hostReportError(err);
            }
            else {
                if (useDeprecatedSynchronousErrorHandling) {
                    _parentSubscriber.syncErrorValue = err;
                    _parentSubscriber.syncErrorThrown = true;
                }
                else {
                    hostReportError(err);
                }
                this.unsubscribe();
            }
        }
    }
    complete() {
        if (!this.isStopped) {
            const { _parentSubscriber } = this;
            if (this._complete) {
                const wrappedComplete = () => this._complete.call(this._context);
                if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(wrappedComplete);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, wrappedComplete);
                    this.unsubscribe();
                }
            }
            else {
                this.unsubscribe();
            }
        }
    }
    __tryOrUnsub(fn, value) {
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            this.unsubscribe();
            if (config.useDeprecatedSynchronousErrorHandling) {
                throw err;
            }
            else {
                hostReportError(err);
            }
        }
    }
    __tryOrSetError(parent, fn, value) {
        if (!config.useDeprecatedSynchronousErrorHandling) {
            throw new Error('bad call');
        }
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            if (config.useDeprecatedSynchronousErrorHandling) {
                parent.syncErrorValue = err;
                parent.syncErrorThrown = true;
                return true;
            }
            else {
                hostReportError(err);
                return true;
            }
        }
        return false;
    }
    /** @internal This is an internal implementation detail, do not use. */
    _unsubscribe() {
        const { _parentSubscriber } = this;
        this._context = null;
        this._parentSubscriber = null;
        _parentSubscriber.unsubscribe();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3Vic2NyaWJlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL1N1YnNjcmliZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxLQUFLLElBQUksYUFBYSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBRXBELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsWUFBWSxJQUFJLGtCQUFrQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDckYsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUNsQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFFekQ7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBTSxPQUFPLFVBQWMsU0FBUSxZQUFZO0lBaUM3Qzs7Ozs7OztPQU9HO0lBQ0gsWUFBWSxpQkFBK0QsRUFDL0QsS0FBeUIsRUFDekIsUUFBcUI7UUFDL0IsS0FBSyxFQUFFLENBQUM7UUFwQlYsZ0JBQWdCLENBQUMsbUJBQWMsR0FBUSxJQUFJLENBQUM7UUFDNUMsZ0JBQWdCLENBQUMsb0JBQWUsR0FBWSxLQUFLLENBQUM7UUFDbEQsZ0JBQWdCLENBQUMsdUJBQWtCLEdBQVksS0FBSyxDQUFDO1FBRTNDLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFHN0Isd0JBQW1CLEdBQXdCLElBQUksQ0FBQztRQWV0RCxRQUFRLFNBQVMsQ0FBQyxNQUFNLEVBQUU7WUFDeEIsS0FBSyxDQUFDO2dCQUNKLElBQUksQ0FBQyxXQUFXLEdBQUcsYUFBYSxDQUFDO2dCQUNqQyxNQUFNO1lBQ1IsS0FBSyxDQUFDO2dCQUNKLElBQUksQ0FBQyxpQkFB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ZixDQUFDO0lBRUQsdUVBQXVFO0lBQ3ZFLFlBQVk7UUFDVixNQUFNLEVBQUUsaUJBQWlCLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDbkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDckIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztRQUM5QixpQkFBaUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi91dGlsL2lzRnVuY3Rpb24nO1xuaW1wb3J0IHsgZW1wdHkgYXMgZW1wdHlPYnNlcnZlciB9IGZyb20gJy4vT2JzZXJ2ZXInO1xuaW1wb3J0IHsgT2JzZXJ2ZXIsIFBhcnRpYWxPYnNlcnZlciwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgcnhTdWJzY3JpYmVyIGFzIHJ4U3Vic2NyaWJlclN5bWJvbCB9IGZyb20gJy4uL2ludGVybmFsL3N5bWJvbC9yeFN1YnNjcmliZXInO1xuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgaG9zdFJlcG9ydEVycm9yIH0gZnJvbSAnLi91dGlsL2hvc3RSZXBvcnRFcnJvcic7XG5cbi8qKlxuICogSW1wbGVtZW50cyB0aGUge0BsaW5rIE9ic2VydmVyfSBpbnRlcmZhY2UgYW5kIGV4dGVuZHMgdGhlXG4gKiB7QGxpbmsgU3Vic2NyaXB0aW9ufSBjbGFzcy4gV2hpbGUgdGhlIHtAbGluayBPYnNlcnZlcn0gaXMgdGhlIHB1YmxpYyBBUEkgZm9yXG4gKiBjb25zdW1pbmcgdGhlIHZhbHVlcyBvZiBhbiB7QGxpbmsgT2JzZXJ2YWJsZX0sIGFsbCBPYnNlcnZlcnMgZ2V0IGNvbnZlcnRlZCB0b1xuICogYSBTdWJzY3JpYmVyLCBpbiBvcmRlciB0byBwcm92aWRlIFN1YnNjcmlwdGlvbi1saWtlIGNhcGFiaWxpdGllcyBzdWNoIGFzXG4gKiBgdW5zdWJzY3JpYmVgLiBTdWJzY3JpYmVyIGlzIGEgY29tbW9uIHR5cGUgaW4gUnhKUywgYW5kIGNydWNpYWwgZm9yXG4gKiBpbXBsZW1lbnRpbmcgb3BlcmF0b3JzLCBidXQgaXQgaXMgcmFyZWx5IHVzZWQgYXMgYSBwdWJsaWMgQVBJLlxuICpcbiAqIEBjbGFzcyBTdWJzY3JpYmVyPFQ+XG4gKi9cbmV4cG9ydCBjbGFzcyBTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaXB0aW9uIGltcGxlbWVudHMgT2JzZXJ2ZXI8VD4ge1xuXG4gIFtyeFN1YnNjcmliZXJTeW1ib2xdKCkgeyByZXR1cm4gdGhpczsgfVxuXG4gIC8qKlxuICAgKiBBIHN0YXRpYyBmYWN0b3J5IGZvciBhIFN1YnNjcmliZXIsIGdpdmVuIGEgKHBvdGVudGlhbGx5IHBhcnRpYWwpIGRlZmluaXRpb25cbiAgICogb2YgYW4gT2JzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oeDogP1QpOiB2b2lkfSBbbmV4dF0gVGhlIGBuZXh0YCBjYWxsYmFjayBvZiBhbiBPYnNlcnZlci5cbiAgICogQHBhcmFtIHtmdW5jdGlvbihlOiA/YW55KTogdm9pZH0gW2Vycm9yXSBUaGUgYGVycm9yYCBjYWxsYmFjayBvZiBhblxuICAgKiBPYnNlcnZlci5cbiAgICogQHBhcmFtIHtmdW5jdGlvbigpOiB2b2lkfSBbY29tcGxldGVdIFRoZSBgY29tcGxldGVgIGNhbGxiYWNrIG9mIGFuXG4gICAqIE9ic2VydmVyLlxuICAgKiBAcmV0dXJuIHtTdWJzY3JpYmVyPFQ+fSBBIFN1YnNjcmliZXIgd3JhcHBpbmcgdGhlIChwYXJ0aWFsbHkgZGVmaW5lZClcbiAgICogT2JzZXJ2ZXIgcmVwcmVzZW50ZWQgYnkgdGhlIGdpdmVuIGFyZ3VtZW50cy5cbiAgICogQG5vY29sbGFwc2VcbiAgICovXG4gIHN0YXRpYyBjcmVhdGU8VD4obmV4dD86ICh4PzogVCkgPT4gdm9pZCxcbiAgICAgICAgICAgICAgICAgICBlcnJvcj86IChlPzogYW55KSA9PiB2b2lkLFxuICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlPzogKCkgPT4gdm9pZCk6IFN1YnNjcmliZXI8VD4ge1xuICAgIGNvbnN0IHN1YnNjcmliZXIgPSBuZXcgU3Vic2NyaWJlcihuZXh0LCBlcnJvciwgY29tcGxldGUpO1xuICAgIHN1YnNjcmliZXIuc3luY0Vycm9yVGhyb3dhYmxlID0gZmFsc2U7XG4gICAgcmV0dXJuIHN1YnNjcmliZXI7XG4gIH1cblxuICAvKiogQGludGVybmFsICovIHN5bmNFcnJvclZhbHVlOiBhbnkgPSBudWxsO1xuICAvKiogQGludGVybmFsICovIHN5bmNFcnJvclRocm93bjogYm9vbGVhbiA9IGZhbHNlO1xuICAvKiogQGludGVybmFsICovIHN5bmNFcnJvclRocm93YWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHByb3RlY3RlZCBpc1N0b3BwZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJvdGVjdGVkIGRlc3RpbmF0aW9uOiBQYXJ0aWFsT2JzZXJ2ZXI8YW55PiB8IFN1YnNjcmliZXI8YW55PjsgLy8gdGhpcyBgYW55YCBpcyB0aGUgZXNjYXBlIGhhdGNoIHRvIGVyYXNlIGV4dHJhIHR5cGUgcGFyYW0gKGUuZy4gUilcblxuICBwcml2YXRlIF9wYXJlbnRTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiB8IG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge09ic2VydmVyfGZ1bmN0aW9uKHZhbHVlOiBUKTogdm9pZH0gW2Rlc3RpbmF0aW9uT3JOZXh0XSBBIHBhcnRpYWxseVxuICAgKiBkZWZpbmVkIE9ic2VydmVyIG9yIGEgYG5leHRgIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKGU6ID9hbnkpOiB2b2lkfSBbZXJyb3JdIFRoZSBgZXJyb3JgIGNhbGxiYWNrIG9mIGFuXG4gICAqIE9ic2VydmVyLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKCk6IHZvaWR9IFtjb21wbGV0ZV0gVGhlIGBjb21wbGV0ZWAgY2FsbGJhY2sgb2YgYW5cbiAgICogT2JzZXJ2ZXIuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbk9yTmV4dD86IFBhcnRpYWxPYnNlcnZlcjxhbnk+IHwgKCh2YWx1ZTogVCkgPT4gdm9pZCksXG4gICAgICAgICAgICAgIGVycm9yPzogKGU/OiBhbnkpID0+IHZvaWQsXG4gICAgICAgICAgICAgIGNvbXBsZXRlPzogKCkgPT4gdm9pZCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IGVtcHR5T2JzZXJ2ZXI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxOlxuICAgICAgICBpZiAoIWRlc3RpbmF0aW9uT3JOZXh0KSB7XG4gICAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IGVtcHR5T2JzZXJ2ZXI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBkZXN0aW5hdGlvbk9yTmV4dCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICBpZiAoZGVzdGluYXRpb25Pck5leHQgaW5zdGFuY2VvZiBTdWJzY3JpYmVyKSB7XG4gICAgICAgICAgICB0aGlzLnN5bmNFcnJvclRocm93YWJsZSA9IGRlc3RpbmF0aW9uT3JOZXh0LnN5bmNFcnJvclRocm93YWJsZTtcbiAgICAgICAgICAgIHRoaXMuZGVzdGluYXRpb24gPSBkZXN0aW5hdGlvbk9yTmV4dDtcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uT3JOZXh0LmFkZCh0aGlzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zeW5jRXJyb3JUaHJvd2FibGUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IG5ldyBTYWZlU3Vic2NyaWJlcjxUPih0aGlzLCA8UGFydGlhbE9ic2VydmVyPGFueT4+IGRlc3RpbmF0aW9uT3JOZXh0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuc3luY0Vycm9yVGhyb3dhYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IG5ldyBTYWZlU3Vic2NyaWJlcjxUPih0aGlzLCA8KCh2YWx1ZTogVCkgPT4gdm9pZCk+IGRlc3RpbmF0aW9uT3JOZXh0LCBlcnJvciwgY29tcGxldGUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhlIHtAbGluayBPYnNlcnZlcn0gY2FsbGJhY2sgdG8gcmVjZWl2ZSBub3RpZmljYXRpb25zIG9mIHR5cGUgYG5leHRgIGZyb21cbiAgICogdGhlIE9ic2VydmFibGUsIHdpdGggYSB2YWx1ZS4gVGhlIE9ic2VydmFibGUgbWF5IGNhbGwgdGhpcyBtZXRob2QgMCBvciBtb3JlXG4gICAqIHRpbWVzLlxuICAgKiBAcGFyYW0ge1R9IFt2YWx1ZV0gVGhlIGBuZXh0YCB2YWx1ZS5cbiAgICogQHJldHVybiB7dm9pZH1cbiAgICovXG4gIG5leHQodmFsdWU/OiBUKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgdGhpcy5fbmV4dCh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB7QGxpbmsgT2JzZXJ2ZXJ9IGNhbGxiYWNrIHRvIHJlY2VpdmUgbm90aWZpY2F0aW9ucyBvZiB0eXBlIGBlcnJvcmAgZnJvbVxuICAgKiB0aGUgT2JzZXJ2YWJsZSwgd2l0aCBhbiBhdHRhY2hlZCBgRXJyb3JgLiBOb3RpZmllcyB0aGUgT2JzZXJ2ZXIgdGhhdFxuICAgKiB0aGUgT2JzZXJ2YWJsZSBoYXMgZXhwZXJpZW5jZWQgYW4gZXJyb3IgY29uZGl0aW9uLlxuICAgKiBAcGFyYW0ge2FueX0gW2Vycl0gVGhlIGBlcnJvcmAgZXhjZXB0aW9uLlxuICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgKi9cbiAgZXJyb3IoZXJyPzogYW55KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgdGhpcy5pc1N0b3BwZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fZXJyb3IoZXJyKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhlIHtAbGluayBPYnNlcnZlcn0gY2FsbGJhY2sgdG8gcmVjZWl2ZSBhIHZhbHVlbGVzcyBub3RpZmljYXRpb24gb2YgdHlwZVxuICAgKiBgY29tcGxldGVgIGZyb20gdGhlIE9ic2VydmFibGUuIE5vdGlmaWVzIHRoZSBPYnNlcnZlciB0aGF0IHRoZSBPYnNlcnZhYmxlXG4gICAqIGhhcyBmaW5pc2hlZCBzZW5kaW5nIHB1c2gtYmFzZWQgbm90aWZpY2F0aW9ucy5cbiAgICogQHJldHVybiB7dm9pZH1cbiAgICovXG4gIGNvbXBsZXRlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2NvbXBsZXRlKCk7XG4gICAgfVxuICB9XG5cbiAgdW5zdWJzY3JpYmUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZTtcbiAgICBzdXBlci51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KHZhbHVlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfZXJyb3IoZXJyOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpOiB2b2lkIHtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfdW5zdWJzY3JpYmVBbmRSZWN5Y2xlKCk6IFN1YnNjcmliZXI8VD4ge1xuICAgIGNvbnN0IHsgX3BhcmVudCwgX3BhcmVudHMgfSA9IHRoaXM7XG4gICAgdGhpcy5fcGFyZW50ID0gbnVsbDtcbiAgICB0aGlzLl9wYXJlbnRzID0gbnVsbDtcbiAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5jbG9zZWQgPSBmYWxzZTtcbiAgICB0aGlzLmlzU3RvcHBlZCA9IGZhbHNlO1xuICAgIHRoaXMuX3BhcmVudCA9IF9wYXJlbnQ7XG4gICAgdGhpcy5fcGFyZW50cyA9IF9wYXJlbnRzO1xuICAgIHRoaXMuX3BhcmVudFN1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmV4cG9ydCBjbGFzcyBTYWZlU3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuXG4gIHByaXZhdGUgX2NvbnRleHQ6IGFueTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9wYXJlbnRTdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+LFxuICAgICAgICAgICAgICBvYnNlcnZlck9yTmV4dD86IFBhcnRpYWxPYnNlcnZlcjxUPiB8ICgodmFsdWU6IFQpID0+IHZvaWQpLFxuICAgICAgICAgICAgICBlcnJvcj86IChlPzogYW55KSA9PiB2b2lkLFxuICAgICAgICAgICAgICBjb21wbGV0ZT86ICgpID0+IHZvaWQpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgbGV0IG5leHQ6ICgodmFsdWU6IFQpID0+IHZvaWQpO1xuICAgIGxldCBjb250ZXh0OiBhbnkgPSB0aGlzO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24ob2JzZXJ2ZXJPck5leHQpKSB7XG4gICAgICBuZXh0ID0gKDwoKHZhbHVlOiBUKSA9PiB2b2lkKT4gb2JzZXJ2ZXJPck5leHQpO1xuICAgIH0gZWxzZSBpZiAob2JzZXJ2ZXJPck5leHQpIHtcbiAgICAgIG5leHQgPSAoPFBhcnRpYWxPYnNlcnZlcjxUPj4gb2JzZXJ2ZXJPck5leHQpLm5leHQ7XG4gICAgICBlcnJvciA9ICg8UGFydGlhbE9ic2VydmVyPFQ+PiBvYnNlcnZlck9yTmV4dCkuZXJyb3I7XG4gICAgICBjb21wbGV0ZSA9ICg8UGFydGlhbE9ic2VydmVyPFQ+PiBvYnNlcnZlck9yTmV4dCkuY29tcGxldGU7XG4gICAgICBpZiAob2JzZXJ2ZXJPck5leHQgIT09IGVtcHR5T2JzZXJ2ZXIpIHtcbiAgICAgICAgY29udGV4dCA9IE9iamVjdC5jcmVhdGUob2JzZXJ2ZXJPck5leHQpO1xuICAgICAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0LnVuc3Vic2NyaWJlKSkge1xuICAgICAgICAgIHRoaXMuYWRkKDwoKSA9PiB2b2lkPiBjb250ZXh0LnVuc3Vic2NyaWJlLmJpbmQoY29udGV4dCkpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRleHQudW5zdWJzY3JpYmUgPSB0aGlzLnVuc3Vic2NyaWJlLmJpbmQodGhpcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fY29udGV4dCA9IGNvbnRleHQ7XG4gICAgdGhpcy5fbmV4dCA9IG5leHQ7XG4gICAgdGhpcy5fZXJyb3IgPSBlcnJvcjtcbiAgICB0aGlzLl9jb21wbGV0ZSA9IGNvbXBsZXRlO1xuICB9XG5cbiAgbmV4dCh2YWx1ZT86IFQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXNTdG9wcGVkICYmIHRoaXMuX25leHQpIHtcbiAgICAgIGNvbnN0IHsgX3BhcmVudFN1YnNjcmliZXIgfSA9IHRoaXM7XG4gICAgICBpZiAoIWNvbmZpZy51c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nIHx8ICFfcGFyZW50U3Vic2NyaWJlci5zeW5jRXJyb3JUaHJvd2FibGUpIHtcbiAgICAgICAgdGhpcy5fX3RyeU9yVW5zdWIodGhpcy5fbmV4dCwgdmFsdWUpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9fdHJ5T3JTZXRFcnJvcihfcGFyZW50U3Vic2NyaWJlciwgdGhpcy5fbmV4dCwgdmFsdWUpKSB7XG4gICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBlcnJvcihlcnI/OiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICBjb25zdCB7IF9wYXJlbnRTdWJzY3JpYmVyIH0gPSB0aGlzO1xuICAgICAgY29uc3QgeyB1c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nIH0gPSBjb25maWc7XG4gICAgICBpZiAodGhpcy5fZXJyb3IpIHtcbiAgICAgICAgaWYgKCF1c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nIHx8ICFfcGFyZW50U3Vic2NyaWJlci5zeW5jRXJyb3JUaHJvd2FibGUpIHtcbiAgICAgICAgICB0aGlzLl9fdHJ5T3JVbnN1Yih0aGlzLl9lcnJvciwgZXJyKTtcbiAgICAgICAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fX3RyeU9yU2V0RXJyb3IoX3BhcmVudFN1YnNjcmliZXIsIHRoaXMuX2Vycm9yLCBlcnIpO1xuICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghX3BhcmVudFN1YnNjcmliZXIuc3luY0Vycm9yVGhyb3dhYmxlKSB7XG4gICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgaWYgKHVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcpIHtcbiAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICAgICAgaG9zdFJlcG9ydEVycm9yKGVycik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodXNlRGVwcmVjYXRlZFN5bmNocm9ub3VzRXJyb3JIYW5kbGluZykge1xuICAgICAgICAgIF9wYXJlbnRTdWJzY3JpYmVyLnN5bmNFcnJvclZhbHVlID0gZXJyO1xuICAgICAgICAgIF9wYXJlbnRTdWJzY3JpYmVyLnN5bmNFcnJvclRocm93biA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaG9zdFJlcG9ydEVycm9yKGVycik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbXBsZXRlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgIGNvbnN0IHsgX3BhcmVudFN1YnNjcmliZXIgfSA9IHRoaXM7XG4gICAgICBpZiAodGhpcy5fY29tcGxldGUpIHtcbiAgICAgICAgY29uc3Qgd3JhcHBlZENvbXBsZXRlID0gKCkgPT4gdGhpcy5fY29tcGxldGUuY2FsbCh0aGlzLl9jb250ZXh0KTtcblxuICAgICAgICBpZiAoIWNvbmZpZy51c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nIHx8ICFfcGFyZW50U3Vic2NyaWJlci5zeW5jRXJyb3JUaHJvd2FibGUpIHtcbiAgICAgICAgICB0aGlzLl9fdHJ5T3JVbnN1Yih3cmFwcGVkQ29tcGxldGUpO1xuICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9fdHJ5T3JTZXRFcnJvcihfcGFyZW50U3Vic2NyaWJlciwgd3JhcHBlZENvbXBsZXRlKTtcbiAgICAgICAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9fdHJ5T3JVbnN1YihmbjogRnVuY3Rpb24sIHZhbHVlPzogYW55KTogdm9pZCB7XG4gICAgdHJ5IHtcbiAgICAgIGZuLmNhbGwodGhpcy5fY29udGV4dCwgdmFsdWUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgaWYgKGNvbmZpZy51c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nKSB7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGhvc3RSZXBvcnRFcnJvcihlcnIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX190cnlPclNldEVycm9yKHBhcmVudDogU3Vic2NyaWJlcjxUPiwgZm46IEZ1bmN0aW9uLCB2YWx1ZT86IGFueSk6IGJvb2xlYW4ge1xuICAgIGlmICghY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYmFkIGNhbGwnKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGZuLmNhbGwodGhpcy5fY29udGV4dCwgdmFsdWUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgaWYgKGNvbmZpZy51c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nKSB7XG4gICAgICAgIHBhcmVudC5zeW5jRXJyb3JWYWx1ZSA9IGVycjtcbiAgICAgICAgcGFyZW50LnN5bmNFcnJvclRocm93biA9IHRydWU7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaG9zdFJlcG9ydEVycm9yKGVycik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiogQGludGVybmFsIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfdW5zdWJzY3JpYmUoKTogdm9pZCB7XG4gICAgY29uc3QgeyBfcGFyZW50U3Vic2NyaWJlciB9ID0gdGhpcztcbiAgICB0aGlzLl9jb250ZXh0ID0gbnVsbDtcbiAgICB0aGlzLl9wYXJlbnRTdWJzY3JpYmVyID0gbnVsbDtcbiAgICBfcGFyZW50U3Vic2NyaWJlci51bnN1YnNjcmliZSgpO1xuICB9XG59XG4iXX0=