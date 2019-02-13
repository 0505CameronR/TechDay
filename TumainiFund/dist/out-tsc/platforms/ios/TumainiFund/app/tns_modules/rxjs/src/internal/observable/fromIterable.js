import { Observable } from '../Observable';
import { Subscription } from '../Subscription';
import { iterator as Symbol_iterator } from '../symbol/iterator';
import { subscribeToIterable } from '../util/subscribeToIterable';
export function fromIterable(input, scheduler) {
    if (!input) {
        throw new Error('Iterable cannot be null');
    }
    if (!scheduler) {
        return new Observable(subscribeToIterable(input));
    }
    else {
        return new Observable(subscriber => {
            const sub = new Subscription();
            let iterator;
            sub.add(() => {
                // Finalize generators
                if (iterator && typeof iterator.return === 'function') {
                    iterator.return();
                }
            });
            sub.add(scheduler.schedule(() => {
                iterator = input[Symbol_iterator]();
                sub.add(scheduler.schedule(function () {
                    if (subscriber.closed) {
                        return;
                    }
                    let value;
                    let done;
                    try {
                        const result = iterator.next();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJvbUl0ZXJhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb2JzZXJ2YWJsZS9mcm9tSXRlcmFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsSUFBSSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNqRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUVsRSxNQUFNLFVBQVUsWUFBWSxDQUFJLEtBQWtCLEVBQUUsU0FBd0I7SUFDMUUsSUFBSSxDQUFDLEtBQUssRUFBRTtRQUNWLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztLQUM1QztJQUNELElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDZCxPQUFPLElBQUksVUFBVSxDQUFJLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7S0FDdEQ7U0FBTTtRQUNMLE9BQU8sSUFBSSxVQUFVLENBQUksVUFBVSxDQUFDLEVBQUU7WUFDcEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztZQUMvQixJQUFJLFFBQXFCLENBQUM7WUFDMUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7Z0JBQ1gsc0JBQXNCO2dCQUN0QixJQUFJLFFBQVEsSUFBSSxPQUFPLFFBQVEsQ0FBQyxNQUFNLEtBQUssVUFBVSxFQUFFO29CQUNyRCxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7aUJBQ25CO1lBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDSCxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFO2dCQUM5QixRQUFRLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUM7Z0JBQ3BDLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztvQkFDekIsSUFBSSxVQUFVLENBQUMsTUFBTSxFQUFFO3dCQUNyQixPQUFPO3FCQUNSO29CQUNELElBQUksS0FBUSxDQUFDO29CQUNiLElBQUksSUFBYSxDQUFDO29CQUNsQixJQUFJO3dCQUNGLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQzt3QkFDL0IsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7d0JBQ3JCLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO3FCQUNwQjtvQkFBQyxPQUFPLEdBQUcsRUFBRTt3QkFDWixVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUN0QixPQUFPO3FCQUNSO29CQUNELElBQUksSUFBSSxFQUFFO3dCQUNSLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztxQkFDdkI7eUJBQU07d0JBQ0wsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDdkIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO3FCQUNqQjtnQkFDSCxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ04sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNKLE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQyxDQUFDLENBQUM7S0FDSjtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IGl0ZXJhdG9yIGFzIFN5bWJvbF9pdGVyYXRvciB9IGZyb20gJy4uL3N5bWJvbC9pdGVyYXRvcic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb0l0ZXJhYmxlIH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb0l0ZXJhYmxlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGZyb21JdGVyYWJsZTxUPihpbnB1dDogSXRlcmFibGU8VD4sIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSkge1xuICBpZiAoIWlucHV0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJdGVyYWJsZSBjYW5ub3QgYmUgbnVsbCcpO1xuICB9XG4gIGlmICghc2NoZWR1bGVyKSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFQ+KHN1YnNjcmliZVRvSXRlcmFibGUoaW5wdXQpKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8VD4oc3Vic2NyaWJlciA9PiB7XG4gICAgICBjb25zdCBzdWIgPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgICBsZXQgaXRlcmF0b3I6IEl0ZXJhdG9yPFQ+O1xuICAgICAgc3ViLmFkZCgoKSA9PiB7XG4gICAgICAgIC8vIEZpbmFsaXplIGdlbmVyYXRvcnNcbiAgICAgICAgaWYgKGl0ZXJhdG9yICYmIHR5cGVvZiBpdGVyYXRvci5yZXR1cm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBpdGVyYXRvci5yZXR1cm4oKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBzdWIuYWRkKHNjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiB7XG4gICAgICAgIGl0ZXJhdG9yID0gaW5wdXRbU3ltYm9sX2l0ZXJhdG9yXSgpO1xuICAgICAgICBzdWIuYWRkKHNjaGVkdWxlci5zY2hlZHVsZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKHN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGxldCB2YWx1ZTogVDtcbiAgICAgICAgICBsZXQgZG9uZTogYm9vbGVhbjtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICAgICAgdmFsdWUgPSByZXN1bHQudmFsdWU7XG4gICAgICAgICAgICBkb25lID0gcmVzdWx0LmRvbmU7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChkb25lKSB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dCh2YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgICB9KSk7XG4gICAgICByZXR1cm4gc3ViO1xuICAgIH0pO1xuICB9XG59XG4iXX0=