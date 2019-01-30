"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @see {@link ajax}
 *
 * @interface
 * @name AjaxRequest
 * @noimport true
 */
var AjaxRequestDoc = /** @class */ (function () {
    function AjaxRequestDoc() {
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
    AjaxRequestDoc.prototype.createXHR = function () {
        return null;
    };
    /**
     * @param {AjaxResponse} response
     * @return {T}
     */
    AjaxRequestDoc.prototype.resultSelector = function (response) {
        return null;
    };
    return AjaxRequestDoc;
}());
exports.AjaxRequestDoc = AjaxRequestDoc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlzY0pTRG9jLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb2JzZXJ2YWJsZS9kb20vTWlzY0pTRG9jLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0E7Ozs7OztHQU1HO0FBQ0g7SUFBQTtRQUNFOztXQUVHO1FBQ0gsUUFBRyxHQUFXLEVBQUUsQ0FBQztRQUNqQjs7V0FFRztRQUNILFNBQUksR0FBUSxDQUFDLENBQUM7UUFDZDs7V0FFRztRQUNILFNBQUksR0FBVyxFQUFFLENBQUM7UUFDbEI7O1dBRUc7UUFDSCxVQUFLLEdBQVksS0FBSyxDQUFDO1FBQ3ZCOztXQUVHO1FBQ0gsV0FBTSxHQUFXLEVBQUUsQ0FBQztRQUNwQjs7V0FFRztRQUNILFlBQU8sR0FBVyxJQUFJLENBQUM7UUFDdkI7O1dBRUc7UUFDSCxZQUFPLEdBQVcsQ0FBQyxDQUFDO1FBQ3BCOztXQUVHO1FBQ0gsYUFBUSxHQUFXLEVBQUUsQ0FBQztRQUN0Qjs7V0FFRztRQUNILGVBQVUsR0FBWSxLQUFLLENBQUM7UUFDNUI7O1dBRUc7UUFDSCxnQkFBVyxHQUFZLEtBQUssQ0FBQztRQUM3Qjs7V0FFRztRQUNILG9CQUFlLEdBQVksS0FBSyxDQUFDO1FBT2pDOztXQUVHO1FBQ0gsdUJBQWtCLEdBQW9CLElBQUksQ0FBQztRQVEzQzs7V0FFRztRQUNILGlCQUFZLEdBQVcsRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFyQkM7O09BRUc7SUFDSCxrQ0FBUyxHQUFUO1FBQ0UsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBS0Q7OztPQUdHO0lBQ0gsdUNBQWMsR0FBZCxVQUFrQixRQUFzQjtRQUN0QyxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFLSCxxQkFBQztBQUFELENBQUMsQUFsRUQsSUFrRUM7QUFsRVksd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBBamF4UmVzcG9uc2UgfSBmcm9tICcuL0FqYXhPYnNlcnZhYmxlJztcblxuLyoqXG4gKiBAc2VlIHtAbGluayBhamF4fVxuICpcbiAqIEBpbnRlcmZhY2VcbiAqIEBuYW1lIEFqYXhSZXF1ZXN0XG4gKiBAbm9pbXBvcnQgdHJ1ZVxuICovXG5leHBvcnQgY2xhc3MgQWpheFJlcXVlc3REb2Mge1xuICAvKipcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIHVybDogc3RyaW5nID0gJyc7XG4gIC8qKlxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKi9cbiAgYm9keTogYW55ID0gMDtcbiAgLyoqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICB1c2VyOiBzdHJpbmcgPSAnJztcbiAgLyoqXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKi9cbiAgYXN5bmM6IGJvb2xlYW4gPSBmYWxzZTtcbiAgLyoqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICBtZXRob2Q6IHN0cmluZyA9ICcnO1xuICAvKipcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIGhlYWRlcnM6IE9iamVjdCA9IG51bGw7XG4gIC8qKlxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKi9cbiAgdGltZW91dDogbnVtYmVyID0gMDtcbiAgLyoqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICBwYXNzd29yZDogc3RyaW5nID0gJyc7XG4gIC8qKlxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIGhhc0NvbnRlbnQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgLyoqXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKi9cbiAgY3Jvc3NEb21haW46IGJvb2xlYW4gPSBmYWxzZTtcbiAgLyoqXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKi9cbiAgd2l0aENyZWRlbnRpYWxzOiBib29sZWFuID0gZmFsc2U7XG4gIC8qKlxuICAgKiBAcmV0dXJuIHtYTUxIdHRwUmVxdWVzdH1cbiAgICovXG4gIGNyZWF0ZVhIUigpOiBYTUxIdHRwUmVxdWVzdCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgLyoqXG4gICAqIEB0eXBlIHtTdWJzY3JpYmVyfVxuICAgKi9cbiAgcHJvZ3Jlc3NTdWJzY3JpYmVyOiBTdWJzY3JpYmVyPGFueT4gPSBudWxsO1xuICAvKipcbiAgICogQHBhcmFtIHtBamF4UmVzcG9uc2V9IHJlc3BvbnNlXG4gICAqIEByZXR1cm4ge1R9XG4gICAqL1xuICByZXN1bHRTZWxlY3RvcjxUPihyZXNwb25zZTogQWpheFJlc3BvbnNlKTogVCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgLyoqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICByZXNwb25zZVR5cGU6IHN0cmluZyA9ICcnO1xufVxuIl19