import { isArray } from './util/isArray';
import { isObject } from './util/isObject';
import { isFunction } from './util/isFunction';
import { tryCatch } from './util/tryCatch';
import { errorObject } from './util/errorObject';
import { UnsubscriptionError } from './util/UnsubscriptionError';
/**
 * Represents a disposable resource, such as the execution of an Observable. A
 * Subscription has one important method, `unsubscribe`, that takes no argument
 * and just disposes the resource held by the subscription.
 *
 * Additionally, subscriptions may be grouped together through the `add()`
 * method, which will attach a child Subscription to the current Subscription.
 * When a Subscription is unsubscribed, all its children (and its grandchildren)
 * will be unsubscribed as well.
 *
 * @class Subscription
 */
export class Subscription {
    /**
     * @param {function(): void} [unsubscribe] A function describing how to
     * perform the disposal of resources when the `unsubscribe` method is called.
     */
    constructor(unsubscribe) {
        /**
         * A flag to indicate whether this Subscription has already been unsubscribed.
         * @type {boolean}
         */
        this.closed = false;
        /** @internal */
        this._parent = null;
        /** @internal */
        this._parents = null;
        /** @internal */
        this._subscriptions = null;
        if (unsubscribe) {
            this._unsubscribe = unsubscribe;
        }
    }
    /**
     * Disposes the resources held by the subscription. May, for instance, cancel
     * an ongoing Observable execution or cancel any other type of work that
     * started when the Subscription was created.
     * @return {void}
     */
    unsubscribe() {
        let hasErrors = false;
        let errors;
        if (this.closed) {
            return;
        }
        let { _parent, _parents, _unsubscribe, _subscriptions } = this;
        this.closed = true;
        this._parent = null;
        this._parents = null;
        // null out _subscriptions first so any child subscriptions that attempt
        // to remove themselves from this subscription will noop
        this._subscriptions = null;
        let index = -1;
        let len = _parents ? _parents.length : 0;
        // if this._parent is null, then so is this._parents, and we
        // don't have to remove ourselves from any parent subscriptions.
        while (_parent) {
            _parent.remove(this);
            // if this._parents is null or index >= len,
            // then _parent is set to null, and the loop exits
            _parent = ++index < len && _parents[index] || null;
        }
        if (isFunction(_unsubscribe)) {
            let trial = tryCatch(_unsubscribe).call(this);
            if (trial === errorObject) {
                hasErrors = true;
                errors = errors || (errorObject.e instanceof UnsubscriptionError ?
                    flattenUnsubscriptionErrors(errorObject.e.errors) : [errorObject.e]);
            }
        }
        if (isArray(_subscriptions)) {
            index = -1;
            len = _subscriptions.length;
            while (++index < len) {
                const sub = _subscriptions[index];
                if (isObject(sub)) {
                    let trial = tryCatch(sub.unsubscribe).call(sub);
                    if (trial === errorObject) {
                        hasErrors = true;
                        errors = errors || [];
                        let err = errorObject.e;
                        if (err instanceof UnsubscriptionError) {
                            errors = errors.concat(flattenUnsubscriptionErrors(err.errors));
                        }
                        else {
                            errors.push(err);
                        }
                    }
                }
            }
        }
        if (hasErrors) {
            throw new UnsubscriptionError(errors);
        }
    }
    /**
     * Adds a tear down to be called during the unsubscribe() of this
     * Subscription.
     *
     * If the tear down being added is a subscription that is already
     * unsubscribed, is the same reference `add` is being called on, or is
     * `Subscription.EMPTY`, it will not be added.
     *
     * If this subscription is already in an `closed` state, the passed
     * tear down logic will be executed immediately.
     *
     * @param {TeardownLogic} teardown The additional logic to execute on
     * teardown.
     * @return {Subscription} Returns the Subscription used or created to be
     * added to the inner subscriptions list. This Subscription can be used with
     * `remove()` to remove the passed teardown logic from the inner subscriptions
     * list.
     */
    add(teardown) {
        if (!teardown || (teardown === Subscription.EMPTY)) {
            return Subscription.EMPTY;
        }
        if (teardown === this) {
            return this;
        }
        let subscription = teardown;
        switch (typeof teardown) {
            case 'function':
                subscription = new Subscription(teardown);
            case 'object':
                if (subscription.closed || typeof subscription.unsubscribe !== 'function') {
                    return subscription;
                }
                else if (this.closed) {
                    subscription.unsubscribe();
                    return subscription;
                }
                else if (typeof subscription._addParent !== 'function' /* quack quack */) {
                    const tmp = subscription;
                    subscription = new Subscription();
                    subscription._subscriptions = [tmp];
                }
                break;
            default:
                throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
        }
        const subscriptions = this._subscriptions || (this._subscriptions = []);
        subscriptions.push(subscription);
        subscription._addParent(this);
        return subscription;
    }
    /**
     * Removes a Subscription from the internal list of subscriptions that will
     * unsubscribe during the unsubscribe process of this Subscription.
     * @param {Subscription} subscription The subscription to remove.
     * @return {void}
     */
    remove(subscription) {
        const subscriptions = this._subscriptions;
        if (subscriptions) {
            const subscriptionIndex = subscriptions.indexOf(subscription);
            if (subscriptionIndex !== -1) {
                subscriptions.splice(subscriptionIndex, 1);
            }
        }
    }
    /** @internal */
    _addParent(parent) {
        let { _parent, _parents } = this;
        if (!_parent || _parent === parent) {
            // If we don't have a parent, or the new parent is the same as the
            // current parent, then set this._parent to the new parent.
            this._parent = parent;
        }
        else if (!_parents) {
            // If there's already one parent, but not multiple, allocate an Array to
            // store the rest of the parent Subscriptions.
            this._parents = [parent];
        }
        else if (_parents.indexOf(parent) === -1) {
            // Only add the new parent to the _parents list if it's not already there.
            _parents.push(parent);
        }
    }
}
/** @nocollapse */
Subscription.EMPTY = (function (empty) {
    empty.closed = true;
    return empty;
}(new Subscription()));
function flattenUnsubscriptionErrors(errors) {
    return errors.reduce((errs, err) => errs.concat((err instanceof UnsubscriptionError) ? err.errors : err), []);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3Vic2NyaXB0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvU3Vic2NyaXB0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6QyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDakQsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFHakU7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxNQUFNLE9BQU8sWUFBWTtJQW9CdkI7OztPQUdHO0lBQ0gsWUFBWSxXQUF3QjtRQWpCcEM7OztXQUdHO1FBQ0ksV0FBTSxHQUFZLEtBQUssQ0FBQztRQUUvQixnQkFBZ0I7UUFDTixZQUFPLEdBQWlCLElBQUksQ0FBQztRQUN2QyxnQkFBZ0I7UUFDTixhQUFRLEdBQW1CLElBQUksQ0FBQztRQUMxQyxnQkFBZ0I7UUFDUixtQkFBYyxHQUF1QixJQUFJLENBQUM7UUFPaEQsSUFBSSxXQUFXLEVBQUU7WUFDUixJQUFLLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztTQUN6QztJQUNILENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILFdBQVc7UUFDVCxJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdEIsSUFBSSxNQUFhLENBQUM7UUFFbEIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2YsT0FBTztTQUNSO1FBRUQsSUFBSSxFQUFFLE9BQU8sRUFB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QUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQy9HLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAnLi91dGlsL2lzQXJyYXknO1xuaW1wb3J0IHsgaXNPYmplY3QgfSBmcm9tICcuL3V0aWwvaXNPYmplY3QnO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vdXRpbC9pc0Z1bmN0aW9uJztcbmltcG9ydCB7IHRyeUNhdGNoIH0gZnJvbSAnLi91dGlsL3RyeUNhdGNoJztcbmltcG9ydCB7IGVycm9yT2JqZWN0IH0gZnJvbSAnLi91dGlsL2Vycm9yT2JqZWN0JztcbmltcG9ydCB7IFVuc3Vic2NyaXB0aW9uRXJyb3IgfSBmcm9tICcuL3V0aWwvVW5zdWJzY3JpcHRpb25FcnJvcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb25MaWtlLCBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi90eXBlcyc7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIGRpc3Bvc2FibGUgcmVzb3VyY2UsIHN1Y2ggYXMgdGhlIGV4ZWN1dGlvbiBvZiBhbiBPYnNlcnZhYmxlLiBBXG4gKiBTdWJzY3JpcHRpb24gaGFzIG9uZSBpbXBvcnRhbnQgbWV0aG9kLCBgdW5zdWJzY3JpYmVgLCB0aGF0IHRha2VzIG5vIGFyZ3VtZW50XG4gKiBhbmQganVzdCBkaXNwb3NlcyB0aGUgcmVzb3VyY2UgaGVsZCBieSB0aGUgc3Vic2NyaXB0aW9uLlxuICpcbiAqIEFkZGl0aW9uYWxseSwgc3Vic2NyaXB0aW9ucyBtYXkgYmUgZ3JvdXBlZCB0b2dldGhlciB0aHJvdWdoIHRoZSBgYWRkKClgXG4gKiBtZXRob2QsIHdoaWNoIHdpbGwgYXR0YWNoIGEgY2hpbGQgU3Vic2NyaXB0aW9uIHRvIHRoZSBjdXJyZW50IFN1YnNjcmlwdGlvbi5cbiAqIFdoZW4gYSBTdWJzY3JpcHRpb24gaXMgdW5zdWJzY3JpYmVkLCBhbGwgaXRzIGNoaWxkcmVuIChhbmQgaXRzIGdyYW5kY2hpbGRyZW4pXG4gKiB3aWxsIGJlIHVuc3Vic2NyaWJlZCBhcyB3ZWxsLlxuICpcbiAqIEBjbGFzcyBTdWJzY3JpcHRpb25cbiAqL1xuZXhwb3J0IGNsYXNzIFN1YnNjcmlwdGlvbiBpbXBsZW1lbnRzIFN1YnNjcmlwdGlvbkxpa2Uge1xuICAvKiogQG5vY29sbGFwc2UgKi9cbiAgcHVibGljIHN0YXRpYyBFTVBUWTogU3Vic2NyaXB0aW9uID0gKGZ1bmN0aW9uKGVtcHR5OiBhbnkpIHtcbiAgICBlbXB0eS5jbG9zZWQgPSB0cnVlO1xuICAgIHJldHVybiBlbXB0eTtcbiAgfShuZXcgU3Vic2NyaXB0aW9uKCkpKTtcblxuICAvKipcbiAgICogQSBmbGFnIHRvIGluZGljYXRlIHdoZXRoZXIgdGhpcyBTdWJzY3JpcHRpb24gaGFzIGFscmVhZHkgYmVlbiB1bnN1YnNjcmliZWQuXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKi9cbiAgcHVibGljIGNsb3NlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJvdGVjdGVkIF9wYXJlbnQ6IFN1YnNjcmlwdGlvbiA9IG51bGw7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJvdGVjdGVkIF9wYXJlbnRzOiBTdWJzY3JpcHRpb25bXSA9IG51bGw7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJpdmF0ZSBfc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uTGlrZVtdID0gbnVsbDtcblxuICAvKipcbiAgICogQHBhcmFtIHtmdW5jdGlvbigpOiB2b2lkfSBbdW5zdWJzY3JpYmVdIEEgZnVuY3Rpb24gZGVzY3JpYmluZyBob3cgdG9cbiAgICogcGVyZm9ybSB0aGUgZGlzcG9zYWwgb2YgcmVzb3VyY2VzIHdoZW4gdGhlIGB1bnN1YnNjcmliZWAgbWV0aG9kIGlzIGNhbGxlZC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHVuc3Vic2NyaWJlPzogKCkgPT4gdm9pZCkge1xuICAgIGlmICh1bnN1YnNjcmliZSkge1xuICAgICAgKDxhbnk+IHRoaXMpLl91bnN1YnNjcmliZSA9IHVuc3Vic2NyaWJlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwb3NlcyB0aGUgcmVzb3VyY2VzIGhlbGQgYnkgdGhlIHN1YnNjcmlwdGlvbi4gTWF5LCBmb3IgaW5zdGFuY2UsIGNhbmNlbFxuICAgKiBhbiBvbmdvaW5nIE9ic2VydmFibGUgZXhlY3V0aW9uIG9yIGNhbmNlbCBhbnkgb3RoZXIgdHlwZSBvZiB3b3JrIHRoYXRcbiAgICogc3RhcnRlZCB3aGVuIHRoZSBTdWJzY3JpcHRpb24gd2FzIGNyZWF0ZWQuXG4gICAqIEByZXR1cm4ge3ZvaWR9XG4gICAqL1xuICB1bnN1YnNjcmliZSgpOiB2b2lkIHtcbiAgICBsZXQgaGFzRXJyb3JzID0gZmFsc2U7XG4gICAgbGV0IGVycm9yczogYW55W107XG5cbiAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgeyBfcGFyZW50LCBfcGFyZW50cywgX3Vuc3Vic2NyaWJlLCBfc3Vic2NyaXB0aW9ucyB9ID0gKDxhbnk+IHRoaXMpO1xuXG4gICAgdGhpcy5jbG9zZWQgPSB0cnVlO1xuICAgIHRoaXMuX3BhcmVudCA9IG51bGw7XG4gICAgdGhpcy5fcGFyZW50cyA9IG51bGw7XG4gICAgLy8gbnVsbCBvdXQgX3N1YnNjcmlwdGlvbnMgZmlyc3Qgc28gYW55IGNoaWxkIHN1YnNjcmlwdGlvbnMgdGhhdCBhdHRlbXB0XG4gICAgLy8gdG8gcmVtb3ZlIHRoZW1zZWx2ZXMgZnJvbSB0aGlzIHN1YnNjcmlwdGlvbiB3aWxsIG5vb3BcbiAgICB0aGlzLl9zdWJzY3JpcHRpb25zID0gbnVsbDtcblxuICAgIGxldCBpbmRleCA9IC0xO1xuICAgIGxldCBsZW4gPSBfcGFyZW50cyA/IF9wYXJlbnRzLmxlbmd0aCA6IDA7XG5cbiAgICAvLyBpZiB0aGlzLl9wYXJlbnQgaXMgbnVsbCwgdGhlbiBzbyBpcyB0aGlzLl9wYXJlbnRzLCBhbmQgd2VcbiAgICAvLyBkb24ndCBoYXZlIHRvIHJlbW92ZSBvdXJzZWx2ZXMgZnJvbSBhbnkgcGFyZW50IHN1YnNjcmlwdGlvbnMuXG4gICAgd2hpbGUgKF9wYXJlbnQpIHtcbiAgICAgIF9wYXJlbnQucmVtb3ZlKHRoaXMpO1xuICAgICAgLy8gaWYgdGhpcy5fcGFyZW50cyBpcyBudWxsIG9yIGluZGV4ID49IGxlbixcbiAgICAgIC8vIHRoZW4gX3BhcmVudCBpcyBzZXQgdG8gbnVsbCwgYW5kIHRoZSBsb29wIGV4aXRzXG4gICAgICBfcGFyZW50ID0gKytpbmRleCA8IGxlbiAmJiBfcGFyZW50c1tpbmRleF0gfHwgbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoaXNGdW5jdGlvbihfdW5zdWJzY3JpYmUpKSB7XG4gICAgICBsZXQgdHJpYWwgPSB0cnlDYXRjaChfdW5zdWJzY3JpYmUpLmNhbGwodGhpcyk7XG4gICAgICBpZiAodHJpYWwgPT09IGVycm9yT2JqZWN0KSB7XG4gICAgICAgIGhhc0Vycm9ycyA9IHRydWU7XG4gICAgICAgIGVycm9ycyA9IGVycm9ycyB8fCAoXG4gICAgICAgICAgZXJyb3JPYmplY3QuZSBpbnN0YW5jZW9mIFVuc3Vic2NyaXB0aW9uRXJyb3IgP1xuICAgICAgICAgICAgZmxhdHRlblVuc3Vic2NyaXB0aW9uRXJyb3JzKGVycm9yT2JqZWN0LmUuZXJyb3JzKSA6IFtlcnJvck9iamVjdC5lXVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpc0FycmF5KF9zdWJzY3JpcHRpb25zKSkge1xuXG4gICAgICBpbmRleCA9IC0xO1xuICAgICAgbGVuID0gX3N1YnNjcmlwdGlvbnMubGVuZ3RoO1xuXG4gICAgICB3aGlsZSAoKytpbmRleCA8IGxlbikge1xuICAgICAgICBjb25zdCBzdWIgPSBfc3Vic2NyaXB0aW9uc1tpbmRleF07XG4gICAgICAgIGlmIChpc09iamVjdChzdWIpKSB7XG4gICAgICAgICAgbGV0IHRyaWFsID0gdHJ5Q2F0Y2goc3ViLnVuc3Vic2NyaWJlKS5jYWxsKHN1Yik7XG4gICAgICAgICAgaWYgKHRyaWFsID09PSBlcnJvck9iamVjdCkge1xuICAgICAgICAgICAgaGFzRXJyb3JzID0gdHJ1ZTtcbiAgICAgICAgICAgIGVycm9ycyA9IGVycm9ycyB8fCBbXTtcbiAgICAgICAgICAgIGxldCBlcnIgPSBlcnJvck9iamVjdC5lO1xuICAgICAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIFVuc3Vic2NyaXB0aW9uRXJyb3IpIHtcbiAgICAgICAgICAgICAgZXJyb3JzID0gZXJyb3JzLmNvbmNhdChmbGF0dGVuVW5zdWJzY3JpcHRpb25FcnJvcnMoZXJyLmVycm9ycykpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZXJyb3JzLnB1c2goZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaGFzRXJyb3JzKSB7XG4gICAgICB0aHJvdyBuZXcgVW5zdWJzY3JpcHRpb25FcnJvcihlcnJvcnMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgdGVhciBkb3duIHRvIGJlIGNhbGxlZCBkdXJpbmcgdGhlIHVuc3Vic2NyaWJlKCkgb2YgdGhpc1xuICAgKiBTdWJzY3JpcHRpb24uXG4gICAqXG4gICAqIElmIHRoZSB0ZWFyIGRvd24gYmVpbmcgYWRkZWQgaXMgYSBzdWJzY3JpcHRpb24gdGhhdCBpcyBhbHJlYWR5XG4gICAqIHVuc3Vic2NyaWJlZCwgaXMgdGhlIHNhbWUgcmVmZXJlbmNlIGBhZGRgIGlzIGJlaW5nIGNhbGxlZCBvbiwgb3IgaXNcbiAgICogYFN1YnNjcmlwdGlvbi5FTVBUWWAsIGl0IHdpbGwgbm90IGJlIGFkZGVkLlxuICAgKlxuICAgKiBJZiB0aGlzIHN1YnNjcmlwdGlvbiBpcyBhbHJlYWR5IGluIGFuIGBjbG9zZWRgIHN0YXRlLCB0aGUgcGFzc2VkXG4gICAqIHRlYXIgZG93biBsb2dpYyB3aWxsIGJlIGV4ZWN1dGVkIGltbWVkaWF0ZWx5LlxuICAgKlxuICAgKiBAcGFyYW0ge1RlYXJkb3duTG9naWN9IHRlYXJkb3duIFRoZSBhZGRpdGlvbmFsIGxvZ2ljIHRvIGV4ZWN1dGUgb25cbiAgICogdGVhcmRvd24uXG4gICAqIEByZXR1cm4ge1N1YnNjcmlwdGlvbn0gUmV0dXJucyB0aGUgU3Vic2NyaXB0aW9uIHVzZWQgb3IgY3JlYXRlZCB0byBiZVxuICAgKiBhZGRlZCB0byB0aGUgaW5uZXIgc3Vic2NyaXB0aW9ucyBsaXN0LiBUaGlzIFN1YnNjcmlwdGlvbiBjYW4gYmUgdXNlZCB3aXRoXG4gICAqIGByZW1vdmUoKWAgdG8gcmVtb3ZlIHRoZSBwYXNzZWQgdGVhcmRvd24gbG9naWMgZnJvbSB0aGUgaW5uZXIgc3Vic2NyaXB0aW9uc1xuICAgKiBsaXN0LlxuICAgKi9cbiAgYWRkKHRlYXJkb3duOiBUZWFyZG93bkxvZ2ljKTogU3Vic2NyaXB0aW9uIHtcbiAgICBpZiAoIXRlYXJkb3duIHx8ICh0ZWFyZG93biA9PT0gU3Vic2NyaXB0aW9uLkVNUFRZKSkge1xuICAgICAgcmV0dXJuIFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgICB9XG5cbiAgICBpZiAodGVhcmRvd24gPT09IHRoaXMpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGxldCBzdWJzY3JpcHRpb24gPSAoPFN1YnNjcmlwdGlvbj4gdGVhcmRvd24pO1xuXG4gICAgc3dpdGNoICh0eXBlb2YgdGVhcmRvd24pIHtcbiAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgICAgc3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbig8KCgpID0+IHZvaWQpID4gdGVhcmRvd24pO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgaWYgKHN1YnNjcmlwdGlvbi5jbG9zZWQgfHwgdHlwZW9mIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzdWJzY3JpcHRpb24uX2FkZFBhcmVudCAhPT0gJ2Z1bmN0aW9uJyAvKiBxdWFjayBxdWFjayAqLykge1xuICAgICAgICAgIGNvbnN0IHRtcCA9IHN1YnNjcmlwdGlvbjtcbiAgICAgICAgICBzdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgICAgICAgc3Vic2NyaXB0aW9uLl9zdWJzY3JpcHRpb25zID0gW3RtcF07XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3VucmVjb2duaXplZCB0ZWFyZG93biAnICsgdGVhcmRvd24gKyAnIGFkZGVkIHRvIFN1YnNjcmlwdGlvbi4nKTtcbiAgICB9XG5cbiAgICBjb25zdCBzdWJzY3JpcHRpb25zID0gdGhpcy5fc3Vic2NyaXB0aW9ucyB8fCAodGhpcy5fc3Vic2NyaXB0aW9ucyA9IFtdKTtcblxuICAgIHN1YnNjcmlwdGlvbnMucHVzaChzdWJzY3JpcHRpb24pO1xuICAgIHN1YnNjcmlwdGlvbi5fYWRkUGFyZW50KHRoaXMpO1xuXG4gICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgU3Vic2NyaXB0aW9uIGZyb20gdGhlIGludGVybmFsIGxpc3Qgb2Ygc3Vic2NyaXB0aW9ucyB0aGF0IHdpbGxcbiAgICogdW5zdWJzY3JpYmUgZHVyaW5nIHRoZSB1bnN1YnNjcmliZSBwcm9jZXNzIG9mIHRoaXMgU3Vic2NyaXB0aW9uLlxuICAgKiBAcGFyYW0ge1N1YnNjcmlwdGlvbn0gc3Vic2NyaXB0aW9uIFRoZSBzdWJzY3JpcHRpb24gdG8gcmVtb3ZlLlxuICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgKi9cbiAgcmVtb3ZlKHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uKTogdm9pZCB7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IHRoaXMuX3N1YnNjcmlwdGlvbnM7XG4gICAgaWYgKHN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbkluZGV4ID0gc3Vic2NyaXB0aW9ucy5pbmRleE9mKHN1YnNjcmlwdGlvbik7XG4gICAgICBpZiAoc3Vic2NyaXB0aW9uSW5kZXggIT09IC0xKSB7XG4gICAgICAgIHN1YnNjcmlwdGlvbnMuc3BsaWNlKHN1YnNjcmlwdGlvbkluZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgX2FkZFBhcmVudChwYXJlbnQ6IFN1YnNjcmlwdGlvbikge1xuICAgIGxldCB7IF9wYXJlbnQsIF9wYXJlbnRzIH0gPSB0aGlzO1xuICAgIGlmICghX3BhcmVudCB8fCBfcGFyZW50ID09PSBwYXJlbnQpIHtcbiAgICAgIC8vIElmIHdlIGRvbid0IGhhdmUgYSBwYXJlbnQsIG9yIHRoZSBuZXcgcGFyZW50IGlzIHRoZSBzYW1lIGFzIHRoZVxuICAgICAgLy8gY3VycmVudCBwYXJlbnQsIHRoZW4gc2V0IHRoaXMuX3BhcmVudCB0byB0aGUgbmV3IHBhcmVudC5cbiAgICAgIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgICB9IGVsc2UgaWYgKCFfcGFyZW50cykge1xuICAgICAgLy8gSWYgdGhlcmUncyBhbHJlYWR5IG9uZSBwYXJlbnQsIGJ1dCBub3QgbXVsdGlwbGUsIGFsbG9jYXRlIGFuIEFycmF5IHRvXG4gICAgICAvLyBzdG9yZSB0aGUgcmVzdCBvZiB0aGUgcGFyZW50IFN1YnNjcmlwdGlvbnMuXG4gICAgICB0aGlzLl9wYXJlbnRzID0gW3BhcmVudF07XG4gICAgfSBlbHNlIGlmIChfcGFyZW50cy5pbmRleE9mKHBhcmVudCkgPT09IC0xKSB7XG4gICAgICAvLyBPbmx5IGFkZCB0aGUgbmV3IHBhcmVudCB0byB0aGUgX3BhcmVudHMgbGlzdCBpZiBpdCdzIG5vdCBhbHJlYWR5IHRoZXJlLlxuICAgICAgX3BhcmVudHMucHVzaChwYXJlbnQpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBmbGF0dGVuVW5zdWJzY3JpcHRpb25FcnJvcnMoZXJyb3JzOiBhbnlbXSkge1xuIHJldHVybiBlcnJvcnMucmVkdWNlKChlcnJzLCBlcnIpID0+IGVycnMuY29uY2F0KChlcnIgaW5zdGFuY2VvZiBVbnN1YnNjcmlwdGlvbkVycm9yKSA/IGVyci5lcnJvcnMgOiBlcnIpLCBbXSk7XG59XG4iXX0=