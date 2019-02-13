import { Subscriber } from '../Subscriber';
import { tryCatch } from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
/**
 * Compares all values of two observables in sequence using an optional comparor function
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
 * @param {function} [comparor] An optional function to compare each value pair
 * @return {Observable} An Observable of a single boolean value representing whether or not
 * the values emitted by both observables were equal in sequence.
 * @method sequenceEqual
 * @owner Observable
 */
export function sequenceEqual(compareTo, comparor) {
    return (source) => source.lift(new SequenceEqualOperator(compareTo, comparor));
}
export class SequenceEqualOperator {
    constructor(compareTo, comparor) {
        this.compareTo = compareTo;
        this.comparor = comparor;
    }
    call(subscriber, source) {
        return source.subscribe(new SequenceEqualSubscriber(subscriber, this.compareTo, this.comparor));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
export class SequenceEqualSubscriber extends Subscriber {
    constructor(destination, compareTo, comparor) {
        super(destination);
        this.compareTo = compareTo;
        this.comparor = comparor;
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
        const { _a, _b, comparor } = this;
        while (_a.length > 0 && _b.length > 0) {
            let a = _a.shift();
            let b = _b.shift();
            let areEqual = false;
            if (comparor) {
                areEqual = tryCatch(comparor)(a, b);
                if (areEqual === errorObject) {
                    this.destination.error(errorObject.e);
                }
            }
            else {
                areEqual = a === b;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VxdWVuY2VFcXVhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9zZXF1ZW5jZUVxdWFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQzVDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUlsRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FxREc7QUFDSCxNQUFNLFVBQVUsYUFBYSxDQUFJLFNBQXdCLEVBQ3hCLFFBQWtDO0lBQ2pFLE9BQU8sQ0FBQyxNQUFxQixFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUkscUJBQXFCLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDaEcsQ0FBQztBQUVELE1BQU0sT0FBTyxxQkFBcUI7SUFDaEMsWUFBb0IsU0FBd0IsRUFDeEIsUUFBaUM7UUFEakMsY0FBUyxHQUFULFNBQVMsQ0FBZTtRQUN4QixhQUFRLEdBQVIsUUFBUSxDQUF5QjtJQUNyRCxDQUFDO0lBRUQsSUFBSSxDQUFDLFVBQStCLEVBQUUsTUFBVztRQUMvQyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSx1QkFBdUIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUNsRyxDQUFDO0NBQ0Y7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxPQUFPLHVCQUE4QixTQUFRLFVBQWE7SUFLOUQsWUFBWSxXQUF3QixFQUNoQixT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QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQztTQUN6RDthQUFNO1lBQ0wsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7U0FDMUI7SUFDSCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLGdDQUF1QyxTQUFRLFVBQWE7SUFDaEUsWUFBWSxXQUF3QixFQUFVLE1BQXFDO1FBQ2pGLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUR5QixXQUFNLEdBQU4sTUFBTSxDQUErQjtJQUVuRixDQUFDO0lBRVMsS0FBSyxDQUFDLEtBQVE7UUFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVTLE1BQU0sQ0FBQyxHQUFRO1FBQ3ZCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRVMsU0FBUztRQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNyQixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyB0cnlDYXRjaCB9IGZyb20gJy4uL3V0aWwvdHJ5Q2F0Y2gnO1xuaW1wb3J0IHsgZXJyb3JPYmplY3QgfSBmcm9tICcuLi91dGlsL2Vycm9yT2JqZWN0JztcblxuaW1wb3J0IHsgT2JzZXJ2ZXIsIE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogQ29tcGFyZXMgYWxsIHZhbHVlcyBvZiB0d28gb2JzZXJ2YWJsZXMgaW4gc2VxdWVuY2UgdXNpbmcgYW4gb3B0aW9uYWwgY29tcGFyb3IgZnVuY3Rpb25cbiAqIGFuZCByZXR1cm5zIGFuIG9ic2VydmFibGUgb2YgYSBzaW5nbGUgYm9vbGVhbiB2YWx1ZSByZXByZXNlbnRpbmcgd2hldGhlciBvciBub3QgdGhlIHR3byBzZXF1ZW5jZXNcbiAqIGFyZSBlcXVhbC5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+Q2hlY2tzIHRvIHNlZSBvZiBhbGwgdmFsdWVzIGVtaXR0ZWQgYnkgYm90aCBvYnNlcnZhYmxlcyBhcmUgZXF1YWwsIGluIG9yZGVyLjwvc3Bhbj5cbiAqXG4gKiAhW10oc2VxdWVuY2VFcXVhbC5wbmcpXG4gKlxuICogYHNlcXVlbmNlRXF1YWxgIHN1YnNjcmliZXMgdG8gdHdvIG9ic2VydmFibGVzIGFuZCBidWZmZXJzIGluY29taW5nIHZhbHVlcyBmcm9tIGVhY2ggb2JzZXJ2YWJsZS4gV2hlbmV2ZXIgZWl0aGVyXG4gKiBvYnNlcnZhYmxlIGVtaXRzIGEgdmFsdWUsIHRoZSB2YWx1ZSBpcyBidWZmZXJlZCBhbmQgdGhlIGJ1ZmZlcnMgYXJlIHNoaWZ0ZWQgYW5kIGNvbXBhcmVkIGZyb20gdGhlIGJvdHRvbVxuICogdXA7IElmIGFueSB2YWx1ZSBwYWlyIGRvZXNuJ3QgbWF0Y2gsIHRoZSByZXR1cm5lZCBvYnNlcnZhYmxlIHdpbGwgZW1pdCBgZmFsc2VgIGFuZCBjb21wbGV0ZS4gSWYgb25lIG9mIHRoZVxuICogb2JzZXJ2YWJsZXMgY29tcGxldGVzLCB0aGUgb3BlcmF0b3Igd2lsbCB3YWl0IGZvciB0aGUgb3RoZXIgb2JzZXJ2YWJsZSB0byBjb21wbGV0ZTsgSWYgdGhlIG90aGVyXG4gKiBvYnNlcnZhYmxlIGVtaXRzIGJlZm9yZSBjb21wbGV0aW5nLCB0aGUgcmV0dXJuZWQgb2JzZXJ2YWJsZSB3aWxsIGVtaXQgYGZhbHNlYCBhbmQgY29tcGxldGUuIElmIG9uZSBvYnNlcnZhYmxlIG5ldmVyXG4gKiBjb21wbGV0ZXMgb3IgZW1pdHMgYWZ0ZXIgdGhlIG90aGVyIGNvbXBsZXRzLCB0aGUgcmV0dXJuZWQgb2JzZXJ2YWJsZSB3aWxsIG5ldmVyIGNvbXBsZXRlLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIGZpZ3VyZSBvdXQgaWYgdGhlIEtvbmFtaSBjb2RlIG1hdGNoZXNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGNvZGVzID0gZnJvbShbXG4gKiAgICdBcnJvd1VwJyxcbiAqICAgJ0Fycm93VXAnLFxuICogICAnQXJyb3dEb3duJyxcbiAqICAgJ0Fycm93RG93bicsXG4gKiAgICdBcnJvd0xlZnQnLFxuICogICAnQXJyb3dSaWdodCcsXG4gKiAgICdBcnJvd0xlZnQnLFxuICogICAnQXJyb3dSaWdodCcsXG4gKiAgICdLZXlCJyxcbiAqICAgJ0tleUEnLFxuICogICAnRW50ZXInLCAvLyBubyBzdGFydCBrZXksIGNsZWFybHkuXG4gKiBdKTtcbiAqXG4gKiBjb25zdCBrZXlzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAna2V5dXAnKS5waXBlKG1hcChlID0+IGUuY29kZSkpO1xuICogY29uc3QgbWF0Y2hlcyA9IGtleXMucGlwZShcbiAqICAgYnVmZmVyQ291bnQoMTEsIDEpLFxuICogICBtZXJnZU1hcChcbiAqICAgICBsYXN0MTEgPT4gZnJvbShsYXN0MTEpLnBpcGUoc2VxdWVuY2VFcXVhbChjb2RlcykpLFxuICogICApLFxuICogKTtcbiAqIG1hdGNoZXMuc3Vic2NyaWJlKG1hdGNoZWQgPT4gY29uc29sZS5sb2coJ1N1Y2Nlc3NmdWwgY2hlYXQgYXQgQ29udHJhPyAnLCBtYXRjaGVkKSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBjb21iaW5lTGF0ZXN0fVxuICogQHNlZSB7QGxpbmsgemlwfVxuICogQHNlZSB7QGxpbmsgd2l0aExhdGVzdEZyb219XG4gKlxuICogQHBhcmFtIHtPYnNlcnZhYmxlfSBjb21wYXJlVG8gVGhlIG9ic2VydmFibGUgc2VxdWVuY2UgdG8gY29tcGFyZSB0aGUgc291cmNlIHNlcXVlbmNlIHRvLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gW2NvbXBhcm9yXSBBbiBvcHRpb25hbCBmdW5jdGlvbiB0byBjb21wYXJlIGVhY2ggdmFsdWUgcGFpclxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSBvZiBhIHNpbmdsZSBib29sZWFuIHZhbHVlIHJlcHJlc2VudGluZyB3aGV0aGVyIG9yIG5vdFxuICogdGhlIHZhbHVlcyBlbWl0dGVkIGJ5IGJvdGggb2JzZXJ2YWJsZXMgd2VyZSBlcXVhbCBpbiBzZXF1ZW5jZS5cbiAqIEBtZXRob2Qgc2VxdWVuY2VFcXVhbFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNlcXVlbmNlRXF1YWw8VD4oY29tcGFyZVRvOiBPYnNlcnZhYmxlPFQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGFyb3I/OiAoYTogVCwgYjogVCkgPT4gYm9vbGVhbik6IE9wZXJhdG9yRnVuY3Rpb248VCwgYm9vbGVhbj4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gc291cmNlLmxpZnQobmV3IFNlcXVlbmNlRXF1YWxPcGVyYXRvcihjb21wYXJlVG8sIGNvbXBhcm9yKSk7XG59XG5cbmV4cG9ydCBjbGFzcyBTZXF1ZW5jZUVxdWFsT3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBib29sZWFuPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29tcGFyZVRvOiBPYnNlcnZhYmxlPFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIGNvbXBhcm9yOiAoYTogVCwgYjogVCkgPT4gYm9vbGVhbikge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPGJvb2xlYW4+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IFNlcXVlbmNlRXF1YWxTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMuY29tcGFyZVRvLCB0aGlzLmNvbXBhcm9yKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmV4cG9ydCBjbGFzcyBTZXF1ZW5jZUVxdWFsU3Vic2NyaWJlcjxULCBSPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBwcml2YXRlIF9hOiBUW10gPSBbXTtcbiAgcHJpdmF0ZSBfYjogVFtdID0gW107XG4gIHByaXZhdGUgX29uZUNvbXBsZXRlID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IE9ic2VydmVyPFI+LFxuICAgICAgICAgICAgICBwcml2YXRlIGNvbXBhcmVUbzogT2JzZXJ2YWJsZTxUPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjb21wYXJvcjogKGE6IFQsIGI6IFQpID0+IGJvb2xlYW4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gICAgKHRoaXMuZGVzdGluYXRpb24gYXMgU3Vic2NyaXB0aW9uKS5hZGQoY29tcGFyZVRvLnN1YnNjcmliZShuZXcgU2VxdWVuY2VFcXVhbENvbXBhcmVUb1N1YnNjcmliZXIoZGVzdGluYXRpb24sIHRoaXMpKSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fb25lQ29tcGxldGUgJiYgdGhpcy5fYi5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMuZW1pdChmYWxzZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2EucHVzaCh2YWx1ZSk7XG4gICAgICB0aGlzLmNoZWNrVmFsdWVzKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIF9jb21wbGV0ZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fb25lQ29tcGxldGUpIHtcbiAgICAgIHRoaXMuZW1pdCh0aGlzLl9hLmxlbmd0aCA9PT0gMCAmJiB0aGlzLl9iLmxlbmd0aCA9PT0gMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX29uZUNvbXBsZXRlID0gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgY2hlY2tWYWx1ZXMoKSB7XG4gICAgY29uc3QgeyBfYSwgX2IsIGNvbXBhcm9yIH0gPSB0aGlzO1xuICAgIHdoaWxlIChfYS5sZW5ndGggPiAwICYmIF9iLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBhID0gX2Euc2hpZnQoKTtcbiAgICAgIGxldCBiID0gX2Iuc2hpZnQoKTtcbiAgICAgIGxldCBhcmVFcXVhbCA9IGZhbHNlO1xuICAgICAgaWYgKGNvbXBhcm9yKSB7XG4gICAgICAgIGFyZUVxdWFsID0gdHJ5Q2F0Y2goY29tcGFyb3IpKGEsIGIpO1xuICAgICAgICBpZiAoYXJlRXF1YWwgPT09IGVycm9yT2JqZWN0KSB7XG4gICAgICAgICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnJvck9iamVjdC5lKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXJlRXF1YWwgPSBhID09PSBiO1xuICAgICAgfVxuICAgICAgaWYgKCFhcmVFcXVhbCkge1xuICAgICAgICB0aGlzLmVtaXQoZmFsc2UpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGVtaXQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCB7IGRlc3RpbmF0aW9uIH0gPSB0aGlzO1xuICAgIGRlc3RpbmF0aW9uLm5leHQodmFsdWUpO1xuICAgIGRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gIH1cblxuICBuZXh0Qih2YWx1ZTogVCkge1xuICAgIGlmICh0aGlzLl9vbmVDb21wbGV0ZSAmJiB0aGlzLl9hLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5lbWl0KGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYi5wdXNoKHZhbHVlKTtcbiAgICAgIHRoaXMuY2hlY2tWYWx1ZXMoKTtcbiAgICB9XG4gIH1cblxuICBjb21wbGV0ZUIoKSB7XG4gICAgaWYgKHRoaXMuX29uZUNvbXBsZXRlKSB7XG4gICAgICB0aGlzLmVtaXQodGhpcy5fYS5sZW5ndGggPT09IDAgJiYgdGhpcy5fYi5sZW5ndGggPT09IDApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9vbmVDb21wbGV0ZSA9IHRydWU7XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIFNlcXVlbmNlRXF1YWxDb21wYXJlVG9TdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBPYnNlcnZlcjxSPiwgcHJpdmF0ZSBwYXJlbnQ6IFNlcXVlbmNlRXF1YWxTdWJzY3JpYmVyPFQsIFI+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgdGhpcy5wYXJlbnQubmV4dEIodmFsdWUpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9lcnJvcihlcnI6IGFueSk6IHZvaWQge1xuICAgIHRoaXMucGFyZW50LmVycm9yKGVycik7XG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpOiB2b2lkIHtcbiAgICB0aGlzLnBhcmVudC5jb21wbGV0ZUIoKTtcbiAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gIH1cbn1cbiJdfQ==