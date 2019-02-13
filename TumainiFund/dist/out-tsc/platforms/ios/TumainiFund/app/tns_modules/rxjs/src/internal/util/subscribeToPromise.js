import { hostReportError } from './hostReportError';
export const subscribeToPromise = (promise) => (subscriber) => {
    promise.then((value) => {
        if (!subscriber.closed) {
            subscriber.next(value);
            subscriber.complete();
        }
    }, (err) => subscriber.error(err))
        .then(null, hostReportError);
    return subscriber;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaWJlVG9Qcm9taXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvdXRpbC9zdWJzY3JpYmVUb1Byb21pc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRXBELE1BQU0sQ0FBQyxNQUFNLGtCQUFrQixHQUFHLENBQUksT0FBdUIsRUFBRSxFQUFFLENBQUMsQ0FBQyxVQUF5QixFQUFFLEVBQUU7SUFDOUYsT0FBTyxDQUFDLElBQUksQ0FDVixDQUFDLEtBQUssRUFBRSxFQUFFO1FBQ1IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDdEIsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN2QixVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDdkI7SUFDSCxDQUFDLEVBQ0QsQ0FBQyxHQUFRLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQ3BDO1NBQ0EsSUFBSSxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQztJQUM3QixPQUFPLFVBQVUsQ0FBQztBQUNwQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBob3N0UmVwb3J0RXJyb3IgfSBmcm9tICcuL2hvc3RSZXBvcnRFcnJvcic7XG5cbmV4cG9ydCBjb25zdCBzdWJzY3JpYmVUb1Byb21pc2UgPSA8VD4ocHJvbWlzZTogUHJvbWlzZUxpa2U8VD4pID0+IChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+KSA9PiB7XG4gIHByb21pc2UudGhlbihcbiAgICAodmFsdWUpID0+IHtcbiAgICAgIGlmICghc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICAgICAgc3Vic2NyaWJlci5uZXh0KHZhbHVlKTtcbiAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgfVxuICAgIH0sXG4gICAgKGVycjogYW55KSA9PiBzdWJzY3JpYmVyLmVycm9yKGVycilcbiAgKVxuICAudGhlbihudWxsLCBob3N0UmVwb3J0RXJyb3IpO1xuICByZXR1cm4gc3Vic2NyaWJlcjtcbn07XG4iXX0=