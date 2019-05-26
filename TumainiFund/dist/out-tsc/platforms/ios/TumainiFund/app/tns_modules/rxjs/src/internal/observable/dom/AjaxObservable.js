import { root } from '../../util/root';
import { Observable } from '../../Observable';
import { Subscriber } from '../../Subscriber';
import { map } from '../../operators/map';
function getCORSRequest() {
    if (root.XMLHttpRequest) {
        return new root.XMLHttpRequest();
    }
    else if (!!root.XDomainRequest) {
        return new root.XDomainRequest();
    }
    else {
        throw new Error('CORS is not supported by your browser');
    }
}
function getXMLHttpRequest() {
    if (root.XMLHttpRequest) {
        return new root.XMLHttpRequest();
    }
    else {
        let progId;
        try {
            const progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'];
            for (let i = 0; i < 3; i++) {
                try {
                    progId = progIds[i];
                    if (new root.ActiveXObject(progId)) {
                        break;
                    }
                }
                catch (e) {
                    //suppress exceptions
                }
            }
            return new root.ActiveXObject(progId);
        }
        catch (e) {
            throw new Error('XMLHttpRequest is not supported by your browser');
        }
    }
}
export function ajaxGet(url, headers = null) {
    return new AjaxObservable({ method: 'GET', url, headers });
}
export function ajaxPost(url, body, headers) {
    return new AjaxObservable({ method: 'POST', url, body, headers });
}
export function ajaxDelete(url, headers) {
    return new AjaxObservable({ method: 'DELETE', url, headers });
}
export function ajaxPut(url, body, headers) {
    return new AjaxObservable({ method: 'PUT', url, body, headers });
}
export function ajaxPatch(url, body, headers) {
    return new AjaxObservable({ method: 'PATCH', url, body, headers });
}
const mapResponse = map((x, index) => x.response);
export function ajaxGetJSON(url, headers) {
    return mapResponse(new AjaxObservable({
        method: 'GET',
        url,
        responseType: 'json',
        headers
    }));
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
export class AjaxObservable extends Observable {
    constructor(urlOrRequest) {
        super();
        const request = {
            async: true,
            createXHR: function () {
                return this.crossDomain ? getCORSRequest() : getXMLHttpRequest();
            },
            crossDomain: true,
            withCredentials: false,
            headers: {},
            method: 'GET',
            responseType: 'json',
            timeout: 0
        };
        if (typeof urlOrRequest === 'string') {
            request.url = urlOrRequest;
        }
        else {
            for (const prop in urlOrRequest) {
                if (urlOrRequest.hasOwnProperty(prop)) {
                    request[prop] = urlOrRequest[prop];
                }
            }
        }
        this.request = request;
    }
    /** @deprecated This is an internal implementation detail, do not use. */
    _subscribe(subscriber) {
        return new AjaxSubscriber(subscriber, this.request);
    }
}
/**
 * Creates an observable for an Ajax request with either a request object with
 * url, headers, etc or a string for a URL.
 *
 * ## Example
 * ```javascript
 * import { ajax } from 'rxjs/ajax';
*
 * const source1 = ajax('/products');
 * const source2 = ajax({ url: 'products', method: 'GET' });
 * ```
 *
 * @param {string|Object} request Can be one of the following:
 *   A string of the URL to make the Ajax call.
 *   An object with the following properties
 *   - url: URL of the request
 *   - body: The body of the request
 *   - method: Method of the request, such as GET, POST, PUT, PATCH, DELETE
 *   - async: Whether the request is async
 *   - headers: Optional headers
 *   - crossDomain: true if a cross domain request, else false
 *   - createXHR: a function to override if you need to use an alternate
 *   XMLHttpRequest implementation.
 *   - resultSelector: a function to use to alter the output value type of
 *   the Observable. Gets {@link AjaxResponse} as an argument.
 * @return {Observable} An observable sequence containing the XMLHttpRequest.
 * @static true
 * @name ajax
 * @owner Observable
 * @nocollapse
*/
AjaxObservable.create = (() => {
    const create = (urlOrRequest) => {
        return new AjaxObservable(urlOrRequest);
    };
    create.get = ajaxGet;
    create.post = ajaxPost;
    create.delete = ajaxDelete;
    create.put = ajaxPut;
    create.patch = ajaxPatch;
    create.getJSON = ajaxGetJSON;
    return create;
})();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
export class AjaxSubscriber extends Subscriber {
    constructor(destination, request) {
        super(destination);
        this.request = request;
        this.done = false;
        const headers = request.headers = request.headers || {};
        // force CORS if requested
        if (!request.crossDomain && !this.getHeader(headers, 'X-Requested-With')) {
            headers['X-Requested-With'] = 'XMLHttpRequest';
        }
        // ensure content type is set
        let contentTypeHeader = this.getHeader(headers, 'Content-Type');
        if (!contentTypeHeader && !(root.FormData && request.body instanceof root.FormData) && typeof request.body !== 'undefined') {
            headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        }
        // properly serialize body
        request.body = this.serializeBody(request.body, this.getHeader(request.headers, 'Content-Type'));
        this.send();
    }
    next(e) {
        this.done = true;
        const { xhr, request, destination } = this;
        let result;
        try {
            result = new AjaxResponse(e, xhr, request);
        }
        catch (err) {
            return destination.error(err);
        }
        destination.next(result);
    }
    send() {
        const { request, request: { user, method, url, async, password, headers, body } } = this;
        try {
            const xhr = this.xhr = request.createXHR();
            // set up the events before open XHR
            // https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
            // You need to add the event listeners before calling open() on the request.
            // Otherwise the progress events will not fire.
            this.setupEvents(xhr, request);
            // open XHR
            if (user) {
                xhr.open(method, url, async, user, password);
            }
            else {
                xhr.open(method, url, async);
            }
            // timeout, responseType and withCredentials can be set once the XHR is open
            if (async) {
                xhr.timeout = request.timeout;
                xhr.responseType = request.responseType;
            }
            if ('withCredentials' in xhr) {
                xhr.withCredentials = !!request.withCredentials;
            }
            // set headers
            this.setHeaders(xhr, headers);
            // finally send the request
            if (body) {
                xhr.send(body);
            }
            else {
                xhr.send();
            }
        }
        catch (err) {
            this.error(err);
        }
    }
    serializeBody(body, contentType) {
        if (!body || typeof body === 'string') {
            return body;
        }
        else if (root.FormData && body instanceof root.FormData) {
            return body;
        }
        if (contentType) {
            const splitIndex = contentType.indexOf(';');
            if (splitIndex !== -1) {
                contentType = contentType.substring(0, splitIndex);
            }
        }
        switch (contentType) {
            case 'application/x-www-form-urlencoded':
                return Object.keys(body).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(body[key])}`).join('&');
            case 'application/json':
                return JSON.stringify(body);
            default:
                return body;
        }
    }
    setHeaders(xhr, headers) {
        for (let key in headers) {
            if (headers.hasOwnProperty(key)) {
                xhr.setRequestHeader(key, headers[key]);
            }
        }
    }
    getHeader(headers, headerName) {
        for (let key in headers) {
            if (key.toLowerCase() === headerName.toLowerCase()) {
                return headers[key];
            }
        }
        return undefined;
    }
    setupEvents(xhr, request) {
        const progressSubscriber = request.progressSubscriber;
        function xhrTimeout(e) {
            const { subscriber, progressSubscriber, request } = xhrTimeout;
            if (progressSubscriber) {
                progressSubscriber.error(e);
            }
            let error;
            try {
                error = new AjaxTimeoutError(this, request); // TODO: Make betterer.
            }
            catch (err) {
                error = err;
            }
            subscriber.error(error);
        }
        xhr.ontimeout = xhrTimeout;
        xhrTimeout.request = request;
        xhrTimeout.subscriber = this;
        xhrTimeout.progressSubscriber = progressSubscriber;
        if (xhr.upload && 'withCredentials' in xhr) {
            if (progressSubscriber) {
                let xhrProgress;
                xhrProgress = function (e) {
                    const { progressSubscriber } = xhrProgress;
                    progressSubscriber.next(e);
                };
                if (root.XDomainRequest) {
                    xhr.onprogress = xhrProgress;
                }
                else {
                    xhr.upload.onprogress = xhrProgress;
                }
                xhrProgress.progressSubscriber = progressSubscriber;
            }
            let xhrError;
            xhrError = function (e) {
                const { progressSubscriber, subscriber, request } = xhrError;
                if (progressSubscriber) {
                    progressSubscriber.error(e);
                }
                let error;
                try {
                    error = new AjaxError('ajax error', this, request);
                }
                catch (err) {
                    error = err;
                }
                subscriber.error(error);
            };
            xhr.onerror = xhrError;
            xhrError.request = request;
            xhrError.subscriber = this;
            xhrError.progressSubscriber = progressSubscriber;
        }
        function xhrReadyStateChange(e) {
            return;
        }
        xhr.onreadystatechange = xhrReadyStateChange;
        xhrReadyStateChange.subscriber = this;
        xhrReadyStateChange.progressSubscriber = progressSubscriber;
        xhrReadyStateChange.request = request;
        function xhrLoad(e) {
            const { subscriber, progressSubscriber, request } = xhrLoad;
            if (this.readyState === 4) {
                // normalize IE9 bug (http://bugs.jquery.com/ticket/1450)
                let status = this.status === 1223 ? 204 : this.status;
                let response = (this.responseType === 'text' ? (this.response || this.responseText) : this.response);
                // fix status code when it is 0 (0 status is undocumented).
                // Occurs when accessing file resources or on Android 4.1 stock browser
                // while retrieving files from application cache.
                if (status === 0) {
                    status = response ? 200 : 0;
                }
                // 4xx and 5xx should error (https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html)
                if (status < 400) {
                    if (progressSubscriber) {
                        progressSubscriber.complete();
                    }
                    subscriber.next(e);
                    subscriber.complete();
                }
                else {
                    if (progressSubscriber) {
                        progressSubscriber.error(e);
                    }
                    let error;
                    try {
                        error = new AjaxError('ajax error ' + status, this, request);
                    }
                    catch (err) {
                        error = err;
                    }
                    subscriber.error(error);
                }
            }
        }
        xhr.onload = xhrLoad;
        xhrLoad.subscriber = this;
        xhrLoad.progressSubscriber = progressSubscriber;
        xhrLoad.request = request;
    }
    unsubscribe() {
        const { done, xhr } = this;
        if (!done && xhr && xhr.readyState !== 4 && typeof xhr.abort === 'function') {
            xhr.abort();
        }
        super.unsubscribe();
    }
}
/**
 * A normalized AJAX response.
 *
 * @see {@link ajax}
 *
 * @class AjaxResponse
 */
export class AjaxResponse {
    constructor(originalEvent, xhr, request) {
        this.originalEvent = originalEvent;
        this.xhr = xhr;
        this.request = request;
        this.status = xhr.status;
        this.responseType = xhr.responseType || request.responseType;
        this.response = parseXhrResponse(this.responseType, xhr);
    }
}
function AjaxErrorImpl(message, xhr, request) {
    Error.call(this);
    this.message = message;
    this.name = 'AjaxError';
    this.xhr = xhr;
    this.request = request;
    this.status = xhr.status;
    this.responseType = xhr.responseType || request.responseType;
    this.response = parseXhrResponse(this.responseType, xhr);
    return this;
}
AjaxErrorImpl.prototype = Object.create(Error.prototype);
export const AjaxError = AjaxErrorImpl;
function parseJson(xhr) {
    // HACK(benlesh): TypeScript shennanigans
    // tslint:disable-next-line:no-any XMLHttpRequest is defined to always have 'response' inferring xhr as never for the else clause.
    if ('response' in xhr) {
        //IE does not support json as responseType, parse it internally
        return xhr.responseType ? xhr.response : JSON.parse(xhr.response || xhr.responseText || 'null');
    }
    else {
        return JSON.parse(xhr.responseText || 'null');
    }
}
function parseXhrResponse(responseType, xhr) {
    switch (responseType) {
        case 'json':
            return parseJson(xhr);
        case 'xml':
            return xhr.responseXML;
        case 'text':
        default:
            // HACK(benlesh): TypeScript shennanigans
            // tslint:disable-next-line:no-any XMLHttpRequest is defined to always have 'response' inferring xhr as never for the else sub-expression.
            return ('response' in xhr) ? xhr.response : xhr.responseText;
    }
}
function AjaxTimeoutErrorImpl(xhr, request) {
    AjaxError.call(this, 'ajax timeout', xhr, request);
    this.name = 'AjaxTimeoutError';
    return this;
}
/**
 * @see {@link ajax}
 *
 * @class AjaxTimeoutError
 */
export const AjaxTimeoutError = AjaxTimeoutErrorImpl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWpheE9ic2VydmFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL2RvbS9BamF4T2JzZXJ2YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDdkMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUU5QyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFtQjFDLFNBQVMsY0FBYztJQUNyQixJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7UUFDdkIsT0FBTyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztLQUNsQztTQUFNLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUU7UUFDaEMsT0FBTyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztLQUNsQztTQUFNO1FBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO0tBQzFEO0FBQ0gsQ0FBQztBQUVELFNBQVMsaUJBQWlCO0lBQ3hCLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtRQUN2QixPQUFPLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0tBQ2xDO1NBQU07UUFDTCxJQUFJLE1BQWMsQ0FBQztRQUNuQixJQUFJO1lBQ0YsTUFBTSxPQUFPLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxtQkFBbUIsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1lBQzlFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFF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Z0IsR0FBeUIsb0JBQTJCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByb290IH0gZnJvbSAnLi4vLi4vdXRpbC9yb290JztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi8uLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi8uLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi8uLi90eXBlcyc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICcuLi8uLi9vcGVyYXRvcnMvbWFwJztcblxuZXhwb3J0IGludGVyZmFjZSBBamF4UmVxdWVzdCB7XG4gIHVybD86IHN0cmluZztcbiAgYm9keT86IGFueTtcbiAgdXNlcj86IHN0cmluZztcbiAgYXN5bmM/OiBib29sZWFuO1xuICBtZXRob2Q/OiBzdHJpbmc7XG4gIGhlYWRlcnM/OiBPYmplY3Q7XG4gIHRpbWVvdXQ/OiBudW1iZXI7XG4gIHBhc3N3b3JkPzogc3RyaW5nO1xuICBoYXNDb250ZW50PzogYm9vbGVhbjtcbiAgY3Jvc3NEb21haW4/OiBib29sZWFuO1xuICB3aXRoQ3JlZGVudGlhbHM/OiBib29sZWFuO1xuICBjcmVhdGVYSFI/OiAoKSA9PiBYTUxIdHRwUmVxdWVzdDtcbiAgcHJvZ3Jlc3NTdWJzY3JpYmVyPzogU3Vic2NyaWJlcjxhbnk+O1xuICByZXNwb25zZVR5cGU/OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGdldENPUlNSZXF1ZXN0KCk6IFhNTEh0dHBSZXF1ZXN0IHtcbiAgaWYgKHJvb3QuWE1MSHR0cFJlcXVlc3QpIHtcbiAgICByZXR1cm4gbmV3IHJvb3QuWE1MSHR0cFJlcXVlc3QoKTtcbiAgfSBlbHNlIGlmICghIXJvb3QuWERvbWFpblJlcXVlc3QpIHtcbiAgICByZXR1cm4gbmV3IHJvb3QuWERvbWFpblJlcXVlc3QoKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NPUlMgaXMgbm90IHN1cHBvcnRlZCBieSB5b3VyIGJyb3dzZXInKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRYTUxIdHRwUmVxdWVzdCgpOiBYTUxIdHRwUmVxdWVzdCB7XG4gIGlmIChyb290LlhNTEh0dHBSZXF1ZXN0KSB7XG4gICAgcmV0dXJuIG5ldyByb290LlhNTEh0dHBSZXF1ZXN0KCk7XG4gIH0gZWxzZSB7XG4gICAgbGV0IHByb2dJZDogc3RyaW5nO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBwcm9nSWRzID0gWydNc3htbDIuWE1MSFRUUCcsICdNaWNyb3NvZnQuWE1MSFRUUCcsICdNc3htbDIuWE1MSFRUUC40LjAnXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcHJvZ0lkID0gcHJvZ0lkc1tpXTtcbiAgICAgICAgICBpZiAobmV3IHJvb3QuQWN0aXZlWE9iamVjdChwcm9nSWQpKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAvL3N1cHByZXNzIGV4Y2VwdGlvbnNcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyByb290LkFjdGl2ZVhPYmplY3QocHJvZ0lkKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1hNTEh0dHBSZXF1ZXN0IGlzIG5vdCBzdXBwb3J0ZWQgYnkgeW91ciBicm93c2VyJyk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQWpheENyZWF0aW9uTWV0aG9kIHtcbiAgKHVybE9yUmVxdWVzdDogc3RyaW5nIHwgQWpheFJlcXVlc3QpOiBPYnNlcnZhYmxlPEFqYXhSZXNwb25zZT47XG4gIGdldCh1cmw6IHN0cmluZywgaGVhZGVycz86IE9iamVjdCk6IE9ic2VydmFibGU8QWpheFJlc3BvbnNlPjtcbiAgcG9zdCh1cmw6IHN0cmluZywgYm9keT86IGFueSwgaGVhZGVycz86IE9iamVjdCk6IE9ic2VydmFibGU8QWpheFJlc3BvbnNlPjtcbiAgcHV0KHVybDogc3RyaW5nLCBib2R5PzogYW55LCBoZWFkZXJzPzogT2JqZWN0KTogT2JzZXJ2YWJsZTxBamF4UmVzcG9uc2U+O1xuICBwYXRjaCh1cmw6IHN0cmluZywgYm9keT86IGFueSwgaGVhZGVycz86IE9iamVjdCk6IE9ic2VydmFibGU8QWpheFJlc3BvbnNlPjtcbiAgZGVsZXRlKHVybDogc3RyaW5nLCBoZWFkZXJzPzogT2JqZWN0KTogT2JzZXJ2YWJsZTxBamF4UmVzcG9uc2U+O1xuICBnZXRKU09OPFQ+KHVybDogc3RyaW5nLCBoZWFkZXJzPzogT2JqZWN0KTogT2JzZXJ2YWJsZTxUPjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFqYXhHZXQodXJsOiBzdHJpbmcsIGhlYWRlcnM6IE9iamVjdCA9IG51bGwpIHtcbiAgcmV0dXJuIG5ldyBBamF4T2JzZXJ2YWJsZTxBamF4UmVzcG9uc2U+KHsgbWV0aG9kOiAnR0VUJywgdXJsLCBoZWFkZXJzIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWpheFBvc3QodXJsOiBzdHJpbmcsIGJvZHk/OiBhbnksIGhlYWRlcnM/OiBPYmplY3QpOiBPYnNlcnZhYmxlPEFqYXhSZXNwb25zZT4ge1xuICByZXR1cm4gbmV3IEFqYXhPYnNlcnZhYmxlPEFqYXhSZXNwb25zZT4oeyBtZXRob2Q6ICdQT1NUJywgdXJsLCBib2R5LCBoZWFkZXJzIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWpheERlbGV0ZSh1cmw6IHN0cmluZywgaGVhZGVycz86IE9iamVjdCk6IE9ic2VydmFibGU8QWpheFJlc3BvbnNlPiB7XG4gIHJldHVybiBuZXcgQWpheE9ic2VydmFibGU8QWpheFJlc3BvbnNlPih7IG1ldGhvZDogJ0RFTEVURScsIHVybCwgaGVhZGVycyB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFqYXhQdXQodXJsOiBzdHJpbmcsIGJvZHk/OiBhbnksIGhlYWRlcnM/OiBPYmplY3QpOiBPYnNlcnZhYmxlPEFqYXhSZXNwb25zZT4ge1xuICByZXR1cm4gbmV3IEFqYXhPYnNlcnZhYmxlPEFqYXhSZXNwb25zZT4oeyBtZXRob2Q6ICdQVVQnLCB1cmwsIGJvZHksIGhlYWRlcnMgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhamF4UGF0Y2godXJsOiBzdHJpbmcsIGJvZHk/OiBhbnksIGhlYWRlcnM/OiBPYmplY3QpOiBPYnNlcnZhYmxlPEFqYXhSZXNwb25zZT4ge1xuICByZXR1cm4gbmV3IEFqYXhPYnNlcnZhYmxlPEFqYXhSZXNwb25zZT4oeyBtZXRob2Q6ICdQQVRDSCcsIHVybCwgYm9keSwgaGVhZGVycyB9KTtcbn1cblxuY29uc3QgbWFwUmVzcG9uc2UgPSBtYXAoKHg6IEFqYXhSZXNwb25zZSwgaW5kZXg6IG51bWJlcikgPT4geC5yZXNwb25zZSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBhamF4R2V0SlNPTjxUPih1cmw6IHN0cmluZywgaGVhZGVycz86IE9iamVjdCk6IE9ic2VydmFibGU8VD4ge1xuICByZXR1cm4gbWFwUmVzcG9uc2UoXG4gICAgbmV3IEFqYXhPYnNlcnZhYmxlPEFqYXhSZXNwb25zZT4oe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybCxcbiAgICAgIHJlc3BvbnNlVHlwZTogJ2pzb24nLFxuICAgICAgaGVhZGVyc1xuICAgIH0pXG4gICk7XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICogQGhpZGUgdHJ1ZVxuICovXG5leHBvcnQgY2xhc3MgQWpheE9ic2VydmFibGU8VD4gZXh0ZW5kcyBPYnNlcnZhYmxlPFQ+IHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gb2JzZXJ2YWJsZSBmb3IgYW4gQWpheCByZXF1ZXN0IHdpdGggZWl0aGVyIGEgcmVxdWVzdCBvYmplY3Qgd2l0aFxuICAgKiB1cmwsIGhlYWRlcnMsIGV0YyBvciBhIHN0cmluZyBmb3IgYSBVUkwuXG4gICAqXG4gICAqICMjIEV4YW1wbGVcbiAgICogYGBgamF2YXNjcmlwdFxuICAgKiBpbXBvcnQgeyBhamF4IH0gZnJvbSAncnhqcy9hamF4JztcbiAqXG4gICAqIGNvbnN0IHNvdXJjZTEgPSBhamF4KCcvcHJvZHVjdHMnKTtcbiAgICogY29uc3Qgc291cmNlMiA9IGFqYXgoeyB1cmw6ICdwcm9kdWN0cycsIG1ldGhvZDogJ0dFVCcgfSk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xPYmplY3R9IHJlcXVlc3QgQ2FuIGJlIG9uZSBvZiB0aGUgZm9sbG93aW5nOlxuICAgKiAgIEEgc3RyaW5nIG9mIHRoZSBVUkwgdG8gbWFrZSB0aGUgQWpheCBjYWxsLlxuICAgKiAgIEFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllc1xuICAgKiAgIC0gdXJsOiBVUkwgb2YgdGhlIHJlcXVlc3RcbiAgICogICAtIGJvZHk6IFRoZSBib2R5IG9mIHRoZSByZXF1ZXN0XG4gICAqICAgLSBtZXRob2Q6IE1ldGhvZCBvZiB0aGUgcmVxdWVzdCwgc3VjaCBhcyBHRVQsIFBPU1QsIFBVVCwgUEFUQ0gsIERFTEVURVxuICAgKiAgIC0gYXN5bmM6IFdoZXRoZXIgdGhlIHJlcXVlc3QgaXMgYXN5bmNcbiAgICogICAtIGhlYWRlcnM6IE9wdGlvbmFsIGhlYWRlcnNcbiAgICogICAtIGNyb3NzRG9tYWluOiB0cnVlIGlmIGEgY3Jvc3MgZG9tYWluIHJlcXVlc3QsIGVsc2UgZmFsc2VcbiAgICogICAtIGNyZWF0ZVhIUjogYSBmdW5jdGlvbiB0byBvdmVycmlkZSBpZiB5b3UgbmVlZCB0byB1c2UgYW4gYWx0ZXJuYXRlXG4gICAqICAgWE1MSHR0cFJlcXVlc3QgaW1wbGVtZW50YXRpb24uXG4gICAqICAgLSByZXN1bHRTZWxlY3RvcjogYSBmdW5jdGlvbiB0byB1c2UgdG8gYWx0ZXIgdGhlIG91dHB1dCB2YWx1ZSB0eXBlIG9mXG4gICAqICAgdGhlIE9ic2VydmFibGUuIEdldHMge0BsaW5rIEFqYXhSZXNwb25zZX0gYXMgYW4gYXJndW1lbnQuXG4gICAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIG9ic2VydmFibGUgc2VxdWVuY2UgY29udGFpbmluZyB0aGUgWE1MSHR0cFJlcXVlc3QuXG4gICAqIEBzdGF0aWMgdHJ1ZVxuICAgKiBAbmFtZSBhamF4XG4gICAqIEBvd25lciBPYnNlcnZhYmxlXG4gICAqIEBub2NvbGxhcHNlXG4gICovXG4gIHN0YXRpYyBjcmVhdGU6IEFqYXhDcmVhdGlvbk1ldGhvZCA9ICgoKSA9PiB7XG4gICAgY29uc3QgY3JlYXRlOiBhbnkgPSAodXJsT3JSZXF1ZXN0OiBzdHJpbmcgfCBBamF4UmVxdWVzdCkgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBBamF4T2JzZXJ2YWJsZSh1cmxPclJlcXVlc3QpO1xuICAgIH07XG5cbiAgICBjcmVhdGUuZ2V0ID0gYWpheEdldDtcbiAgICBjcmVhdGUucG9zdCA9IGFqYXhQb3N0O1xuICAgIGNyZWF0ZS5kZWxldGUgPSBhamF4RGVsZXRlO1xuICAgIGNyZWF0ZS5wdXQgPSBhamF4UHV0O1xuICAgIGNyZWF0ZS5wYXRjaCA9IGFqYXhQYXRjaDtcbiAgICBjcmVhdGUuZ2V0SlNPTiA9IGFqYXhHZXRKU09OO1xuXG4gICAgcmV0dXJuIDxBamF4Q3JlYXRpb25NZXRob2Q+Y3JlYXRlO1xuICB9KSgpO1xuXG4gIHByaXZhdGUgcmVxdWVzdDogQWpheFJlcXVlc3Q7XG5cbiAgY29uc3RydWN0b3IodXJsT3JSZXF1ZXN0OiBzdHJpbmcgfCBBamF4UmVxdWVzdCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBjb25zdCByZXF1ZXN0OiBBamF4UmVxdWVzdCA9IHtcbiAgICAgIGFzeW5jOiB0cnVlLFxuICAgICAgY3JlYXRlWEhSOiBmdW5jdGlvbih0aGlzOiBBamF4UmVxdWVzdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jcm9zc0RvbWFpbiA/IGdldENPUlNSZXF1ZXN0KCkgOiBnZXRYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgfSxcbiAgICAgIGNyb3NzRG9tYWluOiB0cnVlLFxuICAgICAgd2l0aENyZWRlbnRpYWxzOiBmYWxzZSxcbiAgICAgIGhlYWRlcnM6IHt9LFxuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHJlc3BvbnNlVHlwZTogJ2pzb24nLFxuICAgICAgdGltZW91dDogMFxuICAgIH07XG5cbiAgICBpZiAodHlwZW9mIHVybE9yUmVxdWVzdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJlcXVlc3QudXJsID0gdXJsT3JSZXF1ZXN0O1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGNvbnN0IHByb3AgaW4gdXJsT3JSZXF1ZXN0KSB7XG4gICAgICAgIGlmICh1cmxPclJlcXVlc3QuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICByZXF1ZXN0W3Byb3BdID0gdXJsT3JSZXF1ZXN0W3Byb3BdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3N1YnNjcmliZShzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgcmV0dXJuIG5ldyBBamF4U3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLnJlcXVlc3QpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5leHBvcnQgY2xhc3MgQWpheFN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPEV2ZW50PiB7XG4gIHByaXZhdGUgeGhyOiBYTUxIdHRwUmVxdWVzdDtcbiAgcHJpdmF0ZSBkb25lOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VD4sIHB1YmxpYyByZXF1ZXN0OiBBamF4UmVxdWVzdCkge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcblxuICAgIGNvbnN0IGhlYWRlcnMgPSByZXF1ZXN0LmhlYWRlcnMgPSByZXF1ZXN0LmhlYWRlcnMgfHwge307XG5cbiAgICAvLyBmb3JjZSBDT1JTIGlmIHJlcXVlc3RlZFxuICAgIGlmICghcmVxdWVzdC5jcm9zc0RvbWFpbiAmJiAhdGhpcy5nZXRIZWFkZXIoaGVhZGVycywgJ1gtUmVxdWVzdGVkLVdpdGgnKSkge1xuICAgICAgaGVhZGVyc1snWC1SZXF1ZXN0ZWQtV2l0aCddID0gJ1hNTEh0dHBSZXF1ZXN0JztcbiAgICB9XG5cbiAgICAvLyBlbnN1cmUgY29udGVudCB0eXBlIGlzIHNldFxuICAgIGxldCBjb250ZW50VHlwZUhlYWRlciA9IHRoaXMuZ2V0SGVhZGVyKGhlYWRlcnMsICdDb250ZW50LVR5cGUnKTtcbiAgICBpZiAoIWNvbnRlbnRUeXBlSGVhZGVyICYmICEocm9vdC5Gb3JtRGF0YSAmJiByZXF1ZXN0LmJvZHkgaW5zdGFuY2VvZiByb290LkZvcm1EYXRhKSAmJiB0eXBlb2YgcmVxdWVzdC5ib2R5ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PVVURi04JztcbiAgICB9XG5cbiAgICAvLyBwcm9wZXJseSBzZXJpYWxpemUgYm9keVxuICAgIHJlcXVlc3QuYm9keSA9IHRoaXMuc2VyaWFsaXplQm9keShyZXF1ZXN0LmJvZHksIHRoaXMuZ2V0SGVhZGVyKHJlcXVlc3QuaGVhZGVycywgJ0NvbnRlbnQtVHlwZScpKTtcblxuICAgIHRoaXMuc2VuZCgpO1xuICB9XG5cbiAgbmV4dChlOiBFdmVudCk6IHZvaWQge1xuICAgIHRoaXMuZG9uZSA9IHRydWU7XG4gICAgY29uc3QgeyB4aHIsIHJlcXVlc3QsIGRlc3RpbmF0aW9uIH0gPSB0aGlzO1xuICAgIGxldCByZXN1bHQ7XG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IG5ldyBBamF4UmVzcG9uc2UoZSwgeGhyLCByZXF1ZXN0KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiBkZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgIH1cbiAgICBkZXN0aW5hdGlvbi5uZXh0KHJlc3VsdCk7XG4gIH1cblxuICBwcml2YXRlIHNlbmQoKTogdm9pZCB7XG4gICAgY29uc3Qge1xuICAgICAgcmVxdWVzdCxcbiAgICAgIHJlcXVlc3Q6IHsgdXNlciwgbWV0aG9kLCB1cmwsIGFzeW5jLCBwYXNzd29yZCwgaGVhZGVycywgYm9keSB9XG4gICAgfSA9IHRoaXM7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHhociA9IHRoaXMueGhyID0gcmVxdWVzdC5jcmVhdGVYSFIoKTtcblxuICAgICAgLy8gc2V0IHVwIHRoZSBldmVudHMgYmVmb3JlIG9wZW4gWEhSXG4gICAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9kb2NzL1dlYi9BUEkvWE1MSHR0cFJlcXVlc3QvVXNpbmdfWE1MSHR0cFJlcXVlc3RcbiAgICAgIC8vIFlvdSBuZWVkIHRvIGFkZCB0aGUgZXZlbnQgbGlzdGVuZXJzIGJlZm9yZSBjYWxsaW5nIG9wZW4oKSBvbiB0aGUgcmVxdWVzdC5cbiAgICAgIC8vIE90aGVyd2lzZSB0aGUgcHJvZ3Jlc3MgZXZlbnRzIHdpbGwgbm90IGZpcmUuXG4gICAgICB0aGlzLnNldHVwRXZlbnRzKHhociwgcmVxdWVzdCk7XG4gICAgICAvLyBvcGVuIFhIUlxuICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgeGhyLm9wZW4obWV0aG9kLCB1cmwsIGFzeW5jLCB1c2VyLCBwYXNzd29yZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB4aHIub3BlbihtZXRob2QsIHVybCwgYXN5bmMpO1xuICAgICAgfVxuXG4gICAgICAvLyB0aW1lb3V0LCByZXNwb25zZVR5cGUgYW5kIHdpdGhDcmVkZW50aWFscyBjYW4gYmUgc2V0IG9uY2UgdGhlIFhIUiBpcyBvcGVuXG4gICAgICBpZiAoYXN5bmMpIHtcbiAgICAgICAgeGhyLnRpbWVvdXQgPSByZXF1ZXN0LnRpbWVvdXQ7XG4gICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSByZXF1ZXN0LnJlc3BvbnNlVHlwZSBhcyBhbnk7XG4gICAgICB9XG5cbiAgICAgIGlmICgnd2l0aENyZWRlbnRpYWxzJyBpbiB4aHIpIHtcbiAgICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9ICEhcmVxdWVzdC53aXRoQ3JlZGVudGlhbHM7XG4gICAgICB9XG5cbiAgICAgIC8vIHNldCBoZWFkZXJzXG4gICAgICB0aGlzLnNldEhlYWRlcnMoeGhyLCBoZWFkZXJzKTtcblxuICAgICAgLy8gZmluYWxseSBzZW5kIHRoZSByZXF1ZXN0XG4gICAgICBpZiAoYm9keSkge1xuICAgICAgICB4aHIuc2VuZChib2R5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHhoci5zZW5kKCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLmVycm9yKGVycik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXJpYWxpemVCb2R5KGJvZHk6IGFueSwgY29udGVudFR5cGU/OiBzdHJpbmcpIHtcbiAgICBpZiAoIWJvZHkgfHwgdHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gYm9keTtcbiAgICB9IGVsc2UgaWYgKHJvb3QuRm9ybURhdGEgJiYgYm9keSBpbnN0YW5jZW9mIHJvb3QuRm9ybURhdGEpIHtcbiAgICAgIHJldHVybiBib2R5O1xuICAgIH1cblxuICAgIGlmIChjb250ZW50VHlwZSkge1xuICAgICAgY29uc3Qgc3BsaXRJbmRleCA9IGNvbnRlbnRUeXBlLmluZGV4T2YoJzsnKTtcbiAgICAgIGlmIChzcGxpdEluZGV4ICE9PSAtMSkge1xuICAgICAgICBjb250ZW50VHlwZSA9IGNvbnRlbnRUeXBlLnN1YnN0cmluZygwLCBzcGxpdEluZGV4KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzd2l0Y2ggKGNvbnRlbnRUeXBlKSB7XG4gICAgICBjYXNlICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnOlxuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMoYm9keSkubWFwKGtleSA9PiBgJHtlbmNvZGVVUklDb21wb25lbnQoa2V5KX09JHtlbmNvZGVVUklDb21wb25lbnQoYm9keVtrZXldKX1gKS5qb2luKCcmJyk7XG4gICAgICBjYXNlICdhcHBsaWNhdGlvbi9qc29uJzpcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGJvZHkpO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGJvZHk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXRIZWFkZXJzKHhocjogWE1MSHR0cFJlcXVlc3QsIGhlYWRlcnM6IE9iamVjdCkge1xuICAgIGZvciAobGV0IGtleSBpbiBoZWFkZXJzKSB7XG4gICAgICBpZiAoaGVhZGVycy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgaGVhZGVyc1trZXldKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldEhlYWRlcihoZWFkZXJzOiB7fSwgaGVhZGVyTmFtZTogc3RyaW5nKTogYW55IHtcbiAgICBmb3IgKGxldCBrZXkgaW4gaGVhZGVycykge1xuICAgICAgaWYgKGtleS50b0xvd2VyQ2FzZSgpID09PSBoZWFkZXJOYW1lLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgcmV0dXJuIGhlYWRlcnNba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXR1cEV2ZW50cyh4aHI6IFhNTEh0dHBSZXF1ZXN0LCByZXF1ZXN0OiBBamF4UmVxdWVzdCkge1xuICAgIGNvbnN0IHByb2dyZXNzU3Vic2NyaWJlciA9IHJlcXVlc3QucHJvZ3Jlc3NTdWJzY3JpYmVyO1xuXG4gICAgZnVuY3Rpb24geGhyVGltZW91dCh0aGlzOiBYTUxIdHRwUmVxdWVzdCwgZTogUHJvZ3Jlc3NFdmVudCk6IHZvaWQge1xuICAgICAgY29uc3Qge3N1YnNjcmliZXIsIHByb2dyZXNzU3Vic2NyaWJlciwgcmVxdWVzdCB9ID0gKDxhbnk+eGhyVGltZW91dCk7XG4gICAgICBpZiAocHJvZ3Jlc3NTdWJzY3JpYmVyKSB7XG4gICAgICAgIHByb2dyZXNzU3Vic2NyaWJlci5lcnJvcihlKTtcbiAgICAgIH1cbiAgICAgIGxldCBlcnJvcjtcbiAgICAgIHRyeSB7XG4gICAgICAgIGVycm9yID0gbmV3IEFqYXhUaW1lb3V0RXJyb3IodGhpcywgcmVxdWVzdCk7IC8vIFRPRE86IE1ha2UgYmV0dGVyZXIuXG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgZXJyb3IgPSBlcnI7XG4gICAgICB9XG4gICAgICBzdWJzY3JpYmVyLmVycm9yKGVycm9yKTtcbiAgICB9XG4gICAgeGhyLm9udGltZW91dCA9IHhoclRpbWVvdXQ7XG4gICAgKDxhbnk+eGhyVGltZW91dCkucmVxdWVzdCA9IHJlcXVlc3Q7XG4gICAgKDxhbnk+eGhyVGltZW91dCkuc3Vic2NyaWJlciA9IHRoaXM7XG4gICAgKDxhbnk+eGhyVGltZW91dCkucHJvZ3Jlc3NTdWJzY3JpYmVyID0gcHJvZ3Jlc3NTdWJzY3JpYmVyO1xuICAgIGlmICh4aHIudXBsb2FkICYmICd3aXRoQ3JlZGVudGlhbHMnIGluIHhocikge1xuICAgICAgaWYgKHByb2dyZXNzU3Vic2NyaWJlcikge1xuICAgICAgICBsZXQgeGhyUHJvZ3Jlc3M6IChlOiBQcm9ncmVzc0V2ZW50KSA9PiB2b2lkO1xuICAgICAgICB4aHJQcm9ncmVzcyA9IGZ1bmN0aW9uKGU6IFByb2dyZXNzRXZlbnQpIHtcbiAgICAgICAgICBjb25zdCB7IHByb2dyZXNzU3Vic2NyaWJlciB9ID0gKDxhbnk+eGhyUHJvZ3Jlc3MpO1xuICAgICAgICAgIHByb2dyZXNzU3Vic2NyaWJlci5uZXh0KGUpO1xuICAgICAgICB9O1xuICAgICAgICBpZiAocm9vdC5YRG9tYWluUmVxdWVzdCkge1xuICAgICAgICAgIHhoci5vbnByb2dyZXNzID0geGhyUHJvZ3Jlc3M7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgeGhyLnVwbG9hZC5vbnByb2dyZXNzID0geGhyUHJvZ3Jlc3M7XG4gICAgICAgIH1cbiAgICAgICAgKDxhbnk+eGhyUHJvZ3Jlc3MpLnByb2dyZXNzU3Vic2NyaWJlciA9IHByb2dyZXNzU3Vic2NyaWJlcjtcbiAgICAgIH1cbiAgICAgIGxldCB4aHJFcnJvcjogKGU6IGFueSkgPT4gdm9pZDtcbiAgICAgIHhockVycm9yID0gZnVuY3Rpb24odGhpczogWE1MSHR0cFJlcXVlc3QsIGU6IEVycm9yRXZlbnQpIHtcbiAgICAgICAgY29uc3QgeyBwcm9ncmVzc1N1YnNjcmliZXIsIHN1YnNjcmliZXIsIHJlcXVlc3QgfSA9ICg8YW55PnhockVycm9yKTtcbiAgICAgICAgaWYgKHByb2dyZXNzU3Vic2NyaWJlcikge1xuICAgICAgICAgIHByb2dyZXNzU3Vic2NyaWJlci5lcnJvcihlKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZXJyb3I7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZXJyb3IgPSBuZXcgQWpheEVycm9yKCdhamF4IGVycm9yJywgdGhpcywgcmVxdWVzdCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIGVycm9yID0gZXJyO1xuICAgICAgICB9XG4gICAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHhoci5vbmVycm9yID0geGhyRXJyb3I7XG4gICAgICAoPGFueT54aHJFcnJvcikucmVxdWVzdCA9IHJlcXVlc3Q7XG4gICAgICAoPGFueT54aHJFcnJvcikuc3Vic2NyaWJlciA9IHRoaXM7XG4gICAgICAoPGFueT54aHJFcnJvcikucHJvZ3Jlc3NTdWJzY3JpYmVyID0gcHJvZ3Jlc3NTdWJzY3JpYmVyO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHhoclJlYWR5U3RhdGVDaGFuZ2UodGhpczogWE1MSHR0cFJlcXVlc3QsIGU6IEV2ZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSB4aHJSZWFkeVN0YXRlQ2hhbmdlO1xuICAgICg8YW55PnhoclJlYWR5U3RhdGVDaGFuZ2UpLnN1YnNjcmliZXIgPSB0aGlzO1xuICAgICg8YW55PnhoclJlYWR5U3RhdGVDaGFuZ2UpLnByb2dyZXNzU3Vic2NyaWJlciA9IHByb2dyZXNzU3Vic2NyaWJlcjtcbiAgICAoPGFueT54aHJSZWFkeVN0YXRlQ2hhbmdlKS5yZXF1ZXN0ID0gcmVxdWVzdDtcblxuICAgIGZ1bmN0aW9uIHhockxvYWQodGhpczogWE1MSHR0cFJlcXVlc3QsIGU6IEV2ZW50KSB7XG4gICAgICBjb25zdCB7IHN1YnNjcmliZXIsIHByb2dyZXNzU3Vic2NyaWJlciwgcmVxdWVzdCB9ID0gKDxhbnk+eGhyTG9hZCk7XG4gICAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgIC8vIG5vcm1hbGl6ZSBJRTkgYnVnIChodHRwOi8vYnVncy5qcXVlcnkuY29tL3RpY2tldC8xNDUwKVxuICAgICAgICBsZXQgc3RhdHVzOiBudW1iZXIgPSB0aGlzLnN0YXR1cyA9PT0gMTIyMyA/IDIwNCA6IHRoaXMuc3RhdHVzO1xuICAgICAgICBsZXQgcmVzcG9uc2U6IGFueSA9ICh0aGlzLnJlc3BvbnNlVHlwZSA9PT0gJ3RleHQnID8gIChcbiAgICAgICAgICB0aGlzLnJlc3BvbnNlIHx8IHRoaXMucmVzcG9uc2VUZXh0KSA6IHRoaXMucmVzcG9uc2UpO1xuXG4gICAgICAgIC8vIGZpeCBzdGF0dXMgY29kZSB3aGVuIGl0IGlzIDAgKDAgc3RhdHVzIGlzIHVuZG9jdW1lbnRlZCkuXG4gICAgICAgIC8vIE9jY3VycyB3aGVuIGFjY2Vzc2luZyBmaWxlIHJlc291cmNlcyBvciBvbiBBbmRyb2lkIDQuMSBzdG9jayBicm93c2VyXG4gICAgICAgIC8vIHdoaWxlIHJldHJpZXZpbmcgZmlsZXMgZnJvbSBhcHBsaWNhdGlvbiBjYWNoZS5cbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMCkge1xuICAgICAgICAgIHN0YXR1cyA9IHJlc3BvbnNlID8gMjAwIDogMDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDR4eCBhbmQgNXh4IHNob3VsZCBlcnJvciAoaHR0cHM6Ly93d3cudzMub3JnL1Byb3RvY29scy9yZmMyNjE2L3JmYzI2MTYtc2VjMTAuaHRtbClcbiAgICAgICAgaWYgKHN0YXR1cyA8IDQwMCkge1xuICAgICAgICAgIGlmIChwcm9ncmVzc1N1YnNjcmliZXIpIHtcbiAgICAgICAgICAgIHByb2dyZXNzU3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzdWJzY3JpYmVyLm5leHQoZSk7XG4gICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChwcm9ncmVzc1N1YnNjcmliZXIpIHtcbiAgICAgICAgICAgIHByb2dyZXNzU3Vic2NyaWJlci5lcnJvcihlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbGV0IGVycm9yO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBlcnJvciA9IG5ldyBBamF4RXJyb3IoJ2FqYXggZXJyb3IgJyArIHN0YXR1cywgdGhpcywgcmVxdWVzdCk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBlcnJvciA9IGVycjtcbiAgICAgICAgICB9XG4gICAgICAgICAgc3Vic2NyaWJlci5lcnJvcihlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgeGhyLm9ubG9hZCA9IHhockxvYWQ7XG4gICAgKDxhbnk+eGhyTG9hZCkuc3Vic2NyaWJlciA9IHRoaXM7XG4gICAgKDxhbnk+eGhyTG9hZCkucHJvZ3Jlc3NTdWJzY3JpYmVyID0gcHJvZ3Jlc3NTdWJzY3JpYmVyO1xuICAgICg8YW55PnhockxvYWQpLnJlcXVlc3QgPSByZXF1ZXN0O1xuICB9XG5cbiAgdW5zdWJzY3JpYmUoKSB7XG4gICAgY29uc3QgeyBkb25lLCB4aHIgfSA9IHRoaXM7XG4gICAgaWYgKCFkb25lICYmIHhociAmJiB4aHIucmVhZHlTdGF0ZSAhPT0gNCAmJiB0eXBlb2YgeGhyLmFib3J0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB4aHIuYWJvcnQoKTtcbiAgICB9XG4gICAgc3VwZXIudW5zdWJzY3JpYmUoKTtcbiAgfVxufVxuXG4vKipcbiAqIEEgbm9ybWFsaXplZCBBSkFYIHJlc3BvbnNlLlxuICpcbiAqIEBzZWUge0BsaW5rIGFqYXh9XG4gKlxuICogQGNsYXNzIEFqYXhSZXNwb25zZVxuICovXG5leHBvcnQgY2xhc3MgQWpheFJlc3BvbnNlIHtcbiAgLyoqIEB0eXBlIHtudW1iZXJ9IFRoZSBIVFRQIHN0YXR1cyBjb2RlICovXG4gIHN0YXR1czogbnVtYmVyO1xuXG4gIC8qKiBAdHlwZSB7c3RyaW5nfEFycmF5QnVmZmVyfERvY3VtZW50fG9iamVjdHxhbnl9IFRoZSByZXNwb25zZSBkYXRhICovXG4gIHJlc3BvbnNlOiBhbnk7XG5cbiAgLyoqIEB0eXBlIHtzdHJpbmd9IFRoZSByYXcgcmVzcG9uc2VUZXh0ICovXG4gIHJlc3BvbnNlVGV4dDogc3RyaW5nO1xuXG4gIC8qKiBAdHlwZSB7c3RyaW5nfSBUaGUgcmVzcG9uc2VUeXBlIChlLmcuICdqc29uJywgJ2FycmF5YnVmZmVyJywgb3IgJ3htbCcpICovXG4gIHJlc3BvbnNlVHlwZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBvcmlnaW5hbEV2ZW50OiBFdmVudCwgcHVibGljIHhocjogWE1MSHR0cFJlcXVlc3QsIHB1YmxpYyByZXF1ZXN0OiBBamF4UmVxdWVzdCkge1xuICAgIHRoaXMuc3RhdHVzID0geGhyLnN0YXR1cztcbiAgICB0aGlzLnJlc3BvbnNlVHlwZSA9IHhoci5yZXNwb25zZVR5cGUgfHwgcmVxdWVzdC5yZXNwb25zZVR5cGU7XG4gICAgdGhpcy5yZXNwb25zZSA9IHBhcnNlWGhyUmVzcG9uc2UodGhpcy5yZXNwb25zZVR5cGUsIHhocik7XG4gIH1cbn1cblxuZXhwb3J0IHR5cGUgQWpheEVycm9yTmFtZXMgPSAnQWpheEVycm9yJyB8ICdBamF4VGltZW91dEVycm9yJztcblxuLyoqXG4gKiBBIG5vcm1hbGl6ZWQgQUpBWCBlcnJvci5cbiAqXG4gKiBAc2VlIHtAbGluayBhamF4fVxuICpcbiAqIEBjbGFzcyBBamF4RXJyb3JcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBamF4RXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIC8qKiBAdHlwZSB7WE1MSHR0cFJlcXVlc3R9IFRoZSBYSFIgaW5zdGFuY2UgYXNzb2NpYXRlZCB3aXRoIHRoZSBlcnJvciAqL1xuICB4aHI6IFhNTEh0dHBSZXF1ZXN0O1xuXG4gIC8qKiBAdHlwZSB7QWpheFJlcXVlc3R9IFRoZSBBamF4UmVxdWVzdCBhc3NvY2lhdGVkIHdpdGggdGhlIGVycm9yICovXG4gIHJlcXVlc3Q6IEFqYXhSZXF1ZXN0O1xuXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSBUaGUgSFRUUCBzdGF0dXMgY29kZSAqL1xuICBzdGF0dXM6IG51bWJlcjtcblxuICAvKiogQHR5cGUge3N0cmluZ30gVGhlIHJlc3BvbnNlVHlwZSAoZS5nLiAnanNvbicsICdhcnJheWJ1ZmZlcicsIG9yICd4bWwnKSAqL1xuICByZXNwb25zZVR5cGU6IHN0cmluZztcblxuICAvKiogQHR5cGUge3N0cmluZ3xBcnJheUJ1ZmZlcnxEb2N1bWVudHxvYmplY3R8YW55fSBUaGUgcmVzcG9uc2UgZGF0YSAqL1xuICByZXNwb25zZTogYW55O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFqYXhFcnJvckN0b3Ige1xuICBuZXcobWVzc2FnZTogc3RyaW5nLCB4aHI6IFhNTEh0dHBSZXF1ZXN0LCByZXF1ZXN0OiBBamF4UmVxdWVzdCk6IEFqYXhFcnJvcjtcbn1cblxuZnVuY3Rpb24gQWpheEVycm9ySW1wbCh0aGlzOiBhbnksIG1lc3NhZ2U6IHN0cmluZywgeGhyOiBYTUxIdHRwUmVxdWVzdCwgcmVxdWVzdDogQWpheFJlcXVlc3QpOiBBamF4RXJyb3Ige1xuICBFcnJvci5jYWxsKHRoaXMpO1xuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICB0aGlzLm5hbWUgPSAnQWpheEVycm9yJztcbiAgdGhpcy54aHIgPSB4aHI7XG4gIHRoaXMucmVxdWVzdCA9IHJlcXVlc3Q7XG4gIHRoaXMuc3RhdHVzID0geGhyLnN0YXR1cztcbiAgdGhpcy5yZXNwb25zZVR5cGUgPSB4aHIucmVzcG9uc2VUeXBlIHx8IHJlcXVlc3QucmVzcG9uc2VUeXBlO1xuICB0aGlzLnJlc3BvbnNlID0gcGFyc2VYaHJSZXNwb25zZSh0aGlzLnJlc3BvbnNlVHlwZSwgeGhyKTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbkFqYXhFcnJvckltcGwucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpO1xuXG5leHBvcnQgY29uc3QgQWpheEVycm9yOiBBamF4RXJyb3JDdG9yID0gQWpheEVycm9ySW1wbCBhcyBhbnk7XG5cbmZ1bmN0aW9uIHBhcnNlSnNvbih4aHI6IFhNTEh0dHBSZXF1ZXN0KSB7XG4gIC8vIEhBQ0soYmVubGVzaCk6IFR5cGVTY3JpcHQgc2hlbm5hbmlnYW5zXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnkgWE1MSHR0cFJlcXVlc3QgaXMgZGVmaW5lZCB0byBhbHdheXMgaGF2ZSAncmVzcG9uc2UnIGluZmVycmluZyB4aHIgYXMgbmV2ZXIgZm9yIHRoZSBlbHNlIGNsYXVzZS5cbiAgaWYgKCdyZXNwb25zZScgaW4gKHhociBhcyBhbnkpKSB7XG4gICAgLy9JRSBkb2VzIG5vdCBzdXBwb3J0IGpzb24gYXMgcmVzcG9uc2VUeXBlLCBwYXJzZSBpdCBpbnRlcm5hbGx5XG4gICAgcmV0dXJuIHhoci5yZXNwb25zZVR5cGUgPyB4aHIucmVzcG9uc2UgOiBKU09OLnBhcnNlKHhoci5yZXNwb25zZSB8fCB4aHIucmVzcG9uc2VUZXh0IHx8ICdudWxsJyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoKHhociBhcyBhbnkpLnJlc3BvbnNlVGV4dCB8fCAnbnVsbCcpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHBhcnNlWGhyUmVzcG9uc2UocmVzcG9uc2VUeXBlOiBzdHJpbmcsIHhocjogWE1MSHR0cFJlcXVlc3QpIHtcbiAgc3dpdGNoIChyZXNwb25zZVR5cGUpIHtcbiAgICBjYXNlICdqc29uJzpcbiAgICAgICAgcmV0dXJuIHBhcnNlSnNvbih4aHIpO1xuICAgICAgY2FzZSAneG1sJzpcbiAgICAgICAgcmV0dXJuIHhoci5yZXNwb25zZVhNTDtcbiAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAvLyBIQUNLKGJlbmxlc2gpOiBUeXBlU2NyaXB0IHNoZW5uYW5pZ2Fuc1xuICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnkgWE1MSHR0cFJlcXVlc3QgaXMgZGVmaW5lZCB0byBhbHdheXMgaGF2ZSAncmVzcG9uc2UnIGluZmVycmluZyB4aHIgYXMgbmV2ZXIgZm9yIHRoZSBlbHNlIHN1Yi1leHByZXNzaW9uLlxuICAgICAgICAgIHJldHVybiAgKCdyZXNwb25zZScgaW4gKHhociBhcyBhbnkpKSA/IHhoci5yZXNwb25zZSA6IHhoci5yZXNwb25zZVRleHQ7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBBamF4VGltZW91dEVycm9yIGV4dGVuZHMgQWpheEVycm9yIHtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBamF4VGltZW91dEVycm9yQ3RvciB7XG4gIG5ldyh4aHI6IFhNTEh0dHBSZXF1ZXN0LCByZXF1ZXN0OiBBamF4UmVxdWVzdCk6IEFqYXhUaW1lb3V0RXJyb3I7XG59XG5cbmZ1bmN0aW9uIEFqYXhUaW1lb3V0RXJyb3JJbXBsKHRoaXM6IGFueSwgeGhyOiBYTUxIdHRwUmVxdWVzdCwgcmVxdWVzdDogQWpheFJlcXVlc3QpIHtcbiAgQWpheEVycm9yLmNhbGwodGhpcywgJ2FqYXggdGltZW91dCcsIHhociwgcmVxdWVzdCk7XG4gIHRoaXMubmFtZSA9ICdBamF4VGltZW91dEVycm9yJztcbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogQHNlZSB7QGxpbmsgYWpheH1cbiAqXG4gKiBAY2xhc3MgQWpheFRpbWVvdXRFcnJvclxuICovXG5leHBvcnQgY29uc3QgQWpheFRpbWVvdXRFcnJvcjogQWpheFRpbWVvdXRFcnJvckN0b3IgPSBBamF4VGltZW91dEVycm9ySW1wbCBhcyBhbnk7XG4iXX0=