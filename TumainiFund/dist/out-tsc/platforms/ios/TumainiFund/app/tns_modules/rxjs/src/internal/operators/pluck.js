import { map } from './map';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Y2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvcGx1Y2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLE9BQU8sQ0FBQztBQUc1Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRCRztBQUNILE1BQU0sVUFBVSxLQUFLLENBQU8sR0FBRyxVQUFvQjtJQUNqRCxNQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO0lBQ2pDLElBQUksTUFBTSxLQUFLLENBQUMsRUFBRTtRQUNoQixNQUFNLElBQUksS0FBSyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7S0FDeEQ7SUFDRCxPQUFPLENBQUMsTUFBcUIsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFhLENBQUMsQ0FBQztBQUNwRixDQUFDO0FBRUQsU0FBUyxPQUFPLENBQUMsS0FBZSxFQUFFLE1BQWM7SUFDOUMsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFTLEVBQUUsRUFBRTtRQUMzQixJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFDcEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMvQixNQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsSUFBSSxPQUFPLENBQUMsS0FBSyxXQUFXLEVBQUU7Z0JBQzVCLFdBQVcsR0FBRyxDQUFDLENBQUM7YUFDakI7aUJBQU07Z0JBQ0wsT0FBTyxTQUFTLENBQUM7YUFDbEI7U0FDRjtRQUNELE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUMsQ0FBQztJQUVGLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICcuL21hcCc7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIE1hcHMgZWFjaCBzb3VyY2UgdmFsdWUgKGFuIG9iamVjdCkgdG8gaXRzIHNwZWNpZmllZCBuZXN0ZWQgcHJvcGVydHkuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkxpa2Uge0BsaW5rIG1hcH0sIGJ1dCBtZWFudCBvbmx5IGZvciBwaWNraW5nIG9uZSBvZlxuICogdGhlIG5lc3RlZCBwcm9wZXJ0aWVzIG9mIGV2ZXJ5IGVtaXR0ZWQgb2JqZWN0Ljwvc3Bhbj5cbiAqXG4gKiAhW10ocGx1Y2sucG5nKVxuICpcbiAqIEdpdmVuIGEgbGlzdCBvZiBzdHJpbmdzIGRlc2NyaWJpbmcgYSBwYXRoIHRvIGFuIG9iamVjdCBwcm9wZXJ0eSwgcmV0cmlldmVzXG4gKiB0aGUgdmFsdWUgb2YgYSBzcGVjaWZpZWQgbmVzdGVkIHByb3BlcnR5IGZyb20gYWxsIHZhbHVlcyBpbiB0aGUgc291cmNlXG4gKiBPYnNlcnZhYmxlLiBJZiBhIHByb3BlcnR5IGNhbid0IGJlIHJlc29sdmVkLCBpdCB3aWxsIHJldHVybiBgdW5kZWZpbmVkYCBmb3JcbiAqIHRoYXQgdmFsdWUuXG4gKlxuICogIyMgRXhhbXBsZVxuICogTWFwIGV2ZXJ5IGNsaWNrIHRvIHRoZSB0YWdOYW1lIG9mIHRoZSBjbGlja2VkIHRhcmdldCBlbGVtZW50XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgdGFnTmFtZXMgPSBjbGlja3MucGlwZShwbHVjaygndGFyZ2V0JywgJ3RhZ05hbWUnKSk7XG4gKiB0YWdOYW1lcy5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBtYXB9XG4gKlxuICogQHBhcmFtIHsuLi5zdHJpbmd9IHByb3BlcnRpZXMgVGhlIG5lc3RlZCBwcm9wZXJ0aWVzIHRvIHBsdWNrIGZyb20gZWFjaCBzb3VyY2VcbiAqIHZhbHVlIChhbiBvYmplY3QpLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQSBuZXcgT2JzZXJ2YWJsZSBvZiBwcm9wZXJ0eSB2YWx1ZXMgZnJvbSB0aGUgc291cmNlIHZhbHVlcy5cbiAqIEBtZXRob2QgcGx1Y2tcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwbHVjazxULCBSPiguLi5wcm9wZXJ0aWVzOiBzdHJpbmdbXSk6IE9wZXJhdG9yRnVuY3Rpb248VCwgUj4ge1xuICBjb25zdCBsZW5ndGggPSBwcm9wZXJ0aWVzLmxlbmd0aDtcbiAgaWYgKGxlbmd0aCA9PT0gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignbGlzdCBvZiBwcm9wZXJ0aWVzIGNhbm5vdCBiZSBlbXB0eS4nKTtcbiAgfVxuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gbWFwKHBsdWNrZXIocHJvcGVydGllcywgbGVuZ3RoKSkoc291cmNlIGFzIGFueSk7XG59XG5cbmZ1bmN0aW9uIHBsdWNrZXIocHJvcHM6IHN0cmluZ1tdLCBsZW5ndGg6IG51bWJlcik6ICh4OiBzdHJpbmcpID0+IGFueSB7XG4gIGNvbnN0IG1hcHBlciA9ICh4OiBzdHJpbmcpID0+IHtcbiAgICBsZXQgY3VycmVudFByb3AgPSB4O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHAgPSBjdXJyZW50UHJvcFtwcm9wc1tpXV07XG4gICAgICBpZiAodHlwZW9mIHAgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGN1cnJlbnRQcm9wID0gcDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjdXJyZW50UHJvcDtcbiAgfTtcblxuICByZXR1cm4gbWFwcGVyO1xufVxuIl19