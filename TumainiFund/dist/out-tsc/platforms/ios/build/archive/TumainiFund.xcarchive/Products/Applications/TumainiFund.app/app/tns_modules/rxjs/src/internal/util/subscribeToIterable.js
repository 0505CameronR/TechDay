"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var iterator_1 = require("../symbol/iterator");
exports.subscribeToIterable = function (iterable) { return function (subscriber) {
    var iterator = iterable[iterator_1.iterator]();
    do {
        var item = iterator.next();
        if (item.done) {
            subscriber.complete();
            break;
        }
        subscriber.next(item.value);
        if (subscriber.closed) {
            break;
        }
    } while (true);
    // Finalize the iterator if it happens to be a Generator
    if (typeof iterator.return === 'function') {
        subscriber.add(function () {
            if (iterator.return) {
                iterator.return();
            }
        });
    }
    return subscriber;
}; };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaWJlVG9JdGVyYWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvdXRpbC9zdWJzY3JpYmVUb0l0ZXJhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsK0NBQWlFO0FBRXBELFFBQUEsbUJBQW1CLEdBQUcsVUFBSSxRQUFxQixJQUFLLE9BQUEsVUFBQyxVQUF5QjtJQUN6RixJQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsbUJBQWUsQ0FBQyxFQUFFLENBQUM7SUFDN0MsR0FBRztRQUNELElBQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUM3QixJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDYixVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDdEIsTUFBTTtTQUNQO1FBQ0QsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUIsSUFBSSxVQUFVLENBQUMsTUFBTSxFQUFFO1lBQ3JCLE1BQU07U0FDUDtLQUNGLFFBQVEsSUFBSSxFQUFFO0lBRWYsd0RBQXdEO0lBQ3hELElBQUksT0FBTyxRQUFRLENBQUMsTUFBTSxLQUFLLFVBQVUsRUFBRTtRQUN6QyxVQUFVLENBQUMsR0FBRyxDQUFDO1lBQ2IsSUFBSSxRQUFRLENBQUMsTUFBTSxFQUFFO2dCQUNuQixRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDbkI7UUFDSCxDQUFDLENBQUMsQ0FBQztLQUNKO0lBRUQsT0FBTyxVQUFVLENBQUM7QUFDcEIsQ0FBQyxFQXhCZ0UsQ0F3QmhFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBpdGVyYXRvciBhcyBTeW1ib2xfaXRlcmF0b3IgfSBmcm9tICcuLi9zeW1ib2wvaXRlcmF0b3InO1xuXG5leHBvcnQgY29uc3Qgc3Vic2NyaWJlVG9JdGVyYWJsZSA9IDxUPihpdGVyYWJsZTogSXRlcmFibGU8VD4pID0+IChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+KSA9PiB7XG4gIGNvbnN0IGl0ZXJhdG9yID0gaXRlcmFibGVbU3ltYm9sX2l0ZXJhdG9yXSgpO1xuICBkbyB7XG4gICAgY29uc3QgaXRlbSA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICBpZiAoaXRlbS5kb25lKSB7XG4gICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgc3Vic2NyaWJlci5uZXh0KGl0ZW0udmFsdWUpO1xuICAgIGlmIChzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9IHdoaWxlICh0cnVlKTtcblxuICAvLyBGaW5hbGl6ZSB0aGUgaXRlcmF0b3IgaWYgaXQgaGFwcGVucyB0byBiZSBhIEdlbmVyYXRvclxuICBpZiAodHlwZW9mIGl0ZXJhdG9yLnJldHVybiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHN1YnNjcmliZXIuYWRkKCgpID0+IHtcbiAgICAgIGlmIChpdGVyYXRvci5yZXR1cm4pIHtcbiAgICAgICAgaXRlcmF0b3IucmV0dXJuKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gc3Vic2NyaWJlcjtcbn07XG4iXX0=