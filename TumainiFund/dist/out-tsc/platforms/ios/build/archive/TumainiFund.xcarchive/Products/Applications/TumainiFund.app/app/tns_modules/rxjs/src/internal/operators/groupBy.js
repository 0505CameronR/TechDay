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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXBCeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL2dyb3VwQnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNENBQTJDO0FBQzNDLGdEQUErQztBQUMvQyw0Q0FBMkM7QUFFM0Msc0NBQXFDO0FBUXJDLG1DQUFtQztBQUVuQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdGRztBQUNILFNBQWdCLE9BQU8sQ0FBVSxXQUE0QixFQUM1QixlQUEwQyxFQUMxQyxnQkFBd0UsRUFDeEUsZUFBa0M7SUFDakUsT0FBTyxVQUFDLE1BQXFCO1FBQzNCLE9BQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGVBQWUsQ0FBQyxXQUFXLEVBQUUsZUFBZSxFQUFFLGdCQUFnQixFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQWpHLENBQWlHLENBQUM7QUFDdEcsQ0FBQztBQU5ELDBCQU1DO0FBU0Q7SUFDRSx5QkFBb0IsV0FBNEIsRUFDNUIsZUFBMEMsRUFDMUMsZ0JBQXdFLEVBQ3hFLGVBQWtDO1FBSGxDLGdCQUFXLEdBQVgsV0FBVyxDQUFpQjtRQUM1QixvQkFBZSxHQUFmLGVBQWUsQ0FBMkI7UUFDMUMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUF3RDtRQUN4RSxvQkFBZSxHQUFmLGVBQWUsQ0FBbUI7SUFDdEQsQ0FBQztJQUVELDhCQUFJLEdBQUosVUFBSyxVQUErQyxFQUFFLE1BQVc7UUFD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bXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi4vU3ViamVjdCc7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiBncm91cEJ5PFQsIEs+KGtleVNlbGVjdG9yOiAodmFsdWU6IFQpID0+IEspOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEdyb3VwZWRPYnNlcnZhYmxlPEssIFQ+PjtcbmV4cG9ydCBmdW5jdGlvbiBncm91cEJ5PFQsIEs+KGtleVNlbGVjdG9yOiAodmFsdWU6IFQpID0+IEssIGVsZW1lbnRTZWxlY3Rvcjogdm9pZCwgZHVyYXRpb25TZWxlY3RvcjogKGdyb3VwZWQ6IEdyb3VwZWRPYnNlcnZhYmxlPEssIFQ+KSA9PiBPYnNlcnZhYmxlPGFueT4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEdyb3VwZWRPYnNlcnZhYmxlPEssIFQ+PjtcbmV4cG9ydCBmdW5jdGlvbiBncm91cEJ5PFQsIEssIFI+KGtleVNlbGVjdG9yOiAodmFsdWU6IFQpID0+IEssIGVsZW1lbnRTZWxlY3Rvcj86ICh2YWx1ZTogVCkgPT4gUiwgZHVyYXRpb25TZWxlY3Rvcj86IChncm91cGVkOiBHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPikgPT4gT2JzZXJ2YWJsZTxhbnk+KTogT3BlcmF0b3JGdW5jdGlvbjxULCBHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPj47XG5leHBvcnQgZnVuY3Rpb24gZ3JvdXBCeTxULCBLLCBSPihrZXlTZWxlY3RvcjogKHZhbHVlOiBUKSA9PiBLLCBlbGVtZW50U2VsZWN0b3I/OiAodmFsdWU6IFQpID0+IFIsIGR1cmF0aW9uU2VsZWN0b3I/OiAoZ3JvdXBlZDogR3JvdXBlZE9ic2VydmFibGU8SywgUj4pID0+IE9ic2VydmFibGU8YW55Piwgc3ViamVjdFNlbGVjdG9yPzogKCkgPT4gU3ViamVjdDxSPik6IE9wZXJhdG9yRnVuY3Rpb248VCwgR3JvdXBlZE9ic2VydmFibGU8SywgUj4+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKiBHcm91cHMgdGhlIGl0ZW1zIGVtaXR0ZWQgYnkgYW4gT2JzZXJ2YWJsZSBhY2NvcmRpbmcgdG8gYSBzcGVjaWZpZWQgY3JpdGVyaW9uLFxuICogYW5kIGVtaXRzIHRoZXNlIGdyb3VwZWQgaXRlbXMgYXMgYEdyb3VwZWRPYnNlcnZhYmxlc2AsIG9uZVxuICoge0BsaW5rIEdyb3VwZWRPYnNlcnZhYmxlfSBwZXIgZ3JvdXAuXG4gKlxuICogIVtdKGdyb3VwQnkucG5nKVxuICpcbiAqIFdoZW4gdGhlIE9ic2VydmFibGUgZW1pdHMgYW4gaXRlbSwgYSBrZXkgaXMgY29tcHV0ZWQgZm9yIHRoaXMgaXRlbSB3aXRoIHRoZSBrZXlTZWxlY3RvciBmdW5jdGlvbi5cbiAqXG4gKiBJZiBhIHtAbGluayBHcm91cGVkT2JzZXJ2YWJsZX0gZm9yIHRoaXMga2V5IGV4aXN0cywgdGhpcyB7QGxpbmsgR3JvdXBlZE9ic2VydmFibGV9IGVtaXRzLiBFbHNld2hlcmUsIGEgbmV3XG4gKiB7QGxpbmsgR3JvdXBlZE9ic2VydmFibGV9IGZvciB0aGlzIGtleSBpcyBjcmVhdGVkIGFuZCBlbWl0cy5cbiAqXG4gKiBBIHtAbGluayBHcm91cGVkT2JzZXJ2YWJsZX0gcmVwcmVzZW50cyB2YWx1ZXMgYmVsb25naW5nIHRvIHRoZSBzYW1lIGdyb3VwIHJlcHJlc2VudGVkIGJ5IGEgY29tbW9uIGtleS4gVGhlIGNvbW1vblxuICoga2V5IGlzIGF2YWlsYWJsZSBhcyB0aGUga2V5IGZpZWxkIG9mIGEge0BsaW5rIEdyb3VwZWRPYnNlcnZhYmxlfSBpbnN0YW5jZS5cbiAqXG4gKiBUaGUgZWxlbWVudHMgZW1pdHRlZCBieSB7QGxpbmsgR3JvdXBlZE9ic2VydmFibGV9cyBhcmUgYnkgZGVmYXVsdCB0aGUgaXRlbXMgZW1pdHRlZCBieSB0aGUgT2JzZXJ2YWJsZSwgb3IgZWxlbWVudHNcbiAqIHJldHVybmVkIGJ5IHRoZSBlbGVtZW50U2VsZWN0b3IgZnVuY3Rpb24uXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqICMjIyBHcm91cCBvYmplY3RzIGJ5IGlkIGFuZCByZXR1cm4gYXMgYXJyYXlcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IG1lcmdlTWFwLCBncm91cEJ5IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICogaW1wb3J0IHsgb2YgfSBmcm9tICdyeGpzL29ic2VydmFibGUvb2YnO1xuICpcbiAqIGludGVyZmFjZSBPYmoge1xuICogICAgaWQ6IG51bWJlcixcbiAqICAgIG5hbWU6IHN0cmluZyxcbiAqIH1cbiAqXG4gKiBvZjxPYmo+KFxuICogICB7aWQ6IDEsIG5hbWU6ICdqYXZhc2NyaXB0J30sXG4gKiAgIHtpZDogMiwgbmFtZTogJ3BhcmNlbCd9LFxuICogICB7aWQ6IDIsIG5hbWU6ICd3ZWJwYWNrJ30sXG4gKiAgIHtpZDogMSwgbmFtZTogJ3R5cGVzY3JpcHQnfSxcbiAqICAge2lkOiAzLCBuYW1lOiAndHNsaW50J31cbiAqICkucGlwZShcbiAqICAgZ3JvdXBCeShwID0+IHAuaWQpLFxuICogICBtZXJnZU1hcCgoZ3JvdXAkKSA9PiBncm91cCQucGlwZShyZWR1Y2UoKGFjYywgY3VyKSA9PiBbLi4uYWNjLCBjdXJdLCBbXSkpKSxcbiAqIClcbiAqIC5zdWJzY3JpYmUocCA9PiBjb25zb2xlLmxvZyhwKSk7XG4gKlxuICogLy8gZGlzcGxheXM6XG4gKiAvLyBbIHsgaWQ6IDEsIG5hbWU6ICdqYXZhc2NyaXB0J30sXG4gKiAvLyAgIHsgaWQ6IDEsIG5hbWU6ICd0eXBlc2NyaXB0J30gXVxuICogLy9cbiAqIC8vIFsgeyBpZDogMiwgbmFtZTogJ3BhcmNlbCd9LFxuICogLy8gICB7IGlkOiAyLCBuYW1lOiAnd2VicGFjayd9IF1cbiAqIC8vXG4gKiAvLyBbIHsgaWQ6IDMsIG5hbWU6ICd0c2xpbnQnfSBdXG4gKiBgYGBcbiAqXG4gKiAjIyMgUGl2b3QgZGF0YSBvbiB0aGUgaWQgZmllbGRcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IG1lcmdlTWFwLCBncm91cEJ5LCBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKiBpbXBvcnQgeyBvZiB9IGZyb20gJ3J4anMvb2JzZXJ2YWJsZS9vZic7XG4gKlxuICogb2Y8T2JqPihcbiAqICAge2lkOiAxLCBuYW1lOiAnamF2YXNjcmlwdCd9LFxuICogICB7aWQ6IDIsIG5hbWU6ICdwYXJjZWwnfSxcbiAqICAge2lkOiAyLCBuYW1lOiAnd2VicGFjayd9LFxuICogICB7aWQ6IDEsIG5hbWU6ICd0eXBlc2NyaXB0J31cbiAqICAge2lkOiAzLCBuYW1lOiAndHNsaW50J31cbiAqICkucGlwZShcbiAqICAgZ3JvdXBCeShwID0+IHAuaWQsIHAgPT4gcC5uYW1lKSxcbiAqICAgbWVyZ2VNYXAoIChncm91cCQpID0+IGdyb3VwJC5waXBlKHJlZHVjZSgoYWNjLCBjdXIpID0+IFsuLi5hY2MsIGN1cl0sIFtcIlwiICsgZ3JvdXAkLmtleV0pKSksXG4gKiAgIG1hcChhcnIgPT4gKHsnaWQnOiBwYXJzZUludChhcnJbMF0pLCAndmFsdWVzJzogYXJyLnNsaWNlKDEpfSkpLFxuICogKVxuICogLnN1YnNjcmliZShwID0+IGNvbnNvbGUubG9nKHApKTtcbiAqXG4gKiAvLyBkaXNwbGF5czpcbiAqIC8vIHsgaWQ6IDEsIHZhbHVlczogWyAnamF2YXNjcmlwdCcsICd0eXBlc2NyaXB0JyBdIH1cbiAqIC8vIHsgaWQ6IDIsIHZhbHVlczogWyAncGFyY2VsJywgJ3dlYnBhY2snIF0gfVxuICogLy8geyBpZDogMywgdmFsdWVzOiBbICd0c2xpbnQnIF0gfVxuICogYGBgXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbih2YWx1ZTogVCk6IEt9IGtleVNlbGVjdG9yIEEgZnVuY3Rpb24gdGhhdCBleHRyYWN0cyB0aGUga2V5XG4gKiBmb3IgZWFjaCBpdGVtLlxuICogQHBhcmFtIHtmdW5jdGlvbih2YWx1ZTogVCk6IFJ9IFtlbGVtZW50U2VsZWN0b3JdIEEgZnVuY3Rpb24gdGhhdCBleHRyYWN0cyB0aGVcbiAqIHJldHVybiBlbGVtZW50IGZvciBlYWNoIGl0ZW0uXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKGdyb3VwZWQ6IEdyb3VwZWRPYnNlcnZhYmxlPEssUj4pOiBPYnNlcnZhYmxlPGFueT59IFtkdXJhdGlvblNlbGVjdG9yXVxuICogQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gT2JzZXJ2YWJsZSB0byBkZXRlcm1pbmUgaG93IGxvbmcgZWFjaCBncm91cCBzaG91bGRcbiAqIGV4aXN0LlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxHcm91cGVkT2JzZXJ2YWJsZTxLLFI+Pn0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzXG4gKiBHcm91cGVkT2JzZXJ2YWJsZXMsIGVhY2ggb2Ygd2hpY2ggY29ycmVzcG9uZHMgdG8gYSB1bmlxdWUga2V5IHZhbHVlIGFuZCBlYWNoXG4gKiBvZiB3aGljaCBlbWl0cyB0aG9zZSBpdGVtcyBmcm9tIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB0aGF0IHNoYXJlIHRoYXQga2V5XG4gKiB2YWx1ZS5cbiAqIEBtZXRob2QgZ3JvdXBCeVxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdyb3VwQnk8VCwgSywgUj4oa2V5U2VsZWN0b3I6ICh2YWx1ZTogVCkgPT4gSyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRTZWxlY3Rvcj86ICgodmFsdWU6IFQpID0+IFIpIHwgdm9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uU2VsZWN0b3I/OiAoZ3JvdXBlZDogR3JvdXBlZE9ic2VydmFibGU8SywgUj4pID0+IE9ic2VydmFibGU8YW55PixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YmplY3RTZWxlY3Rvcj86ICgpID0+IFN1YmplY3Q8Uj4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEdyb3VwZWRPYnNlcnZhYmxlPEssIFI+PiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PlxuICAgIHNvdXJjZS5saWZ0KG5ldyBHcm91cEJ5T3BlcmF0b3Ioa2V5U2VsZWN0b3IsIGVsZW1lbnRTZWxlY3RvciwgZHVyYXRpb25TZWxlY3Rvciwgc3ViamVjdFNlbGVjdG9yKSk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVmQ291bnRTdWJzY3JpcHRpb24ge1xuICBjb3VudDogbnVtYmVyO1xuICB1bnN1YnNjcmliZTogKCkgPT4gdm9pZDtcbiAgY2xvc2VkOiBib29sZWFuO1xuICBhdHRlbXB0ZWRUb1Vuc3Vic2NyaWJlOiBib29sZWFuO1xufVxuXG5jbGFzcyBHcm91cEJ5T3BlcmF0b3I8VCwgSywgUj4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPj4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGtleVNlbGVjdG9yOiAodmFsdWU6IFQpID0+IEssXG4gICAgICAgICAgICAgIHByaXZhdGUgZWxlbWVudFNlbGVjdG9yPzogKCh2YWx1ZTogVCkgPT4gUikgfCB2b2lkLFxuICAgICAgICAgICAgICBwcml2YXRlIGR1cmF0aW9uU2VsZWN0b3I/OiAoZ3JvdXBlZDogR3JvdXBlZE9ic2VydmFibGU8SywgUj4pID0+IE9ic2VydmFibGU8YW55PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzdWJqZWN0U2VsZWN0b3I/OiAoKSA9PiBTdWJqZWN0PFI+KSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8R3JvdXBlZE9ic2VydmFibGU8SywgUj4+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IEdyb3VwQnlTdWJzY3JpYmVyKFxuICAgICAgc3Vic2NyaWJlciwgdGhpcy5rZXlTZWxlY3RvciwgdGhpcy5lbGVtZW50U2VsZWN0b3IsIHRoaXMuZHVyYXRpb25TZWxlY3RvciwgdGhpcy5zdWJqZWN0U2VsZWN0b3JcbiAgICApKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgR3JvdXBCeVN1YnNjcmliZXI8VCwgSywgUj4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IGltcGxlbWVudHMgUmVmQ291bnRTdWJzY3JpcHRpb24ge1xuICBwcml2YXRlIGdyb3VwczogTWFwPEssIFN1YmplY3Q8VCB8IFI+PiA9IG51bGw7XG4gIHB1YmxpYyBhdHRlbXB0ZWRUb1Vuc3Vic2NyaWJlOiBib29sZWFuID0gZmFsc2U7XG4gIHB1YmxpYyBjb3VudDogbnVtYmVyID0gMDtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPj4sXG4gICAgICAgICAgICAgIHByaXZhdGUga2V5U2VsZWN0b3I6ICh2YWx1ZTogVCkgPT4gSyxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBlbGVtZW50U2VsZWN0b3I/OiAoKHZhbHVlOiBUKSA9PiBSKSB8IHZvaWQsXG4gICAgICAgICAgICAgIHByaXZhdGUgZHVyYXRpb25TZWxlY3Rvcj86IChncm91cGVkOiBHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPikgPT4gT2JzZXJ2YWJsZTxhbnk+LFxuICAgICAgICAgICAgICBwcml2YXRlIHN1YmplY3RTZWxlY3Rvcj86ICgpID0+IFN1YmplY3Q8Uj4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICBsZXQga2V5OiBLO1xuICAgIHRyeSB7XG4gICAgICBrZXkgPSB0aGlzLmtleVNlbGVjdG9yKHZhbHVlKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9ncm91cCh2YWx1ZSwga2V5KTtcbiAgfVxuXG4gIHByaXZhdGUgX2dyb3VwKHZhbHVlOiBULCBrZXk6IEspIHtcbiAgICBsZXQgZ3JvdXBzID0gdGhpcy5ncm91cHM7XG5cbiAgICBpZiAoIWdyb3Vwcykge1xuICAgICAgZ3JvdXBzID0gdGhpcy5ncm91cHMgPSBuZXcgTWFwPEssIFN1YmplY3Q8VCB8IFI+PigpO1xuICAgIH1cblxuICAgIGxldCBncm91cCA9IGdyb3Vwcy5nZXQoa2V5KTtcblxuICAgIGxldCBlbGVtZW50OiBSO1xuICAgIGlmICh0aGlzLmVsZW1lbnRTZWxlY3Rvcikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZWxlbWVudCA9IHRoaXMuZWxlbWVudFNlbGVjdG9yKHZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICB0aGlzLmVycm9yKGVycik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQgPSA8YW55PnZhbHVlO1xuICAgIH1cblxuICAgIGlmICghZ3JvdXApIHtcbiAgICAgIGdyb3VwID0gKHRoaXMuc3ViamVjdFNlbGVjdG9yID8gdGhpcy5zdWJqZWN0U2VsZWN0b3IoKSA6IG5ldyBTdWJqZWN0PFI+KCkpIGFzIFN1YmplY3Q8VCB8IFI+O1xuICAgICAgZ3JvdXBzLnNldChrZXksIGdyb3VwKTtcbiAgICAgIGNvbnN0IGdyb3VwZWRPYnNlcnZhYmxlID0gbmV3IEdyb3VwZWRPYnNlcnZhYmxlKGtleSwgZ3JvdXAsIHRoaXMpO1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KGdyb3VwZWRPYnNlcnZhYmxlKTtcbiAgICAgIGlmICh0aGlzLmR1cmF0aW9uU2VsZWN0b3IpIHtcbiAgICAgICAgbGV0IGR1cmF0aW9uOiBhbnk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZHVyYXRpb24gPSB0aGlzLmR1cmF0aW9uU2VsZWN0b3IobmV3IEdyb3VwZWRPYnNlcnZhYmxlPEssIFI+KGtleSwgPFN1YmplY3Q8Uj4+Z3JvdXApKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFkZChkdXJhdGlvbi5zdWJzY3JpYmUobmV3IEdyb3VwRHVyYXRpb25TdWJzY3JpYmVyKGtleSwgZ3JvdXAsIHRoaXMpKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFncm91cC5jbG9zZWQpIHtcbiAgICAgIGdyb3VwLm5leHQoZWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9lcnJvcihlcnI6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IGdyb3VwcyA9IHRoaXMuZ3JvdXBzO1xuICAgIGlmIChncm91cHMpIHtcbiAgICAgIGdyb3Vwcy5mb3JFYWNoKChncm91cCwga2V5KSA9PiB7XG4gICAgICAgIGdyb3VwLmVycm9yKGVycik7XG4gICAgICB9KTtcblxuICAgICAgZ3JvdXBzLmNsZWFyKCk7XG4gICAgfVxuICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKTogdm9pZCB7XG4gICAgY29uc3QgZ3JvdXBzID0gdGhpcy5ncm91cHM7XG4gICAgaWYgKGdyb3Vwcykge1xuICAgICAgZ3JvdXBzLmZvckVhY2goKGdyb3VwLCBrZXkpID0+IHtcbiAgICAgICAgZ3JvdXAuY29tcGxldGUoKTtcbiAgICAgIH0pO1xuXG4gICAgICBncm91cHMuY2xlYXIoKTtcbiAgICB9XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICB9XG5cbiAgcmVtb3ZlR3JvdXAoa2V5OiBLKTogdm9pZCB7XG4gICAgdGhpcy5ncm91cHMuZGVsZXRlKGtleSk7XG4gIH1cblxuICB1bnN1YnNjcmliZSgpIHtcbiAgICBpZiAoIXRoaXMuY2xvc2VkKSB7XG4gICAgICB0aGlzLmF0dGVtcHRlZFRvVW5zdWJzY3JpYmUgPSB0cnVlO1xuICAgICAgaWYgKHRoaXMuY291bnQgPT09IDApIHtcbiAgICAgICAgc3VwZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIEdyb3VwRHVyYXRpb25TdWJzY3JpYmVyPEssIFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUga2V5OiBLLFxuICAgICAgICAgICAgICBwcml2YXRlIGdyb3VwOiBTdWJqZWN0PFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIHBhcmVudDogR3JvdXBCeVN1YnNjcmliZXI8YW55LCBLLCBUIHwgYW55Pikge1xuICAgIHN1cGVyKGdyb3VwKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIHRoaXMuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3Vuc3Vic2NyaWJlKCkge1xuICAgIGNvbnN0IHsgcGFyZW50LCBrZXkgfSA9IHRoaXM7XG4gICAgdGhpcy5rZXkgPSB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgcGFyZW50LnJlbW92ZUdyb3VwKGtleSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQW4gT2JzZXJ2YWJsZSByZXByZXNlbnRpbmcgdmFsdWVzIGJlbG9uZ2luZyB0byB0aGUgc2FtZSBncm91cCByZXByZXNlbnRlZCBieVxuICogYSBjb21tb24ga2V5LiBUaGUgdmFsdWVzIGVtaXR0ZWQgYnkgYSBHcm91cGVkT2JzZXJ2YWJsZSBjb21lIGZyb20gdGhlIHNvdXJjZVxuICogT2JzZXJ2YWJsZS4gVGhlIGNvbW1vbiBrZXkgaXMgYXZhaWxhYmxlIGFzIHRoZSBmaWVsZCBga2V5YCBvbiBhXG4gKiBHcm91cGVkT2JzZXJ2YWJsZSBpbnN0YW5jZS5cbiAqXG4gKiBAY2xhc3MgR3JvdXBlZE9ic2VydmFibGU8SywgVD5cbiAqL1xuZXhwb3J0IGNsYXNzIEdyb3VwZWRPYnNlcnZhYmxlPEssIFQ+IGV4dGVuZHMgT2JzZXJ2YWJsZTxUPiB7XG4gIC8qKiBAZGVwcmVjYXRlZCBEbyBub3QgY29uc3RydWN0IHRoaXMgdHlwZS4gSW50ZXJuYWwgdXNlIG9ubHkgKi9cbiAgY29uc3RydWN0b3IocHVibGljIGtleTogSyxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBncm91cFN1YmplY3Q6IFN1YmplY3Q8VD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgcmVmQ291bnRTdWJzY3JpcHRpb24/OiBSZWZDb3VudFN1YnNjcmlwdGlvbikge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF9zdWJzY3JpYmUoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPikge1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICBjb25zdCB7IHJlZkNvdW50U3Vic2NyaXB0aW9uLCBncm91cFN1YmplY3QgfSA9IHRoaXM7XG4gICAgaWYgKHJlZkNvdW50U3Vic2NyaXB0aW9uICYmICFyZWZDb3VudFN1YnNjcmlwdGlvbi5jbG9zZWQpIHtcbiAgICAgIHN1YnNjcmlwdGlvbi5hZGQobmV3IElubmVyUmVmQ291bnRTdWJzY3JpcHRpb24ocmVmQ291bnRTdWJzY3JpcHRpb24pKTtcbiAgICB9XG4gICAgc3Vic2NyaXB0aW9uLmFkZChncm91cFN1YmplY3Quc3Vic2NyaWJlKHN1YnNjcmliZXIpKTtcbiAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBJbm5lclJlZkNvdW50U3Vic2NyaXB0aW9uIGV4dGVuZHMgU3Vic2NyaXB0aW9uIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwYXJlbnQ6IFJlZkNvdW50U3Vic2NyaXB0aW9uKSB7XG4gICAgc3VwZXIoKTtcbiAgICBwYXJlbnQuY291bnQrKztcbiAgfVxuXG4gIHVuc3Vic2NyaWJlKCkge1xuICAgIGNvbnN0IHBhcmVudCA9IHRoaXMucGFyZW50O1xuICAgIGlmICghcGFyZW50LmNsb3NlZCAmJiAhdGhpcy5jbG9zZWQpIHtcbiAgICAgIHN1cGVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICBwYXJlbnQuY291bnQgLT0gMTtcbiAgICAgIGlmIChwYXJlbnQuY291bnQgPT09IDAgJiYgcGFyZW50LmF0dGVtcHRlZFRvVW5zdWJzY3JpYmUpIHtcbiAgICAgICAgcGFyZW50LnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=