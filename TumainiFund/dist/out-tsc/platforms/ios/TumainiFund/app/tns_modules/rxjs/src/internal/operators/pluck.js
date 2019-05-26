import { map } from './map';
/* tslint:enable:max-line-length */
/**
 * Maps each source value (an object) to its specified nested property.
 *
 * <span class="informal">Like {@link map}, but meant only for picking one of
 * the nested properties of every emitted object.</span>
 *
 * ![](pluck.png)
 *
 * Given a list of strings describing a path to an object property, retrieves
 * the value of a specified nested property from all values in the source
 * Observable. If a property can't be resolved, it will return `undefined` for
 * that value.
 *
 * ## Example
 * Map every click to the tagName of the clicked target element
 * ```javascript
 * import { fromEvent } from 'rxjs';
 * import { pluck } from 'rxjs/operators';
 *
 * const clicks = fromEvent(document, 'click');
 * const tagNames = clicks.pipe(pluck('target', 'tagName'));
 * tagNames.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link map}
 *
 * @param {...string} properties The nested properties to pluck from each source
 * value (an object).
 * @return {Observable} A new Observable of property values from the source values.
 * @method pluck
 * @owner Observable
 */
export function pluck(...properties) {
    const length = properties.length;
    if (length === 0) {
        throw new Error('list of properties cannot be empty.');
    }
    return (source) => map(plucker(properties, length))(source);
}
function plucker(props, length) {
    const mapper = (x) => {
        let currentProp = x;
        for (let i = 0; i < length; i++) {
            const p = currentProp[props[i]];
            if (typeof p !== 'undefined') {
                currentProp = p;
            }
            else {
                return undefined;
            }
        }
        return currentProp;
    };
    return mapper;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Y2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvcGx1Y2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLE9BQU8sQ0FBQztBQVc1QixtQ0FBbUM7QUFFbkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0ErQkc7QUFDSCxNQUFNLFVBQVUsS0FBSyxDQUFPLEdBQUcsVUFBb0I7SUFDakQsTUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztJQUNqQyxJQUFJLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO0tBQ3hEO0lBQ0QsT0FBTyxDQUFDLE1BQXFCLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBYSxDQUFDLENBQUM7QUFDcEYsQ0FBQztBQUVELFNBQVMsT0FBTyxDQUFDLEtBQWUsRUFBRSxNQUFjO0lBQzlDLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBUyxFQUFFLEVBQUU7UUFDM0IsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDL0IsTUFBTSxDQUFDLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLElBQUksT0FBTyxDQUFDLEtBQUssV0FBVyxFQUFFO2dCQUM1QixXQUFXLEdBQUcsQ0FBQyxDQUFDO2FBQ2pCO2lCQUFNO2dCQUNMLE9BQU8sU0FBUyxDQUFDO2FBQ2xCO1NBQ0Y7UUFDRCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDLENBQUM7SUFFRixPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAnLi9tYXAnO1xuaW1wb3J0IHsgT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5leHBvcnQgZnVuY3Rpb24gcGx1Y2s8VCwgSzEgZXh0ZW5kcyBrZXlvZiBUPihrMTogSzEpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFRbSzFdPjtcbmV4cG9ydCBmdW5jdGlvbiBwbHVjazxULCBLMSBleHRlbmRzIGtleW9mIFQsIEsyIGV4dGVuZHMga2V5b2YgVFtLMV0+KGsxOiBLMSwgazI6IEsyKTogT3BlcmF0b3JGdW5jdGlvbjxULCBUW0sxXVtLMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIHBsdWNrPFQsIEsxIGV4dGVuZHMga2V5b2YgVCwgSzIgZXh0ZW5kcyBrZXlvZiBUW0sxXSwgSzMgZXh0ZW5kcyBrZXlvZiBUW0sxXVtLMl0+KGsxOiBLMSwgazI6IEsyLCBrMzogSzMpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFRbSzFdW0syXVtLM10+O1xuZXhwb3J0IGZ1bmN0aW9uIHBsdWNrPFQsIEsxIGV4dGVuZHMga2V5b2YgVCwgSzIgZXh0ZW5kcyBrZXlvZiBUW0sxXSwgSzMgZXh0ZW5kcyBrZXlvZiBUW0sxXVtLMl0sIEs0IGV4dGVuZHMga2V5b2YgVFtLMV1bSzJdW0szXT4oazE6IEsxLCBrMjogSzIsIGszOiBLMywgazQ6IEs0KTogT3BlcmF0b3JGdW5jdGlvbjxULCBUW0sxXVtLMl1bSzNdW0s0XT47XG5leHBvcnQgZnVuY3Rpb24gcGx1Y2s8VCwgSzEgZXh0ZW5kcyBrZXlvZiBULCBLMiBleHRlbmRzIGtleW9mIFRbSzFdLCBLMyBleHRlbmRzIGtleW9mIFRbSzFdW0syXSwgSzQgZXh0ZW5kcyBrZXlvZiBUW0sxXVtLMl1bSzNdLCBLNSBleHRlbmRzIGtleW9mIFRbSzFdW0syXVtLM11bSzRdPihrMTogSzEsIGsyOiBLMiwgazM6IEszLCBrNDogSzQsIGs1OiBLNSk6IE9wZXJhdG9yRnVuY3Rpb248VCwgVFtLMV1bSzJdW0szXVtLNF1bSzVdPjtcbmV4cG9ydCBmdW5jdGlvbiBwbHVjazxULCBLMSBleHRlbmRzIGtleW9mIFQsIEsyIGV4dGVuZHMga2V5b2YgVFtLMV0sIEszIGV4dGVuZHMga2V5b2YgVFtLMV1bSzJdLCBLNCBleHRlbmRzIGtleW9mIFRbSzFdW0syXVtLM10sIEs1IGV4dGVuZHMga2V5b2YgVFtLMV1bSzJdW0szXVtLNF0sIEs2IGV4dGVuZHMga2V5b2YgVFtLMV1bSzJdW0szXVtLNF1bSzVdPihrMTogSzEsIGsyOiBLMiwgazM6IEszLCBrNDogSzQsIGs1OiBLNSwgazY6IEs2KTogT3BlcmF0b3JGdW5jdGlvbjxULCBUW0sxXVtLMl1bSzNdW0s0XVtLNV1bSzZdPjtcbmV4cG9ydCBmdW5jdGlvbiBwbHVjazxULCBSPiguLi5wcm9wZXJ0aWVzOiBzdHJpbmdbXSk6IE9wZXJhdG9yRnVuY3Rpb248VCwgUj47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIE1hcHMgZWFjaCBzb3VyY2UgdmFsdWUgKGFuIG9iamVjdCkgdG8gaXRzIHNwZWNpZmllZCBuZXN0ZWQgcHJvcGVydHkuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkxpa2Uge0BsaW5rIG1hcH0sIGJ1dCBtZWFudCBvbmx5IGZvciBwaWNraW5nIG9uZSBvZlxuICogdGhlIG5lc3RlZCBwcm9wZXJ0aWVzIG9mIGV2ZXJ5IGVtaXR0ZWQgb2JqZWN0Ljwvc3Bhbj5cbiAqXG4gKiAhW10ocGx1Y2sucG5nKVxuICpcbiAqIEdpdmVuIGEgbGlzdCBvZiBzdHJpbmdzIGRlc2NyaWJpbmcgYSBwYXRoIHRvIGFuIG9iamVjdCBwcm9wZXJ0eSwgcmV0cmlldmVzXG4gKiB0aGUgdmFsdWUgb2YgYSBzcGVjaWZpZWQgbmVzdGVkIHByb3BlcnR5IGZyb20gYWxsIHZhbHVlcyBpbiB0aGUgc291cmNlXG4gKiBPYnNlcnZhYmxlLiBJZiBhIHByb3BlcnR5IGNhbid0IGJlIHJlc29sdmVkLCBpdCB3aWxsIHJldHVybiBgdW5kZWZpbmVkYCBmb3JcbiAqIHRoYXQgdmFsdWUuXG4gKlxuICogIyMgRXhhbXBsZVxuICogTWFwIGV2ZXJ5IGNsaWNrIHRvIHRoZSB0YWdOYW1lIG9mIHRoZSBjbGlja2VkIHRhcmdldCBlbGVtZW50XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBmcm9tRXZlbnQgfSBmcm9tICdyeGpzJztcbiAqIGltcG9ydCB7IHBsdWNrIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICpcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCB0YWdOYW1lcyA9IGNsaWNrcy5waXBlKHBsdWNrKCd0YXJnZXQnLCAndGFnTmFtZScpKTtcbiAqIHRhZ05hbWVzLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIG1hcH1cbiAqXG4gKiBAcGFyYW0gey4uLnN0cmluZ30gcHJvcGVydGllcyBUaGUgbmVzdGVkIHByb3BlcnRpZXMgdG8gcGx1Y2sgZnJvbSBlYWNoIHNvdXJjZVxuICogdmFsdWUgKGFuIG9iamVjdCkuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBIG5ldyBPYnNlcnZhYmxlIG9mIHByb3BlcnR5IHZhbHVlcyBmcm9tIHRoZSBzb3VyY2UgdmFsdWVzLlxuICogQG1ldGhvZCBwbHVja1xuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBsdWNrPFQsIFI+KC4uLnByb3BlcnRpZXM6IHN0cmluZ1tdKTogT3BlcmF0b3JGdW5jdGlvbjxULCBSPiB7XG4gIGNvbnN0IGxlbmd0aCA9IHByb3BlcnRpZXMubGVuZ3RoO1xuICBpZiAobGVuZ3RoID09PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdsaXN0IG9mIHByb3BlcnRpZXMgY2Fubm90IGJlIGVtcHR5LicpO1xuICB9XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBtYXAocGx1Y2tlcihwcm9wZXJ0aWVzLCBsZW5ndGgpKShzb3VyY2UgYXMgYW55KTtcbn1cblxuZnVuY3Rpb24gcGx1Y2tlcihwcm9wczogc3RyaW5nW10sIGxlbmd0aDogbnVtYmVyKTogKHg6IHN0cmluZykgPT4gYW55IHtcbiAgY29uc3QgbWFwcGVyID0gKHg6IHN0cmluZykgPT4ge1xuICAgIGxldCBjdXJyZW50UHJvcCA9IHg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgcCA9IGN1cnJlbnRQcm9wW3Byb3BzW2ldXTtcbiAgICAgIGlmICh0eXBlb2YgcCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgY3VycmVudFByb3AgPSBwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGN1cnJlbnRQcm9wO1xuICB9O1xuXG4gIHJldHVybiBtYXBwZXI7XG59XG4iXX0=