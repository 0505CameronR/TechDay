/**
 * @see {@link ajax}
 *
 * @interface
 * @name AjaxRequest
 * @noimport true
 */
export class AjaxRequestDoc {
    constructor() {
        /**
         * @type {string}
         */
        this.url = '';
        /**
         * @type {number}
         */
        this.body = 0;
        /**
         * @type {string}
         */
        this.user = '';
        /**
         * @type {boolean}
         */
        this.async = false;
        /**
         * @type {string}
         */
        this.method = '';
        /**
         * @type {Object}
         */
        this.headers = null;
        /**
         * @type {number}
         */
        this.timeout = 0;
        /**
         * @type {string}
         */
        this.password = '';
        /**
         * @type {boolean}
         */
        this.hasContent = false;
        /**
         * @type {boolean}
         */
        this.crossDomain = false;
        /**
         * @type {boolean}
         */
        this.withCredentials = false;
        /**
         * @type {Subscriber}
         */
        this.progressSubscriber = null;
        /**
         * @type {string}
         */
        this.responseType = '';
    }
    /**
     * @return {XMLHttpRequest}
     */
    createXHR() {
        return null;
    }
    /**
     * @param {AjaxResponse} response
     * @return {T}
     */
    resultSelector(response) {
        return null;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlzY0pTRG9jLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVvcy9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb2JzZXJ2YWJsZS9kb20vTWlzY0pTRG9jLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBOzs7Ozs7R0FNRztBQUNILE1BQU0sT0FBTyxjQUFjO0lBQTNCO1FBQ0U7O1dBRUc7UUFDSCxRQUFHLEdBQVcsRUFBRSxDQUFDO1FBQ2pCOztXQUVHO1FBQ0gsU0FBSSxHQUFRLENBQUMsQ0FBQztRQUNkOztXQUVHO1FBQ0gsU0FBSSxHQUFXLEVBQUUsQ0FBQztRQUNsQjs7V0FFRztRQUNILFVBQUssR0FBWSxLQUFLLENBQUM7UUFDdkI7O1dBRUc7UUFDSCxXQUFNLEdBQVcsRUFBRSxDQUFDO1FBQ3BCOztXQUVHO1FBQ0gsWUFBTyxHQUFXLElBQUksQ0FBQztRQUN2Qjs7V0FFRztRQUNILFlBQU8sR0FBVyxDQUFDLENBQUM7UUFDcEI7O1dBRUc7UUFDSCxhQUFRLEdBQVcsRUFBRSxDQUFDO1FBQ3RCOztXQUVHO1FBQ0gsZUFBVSxHQUFZLEtBQUssQ0FBQztRQUM1Qjs7V0FFRztRQUNILGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBQzdCOztXQUVHO1FBQ0gsb0JBQWUsR0FBWSxLQUFLLENBQUM7UUFPakM7O1dBRUc7UUFDSCx1QkFBa0IsR0FBb0IsSUFBSSxDQUFDO1FBUTNDOztXQUVHO1FBQ0gsaUJBQVksR0FBVyxFQUFFLENBQUM7SUFDNUIsQ0FBQztJQXJCQzs7T0FFRztJQUNILFNBQVM7UUFDUCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFLRDs7O09BR0c7SUFDSCxjQUFjLENBQUksUUFBc0I7UUFDdEMsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0NBS0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBBamF4UmVzcG9uc2UgfSBmcm9tICcuL0FqYXhPYnNlcnZhYmxlJztcblxuLyoqXG4gKiBAc2VlIHtAbGluayBhamF4fVxuICpcbiAqIEBpbnRlcmZhY2VcbiAqIEBuYW1lIEFqYXhSZXF1ZXN0XG4gKiBAbm9pbXBvcnQgdHJ1ZVxuICovXG5leHBvcnQgY2xhc3MgQWpheFJlcXVlc3REb2Mge1xuICAvKipcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIHVybDogc3RyaW5nID0gJyc7XG4gIC8qKlxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKi9cbiAgYm9keTogYW55ID0gMDtcbiAgLyoqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICB1c2VyOiBzdHJpbmcgPSAnJztcbiAgLyoqXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKi9cbiAgYXN5bmM6IGJvb2xlYW4gPSBmYWxzZTtcbiAgLyoqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICBtZXRob2Q6IHN0cmluZyA9ICcnO1xuICAvKipcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIGhlYWRlcnM6IE9iamVjdCA9IG51bGw7XG4gIC8qKlxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKi9cbiAgdGltZW91dDogbnVtYmVyID0gMDtcbiAgLyoqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICBwYXNzd29yZDogc3RyaW5nID0gJyc7XG4gIC8qKlxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIGhhc0NvbnRlbnQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgLyoqXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKi9cbiAgY3Jvc3NEb21haW46IGJvb2xlYW4gPSBmYWxzZTtcbiAgLyoqXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKi9cbiAgd2l0aENyZWRlbnRpYWxzOiBib29sZWFuID0gZmFsc2U7XG4gIC8qKlxuICAgKiBAcmV0dXJuIHtYTUxIdHRwUmVxdWVzdH1cbiAgICovXG4gIGNyZWF0ZVhIUigpOiBYTUxIdHRwUmVxdWVzdCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgLyoqXG4gICAqIEB0eXBlIHtTdWJzY3JpYmVyfVxuICAgKi9cbiAgcHJvZ3Jlc3NTdWJzY3JpYmVyOiBTdWJzY3JpYmVyPGFueT4gPSBudWxsO1xuICAvKipcbiAgICogQHBhcmFtIHtBamF4UmVzcG9uc2V9IHJlc3BvbnNlXG4gICAqIEByZXR1cm4ge1R9XG4gICAqL1xuICByZXN1bHRTZWxlY3RvcjxUPihyZXNwb25zZTogQWpheFJlc3BvbnNlKTogVCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgLyoqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICByZXNwb25zZVR5cGU6IHN0cmluZyA9ICcnO1xufVxuIl19