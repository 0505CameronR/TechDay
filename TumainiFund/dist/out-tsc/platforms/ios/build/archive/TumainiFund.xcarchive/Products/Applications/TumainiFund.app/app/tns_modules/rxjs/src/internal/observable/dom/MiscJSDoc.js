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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlzY0pTRG9jLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL2RvbS9NaXNjSlNEb2MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQTs7Ozs7O0dBTUc7QUFDSDtJQUFBO1FBQ0U7O1dBRUc7UUFDSCxRQUFHLEdBQVcsRUFBRSxDQUFDO1FBQ2pCOztXQUVHO1FBQ0gsU0FBSSxHQUFRLENBQUMsQ0FBQztRQUNkOztXQUVHO1FBQ0gsU0FBSSxHQUFXLEVBQUUsQ0FBQztRQUNsQjs7V0FFRztRQUNILFVBQUssR0FBWSxLQUFLLENBQUM7UUFDdkI7O1dBRUc7UUFDSCxXQUFNLEdBQVcsRUFBRSxDQUFDO1FBQ3BCOztXQUVHO1FBQ0gsWUFBTyxHQUFXLElBQUksQ0FBQztRQUN2Qjs7V0FFRztRQUNILFlBQU8sR0FBVyxDQUFDLENBQUM7UUFDcEI7O1dBRUc7UUFDSCxhQUFRLEdBQVcsRUFBRSxDQUFDO1FBQ3RCOztXQUVHO1FBQ0gsZUFBVSxHQUFZLEtBQUssQ0FBQztRQUM1Qjs7V0FFRztRQUNILGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBQzdCOztXQUVHO1FBQ0gsb0JBQWUsR0FBWSxLQUFLLENBQUM7UUFPakM7O1dBRUc7UUFDSCx1QkFBa0IsR0FBb0IsSUFBSSxDQUFDO1FBUTNDOztXQUVHO1FBQ0gsaUJBQVksR0FBVyxFQUFFLENBQUM7SUFDNUIsQ0FBQztJQXJCQzs7T0FFRztJQUNILGtDQUFTLEdBQVQ7UUFDRSxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFLRDs7O09BR0c7SUFDSCx1Q0FBYyxHQUFkLFVBQWtCLFFBQXNCO1FBQ3RDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUtILHFCQUFDO0FBQUQsQ0FBQyxBQWxFRCxJQWtFQztBQWxFWSx3Q0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi8uLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IEFqYXhSZXNwb25zZSB9IGZyb20gJy4vQWpheE9ic2VydmFibGUnO1xuXG4vKipcbiAqIEBzZWUge0BsaW5rIGFqYXh9XG4gKlxuICogQGludGVyZmFjZVxuICogQG5hbWUgQWpheFJlcXVlc3RcbiAqIEBub2ltcG9ydCB0cnVlXG4gKi9cbmV4cG9ydCBjbGFzcyBBamF4UmVxdWVzdERvYyB7XG4gIC8qKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKi9cbiAgdXJsOiBzdHJpbmcgPSAnJztcbiAgLyoqXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqL1xuICBib2R5OiBhbnkgPSAwO1xuICAvKipcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIHVzZXI6IHN0cmluZyA9ICcnO1xuICAvKipcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICBhc3luYzogYm9vbGVhbiA9IGZhbHNlO1xuICAvKipcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIG1ldGhvZDogc3RyaW5nID0gJyc7XG4gIC8qKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgaGVhZGVyczogT2JqZWN0ID0gbnVsbDtcbiAgLyoqXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqL1xuICB0aW1lb3V0OiBudW1iZXIgPSAwO1xuICAvKipcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIHBhc3N3b3JkOiBzdHJpbmcgPSAnJztcbiAgLyoqXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKi9cbiAgaGFzQ29udGVudDogYm9vbGVhbiA9IGZhbHNlO1xuICAvKipcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICBjcm9zc0RvbWFpbjogYm9vbGVhbiA9IGZhbHNlO1xuICAvKipcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICB3aXRoQ3JlZGVudGlhbHM6IGJvb2xlYW4gPSBmYWxzZTtcbiAgLyoqXG4gICAqIEByZXR1cm4ge1hNTEh0dHBSZXF1ZXN0fVxuICAgKi9cbiAgY3JlYXRlWEhSKCk6IFhNTEh0dHBSZXF1ZXN0IHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICAvKipcbiAgICogQHR5cGUge1N1YnNjcmliZXJ9XG4gICAqL1xuICBwcm9ncmVzc1N1YnNjcmliZXI6IFN1YnNjcmliZXI8YW55PiA9IG51bGw7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0FqYXhSZXNwb25zZX0gcmVzcG9uc2VcbiAgICogQHJldHVybiB7VH1cbiAgICovXG4gIHJlc3VsdFNlbGVjdG9yPFQ+KHJlc3BvbnNlOiBBamF4UmVzcG9uc2UpOiBUIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICAvKipcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIHJlc3BvbnNlVHlwZTogc3RyaW5nID0gJyc7XG59XG4iXX0=