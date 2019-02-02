"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var root_1 = require("../../util/root");
var tryCatch_1 = require("../../util/tryCatch");
var errorObject_1 = require("../../util/errorObject");
var Observable_1 = require("../../Observable");
var Subscriber_1 = require("../../Subscriber");
var map_1 = require("../../operators/map");
function getCORSRequest() {
    if (root_1.root.XMLHttpRequest) {
        return new root_1.root.XMLHttpRequest();
    }
    else if (!!root_1.root.XDomainRequest) {
        return new root_1.root.XDomainRequest();
    }
    else {
        throw new Error('CORS is not supported by your browser');
    }
}
function getXMLHttpRequest() {
    if (root_1.root.XMLHttpRequest) {
        return new root_1.root.XMLHttpRequest();
    }
    else {
        var progId = void 0;
        try {
            var progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'];
            for (var i = 0; i < 3; i++) {
                try {
                    progId = progIds[i];
                    if (new root_1.root.ActiveXObject(progId)) {
                        break;
                    }
                }
                catch (e) {
                    //suppress exceptions
                }
            }
            return new root_1.root.ActiveXObject(progId);
        }
        catch (e) {
            throw new Error('XMLHttpRequest is not supported by your browser');
        }
    }
}
function ajaxGet(url, headers) {
    if (headers === void 0) { headers = null; }
    return new AjaxObservable({ method: 'GET', url: url, headers: headers });
}
exports.ajaxGet = ajaxGet;
function ajaxPost(url, body, headers) {
    return new AjaxObservable({ method: 'POST', url: url, body: body, headers: headers });
}
exports.ajaxPost = ajaxPost;
function ajaxDelete(url, headers) {
    return new AjaxObservable({ method: 'DELETE', url: url, headers: headers });
}
exports.ajaxDelete = ajaxDelete;
function ajaxPut(url, body, headers) {
    return new AjaxObservable({ method: 'PUT', url: url, body: body, headers: headers });
}
exports.ajaxPut = ajaxPut;
function ajaxPatch(url, body, headers) {
    return new AjaxObservable({ method: 'PATCH', url: url, body: body, headers: headers });
}
exports.ajaxPatch = ajaxPatch;
var mapResponse = map_1.map(function (x, index) { return x.response; });
function ajaxGetJSON(url, headers) {
    return mapResponse(new AjaxObservable({
        method: 'GET',
        url: url,
        responseType: 'json',
        headers: headers
    }));
}
exports.ajaxGetJSON = ajaxGetJSON;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var AjaxObservable = /** @class */ (function (_super) {
    __extends(AjaxObservable, _super);
    function AjaxObservable(urlOrRequest) {
        var _this = _super.call(this) || this;
        var request = {
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
            for (var prop in urlOrRequest) {
                if (urlOrRequest.hasOwnProperty(prop)) {
                    request[prop] = urlOrRequest[prop];
                }
            }
        }
        _this.request = request;
        return _this;
    }
    /** @deprecated This is an internal implementation detail, do not use. */
    AjaxObservable.prototype._subscribe = function (subscriber) {
        return new AjaxSubscriber(subscriber, this.request);
    };
    /**
     * Creates an observable for an Ajax request with either a request object with
     * url, headers, etc or a string for a URL.
     *
     * ## Example
     * ```javascript
     * source = Rx.Observable.ajax('/products');
     * source = Rx.Observable.ajax({ url: 'products', method: 'GET' });
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
    AjaxObservable.create = (function () {
        var create = function (urlOrRequest) {
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
    return AjaxObservable;
}(Observable_1.Observable));
exports.AjaxObservable = AjaxObservable;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var AjaxSubscriber = /** @class */ (function (_super) {
    __extends(AjaxSubscriber, _super);
    function AjaxSubscriber(destination, request) {
        var _this = _super.call(this, destination) || this;
        _this.request = request;
        _this.done = false;
        var headers = request.headers = request.headers || {};
        // force CORS if requested
        if (!request.crossDomain && !headers['X-Requested-With']) {
            headers['X-Requested-With'] = 'XMLHttpRequest';
        }
        // ensure content type is set
        if (!('Content-Type' in headers) && !(root_1.root.FormData && request.body instanceof root_1.root.FormData) && typeof request.body !== 'undefined') {
            headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        }
        // properly serialize body
        request.body = _this.serializeBody(request.body, request.headers['Content-Type']);
        _this.send();
        return _this;
    }
    AjaxSubscriber.prototype.next = function (e) {
        this.done = true;
        var _a = this, xhr = _a.xhr, request = _a.request, destination = _a.destination;
        var response = new AjaxResponse(e, xhr, request);
        if (response.response === errorObject_1.errorObject) {
            destination.error(errorObject_1.errorObject.e);
        }
        else {
            destination.next(response);
        }
    };
    AjaxSubscriber.prototype.send = function () {
        var _a = this, request = _a.request, _b = _a.request, user = _b.user, method = _b.method, url = _b.url, async = _b.async, password = _b.password, headers = _b.headers, body = _b.body;
        var createXHR = request.createXHR;
        var xhr = tryCatch_1.tryCatch(createXHR).call(request);
        if (xhr === errorObject_1.errorObject) {
            this.error(errorObject_1.errorObject.e);
        }
        else {
            this.xhr = xhr;
            // set up the events before open XHR
            // https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
            // You need to add the event listeners before calling open() on the request.
            // Otherwise the progress events will not fire.
            this.setupEvents(xhr, request);
            // open XHR
            var result = void 0;
            if (user) {
                result = tryCatch_1.tryCatch(xhr.open).call(xhr, method, url, async, user, password);
            }
            else {
                result = tryCatch_1.tryCatch(xhr.open).call(xhr, method, url, async);
            }
            if (result === errorObject_1.errorObject) {
                this.error(errorObject_1.errorObject.e);
                return null;
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
            result = body ? tryCatch_1.tryCatch(xhr.send).call(xhr, body) : tryCatch_1.tryCatch(xhr.send).call(xhr);
            if (result === errorObject_1.errorObject) {
                this.error(errorObject_1.errorObject.e);
                return null;
            }
        }
        return xhr;
    };
    AjaxSubscriber.prototype.serializeBody = function (body, contentType) {
        if (!body || typeof body === 'string') {
            return body;
        }
        else if (root_1.root.FormData && body instanceof root_1.root.FormData) {
            return body;
        }
        if (contentType) {
            var splitIndex = contentType.indexOf(';');
            if (splitIndex !== -1) {
                contentType = contentType.substring(0, splitIndex);
            }
        }
        switch (contentType) {
            case 'application/x-www-form-urlencoded':
                return Object.keys(body).map(function (key) { return encodeURIComponent(key) + "=" + encodeURIComponent(body[key]); }).join('&');
            case 'application/json':
                return JSON.stringify(body);
            default:
                return body;
        }
    };
    AjaxSubscriber.prototype.setHeaders = function (xhr, headers) {
        for (var key in headers) {
            if (headers.hasOwnProperty(key)) {
                xhr.setRequestHeader(key, headers[key]);
            }
        }
    };
    AjaxSubscriber.prototype.setupEvents = function (xhr, request) {
        var progressSubscriber = request.progressSubscriber;
        function xhrTimeout(e) {
            var _a = xhrTimeout, subscriber = _a.subscriber, progressSubscriber = _a.progressSubscriber, request = _a.request;
            if (progressSubscriber) {
                progressSubscriber.error(e);
            }
            var ajaxTimeoutError = new exports.AjaxTimeoutError(this, request); //TODO: Make betterer.
            if (ajaxTimeoutError.response === errorObject_1.errorObject) {
                subscriber.error(errorObject_1.errorObject.e);
            }
            else {
                subscriber.error(ajaxTimeoutError);
            }
        }
        xhr.ontimeout = xhrTimeout;
        xhrTimeout.request = request;
        xhrTimeout.subscriber = this;
        xhrTimeout.progressSubscriber = progressSubscriber;
        if (xhr.upload && 'withCredentials' in xhr) {
            if (progressSubscriber) {
                var xhrProgress_1;
                xhrProgress_1 = function (e) {
                    var progressSubscriber = xhrProgress_1.progressSubscriber;
                    progressSubscriber.next(e);
                };
                if (root_1.root.XDomainRequest) {
                    xhr.onprogress = xhrProgress_1;
                }
                else {
                    xhr.upload.onprogress = xhrProgress_1;
                }
                xhrProgress_1.progressSubscriber = progressSubscriber;
            }
            var xhrError_1;
            xhrError_1 = function (e) {
                var _a = xhrError_1, progressSubscriber = _a.progressSubscriber, subscriber = _a.subscriber, request = _a.request;
                if (progressSubscriber) {
                    progressSubscriber.error(e);
                }
                var ajaxError = new exports.AjaxError('ajax error', this, request);
                if (ajaxError.response === errorObject_1.errorObject) {
                    subscriber.error(errorObject_1.errorObject.e);
                }
                else {
                    subscriber.error(ajaxError);
                }
            };
            xhr.onerror = xhrError_1;
            xhrError_1.request = request;
            xhrError_1.subscriber = this;
            xhrError_1.progressSubscriber = progressSubscriber;
        }
        function xhrReadyStateChange(e) {
            return;
        }
        xhr.onreadystatechange = xhrReadyStateChange;
        xhrReadyStateChange.subscriber = this;
        xhrReadyStateChange.progressSubscriber = progressSubscriber;
        xhrReadyStateChange.request = request;
        function xhrLoad(e) {
            var _a = xhrLoad, subscriber = _a.subscriber, progressSubscriber = _a.progressSubscriber, request = _a.request;
            if (this.readyState === 4) {
                // normalize IE9 bug (http://bugs.jquery.com/ticket/1450)
                var status_1 = this.status === 1223 ? 204 : this.status;
                var response = (this.responseType === 'text' ? (this.response || this.responseText) : this.response);
                // fix status code when it is 0 (0 status is undocumented).
                // Occurs when accessing file resources or on Android 4.1 stock browser
                // while retrieving files from application cache.
                if (status_1 === 0) {
                    status_1 = response ? 200 : 0;
                }
                // 4xx and 5xx should error (https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html)
                if (status_1 < 400) {
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
                    var ajaxError = new exports.AjaxError('ajax error ' + status_1, this, request);
                    if (ajaxError.response === errorObject_1.errorObject) {
                        subscriber.error(errorObject_1.errorObject.e);
                    }
                    else {
                        subscriber.error(ajaxError);
                    }
                }
            }
        }
        xhr.onload = xhrLoad;
        xhrLoad.subscriber = this;
        xhrLoad.progressSubscriber = progressSubscriber;
        xhrLoad.request = request;
    };
    AjaxSubscriber.prototype.unsubscribe = function () {
        var _a = this, done = _a.done, xhr = _a.xhr;
        if (!done && xhr && xhr.readyState !== 4 && typeof xhr.abort === 'function') {
            xhr.abort();
        }
        _super.prototype.unsubscribe.call(this);
    };
    return AjaxSubscriber;
}(Subscriber_1.Subscriber));
exports.AjaxSubscriber = AjaxSubscriber;
/**
 * A normalized AJAX response.
 *
 * @see {@link ajax}
 *
 * @class AjaxResponse
 */
var AjaxResponse = /** @class */ (function () {
    function AjaxResponse(originalEvent, xhr, request) {
        this.originalEvent = originalEvent;
        this.xhr = xhr;
        this.request = request;
        this.status = xhr.status;
        this.responseType = xhr.responseType || request.responseType;
        this.response = parseXhrResponse(this.responseType, xhr);
    }
    return AjaxResponse;
}());
exports.AjaxResponse = AjaxResponse;
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
exports.AjaxError = AjaxErrorImpl;
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
            return tryCatch_1.tryCatch(parseJson)(xhr);
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
    exports.AjaxError.call(this, 'ajax timeout', xhr, request);
    this.name = 'AjaxTimeoutError';
    return this;
}
/**
 * @see {@link ajax}
 *
 * @class AjaxTimeoutError
 */
exports.AjaxTimeoutError = AjaxTimeoutErrorImpl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWpheE9ic2VydmFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL2RvbS9BamF4T2JzZXJ2YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSx3Q0FBdUM7QUFDdkMsZ0RBQStDO0FBQy9DLHNEQUFxRDtBQUNyRCwrQ0FBOEM7QUFDOUMsK0NBQThDO0FBRTlDLDJDQUEwQztBQW1CMUMsU0FBUyxjQUFjO0lBQ3JCLElBQUksV0FBSSxDQUFDLGNBQWMsRUFBRTtRQUN2QixPQUFPLElBQUksV0FBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0tBQ2xDO1NBQU0sSUFBSSxDQUFDLENBQUMsV0FBSSxDQUFDLGNBQWMsRUFBRTtRQUNoQyxPQUFPLElBQUksV0FBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0tBQ2xDO1NBQU07UUFDTCxNQUFNLElBQUksS0FBSyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7S0FDMUQ7QUFDSCxDQUFDO0FBRUQsU0FBUyxpQkFBaUI7SUFDeEIsSUFBSSxXQUFJLENBQUMsY0FBYyxFQUFFO1FBQ3ZCLE9BQU8sSUFBSSxXQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7S0FDbEM7U0FBTTtRQUNMLElBQUksTUFBTSxTQUFRLENBQUM7UUFDbkIsSUFBSTtZQUNGLElBQU0sT0FBTyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsbUJBQW1CLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztZQUM5RSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUMxQixJQUFJO29CQUNGLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BCLElBQUksSUFB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SyxNQUFNO1lBQ1AsT0FBTyxtQkFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xDLEtBQUssS0FBSztZQUNSLE9BQU8sR0FBRyxDQUFDLFdBQVcsQ0FBQztRQUN6QixLQUFLLE1BQU0sQ0FBQztRQUNaO1lBQ0kseUNBQXlDO1lBQ3pDLDBJQUEwSTtZQUMxSSxPQUFRLENBQUMsVUFBVSxJQUFLLEdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDO0tBQzlFO0FBQ0gsQ0FBQztBQVNELFNBQVMsb0JBQW9CLENBQVksR0FBbUIsRUFBRSxPQUFvQjtJQUNoRixpQkFBUyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNuRCxJQUFJLENBQUMsSUFBSSxHQUFHLGtCQUFrQixDQUFDO0lBQy9CLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVEOzs7O0dBSUc7QUFDVSxRQUFBLGdCQUFnQixHQUF5QixvQkFBMkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJvb3QgfSBmcm9tICcuLi8uLi91dGlsL3Jvb3QnO1xuaW1wb3J0IHsgdHJ5Q2F0Y2ggfSBmcm9tICcuLi8uLi91dGlsL3RyeUNhdGNoJztcbmltcG9ydCB7IGVycm9yT2JqZWN0IH0gZnJvbSAnLi4vLi4vdXRpbC9lcnJvck9iamVjdCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAnLi4vLi4vb3BlcmF0b3JzL21hcCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQWpheFJlcXVlc3Qge1xuICB1cmw/OiBzdHJpbmc7XG4gIGJvZHk/OiBhbnk7XG4gIHVzZXI/OiBzdHJpbmc7XG4gIGFzeW5jPzogYm9vbGVhbjtcbiAgbWV0aG9kPzogc3RyaW5nO1xuICBoZWFkZXJzPzogT2JqZWN0O1xuICB0aW1lb3V0PzogbnVtYmVyO1xuICBwYXNzd29yZD86IHN0cmluZztcbiAgaGFzQ29udGVudD86IGJvb2xlYW47XG4gIGNyb3NzRG9tYWluPzogYm9vbGVhbjtcbiAgd2l0aENyZWRlbnRpYWxzPzogYm9vbGVhbjtcbiAgY3JlYXRlWEhSPzogKCkgPT4gWE1MSHR0cFJlcXVlc3Q7XG4gIHByb2dyZXNzU3Vic2NyaWJlcj86IFN1YnNjcmliZXI8YW55PjtcbiAgcmVzcG9uc2VUeXBlPzogc3RyaW5nO1xufVxuXG5mdW5jdGlvbiBnZXRDT1JTUmVxdWVzdCgpOiBYTUxIdHRwUmVxdWVzdCB7XG4gIGlmIChyb290LlhNTEh0dHBSZXF1ZXN0KSB7XG4gICAgcmV0dXJuIG5ldyByb290LlhNTEh0dHBSZXF1ZXN0KCk7XG4gIH0gZWxzZSBpZiAoISFyb290LlhEb21haW5SZXF1ZXN0KSB7XG4gICAgcmV0dXJuIG5ldyByb290LlhEb21haW5SZXF1ZXN0KCk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDT1JTIGlzIG5vdCBzdXBwb3J0ZWQgYnkgeW91ciBicm93c2VyJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0WE1MSHR0cFJlcXVlc3QoKTogWE1MSHR0cFJlcXVlc3Qge1xuICBpZiAocm9vdC5YTUxIdHRwUmVxdWVzdCkge1xuICAgIHJldHVybiBuZXcgcm9vdC5YTUxIdHRwUmVxdWVzdCgpO1xuICB9IGVsc2Uge1xuICAgIGxldCBwcm9nSWQ6IHN0cmluZztcbiAgICB0cnkge1xuICAgICAgY29uc3QgcHJvZ0lkcyA9IFsnTXN4bWwyLlhNTEhUVFAnLCAnTWljcm9zb2Z0LlhNTEhUVFAnLCAnTXN4bWwyLlhNTEhUVFAuNC4wJ107XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHByb2dJZCA9IHByb2dJZHNbaV07XG4gICAgICAgICAgaWYgKG5ldyByb290LkFjdGl2ZVhPYmplY3QocHJvZ0lkKSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgLy9zdXBwcmVzcyBleGNlcHRpb25zXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgcm9vdC5BY3RpdmVYT2JqZWN0KHByb2dJZCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdYTUxIdHRwUmVxdWVzdCBpcyBub3Qgc3VwcG9ydGVkIGJ5IHlvdXIgYnJvd3NlcicpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFqYXhDcmVhdGlvbk1ldGhvZCB7XG4gICh1cmxPclJlcXVlc3Q6IHN0cmluZyB8IEFqYXhSZXF1ZXN0KTogT2JzZXJ2YWJsZTxBamF4UmVzcG9uc2U+O1xuICBnZXQodXJsOiBzdHJpbmcsIGhlYWRlcnM/OiBPYmplY3QpOiBPYnNlcnZhYmxlPEFqYXhSZXNwb25zZT47XG4gIHBvc3QodXJsOiBzdHJpbmcsIGJvZHk/OiBhbnksIGhlYWRlcnM/OiBPYmplY3QpOiBPYnNlcnZhYmxlPEFqYXhSZXNwb25zZT47XG4gIHB1dCh1cmw6IHN0cmluZywgYm9keT86IGFueSwgaGVhZGVycz86IE9iamVjdCk6IE9ic2VydmFibGU8QWpheFJlc3BvbnNlPjtcbiAgcGF0Y2godXJsOiBzdHJpbmcsIGJvZHk/OiBhbnksIGhlYWRlcnM/OiBPYmplY3QpOiBPYnNlcnZhYmxlPEFqYXhSZXNwb25zZT47XG4gIGRlbGV0ZSh1cmw6IHN0cmluZywgaGVhZGVycz86IE9iamVjdCk6IE9ic2VydmFibGU8QWpheFJlc3BvbnNlPjtcbiAgZ2V0SlNPTjxUPih1cmw6IHN0cmluZywgaGVhZGVycz86IE9iamVjdCk6IE9ic2VydmFibGU8VD47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhamF4R2V0KHVybDogc3RyaW5nLCBoZWFkZXJzOiBPYmplY3QgPSBudWxsKSB7XG4gIHJldHVybiBuZXcgQWpheE9ic2VydmFibGU8QWpheFJlc3BvbnNlPih7IG1ldGhvZDogJ0dFVCcsIHVybCwgaGVhZGVycyB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFqYXhQb3N0KHVybDogc3RyaW5nLCBib2R5PzogYW55LCBoZWFkZXJzPzogT2JqZWN0KTogT2JzZXJ2YWJsZTxBamF4UmVzcG9uc2U+IHtcbiAgcmV0dXJuIG5ldyBBamF4T2JzZXJ2YWJsZTxBamF4UmVzcG9uc2U+KHsgbWV0aG9kOiAnUE9TVCcsIHVybCwgYm9keSwgaGVhZGVycyB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFqYXhEZWxldGUodXJsOiBzdHJpbmcsIGhlYWRlcnM/OiBPYmplY3QpOiBPYnNlcnZhYmxlPEFqYXhSZXNwb25zZT4ge1xuICByZXR1cm4gbmV3IEFqYXhPYnNlcnZhYmxlPEFqYXhSZXNwb25zZT4oeyBtZXRob2Q6ICdERUxFVEUnLCB1cmwsIGhlYWRlcnMgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhamF4UHV0KHVybDogc3RyaW5nLCBib2R5PzogYW55LCBoZWFkZXJzPzogT2JqZWN0KTogT2JzZXJ2YWJsZTxBamF4UmVzcG9uc2U+IHtcbiAgcmV0dXJuIG5ldyBBamF4T2JzZXJ2YWJsZTxBamF4UmVzcG9uc2U+KHsgbWV0aG9kOiAnUFVUJywgdXJsLCBib2R5LCBoZWFkZXJzIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWpheFBhdGNoKHVybDogc3RyaW5nLCBib2R5PzogYW55LCBoZWFkZXJzPzogT2JqZWN0KTogT2JzZXJ2YWJsZTxBamF4UmVzcG9uc2U+IHtcbiAgcmV0dXJuIG5ldyBBamF4T2JzZXJ2YWJsZTxBamF4UmVzcG9uc2U+KHsgbWV0aG9kOiAnUEFUQ0gnLCB1cmwsIGJvZHksIGhlYWRlcnMgfSk7XG59XG5cbmNvbnN0IG1hcFJlc3BvbnNlID0gbWFwKCh4OiBBamF4UmVzcG9uc2UsIGluZGV4OiBudW1iZXIpID0+IHgucmVzcG9uc2UpO1xuXG5leHBvcnQgZnVuY3Rpb24gYWpheEdldEpTT048VD4odXJsOiBzdHJpbmcsIGhlYWRlcnM/OiBPYmplY3QpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgcmV0dXJuIG1hcFJlc3BvbnNlKFxuICAgIG5ldyBBamF4T2JzZXJ2YWJsZTxBamF4UmVzcG9uc2U+KHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmwsXG4gICAgICByZXNwb25zZVR5cGU6ICdqc29uJyxcbiAgICAgIGhlYWRlcnNcbiAgICB9KVxuICApO1xufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqIEBoaWRlIHRydWVcbiAqL1xuZXhwb3J0IGNsYXNzIEFqYXhPYnNlcnZhYmxlPFQ+IGV4dGVuZHMgT2JzZXJ2YWJsZTxUPiB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIG9ic2VydmFibGUgZm9yIGFuIEFqYXggcmVxdWVzdCB3aXRoIGVpdGhlciBhIHJlcXVlc3Qgb2JqZWN0IHdpdGhcbiAgICogdXJsLCBoZWFkZXJzLCBldGMgb3IgYSBzdHJpbmcgZm9yIGEgVVJMLlxuICAgKlxuICAgKiAjIyBFeGFtcGxlXG4gICAqIGBgYGphdmFzY3JpcHRcbiAgICogc291cmNlID0gUnguT2JzZXJ2YWJsZS5hamF4KCcvcHJvZHVjdHMnKTtcbiAgICogc291cmNlID0gUnguT2JzZXJ2YWJsZS5hamF4KHsgdXJsOiAncHJvZHVjdHMnLCBtZXRob2Q6ICdHRVQnIH0pO1xuICAgKiBgYGBcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8T2JqZWN0fSByZXF1ZXN0IENhbiBiZSBvbmUgb2YgdGhlIGZvbGxvd2luZzpcbiAgICogICBBIHN0cmluZyBvZiB0aGUgVVJMIHRvIG1ha2UgdGhlIEFqYXggY2FsbC5cbiAgICogICBBbiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXNcbiAgICogICAtIHVybDogVVJMIG9mIHRoZSByZXF1ZXN0XG4gICAqICAgLSBib2R5OiBUaGUgYm9keSBvZiB0aGUgcmVxdWVzdFxuICAgKiAgIC0gbWV0aG9kOiBNZXRob2Qgb2YgdGhlIHJlcXVlc3QsIHN1Y2ggYXMgR0VULCBQT1NULCBQVVQsIFBBVENILCBERUxFVEVcbiAgICogICAtIGFzeW5jOiBXaGV0aGVyIHRoZSByZXF1ZXN0IGlzIGFzeW5jXG4gICAqICAgLSBoZWFkZXJzOiBPcHRpb25hbCBoZWFkZXJzXG4gICAqICAgLSBjcm9zc0RvbWFpbjogdHJ1ZSBpZiBhIGNyb3NzIGRvbWFpbiByZXF1ZXN0LCBlbHNlIGZhbHNlXG4gICAqICAgLSBjcmVhdGVYSFI6IGEgZnVuY3Rpb24gdG8gb3ZlcnJpZGUgaWYgeW91IG5lZWQgdG8gdXNlIGFuIGFsdGVybmF0ZVxuICAgKiAgIFhNTEh0dHBSZXF1ZXN0IGltcGxlbWVudGF0aW9uLlxuICAgKiAgIC0gcmVzdWx0U2VsZWN0b3I6IGEgZnVuY3Rpb24gdG8gdXNlIHRvIGFsdGVyIHRoZSBvdXRwdXQgdmFsdWUgdHlwZSBvZlxuICAgKiAgIHRoZSBPYnNlcnZhYmxlLiBHZXRzIHtAbGluayBBamF4UmVzcG9uc2V9IGFzIGFuIGFyZ3VtZW50LlxuICAgKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBvYnNlcnZhYmxlIHNlcXVlbmNlIGNvbnRhaW5pbmcgdGhlIFhNTEh0dHBSZXF1ZXN0LlxuICAgKiBAc3RhdGljIHRydWVcbiAgICogQG5hbWUgYWpheFxuICAgKiBAb3duZXIgT2JzZXJ2YWJsZVxuICAgKiBAbm9jb2xsYXBzZVxuICAqL1xuICBzdGF0aWMgY3JlYXRlOiBBamF4Q3JlYXRpb25NZXRob2QgPSAoKCkgPT4ge1xuICAgIGNvbnN0IGNyZWF0ZTogYW55ID0gKHVybE9yUmVxdWVzdDogc3RyaW5nIHwgQWpheFJlcXVlc3QpID0+IHtcbiAgICAgIHJldHVybiBuZXcgQWpheE9ic2VydmFibGUodXJsT3JSZXF1ZXN0KTtcbiAgICB9O1xuXG4gICAgY3JlYXRlLmdldCA9IGFqYXhHZXQ7XG4gICAgY3JlYXRlLnBvc3QgPSBhamF4UG9zdDtcbiAgICBjcmVhdGUuZGVsZXRlID0gYWpheERlbGV0ZTtcbiAgICBjcmVhdGUucHV0ID0gYWpheFB1dDtcbiAgICBjcmVhdGUucGF0Y2ggPSBhamF4UGF0Y2g7XG4gICAgY3JlYXRlLmdldEpTT04gPSBhamF4R2V0SlNPTjtcblxuICAgIHJldHVybiA8QWpheENyZWF0aW9uTWV0aG9kPmNyZWF0ZTtcbiAgfSkoKTtcblxuICBwcml2YXRlIHJlcXVlc3Q6IEFqYXhSZXF1ZXN0O1xuXG4gIGNvbnN0cnVjdG9yKHVybE9yUmVxdWVzdDogc3RyaW5nIHwgQWpheFJlcXVlc3QpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgY29uc3QgcmVxdWVzdDogQWpheFJlcXVlc3QgPSB7XG4gICAgICBhc3luYzogdHJ1ZSxcbiAgICAgIGNyZWF0ZVhIUjogZnVuY3Rpb24odGhpczogQWpheFJlcXVlc3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3Jvc3NEb21haW4gPyBnZXRDT1JTUmVxdWVzdCgpIDogZ2V0WE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIH0sXG4gICAgICBjcm9zc0RvbWFpbjogdHJ1ZSxcbiAgICAgIHdpdGhDcmVkZW50aWFsczogZmFsc2UsXG4gICAgICBoZWFkZXJzOiB7fSxcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICByZXNwb25zZVR5cGU6ICdqc29uJyxcbiAgICAgIHRpbWVvdXQ6IDBcbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiB1cmxPclJlcXVlc3QgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXF1ZXN0LnVybCA9IHVybE9yUmVxdWVzdDtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChjb25zdCBwcm9wIGluIHVybE9yUmVxdWVzdCkge1xuICAgICAgICBpZiAodXJsT3JSZXF1ZXN0Lmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgcmVxdWVzdFtwcm9wXSA9IHVybE9yUmVxdWVzdFtwcm9wXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMucmVxdWVzdCA9IHJlcXVlc3Q7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF9zdWJzY3JpYmUoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPik6IFRlYXJkb3duTG9naWMge1xuICAgIHJldHVybiBuZXcgQWpheFN1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5yZXF1ZXN0KTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuZXhwb3J0IGNsYXNzIEFqYXhTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxFdmVudD4ge1xuICBwcml2YXRlIHhocjogWE1MSHR0cFJlcXVlc3Q7XG4gIHByaXZhdGUgZG9uZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFQ+LCBwdWJsaWMgcmVxdWVzdDogQWpheFJlcXVlc3QpIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG5cbiAgICBjb25zdCBoZWFkZXJzID0gcmVxdWVzdC5oZWFkZXJzID0gcmVxdWVzdC5oZWFkZXJzIHx8IHt9O1xuXG4gICAgLy8gZm9yY2UgQ09SUyBpZiByZXF1ZXN0ZWRcbiAgICBpZiAoIXJlcXVlc3QuY3Jvc3NEb21haW4gJiYgIWhlYWRlcnNbJ1gtUmVxdWVzdGVkLVdpdGgnXSkge1xuICAgICAgaGVhZGVyc1snWC1SZXF1ZXN0ZWQtV2l0aCddID0gJ1hNTEh0dHBSZXF1ZXN0JztcbiAgICB9XG5cbiAgICAvLyBlbnN1cmUgY29udGVudCB0eXBlIGlzIHNldFxuICAgIGlmICghKCdDb250ZW50LVR5cGUnIGluIGhlYWRlcnMpICYmICEocm9vdC5Gb3JtRGF0YSAmJiByZXF1ZXN0LmJvZHkgaW5zdGFuY2VvZiByb290LkZvcm1EYXRhKSAmJiB0eXBlb2YgcmVxdWVzdC5ib2R5ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PVVURi04JztcbiAgICB9XG5cbiAgICAvLyBwcm9wZXJseSBzZXJpYWxpemUgYm9keVxuICAgIHJlcXVlc3QuYm9keSA9IHRoaXMuc2VyaWFsaXplQm9keShyZXF1ZXN0LmJvZHksIHJlcXVlc3QuaGVhZGVyc1snQ29udGVudC1UeXBlJ10pO1xuXG4gICAgdGhpcy5zZW5kKCk7XG4gIH1cblxuICBuZXh0KGU6IEV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy5kb25lID0gdHJ1ZTtcbiAgICBjb25zdCB7IHhociwgcmVxdWVzdCwgZGVzdGluYXRpb24gfSA9IHRoaXM7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBuZXcgQWpheFJlc3BvbnNlKGUsIHhociwgcmVxdWVzdCk7XG4gICAgaWYgKHJlc3BvbnNlLnJlc3BvbnNlID09PSBlcnJvck9iamVjdCkge1xuICAgICAgZGVzdGluYXRpb24uZXJyb3IoZXJyb3JPYmplY3QuZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlc3RpbmF0aW9uLm5leHQocmVzcG9uc2UpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2VuZCgpOiBYTUxIdHRwUmVxdWVzdCB7XG4gICAgY29uc3Qge1xuICAgICAgcmVxdWVzdCxcbiAgICAgIHJlcXVlc3Q6IHsgdXNlciwgbWV0aG9kLCB1cmwsIGFzeW5jLCBwYXNzd29yZCwgaGVhZGVycywgYm9keSB9XG4gICAgfSA9IHRoaXM7XG4gICAgY29uc3QgY3JlYXRlWEhSID0gcmVxdWVzdC5jcmVhdGVYSFI7XG4gICAgY29uc3QgeGhyOiBYTUxIdHRwUmVxdWVzdCA9IHRyeUNhdGNoKGNyZWF0ZVhIUikuY2FsbChyZXF1ZXN0KTtcblxuICAgIGlmICg8YW55PnhociA9PT0gZXJyb3JPYmplY3QpIHtcbiAgICAgIHRoaXMuZXJyb3IoZXJyb3JPYmplY3QuZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMueGhyID0geGhyO1xuXG4gICAgICAvLyBzZXQgdXAgdGhlIGV2ZW50cyBiZWZvcmUgb3BlbiBYSFJcbiAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL2RvY3MvV2ViL0FQSS9YTUxIdHRwUmVxdWVzdC9Vc2luZ19YTUxIdHRwUmVxdWVzdFxuICAgICAgLy8gWW91IG5lZWQgdG8gYWRkIHRoZSBldmVudCBsaXN0ZW5lcnMgYmVmb3JlIGNhbGxpbmcgb3BlbigpIG9uIHRoZSByZXF1ZXN0LlxuICAgICAgLy8gT3RoZXJ3aXNlIHRoZSBwcm9ncmVzcyBldmVudHMgd2lsbCBub3QgZmlyZS5cbiAgICAgIHRoaXMuc2V0dXBFdmVudHMoeGhyLCByZXF1ZXN0KTtcbiAgICAgIC8vIG9wZW4gWEhSXG4gICAgICBsZXQgcmVzdWx0OiBhbnk7XG4gICAgICBpZiAodXNlcikge1xuICAgICAgICByZXN1bHQgPSB0cnlDYXRjaCh4aHIub3BlbikuY2FsbCh4aHIsIG1ldGhvZCwgdXJsLCBhc3luYywgdXNlciwgcGFzc3dvcmQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gdHJ5Q2F0Y2goeGhyLm9wZW4pLmNhbGwoeGhyLCBtZXRob2QsIHVybCwgYXN5bmMpO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVzdWx0ID09PSBlcnJvck9iamVjdCkge1xuICAgICAgICB0aGlzLmVycm9yKGVycm9yT2JqZWN0LmUpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgLy8gdGltZW91dCwgcmVzcG9uc2VUeXBlIGFuZCB3aXRoQ3JlZGVudGlhbHMgY2FuIGJlIHNldCBvbmNlIHRoZSBYSFIgaXMgb3BlblxuICAgICAgaWYgKGFzeW5jKSB7XG4gICAgICAgIHhoci50aW1lb3V0ID0gcmVxdWVzdC50aW1lb3V0O1xuICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gcmVxdWVzdC5yZXNwb25zZVR5cGUgYXMgYW55O1xuICAgICAgfVxuXG4gICAgICBpZiAoJ3dpdGhDcmVkZW50aWFscycgaW4geGhyKSB7XG4gICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSAhIXJlcXVlc3Qud2l0aENyZWRlbnRpYWxzO1xuICAgICAgfVxuXG4gICAgICAvLyBzZXQgaGVhZGVyc1xuICAgICAgdGhpcy5zZXRIZWFkZXJzKHhociwgaGVhZGVycyk7XG5cbiAgICAgIC8vIGZpbmFsbHkgc2VuZCB0aGUgcmVxdWVzdFxuICAgICAgcmVzdWx0ID0gYm9keSA/IHRyeUNhdGNoKHhoci5zZW5kKS5jYWxsKHhociwgYm9keSkgOiB0cnlDYXRjaCh4aHIuc2VuZCkuY2FsbCh4aHIpO1xuICAgICAgaWYgKHJlc3VsdCA9PT0gZXJyb3JPYmplY3QpIHtcbiAgICAgICAgdGhpcy5lcnJvcihlcnJvck9iamVjdC5lKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHhocjtcbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplQm9keShib2R5OiBhbnksIGNvbnRlbnRUeXBlPzogc3RyaW5nKSB7XG4gICAgaWYgKCFib2R5IHx8IHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIGJvZHk7XG4gICAgfSBlbHNlIGlmIChyb290LkZvcm1EYXRhICYmIGJvZHkgaW5zdGFuY2VvZiByb290LkZvcm1EYXRhKSB7XG4gICAgICByZXR1cm4gYm9keTtcbiAgICB9XG5cbiAgICBpZiAoY29udGVudFR5cGUpIHtcbiAgICAgIGNvbnN0IHNwbGl0SW5kZXggPSBjb250ZW50VHlwZS5pbmRleE9mKCc7Jyk7XG4gICAgICBpZiAoc3BsaXRJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgY29udGVudFR5cGUgPSBjb250ZW50VHlwZS5zdWJzdHJpbmcoMCwgc3BsaXRJbmRleCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc3dpdGNoIChjb250ZW50VHlwZSkge1xuICAgICAgY2FzZSAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJzpcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGJvZHkpLm1hcChrZXkgPT4gYCR7ZW5jb2RlVVJJQ29tcG9uZW50KGtleSl9PSR7ZW5jb2RlVVJJQ29tcG9uZW50KGJvZHlba2V5XSl9YCkuam9pbignJicpO1xuICAgICAgY2FzZSAnYXBwbGljYXRpb24vanNvbic6XG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShib2R5KTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBib2R5O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2V0SGVhZGVycyh4aHI6IFhNTEh0dHBSZXF1ZXN0LCBoZWFkZXJzOiBPYmplY3QpIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gaGVhZGVycykge1xuICAgICAgaWYgKGhlYWRlcnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihrZXksIGhlYWRlcnNba2V5XSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXR1cEV2ZW50cyh4aHI6IFhNTEh0dHBSZXF1ZXN0LCByZXF1ZXN0OiBBamF4UmVxdWVzdCkge1xuICAgIGNvbnN0IHByb2dyZXNzU3Vic2NyaWJlciA9IHJlcXVlc3QucHJvZ3Jlc3NTdWJzY3JpYmVyO1xuXG4gICAgZnVuY3Rpb24geGhyVGltZW91dCh0aGlzOiBYTUxIdHRwUmVxdWVzdCwgZTogUHJvZ3Jlc3NFdmVudCkge1xuICAgICAgY29uc3Qge3N1YnNjcmliZXIsIHByb2dyZXNzU3Vic2NyaWJlciwgcmVxdWVzdCB9ID0gKDxhbnk+eGhyVGltZW91dCk7XG4gICAgICBpZiAocHJvZ3Jlc3NTdWJzY3JpYmVyKSB7XG4gICAgICAgIHByb2dyZXNzU3Vic2NyaWJlci5lcnJvcihlKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGFqYXhUaW1lb3V0RXJyb3IgPSBuZXcgQWpheFRpbWVvdXRFcnJvcih0aGlzLCByZXF1ZXN0KTsgLy9UT0RPOiBNYWtlIGJldHRlcmVyLlxuICAgICAgaWYgKGFqYXhUaW1lb3V0RXJyb3IucmVzcG9uc2UgPT09IGVycm9yT2JqZWN0KSB7XG4gICAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyb3JPYmplY3QuZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdWJzY3JpYmVyLmVycm9yKGFqYXhUaW1lb3V0RXJyb3IpO1xuICAgICAgfVxuICAgIH1cbiAgICB4aHIub250aW1lb3V0ID0geGhyVGltZW91dDtcbiAgICAoPGFueT54aHJUaW1lb3V0KS5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgICAoPGFueT54aHJUaW1lb3V0KS5zdWJzY3JpYmVyID0gdGhpcztcbiAgICAoPGFueT54aHJUaW1lb3V0KS5wcm9ncmVzc1N1YnNjcmliZXIgPSBwcm9ncmVzc1N1YnNjcmliZXI7XG4gICAgaWYgKHhoci51cGxvYWQgJiYgJ3dpdGhDcmVkZW50aWFscycgaW4geGhyKSB7XG4gICAgICBpZiAocHJvZ3Jlc3NTdWJzY3JpYmVyKSB7XG4gICAgICAgIGxldCB4aHJQcm9ncmVzczogKGU6IFByb2dyZXNzRXZlbnQpID0+IHZvaWQ7XG4gICAgICAgIHhoclByb2dyZXNzID0gZnVuY3Rpb24oZTogUHJvZ3Jlc3NFdmVudCkge1xuICAgICAgICAgIGNvbnN0IHsgcHJvZ3Jlc3NTdWJzY3JpYmVyIH0gPSAoPGFueT54aHJQcm9ncmVzcyk7XG4gICAgICAgICAgcHJvZ3Jlc3NTdWJzY3JpYmVyLm5leHQoZSk7XG4gICAgICAgIH07XG4gICAgICAgIGlmIChyb290LlhEb21haW5SZXF1ZXN0KSB7XG4gICAgICAgICAgeGhyLm9ucHJvZ3Jlc3MgPSB4aHJQcm9ncmVzcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB4aHIudXBsb2FkLm9ucHJvZ3Jlc3MgPSB4aHJQcm9ncmVzcztcbiAgICAgICAgfVxuICAgICAgICAoPGFueT54aHJQcm9ncmVzcykucHJvZ3Jlc3NTdWJzY3JpYmVyID0gcHJvZ3Jlc3NTdWJzY3JpYmVyO1xuICAgICAgfVxuICAgICAgbGV0IHhockVycm9yOiAoZTogYW55KSA9PiB2b2lkO1xuICAgICAgeGhyRXJyb3IgPSBmdW5jdGlvbih0aGlzOiBYTUxIdHRwUmVxdWVzdCwgZTogRXJyb3JFdmVudCkge1xuICAgICAgICBjb25zdCB7IHByb2dyZXNzU3Vic2NyaWJlciwgc3Vic2NyaWJlciwgcmVxdWVzdCB9ID0gKDxhbnk+eGhyRXJyb3IpO1xuICAgICAgICBpZiAocHJvZ3Jlc3NTdWJzY3JpYmVyKSB7XG4gICAgICAgICAgcHJvZ3Jlc3NTdWJzY3JpYmVyLmVycm9yKGUpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGFqYXhFcnJvciA9IG5ldyBBamF4RXJyb3IoJ2FqYXggZXJyb3InLCB0aGlzLCByZXF1ZXN0KTtcbiAgICAgICAgaWYgKGFqYXhFcnJvci5yZXNwb25zZSA9PT0gZXJyb3JPYmplY3QpIHtcbiAgICAgICAgICBzdWJzY3JpYmVyLmVycm9yKGVycm9yT2JqZWN0LmUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN1YnNjcmliZXIuZXJyb3IoYWpheEVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHhoci5vbmVycm9yID0geGhyRXJyb3I7XG4gICAgICAoPGFueT54aHJFcnJvcikucmVxdWVzdCA9IHJlcXVlc3Q7XG4gICAgICAoPGFueT54aHJFcnJvcikuc3Vic2NyaWJlciA9IHRoaXM7XG4gICAgICAoPGFueT54aHJFcnJvcikucHJvZ3Jlc3NTdWJzY3JpYmVyID0gcHJvZ3Jlc3NTdWJzY3JpYmVyO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHhoclJlYWR5U3RhdGVDaGFuZ2UodGhpczogWE1MSHR0cFJlcXVlc3QsIGU6IEV2ZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSB4aHJSZWFkeVN0YXRlQ2hhbmdlO1xuICAgICg8YW55PnhoclJlYWR5U3RhdGVDaGFuZ2UpLnN1YnNjcmliZXIgPSB0aGlzO1xuICAgICg8YW55PnhoclJlYWR5U3RhdGVDaGFuZ2UpLnByb2dyZXNzU3Vic2NyaWJlciA9IHByb2dyZXNzU3Vic2NyaWJlcjtcbiAgICAoPGFueT54aHJSZWFkeVN0YXRlQ2hhbmdlKS5yZXF1ZXN0ID0gcmVxdWVzdDtcblxuICAgIGZ1bmN0aW9uIHhockxvYWQodGhpczogWE1MSHR0cFJlcXVlc3QsIGU6IEV2ZW50KSB7XG4gICAgICBjb25zdCB7IHN1YnNjcmliZXIsIHByb2dyZXNzU3Vic2NyaWJlciwgcmVxdWVzdCB9ID0gKDxhbnk+eGhyTG9hZCk7XG4gICAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgIC8vIG5vcm1hbGl6ZSBJRTkgYnVnIChodHRwOi8vYnVncy5qcXVlcnkuY29tL3RpY2tldC8xNDUwKVxuICAgICAgICBsZXQgc3RhdHVzOiBudW1iZXIgPSB0aGlzLnN0YXR1cyA9PT0gMTIyMyA/IDIwNCA6IHRoaXMuc3RhdHVzO1xuICAgICAgICBsZXQgcmVzcG9uc2U6IGFueSA9ICh0aGlzLnJlc3BvbnNlVHlwZSA9PT0gJ3RleHQnID8gIChcbiAgICAgICAgICB0aGlzLnJlc3BvbnNlIHx8IHRoaXMucmVzcG9uc2VUZXh0KSA6IHRoaXMucmVzcG9uc2UpO1xuXG4gICAgICAgIC8vIGZpeCBzdGF0dXMgY29kZSB3aGVuIGl0IGlzIDAgKDAgc3RhdHVzIGlzIHVuZG9jdW1lbnRlZCkuXG4gICAgICAgIC8vIE9jY3VycyB3aGVuIGFjY2Vzc2luZyBmaWxlIHJlc291cmNlcyBvciBvbiBBbmRyb2lkIDQuMSBzdG9jayBicm93c2VyXG4gICAgICAgIC8vIHdoaWxlIHJldHJpZXZpbmcgZmlsZXMgZnJvbSBhcHBsaWNhdGlvbiBjYWNoZS5cbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMCkge1xuICAgICAgICAgIHN0YXR1cyA9IHJlc3BvbnNlID8gMjAwIDogMDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDR4eCBhbmQgNXh4IHNob3VsZCBlcnJvciAoaHR0cHM6Ly93d3cudzMub3JnL1Byb3RvY29scy9yZmMyNjE2L3JmYzI2MTYtc2VjMTAuaHRtbClcbiAgICAgICAgaWYgKHN0YXR1cyA8IDQwMCkge1xuICAgICAgICAgIGlmIChwcm9ncmVzc1N1YnNjcmliZXIpIHtcbiAgICAgICAgICAgIHByb2dyZXNzU3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzdWJzY3JpYmVyLm5leHQoZSk7XG4gICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChwcm9ncmVzc1N1YnNjcmliZXIpIHtcbiAgICAgICAgICAgIHByb2dyZXNzU3Vic2NyaWJlci5lcnJvcihlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgYWpheEVycm9yID0gbmV3IEFqYXhFcnJvcignYWpheCBlcnJvciAnICsgc3RhdHVzLCB0aGlzLCByZXF1ZXN0KTtcbiAgICAgICAgICBpZiAoYWpheEVycm9yLnJlc3BvbnNlID09PSBlcnJvck9iamVjdCkge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5lcnJvcihlcnJvck9iamVjdC5lKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5lcnJvcihhamF4RXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB4aHIub25sb2FkID0geGhyTG9hZDtcbiAgICAoPGFueT54aHJMb2FkKS5zdWJzY3JpYmVyID0gdGhpcztcbiAgICAoPGFueT54aHJMb2FkKS5wcm9ncmVzc1N1YnNjcmliZXIgPSBwcm9ncmVzc1N1YnNjcmliZXI7XG4gICAgKDxhbnk+eGhyTG9hZCkucmVxdWVzdCA9IHJlcXVlc3Q7XG4gIH1cblxuICB1bnN1YnNjcmliZSgpIHtcbiAgICBjb25zdCB7IGRvbmUsIHhociB9ID0gdGhpcztcbiAgICBpZiAoIWRvbmUgJiYgeGhyICYmIHhoci5yZWFkeVN0YXRlICE9PSA0ICYmIHR5cGVvZiB4aHIuYWJvcnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHhoci5hYm9ydCgpO1xuICAgIH1cbiAgICBzdXBlci51bnN1YnNjcmliZSgpO1xuICB9XG59XG5cbi8qKlxuICogQSBub3JtYWxpemVkIEFKQVggcmVzcG9uc2UuXG4gKlxuICogQHNlZSB7QGxpbmsgYWpheH1cbiAqXG4gKiBAY2xhc3MgQWpheFJlc3BvbnNlXG4gKi9cbmV4cG9ydCBjbGFzcyBBamF4UmVzcG9uc2Uge1xuICAvKiogQHR5cGUge251bWJlcn0gVGhlIEhUVFAgc3RhdHVzIGNvZGUgKi9cbiAgc3RhdHVzOiBudW1iZXI7XG5cbiAgLyoqIEB0eXBlIHtzdHJpbmd8QXJyYXlCdWZmZXJ8RG9jdW1lbnR8b2JqZWN0fGFueX0gVGhlIHJlc3BvbnNlIGRhdGEgKi9cbiAgcmVzcG9uc2U6IGFueTtcblxuICAvKiogQHR5cGUge3N0cmluZ30gVGhlIHJhdyByZXNwb25zZVRleHQgKi9cbiAgcmVzcG9uc2VUZXh0OiBzdHJpbmc7XG5cbiAgLyoqIEB0eXBlIHtzdHJpbmd9IFRoZSByZXNwb25zZVR5cGUgKGUuZy4gJ2pzb24nLCAnYXJyYXlidWZmZXInLCBvciAneG1sJykgKi9cbiAgcmVzcG9uc2VUeXBlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHVibGljIG9yaWdpbmFsRXZlbnQ6IEV2ZW50LCBwdWJsaWMgeGhyOiBYTUxIdHRwUmVxdWVzdCwgcHVibGljIHJlcXVlc3Q6IEFqYXhSZXF1ZXN0KSB7XG4gICAgdGhpcy5zdGF0dXMgPSB4aHIuc3RhdHVzO1xuICAgIHRoaXMucmVzcG9uc2VUeXBlID0geGhyLnJlc3BvbnNlVHlwZSB8fCByZXF1ZXN0LnJlc3BvbnNlVHlwZTtcbiAgICB0aGlzLnJlc3BvbnNlID0gcGFyc2VYaHJSZXNwb25zZSh0aGlzLnJlc3BvbnNlVHlwZSwgeGhyKTtcbiAgfVxufVxuXG5leHBvcnQgdHlwZSBBamF4RXJyb3JOYW1lcyA9ICdBamF4RXJyb3InIHwgJ0FqYXhUaW1lb3V0RXJyb3InO1xuXG4vKipcbiAqIEEgbm9ybWFsaXplZCBBSkFYIGVycm9yLlxuICpcbiAqIEBzZWUge0BsaW5rIGFqYXh9XG4gKlxuICogQGNsYXNzIEFqYXhFcnJvclxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFqYXhFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgLyoqIEB0eXBlIHtYTUxIdHRwUmVxdWVzdH0gVGhlIFhIUiBpbnN0YW5jZSBhc3NvY2lhdGVkIHdpdGggdGhlIGVycm9yICovXG4gIHhocjogWE1MSHR0cFJlcXVlc3Q7XG5cbiAgLyoqIEB0eXBlIHtBamF4UmVxdWVzdH0gVGhlIEFqYXhSZXF1ZXN0IGFzc29jaWF0ZWQgd2l0aCB0aGUgZXJyb3IgKi9cbiAgcmVxdWVzdDogQWpheFJlcXVlc3Q7XG5cbiAgLyoqIEB0eXBlIHtudW1iZXJ9IFRoZSBIVFRQIHN0YXR1cyBjb2RlICovXG4gIHN0YXR1czogbnVtYmVyO1xuXG4gIC8qKiBAdHlwZSB7c3RyaW5nfSBUaGUgcmVzcG9uc2VUeXBlIChlLmcuICdqc29uJywgJ2FycmF5YnVmZmVyJywgb3IgJ3htbCcpICovXG4gIHJlc3BvbnNlVHlwZTogc3RyaW5nO1xuXG4gIC8qKiBAdHlwZSB7c3RyaW5nfEFycmF5QnVmZmVyfERvY3VtZW50fG9iamVjdHxhbnl9IFRoZSByZXNwb25zZSBkYXRhICovXG4gIHJlc3BvbnNlOiBhbnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQWpheEVycm9yQ3RvciB7XG4gIG5ldyhtZXNzYWdlOiBzdHJpbmcsIHhocjogWE1MSHR0cFJlcXVlc3QsIHJlcXVlc3Q6IEFqYXhSZXF1ZXN0KTogQWpheEVycm9yO1xufVxuXG5mdW5jdGlvbiBBamF4RXJyb3JJbXBsKHRoaXM6IGFueSwgbWVzc2FnZTogc3RyaW5nLCB4aHI6IFhNTEh0dHBSZXF1ZXN0LCByZXF1ZXN0OiBBamF4UmVxdWVzdCk6IEFqYXhFcnJvciB7XG4gIEVycm9yLmNhbGwodGhpcyk7XG4gIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gIHRoaXMubmFtZSA9ICdBamF4RXJyb3InO1xuICB0aGlzLnhociA9IHhocjtcbiAgdGhpcy5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgdGhpcy5zdGF0dXMgPSB4aHIuc3RhdHVzO1xuICB0aGlzLnJlc3BvbnNlVHlwZSA9IHhoci5yZXNwb25zZVR5cGUgfHwgcmVxdWVzdC5yZXNwb25zZVR5cGU7XG4gIHRoaXMucmVzcG9uc2UgPSBwYXJzZVhoclJlc3BvbnNlKHRoaXMucmVzcG9uc2VUeXBlLCB4aHIpO1xuICByZXR1cm4gdGhpcztcbn1cblxuQWpheEVycm9ySW1wbC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XG5cbmV4cG9ydCBjb25zdCBBamF4RXJyb3I6IEFqYXhFcnJvckN0b3IgPSBBamF4RXJyb3JJbXBsIGFzIGFueTtcblxuZnVuY3Rpb24gcGFyc2VKc29uKHhocjogWE1MSHR0cFJlcXVlc3QpIHtcbiAgLy8gSEFDSyhiZW5sZXNoKTogVHlwZVNjcmlwdCBzaGVubmFuaWdhbnNcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueSBYTUxIdHRwUmVxdWVzdCBpcyBkZWZpbmVkIHRvIGFsd2F5cyBoYXZlICdyZXNwb25zZScgaW5mZXJyaW5nIHhociBhcyBuZXZlciBmb3IgdGhlIGVsc2UgY2xhdXNlLlxuICBpZiAoJ3Jlc3BvbnNlJyBpbiAoeGhyIGFzIGFueSkpIHtcbiAgICAvL0lFIGRvZXMgbm90IHN1cHBvcnQganNvbiBhcyByZXNwb25zZVR5cGUsIHBhcnNlIGl0IGludGVybmFsbHlcbiAgICByZXR1cm4geGhyLnJlc3BvbnNlVHlwZSA/IHhoci5yZXNwb25zZSA6IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlIHx8IHhoci5yZXNwb25zZVRleHQgfHwgJ251bGwnKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZSgoeGhyIGFzIGFueSkucmVzcG9uc2VUZXh0IHx8ICdudWxsJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VYaHJSZXNwb25zZShyZXNwb25zZVR5cGU6IHN0cmluZywgeGhyOiBYTUxIdHRwUmVxdWVzdCkge1xuICBzd2l0Y2ggKHJlc3BvbnNlVHlwZSkge1xuICAgIGNhc2UgJ2pzb24nOlxuICAgICAgICByZXR1cm4gdHJ5Q2F0Y2gocGFyc2VKc29uKSh4aHIpO1xuICAgICAgY2FzZSAneG1sJzpcbiAgICAgICAgcmV0dXJuIHhoci5yZXNwb25zZVhNTDtcbiAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAvLyBIQUNLKGJlbmxlc2gpOiBUeXBlU2NyaXB0IHNoZW5uYW5pZ2Fuc1xuICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnkgWE1MSHR0cFJlcXVlc3QgaXMgZGVmaW5lZCB0byBhbHdheXMgaGF2ZSAncmVzcG9uc2UnIGluZmVycmluZyB4aHIgYXMgbmV2ZXIgZm9yIHRoZSBlbHNlIHN1Yi1leHByZXNzaW9uLlxuICAgICAgICAgIHJldHVybiAgKCdyZXNwb25zZScgaW4gKHhociBhcyBhbnkpKSA/IHhoci5yZXNwb25zZSA6IHhoci5yZXNwb25zZVRleHQ7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBBamF4VGltZW91dEVycm9yIGV4dGVuZHMgQWpheEVycm9yIHtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBamF4VGltZW91dEVycm9yQ3RvciB7XG4gIG5ldyh4aHI6IFhNTEh0dHBSZXF1ZXN0LCByZXF1ZXN0OiBBamF4UmVxdWVzdCk6IEFqYXhUaW1lb3V0RXJyb3I7XG59XG5cbmZ1bmN0aW9uIEFqYXhUaW1lb3V0RXJyb3JJbXBsKHRoaXM6IGFueSwgeGhyOiBYTUxIdHRwUmVxdWVzdCwgcmVxdWVzdDogQWpheFJlcXVlc3QpIHtcbiAgQWpheEVycm9yLmNhbGwodGhpcywgJ2FqYXggdGltZW91dCcsIHhociwgcmVxdWVzdCk7XG4gIHRoaXMubmFtZSA9ICdBamF4VGltZW91dEVycm9yJztcbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogQHNlZSB7QGxpbmsgYWpheH1cbiAqXG4gKiBAY2xhc3MgQWpheFRpbWVvdXRFcnJvclxuICovXG5leHBvcnQgY29uc3QgQWpheFRpbWVvdXRFcnJvcjogQWpheFRpbWVvdXRFcnJvckN0b3IgPSBBamF4VGltZW91dEVycm9ySW1wbCBhcyBhbnk7XG4iXX0=