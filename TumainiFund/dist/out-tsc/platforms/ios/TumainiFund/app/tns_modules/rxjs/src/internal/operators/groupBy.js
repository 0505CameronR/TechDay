import { Subscriber } from '../Subscriber';
import { Subscription } from '../Subscription';
import { Observable } from '../Observable';
import { Subject } from '../Subject';
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
 * import { mergeMap, groupBy, reduce } from 'rxjs/operators';
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
 * import { mergeMap, groupBy, map, reduce } from 'rxjs/operators';
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
export function groupBy(keySelector, elementSelector, durationSelector, subjectSelector) {
    return (source) => source.lift(new GroupByOperator(keySelector, elementSelector, durationSelector, subjectSelector));
}
class GroupByOperator {
    constructor(keySelector, elementSelector, durationSelector, subjectSelector) {
        this.keySelector = keySelector;
        this.elementSelector = elementSelector;
        this.durationSelector = durationSelector;
        this.subjectSelector = subjectSelector;
    }
    call(subscriber, source) {
        return source.subscribe(new GroupBySubscriber(subscriber, this.keySelector, this.elementSelector, this.durationSelector, this.subjectSelector));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class GroupBySubscriber extends Subscriber {
    constructor(destination, keySelector, elementSelector, durationSelector, subjectSelector) {
        super(destination);
        this.keySelector = keySelector;
        this.elementSelector = elementSelector;
        this.durationSelector = durationSelector;
        this.subjectSelector = subjectSelector;
        this.groups = null;
        this.attemptedToUnsubscribe = false;
        this.count = 0;
    }
    _next(value) {
        let key;
        try {
            key = this.keySelector(value);
        }
        catch (err) {
            this.error(err);
            return;
        }
        this._group(value, key);
    }
    _group(value, key) {
        let groups = this.groups;
        if (!groups) {
            groups = this.groups = new Map();
        }
        let group = groups.get(key);
        let element;
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
            group = (this.subjectSelector ? this.subjectSelector() : new Subject());
            groups.set(key, group);
            const groupedObservable = new GroupedObservable(key, group, this);
            this.destination.next(groupedObservable);
            if (this.durationSelector) {
                let duration;
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
    }
    _error(err) {
        const groups = this.groups;
        if (groups) {
            groups.forEach((group, key) => {
                group.error(err);
            });
            groups.clear();
        }
        this.destination.error(err);
    }
    _complete() {
        const groups = this.groups;
        if (groups) {
            groups.forEach((group, key) => {
                group.complete();
            });
            groups.clear();
        }
        this.destination.complete();
    }
    removeGroup(key) {
        this.groups.delete(key);
    }
    unsubscribe() {
        if (!this.closed) {
            this.attemptedToUnsubscribe = true;
            if (this.count === 0) {
                super.unsubscribe();
            }
        }
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class GroupDurationSubscriber extends Subscriber {
    constructor(key, group, parent) {
        super(group);
        this.key = key;
        this.group = group;
        this.parent = parent;
    }
    _next(value) {
        this.complete();
    }
    /** @deprecated This is an internal implementation detail, do not use. */
    _unsubscribe() {
        const { parent, key } = this;
        this.key = this.parent = null;
        if (parent) {
            parent.removeGroup(key);
        }
    }
}
/**
 * An Observable representing values belonging to the same group represented by
 * a common key. The values emitted by a GroupedObservable come from the source
 * Observable. The common key is available as the field `key` on a
 * GroupedObservable instance.
 *
 * @class GroupedObservable<K, T>
 */
export class GroupedObservable extends Observable {
    /** @deprecated Do not construct this type. Internal use only */
    constructor(key, groupSubject, refCountSubscription) {
        super();
        this.key = key;
        this.groupSubject = groupSubject;
        this.refCountSubscription = refCountSubscription;
    }
    /** @deprecated This is an internal implementation detail, do not use. */
    _subscribe(subscriber) {
        const subscription = new Subscription();
        const { refCountSubscription, groupSubject } = this;
        if (refCountSubscription && !refCountSubscription.closed) {
            subscription.add(new InnerRefCountSubscription(refCountSubscription));
        }
        subscription.add(groupSubject.subscribe(subscriber));
        return subscription;
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class InnerRefCountSubscription extends Subscription {
    constructor(parent) {
        super();
        this.parent = parent;
        parent.count++;
    }
    unsubscribe() {
        const parent = this.parent;
        if (!parent.closed && !this.closed) {
            super.unsubscribe();
            parent.count -= 1;
            if (parent.count === 0 && parent.attemptedToUnsubscribe) {
                parent.unsubscribe();
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXBCeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9ncm91cEJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFlBQVksQ0FBQztBQVFyQyxtQ0FBbUM7QUFFbkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Rkc7QUFDSCxNQUFNLFVBQVUsT0FBTyxDQUFVLFdBQTRCLEVBQzVCLGVBQTBDLEVBQzFDLGdCQUF3RSxFQUN4RSxlQUFrQztJQUNqRSxPQUFPLENBQUMsTUFBcUIsRUFBRSxFQUFFLENBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxlQUFlLENBQUMsV0FBVyxFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDO0FBQ3RHLENBQUM7QUFTRCxNQUFNLGVBQWU7SUFDbkIsWUFBb0IsV0FBNEIsRUFDNUIsZUFBMEMsRUFDMUMsZ0JBQXdFLEVBQ3hFLGVBQWtDO1FBSGxDLGdCQUFXLEdBQVgsV0FBVyxDQUFpQjtRQUM1QixvQkFBZSxHQUFmLGVBQWUsQ0FBMkI7UUFDMUMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUF3RDtRQUN4RSxvQkFBZSxHQUFmLGVBQWUsQ0FBbUI7SUFDdEQsQ0FBQztJQUVELElBQUksQ0FBQyxVQUErQyxFQUFFLE1BQVc7UUFDL0QsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksaUJBQWlCLENBQzNDLFVBQVUsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxlQUFlLENBQ2hHLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLGlCQUEyQixTQUFRLFVBQWE7SUFLcEQsWUFBWSxXQUFnRCxFQUN4QyxXQUE0QixFQUM1QixlQUEwQyxFQUMxQyxnQkFBd0UsRUFDeEUsZUFBa0M7UUFDcEQsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBSkQsZ0JBQVcsR0FBWCxXQUFXLENBQWlCO1FBQzVCLG9CQUFlLEdBQWYsZUFBZSxDQUEyQjtRQUMxQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQXdEO1FBQ3hFLG9CQUFlLEdBQWYsZUFBZSxDQUFtQjtRQVI5QyxXQUFNLEdBQTJCLElBQUksQ0FBQztRQUN2QywyQkFBc0IsR0FBWSxLQUFLLENBQUM7UUFDeEMsVUFBSyxHQUFXLENBQUMsQ0FBQztJQVF6QixDQUFDO0lBRVMsS0FBSyxDQUFDLEtBQVE7UUFDdEIsSUFBSSxHQUFNLENBQUM7UUFDWCxJQUFJO1lBQ0YsR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDL0I7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDaEIsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVPLE1BQU0sQ0FBQyxLQUFRLEVBQUUsR0FBTTtRQUM3QixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBRXpCLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDWCxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLEdBQUcsRUFBcUIsQ0FBQztTQUNyRDtRQUVELElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFNUIsSUFBSSxPQUFVLENBQUM7UUFDZixJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDeEIsSUFBSTtnQkFDRixPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUN2QztZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNaLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDakI7U0FDRjthQUFNO1lBQ0wsT0FBTyxHQUFRLEtBQUssQ0FBQztTQUN0QjtRQUVELElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxFQUFLLENBQW1CLENBQUM7WUFDN0YsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdkIsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUN6QyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDekIsSUFBSSxRQUFhLENBQUM7Z0JBQ2xCLElBQUk7b0JBQ0YsUUFBUSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLGlCQUFpQixDQUFPLEdBQUcsRUFBYyxLQUFLLENBQUMsQ0FBQyxDQUFDO2lCQUN2RjtnQkFBQyxPQUFPLEdBQUcsRUFBRTtvQkFDWixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNoQixPQUFPO2lCQUNSO2dCQUNELElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLHVCQUF1QixDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzdFO1NBQ0Y7UUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNqQixLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3JCO0lBQ0gsQ0FBQztJQUVTLE1BQU0sQ0FBQyxHQUFRO1FBQ3ZCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDM0IsSUFBSSxNQUFNLEVBQUU7WUFDVixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFO2dCQUM1QixLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ25CLENBQUMsQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ2hCO1FBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVTLFNBQVM7UUFDakIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMzQixJQUFJLE1BQU0sRUFBRTtZQUNWLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUU7Z0JBQzVCLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNuQixDQUFDLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNoQjtRQUNELElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVELFdBQVcsQ0FBQyxHQUFNO1FBQ2hCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDaEIsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQztZQUNuQyxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssQ0FBQyxFQUFFO2dCQUNwQixLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7YUFDckI7U0FDRjtJQUNILENBQUM7Q0FDRjtBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLHVCQUE4QixTQUFRLFVBQWE7SUFDdkQsWUFBb0IsR0FBTSxFQUNOLEtBQWlCLEVBQ2pCLE1BQTBDO1FBQzVELEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUhLLFFBQUcsR0FBSCxHQUFHLENBQUc7UUFDTixVQUFLLEdBQUwsS0FBSyxDQUFZO1FBQ2pCLFdBQU0sR0FBTixNQUFNLENBQW9DO0lBRTlELENBQUM7SUFFUyxLQUFLLENBQUMsS0FBUTtRQUN0QixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDbEIsQ0FBQztJQUVELHlFQUF5RTtJQUN6RSxZQUFZO1FBQ1YsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDN0IsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUM5QixJQUFJLE1BQU0sRUFBRTtZQUNWLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDekI7SUFDSCxDQUFDO0NBQ0Y7QUFFRDs7Ozs7OztHQU9HO0FBQ0gsTUFBTSxPQUFPLGlCQUF3QixTQUFRLFVBQWE7SUFDeEQsZ0VBQWdFO0lBQ2hFLFlBQW1CLEdBQU0sRUFDTCxZQUF3QixFQUN4QixvQkFBMkM7UUFDN0QsS0FBSyxFQUFFLENBQUM7UUFIUyxRQUFHLEdBQUgsR0FBRyxDQUFHO1FBQ0wsaUJBQVksR0FBWixZQUFZLENBQVk7UUFDeEIseUJBQW9CLEdBQXBCLG9CQUFvQixDQUF1QjtJQUUvRCxDQUFDO0lBRUQseUVBQXlFO0lBQ3pFLFVBQVUsQ0FBQyxVQUF5QjtRQUNsQyxNQUFNLFlBQVksR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3hDLE1BQU0sRUFBRSxvQkFBb0IsRUFBRSxZQUFZLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDcEQsSUFBSSxvQkFBb0IsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sRUFBRTtZQUN4RCxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUkseUJBQXlCLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO1NBQ3ZFO1FBQ0QsWUFBWSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDckQsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztDQUNGO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0seUJBQTBCLFNBQVEsWUFBWTtJQUNsRCxZQUFvQixNQUE0QjtRQUM5QyxLQUFLLEVBQUUsQ0FBQztRQURVLFdBQU0sR0FBTixNQUFNLENBQXNCO1FBRTlDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNqQixDQUFDO0lBRUQsV0FBVztRQUNULE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2xDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNwQixNQUFNLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztZQUNsQixJQUFJLE1BQU0sQ0FBQyxLQUFLLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRTtnQkFDdkQsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO2FBQ3RCO1NBQ0Y7SUFDSCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi4vU3ViamVjdCc7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiBncm91cEJ5PFQsIEs+KGtleVNlbGVjdG9yOiAodmFsdWU6IFQpID0+IEspOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEdyb3VwZWRPYnNlcnZhYmxlPEssIFQ+PjtcbmV4cG9ydCBmdW5jdGlvbiBncm91cEJ5PFQsIEs+KGtleVNlbGVjdG9yOiAodmFsdWU6IFQpID0+IEssIGVsZW1lbnRTZWxlY3Rvcjogdm9pZCwgZHVyYXRpb25TZWxlY3RvcjogKGdyb3VwZWQ6IEdyb3VwZWRPYnNlcnZhYmxlPEssIFQ+KSA9PiBPYnNlcnZhYmxlPGFueT4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEdyb3VwZWRPYnNlcnZhYmxlPEssIFQ+PjtcbmV4cG9ydCBmdW5jdGlvbiBncm91cEJ5PFQsIEssIFI+KGtleVNlbGVjdG9yOiAodmFsdWU6IFQpID0+IEssIGVsZW1lbnRTZWxlY3Rvcj86ICh2YWx1ZTogVCkgPT4gUiwgZHVyYXRpb25TZWxlY3Rvcj86IChncm91cGVkOiBHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPikgPT4gT2JzZXJ2YWJsZTxhbnk+KTogT3BlcmF0b3JGdW5jdGlvbjxULCBHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPj47XG5leHBvcnQgZnVuY3Rpb24gZ3JvdXBCeTxULCBLLCBSPihrZXlTZWxlY3RvcjogKHZhbHVlOiBUKSA9PiBLLCBlbGVtZW50U2VsZWN0b3I/OiAodmFsdWU6IFQpID0+IFIsIGR1cmF0aW9uU2VsZWN0b3I/OiAoZ3JvdXBlZDogR3JvdXBlZE9ic2VydmFibGU8SywgUj4pID0+IE9ic2VydmFibGU8YW55Piwgc3ViamVjdFNlbGVjdG9yPzogKCkgPT4gU3ViamVjdDxSPik6IE9wZXJhdG9yRnVuY3Rpb248VCwgR3JvdXBlZE9ic2VydmFibGU8SywgUj4+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKiBHcm91cHMgdGhlIGl0ZW1zIGVtaXR0ZWQgYnkgYW4gT2JzZXJ2YWJsZSBhY2NvcmRpbmcgdG8gYSBzcGVjaWZpZWQgY3JpdGVyaW9uLFxuICogYW5kIGVtaXRzIHRoZXNlIGdyb3VwZWQgaXRlbXMgYXMgYEdyb3VwZWRPYnNlcnZhYmxlc2AsIG9uZVxuICoge0BsaW5rIEdyb3VwZWRPYnNlcnZhYmxlfSBwZXIgZ3JvdXAuXG4gKlxuICogIVtdKGdyb3VwQnkucG5nKVxuICpcbiAqIFdoZW4gdGhlIE9ic2VydmFibGUgZW1pdHMgYW4gaXRlbSwgYSBrZXkgaXMgY29tcHV0ZWQgZm9yIHRoaXMgaXRlbSB3aXRoIHRoZSBrZXlTZWxlY3RvciBmdW5jdGlvbi5cbiAqXG4gKiBJZiBhIHtAbGluayBHcm91cGVkT2JzZXJ2YWJsZX0gZm9yIHRoaXMga2V5IGV4aXN0cywgdGhpcyB7QGxpbmsgR3JvdXBlZE9ic2VydmFibGV9IGVtaXRzLiBFbHNld2hlcmUsIGEgbmV3XG4gKiB7QGxpbmsgR3JvdXBlZE9ic2VydmFibGV9IGZvciB0aGlzIGtleSBpcyBjcmVhdGVkIGFuZCBlbWl0cy5cbiAqXG4gKiBBIHtAbGluayBHcm91cGVkT2JzZXJ2YWJsZX0gcmVwcmVzZW50cyB2YWx1ZXMgYmVsb25naW5nIHRvIHRoZSBzYW1lIGdyb3VwIHJlcHJlc2VudGVkIGJ5IGEgY29tbW9uIGtleS4gVGhlIGNvbW1vblxuICoga2V5IGlzIGF2YWlsYWJsZSBhcyB0aGUga2V5IGZpZWxkIG9mIGEge0BsaW5rIEdyb3VwZWRPYnNlcnZhYmxlfSBpbnN0YW5jZS5cbiAqXG4gKiBUaGUgZWxlbWVudHMgZW1pdHRlZCBieSB7QGxpbmsgR3JvdXBlZE9ic2VydmFibGV9cyBhcmUgYnkgZGVmYXVsdCB0aGUgaXRlbXMgZW1pdHRlZCBieSB0aGUgT2JzZXJ2YWJsZSwgb3IgZWxlbWVudHNcbiAqIHJldHVybmVkIGJ5IHRoZSBlbGVtZW50U2VsZWN0b3IgZnVuY3Rpb24uXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqICMjIyBHcm91cCBvYmplY3RzIGJ5IGlkIGFuZCByZXR1cm4gYXMgYXJyYXlcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IG1lcmdlTWFwLCBncm91cEJ5LCByZWR1Y2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKiBpbXBvcnQgeyBvZiB9IGZyb20gJ3J4anMvb2JzZXJ2YWJsZS9vZic7XG4gKlxuICogaW50ZXJmYWNlIE9iaiB7XG4gKiAgICBpZDogbnVtYmVyLFxuICogICAgbmFtZTogc3RyaW5nLFxuICogfVxuICpcbiAqIG9mPE9iaj4oXG4gKiAgIHtpZDogMSwgbmFtZTogJ2phdmFzY3JpcHQnfSxcbiAqICAge2lkOiAyLCBuYW1lOiAncGFyY2VsJ30sXG4gKiAgIHtpZDogMiwgbmFtZTogJ3dlYnBhY2snfSxcbiAqICAge2lkOiAxLCBuYW1lOiAndHlwZXNjcmlwdCd9LFxuICogICB7aWQ6IDMsIG5hbWU6ICd0c2xpbnQnfVxuICogKS5waXBlKFxuICogICBncm91cEJ5KHAgPT4gcC5pZCksXG4gKiAgIG1lcmdlTWFwKChncm91cCQpID0+IGdyb3VwJC5waXBlKHJlZHVjZSgoYWNjLCBjdXIpID0+IFsuLi5hY2MsIGN1cl0sIFtdKSkpLFxuICogKVxuICogLnN1YnNjcmliZShwID0+IGNvbnNvbGUubG9nKHApKTtcbiAqXG4gKiAvLyBkaXNwbGF5czpcbiAqIC8vIFsgeyBpZDogMSwgbmFtZTogJ2phdmFzY3JpcHQnfSxcbiAqIC8vICAgeyBpZDogMSwgbmFtZTogJ3R5cGVzY3JpcHQnfSBdXG4gKiAvL1xuICogLy8gWyB7IGlkOiAyLCBuYW1lOiAncGFyY2VsJ30sXG4gKiAvLyAgIHsgaWQ6IDIsIG5hbWU6ICd3ZWJwYWNrJ30gXVxuICogLy9cbiAqIC8vIFsgeyBpZDogMywgbmFtZTogJ3RzbGludCd9IF1cbiAqIGBgYFxuICpcbiAqICMjIyBQaXZvdCBkYXRhIG9uIHRoZSBpZCBmaWVsZFxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgbWVyZ2VNYXAsIGdyb3VwQnksIG1hcCwgcmVkdWNlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICogaW1wb3J0IHsgb2YgfSBmcm9tICdyeGpzL29ic2VydmFibGUvb2YnO1xuICpcbiAqIG9mPE9iaj4oXG4gKiAgIHtpZDogMSwgbmFtZTogJ2phdmFzY3JpcHQnfSxcbiAqICAge2lkOiAyLCBuYW1lOiAncGFyY2VsJ30sXG4gKiAgIHtpZDogMiwgbmFtZTogJ3dlYnBhY2snfSxcbiAqICAge2lkOiAxLCBuYW1lOiAndHlwZXNjcmlwdCd9XG4gKiAgIHtpZDogMywgbmFtZTogJ3RzbGludCd9XG4gKiApLnBpcGUoXG4gKiAgIGdyb3VwQnkocCA9PiBwLmlkLCBwID0+IHAubmFtZSksXG4gKiAgIG1lcmdlTWFwKCAoZ3JvdXAkKSA9PiBncm91cCQucGlwZShyZWR1Y2UoKGFjYywgY3VyKSA9PiBbLi4uYWNjLCBjdXJdLCBbXCJcIiArIGdyb3VwJC5rZXldKSkpLFxuICogICBtYXAoYXJyID0+ICh7J2lkJzogcGFyc2VJbnQoYXJyWzBdKSwgJ3ZhbHVlcyc6IGFyci5zbGljZSgxKX0pKSxcbiAqIClcbiAqIC5zdWJzY3JpYmUocCA9PiBjb25zb2xlLmxvZyhwKSk7XG4gKlxuICogLy8gZGlzcGxheXM6XG4gKiAvLyB7IGlkOiAxLCB2YWx1ZXM6IFsgJ2phdmFzY3JpcHQnLCAndHlwZXNjcmlwdCcgXSB9XG4gKiAvLyB7IGlkOiAyLCB2YWx1ZXM6IFsgJ3BhcmNlbCcsICd3ZWJwYWNrJyBdIH1cbiAqIC8vIHsgaWQ6IDMsIHZhbHVlczogWyAndHNsaW50JyBdIH1cbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24odmFsdWU6IFQpOiBLfSBrZXlTZWxlY3RvciBBIGZ1bmN0aW9uIHRoYXQgZXh0cmFjdHMgdGhlIGtleVxuICogZm9yIGVhY2ggaXRlbS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24odmFsdWU6IFQpOiBSfSBbZWxlbWVudFNlbGVjdG9yXSBBIGZ1bmN0aW9uIHRoYXQgZXh0cmFjdHMgdGhlXG4gKiByZXR1cm4gZWxlbWVudCBmb3IgZWFjaCBpdGVtLlxuICogQHBhcmFtIHtmdW5jdGlvbihncm91cGVkOiBHcm91cGVkT2JzZXJ2YWJsZTxLLFI+KTogT2JzZXJ2YWJsZTxhbnk+fSBbZHVyYXRpb25TZWxlY3Rvcl1cbiAqIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIE9ic2VydmFibGUgdG8gZGV0ZXJtaW5lIGhvdyBsb25nIGVhY2ggZ3JvdXAgc2hvdWxkXG4gKiBleGlzdC5cbiAqIEByZXR1cm4ge09ic2VydmFibGU8R3JvdXBlZE9ic2VydmFibGU8SyxSPj59IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0c1xuICogR3JvdXBlZE9ic2VydmFibGVzLCBlYWNoIG9mIHdoaWNoIGNvcnJlc3BvbmRzIHRvIGEgdW5pcXVlIGtleSB2YWx1ZSBhbmQgZWFjaFxuICogb2Ygd2hpY2ggZW1pdHMgdGhvc2UgaXRlbXMgZnJvbSB0aGUgc291cmNlIE9ic2VydmFibGUgdGhhdCBzaGFyZSB0aGF0IGtleVxuICogdmFsdWUuXG4gKiBAbWV0aG9kIGdyb3VwQnlcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBncm91cEJ5PFQsIEssIFI+KGtleVNlbGVjdG9yOiAodmFsdWU6IFQpID0+IEssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50U2VsZWN0b3I/OiAoKHZhbHVlOiBUKSA9PiBSKSB8IHZvaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvblNlbGVjdG9yPzogKGdyb3VwZWQ6IEdyb3VwZWRPYnNlcnZhYmxlPEssIFI+KSA9PiBPYnNlcnZhYmxlPGFueT4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJqZWN0U2VsZWN0b3I/OiAoKSA9PiBTdWJqZWN0PFI+KTogT3BlcmF0b3JGdW5jdGlvbjxULCBHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPj4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT5cbiAgICBzb3VyY2UubGlmdChuZXcgR3JvdXBCeU9wZXJhdG9yKGtleVNlbGVjdG9yLCBlbGVtZW50U2VsZWN0b3IsIGR1cmF0aW9uU2VsZWN0b3IsIHN1YmplY3RTZWxlY3RvcikpO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlZkNvdW50U3Vic2NyaXB0aW9uIHtcbiAgY291bnQ6IG51bWJlcjtcbiAgdW5zdWJzY3JpYmU6ICgpID0+IHZvaWQ7XG4gIGNsb3NlZDogYm9vbGVhbjtcbiAgYXR0ZW1wdGVkVG9VbnN1YnNjcmliZTogYm9vbGVhbjtcbn1cblxuY2xhc3MgR3JvdXBCeU9wZXJhdG9yPFQsIEssIFI+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgR3JvdXBlZE9ic2VydmFibGU8SywgUj4+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBrZXlTZWxlY3RvcjogKHZhbHVlOiBUKSA9PiBLLFxuICAgICAgICAgICAgICBwcml2YXRlIGVsZW1lbnRTZWxlY3Rvcj86ICgodmFsdWU6IFQpID0+IFIpIHwgdm9pZCxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBkdXJhdGlvblNlbGVjdG9yPzogKGdyb3VwZWQ6IEdyb3VwZWRPYnNlcnZhYmxlPEssIFI+KSA9PiBPYnNlcnZhYmxlPGFueT4sXG4gICAgICAgICAgICAgIHByaXZhdGUgc3ViamVjdFNlbGVjdG9yPzogKCkgPT4gU3ViamVjdDxSPikge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPEdyb3VwZWRPYnNlcnZhYmxlPEssIFI+Piwgc291cmNlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBHcm91cEJ5U3Vic2NyaWJlcihcbiAgICAgIHN1YnNjcmliZXIsIHRoaXMua2V5U2VsZWN0b3IsIHRoaXMuZWxlbWVudFNlbGVjdG9yLCB0aGlzLmR1cmF0aW9uU2VsZWN0b3IsIHRoaXMuc3ViamVjdFNlbGVjdG9yXG4gICAgKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIEdyb3VwQnlTdWJzY3JpYmVyPFQsIEssIFI+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiBpbXBsZW1lbnRzIFJlZkNvdW50U3Vic2NyaXB0aW9uIHtcbiAgcHJpdmF0ZSBncm91cHM6IE1hcDxLLCBTdWJqZWN0PFQgfCBSPj4gPSBudWxsO1xuICBwdWJsaWMgYXR0ZW1wdGVkVG9VbnN1YnNjcmliZTogYm9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgY291bnQ6IG51bWJlciA9IDA7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8R3JvdXBlZE9ic2VydmFibGU8SywgUj4+LFxuICAgICAgICAgICAgICBwcml2YXRlIGtleVNlbGVjdG9yOiAodmFsdWU6IFQpID0+IEssXG4gICAgICAgICAgICAgIHByaXZhdGUgZWxlbWVudFNlbGVjdG9yPzogKCh2YWx1ZTogVCkgPT4gUikgfCB2b2lkLFxuICAgICAgICAgICAgICBwcml2YXRlIGR1cmF0aW9uU2VsZWN0b3I/OiAoZ3JvdXBlZDogR3JvdXBlZE9ic2VydmFibGU8SywgUj4pID0+IE9ic2VydmFibGU8YW55PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzdWJqZWN0U2VsZWN0b3I/OiAoKSA9PiBTdWJqZWN0PFI+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgbGV0IGtleTogSztcbiAgICB0cnkge1xuICAgICAga2V5ID0gdGhpcy5rZXlTZWxlY3Rvcih2YWx1ZSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLmVycm9yKGVycik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fZ3JvdXAodmFsdWUsIGtleSk7XG4gIH1cblxuICBwcml2YXRlIF9ncm91cCh2YWx1ZTogVCwga2V5OiBLKSB7XG4gICAgbGV0IGdyb3VwcyA9IHRoaXMuZ3JvdXBzO1xuXG4gICAgaWYgKCFncm91cHMpIHtcbiAgICAgIGdyb3VwcyA9IHRoaXMuZ3JvdXBzID0gbmV3IE1hcDxLLCBTdWJqZWN0PFQgfCBSPj4oKTtcbiAgICB9XG5cbiAgICBsZXQgZ3JvdXAgPSBncm91cHMuZ2V0KGtleSk7XG5cbiAgICBsZXQgZWxlbWVudDogUjtcbiAgICBpZiAodGhpcy5lbGVtZW50U2VsZWN0b3IpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGVsZW1lbnQgPSB0aGlzLmVsZW1lbnRTZWxlY3Rvcih2YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50ID0gPGFueT52YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAoIWdyb3VwKSB7XG4gICAgICBncm91cCA9ICh0aGlzLnN1YmplY3RTZWxlY3RvciA/IHRoaXMuc3ViamVjdFNlbGVjdG9yKCkgOiBuZXcgU3ViamVjdDxSPigpKSBhcyBTdWJqZWN0PFQgfCBSPjtcbiAgICAgIGdyb3Vwcy5zZXQoa2V5LCBncm91cCk7XG4gICAgICBjb25zdCBncm91cGVkT2JzZXJ2YWJsZSA9IG5ldyBHcm91cGVkT2JzZXJ2YWJsZShrZXksIGdyb3VwLCB0aGlzKTtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChncm91cGVkT2JzZXJ2YWJsZSk7XG4gICAgICBpZiAodGhpcy5kdXJhdGlvblNlbGVjdG9yKSB7XG4gICAgICAgIGxldCBkdXJhdGlvbjogYW55O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGR1cmF0aW9uID0gdGhpcy5kdXJhdGlvblNlbGVjdG9yKG5ldyBHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPihrZXksIDxTdWJqZWN0PFI+Pmdyb3VwKSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hZGQoZHVyYXRpb24uc3Vic2NyaWJlKG5ldyBHcm91cER1cmF0aW9uU3Vic2NyaWJlcihrZXksIGdyb3VwLCB0aGlzKSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghZ3JvdXAuY2xvc2VkKSB7XG4gICAgICBncm91cC5uZXh0KGVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfZXJyb3IoZXJyOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBncm91cHMgPSB0aGlzLmdyb3VwcztcbiAgICBpZiAoZ3JvdXBzKSB7XG4gICAgICBncm91cHMuZm9yRWFjaCgoZ3JvdXAsIGtleSkgPT4ge1xuICAgICAgICBncm91cC5lcnJvcihlcnIpO1xuICAgICAgfSk7XG5cbiAgICAgIGdyb3Vwcy5jbGVhcigpO1xuICAgIH1cbiAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCk6IHZvaWQge1xuICAgIGNvbnN0IGdyb3VwcyA9IHRoaXMuZ3JvdXBzO1xuICAgIGlmIChncm91cHMpIHtcbiAgICAgIGdyb3Vwcy5mb3JFYWNoKChncm91cCwga2V5KSA9PiB7XG4gICAgICAgIGdyb3VwLmNvbXBsZXRlKCk7XG4gICAgICB9KTtcblxuICAgICAgZ3JvdXBzLmNsZWFyKCk7XG4gICAgfVxuICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgfVxuXG4gIHJlbW92ZUdyb3VwKGtleTogSyk6IHZvaWQge1xuICAgIHRoaXMuZ3JvdXBzLmRlbGV0ZShrZXkpO1xuICB9XG5cbiAgdW5zdWJzY3JpYmUoKSB7XG4gICAgaWYgKCF0aGlzLmNsb3NlZCkge1xuICAgICAgdGhpcy5hdHRlbXB0ZWRUb1Vuc3Vic2NyaWJlID0gdHJ1ZTtcbiAgICAgIGlmICh0aGlzLmNvdW50ID09PSAwKSB7XG4gICAgICAgIHN1cGVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBHcm91cER1cmF0aW9uU3Vic2NyaWJlcjxLLCBUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGtleTogSyxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBncm91cDogU3ViamVjdDxUPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBwYXJlbnQ6IEdyb3VwQnlTdWJzY3JpYmVyPGFueSwgSywgVCB8IGFueT4pIHtcbiAgICBzdXBlcihncm91cCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICB0aGlzLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF91bnN1YnNjcmliZSgpIHtcbiAgICBjb25zdCB7IHBhcmVudCwga2V5IH0gPSB0aGlzO1xuICAgIHRoaXMua2V5ID0gdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIHBhcmVudC5yZW1vdmVHcm91cChrZXkpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEFuIE9ic2VydmFibGUgcmVwcmVzZW50aW5nIHZhbHVlcyBiZWxvbmdpbmcgdG8gdGhlIHNhbWUgZ3JvdXAgcmVwcmVzZW50ZWQgYnlcbiAqIGEgY29tbW9uIGtleS4gVGhlIHZhbHVlcyBlbWl0dGVkIGJ5IGEgR3JvdXBlZE9ic2VydmFibGUgY29tZSBmcm9tIHRoZSBzb3VyY2VcbiAqIE9ic2VydmFibGUuIFRoZSBjb21tb24ga2V5IGlzIGF2YWlsYWJsZSBhcyB0aGUgZmllbGQgYGtleWAgb24gYVxuICogR3JvdXBlZE9ic2VydmFibGUgaW5zdGFuY2UuXG4gKlxuICogQGNsYXNzIEdyb3VwZWRPYnNlcnZhYmxlPEssIFQ+XG4gKi9cbmV4cG9ydCBjbGFzcyBHcm91cGVkT2JzZXJ2YWJsZTxLLCBUPiBleHRlbmRzIE9ic2VydmFibGU8VD4ge1xuICAvKiogQGRlcHJlY2F0ZWQgRG8gbm90IGNvbnN0cnVjdCB0aGlzIHR5cGUuIEludGVybmFsIHVzZSBvbmx5ICovXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBrZXk6IEssXG4gICAgICAgICAgICAgIHByaXZhdGUgZ3JvdXBTdWJqZWN0OiBTdWJqZWN0PFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIHJlZkNvdW50U3Vic2NyaXB0aW9uPzogUmVmQ291bnRTdWJzY3JpcHRpb24pIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfc3Vic2NyaWJlKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pIHtcbiAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgY29uc3QgeyByZWZDb3VudFN1YnNjcmlwdGlvbiwgZ3JvdXBTdWJqZWN0IH0gPSB0aGlzO1xuICAgIGlmIChyZWZDb3VudFN1YnNjcmlwdGlvbiAmJiAhcmVmQ291bnRTdWJzY3JpcHRpb24uY2xvc2VkKSB7XG4gICAgICBzdWJzY3JpcHRpb24uYWRkKG5ldyBJbm5lclJlZkNvdW50U3Vic2NyaXB0aW9uKHJlZkNvdW50U3Vic2NyaXB0aW9uKSk7XG4gICAgfVxuICAgIHN1YnNjcmlwdGlvbi5hZGQoZ3JvdXBTdWJqZWN0LnN1YnNjcmliZShzdWJzY3JpYmVyKSk7XG4gICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgSW5uZXJSZWZDb3VudFN1YnNjcmlwdGlvbiBleHRlbmRzIFN1YnNjcmlwdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFyZW50OiBSZWZDb3VudFN1YnNjcmlwdGlvbikge1xuICAgIHN1cGVyKCk7XG4gICAgcGFyZW50LmNvdW50Kys7XG4gIH1cblxuICB1bnN1YnNjcmliZSgpIHtcbiAgICBjb25zdCBwYXJlbnQgPSB0aGlzLnBhcmVudDtcbiAgICBpZiAoIXBhcmVudC5jbG9zZWQgJiYgIXRoaXMuY2xvc2VkKSB7XG4gICAgICBzdXBlci51bnN1YnNjcmliZSgpO1xuICAgICAgcGFyZW50LmNvdW50IC09IDE7XG4gICAgICBpZiAocGFyZW50LmNvdW50ID09PSAwICYmIHBhcmVudC5hdHRlbXB0ZWRUb1Vuc3Vic2NyaWJlKSB7XG4gICAgICAgIHBhcmVudC51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19