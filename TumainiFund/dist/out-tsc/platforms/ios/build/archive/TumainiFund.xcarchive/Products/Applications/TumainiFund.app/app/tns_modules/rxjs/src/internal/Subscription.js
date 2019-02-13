"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isArray_1 = require("./util/isArray");
var isObject_1 = require("./util/isObject");
var isFunction_1 = require("./util/isFunction");
var tryCatch_1 = require("./util/tryCatch");
var errorObject_1 = require("./util/errorObject");
var UnsubscriptionError_1 = require("./util/UnsubscriptionError");
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
var Subscription = /** @class */ (function () {
    /**
     * @param {function(): void} [unsubscribe] A function describing how to
     * perform the disposal of resources when the `unsubscribe` method is called.
     */
    function Subscription(unsubscribe) {
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
    Subscription.prototype.unsubscribe = function () {
        var hasErrors = false;
        var errors;
        if (this.closed) {
            return;
        }
        var _a = this, _parent = _a._parent, _parents = _a._parents, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
        this.closed = true;
        this._parent = null;
        this._parents = null;
        // null out _subscriptions first so any child subscriptions that attempt
        // to remove themselves from this subscription will noop
        this._subscriptions = null;
        var index = -1;
        var len = _parents ? _parents.length : 0;
        // if this._parent is null, then so is this._parents, and we
        // don't have to remove ourselves from any parent subscriptions.
        while (_parent) {
            _parent.remove(this);
            // if this._parents is null or index >= len,
            // then _parent is set to null, and the loop exits
            _parent = ++index < len && _parents[index] || null;
        }
        if (isFunction_1.isFunction(_unsubscribe)) {
            var trial = tryCatch_1.tryCatch(_unsubscribe).call(this);
            if (trial === errorObject_1.errorObject) {
                hasErrors = true;
                errors = errors || (errorObject_1.errorObject.e instanceof UnsubscriptionError_1.UnsubscriptionError ?
                    flattenUnsubscriptionErrors(errorObject_1.errorObject.e.errors) : [errorObject_1.errorObject.e]);
            }
        }
        if (isArray_1.isArray(_subscriptions)) {
            index = -1;
            len = _subscriptions.length;
            while (++index < len) {
                var sub = _subscriptions[index];
                if (isObject_1.isObject(sub)) {
                    var trial = tryCatch_1.tryCatch(sub.unsubscribe).call(sub);
                    if (trial === errorObject_1.errorObject) {
                        hasErrors = true;
                        errors = errors || [];
                        var err = errorObject_1.errorObject.e;
                        if (err instanceof UnsubscriptionError_1.UnsubscriptionError) {
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
            throw new UnsubscriptionError_1.UnsubscriptionError(errors);
        }
    };
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
    Subscription.prototype.add = function (teardown) {
        if (!teardown || (teardown === Subscription.EMPTY)) {
            return Subscription.EMPTY;
        }
        if (teardown === this) {
            return this;
        }
        var subscription = teardown;
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
                    var tmp = subscription;
                    subscription = new Subscription();
                    subscription._subscriptions = [tmp];
                }
                break;
            default:
                throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
        }
        var subscriptions = this._subscriptions || (this._subscriptions = []);
        subscriptions.push(subscription);
        subscription._addParent(this);
        return subscription;
    };
    /**
     * Removes a Subscription from the internal list of subscriptions that will
     * unsubscribe during the unsubscribe process of this Subscription.
     * @param {Subscription} subscription The subscription to remove.
     * @return {void}
     */
    Subscription.prototype.remove = function (subscription) {
        var subscriptions = this._subscriptions;
        if (subscriptions) {
            var subscriptionIndex = subscriptions.indexOf(subscription);
            if (subscriptionIndex !== -1) {
                subscriptions.splice(subscriptionIndex, 1);
            }
        }
    };
    /** @internal */
    Subscription.prototype._addParent = function (parent) {
        var _a = this, _parent = _a._parent, _parents = _a._parents;
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
    };
    /** @nocollapse */
    Subscription.EMPTY = (function (empty) {
        empty.closed = true;
        return empty;
    }(new Subscription()));
    return Subscription;
}());
exports.Subscription = Subscription;
function flattenUnsubscriptionErrors(errors) {
    return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError_1.UnsubscriptionError) ? err.errors : err); }, []);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3Vic2NyaXB0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9TdWJzY3JpcHRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwQ0FBeUM7QUFDekMsNENBQTJDO0FBQzNDLGdEQUErQztBQUMvQyw0Q0FBMkM7QUFDM0Msa0RBQWlEO0FBQ2pELGtFQUFpRTtBQUdqRTs7Ozs7Ozs7Ozs7R0FXRztBQUNIO0lBb0JFOzs7T0FHRztJQUNILHNCQUFZLFdBQXdCO1FBakJwQzs7O1dBR0c7UUFDSSxXQUFNLEdBQVksS0FBSyxDQUFDO1FBRS9CLGdCQUFnQjtRQUNOLFlBQU8sR0FBaUIsSUFBSSxDQUFDO1FBQ3ZDLGdCQUFnQjtRQUNOLGFBQVEsR0FBbUIsSUFBSSxDQUFDO1FBQzFDLGdCQUFnQjtRQUNSLG1CQUFjLEdBQXVCLElBQUksQ0FBQztRQU9oRCxJQUFJLFdBQVcsRUFBRTtZQUNSLElBQUssQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO1NBQ3pDO0lBQ0gsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsa0NBQVcsR0FBWDtRQUNFLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztRQUN0QixJQUFJLE1BQWEsQ0FBQztRQUVsQixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDZixPQUFPO1NBQ1I7UUFFRyxJQUFBLFNBQWtFLEVBQWhFLG9CQUFPLEVBQUUsc0JBQVEsRUFBRSw4QkFBWSxFQUFFLGtDQUErQixDQUFDO1FBRXZFLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ25CLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLHdFQUF3RTtRQUN4RSx3REFBd0Q7UUFDeEQsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7UUFFM0IsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDZixJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV6Qyw0REFBNEQ7UUFDNUQsZ0VBQWdFO1FBQ2hFLE9BQU8sT0FBTyxFQUFFO1lBQ2QsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyQiw0Q0FBNEM7WUFDNUMsa0RBQWtEO1lBQ2xELE9BQU8sR0FBRyxFQUFFLEtBQUssR0FBRyxHQUFHLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQztTQUNwRDtRQUVELElBQUksdUJBQVUsQ0FBQyxZQUFZLENBQUMsRUFBRTtZQUM1QixJQUFJLEtBQUssR0FBRyxtQkFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM5QyxJQUFJLEtBQUssS0FBSyx5QkFBVyxFQUFFO2dCQUN6QixTQUFTLEdBQUcsSUFBSSxDQUFDO2dCQUNqQixNQUFNLEdBQUcsTUFBTSxJQUFJLENBQ2pCLHlCQUFXLENBQUMsQ0FBQyxZQUFZLHlDQUFtQixDQUFDLENBQUM7b0JBQzVDLDJCQUEyQixDQUFDLHlCQUFXLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLHlCQUFXLENBQUMsQ0FBQyxDQUFDLENBQ3RFLENBQUM7YUFDSDtTQUNGO1FBRUQsSUFBSSxpQkFBTyxDQUFDLGNBQWMsQ0FBQyxFQUFFO1lBRTNCLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNYLEdBQUcsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDO1lBRTVCLE9BQU8sRUFBRSxLQUFLLEdBQUcsR0FBRyxFQUFFO2dCQUNwQixJQUFNLEdBQUcsR0FBRyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2xDLElBQUksbUJBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDakIsSUFBSSxLQUFLLEdBQUcsbUJBQVEsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNoRCxJQUFJLEtBQUssS0FBSyx5QkFBVyxFQUFFO3dCQUN6QixTQUFTLEdBQUcsSUFBSSxDQUFDO3dCQUNqQixNQUFNLEdBQUcsTUFBTSxJQUFJLEVBQUUsQ0FBQzt3QkFDdEIsSUFBSSxHQUFHLEdBQUcseUJBQVcsQ0FBQyxDQUFDLENBQUM7d0JBQ3hCLElBQUksR0FBRyxZQUFZLHlDQUFtQixFQUFFOzRCQUN0QyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQywyQkFBMkIsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzt5QkFDakU7NkJBQU07NEJBQ0wsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzt5QkFDbEI7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGO1FBRUQsSUFBSSxTQUFTLEVBQUU7WUFDYixNQUFNLElBQUkseUNBQW1CLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDdkM7SUFDSCxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7O09BaUJHO0lBQ0gsMEJBQUcsR0FBSCxVQUFJLFFBQXVCO1FBQ3pCLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxRQUFRLEtBQUssWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2xELE9BQU8sWUFBWSxDQUFDLEtBQUssQ0FBQztTQUMzQjtRQUVELElBQUksUUFBUSxLQUFLLElBQUksRUFBRTtZQUNyQixPQUFPLElBQUksQ0FBQztTQUNiO1FBRUQsSUFBSSxZQUFZLEdBQW1CLFFBQVMsQ0FBQztRQUU3QyxRQUFRLE9BQU8sUUFBUSxFQUFFO1lBQ3ZCLEtBQUssVUFBVTtnQkFDYixZQUFZLEdBQUcsSUFBSSxZQUFZLENBQWlCLFFBQVEsQ0FBQyxDQUFDO1lBQzVELEtBQUssUUFBUTtnQkFDWCxJQUFJLFlBQVksQ0FBQyxNQUFNLElBQUksT0FBTyxZQUFZLENBQUMsV0FBVyxLQUFLLFVBQVUsRUFBRTtvQkFDekUsT0FBTyxZQUFZLENBQUM7aUJBQ3JCO3FCQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtvQkFDdEIsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUMzQixPQUFPLFlBQVksQ0FBQztpQkFDckI7cUJBQU0sSUFBSSxPQUFPLFlBQVksQ0FBQyxVQUFVLEtBQUssVUFBVSxDQUFDLGlCQUFpQixFQUFFO29CQUMxRSxJQUFNLEdBQUcsR0FBRyxZQUFZLENBQUM7b0JBQ3pCLFlBQVksR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO29CQUNsQyxZQUFZLENBQUMsY0FBYyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ3JDO2dCQUNELE1BQU07WUFDUjtnQkFDRSxNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixHQUFHLFFBQVEsR0FBRyx5QkFBeUIsQ0FBQyxDQUFDO1NBQ3BGO1FBRUQsSUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGNBQWMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFFeEUsYUFBYSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNqQyxZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTlCLE9BQU8sWUFBWSxDQUFDO0lBQ3RCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILDZCQUFNLEdBQU4sVUFBTyxZQUEwQjtRQUMvQixJQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1FBQzFDLElBQUksYUFBYSxFQUFFO1lBQ2pCLElBQU0saUJBQWlCLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUM5RCxJQUFJLGlCQUFpQixLQUFLLENBQUMsQ0FBQyxFQUFFO2dCQUM1QixhQUFhLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQzVDO1NBQ0Y7SUFDSCxDQUFDO0lBRUQsZ0JBQWdCO0lBQ1IsaUNBQVUsR0FBbEIsVUFBbUIsTUFBb0I7UUFDakMsSUFBQSxTQUE0QixFQUExQixvQkFBTyxFQUFFLHNCQUFpQixDQUFDO1FBQ2pDLElBQUksQ0FBQyxPQUFPLElBQUksT0FBTyxLQUFLLE1BQU0sRUFBRTtZQUNsQyxrRUFBa0U7WUFDbEUsMkRBQTJEO1lBQzNELElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1NBQ3ZCO2FBQU0sSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNwQix3RUFBd0U7WUFDeEUsOENBQThDO1lBQzlDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUMxQjthQUFNLElBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUMxQywwRUFBMEU7WUFDMUUsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN2QjtJQUNILENBQUM7SUE5TEQsa0JBQWtCO0lBQ0osa0JBQUssR0FBaUIsQ0FBQyxVQUFTLEtBQVU7UUFDdEQsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDcEIsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDLENBQUMsSUFBSSxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUEyTHpCLG1CQUFDO0NBQUEsQUFoTUQsSUFnTUM7QUFoTVksb0NBQVk7QUFrTXpCLFNBQVMsMkJBQTJCLENBQUMsTUFBYTtJQUNqRCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBQyxJQUFJLEVBQUUsR0FBRyxJQUFLLE9BQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsWUFBWSx5Q0FBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBcEUsQ0FBb0UsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUMvRyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4vdXRpbC9pc0FycmF5JztcbmltcG9ydCB7IGlzT2JqZWN0IH0gZnJvbSAnLi91dGlsL2lzT2JqZWN0JztcbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuL3V0aWwvaXNGdW5jdGlvbic7XG5pbXBvcnQgeyB0cnlDYXRjaCB9IGZyb20gJy4vdXRpbC90cnlDYXRjaCc7XG5pbXBvcnQgeyBlcnJvck9iamVjdCB9IGZyb20gJy4vdXRpbC9lcnJvck9iamVjdCc7XG5pbXBvcnQgeyBVbnN1YnNjcmlwdGlvbkVycm9yIH0gZnJvbSAnLi91dGlsL1Vuc3Vic2NyaXB0aW9uRXJyb3InO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uTGlrZSwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4vdHlwZXMnO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBkaXNwb3NhYmxlIHJlc291cmNlLCBzdWNoIGFzIHRoZSBleGVjdXRpb24gb2YgYW4gT2JzZXJ2YWJsZS4gQVxuICogU3Vic2NyaXB0aW9uIGhhcyBvbmUgaW1wb3J0YW50IG1ldGhvZCwgYHVuc3Vic2NyaWJlYCwgdGhhdCB0YWtlcyBubyBhcmd1bWVudFxuICogYW5kIGp1c3QgZGlzcG9zZXMgdGhlIHJlc291cmNlIGhlbGQgYnkgdGhlIHN1YnNjcmlwdGlvbi5cbiAqXG4gKiBBZGRpdGlvbmFsbHksIHN1YnNjcmlwdGlvbnMgbWF5IGJlIGdyb3VwZWQgdG9nZXRoZXIgdGhyb3VnaCB0aGUgYGFkZCgpYFxuICogbWV0aG9kLCB3aGljaCB3aWxsIGF0dGFjaCBhIGNoaWxkIFN1YnNjcmlwdGlvbiB0byB0aGUgY3VycmVudCBTdWJzY3JpcHRpb24uXG4gKiBXaGVuIGEgU3Vic2NyaXB0aW9uIGlzIHVuc3Vic2NyaWJlZCwgYWxsIGl0cyBjaGlsZHJlbiAoYW5kIGl0cyBncmFuZGNoaWxkcmVuKVxuICogd2lsbCBiZSB1bnN1YnNjcmliZWQgYXMgd2VsbC5cbiAqXG4gKiBAY2xhc3MgU3Vic2NyaXB0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBTdWJzY3JpcHRpb24gaW1wbGVtZW50cyBTdWJzY3JpcHRpb25MaWtlIHtcbiAgLyoqIEBub2NvbGxhcHNlICovXG4gIHB1YmxpYyBzdGF0aWMgRU1QVFk6IFN1YnNjcmlwdGlvbiA9IChmdW5jdGlvbihlbXB0eTogYW55KSB7XG4gICAgZW1wdHkuY2xvc2VkID0gdHJ1ZTtcbiAgICByZXR1cm4gZW1wdHk7XG4gIH0obmV3IFN1YnNjcmlwdGlvbigpKSk7XG5cbiAgLyoqXG4gICAqIEEgZmxhZyB0byBpbmRpY2F0ZSB3aGV0aGVyIHRoaXMgU3Vic2NyaXB0aW9uIGhhcyBhbHJlYWR5IGJlZW4gdW5zdWJzY3JpYmVkLlxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIHB1YmxpYyBjbG9zZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogQGludGVybmFsICovXG4gIHByb3RlY3RlZCBfcGFyZW50OiBTdWJzY3JpcHRpb24gPSBudWxsO1xuICAvKiogQGludGVybmFsICovXG4gIHByb3RlY3RlZCBfcGFyZW50czogU3Vic2NyaXB0aW9uW10gPSBudWxsO1xuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgX3N1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbkxpa2VbXSA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oKTogdm9pZH0gW3Vuc3Vic2NyaWJlXSBBIGZ1bmN0aW9uIGRlc2NyaWJpbmcgaG93IHRvXG4gICAqIHBlcmZvcm0gdGhlIGRpc3Bvc2FsIG9mIHJlc291cmNlcyB3aGVuIHRoZSBgdW5zdWJzY3JpYmVgIG1ldGhvZCBpcyBjYWxsZWQuXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih1bnN1YnNjcmliZT86ICgpID0+IHZvaWQpIHtcbiAgICBpZiAodW5zdWJzY3JpYmUpIHtcbiAgICAgICg8YW55PiB0aGlzKS5fdW5zdWJzY3JpYmUgPSB1bnN1YnNjcmliZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGlzcG9zZXMgdGhlIHJlc291cmNlcyBoZWxkIGJ5IHRoZSBzdWJzY3JpcHRpb24uIE1heSwgZm9yIGluc3RhbmNlLCBjYW5jZWxcbiAgICogYW4gb25nb2luZyBPYnNlcnZhYmxlIGV4ZWN1dGlvbiBvciBjYW5jZWwgYW55IG90aGVyIHR5cGUgb2Ygd29yayB0aGF0XG4gICAqIHN0YXJ0ZWQgd2hlbiB0aGUgU3Vic2NyaXB0aW9uIHdhcyBjcmVhdGVkLlxuICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgKi9cbiAgdW5zdWJzY3JpYmUoKTogdm9pZCB7XG4gICAgbGV0IGhhc0Vycm9ycyA9IGZhbHNlO1xuICAgIGxldCBlcnJvcnM6IGFueVtdO1xuXG4gICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHsgX3BhcmVudCwgX3BhcmVudHMsIF91bnN1YnNjcmliZSwgX3N1YnNjcmlwdGlvbnMgfSA9ICg8YW55PiB0aGlzKTtcblxuICAgIHRoaXMuY2xvc2VkID0gdHJ1ZTtcbiAgICB0aGlzLl9wYXJlbnQgPSBudWxsO1xuICAgIHRoaXMuX3BhcmVudHMgPSBudWxsO1xuICAgIC8vIG51bGwgb3V0IF9zdWJzY3JpcHRpb25zIGZpcnN0IHNvIGFueSBjaGlsZCBzdWJzY3JpcHRpb25zIHRoYXQgYXR0ZW1wdFxuICAgIC8vIHRvIHJlbW92ZSB0aGVtc2VsdmVzIGZyb20gdGhpcyBzdWJzY3JpcHRpb24gd2lsbCBub29wXG4gICAgdGhpcy5fc3Vic2NyaXB0aW9ucyA9IG51bGw7XG5cbiAgICBsZXQgaW5kZXggPSAtMTtcbiAgICBsZXQgbGVuID0gX3BhcmVudHMgPyBfcGFyZW50cy5sZW5ndGggOiAwO1xuXG4gICAgLy8gaWYgdGhpcy5fcGFyZW50IGlzIG51bGwsIHRoZW4gc28gaXMgdGhpcy5fcGFyZW50cywgYW5kIHdlXG4gICAgLy8gZG9uJ3QgaGF2ZSB0byByZW1vdmUgb3Vyc2VsdmVzIGZyb20gYW55IHBhcmVudCBzdWJzY3JpcHRpb25zLlxuICAgIHdoaWxlIChfcGFyZW50KSB7XG4gICAgICBfcGFyZW50LnJlbW92ZSh0aGlzKTtcbiAgICAgIC8vIGlmIHRoaXMuX3BhcmVudHMgaXMgbnVsbCBvciBpbmRleCA+PSBsZW4sXG4gICAgICAvLyB0aGVuIF9wYXJlbnQgaXMgc2V0IHRvIG51bGwsIGFuZCB0aGUgbG9vcCBleGl0c1xuICAgICAgX3BhcmVudCA9ICsraW5kZXggPCBsZW4gJiYgX3BhcmVudHNbaW5kZXhdIHx8IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKGlzRnVuY3Rpb24oX3Vuc3Vic2NyaWJlKSkge1xuICAgICAgbGV0IHRyaWFsID0gdHJ5Q2F0Y2goX3Vuc3Vic2NyaWJlKS5jYWxsKHRoaXMpO1xuICAgICAgaWYgKHRyaWFsID09PSBlcnJvck9iamVjdCkge1xuICAgICAgICBoYXNFcnJvcnMgPSB0cnVlO1xuICAgICAgICBlcnJvcnMgPSBlcnJvcnMgfHwgKFxuICAgICAgICAgIGVycm9yT2JqZWN0LmUgaW5zdGFuY2VvZiBVbnN1YnNjcmlwdGlvbkVycm9yID9cbiAgICAgICAgICAgIGZsYXR0ZW5VbnN1YnNjcmlwdGlvbkVycm9ycyhlcnJvck9iamVjdC5lLmVycm9ycykgOiBbZXJyb3JPYmplY3QuZV1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaXNBcnJheShfc3Vic2NyaXB0aW9ucykpIHtcblxuICAgICAgaW5kZXggPSAtMTtcbiAgICAgIGxlbiA9IF9zdWJzY3JpcHRpb25zLmxlbmd0aDtcblxuICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW4pIHtcbiAgICAgICAgY29uc3Qgc3ViID0gX3N1YnNjcmlwdGlvbnNbaW5kZXhdO1xuICAgICAgICBpZiAoaXNPYmplY3Qoc3ViKSkge1xuICAgICAgICAgIGxldCB0cmlhbCA9IHRyeUNhdGNoKHN1Yi51bnN1YnNjcmliZSkuY2FsbChzdWIpO1xuICAgICAgICAgIGlmICh0cmlhbCA9PT0gZXJyb3JPYmplY3QpIHtcbiAgICAgICAgICAgIGhhc0Vycm9ycyA9IHRydWU7XG4gICAgICAgICAgICBlcnJvcnMgPSBlcnJvcnMgfHwgW107XG4gICAgICAgICAgICBsZXQgZXJyID0gZXJyb3JPYmplY3QuZTtcbiAgICAgICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBVbnN1YnNjcmlwdGlvbkVycm9yKSB7XG4gICAgICAgICAgICAgIGVycm9ycyA9IGVycm9ycy5jb25jYXQoZmxhdHRlblVuc3Vic2NyaXB0aW9uRXJyb3JzKGVyci5lcnJvcnMpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGVycm9ycy5wdXNoKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGhhc0Vycm9ycykge1xuICAgICAgdGhyb3cgbmV3IFVuc3Vic2NyaXB0aW9uRXJyb3IoZXJyb3JzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHRlYXIgZG93biB0byBiZSBjYWxsZWQgZHVyaW5nIHRoZSB1bnN1YnNjcmliZSgpIG9mIHRoaXNcbiAgICogU3Vic2NyaXB0aW9uLlxuICAgKlxuICAgKiBJZiB0aGUgdGVhciBkb3duIGJlaW5nIGFkZGVkIGlzIGEgc3Vic2NyaXB0aW9uIHRoYXQgaXMgYWxyZWFkeVxuICAgKiB1bnN1YnNjcmliZWQsIGlzIHRoZSBzYW1lIHJlZmVyZW5jZSBgYWRkYCBpcyBiZWluZyBjYWxsZWQgb24sIG9yIGlzXG4gICAqIGBTdWJzY3JpcHRpb24uRU1QVFlgLCBpdCB3aWxsIG5vdCBiZSBhZGRlZC5cbiAgICpcbiAgICogSWYgdGhpcyBzdWJzY3JpcHRpb24gaXMgYWxyZWFkeSBpbiBhbiBgY2xvc2VkYCBzdGF0ZSwgdGhlIHBhc3NlZFxuICAgKiB0ZWFyIGRvd24gbG9naWMgd2lsbCBiZSBleGVjdXRlZCBpbW1lZGlhdGVseS5cbiAgICpcbiAgICogQHBhcmFtIHtUZWFyZG93bkxvZ2ljfSB0ZWFyZG93biBUaGUgYWRkaXRpb25hbCBsb2dpYyB0byBleGVjdXRlIG9uXG4gICAqIHRlYXJkb3duLlxuICAgKiBAcmV0dXJuIHtTdWJzY3JpcHRpb259IFJldHVybnMgdGhlIFN1YnNjcmlwdGlvbiB1c2VkIG9yIGNyZWF0ZWQgdG8gYmVcbiAgICogYWRkZWQgdG8gdGhlIGlubmVyIHN1YnNjcmlwdGlvbnMgbGlzdC4gVGhpcyBTdWJzY3JpcHRpb24gY2FuIGJlIHVzZWQgd2l0aFxuICAgKiBgcmVtb3ZlKClgIHRvIHJlbW92ZSB0aGUgcGFzc2VkIHRlYXJkb3duIGxvZ2ljIGZyb20gdGhlIGlubmVyIHN1YnNjcmlwdGlvbnNcbiAgICogbGlzdC5cbiAgICovXG4gIGFkZCh0ZWFyZG93bjogVGVhcmRvd25Mb2dpYyk6IFN1YnNjcmlwdGlvbiB7XG4gICAgaWYgKCF0ZWFyZG93biB8fCAodGVhcmRvd24gPT09IFN1YnNjcmlwdGlvbi5FTVBUWSkpIHtcbiAgICAgIHJldHVybiBTdWJzY3JpcHRpb24uRU1QVFk7XG4gICAgfVxuXG4gICAgaWYgKHRlYXJkb3duID09PSB0aGlzKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBsZXQgc3Vic2NyaXB0aW9uID0gKDxTdWJzY3JpcHRpb24+IHRlYXJkb3duKTtcblxuICAgIHN3aXRjaCAodHlwZW9mIHRlYXJkb3duKSB7XG4gICAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICAgIHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oPCgoKSA9PiB2b2lkKSA+IHRlYXJkb3duKTtcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIGlmIChzdWJzY3JpcHRpb24uY2xvc2VkIHx8IHR5cGVvZiBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICAgICAgc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygc3Vic2NyaXB0aW9uLl9hZGRQYXJlbnQgIT09ICdmdW5jdGlvbicgLyogcXVhY2sgcXVhY2sgKi8pIHtcbiAgICAgICAgICBjb25zdCB0bXAgPSBzdWJzY3JpcHRpb247XG4gICAgICAgICAgc3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICAgICAgICAgIHN1YnNjcmlwdGlvbi5fc3Vic2NyaXB0aW9ucyA9IFt0bXBdO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bnJlY29nbml6ZWQgdGVhcmRvd24gJyArIHRlYXJkb3duICsgJyBhZGRlZCB0byBTdWJzY3JpcHRpb24uJyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IHRoaXMuX3N1YnNjcmlwdGlvbnMgfHwgKHRoaXMuX3N1YnNjcmlwdGlvbnMgPSBbXSk7XG5cbiAgICBzdWJzY3JpcHRpb25zLnB1c2goc3Vic2NyaXB0aW9uKTtcbiAgICBzdWJzY3JpcHRpb24uX2FkZFBhcmVudCh0aGlzKTtcblxuICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIFN1YnNjcmlwdGlvbiBmcm9tIHRoZSBpbnRlcm5hbCBsaXN0IG9mIHN1YnNjcmlwdGlvbnMgdGhhdCB3aWxsXG4gICAqIHVuc3Vic2NyaWJlIGR1cmluZyB0aGUgdW5zdWJzY3JpYmUgcHJvY2VzcyBvZiB0aGlzIFN1YnNjcmlwdGlvbi5cbiAgICogQHBhcmFtIHtTdWJzY3JpcHRpb259IHN1YnNjcmlwdGlvbiBUaGUgc3Vic2NyaXB0aW9uIHRvIHJlbW92ZS5cbiAgICogQHJldHVybiB7dm9pZH1cbiAgICovXG4gIHJlbW92ZShzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbik6IHZvaWQge1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSB0aGlzLl9zdWJzY3JpcHRpb25zO1xuICAgIGlmIChzdWJzY3JpcHRpb25zKSB7XG4gICAgICBjb25zdCBzdWJzY3JpcHRpb25JbmRleCA9IHN1YnNjcmlwdGlvbnMuaW5kZXhPZihzdWJzY3JpcHRpb24pO1xuICAgICAgaWYgKHN1YnNjcmlwdGlvbkluZGV4ICE9PSAtMSkge1xuICAgICAgICBzdWJzY3JpcHRpb25zLnNwbGljZShzdWJzY3JpcHRpb25JbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwcml2YXRlIF9hZGRQYXJlbnQocGFyZW50OiBTdWJzY3JpcHRpb24pIHtcbiAgICBsZXQgeyBfcGFyZW50LCBfcGFyZW50cyB9ID0gdGhpcztcbiAgICBpZiAoIV9wYXJlbnQgfHwgX3BhcmVudCA9PT0gcGFyZW50KSB7XG4gICAgICAvLyBJZiB3ZSBkb24ndCBoYXZlIGEgcGFyZW50LCBvciB0aGUgbmV3IHBhcmVudCBpcyB0aGUgc2FtZSBhcyB0aGVcbiAgICAgIC8vIGN1cnJlbnQgcGFyZW50LCB0aGVuIHNldCB0aGlzLl9wYXJlbnQgdG8gdGhlIG5ldyBwYXJlbnQuXG4gICAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gICAgfSBlbHNlIGlmICghX3BhcmVudHMpIHtcbiAgICAgIC8vIElmIHRoZXJlJ3MgYWxyZWFkeSBvbmUgcGFyZW50LCBidXQgbm90IG11bHRpcGxlLCBhbGxvY2F0ZSBhbiBBcnJheSB0b1xuICAgICAgLy8gc3RvcmUgdGhlIHJlc3Qgb2YgdGhlIHBhcmVudCBTdWJzY3JpcHRpb25zLlxuICAgICAgdGhpcy5fcGFyZW50cyA9IFtwYXJlbnRdO1xuICAgIH0gZWxzZSBpZiAoX3BhcmVudHMuaW5kZXhPZihwYXJlbnQpID09PSAtMSkge1xuICAgICAgLy8gT25seSBhZGQgdGhlIG5ldyBwYXJlbnQgdG8gdGhlIF9wYXJlbnRzIGxpc3QgaWYgaXQncyBub3QgYWxyZWFkeSB0aGVyZS5cbiAgICAgIF9wYXJlbnRzLnB1c2gocGFyZW50KTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZmxhdHRlblVuc3Vic2NyaXB0aW9uRXJyb3JzKGVycm9yczogYW55W10pIHtcbiByZXR1cm4gZXJyb3JzLnJlZHVjZSgoZXJycywgZXJyKSA9PiBlcnJzLmNvbmNhdCgoZXJyIGluc3RhbmNlb2YgVW5zdWJzY3JpcHRpb25FcnJvcikgPyBlcnIuZXJyb3JzIDogZXJyKSwgW10pO1xufVxuIl19