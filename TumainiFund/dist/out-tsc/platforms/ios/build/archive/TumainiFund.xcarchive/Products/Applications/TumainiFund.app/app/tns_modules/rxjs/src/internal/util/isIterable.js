"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var iterator_1 = require("../symbol/iterator");
/** Identifies an input as being an Iterable */
function isIterable(input) {
    return input && typeof input[iterator_1.iterator] === 'function';
}
exports.isIterable = isIterable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNJdGVyYWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvdXRpbC9pc0l0ZXJhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0NBQWlFO0FBRWpFLCtDQUErQztBQUMvQyxTQUFnQixVQUFVLENBQUMsS0FBVTtJQUNuQyxPQUFPLEtBQUssSUFBSSxPQUFPLEtBQUssQ0FBQyxtQkFBZSxDQUFDLEtBQUssVUFBVSxDQUFDO0FBQy9ELENBQUM7QUFGRCxnQ0FFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGl0ZXJhdG9yIGFzIFN5bWJvbF9pdGVyYXRvciB9IGZyb20gJy4uL3N5bWJvbC9pdGVyYXRvcic7XG5cbi8qKiBJZGVudGlmaWVzIGFuIGlucHV0IGFzIGJlaW5nIGFuIEl0ZXJhYmxlICovXG5leHBvcnQgZnVuY3Rpb24gaXNJdGVyYWJsZShpbnB1dDogYW55KTogaW5wdXQgaXMgSXRlcmFibGU8YW55PiB7XG4gIHJldHVybiBpbnB1dCAmJiB0eXBlb2YgaW5wdXRbU3ltYm9sX2l0ZXJhdG9yXSA9PT0gJ2Z1bmN0aW9uJztcbn1cbiJdfQ==