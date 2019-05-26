import { Subscriber } from '../Subscriber';
/**
 * Compares all values of two observables in sequence using an optional comparator function
 * and returns an observable of a single boolean value representing whether or not the two sequences
 * are equal.
 *
 * <span class="informal">Checks to see of all values emitted by both observables are equal, in order.</span>
 *
 * ![](sequenceEqual.png)
 *
 * `sequenceEqual` subscribes to two observables and buffers incoming values from each observable. Whenever either
 * observable emits a value, the value is buffered and the buffers are shifted and compared from the bottom
 * up; If any value pair doesn't match, the returned observable will emit `false` and complete. If one of the
 * observables completes, the operator will wait for the other observable to complete; If the other
 * observable emits before completing, the returned observable will emit `false` and complete. If one observable never
 * completes or emits after the other complets, the returned observable will never complete.
 *
 * ## Example
 * figure out if the Konami code matches
 * ```javascript
 * import { from, fromEvent } from 'rxjs';
 * import { sequenceEqual, bufferCount, mergeMap, map } from 'rxjs/operators';
 *
 * const codes = from([
 *   'ArrowUp',
 *   'ArrowUp',
 *   'ArrowDown',
 *   'ArrowDown',
 *   'ArrowLeft',
 *   'ArrowRight',
 *   'ArrowLeft',
 *   'ArrowRight',
 *   'KeyB',
 *   'KeyA',
 *   'Enter', // no start key, clearly.
 * ]);
 *
 * const keys = fromEvent(document, 'keyup').pipe(map(e => e.code));
 * const matches = keys.pipe(
 *   bufferCount(11, 1),
 *   mergeMap(
 *     last11 => from(last11).pipe(sequenceEqual(codes)),
 *   ),
 * );
 * matches.subscribe(matched => console.log('Successful cheat at Contra? ', matched));
 * ```
 *
 * @see {@link combineLatest}
 * @see {@link zip}
 * @see {@link withLatestFrom}
 *
 * @param {Observable} compareTo The observable sequence to compare the source sequence to.
 * @param {function} [comparator] An optional function to compare each value pair
 * @return {Observable} An Observable of a single boolean value representing whether or not
 * the values emitted by both observables were equal in sequence.
 * @method sequenceEqual
 * @owner Observable
 */
export function sequenceEqual(compareTo, comparator) {
    return (source) => source.lift(new SequenceEqualOperator(compareTo, comparator));
}
export class SequenceEqualOperator {
    constructor(compareTo, comparator) {
        this.compareTo = compareTo;
        this.comparator = comparator;
    }
    call(subscriber, source) {
        return source.subscribe(new SequenceEqualSubscriber(subscriber, this.compareTo, this.comparator));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
export class SequenceEqualSubscriber extends Subscriber {
    constructor(destination, compareTo, comparator) {
        super(destination);
        this.compareTo = compareTo;
        this.comparator = comparator;
        this._a = [];
        this._b = [];
        this._oneComplete = false;
        this.destination.add(compareTo.subscribe(new SequenceEqualCompareToSubscriber(destination, this)));
    }
    _next(value) {
        if (this._oneComplete && this._b.length === 0) {
            this.emit(false);
        }
        else {
            this._a.push(value);
            this.checkValues();
        }
    }
    _complete() {
        if (this._oneComplete) {
            this.emit(this._a.length === 0 && this._b.length === 0);
        }
        else {
            this._oneComplete = true;
        }
        this.unsubscribe();
    }
    checkValues() {
        const { _a, _b, comparator } = this;
        while (_a.length > 0 && _b.length > 0) {
            let a = _a.shift();
            let b = _b.shift();
            let areEqual = false;
            try {
                areEqual = comparator ? comparator(a, b) : a === b;
            }
            catch (e) {
                this.destination.error(e);
            }
            if (!areEqual) {
                this.emit(false);
            }
        }
    }
    emit(value) {
        const { destination } = this;
        destination.next(value);
        destination.complete();
    }
    nextB(value) {
        if (this._oneComplete && this._a.length === 0) {
            this.emit(false);
        }
        else {
            this._b.push(value);
            this.checkValues();
        }
    }
    completeB() {
        if (this._oneComplete) {
            this.emit(this._a.length === 0 && this._b.length === 0);
        }
        else {
            this._oneComplete = true;
        }
    }
}
class SequenceEqualCompareToSubscriber extends Subscriber {
    constructor(destination, parent) {
        super(destination);
        this.parent = parent;
    }
    _next(value) {
        this.parent.nextB(value);
    }
    _error(err) {
        this.parent.error(err);
        this.unsubscribe();
    }
    _complete() {
        this.parent.completeB();
        this.unsubscribe();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VxdWVuY2VFcXVhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9zZXF1ZW5jZUVxdWFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFLM0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0RHO0FBQ0gsTUFBTSxVQUFVLGFBQWEsQ0FBSSxTQUF3QixFQUN4QixVQUFvQztJQUNuRSxPQUFPLENBQUMsTUFBcUIsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLHFCQUFxQixDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBQ2xHLENBQUM7QUFFRCxNQUFNLE9BQU8scUJBQXFCO0lBQ2hDLFlBQW9CLFNBQXdCLEVBQ3hCLFVBQW1DO1FBRG5DLGNBQVMsR0FBVCxTQUFTLENBQWU7UUFDeEIsZUFBVSxHQUFWLFVBQVUsQ0FBeUI7SUFDdkQsQ0FBQztJQUVELElBQUksQ0FBQyxVQUErQixFQUFFLE1BQVc7UUFDL0MsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksdUJBQXVCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDcEcsQ0FBQztDQUNGO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sT0FBTyx1QkFBOEIsU0FBUSxVQUFhO0lBSzlELFlBQVksV0FBd0IsRUFDaEIsU0FBd0IsRUFDeEIsVUFBbUM7UUFDckQsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRkQsY0FBUyxHQUFULFNBQVMsQ0FBZTtRQUN4QixlQUFVLEdBQVYsVUFBVSxDQUF5QjtRQU4vQyxPQUFFLEdBQVEsRUFBRSxDQUFDO1FBQ2IsT0FBRSxHQUFRLEVBQUUsQ0FBQztRQUNiLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBTTFCLElBQUksQ0FBQyxXQUE0QixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksZ0NBQWdDLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2SCxDQUFDO0lBRVMsS0FBSyxDQUFDLEtBQVE7UUFDdEIsSUFBSSxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUM3QyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2xCO2FBQU07WUFDTCxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDcEI7SUFDSCxDQUFDO0lBRU0sU0FBUztRQUNkLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQztTQUN6RDthQUFNO1lBQ0wsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7U0FDMUI7UUFDRCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVELFdBQVc7UUFDVCxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDcEMsT0FBTyxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNyQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDbkIsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ25CLElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQztZQUNyQixJQUFJO2dCQUNGLFFBQVEsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDcEQ7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDVixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUMzQjtZQUNELElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNsQjtTQUNGO0lBQ0gsQ0FBQztJQUVELElBQUksQ0FBQyxLQUFjO1FBQ2pCLE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDN0IsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QixXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFRO1FBQ1osSUFBSSxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUM3QyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2xCO2FBQU07WUFDTCxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDcEI7SUFDSCxDQUFDO0lBRUQsU0FBUztRQUNQLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQztTQUN6RDthQUFNO1lBQ0wsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7U0FDMUI7SUFDSCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLGdDQUF1QyxTQUFRLFVBQWE7SUFDaEUsWUFBWSxXQUF3QixFQUFVLE1BQXFDO1FBQ2pGLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUR5QixXQUFNLEdBQU4sTUFBTSxDQUErQjtJQUVuRixDQUFDO0lBRVMsS0FBSyxDQUFDLEtBQVE7UUFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVTLE1BQU0sQ0FBQyxHQUFRO1FBQ3ZCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRVMsU0FBUztRQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNyQixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5cbmltcG9ydCB7IE9ic2VydmVyLCBPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIENvbXBhcmVzIGFsbCB2YWx1ZXMgb2YgdHdvIG9ic2VydmFibGVzIGluIHNlcXVlbmNlIHVzaW5nIGFuIG9wdGlvbmFsIGNvbXBhcmF0b3IgZnVuY3Rpb25cbiAqIGFuZCByZXR1cm5zIGFuIG9ic2VydmFibGUgb2YgYSBzaW5nbGUgYm9vbGVhbiB2YWx1ZSByZXByZXNlbnRpbmcgd2hldGhlciBvciBub3QgdGhlIHR3byBzZXF1ZW5jZXNcbiAqIGFyZSBlcXVhbC5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+Q2hlY2tzIHRvIHNlZSBvZiBhbGwgdmFsdWVzIGVtaXR0ZWQgYnkgYm90aCBvYnNlcnZhYmxlcyBhcmUgZXF1YWwsIGluIG9yZGVyLjwvc3Bhbj5cbiAqXG4gKiAhW10oc2VxdWVuY2VFcXVhbC5wbmcpXG4gKlxuICogYHNlcXVlbmNlRXF1YWxgIHN1YnNjcmliZXMgdG8gdHdvIG9ic2VydmFibGVzIGFuZCBidWZmZXJzIGluY29taW5nIHZhbHVlcyBmcm9tIGVhY2ggb2JzZXJ2YWJsZS4gV2hlbmV2ZXIgZWl0aGVyXG4gKiBvYnNlcnZhYmxlIGVtaXRzIGEgdmFsdWUsIHRoZSB2YWx1ZSBpcyBidWZmZXJlZCBhbmQgdGhlIGJ1ZmZlcnMgYXJlIHNoaWZ0ZWQgYW5kIGNvbXBhcmVkIGZyb20gdGhlIGJvdHRvbVxuICogdXA7IElmIGFueSB2YWx1ZSBwYWlyIGRvZXNuJ3QgbWF0Y2gsIHRoZSByZXR1cm5lZCBvYnNlcnZhYmxlIHdpbGwgZW1pdCBgZmFsc2VgIGFuZCBjb21wbGV0ZS4gSWYgb25lIG9mIHRoZVxuICogb2JzZXJ2YWJsZXMgY29tcGxldGVzLCB0aGUgb3BlcmF0b3Igd2lsbCB3YWl0IGZvciB0aGUgb3RoZXIgb2JzZXJ2YWJsZSB0byBjb21wbGV0ZTsgSWYgdGhlIG90aGVyXG4gKiBvYnNlcnZhYmxlIGVtaXRzIGJlZm9yZSBjb21wbGV0aW5nLCB0aGUgcmV0dXJuZWQgb2JzZXJ2YWJsZSB3aWxsIGVtaXQgYGZhbHNlYCBhbmQgY29tcGxldGUuIElmIG9uZSBvYnNlcnZhYmxlIG5ldmVyXG4gKiBjb21wbGV0ZXMgb3IgZW1pdHMgYWZ0ZXIgdGhlIG90aGVyIGNvbXBsZXRzLCB0aGUgcmV0dXJuZWQgb2JzZXJ2YWJsZSB3aWxsIG5ldmVyIGNvbXBsZXRlLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIGZpZ3VyZSBvdXQgaWYgdGhlIEtvbmFtaSBjb2RlIG1hdGNoZXNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IGZyb20sIGZyb21FdmVudCB9IGZyb20gJ3J4anMnO1xuICogaW1wb3J0IHsgc2VxdWVuY2VFcXVhbCwgYnVmZmVyQ291bnQsIG1lcmdlTWFwLCBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKlxuICogY29uc3QgY29kZXMgPSBmcm9tKFtcbiAqICAgJ0Fycm93VXAnLFxuICogICAnQXJyb3dVcCcsXG4gKiAgICdBcnJvd0Rvd24nLFxuICogICAnQXJyb3dEb3duJyxcbiAqICAgJ0Fycm93TGVmdCcsXG4gKiAgICdBcnJvd1JpZ2h0JyxcbiAqICAgJ0Fycm93TGVmdCcsXG4gKiAgICdBcnJvd1JpZ2h0JyxcbiAqICAgJ0tleUInLFxuICogICAnS2V5QScsXG4gKiAgICdFbnRlcicsIC8vIG5vIHN0YXJ0IGtleSwgY2xlYXJseS5cbiAqIF0pO1xuICpcbiAqIGNvbnN0IGtleXMgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdrZXl1cCcpLnBpcGUobWFwKGUgPT4gZS5jb2RlKSk7XG4gKiBjb25zdCBtYXRjaGVzID0ga2V5cy5waXBlKFxuICogICBidWZmZXJDb3VudCgxMSwgMSksXG4gKiAgIG1lcmdlTWFwKFxuICogICAgIGxhc3QxMSA9PiBmcm9tKGxhc3QxMSkucGlwZShzZXF1ZW5jZUVxdWFsKGNvZGVzKSksXG4gKiAgICksXG4gKiApO1xuICogbWF0Y2hlcy5zdWJzY3JpYmUobWF0Y2hlZCA9PiBjb25zb2xlLmxvZygnU3VjY2Vzc2Z1bCBjaGVhdCBhdCBDb250cmE/ICcsIG1hdGNoZWQpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGNvbWJpbmVMYXRlc3R9XG4gKiBAc2VlIHtAbGluayB6aXB9XG4gKiBAc2VlIHtAbGluayB3aXRoTGF0ZXN0RnJvbX1cbiAqXG4gKiBAcGFyYW0ge09ic2VydmFibGV9IGNvbXBhcmVUbyBUaGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0byBjb21wYXJlIHRoZSBzb3VyY2Ugc2VxdWVuY2UgdG8uXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbY29tcGFyYXRvcl0gQW4gb3B0aW9uYWwgZnVuY3Rpb24gdG8gY29tcGFyZSBlYWNoIHZhbHVlIHBhaXJcbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgb2YgYSBzaW5nbGUgYm9vbGVhbiB2YWx1ZSByZXByZXNlbnRpbmcgd2hldGhlciBvciBub3RcbiAqIHRoZSB2YWx1ZXMgZW1pdHRlZCBieSBib3RoIG9ic2VydmFibGVzIHdlcmUgZXF1YWwgaW4gc2VxdWVuY2UuXG4gKiBAbWV0aG9kIHNlcXVlbmNlRXF1YWxcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXF1ZW5jZUVxdWFsPFQ+KGNvbXBhcmVUbzogT2JzZXJ2YWJsZTxUPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBhcmF0b3I/OiAoYTogVCwgYjogVCkgPT4gYm9vbGVhbik6IE9wZXJhdG9yRnVuY3Rpb248VCwgYm9vbGVhbj4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gc291cmNlLmxpZnQobmV3IFNlcXVlbmNlRXF1YWxPcGVyYXRvcihjb21wYXJlVG8sIGNvbXBhcmF0b3IpKTtcbn1cblxuZXhwb3J0IGNsYXNzIFNlcXVlbmNlRXF1YWxPcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIGJvb2xlYW4+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjb21wYXJlVG86IE9ic2VydmFibGU8VD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgY29tcGFyYXRvcjogKGE6IFQsIGI6IFQpID0+IGJvb2xlYW4pIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxib29sZWFuPiwgc291cmNlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBTZXF1ZW5jZUVxdWFsU3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLmNvbXBhcmVUbywgdGhpcy5jb21wYXJhdG9yKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmV4cG9ydCBjbGFzcyBTZXF1ZW5jZUVxdWFsU3Vic2NyaWJlcjxULCBSPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBwcml2YXRlIF9hOiBUW10gPSBbXTtcbiAgcHJpdmF0ZSBfYjogVFtdID0gW107XG4gIHByaXZhdGUgX29uZUNvbXBsZXRlID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IE9ic2VydmVyPFI+LFxuICAgICAgICAgICAgICBwcml2YXRlIGNvbXBhcmVUbzogT2JzZXJ2YWJsZTxUPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjb21wYXJhdG9yOiAoYTogVCwgYjogVCkgPT4gYm9vbGVhbikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgICAodGhpcy5kZXN0aW5hdGlvbiBhcyBTdWJzY3JpcHRpb24pLmFkZChjb21wYXJlVG8uc3Vic2NyaWJlKG5ldyBTZXF1ZW5jZUVxdWFsQ29tcGFyZVRvU3Vic2NyaWJlcihkZXN0aW5hdGlvbiwgdGhpcykpKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9vbmVDb21wbGV0ZSAmJiB0aGlzLl9iLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5lbWl0KGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYS5wdXNoKHZhbHVlKTtcbiAgICAgIHRoaXMuY2hlY2tWYWx1ZXMoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgX2NvbXBsZXRlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9vbmVDb21wbGV0ZSkge1xuICAgICAgdGhpcy5lbWl0KHRoaXMuX2EubGVuZ3RoID09PSAwICYmIHRoaXMuX2IubGVuZ3RoID09PSAwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fb25lQ29tcGxldGUgPSB0cnVlO1xuICAgIH1cbiAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBjaGVja1ZhbHVlcygpIHtcbiAgICBjb25zdCB7IF9hLCBfYiwgY29tcGFyYXRvciB9ID0gdGhpcztcbiAgICB3aGlsZSAoX2EubGVuZ3RoID4gMCAmJiBfYi5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgYSA9IF9hLnNoaWZ0KCk7XG4gICAgICBsZXQgYiA9IF9iLnNoaWZ0KCk7XG4gICAgICBsZXQgYXJlRXF1YWwgPSBmYWxzZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGFyZUVxdWFsID0gY29tcGFyYXRvciA/IGNvbXBhcmF0b3IoYSwgYikgOiBhID09PSBiO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGUpO1xuICAgICAgfVxuICAgICAgaWYgKCFhcmVFcXVhbCkge1xuICAgICAgICB0aGlzLmVtaXQoZmFsc2UpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGVtaXQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCB7IGRlc3RpbmF0aW9uIH0gPSB0aGlzO1xuICAgIGRlc3RpbmF0aW9uLm5leHQodmFsdWUpO1xuICAgIGRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gIH1cblxuICBuZXh0Qih2YWx1ZTogVCkge1xuICAgIGlmICh0aGlzLl9vbmVDb21wbGV0ZSAmJiB0aGlzLl9hLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5lbWl0KGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYi5wdXNoKHZhbHVlKTtcbiAgICAgIHRoaXMuY2hlY2tWYWx1ZXMoKTtcbiAgICB9XG4gIH1cblxuICBjb21wbGV0ZUIoKSB7XG4gICAgaWYgKHRoaXMuX29uZUNvbXBsZXRlKSB7XG4gICAgICB0aGlzLmVtaXQodGhpcy5fYS5sZW5ndGggPT09IDAgJiYgdGhpcy5fYi5sZW5ndGggPT09IDApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9vbmVDb21wbGV0ZSA9IHRydWU7XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIFNlcXVlbmNlRXF1YWxDb21wYXJlVG9TdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBPYnNlcnZlcjxSPiwgcHJpdmF0ZSBwYXJlbnQ6IFNlcXVlbmNlRXF1YWxTdWJzY3JpYmVyPFQsIFI+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgdGhpcy5wYXJlbnQubmV4dEIodmFsdWUpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9lcnJvcihlcnI6IGFueSk6IHZvaWQge1xuICAgIHRoaXMucGFyZW50LmVycm9yKGVycik7XG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpOiB2b2lkIHtcbiAgICB0aGlzLnBhcmVudC5jb21wbGV0ZUIoKTtcbiAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gIH1cbn1cbiJdfQ==