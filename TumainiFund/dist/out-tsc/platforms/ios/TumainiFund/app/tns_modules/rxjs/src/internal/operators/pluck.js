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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Y2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvcGx1Y2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw2QkFBNEI7QUFHNUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E0Qkc7QUFDSCxTQUFnQixLQUFLO0lBQU8sb0JBQXVCO1NBQXZCLFVBQXVCLEVBQXZCLHFCQUF1QixFQUF2QixJQUF1QjtRQUF2QiwrQkFBdUI7O0lBQ2pELElBQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUM7SUFDakMsSUFBSSxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMscUNBQXFDLENBQUMsQ0FBQztLQUN4RDtJQUNELE9BQU8sVUFBQyxNQUFxQixJQUFLLE9BQUEsU0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFhLENBQUMsRUFBL0MsQ0FBK0MsQ0FBQztBQUNwRixDQUFDO0FBTkQsc0JBTUM7QUFFRCxTQUFTLE9BQU8sQ0FBQyxLQUFlLEVBQUUsTUFBYztJQUM5QyxJQUFNLE1BQU0sR0FBRyxVQUFDLENBQVM7UUFDdkIsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDL0IsSUFBTSxDQUFDLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLElBQUksT0FBTyxDQUFDLEtBQUssV0FBVyxFQUFFO2dCQUM1QixXQUFXLEdBQUcsQ0FBQyxDQUFDO2FBQ2pCO2lCQUFNO2dCQUNMLE9BQU8sU0FBUyxDQUFDO2FBQ2xCO1NBQ0Y7UUFDRCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDLENBQUM7SUFFRixPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAnLi9tYXAnO1xuaW1wb3J0IHsgT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBNYXBzIGVhY2ggc291cmNlIHZhbHVlIChhbiBvYmplY3QpIHRvIGl0cyBzcGVjaWZpZWQgbmVzdGVkIHByb3BlcnR5LlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5MaWtlIHtAbGluayBtYXB9LCBidXQgbWVhbnQgb25seSBmb3IgcGlja2luZyBvbmUgb2ZcbiAqIHRoZSBuZXN0ZWQgcHJvcGVydGllcyBvZiBldmVyeSBlbWl0dGVkIG9iamVjdC48L3NwYW4+XG4gKlxuICogIVtdKHBsdWNrLnBuZylcbiAqXG4gKiBHaXZlbiBhIGxpc3Qgb2Ygc3RyaW5ncyBkZXNjcmliaW5nIGEgcGF0aCB0byBhbiBvYmplY3QgcHJvcGVydHksIHJldHJpZXZlc1xuICogdGhlIHZhbHVlIG9mIGEgc3BlY2lmaWVkIG5lc3RlZCBwcm9wZXJ0eSBmcm9tIGFsbCB2YWx1ZXMgaW4gdGhlIHNvdXJjZVxuICogT2JzZXJ2YWJsZS4gSWYgYSBwcm9wZXJ0eSBjYW4ndCBiZSByZXNvbHZlZCwgaXQgd2lsbCByZXR1cm4gYHVuZGVmaW5lZGAgZm9yXG4gKiB0aGF0IHZhbHVlLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIE1hcCBldmVyeSBjbGljayB0byB0aGUgdGFnTmFtZSBvZiB0aGUgY2xpY2tlZCB0YXJnZXQgZWxlbWVudFxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IHRhZ05hbWVzID0gY2xpY2tzLnBpcGUocGx1Y2soJ3RhcmdldCcsICd0YWdOYW1lJykpO1xuICogdGFnTmFtZXMuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgbWFwfVxuICpcbiAqIEBwYXJhbSB7Li4uc3RyaW5nfSBwcm9wZXJ0aWVzIFRoZSBuZXN0ZWQgcHJvcGVydGllcyB0byBwbHVjayBmcm9tIGVhY2ggc291cmNlXG4gKiB2YWx1ZSAoYW4gb2JqZWN0KS5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEEgbmV3IE9ic2VydmFibGUgb2YgcHJvcGVydHkgdmFsdWVzIGZyb20gdGhlIHNvdXJjZSB2YWx1ZXMuXG4gKiBAbWV0aG9kIHBsdWNrXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gcGx1Y2s8VCwgUj4oLi4ucHJvcGVydGllczogc3RyaW5nW10pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFI+IHtcbiAgY29uc3QgbGVuZ3RoID0gcHJvcGVydGllcy5sZW5ndGg7XG4gIGlmIChsZW5ndGggPT09IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2xpc3Qgb2YgcHJvcGVydGllcyBjYW5ub3QgYmUgZW1wdHkuJyk7XG4gIH1cbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IG1hcChwbHVja2VyKHByb3BlcnRpZXMsIGxlbmd0aCkpKHNvdXJjZSBhcyBhbnkpO1xufVxuXG5mdW5jdGlvbiBwbHVja2VyKHByb3BzOiBzdHJpbmdbXSwgbGVuZ3RoOiBudW1iZXIpOiAoeDogc3RyaW5nKSA9PiBhbnkge1xuICBjb25zdCBtYXBwZXIgPSAoeDogc3RyaW5nKSA9PiB7XG4gICAgbGV0IGN1cnJlbnRQcm9wID0geDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBwID0gY3VycmVudFByb3BbcHJvcHNbaV1dO1xuICAgICAgaWYgKHR5cGVvZiBwICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBjdXJyZW50UHJvcCA9IHA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY3VycmVudFByb3A7XG4gIH07XG5cbiAgcmV0dXJuIG1hcHBlcjtcbn1cbiJdfQ==