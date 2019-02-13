"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var map_1 = require("./map");
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
function pluck() {
    var properties = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        properties[_i] = arguments[_i];
    }
    var length = properties.length;
    if (length === 0) {
        throw new Error('list of properties cannot be empty.');
    }
    return function (source) { return map_1.map(plucker(properties, length))(source); };
}
exports.pluck = pluck;
function plucker(props, length) {
    var mapper = function (x) {
        var currentProp = x;
        for (var i = 0; i < length; i++) {
            var p = currentProp[props[i]];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Y2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9wbHVjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDZCQUE0QjtBQUc1Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRCRztBQUNILFNBQWdCLEtBQUs7SUFBTyxvQkFBdUI7U0FBdkIsVUFBdUIsRUFBdkIscUJBQXVCLEVBQXZCLElBQXVCO1FBQXZCLCtCQUF1Qjs7SUFDakQsSUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztJQUNqQyxJQUFJLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO0tBQ3hEO0lBQ0QsT0FBTyxVQUFDLE1BQXFCLElBQUssT0FBQSxTQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQWEsQ0FBQyxFQUEvQyxDQUErQyxDQUFDO0FBQ3BGLENBQUM7QUFORCxzQkFNQztBQUVELFNBQVMsT0FBTyxDQUFDLEtBQWUsRUFBRSxNQUFjO0lBQzlDLElBQU0sTUFBTSxHQUFHLFVBQUMsQ0FBUztRQUN2QixJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFDcEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMvQixJQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsSUFBSSxPQUFPLENBQUMsS0FBSyxXQUFXLEVBQUU7Z0JBQzVCLFdBQVcsR0FBRyxDQUFDLENBQUM7YUFDakI7aUJBQU07Z0JBQ0wsT0FBTyxTQUFTLENBQUM7YUFDbEI7U0FDRjtRQUNELE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUMsQ0FBQztJQUVGLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICcuL21hcCc7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIE1hcHMgZWFjaCBzb3VyY2UgdmFsdWUgKGFuIG9iamVjdCkgdG8gaXRzIHNwZWNpZmllZCBuZXN0ZWQgcHJvcGVydHkuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkxpa2Uge0BsaW5rIG1hcH0sIGJ1dCBtZWFudCBvbmx5IGZvciBwaWNraW5nIG9uZSBvZlxuICogdGhlIG5lc3RlZCBwcm9wZXJ0aWVzIG9mIGV2ZXJ5IGVtaXR0ZWQgb2JqZWN0Ljwvc3Bhbj5cbiAqXG4gKiAhW10ocGx1Y2sucG5nKVxuICpcbiAqIEdpdmVuIGEgbGlzdCBvZiBzdHJpbmdzIGRlc2NyaWJpbmcgYSBwYXRoIHRvIGFuIG9iamVjdCBwcm9wZXJ0eSwgcmV0cmlldmVzXG4gKiB0aGUgdmFsdWUgb2YgYSBzcGVjaWZpZWQgbmVzdGVkIHByb3BlcnR5IGZyb20gYWxsIHZhbHVlcyBpbiB0aGUgc291cmNlXG4gKiBPYnNlcnZhYmxlLiBJZiBhIHByb3BlcnR5IGNhbid0IGJlIHJlc29sdmVkLCBpdCB3aWxsIHJldHVybiBgdW5kZWZpbmVkYCBmb3JcbiAqIHRoYXQgdmFsdWUuXG4gKlxuICogIyMgRXhhbXBsZVxuICogTWFwIGV2ZXJ5IGNsaWNrIHRvIHRoZSB0YWdOYW1lIG9mIHRoZSBjbGlja2VkIHRhcmdldCBlbGVtZW50XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgdGFnTmFtZXMgPSBjbGlja3MucGlwZShwbHVjaygndGFyZ2V0JywgJ3RhZ05hbWUnKSk7XG4gKiB0YWdOYW1lcy5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBtYXB9XG4gKlxuICogQHBhcmFtIHsuLi5zdHJpbmd9IHByb3BlcnRpZXMgVGhlIG5lc3RlZCBwcm9wZXJ0aWVzIHRvIHBsdWNrIGZyb20gZWFjaCBzb3VyY2VcbiAqIHZhbHVlIChhbiBvYmplY3QpLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQSBuZXcgT2JzZXJ2YWJsZSBvZiBwcm9wZXJ0eSB2YWx1ZXMgZnJvbSB0aGUgc291cmNlIHZhbHVlcy5cbiAqIEBtZXRob2QgcGx1Y2tcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwbHVjazxULCBSPiguLi5wcm9wZXJ0aWVzOiBzdHJpbmdbXSk6IE9wZXJhdG9yRnVuY3Rpb248VCwgUj4ge1xuICBjb25zdCBsZW5ndGggPSBwcm9wZXJ0aWVzLmxlbmd0aDtcbiAgaWYgKGxlbmd0aCA9PT0gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignbGlzdCBvZiBwcm9wZXJ0aWVzIGNhbm5vdCBiZSBlbXB0eS4nKTtcbiAgfVxuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gbWFwKHBsdWNrZXIocHJvcGVydGllcywgbGVuZ3RoKSkoc291cmNlIGFzIGFueSk7XG59XG5cbmZ1bmN0aW9uIHBsdWNrZXIocHJvcHM6IHN0cmluZ1tdLCBsZW5ndGg6IG51bWJlcik6ICh4OiBzdHJpbmcpID0+IGFueSB7XG4gIGNvbnN0IG1hcHBlciA9ICh4OiBzdHJpbmcpID0+IHtcbiAgICBsZXQgY3VycmVudFByb3AgPSB4O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHAgPSBjdXJyZW50UHJvcFtwcm9wc1tpXV07XG4gICAgICBpZiAodHlwZW9mIHAgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGN1cnJlbnRQcm9wID0gcDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjdXJyZW50UHJvcDtcbiAgfTtcblxuICByZXR1cm4gbWFwcGVyO1xufVxuIl19