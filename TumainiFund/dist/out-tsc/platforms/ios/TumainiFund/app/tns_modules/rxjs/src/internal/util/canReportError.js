import { Subscriber } from '../Subscriber';
/**
 * Determines whether the ErrorObserver is closed or stopped or has a
 * destination that is closed or stopped - in which case errors will
 * need to be reported via a different mechanism.
 * @param observer the observer
 */
export function canReportError(observer) {
    while (observer) {
        const { closed, destination, isStopped } = observer;
        if (closed || isStopped) {
            return false;
        }
        else if (destination && destination instanceof Subscriber) {
            observer = destination;
        }
        else {
            observer = null;
        }
    }
    return true;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FuUmVwb3J0RXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC91dGlsL2NhblJlcG9ydEVycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHM0M7Ozs7O0dBS0c7QUFDSCxNQUFNLFVBQVUsY0FBYyxDQUFDLFFBQXdDO0lBQ3JFLE9BQU8sUUFBUSxFQUFFO1FBQ2YsTUFBTSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLEdBQUcsUUFBZSxDQUFDO1FBQzNELElBQUksTUFBTSxJQUFJLFNBQVMsRUFBRTtZQUN2QixPQUFPLEtBQUssQ0FBQztTQUNkO2FBQU0sSUFBSSxXQUFXLElBQUksV0FBVyxZQUFZLFVBQVUsRUFBRTtZQUMzRCxRQUFRLEdBQUcsV0FBVyxDQUFDO1NBQ3hCO2FBQU07WUFDTCxRQUFRLEdBQUcsSUFBSSxDQUFDO1NBQ2pCO0tBQ0Y7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi4vU3ViamVjdCc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBFcnJvck9ic2VydmVyIGlzIGNsb3NlZCBvciBzdG9wcGVkIG9yIGhhcyBhXG4gKiBkZXN0aW5hdGlvbiB0aGF0IGlzIGNsb3NlZCBvciBzdG9wcGVkIC0gaW4gd2hpY2ggY2FzZSBlcnJvcnMgd2lsbFxuICogbmVlZCB0byBiZSByZXBvcnRlZCB2aWEgYSBkaWZmZXJlbnQgbWVjaGFuaXNtLlxuICogQHBhcmFtIG9ic2VydmVyIHRoZSBvYnNlcnZlclxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FuUmVwb3J0RXJyb3Iob2JzZXJ2ZXI6IFN1YnNjcmliZXI8YW55PiB8IFN1YmplY3Q8YW55Pik6IGJvb2xlYW4ge1xuICB3aGlsZSAob2JzZXJ2ZXIpIHtcbiAgICBjb25zdCB7IGNsb3NlZCwgZGVzdGluYXRpb24sIGlzU3RvcHBlZCB9ID0gb2JzZXJ2ZXIgYXMgYW55O1xuICAgIGlmIChjbG9zZWQgfHwgaXNTdG9wcGVkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChkZXN0aW5hdGlvbiAmJiBkZXN0aW5hdGlvbiBpbnN0YW5jZW9mIFN1YnNjcmliZXIpIHtcbiAgICAgIG9ic2VydmVyID0gZGVzdGluYXRpb247XG4gICAgfSBlbHNlIHtcbiAgICAgIG9ic2VydmVyID0gbnVsbDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG4iXX0=