"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("../Observable");
var Subscription_1 = require("../Subscription");
var iterator_1 = require("../symbol/iterator");
var subscribeToIterable_1 = require("../util/subscribeToIterable");
function fromIterable(input, scheduler) {
    if (!input) {
        throw new Error('Iterable cannot be null');
    }
    if (!scheduler) {
        return new Observable_1.Observable(subscribeToIterable_1.subscribeToIterable(input));
    }
    else {
        return new Observable_1.Observable(function (subscriber) {
            var sub = new Subscription_1.Subscription();
            var iterator;
            sub.add(function () {
                // Finalize generators
                if (iterator && typeof iterator.return === 'function') {
                    iterator.return();
                }
            });
            sub.add(scheduler.schedule(function () {
                iterator = input[iterator_1.iterator]();
                sub.add(scheduler.schedule(function () {
                    if (subscriber.closed) {
                        return;
                    }
                    var value;
                    var done;
                    try {
                        var result = iterator.next();
                        value = result.value;
                        done = result.done;
                    }
                    catch (err) {
                        subscriber.error(err);
                        return;
                    }
                    if (done) {
                        subscriber.complete();
                    }
                    else {
                        subscriber.next(value);
                        this.schedule();
                    }
                }));
            }));
            return sub;
        });
    }
}
exports.fromIterable = fromIterable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJvbUl0ZXJhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL2Zyb21JdGVyYWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRDQUEyQztBQUUzQyxnREFBK0M7QUFDL0MsK0NBQWlFO0FBQ2pFLG1FQUFrRTtBQUVsRSxTQUFnQixZQUFZLENBQUksS0FBa0IsRUFBRSxTQUF3QjtJQUMxRSxJQUFJLENBQUMsS0FBSyxFQUFFO1FBQ1YsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0tBQzVDO0lBQ0QsSUFBSSxDQUFDLFNBQVMsRUFBRTtRQUNkLE9BQU8sSUFBSSx1QkFBVSxDQUFJLHlDQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7S0FDdEQ7U0FBTTtRQUNMLE9BQU8sSUFBSSx1QkFBVSxDQUFJLFVBQUEsVUFBVTtZQUNqQyxJQUFNLEdBQUcsR0FBRyxJQUFJLDJCQUFZLEVBQUUsQ0FBQztZQUMvQixJQUFJLFFBQXFCLENBQUM7WUFDMUIsR0FBRyxDQUFDLEdBQUcsQ0FBQztnQkFDTixzQkFBc0I7Z0JBQ3RCLElBQUksUUFBUSxJQUFJLE9BQU8sUUFBUSxDQUFDLE1BQU0sS0FBSyxVQUFVLEVBQUU7b0JBQ3JELFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztpQkFDbkI7WUFDSCxDQUFDLENBQUMsQ0FBQztZQUNILEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztnQkFDekIsUUFBUSxHQUFHLEtBQUssQ0FBQyxtQkFBZSxDQUFDLEVBQUUsQ0FBQztnQkFDcEMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO29CQUN6QixJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUU7d0JBQ3JCLE9BQU87cUJBQ1I7b0JBQ0QsSUFBSSxLQUFRLENBQUM7b0JBQ2IsSUFBSSxJQUFhLENBQUM7b0JBQ2xCLElBQUk7d0JBQ0YsSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO3dCQUMvQixLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQzt3QkFDckIsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7cUJBQ3BCO29CQUFDLE9BQU8sR0FBRyxFQUFFO3dCQUNaLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ3RCLE9BQU87cUJBQ1I7b0JBQ0QsSUFBSSxJQUFJLEVBQUU7d0JBQ1IsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO3FCQUN2Qjt5QkFBTTt3QkFDTCxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUN2QixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7cUJBQ2pCO2dCQUNILENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDTixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ0osT0FBTyxHQUFHLENBQUM7UUFDYixDQUFDLENBQUMsQ0FBQztLQUNKO0FBQ0gsQ0FBQztBQTNDRCxvQ0EyQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IGl0ZXJhdG9yIGFzIFN5bWJvbF9pdGVyYXRvciB9IGZyb20gJy4uL3N5bWJvbC9pdGVyYXRvcic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb0l0ZXJhYmxlIH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb0l0ZXJhYmxlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGZyb21JdGVyYWJsZTxUPihpbnB1dDogSXRlcmFibGU8VD4sIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSkge1xuICBpZiAoIWlucHV0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJdGVyYWJsZSBjYW5ub3QgYmUgbnVsbCcpO1xuICB9XG4gIGlmICghc2NoZWR1bGVyKSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFQ+KHN1YnNjcmliZVRvSXRlcmFibGUoaW5wdXQpKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8VD4oc3Vic2NyaWJlciA9PiB7XG4gICAgICBjb25zdCBzdWIgPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgICBsZXQgaXRlcmF0b3I6IEl0ZXJhdG9yPFQ+O1xuICAgICAgc3ViLmFkZCgoKSA9PiB7XG4gICAgICAgIC8vIEZpbmFsaXplIGdlbmVyYXRvcnNcbiAgICAgICAgaWYgKGl0ZXJhdG9yICYmIHR5cGVvZiBpdGVyYXRvci5yZXR1cm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBpdGVyYXRvci5yZXR1cm4oKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBzdWIuYWRkKHNjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiB7XG4gICAgICAgIGl0ZXJhdG9yID0gaW5wdXRbU3ltYm9sX2l0ZXJhdG9yXSgpO1xuICAgICAgICBzdWIuYWRkKHNjaGVkdWxlci5zY2hlZHVsZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKHN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGxldCB2YWx1ZTogVDtcbiAgICAgICAgICBsZXQgZG9uZTogYm9vbGVhbjtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICAgICAgdmFsdWUgPSByZXN1bHQudmFsdWU7XG4gICAgICAgICAgICBkb25lID0gcmVzdWx0LmRvbmU7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChkb25lKSB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dCh2YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgICB9KSk7XG4gICAgICByZXR1cm4gc3ViO1xuICAgIH0pO1xuICB9XG59XG4iXX0=