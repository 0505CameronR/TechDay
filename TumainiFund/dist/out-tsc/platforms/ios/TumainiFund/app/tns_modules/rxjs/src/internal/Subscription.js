import { isArray } from './util/isArray';
import { isObject } from './util/isObject';
import { isFunction } from './util/isFunction';
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
            try {
                _unsubscribe.call(this);
            }
            catch (e) {
                hasErrors = true;
                errors = e instanceof UnsubscriptionError ? flattenUnsubscriptionErrors(e.errors) : [e];
            }
        }
        if (isArray(_subscriptions)) {
            index = -1;
            len = _subscriptions.length;
            while (++index < len) {
                const sub = _subscriptions[index];
                if (isObject(sub)) {
                    try {
                        sub.unsubscribe();
                    }
                    catch (e) {
                        hasErrors = true;
                        errors = errors || [];
                        if (e instanceof UnsubscriptionError) {
                            errors = errors.concat(flattenUnsubscriptionErrors(e.errors));
                        }
                        else {
                            errors.push(e);
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
     * Subscription. Can also be used to add a child subscription.
     *
     * If the tear down being added is a subscription that is already
     * unsubscribed, is the same reference `add` is being called on, or is
     * `Subscription.EMPTY`, it will not be added.
     *
     * If this subscription is already in an `closed` state, the passed
     * tear down logic will be executed immediately.
     *
     * When a parent subscription is unsubscribed, any child subscriptions that were added to it are also unsubscribed.
     *
     * @param {TeardownLogic} teardown The additional logic to execute on
     * teardown.
     * @return {Subscription} Returns the Subscription used or created to be
     * added to the inner subscriptions list. This Subscription can be used with
     * `remove()` to remove the passed teardown logic from the inner subscriptions
     * list.
     */
    add(teardown) {
        let subscription = teardown;
        switch (typeof teardown) {
            case 'function':
                subscription = new Subscription(teardown);
            case 'object':
                if (subscription === this || subscription.closed || typeof subscription.unsubscribe !== 'function') {
                    // This also covers the case where `subscription` is `Subscription.EMPTY`, which is always in `closed` state.
                    return subscription;
                }
                else if (this.closed) {
                    subscription.unsubscribe();
                    return subscription;
                }
                else if (!(subscription instanceof Subscription)) {
                    const tmp = subscription;
                    subscription = new Subscription();
                    subscription._subscriptions = [tmp];
                }
                break;
            default: {
                if (!teardown) {
                    return Subscription.EMPTY;
                }
                throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
            }
        }
        if (subscription._addParent(this)) {
            // Optimize for the common case when adding the first subscription.
            const subscriptions = this._subscriptions;
            if (subscriptions) {
                subscriptions.push(subscription);
            }
            else {
                this._subscriptions = [subscription];
            }
        }
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
        if (_parent === parent) {
            // If the new parent is the same as the current parent, then do nothing.
            return false;
        }
        else if (!_parent) {
            // If we don't have a parent, then set this._parent to the new parent.
            this._parent = parent;
            return true;
        }
        else if (!_parents) {
            // If there's already one parent, but not multiple, allocate an Array to
            // store the rest of the parent Subscriptions.
            this._parents = [parent];
            return true;
        }
        else if (_parents.indexOf(parent) === -1) {
            // Only add the new parent to the _parents list if it's not already there.
            _parents.push(parent);
            return true;
        }
        return false;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3Vic2NyaXB0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvU3Vic2NyaXB0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6QyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBR2pFOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsTUFBTSxPQUFPLFlBQVk7SUFvQnZCOzs7T0FHRztJQUNILFlBQVksV0FBd0I7UUFqQnBDOzs7V0FHRztRQUNJLFdBQU0sR0FBWSxLQUFLLENBQUM7UUFFL0IsZ0JBQWdCO1FBQ04sWUFBTyxHQUFpQixJQUFJLENBQUM7UUFDdkMsZ0JBQWdCO1FBQ04sYUFBUSxHQUFtQixJQUFJLENBQUM7UUFDMUMsZ0JBQWdCO1FBQ1IsbUJBQWMsR0FBdUIsSUFBSSxDQUFDO1FBT2hELElBQUksV0FBVyxFQUFFO1lBQ1IsSUFBSyxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7U0FDekM7SUFDSCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxXQUFXO1FBQ1QsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLElBQUksTUFBYSxDQUFDO1FBRWxCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNmLE9BQU87U0FDUjtRQUVELElBQUksRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsR0FBVSxJQUFLLENBQUM7UUFFdkUsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDcEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDckIsd0VBQXdFO1FBQ3hFLHdEQUF3RDtRQUN4RCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztRQUUzQixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNmLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXpDLDREQUE0RDtRQUM1RCxnRUFBZ0U7UUFDaEUsT0FBTyxPQUFPLEVBQUU7WUFDZCxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JCLDRDQUE0QztZQUM1QyxrREFBa0Q7WUFDbEQsT0FBTyxHQUFHLEVBQUUsS0FBSyxHQUFHLEdBQUcsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDO1NBQ3BEO1FBRUQsSUFBSSxVQUFVLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFDNUIsSUFBSTtnQkFDRixZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3pCO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1YsU0FBUyxHQUFHLElBQUksQ0FBQztnQkFDakIsTUFBTSxHQUFHLENBQUMsWUFBWSxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3pGO1NBQ0Y7UUFFRCxJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUUzQixLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDWCxHQUFHLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQztZQUU1QixPQUFPLEVBQUUsS0FBSyxHQUFHLEdBQUcsRUFBRTtnQkFDcEIsTUFBTSxHQUFHLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNsQyxJQUFJLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDakIsSUFBSTt3QkFDRixHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7cUJBQ25CO29CQUFDLE9BQU8sQ0FBQyxFQUFFO3dCQUNWLFNBQVMsR0FBRyxJQUFJLENBQUM7d0JBQ2pCLE1BQU0sR0FBRyxNQUFNLElBQUksRUFBRSxDQUFDO3dCQUN0QixJQUFJLENBQUMsWUFBWSxtQkFBbUIsRUFBRTs0QkFDcEMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7eUJBQy9EOzZCQUFNOzRCQUNMLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQ2hCO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRjtRQUVELElBQUksU0FBUyxFQUFFO1lBQ2IsTUFBTSxJQUFJLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3ZDO0lBQ0gsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BbUJHO0lBQ0gsR0FBRyxDQUFDLFFBQXVCO1FBQ3pCLElBQUksWUFBWSxHQUFrQixRQUFTLENBQUM7UUFDNUMsUUFBUSxPQUFPLFFBQVEsRUFBRTtZQUN2QixLQUFLLFVBQVU7Z0JBQ2IsWUFBWSxHQUFHLElBQUksWUFBWSxDQUFlLFFBQVEsQ0FBQyxDQUFDO1lBQzFELEtBQUssUUFBUTtnQkFDWCxJQUFJLFlBQVksS0FBSyxJQUFJLElBQUksWUFBWSxDQUFDLE1BQU0sSUFBSSxPQUFPLFlBQVksQ0FBQyxXQUFXLEtBQUssVUFBVSxFQUFFO29CQUNsRyw2R0FBNkc7b0JBQzdHLE9BQU8sWUFBWSxDQUFDO2lCQUNyQjtxQkFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7b0JBQ3RCLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztvQkFDM0IsT0FBTyxZQUFZLENBQUM7aUJBQ3JCO3FCQUFNLElBQUksQ0FBQyxDQUFDLFlBQVksWUFBWSxZQUFZLENBQUMsRUFBRTtvQkFDbEQsTUFBTSxHQUFHLEdBQUcsWUFBWSxDQUFDO29CQUN6QixZQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztvQkFDbEMsWUFBWSxDQUFDLGNBQWMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNyQztnQkFDRCxNQUFNO1lBQ1IsT0FBTyxDQUFDLENBQUM7Z0JBQ1AsSUFBSSxDQUFPLFFBQVMsRUFBRTtvQkFDcEIsT0FBTyxZQUFZLENBQUMsS0FBSyxDQUFDO2lCQUMzQjtnQkFDRCxNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixHQUFHLFFBQVEsR0FBRyx5QkFBeUIsQ0FBQyxDQUFDO2FBQ2xGO1NBQ0Y7UUFFRCxJQUFJLFlBQVksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDakMsbUVBQW1FO1lBQ25FLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7WUFDMUMsSUFBSSxhQUFhLEVBQUU7Z0JBQ2pCLGFBQWEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7YUFDbEM7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQ3RDO1NBQ0Y7UUFFRCxPQUFPLFlBQVksQ0FBQztJQUN0QixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsWUFBMEI7UUFDL0IsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztRQUMxQyxJQUFJLGFBQWEsRUFBRTtZQUNqQixNQUFNLGlCQUFpQixHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDOUQsSUFBSSxpQkFBaUIsS0FBSyxDQUFDLENBQUMsRUFBRTtnQkFDNUIsYUFBYSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUM1QztTQUNGO0lBQ0gsQ0FBQztJQUVELGdCQUFnQjtJQUNSLFVBQVUsQ0FBQyxNQUFvQjtRQUNyQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQztRQUNqQyxJQUFJLE9BQU8sS0FBSyxNQUFNLEVBQUU7WUFDdEIsd0VBQXdFO1lBQ3hFLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7YUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ25CLHNFQUFzRTtZQUN0RSxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztZQUN0QixPQUFPLElBQUksQ0FBQztTQUNiO2FBQU0sSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNwQix3RUFBd0U7WUFDeEUsOENBQThDO1lBQzlDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN6QixPQUFPLElBQUksQ0FBQztTQUNiO2FBQU0sSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBQzFDLDBFQUEwRTtZQUMxRSxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3RCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7O0FBck1ELGtCQUFrQjtBQUNKLGtCQUFLLEdBQWlCLENBQUMsVUFBUyxLQUFVO0lBQ3RELEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQ3BCLE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyxDQUFDLElBQUksWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBb016QixTQUFTLDJCQUEyQixDQUFDLE1BQWE7SUFDakQsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsWUFBWSxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUMvRyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4vdXRpbC9pc0FycmF5JztcbmltcG9ydCB7IGlzT2JqZWN0IH0gZnJvbSAnLi91dGlsL2lzT2JqZWN0JztcbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuL3V0aWwvaXNGdW5jdGlvbic7XG5pbXBvcnQgeyBVbnN1YnNjcmlwdGlvbkVycm9yIH0gZnJvbSAnLi91dGlsL1Vuc3Vic2NyaXB0aW9uRXJyb3InO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uTGlrZSwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4vdHlwZXMnO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBkaXNwb3NhYmxlIHJlc291cmNlLCBzdWNoIGFzIHRoZSBleGVjdXRpb24gb2YgYW4gT2JzZXJ2YWJsZS4gQVxuICogU3Vic2NyaXB0aW9uIGhhcyBvbmUgaW1wb3J0YW50IG1ldGhvZCwgYHVuc3Vic2NyaWJlYCwgdGhhdCB0YWtlcyBubyBhcmd1bWVudFxuICogYW5kIGp1c3QgZGlzcG9zZXMgdGhlIHJlc291cmNlIGhlbGQgYnkgdGhlIHN1YnNjcmlwdGlvbi5cbiAqXG4gKiBBZGRpdGlvbmFsbHksIHN1YnNjcmlwdGlvbnMgbWF5IGJlIGdyb3VwZWQgdG9nZXRoZXIgdGhyb3VnaCB0aGUgYGFkZCgpYFxuICogbWV0aG9kLCB3aGljaCB3aWxsIGF0dGFjaCBhIGNoaWxkIFN1YnNjcmlwdGlvbiB0byB0aGUgY3VycmVudCBTdWJzY3JpcHRpb24uXG4gKiBXaGVuIGEgU3Vic2NyaXB0aW9uIGlzIHVuc3Vic2NyaWJlZCwgYWxsIGl0cyBjaGlsZHJlbiAoYW5kIGl0cyBncmFuZGNoaWxkcmVuKVxuICogd2lsbCBiZSB1bnN1YnNjcmliZWQgYXMgd2VsbC5cbiAqXG4gKiBAY2xhc3MgU3Vic2NyaXB0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBTdWJzY3JpcHRpb24gaW1wbGVtZW50cyBTdWJzY3JpcHRpb25MaWtlIHtcbiAgLyoqIEBub2NvbGxhcHNlICovXG4gIHB1YmxpYyBzdGF0aWMgRU1QVFk6IFN1YnNjcmlwdGlvbiA9IChmdW5jdGlvbihlbXB0eTogYW55KSB7XG4gICAgZW1wdHkuY2xvc2VkID0gdHJ1ZTtcbiAgICByZXR1cm4gZW1wdHk7XG4gIH0obmV3IFN1YnNjcmlwdGlvbigpKSk7XG5cbiAgLyoqXG4gICAqIEEgZmxhZyB0byBpbmRpY2F0ZSB3aGV0aGVyIHRoaXMgU3Vic2NyaXB0aW9uIGhhcyBhbHJlYWR5IGJlZW4gdW5zdWJzY3JpYmVkLlxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIHB1YmxpYyBjbG9zZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogQGludGVybmFsICovXG4gIHByb3RlY3RlZCBfcGFyZW50OiBTdWJzY3JpcHRpb24gPSBudWxsO1xuICAvKiogQGludGVybmFsICovXG4gIHByb3RlY3RlZCBfcGFyZW50czogU3Vic2NyaXB0aW9uW10gPSBudWxsO1xuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgX3N1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbkxpa2VbXSA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oKTogdm9pZH0gW3Vuc3Vic2NyaWJlXSBBIGZ1bmN0aW9uIGRlc2NyaWJpbmcgaG93IHRvXG4gICAqIHBlcmZvcm0gdGhlIGRpc3Bvc2FsIG9mIHJlc291cmNlcyB3aGVuIHRoZSBgdW5zdWJzY3JpYmVgIG1ldGhvZCBpcyBjYWxsZWQuXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih1bnN1YnNjcmliZT86ICgpID0+IHZvaWQpIHtcbiAgICBpZiAodW5zdWJzY3JpYmUpIHtcbiAgICAgICg8YW55PiB0aGlzKS5fdW5zdWJzY3JpYmUgPSB1bnN1YnNjcmliZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGlzcG9zZXMgdGhlIHJlc291cmNlcyBoZWxkIGJ5IHRoZSBzdWJzY3JpcHRpb24uIE1heSwgZm9yIGluc3RhbmNlLCBjYW5jZWxcbiAgICogYW4gb25nb2luZyBPYnNlcnZhYmxlIGV4ZWN1dGlvbiBvciBjYW5jZWwgYW55IG90aGVyIHR5cGUgb2Ygd29yayB0aGF0XG4gICAqIHN0YXJ0ZWQgd2hlbiB0aGUgU3Vic2NyaXB0aW9uIHdhcyBjcmVhdGVkLlxuICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgKi9cbiAgdW5zdWJzY3JpYmUoKTogdm9pZCB7XG4gICAgbGV0IGhhc0Vycm9ycyA9IGZhbHNlO1xuICAgIGxldCBlcnJvcnM6IGFueVtdO1xuXG4gICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHsgX3BhcmVudCwgX3BhcmVudHMsIF91bnN1YnNjcmliZSwgX3N1YnNjcmlwdGlvbnMgfSA9ICg8YW55PiB0aGlzKTtcblxuICAgIHRoaXMuY2xvc2VkID0gdHJ1ZTtcbiAgICB0aGlzLl9wYXJlbnQgPSBudWxsO1xuICAgIHRoaXMuX3BhcmVudHMgPSBudWxsO1xuICAgIC8vIG51bGwgb3V0IF9zdWJzY3JpcHRpb25zIGZpcnN0IHNvIGFueSBjaGlsZCBzdWJzY3JpcHRpb25zIHRoYXQgYXR0ZW1wdFxuICAgIC8vIHRvIHJlbW92ZSB0aGVtc2VsdmVzIGZyb20gdGhpcyBzdWJzY3JpcHRpb24gd2lsbCBub29wXG4gICAgdGhpcy5fc3Vic2NyaXB0aW9ucyA9IG51bGw7XG5cbiAgICBsZXQgaW5kZXggPSAtMTtcbiAgICBsZXQgbGVuID0gX3BhcmVudHMgPyBfcGFyZW50cy5sZW5ndGggOiAwO1xuXG4gICAgLy8gaWYgdGhpcy5fcGFyZW50IGlzIG51bGwsIHRoZW4gc28gaXMgdGhpcy5fcGFyZW50cywgYW5kIHdlXG4gICAgLy8gZG9uJ3QgaGF2ZSB0byByZW1vdmUgb3Vyc2VsdmVzIGZyb20gYW55IHBhcmVudCBzdWJzY3JpcHRpb25zLlxuICAgIHdoaWxlIChfcGFyZW50KSB7XG4gICAgICBfcGFyZW50LnJlbW92ZSh0aGlzKTtcbiAgICAgIC8vIGlmIHRoaXMuX3BhcmVudHMgaXMgbnVsbCBvciBpbmRleCA+PSBsZW4sXG4gICAgICAvLyB0aGVuIF9wYXJlbnQgaXMgc2V0IHRvIG51bGwsIGFuZCB0aGUgbG9vcCBleGl0c1xuICAgICAgX3BhcmVudCA9ICsraW5kZXggPCBsZW4gJiYgX3BhcmVudHNbaW5kZXhdIHx8IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKGlzRnVuY3Rpb24oX3Vuc3Vic2NyaWJlKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgX3Vuc3Vic2NyaWJlLmNhbGwodGhpcyk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGhhc0Vycm9ycyA9IHRydWU7XG4gICAgICAgIGVycm9ycyA9IGUgaW5zdGFuY2VvZiBVbnN1YnNjcmlwdGlvbkVycm9yID8gZmxhdHRlblVuc3Vic2NyaXB0aW9uRXJyb3JzKGUuZXJyb3JzKSA6IFtlXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaXNBcnJheShfc3Vic2NyaXB0aW9ucykpIHtcblxuICAgICAgaW5kZXggPSAtMTtcbiAgICAgIGxlbiA9IF9zdWJzY3JpcHRpb25zLmxlbmd0aDtcblxuICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW4pIHtcbiAgICAgICAgY29uc3Qgc3ViID0gX3N1YnNjcmlwdGlvbnNbaW5kZXhdO1xuICAgICAgICBpZiAoaXNPYmplY3Qoc3ViKSkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzdWIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBoYXNFcnJvcnMgPSB0cnVlO1xuICAgICAgICAgICAgZXJyb3JzID0gZXJyb3JzIHx8IFtdO1xuICAgICAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBVbnN1YnNjcmlwdGlvbkVycm9yKSB7XG4gICAgICAgICAgICAgIGVycm9ycyA9IGVycm9ycy5jb25jYXQoZmxhdHRlblVuc3Vic2NyaXB0aW9uRXJyb3JzKGUuZXJyb3JzKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBlcnJvcnMucHVzaChlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaGFzRXJyb3JzKSB7XG4gICAgICB0aHJvdyBuZXcgVW5zdWJzY3JpcHRpb25FcnJvcihlcnJvcnMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgdGVhciBkb3duIHRvIGJlIGNhbGxlZCBkdXJpbmcgdGhlIHVuc3Vic2NyaWJlKCkgb2YgdGhpc1xuICAgKiBTdWJzY3JpcHRpb24uIENhbiBhbHNvIGJlIHVzZWQgdG8gYWRkIGEgY2hpbGQgc3Vic2NyaXB0aW9uLlxuICAgKlxuICAgKiBJZiB0aGUgdGVhciBkb3duIGJlaW5nIGFkZGVkIGlzIGEgc3Vic2NyaXB0aW9uIHRoYXQgaXMgYWxyZWFkeVxuICAgKiB1bnN1YnNjcmliZWQsIGlzIHRoZSBzYW1lIHJlZmVyZW5jZSBgYWRkYCBpcyBiZWluZyBjYWxsZWQgb24sIG9yIGlzXG4gICAqIGBTdWJzY3JpcHRpb24uRU1QVFlgLCBpdCB3aWxsIG5vdCBiZSBhZGRlZC5cbiAgICpcbiAgICogSWYgdGhpcyBzdWJzY3JpcHRpb24gaXMgYWxyZWFkeSBpbiBhbiBgY2xvc2VkYCBzdGF0ZSwgdGhlIHBhc3NlZFxuICAgKiB0ZWFyIGRvd24gbG9naWMgd2lsbCBiZSBleGVjdXRlZCBpbW1lZGlhdGVseS5cbiAgICpcbiAgICogV2hlbiBhIHBhcmVudCBzdWJzY3JpcHRpb24gaXMgdW5zdWJzY3JpYmVkLCBhbnkgY2hpbGQgc3Vic2NyaXB0aW9ucyB0aGF0IHdlcmUgYWRkZWQgdG8gaXQgYXJlIGFsc28gdW5zdWJzY3JpYmVkLlxuICAgKlxuICAgKiBAcGFyYW0ge1RlYXJkb3duTG9naWN9IHRlYXJkb3duIFRoZSBhZGRpdGlvbmFsIGxvZ2ljIHRvIGV4ZWN1dGUgb25cbiAgICogdGVhcmRvd24uXG4gICAqIEByZXR1cm4ge1N1YnNjcmlwdGlvbn0gUmV0dXJucyB0aGUgU3Vic2NyaXB0aW9uIHVzZWQgb3IgY3JlYXRlZCB0byBiZVxuICAgKiBhZGRlZCB0byB0aGUgaW5uZXIgc3Vic2NyaXB0aW9ucyBsaXN0LiBUaGlzIFN1YnNjcmlwdGlvbiBjYW4gYmUgdXNlZCB3aXRoXG4gICAqIGByZW1vdmUoKWAgdG8gcmVtb3ZlIHRoZSBwYXNzZWQgdGVhcmRvd24gbG9naWMgZnJvbSB0aGUgaW5uZXIgc3Vic2NyaXB0aW9uc1xuICAgKiBsaXN0LlxuICAgKi9cbiAgYWRkKHRlYXJkb3duOiBUZWFyZG93bkxvZ2ljKTogU3Vic2NyaXB0aW9uIHtcbiAgICBsZXQgc3Vic2NyaXB0aW9uID0gKDxTdWJzY3JpcHRpb24+dGVhcmRvd24pO1xuICAgIHN3aXRjaCAodHlwZW9mIHRlYXJkb3duKSB7XG4gICAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICAgIHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oPCgoKSA9PiB2b2lkKT50ZWFyZG93bik7XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBpZiAoc3Vic2NyaXB0aW9uID09PSB0aGlzIHx8IHN1YnNjcmlwdGlvbi5jbG9zZWQgfHwgdHlwZW9mIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIC8vIFRoaXMgYWxzbyBjb3ZlcnMgdGhlIGNhc2Ugd2hlcmUgYHN1YnNjcmlwdGlvbmAgaXMgYFN1YnNjcmlwdGlvbi5FTVBUWWAsIHdoaWNoIGlzIGFsd2F5cyBpbiBgY2xvc2VkYCBzdGF0ZS5cbiAgICAgICAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICAgICAgc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgICAgICAgfSBlbHNlIGlmICghKHN1YnNjcmlwdGlvbiBpbnN0YW5jZW9mIFN1YnNjcmlwdGlvbikpIHtcbiAgICAgICAgICBjb25zdCB0bXAgPSBzdWJzY3JpcHRpb247XG4gICAgICAgICAgc3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICAgICAgICAgIHN1YnNjcmlwdGlvbi5fc3Vic2NyaXB0aW9ucyA9IFt0bXBdO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDoge1xuICAgICAgICBpZiAoISg8YW55PnRlYXJkb3duKSkge1xuICAgICAgICAgIHJldHVybiBTdWJzY3JpcHRpb24uRU1QVFk7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bnJlY29nbml6ZWQgdGVhcmRvd24gJyArIHRlYXJkb3duICsgJyBhZGRlZCB0byBTdWJzY3JpcHRpb24uJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN1YnNjcmlwdGlvbi5fYWRkUGFyZW50KHRoaXMpKSB7XG4gICAgICAvLyBPcHRpbWl6ZSBmb3IgdGhlIGNvbW1vbiBjYXNlIHdoZW4gYWRkaW5nIHRoZSBmaXJzdCBzdWJzY3JpcHRpb24uXG4gICAgICBjb25zdCBzdWJzY3JpcHRpb25zID0gdGhpcy5fc3Vic2NyaXB0aW9ucztcbiAgICAgIGlmIChzdWJzY3JpcHRpb25zKSB7XG4gICAgICAgIHN1YnNjcmlwdGlvbnMucHVzaChzdWJzY3JpcHRpb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucyA9IFtzdWJzY3JpcHRpb25dO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIFN1YnNjcmlwdGlvbiBmcm9tIHRoZSBpbnRlcm5hbCBsaXN0IG9mIHN1YnNjcmlwdGlvbnMgdGhhdCB3aWxsXG4gICAqIHVuc3Vic2NyaWJlIGR1cmluZyB0aGUgdW5zdWJzY3JpYmUgcHJvY2VzcyBvZiB0aGlzIFN1YnNjcmlwdGlvbi5cbiAgICogQHBhcmFtIHtTdWJzY3JpcHRpb259IHN1YnNjcmlwdGlvbiBUaGUgc3Vic2NyaXB0aW9uIHRvIHJlbW92ZS5cbiAgICogQHJldHVybiB7dm9pZH1cbiAgICovXG4gIHJlbW92ZShzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbik6IHZvaWQge1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSB0aGlzLl9zdWJzY3JpcHRpb25zO1xuICAgIGlmIChzdWJzY3JpcHRpb25zKSB7XG4gICAgICBjb25zdCBzdWJzY3JpcHRpb25JbmRleCA9IHN1YnNjcmlwdGlvbnMuaW5kZXhPZihzdWJzY3JpcHRpb24pO1xuICAgICAgaWYgKHN1YnNjcmlwdGlvbkluZGV4ICE9PSAtMSkge1xuICAgICAgICBzdWJzY3JpcHRpb25zLnNwbGljZShzdWJzY3JpcHRpb25JbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwcml2YXRlIF9hZGRQYXJlbnQocGFyZW50OiBTdWJzY3JpcHRpb24pOiBib29sZWFuIHtcbiAgICBsZXQgeyBfcGFyZW50LCBfcGFyZW50cyB9ID0gdGhpcztcbiAgICBpZiAoX3BhcmVudCA9PT0gcGFyZW50KSB7XG4gICAgICAvLyBJZiB0aGUgbmV3IHBhcmVudCBpcyB0aGUgc2FtZSBhcyB0aGUgY3VycmVudCBwYXJlbnQsIHRoZW4gZG8gbm90aGluZy5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKCFfcGFyZW50KSB7XG4gICAgICAvLyBJZiB3ZSBkb24ndCBoYXZlIGEgcGFyZW50LCB0aGVuIHNldCB0aGlzLl9wYXJlbnQgdG8gdGhlIG5ldyBwYXJlbnQuXG4gICAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKCFfcGFyZW50cykge1xuICAgICAgLy8gSWYgdGhlcmUncyBhbHJlYWR5IG9uZSBwYXJlbnQsIGJ1dCBub3QgbXVsdGlwbGUsIGFsbG9jYXRlIGFuIEFycmF5IHRvXG4gICAgICAvLyBzdG9yZSB0aGUgcmVzdCBvZiB0aGUgcGFyZW50IFN1YnNjcmlwdGlvbnMuXG4gICAgICB0aGlzLl9wYXJlbnRzID0gW3BhcmVudF07XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKF9wYXJlbnRzLmluZGV4T2YocGFyZW50KSA9PT0gLTEpIHtcbiAgICAgIC8vIE9ubHkgYWRkIHRoZSBuZXcgcGFyZW50IHRvIHRoZSBfcGFyZW50cyBsaXN0IGlmIGl0J3Mgbm90IGFscmVhZHkgdGhlcmUuXG4gICAgICBfcGFyZW50cy5wdXNoKHBhcmVudCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZsYXR0ZW5VbnN1YnNjcmlwdGlvbkVycm9ycyhlcnJvcnM6IGFueVtdKSB7XG4gcmV0dXJuIGVycm9ycy5yZWR1Y2UoKGVycnMsIGVycikgPT4gZXJycy5jb25jYXQoKGVyciBpbnN0YW5jZW9mIFVuc3Vic2NyaXB0aW9uRXJyb3IpID8gZXJyLmVycm9ycyA6IGVyciksIFtdKTtcbn1cbiJdfQ==