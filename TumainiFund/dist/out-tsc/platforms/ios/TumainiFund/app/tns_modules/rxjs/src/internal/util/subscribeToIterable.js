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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaWJlVG9JdGVyYWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL3V0aWwvc3Vic2NyaWJlVG9JdGVyYWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLCtDQUFpRTtBQUVwRCxRQUFBLG1CQUFtQixHQUFHLFVBQUksUUFBcUIsSUFBSyxPQUFBLFVBQUMsVUFBeUI7SUFDekYsSUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLG1CQUFlLENBQUMsRUFBRSxDQUFDO0lBQzdDLEdBQUc7UUFDRCxJQUFNLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDN0IsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2IsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3RCLE1BQU07U0FDUDtRQUNELFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVCLElBQUksVUFBVSxDQUFDLE1BQU0sRUFBRTtZQUNyQixNQUFNO1NBQ1A7S0FDRixRQUFRLElBQUksRUFBRTtJQUVmLHdEQUF3RDtJQUN4RCxJQUFJLE9BQU8sUUFBUSxDQUFDLE1BQU0sS0FBSyxVQUFVLEVBQUU7UUFDekMsVUFBVSxDQUFDLEdBQUcsQ0FBQztZQUNiLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRTtnQkFDbkIsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQ25CO1FBQ0gsQ0FBQyxDQUFDLENBQUM7S0FDSjtJQUVELE9BQU8sVUFBVSxDQUFDO0FBQ3BCLENBQUMsRUF4QmdFLENBd0JoRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgaXRlcmF0b3IgYXMgU3ltYm9sX2l0ZXJhdG9yIH0gZnJvbSAnLi4vc3ltYm9sL2l0ZXJhdG9yJztcblxuZXhwb3J0IGNvbnN0IHN1YnNjcmliZVRvSXRlcmFibGUgPSA8VD4oaXRlcmFibGU6IEl0ZXJhYmxlPFQ+KSA9PiAoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPikgPT4ge1xuICBjb25zdCBpdGVyYXRvciA9IGl0ZXJhYmxlW1N5bWJvbF9pdGVyYXRvcl0oKTtcbiAgZG8ge1xuICAgIGNvbnN0IGl0ZW0gPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgaWYgKGl0ZW0uZG9uZSkge1xuICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHN1YnNjcmliZXIubmV4dChpdGVtLnZhbHVlKTtcbiAgICBpZiAoc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfSB3aGlsZSAodHJ1ZSk7XG5cbiAgLy8gRmluYWxpemUgdGhlIGl0ZXJhdG9yIGlmIGl0IGhhcHBlbnMgdG8gYmUgYSBHZW5lcmF0b3JcbiAgaWYgKHR5cGVvZiBpdGVyYXRvci5yZXR1cm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICBzdWJzY3JpYmVyLmFkZCgoKSA9PiB7XG4gICAgICBpZiAoaXRlcmF0b3IucmV0dXJuKSB7XG4gICAgICAgIGl0ZXJhdG9yLnJldHVybigpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHN1YnNjcmliZXI7XG59O1xuIl19