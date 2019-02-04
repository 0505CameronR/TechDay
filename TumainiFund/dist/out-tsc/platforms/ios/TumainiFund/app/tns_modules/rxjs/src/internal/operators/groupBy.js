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
var Subscriber_1 = require("../Subscriber");
var Subscription_1 = require("../Subscription");
var Observable_1 = require("../Observable");
var Subject_1 = require("../Subject");
/* tslint:enable:max-line-length */
/**
 * Groups the items emitted by an Observable according to a specified criterion,
 * and emits these grouped items as `GroupedObservables`, one
 * {@link GroupedObservable} per group.
 *
 * ![](groupBy.png)
 *
 * When the Observable emits an item, a key is computed for this item with the keySelector function.
 *
 * If a {@link GroupedObservable} for this key exists, this {@link GroupedObservable} emits. Elsewhere, a new
 * {@link GroupedObservable} for this key is created and emits.
 *
 * A {@link GroupedObservable} represents values belonging to the same group represented by a common key. The common
 * key is available as the key field of a {@link GroupedObservable} instance.
 *
 * The elements emitted by {@link GroupedObservable}s are by default the items emitted by the Observable, or elements
 * returned by the elementSelector function.
 *
 * ## Examples
 * ### Group objects by id and return as array
 * ```javascript
 * import { mergeMap, groupBy } from 'rxjs/operators';
 * import { of } from 'rxjs/observable/of';
 *
 * interface Obj {
 *    id: number,
 *    name: string,
 * }
 *
 * of<Obj>(
 *   {id: 1, name: 'javascript'},
 *   {id: 2, name: 'parcel'},
 *   {id: 2, name: 'webpack'},
 *   {id: 1, name: 'typescript'},
 *   {id: 3, name: 'tslint'}
 * ).pipe(
 *   groupBy(p => p.id),
 *   mergeMap((group$) => group$.pipe(reduce((acc, cur) => [...acc, cur], []))),
 * )
 * .subscribe(p => console.log(p));
 *
 * // displays:
 * // [ { id: 1, name: 'javascript'},
 * //   { id: 1, name: 'typescript'} ]
 * //
 * // [ { id: 2, name: 'parcel'},
 * //   { id: 2, name: 'webpack'} ]
 * //
 * // [ { id: 3, name: 'tslint'} ]
 * ```
 *
 * ### Pivot data on the id field
 * ```javascript
 * import { mergeMap, groupBy, map } from 'rxjs/operators';
 * import { of } from 'rxjs/observable/of';
 *
 * of<Obj>(
 *   {id: 1, name: 'javascript'},
 *   {id: 2, name: 'parcel'},
 *   {id: 2, name: 'webpack'},
 *   {id: 1, name: 'typescript'}
 *   {id: 3, name: 'tslint'}
 * ).pipe(
 *   groupBy(p => p.id, p => p.name),
 *   mergeMap( (group$) => group$.pipe(reduce((acc, cur) => [...acc, cur], ["" + group$.key]))),
 *   map(arr => ({'id': parseInt(arr[0]), 'values': arr.slice(1)})),
 * )
 * .subscribe(p => console.log(p));
 *
 * // displays:
 * // { id: 1, values: [ 'javascript', 'typescript' ] }
 * // { id: 2, values: [ 'parcel', 'webpack' ] }
 * // { id: 3, values: [ 'tslint' ] }
 * ```
 *
 * @param {function(value: T): K} keySelector A function that extracts the key
 * for each item.
 * @param {function(value: T): R} [elementSelector] A function that extracts the
 * return element for each item.
 * @param {function(grouped: GroupedObservable<K,R>): Observable<any>} [durationSelector]
 * A function that returns an Observable to determine how long each group should
 * exist.
 * @return {Observable<GroupedObservable<K,R>>} An Observable that emits
 * GroupedObservables, each of which corresponds to a unique key value and each
 * of which emits those items from the source Observable that share that key
 * value.
 * @method groupBy
 * @owner Observable
 */
function groupBy(keySelector, elementSelector, durationSelector, subjectSelector) {
    return function (source) {
        return source.lift(new GroupByOperator(keySelector, elementSelector, durationSelector, subjectSelector));
    };
}
exports.groupBy = groupBy;
var GroupByOperator = /** @class */ (function () {
    function GroupByOperator(keySelector, elementSelector, durationSelector, subjectSelector) {
        this.keySelector = keySelector;
        this.elementSelector = elementSelector;
        this.durationSelector = durationSelector;
        this.subjectSelector = subjectSelector;
    }
    GroupByOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new GroupBySubscriber(subscriber, this.keySelector, this.elementSelector, this.durationSelector, this.subjectSelector));
    };
    return GroupByOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var GroupBySubscriber = /** @class */ (function (_super) {
    __extends(GroupBySubscriber, _super);
    function GroupBySubscriber(destination, keySelector, elementSelector, durationSelector, subjectSelector) {
        var _this = _super.call(this, destination) || this;
        _this.keySelector = keySelector;
        _this.elementSelector = elementSelector;
        _this.durationSelector = durationSelector;
        _this.subjectSelector = subjectSelector;
        _this.groups = null;
        _this.attemptedToUnsubscribe = false;
        _this.count = 0;
        return _this;
    }
    GroupBySubscriber.prototype._next = function (value) {
        var key;
        try {
            key = this.keySelector(value);
        }
        catch (err) {
            this.error(err);
            return;
        }
        this._group(value, key);
    };
    GroupBySubscriber.prototype._group = function (value, key) {
        var groups = this.groups;
        if (!groups) {
            groups = this.groups = new Map();
        }
        var group = groups.get(key);
        var element;
        if (this.elementSelector) {
            try {
                element = this.elementSelector(value);
            }
            catch (err) {
                this.error(err);
            }
        }
        else {
            element = value;
        }
        if (!group) {
            group = (this.subjectSelector ? this.subjectSelector() : new Subject_1.Subject());
            groups.set(key, group);
            var groupedObservable = new GroupedObservable(key, group, this);
            this.destination.next(groupedObservable);
            if (this.durationSelector) {
                var duration = void 0;
                try {
                    duration = this.durationSelector(new GroupedObservable(key, group));
                }
                catch (err) {
                    this.error(err);
                    return;
                }
                this.add(duration.subscribe(new GroupDurationSubscriber(key, group, this)));
            }
        }
        if (!group.closed) {
            group.next(element);
        }
    };
    GroupBySubscriber.prototype._error = function (err) {
        var groups = this.groups;
        if (groups) {
            groups.forEach(function (group, key) {
                group.error(err);
            });
            groups.clear();
        }
        this.destination.error(err);
    };
    GroupBySubscriber.prototype._complete = function () {
        var groups = this.groups;
        if (groups) {
            groups.forEach(function (group, key) {
                group.complete();
            });
            groups.clear();
        }
        this.destination.complete();
    };
    GroupBySubscriber.prototype.removeGroup = function (key) {
        this.groups.delete(key);
    };
    GroupBySubscriber.prototype.unsubscribe = function () {
        if (!this.closed) {
            this.attemptedToUnsubscribe = true;
            if (this.count === 0) {
                _super.prototype.unsubscribe.call(this);
            }
        }
    };
    return GroupBySubscriber;
}(Subscriber_1.Subscriber));
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var GroupDurationSubscriber = /** @class */ (function (_super) {
    __extends(GroupDurationSubscriber, _super);
    function GroupDurationSubscriber(key, group, parent) {
        var _this = _super.call(this, group) || this;
        _this.key = key;
        _this.group = group;
        _this.parent = parent;
        return _this;
    }
    GroupDurationSubscriber.prototype._next = function (value) {
        this.complete();
    };
    /** @deprecated This is an internal implementation detail, do not use. */
    GroupDurationSubscriber.prototype._unsubscribe = function () {
        var _a = this, parent = _a.parent, key = _a.key;
        this.key = this.parent = null;
        if (parent) {
            parent.removeGroup(key);
        }
    };
    return GroupDurationSubscriber;
}(Subscriber_1.Subscriber));
/**
 * An Observable representing values belonging to the same group represented by
 * a common key. The values emitted by a GroupedObservable come from the source
 * Observable. The common key is available as the field `key` on a
 * GroupedObservable instance.
 *
 * @class GroupedObservable<K, T>
 */
var GroupedObservable = /** @class */ (function (_super) {
    __extends(GroupedObservable, _super);
    /** @deprecated Do not construct this type. Internal use only */
    function GroupedObservable(key, groupSubject, refCountSubscription) {
        var _this = _super.call(this) || this;
        _this.key = key;
        _this.groupSubject = groupSubject;
        _this.refCountSubscription = refCountSubscription;
        return _this;
    }
    /** @deprecated This is an internal implementation detail, do not use. */
    GroupedObservable.prototype._subscribe = function (subscriber) {
        var subscription = new Subscription_1.Subscription();
        var _a = this, refCountSubscription = _a.refCountSubscription, groupSubject = _a.groupSubject;
        if (refCountSubscription && !refCountSubscription.closed) {
            subscription.add(new InnerRefCountSubscription(refCountSubscription));
        }
        subscription.add(groupSubject.subscribe(subscriber));
        return subscription;
    };
    return GroupedObservable;
}(Observable_1.Observable));
exports.GroupedObservable = GroupedObservable;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var InnerRefCountSubscription = /** @class */ (function (_super) {
    __extends(InnerRefCountSubscription, _super);
    function InnerRefCountSubscription(parent) {
        var _this = _super.call(this) || this;
        _this.parent = parent;
        parent.count++;
        return _this;
    }
    InnerRefCountSubscription.prototype.unsubscribe = function () {
        var parent = this.parent;
        if (!parent.closed && !this.closed) {
            _super.prototype.unsubscribe.call(this);
            parent.count -= 1;
            if (parent.count === 0 && parent.attemptedToUnsubscribe) {
                parent.unsubscribe();
            }
        }
    };
    return InnerRefCountSubscription;
}(Subscription_1.Subscription));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXBCeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9ncm91cEJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDRDQUEyQztBQUMzQyxnREFBK0M7QUFDL0MsNENBQTJDO0FBRTNDLHNDQUFxQztBQVFyQyxtQ0FBbUM7QUFFbkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Rkc7QUFDSCxTQUFnQixPQUFPLENBQVUsV0FBNEIsRUFDNUIsZUFBMEMsRUFDMUMsZ0JBQXdFLEVBQ3hFLGVBQWtDO0lBQ2pFLE9BQU8sVUFBQyxNQUFxQjtRQUMzQixPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxlQUFlLENBQUMsV0FBVyxFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUFqRyxDQUFpRyxDQUFDO0FBQ3RHLENBQUM7QUFORCwwQkFNQztBQVNEO0lBQ0UseUJBQW9CLFdBQTRCLEVBQzVCLGVBQTBDLEVBQzFDLGdCQUF3RSxFQUN4RSxlQUFrQztRQUhsQyxnQkFBVyxHQUFYLFdBQVcsQ0FBaUI7UUFDNUIsb0JBQWUsR0FBZixlQUFlLENBQTJCO1FBQzFDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBd0Q7UUFDeEUsb0JBQWUsR0FBZixlQUFlLENBQW1CO0lBQ3RELENBQUM7SUFFRCw4QkFBSSxHQUFKLFVBQUssVUFBK0MsRUFBRSxNQUFXO1FBQy9ELE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLGlCQUFpQixDQUMzQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJ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QUFBLFNBQTZDLEVBQTNDLDhDQUFvQixFQUFFLDhCQUFxQixDQUFDO1FBQ3BELElBQUksb0JBQW9CLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLEVBQUU7WUFDeEQsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLHlCQUF5QixDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztTQUN2RTtRQUNELFlBQVksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ3JELE9BQU8sWUFBWSxDQUFDO0lBQ3RCLENBQUM7SUFDSCx3QkFBQztBQUFELENBQUMsQUFsQkQsQ0FBNkMsdUJBQVUsR0FrQnREO0FBbEJZLDhDQUFpQjtBQW9COUI7Ozs7R0FJRztBQUNIO0lBQXdDLDZDQUFZO0lBQ2xELG1DQUFvQixNQUE0QjtRQUFoRCxZQUNFLGlCQUFPLFNBRVI7UUFIbUIsWUFBTSxHQUFOLE1BQU0sQ0FBc0I7UUFFOUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDOztJQUNqQixDQUFDO0lBRUQsK0NBQVcsR0FBWDtRQUNFLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2xDLGlCQUFNLFdBQVcsV0FBRSxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO1lBQ2xCLElBQUksTUFBTSxDQUFDLEtBQUssS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLHNCQUFzQixFQUFFO2dCQUN2RCxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7YUFDdEI7U0FDRjtJQUNILENBQUM7SUFDSCxnQ0FBQztBQUFELENBQUMsQUFoQkQsQ0FBd0MsMkJBQVksR0FnQm5EIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJy4uL1N1YmplY3QnO1xuaW1wb3J0IHsgT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5leHBvcnQgZnVuY3Rpb24gZ3JvdXBCeTxULCBLPihrZXlTZWxlY3RvcjogKHZhbHVlOiBUKSA9PiBLKTogT3BlcmF0b3JGdW5jdGlvbjxULCBHcm91cGVkT2JzZXJ2YWJsZTxLLCBUPj47XG5leHBvcnQgZnVuY3Rpb24gZ3JvdXBCeTxULCBLPihrZXlTZWxlY3RvcjogKHZhbHVlOiBUKSA9PiBLLCBlbGVtZW50U2VsZWN0b3I6IHZvaWQsIGR1cmF0aW9uU2VsZWN0b3I6IChncm91cGVkOiBHcm91cGVkT2JzZXJ2YWJsZTxLLCBUPikgPT4gT2JzZXJ2YWJsZTxhbnk+KTogT3BlcmF0b3JGdW5jdGlvbjxULCBHcm91cGVkT2JzZXJ2YWJsZTxLLCBUPj47XG5leHBvcnQgZnVuY3Rpb24gZ3JvdXBCeTxULCBLLCBSPihrZXlTZWxlY3RvcjogKHZhbHVlOiBUKSA9PiBLLCBlbGVtZW50U2VsZWN0b3I/OiAodmFsdWU6IFQpID0+IFIsIGR1cmF0aW9uU2VsZWN0b3I/OiAoZ3JvdXBlZDogR3JvdXBlZE9ic2VydmFibGU8SywgUj4pID0+IE9ic2VydmFibGU8YW55Pik6IE9wZXJhdG9yRnVuY3Rpb248VCwgR3JvdXBlZE9ic2VydmFibGU8SywgUj4+O1xuZXhwb3J0IGZ1bmN0aW9uIGdyb3VwQnk8VCwgSywgUj4oa2V5U2VsZWN0b3I6ICh2YWx1ZTogVCkgPT4gSywgZWxlbWVudFNlbGVjdG9yPzogKHZhbHVlOiBUKSA9PiBSLCBkdXJhdGlvblNlbGVjdG9yPzogKGdyb3VwZWQ6IEdyb3VwZWRPYnNlcnZhYmxlPEssIFI+KSA9PiBPYnNlcnZhYmxlPGFueT4sIHN1YmplY3RTZWxlY3Rvcj86ICgpID0+IFN1YmplY3Q8Uj4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEdyb3VwZWRPYnNlcnZhYmxlPEssIFI+Pjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbi8qKlxuICogR3JvdXBzIHRoZSBpdGVtcyBlbWl0dGVkIGJ5IGFuIE9ic2VydmFibGUgYWNjb3JkaW5nIHRvIGEgc3BlY2lmaWVkIGNyaXRlcmlvbixcbiAqIGFuZCBlbWl0cyB0aGVzZSBncm91cGVkIGl0ZW1zIGFzIGBHcm91cGVkT2JzZXJ2YWJsZXNgLCBvbmVcbiAqIHtAbGluayBHcm91cGVkT2JzZXJ2YWJsZX0gcGVyIGdyb3VwLlxuICpcbiAqICFbXShncm91cEJ5LnBuZylcbiAqXG4gKiBXaGVuIHRoZSBPYnNlcnZhYmxlIGVtaXRzIGFuIGl0ZW0sIGEga2V5IGlzIGNvbXB1dGVkIGZvciB0aGlzIGl0ZW0gd2l0aCB0aGUga2V5U2VsZWN0b3IgZnVuY3Rpb24uXG4gKlxuICogSWYgYSB7QGxpbmsgR3JvdXBlZE9ic2VydmFibGV9IGZvciB0aGlzIGtleSBleGlzdHMsIHRoaXMge0BsaW5rIEdyb3VwZWRPYnNlcnZhYmxlfSBlbWl0cy4gRWxzZXdoZXJlLCBhIG5ld1xuICoge0BsaW5rIEdyb3VwZWRPYnNlcnZhYmxlfSBmb3IgdGhpcyBrZXkgaXMgY3JlYXRlZCBhbmQgZW1pdHMuXG4gKlxuICogQSB7QGxpbmsgR3JvdXBlZE9ic2VydmFibGV9IHJlcHJlc2VudHMgdmFsdWVzIGJlbG9uZ2luZyB0byB0aGUgc2FtZSBncm91cCByZXByZXNlbnRlZCBieSBhIGNvbW1vbiBrZXkuIFRoZSBjb21tb25cbiAqIGtleSBpcyBhdmFpbGFibGUgYXMgdGhlIGtleSBmaWVsZCBvZiBhIHtAbGluayBHcm91cGVkT2JzZXJ2YWJsZX0gaW5zdGFuY2UuXG4gKlxuICogVGhlIGVsZW1lbnRzIGVtaXR0ZWQgYnkge0BsaW5rIEdyb3VwZWRPYnNlcnZhYmxlfXMgYXJlIGJ5IGRlZmF1bHQgdGhlIGl0ZW1zIGVtaXR0ZWQgYnkgdGhlIE9ic2VydmFibGUsIG9yIGVsZW1lbnRzXG4gKiByZXR1cm5lZCBieSB0aGUgZWxlbWVudFNlbGVjdG9yIGZ1bmN0aW9uLlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiAjIyMgR3JvdXAgb2JqZWN0cyBieSBpZCBhbmQgcmV0dXJuIGFzIGFycmF5XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBtZXJnZU1hcCwgZ3JvdXBCeSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqIGltcG9ydCB7IG9mIH0gZnJvbSAncnhqcy9vYnNlcnZhYmxlL29mJztcbiAqXG4gKiBpbnRlcmZhY2UgT2JqIHtcbiAqICAgIGlkOiBudW1iZXIsXG4gKiAgICBuYW1lOiBzdHJpbmcsXG4gKiB9XG4gKlxuICogb2Y8T2JqPihcbiAqICAge2lkOiAxLCBuYW1lOiAnamF2YXNjcmlwdCd9LFxuICogICB7aWQ6IDIsIG5hbWU6ICdwYXJjZWwnfSxcbiAqICAge2lkOiAyLCBuYW1lOiAnd2VicGFjayd9LFxuICogICB7aWQ6IDEsIG5hbWU6ICd0eXBlc2NyaXB0J30sXG4gKiAgIHtpZDogMywgbmFtZTogJ3RzbGludCd9XG4gKiApLnBpcGUoXG4gKiAgIGdyb3VwQnkocCA9PiBwLmlkKSxcbiAqICAgbWVyZ2VNYXAoKGdyb3VwJCkgPT4gZ3JvdXAkLnBpcGUocmVkdWNlKChhY2MsIGN1cikgPT4gWy4uLmFjYywgY3VyXSwgW10pKSksXG4gKiApXG4gKiAuc3Vic2NyaWJlKHAgPT4gY29uc29sZS5sb2cocCkpO1xuICpcbiAqIC8vIGRpc3BsYXlzOlxuICogLy8gWyB7IGlkOiAxLCBuYW1lOiAnamF2YXNjcmlwdCd9LFxuICogLy8gICB7IGlkOiAxLCBuYW1lOiAndHlwZXNjcmlwdCd9IF1cbiAqIC8vXG4gKiAvLyBbIHsgaWQ6IDIsIG5hbWU6ICdwYXJjZWwnfSxcbiAqIC8vICAgeyBpZDogMiwgbmFtZTogJ3dlYnBhY2snfSBdXG4gKiAvL1xuICogLy8gWyB7IGlkOiAzLCBuYW1lOiAndHNsaW50J30gXVxuICogYGBgXG4gKlxuICogIyMjIFBpdm90IGRhdGEgb24gdGhlIGlkIGZpZWxkXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBtZXJnZU1hcCwgZ3JvdXBCeSwgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICogaW1wb3J0IHsgb2YgfSBmcm9tICdyeGpzL29ic2VydmFibGUvb2YnO1xuICpcbiAqIG9mPE9iaj4oXG4gKiAgIHtpZDogMSwgbmFtZTogJ2phdmFzY3JpcHQnfSxcbiAqICAge2lkOiAyLCBuYW1lOiAncGFyY2VsJ30sXG4gKiAgIHtpZDogMiwgbmFtZTogJ3dlYnBhY2snfSxcbiAqICAge2lkOiAxLCBuYW1lOiAndHlwZXNjcmlwdCd9XG4gKiAgIHtpZDogMywgbmFtZTogJ3RzbGludCd9XG4gKiApLnBpcGUoXG4gKiAgIGdyb3VwQnkocCA9PiBwLmlkLCBwID0+IHAubmFtZSksXG4gKiAgIG1lcmdlTWFwKCAoZ3JvdXAkKSA9PiBncm91cCQucGlwZShyZWR1Y2UoKGFjYywgY3VyKSA9PiBbLi4uYWNjLCBjdXJdLCBbXCJcIiArIGdyb3VwJC5rZXldKSkpLFxuICogICBtYXAoYXJyID0+ICh7J2lkJzogcGFyc2VJbnQoYXJyWzBdKSwgJ3ZhbHVlcyc6IGFyci5zbGljZSgxKX0pKSxcbiAqIClcbiAqIC5zdWJzY3JpYmUocCA9PiBjb25zb2xlLmxvZyhwKSk7XG4gKlxuICogLy8gZGlzcGxheXM6XG4gKiAvLyB7IGlkOiAxLCB2YWx1ZXM6IFsgJ2phdmFzY3JpcHQnLCAndHlwZXNjcmlwdCcgXSB9XG4gKiAvLyB7IGlkOiAyLCB2YWx1ZXM6IFsgJ3BhcmNlbCcsICd3ZWJwYWNrJyBdIH1cbiAqIC8vIHsgaWQ6IDMsIHZhbHVlczogWyAndHNsaW50JyBdIH1cbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24odmFsdWU6IFQpOiBLfSBrZXlTZWxlY3RvciBBIGZ1bmN0aW9uIHRoYXQgZXh0cmFjdHMgdGhlIGtleVxuICogZm9yIGVhY2ggaXRlbS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24odmFsdWU6IFQpOiBSfSBbZWxlbWVudFNlbGVjdG9yXSBBIGZ1bmN0aW9uIHRoYXQgZXh0cmFjdHMgdGhlXG4gKiByZXR1cm4gZWxlbWVudCBmb3IgZWFjaCBpdGVtLlxuICogQHBhcmFtIHtmdW5jdGlvbihncm91cGVkOiBHcm91cGVkT2JzZXJ2YWJsZTxLLFI+KTogT2JzZXJ2YWJsZTxhbnk+fSBbZHVyYXRpb25TZWxlY3Rvcl1cbiAqIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIE9ic2VydmFibGUgdG8gZGV0ZXJtaW5lIGhvdyBsb25nIGVhY2ggZ3JvdXAgc2hvdWxkXG4gKiBleGlzdC5cbiAqIEByZXR1cm4ge09ic2VydmFibGU8R3JvdXBlZE9ic2VydmFibGU8SyxSPj59IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0c1xuICogR3JvdXBlZE9ic2VydmFibGVzLCBlYWNoIG9mIHdoaWNoIGNvcnJlc3BvbmRzIHRvIGEgdW5pcXVlIGtleSB2YWx1ZSBhbmQgZWFjaFxuICogb2Ygd2hpY2ggZW1pdHMgdGhvc2UgaXRlbXMgZnJvbSB0aGUgc291cmNlIE9ic2VydmFibGUgdGhhdCBzaGFyZSB0aGF0IGtleVxuICogdmFsdWUuXG4gKiBAbWV0aG9kIGdyb3VwQnlcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBncm91cEJ5PFQsIEssIFI+KGtleVNlbGVjdG9yOiAodmFsdWU6IFQpID0+IEssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50U2VsZWN0b3I/OiAoKHZhbHVlOiBUKSA9PiBSKSB8IHZvaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvblNlbGVjdG9yPzogKGdyb3VwZWQ6IEdyb3VwZWRPYnNlcnZhYmxlPEssIFI+KSA9PiBPYnNlcnZhYmxlPGFueT4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJqZWN0U2VsZWN0b3I/OiAoKSA9PiBTdWJqZWN0PFI+KTogT3BlcmF0b3JGdW5jdGlvbjxULCBHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPj4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT5cbiAgICBzb3VyY2UubGlmdChuZXcgR3JvdXBCeU9wZXJhdG9yKGtleVNlbGVjdG9yLCBlbGVtZW50U2VsZWN0b3IsIGR1cmF0aW9uU2VsZWN0b3IsIHN1YmplY3RTZWxlY3RvcikpO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlZkNvdW50U3Vic2NyaXB0aW9uIHtcbiAgY291bnQ6IG51bWJlcjtcbiAgdW5zdWJzY3JpYmU6ICgpID0+IHZvaWQ7XG4gIGNsb3NlZDogYm9vbGVhbjtcbiAgYXR0ZW1wdGVkVG9VbnN1YnNjcmliZTogYm9vbGVhbjtcbn1cblxuY2xhc3MgR3JvdXBCeU9wZXJhdG9yPFQsIEssIFI+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgR3JvdXBlZE9ic2VydmFibGU8SywgUj4+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBrZXlTZWxlY3RvcjogKHZhbHVlOiBUKSA9PiBLLFxuICAgICAgICAgICAgICBwcml2YXRlIGVsZW1lbnRTZWxlY3Rvcj86ICgodmFsdWU6IFQpID0+IFIpIHwgdm9pZCxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBkdXJhdGlvblNlbGVjdG9yPzogKGdyb3VwZWQ6IEdyb3VwZWRPYnNlcnZhYmxlPEssIFI+KSA9PiBPYnNlcnZhYmxlPGFueT4sXG4gICAgICAgICAgICAgIHByaXZhdGUgc3ViamVjdFNlbGVjdG9yPzogKCkgPT4gU3ViamVjdDxSPikge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPEdyb3VwZWRPYnNlcnZhYmxlPEssIFI+Piwgc291cmNlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBHcm91cEJ5U3Vic2NyaWJlcihcbiAgICAgIHN1YnNjcmliZXIsIHRoaXMua2V5U2VsZWN0b3IsIHRoaXMuZWxlbWVudFNlbGVjdG9yLCB0aGlzLmR1cmF0aW9uU2VsZWN0b3IsIHRoaXMuc3ViamVjdFNlbGVjdG9yXG4gICAgKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIEdyb3VwQnlTdWJzY3JpYmVyPFQsIEssIFI+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiBpbXBsZW1lbnRzIFJlZkNvdW50U3Vic2NyaXB0aW9uIHtcbiAgcHJpdmF0ZSBncm91cHM6IE1hcDxLLCBTdWJqZWN0PFQgfCBSPj4gPSBudWxsO1xuICBwdWJsaWMgYXR0ZW1wdGVkVG9VbnN1YnNjcmliZTogYm9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgY291bnQ6IG51bWJlciA9IDA7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8R3JvdXBlZE9ic2VydmFibGU8SywgUj4+LFxuICAgICAgICAgICAgICBwcml2YXRlIGtleVNlbGVjdG9yOiAodmFsdWU6IFQpID0+IEssXG4gICAgICAgICAgICAgIHByaXZhdGUgZWxlbWVudFNlbGVjdG9yPzogKCh2YWx1ZTogVCkgPT4gUikgfCB2b2lkLFxuICAgICAgICAgICAgICBwcml2YXRlIGR1cmF0aW9uU2VsZWN0b3I/OiAoZ3JvdXBlZDogR3JvdXBlZE9ic2VydmFibGU8SywgUj4pID0+IE9ic2VydmFibGU8YW55PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzdWJqZWN0U2VsZWN0b3I/OiAoKSA9PiBTdWJqZWN0PFI+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgbGV0IGtleTogSztcbiAgICB0cnkge1xuICAgICAga2V5ID0gdGhpcy5rZXlTZWxlY3Rvcih2YWx1ZSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLmVycm9yKGVycik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fZ3JvdXAodmFsdWUsIGtleSk7XG4gIH1cblxuICBwcml2YXRlIF9ncm91cCh2YWx1ZTogVCwga2V5OiBLKSB7XG4gICAgbGV0IGdyb3VwcyA9IHRoaXMuZ3JvdXBzO1xuXG4gICAgaWYgKCFncm91cHMpIHtcbiAgICAgIGdyb3VwcyA9IHRoaXMuZ3JvdXBzID0gbmV3IE1hcDxLLCBTdWJqZWN0PFQgfCBSPj4oKTtcbiAgICB9XG5cbiAgICBsZXQgZ3JvdXAgPSBncm91cHMuZ2V0KGtleSk7XG5cbiAgICBsZXQgZWxlbWVudDogUjtcbiAgICBpZiAodGhpcy5lbGVtZW50U2VsZWN0b3IpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGVsZW1lbnQgPSB0aGlzLmVsZW1lbnRTZWxlY3Rvcih2YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50ID0gPGFueT52YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAoIWdyb3VwKSB7XG4gICAgICBncm91cCA9ICh0aGlzLnN1YmplY3RTZWxlY3RvciA/IHRoaXMuc3ViamVjdFNlbGVjdG9yKCkgOiBuZXcgU3ViamVjdDxSPigpKSBhcyBTdWJqZWN0PFQgfCBSPjtcbiAgICAgIGdyb3Vwcy5zZXQoa2V5LCBncm91cCk7XG4gICAgICBjb25zdCBncm91cGVkT2JzZXJ2YWJsZSA9IG5ldyBHcm91cGVkT2JzZXJ2YWJsZShrZXksIGdyb3VwLCB0aGlzKTtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChncm91cGVkT2JzZXJ2YWJsZSk7XG4gICAgICBpZiAodGhpcy5kdXJhdGlvblNlbGVjdG9yKSB7XG4gICAgICAgIGxldCBkdXJhdGlvbjogYW55O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGR1cmF0aW9uID0gdGhpcy5kdXJhdGlvblNlbGVjdG9yKG5ldyBHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPihrZXksIDxTdWJqZWN0PFI+Pmdyb3VwKSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hZGQoZHVyYXRpb24uc3Vic2NyaWJlKG5ldyBHcm91cER1cmF0aW9uU3Vic2NyaWJlcihrZXksIGdyb3VwLCB0aGlzKSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghZ3JvdXAuY2xvc2VkKSB7XG4gICAgICBncm91cC5uZXh0KGVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfZXJyb3IoZXJyOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBncm91cHMgPSB0aGlzLmdyb3VwcztcbiAgICBpZiAoZ3JvdXBzKSB7XG4gICAgICBncm91cHMuZm9yRWFjaCgoZ3JvdXAsIGtleSkgPT4ge1xuICAgICAgICBncm91cC5lcnJvcihlcnIpO1xuICAgICAgfSk7XG5cbiAgICAgIGdyb3Vwcy5jbGVhcigpO1xuICAgIH1cbiAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCk6IHZvaWQge1xuICAgIGNvbnN0IGdyb3VwcyA9IHRoaXMuZ3JvdXBzO1xuICAgIGlmIChncm91cHMpIHtcbiAgICAgIGdyb3Vwcy5mb3JFYWNoKChncm91cCwga2V5KSA9PiB7XG4gICAgICAgIGdyb3VwLmNvbXBsZXRlKCk7XG4gICAgICB9KTtcblxuICAgICAgZ3JvdXBzLmNsZWFyKCk7XG4gICAgfVxuICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgfVxuXG4gIHJlbW92ZUdyb3VwKGtleTogSyk6IHZvaWQge1xuICAgIHRoaXMuZ3JvdXBzLmRlbGV0ZShrZXkpO1xuICB9XG5cbiAgdW5zdWJzY3JpYmUoKSB7XG4gICAgaWYgKCF0aGlzLmNsb3NlZCkge1xuICAgICAgdGhpcy5hdHRlbXB0ZWRUb1Vuc3Vic2NyaWJlID0gdHJ1ZTtcbiAgICAgIGlmICh0aGlzLmNvdW50ID09PSAwKSB7XG4gICAgICAgIHN1cGVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBHcm91cER1cmF0aW9uU3Vic2NyaWJlcjxLLCBUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGtleTogSyxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBncm91cDogU3ViamVjdDxUPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBwYXJlbnQ6IEdyb3VwQnlTdWJzY3JpYmVyPGFueSwgSywgVCB8IGFueT4pIHtcbiAgICBzdXBlcihncm91cCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICB0aGlzLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF91bnN1YnNjcmliZSgpIHtcbiAgICBjb25zdCB7IHBhcmVudCwga2V5IH0gPSB0aGlzO1xuICAgIHRoaXMua2V5ID0gdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIHBhcmVudC5yZW1vdmVHcm91cChrZXkpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEFuIE9ic2VydmFibGUgcmVwcmVzZW50aW5nIHZhbHVlcyBiZWxvbmdpbmcgdG8gdGhlIHNhbWUgZ3JvdXAgcmVwcmVzZW50ZWQgYnlcbiAqIGEgY29tbW9uIGtleS4gVGhlIHZhbHVlcyBlbWl0dGVkIGJ5IGEgR3JvdXBlZE9ic2VydmFibGUgY29tZSBmcm9tIHRoZSBzb3VyY2VcbiAqIE9ic2VydmFibGUuIFRoZSBjb21tb24ga2V5IGlzIGF2YWlsYWJsZSBhcyB0aGUgZmllbGQgYGtleWAgb24gYVxuICogR3JvdXBlZE9ic2VydmFibGUgaW5zdGFuY2UuXG4gKlxuICogQGNsYXNzIEdyb3VwZWRPYnNlcnZhYmxlPEssIFQ+XG4gKi9cbmV4cG9ydCBjbGFzcyBHcm91cGVkT2JzZXJ2YWJsZTxLLCBUPiBleHRlbmRzIE9ic2VydmFibGU8VD4ge1xuICAvKiogQGRlcHJlY2F0ZWQgRG8gbm90IGNvbnN0cnVjdCB0aGlzIHR5cGUuIEludGVybmFsIHVzZSBvbmx5ICovXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBrZXk6IEssXG4gICAgICAgICAgICAgIHByaXZhdGUgZ3JvdXBTdWJqZWN0OiBTdWJqZWN0PFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIHJlZkNvdW50U3Vic2NyaXB0aW9uPzogUmVmQ291bnRTdWJzY3JpcHRpb24pIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfc3Vic2NyaWJlKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pIHtcbiAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgY29uc3QgeyByZWZDb3VudFN1YnNjcmlwdGlvbiwgZ3JvdXBTdWJqZWN0IH0gPSB0aGlzO1xuICAgIGlmIChyZWZDb3VudFN1YnNjcmlwdGlvbiAmJiAhcmVmQ291bnRTdWJzY3JpcHRpb24uY2xvc2VkKSB7XG4gICAgICBzdWJzY3JpcHRpb24uYWRkKG5ldyBJbm5lclJlZkNvdW50U3Vic2NyaXB0aW9uKHJlZkNvdW50U3Vic2NyaXB0aW9uKSk7XG4gICAgfVxuICAgIHN1YnNjcmlwdGlvbi5hZGQoZ3JvdXBTdWJqZWN0LnN1YnNjcmliZShzdWJzY3JpYmVyKSk7XG4gICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgSW5uZXJSZWZDb3VudFN1YnNjcmlwdGlvbiBleHRlbmRzIFN1YnNjcmlwdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFyZW50OiBSZWZDb3VudFN1YnNjcmlwdGlvbikge1xuICAgIHN1cGVyKCk7XG4gICAgcGFyZW50LmNvdW50Kys7XG4gIH1cblxuICB1bnN1YnNjcmliZSgpIHtcbiAgICBjb25zdCBwYXJlbnQgPSB0aGlzLnBhcmVudDtcbiAgICBpZiAoIXBhcmVudC5jbG9zZWQgJiYgIXRoaXMuY2xvc2VkKSB7XG4gICAgICBzdXBlci51bnN1YnNjcmliZSgpO1xuICAgICAgcGFyZW50LmNvdW50IC09IDE7XG4gICAgICBpZiAocGFyZW50LmNvdW50ID09PSAwICYmIHBhcmVudC5hdHRlbXB0ZWRUb1Vuc3Vic2NyaWJlKSB7XG4gICAgICAgIHBhcmVudC51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19