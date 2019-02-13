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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWpheE9ic2VydmFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29ic2VydmFibGUvZG9tL0FqYXhPYnNlcnZhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHdDQUF1QztBQUN2QyxnREFBK0M7QUFDL0Msc0RBQXFEO0FBQ3JELCtDQUE4QztBQUM5QywrQ0FBOEM7QUFFOUMsMkNBQTBDO0FBbUIxQyxTQUFTLGNBQWM7SUFDckIsSUFBSSxXQUFJLENBQUMsY0FBYyxFQUFFO1FBQ3ZCLE9BQU8sSUFBSSxXQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7S0FDbEM7U0FBTSxJQUFJLENBQUMsQ0FBQyxXQUFJLENBQUMsY0FBYyxFQUFFO1FBQ2hDLE9BQU8sSUFBSSxXQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7S0FDbEM7U0FBTTtRQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQztLQUMxRDtBQUNILENBQUM7QUFFRCxTQUFTLGlCQUFpQjtJQUN4QixJQUFJLFdBQUksQ0FBQyxjQUFjLEVBQUU7UUFDdkIsT0FBTyxJQUFJLFdBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztLQUNsQztTQUFNO1FBQ0wsSUFBSSxNQUFNLFNBQVEsQ0FBQztRQUNuQixJQUFJO1lBQ0YsSUFBTSxPQUFPLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxtQkFBbUIsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1lBQzlFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxF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Q0gsQ0FBQztBQUVELFNBQVMsZ0JBQWdCLENBQUMsWUFBb0IsRUFBRSxHQUFtQjtJQUNqRSxRQUFRLFlBQVksRUFBRTtRQUNwQixLQUFLLE1BQU07WUFDUCxPQUFPLG1CQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEMsS0FBSyxLQUFLO1lBQ1IsT0FBTyxHQUFHLENBQUMsV0FBVyxDQUFDO1FBQ3pCLEtBQUssTUFBTSxDQUFDO1FBQ1o7WUFDSSx5Q0FBeUM7WUFDekMsMElBQTBJO1lBQzFJLE9BQVEsQ0FBQyxVQUFVLElBQUssR0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUM7S0FDOUU7QUFDSCxDQUFDO0FBU0QsU0FBUyxvQkFBb0IsQ0FBWSxHQUFtQixFQUFFLE9BQW9CO0lBQ2hGLGlCQUFTLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ25ELElBQUksQ0FBQyxJQUFJLEdBQUcsa0JBQWtCLENBQUM7SUFDL0IsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQ7Ozs7R0FJRztBQUNVLFFBQUEsZ0JBQWdCLEdBQXlCLG9CQUEyQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcm9vdCB9IGZyb20gJy4uLy4uL3V0aWwvcm9vdCc7XG5pbXBvcnQgeyB0cnlDYXRjaCB9IGZyb20gJy4uLy4uL3V0aWwvdHJ5Q2F0Y2gnO1xuaW1wb3J0IHsgZXJyb3JPYmplY3QgfSBmcm9tICcuLi8uLi91dGlsL2Vycm9yT2JqZWN0JztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi8uLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi8uLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi8uLi90eXBlcyc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICcuLi8uLi9vcGVyYXRvcnMvbWFwJztcblxuZXhwb3J0IGludGVyZmFjZSBBamF4UmVxdWVzdCB7XG4gIHVybD86IHN0cmluZztcbiAgYm9keT86IGFueTtcbiAgdXNlcj86IHN0cmluZztcbiAgYXN5bmM/OiBib29sZWFuO1xuICBtZXRob2Q/OiBzdHJpbmc7XG4gIGhlYWRlcnM/OiBPYmplY3Q7XG4gIHRpbWVvdXQ/OiBudW1iZXI7XG4gIHBhc3N3b3JkPzogc3RyaW5nO1xuICBoYXNDb250ZW50PzogYm9vbGVhbjtcbiAgY3Jvc3NEb21haW4/OiBib29sZWFuO1xuICB3aXRoQ3JlZGVudGlhbHM/OiBib29sZWFuO1xuICBjcmVhdGVYSFI/OiAoKSA9PiBYTUxIdHRwUmVxdWVzdDtcbiAgcHJvZ3Jlc3NTdWJzY3JpYmVyPzogU3Vic2NyaWJlcjxhbnk+O1xuICByZXNwb25zZVR5cGU/OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGdldENPUlNSZXF1ZXN0KCk6IFhNTEh0dHBSZXF1ZXN0IHtcbiAgaWYgKHJvb3QuWE1MSHR0cFJlcXVlc3QpIHtcbiAgICByZXR1cm4gbmV3IHJvb3QuWE1MSHR0cFJlcXVlc3QoKTtcbiAgfSBlbHNlIGlmICghIXJvb3QuWERvbWFpblJlcXVlc3QpIHtcbiAgICByZXR1cm4gbmV3IHJvb3QuWERvbWFpblJlcXVlc3QoKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NPUlMgaXMgbm90IHN1cHBvcnRlZCBieSB5b3VyIGJyb3dzZXInKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRYTUxIdHRwUmVxdWVzdCgpOiBYTUxIdHRwUmVxdWVzdCB7XG4gIGlmIChyb290LlhNTEh0dHBSZXF1ZXN0KSB7XG4gICAgcmV0dXJuIG5ldyByb290LlhNTEh0dHBSZXF1ZXN0KCk7XG4gIH0gZWxzZSB7XG4gICAgbGV0IHByb2dJZDogc3RyaW5nO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBwcm9nSWRzID0gWydNc3htbDIuWE1MSFRUUCcsICdNaWNyb3NvZnQuWE1MSFRUUCcsICdNc3htbDIuWE1MSFRUUC40LjAnXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcHJvZ0lkID0gcHJvZ0lkc1tpXTtcbiAgICAgICAgICBpZiAobmV3IHJvb3QuQWN0aXZlWE9iamVjdChwcm9nSWQpKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAvL3N1cHByZXNzIGV4Y2VwdGlvbnNcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyByb290LkFjdGl2ZVhPYmplY3QocHJvZ0lkKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1hNTEh0dHBSZXF1ZXN0IGlzIG5vdCBzdXBwb3J0ZWQgYnkgeW91ciBicm93c2VyJyk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQWpheENyZWF0aW9uTWV0aG9kIHtcbiAgKHVybE9yUmVxdWVzdDogc3RyaW5nIHwgQWpheFJlcXVlc3QpOiBPYnNlcnZhYmxlPEFqYXhSZXNwb25zZT47XG4gIGdldCh1cmw6IHN0cmluZywgaGVhZGVycz86IE9iamVjdCk6IE9ic2VydmFibGU8QWpheFJlc3BvbnNlPjtcbiAgcG9zdCh1cmw6IHN0cmluZywgYm9keT86IGFueSwgaGVhZGVycz86IE9iamVjdCk6IE9ic2VydmFibGU8QWpheFJlc3BvbnNlPjtcbiAgcHV0KHVybDogc3RyaW5nLCBib2R5PzogYW55LCBoZWFkZXJzPzogT2JqZWN0KTogT2JzZXJ2YWJsZTxBamF4UmVzcG9uc2U+O1xuICBwYXRjaCh1cmw6IHN0cmluZywgYm9keT86IGFueSwgaGVhZGVycz86IE9iamVjdCk6IE9ic2VydmFibGU8QWpheFJlc3BvbnNlPjtcbiAgZGVsZXRlKHVybDogc3RyaW5nLCBoZWFkZXJzPzogT2JqZWN0KTogT2JzZXJ2YWJsZTxBamF4UmVzcG9uc2U+O1xuICBnZXRKU09OPFQ+KHVybDogc3RyaW5nLCBoZWFkZXJzPzogT2JqZWN0KTogT2JzZXJ2YWJsZTxUPjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFqYXhHZXQodXJsOiBzdHJpbmcsIGhlYWRlcnM6IE9iamVjdCA9IG51bGwpIHtcbiAgcmV0dXJuIG5ldyBBamF4T2JzZXJ2YWJsZTxBamF4UmVzcG9uc2U+KHsgbWV0aG9kOiAnR0VUJywgdXJsLCBoZWFkZXJzIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWpheFBvc3QodXJsOiBzdHJpbmcsIGJvZHk/OiBhbnksIGhlYWRlcnM/OiBPYmplY3QpOiBPYnNlcnZhYmxlPEFqYXhSZXNwb25zZT4ge1xuICByZXR1cm4gbmV3IEFqYXhPYnNlcnZhYmxlPEFqYXhSZXNwb25zZT4oeyBtZXRob2Q6ICdQT1NUJywgdXJsLCBib2R5LCBoZWFkZXJzIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWpheERlbGV0ZSh1cmw6IHN0cmluZywgaGVhZGVycz86IE9iamVjdCk6IE9ic2VydmFibGU8QWpheFJlc3BvbnNlPiB7XG4gIHJldHVybiBuZXcgQWpheE9ic2VydmFibGU8QWpheFJlc3BvbnNlPih7IG1ldGhvZDogJ0RFTEVURScsIHVybCwgaGVhZGVycyB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFqYXhQdXQodXJsOiBzdHJpbmcsIGJvZHk/OiBhbnksIGhlYWRlcnM/OiBPYmplY3QpOiBPYnNlcnZhYmxlPEFqYXhSZXNwb25zZT4ge1xuICByZXR1cm4gbmV3IEFqYXhPYnNlcnZhYmxlPEFqYXhSZXNwb25zZT4oeyBtZXRob2Q6ICdQVVQnLCB1cmwsIGJvZHksIGhlYWRlcnMgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhamF4UGF0Y2godXJsOiBzdHJpbmcsIGJvZHk/OiBhbnksIGhlYWRlcnM/OiBPYmplY3QpOiBPYnNlcnZhYmxlPEFqYXhSZXNwb25zZT4ge1xuICByZXR1cm4gbmV3IEFqYXhPYnNlcnZhYmxlPEFqYXhSZXNwb25zZT4oeyBtZXRob2Q6ICdQQVRDSCcsIHVybCwgYm9keSwgaGVhZGVycyB9KTtcbn1cblxuY29uc3QgbWFwUmVzcG9uc2UgPSBtYXAoKHg6IEFqYXhSZXNwb25zZSwgaW5kZXg6IG51bWJlcikgPT4geC5yZXNwb25zZSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBhamF4R2V0SlNPTjxUPih1cmw6IHN0cmluZywgaGVhZGVycz86IE9iamVjdCk6IE9ic2VydmFibGU8VD4ge1xuICByZXR1cm4gbWFwUmVzcG9uc2UoXG4gICAgbmV3IEFqYXhPYnNlcnZhYmxlPEFqYXhSZXNwb25zZT4oe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybCxcbiAgICAgIHJlc3BvbnNlVHlwZTogJ2pzb24nLFxuICAgICAgaGVhZGVyc1xuICAgIH0pXG4gICk7XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICogQGhpZGUgdHJ1ZVxuICovXG5leHBvcnQgY2xhc3MgQWpheE9ic2VydmFibGU8VD4gZXh0ZW5kcyBPYnNlcnZhYmxlPFQ+IHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gb2JzZXJ2YWJsZSBmb3IgYW4gQWpheCByZXF1ZXN0IHdpdGggZWl0aGVyIGEgcmVxdWVzdCBvYmplY3Qgd2l0aFxuICAgKiB1cmwsIGhlYWRlcnMsIGV0YyBvciBhIHN0cmluZyBmb3IgYSBVUkwuXG4gICAqXG4gICAqICMjIEV4YW1wbGVcbiAgICogYGBgamF2YXNjcmlwdFxuICAgKiBzb3VyY2UgPSBSeC5PYnNlcnZhYmxlLmFqYXgoJy9wcm9kdWN0cycpO1xuICAgKiBzb3VyY2UgPSBSeC5PYnNlcnZhYmxlLmFqYXgoeyB1cmw6ICdwcm9kdWN0cycsIG1ldGhvZDogJ0dFVCcgfSk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xPYmplY3R9IHJlcXVlc3QgQ2FuIGJlIG9uZSBvZiB0aGUgZm9sbG93aW5nOlxuICAgKiAgIEEgc3RyaW5nIG9mIHRoZSBVUkwgdG8gbWFrZSB0aGUgQWpheCBjYWxsLlxuICAgKiAgIEFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllc1xuICAgKiAgIC0gdXJsOiBVUkwgb2YgdGhlIHJlcXVlc3RcbiAgICogICAtIGJvZHk6IFRoZSBib2R5IG9mIHRoZSByZXF1ZXN0XG4gICAqICAgLSBtZXRob2Q6IE1ldGhvZCBvZiB0aGUgcmVxdWVzdCwgc3VjaCBhcyBHRVQsIFBPU1QsIFBVVCwgUEFUQ0gsIERFTEVURVxuICAgKiAgIC0gYXN5bmM6IFdoZXRoZXIgdGhlIHJlcXVlc3QgaXMgYXN5bmNcbiAgICogICAtIGhlYWRlcnM6IE9wdGlvbmFsIGhlYWRlcnNcbiAgICogICAtIGNyb3NzRG9tYWluOiB0cnVlIGlmIGEgY3Jvc3MgZG9tYWluIHJlcXVlc3QsIGVsc2UgZmFsc2VcbiAgICogICAtIGNyZWF0ZVhIUjogYSBmdW5jdGlvbiB0byBvdmVycmlkZSBpZiB5b3UgbmVlZCB0byB1c2UgYW4gYWx0ZXJuYXRlXG4gICAqICAgWE1MSHR0cFJlcXVlc3QgaW1wbGVtZW50YXRpb24uXG4gICAqICAgLSByZXN1bHRTZWxlY3RvcjogYSBmdW5jdGlvbiB0byB1c2UgdG8gYWx0ZXIgdGhlIG91dHB1dCB2YWx1ZSB0eXBlIG9mXG4gICAqICAgdGhlIE9ic2VydmFibGUuIEdldHMge0BsaW5rIEFqYXhSZXNwb25zZX0gYXMgYW4gYXJndW1lbnQuXG4gICAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIG9ic2VydmFibGUgc2VxdWVuY2UgY29udGFpbmluZyB0aGUgWE1MSHR0cFJlcXVlc3QuXG4gICAqIEBzdGF0aWMgdHJ1ZVxuICAgKiBAbmFtZSBhamF4XG4gICAqIEBvd25lciBPYnNlcnZhYmxlXG4gICAqIEBub2NvbGxhcHNlXG4gICovXG4gIHN0YXRpYyBjcmVhdGU6IEFqYXhDcmVhdGlvbk1ldGhvZCA9ICgoKSA9PiB7XG4gICAgY29uc3QgY3JlYXRlOiBhbnkgPSAodXJsT3JSZXF1ZXN0OiBzdHJpbmcgfCBBamF4UmVxdWVzdCkgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBBamF4T2JzZXJ2YWJsZSh1cmxPclJlcXVlc3QpO1xuICAgIH07XG5cbiAgICBjcmVhdGUuZ2V0ID0gYWpheEdldDtcbiAgICBjcmVhdGUucG9zdCA9IGFqYXhQb3N0O1xuICAgIGNyZWF0ZS5kZWxldGUgPSBhamF4RGVsZXRlO1xuICAgIGNyZWF0ZS5wdXQgPSBhamF4UHV0O1xuICAgIGNyZWF0ZS5wYXRjaCA9IGFqYXhQYXRjaDtcbiAgICBjcmVhdGUuZ2V0SlNPTiA9IGFqYXhHZXRKU09OO1xuXG4gICAgcmV0dXJuIDxBamF4Q3JlYXRpb25NZXRob2Q+Y3JlYXRlO1xuICB9KSgpO1xuXG4gIHByaXZhdGUgcmVxdWVzdDogQWpheFJlcXVlc3Q7XG5cbiAgY29uc3RydWN0b3IodXJsT3JSZXF1ZXN0OiBzdHJpbmcgfCBBamF4UmVxdWVzdCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBjb25zdCByZXF1ZXN0OiBBamF4UmVxdWVzdCA9IHtcbiAgICAgIGFzeW5jOiB0cnVlLFxuICAgICAgY3JlYXRlWEhSOiBmdW5jdGlvbih0aGlzOiBBamF4UmVxdWVzdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jcm9zc0RvbWFpbiA/IGdldENPUlNSZXF1ZXN0KCkgOiBnZXRYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgfSxcbiAgICAgIGNyb3NzRG9tYWluOiB0cnVlLFxuICAgICAgd2l0aENyZWRlbnRpYWxzOiBmYWxzZSxcbiAgICAgIGhlYWRlcnM6IHt9LFxuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHJlc3BvbnNlVHlwZTogJ2pzb24nLFxuICAgICAgdGltZW91dDogMFxuICAgIH07XG5cbiAgICBpZiAodHlwZW9mIHVybE9yUmVxdWVzdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJlcXVlc3QudXJsID0gdXJsT3JSZXF1ZXN0O1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGNvbnN0IHByb3AgaW4gdXJsT3JSZXF1ZXN0KSB7XG4gICAgICAgIGlmICh1cmxPclJlcXVlc3QuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICByZXF1ZXN0W3Byb3BdID0gdXJsT3JSZXF1ZXN0W3Byb3BdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3N1YnNjcmliZShzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgcmV0dXJuIG5ldyBBamF4U3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLnJlcXVlc3QpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5leHBvcnQgY2xhc3MgQWpheFN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPEV2ZW50PiB7XG4gIHByaXZhdGUgeGhyOiBYTUxIdHRwUmVxdWVzdDtcbiAgcHJpdmF0ZSBkb25lOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VD4sIHB1YmxpYyByZXF1ZXN0OiBBamF4UmVxdWVzdCkge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcblxuICAgIGNvbnN0IGhlYWRlcnMgPSByZXF1ZXN0LmhlYWRlcnMgPSByZXF1ZXN0LmhlYWRlcnMgfHwge307XG5cbiAgICAvLyBmb3JjZSBDT1JTIGlmIHJlcXVlc3RlZFxuICAgIGlmICghcmVxdWVzdC5jcm9zc0RvbWFpbiAmJiAhaGVhZGVyc1snWC1SZXF1ZXN0ZWQtV2l0aCddKSB7XG4gICAgICBoZWFkZXJzWydYLVJlcXVlc3RlZC1XaXRoJ10gPSAnWE1MSHR0cFJlcXVlc3QnO1xuICAgIH1cblxuICAgIC8vIGVuc3VyZSBjb250ZW50IHR5cGUgaXMgc2V0XG4gICAgaWYgKCEoJ0NvbnRlbnQtVHlwZScgaW4gaGVhZGVycykgJiYgIShyb290LkZvcm1EYXRhICYmIHJlcXVlc3QuYm9keSBpbnN0YW5jZW9mIHJvb3QuRm9ybURhdGEpICYmIHR5cGVvZiByZXF1ZXN0LmJvZHkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLTgnO1xuICAgIH1cblxuICAgIC8vIHByb3Blcmx5IHNlcmlhbGl6ZSBib2R5XG4gICAgcmVxdWVzdC5ib2R5ID0gdGhpcy5zZXJpYWxpemVCb2R5KHJlcXVlc3QuYm9keSwgcmVxdWVzdC5oZWFkZXJzWydDb250ZW50LVR5cGUnXSk7XG5cbiAgICB0aGlzLnNlbmQoKTtcbiAgfVxuXG4gIG5leHQoZTogRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLmRvbmUgPSB0cnVlO1xuICAgIGNvbnN0IHsgeGhyLCByZXF1ZXN0LCBkZXN0aW5hdGlvbiB9ID0gdGhpcztcbiAgICBjb25zdCByZXNwb25zZSA9IG5ldyBBamF4UmVzcG9uc2UoZSwgeGhyLCByZXF1ZXN0KTtcbiAgICBpZiAocmVzcG9uc2UucmVzcG9uc2UgPT09IGVycm9yT2JqZWN0KSB7XG4gICAgICBkZXN0aW5hdGlvbi5lcnJvcihlcnJvck9iamVjdC5lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVzdGluYXRpb24ubmV4dChyZXNwb25zZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZW5kKCk6IFhNTEh0dHBSZXF1ZXN0IHtcbiAgICBjb25zdCB7XG4gICAgICByZXF1ZXN0LFxuICAgICAgcmVxdWVzdDogeyB1c2VyLCBtZXRob2QsIHVybCwgYXN5bmMsIHBhc3N3b3JkLCBoZWFkZXJzLCBib2R5IH1cbiAgICB9ID0gdGhpcztcbiAgICBjb25zdCBjcmVhdGVYSFIgPSByZXF1ZXN0LmNyZWF0ZVhIUjtcbiAgICBjb25zdCB4aHI6IFhNTEh0dHBSZXF1ZXN0ID0gdHJ5Q2F0Y2goY3JlYXRlWEhSKS5jYWxsKHJlcXVlc3QpO1xuXG4gICAgaWYgKDxhbnk+eGhyID09PSBlcnJvck9iamVjdCkge1xuICAgICAgdGhpcy5lcnJvcihlcnJvck9iamVjdC5lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy54aHIgPSB4aHI7XG5cbiAgICAgIC8vIHNldCB1cCB0aGUgZXZlbnRzIGJlZm9yZSBvcGVuIFhIUlxuICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vZG9jcy9XZWIvQVBJL1hNTEh0dHBSZXF1ZXN0L1VzaW5nX1hNTEh0dHBSZXF1ZXN0XG4gICAgICAvLyBZb3UgbmVlZCB0byBhZGQgdGhlIGV2ZW50IGxpc3RlbmVycyBiZWZvcmUgY2FsbGluZyBvcGVuKCkgb24gdGhlIHJlcXVlc3QuXG4gICAgICAvLyBPdGhlcndpc2UgdGhlIHByb2dyZXNzIGV2ZW50cyB3aWxsIG5vdCBmaXJlLlxuICAgICAgdGhpcy5zZXR1cEV2ZW50cyh4aHIsIHJlcXVlc3QpO1xuICAgICAgLy8gb3BlbiBYSFJcbiAgICAgIGxldCByZXN1bHQ6IGFueTtcbiAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgIHJlc3VsdCA9IHRyeUNhdGNoKHhoci5vcGVuKS5jYWxsKHhociwgbWV0aG9kLCB1cmwsIGFzeW5jLCB1c2VyLCBwYXNzd29yZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQgPSB0cnlDYXRjaCh4aHIub3BlbikuY2FsbCh4aHIsIG1ldGhvZCwgdXJsLCBhc3luYyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXN1bHQgPT09IGVycm9yT2JqZWN0KSB7XG4gICAgICAgIHRoaXMuZXJyb3IoZXJyb3JPYmplY3QuZSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICAvLyB0aW1lb3V0LCByZXNwb25zZVR5cGUgYW5kIHdpdGhDcmVkZW50aWFscyBjYW4gYmUgc2V0IG9uY2UgdGhlIFhIUiBpcyBvcGVuXG4gICAgICBpZiAoYXN5bmMpIHtcbiAgICAgICAgeGhyLnRpbWVvdXQgPSByZXF1ZXN0LnRpbWVvdXQ7XG4gICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSByZXF1ZXN0LnJlc3BvbnNlVHlwZSBhcyBhbnk7XG4gICAgICB9XG5cbiAgICAgIGlmICgnd2l0aENyZWRlbnRpYWxzJyBpbiB4aHIpIHtcbiAgICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9ICEhcmVxdWVzdC53aXRoQ3JlZGVudGlhbHM7XG4gICAgICB9XG5cbiAgICAgIC8vIHNldCBoZWFkZXJzXG4gICAgICB0aGlzLnNldEhlYWRlcnMoeGhyLCBoZWFkZXJzKTtcblxuICAgICAgLy8gZmluYWxseSBzZW5kIHRoZSByZXF1ZXN0XG4gICAgICByZXN1bHQgPSBib2R5ID8gdHJ5Q2F0Y2goeGhyLnNlbmQpLmNhbGwoeGhyLCBib2R5KSA6IHRyeUNhdGNoKHhoci5zZW5kKS5jYWxsKHhocik7XG4gICAgICBpZiAocmVzdWx0ID09PSBlcnJvck9iamVjdCkge1xuICAgICAgICB0aGlzLmVycm9yKGVycm9yT2JqZWN0LmUpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4geGhyO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXJpYWxpemVCb2R5KGJvZHk6IGFueSwgY29udGVudFR5cGU/OiBzdHJpbmcpIHtcbiAgICBpZiAoIWJvZHkgfHwgdHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gYm9keTtcbiAgICB9IGVsc2UgaWYgKHJvb3QuRm9ybURhdGEgJiYgYm9keSBpbnN0YW5jZW9mIHJvb3QuRm9ybURhdGEpIHtcbiAgICAgIHJldHVybiBib2R5O1xuICAgIH1cblxuICAgIGlmIChjb250ZW50VHlwZSkge1xuICAgICAgY29uc3Qgc3BsaXRJbmRleCA9IGNvbnRlbnRUeXBlLmluZGV4T2YoJzsnKTtcbiAgICAgIGlmIChzcGxpdEluZGV4ICE9PSAtMSkge1xuICAgICAgICBjb250ZW50VHlwZSA9IGNvbnRlbnRUeXBlLnN1YnN0cmluZygwLCBzcGxpdEluZGV4KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzd2l0Y2ggKGNvbnRlbnRUeXBlKSB7XG4gICAgICBjYXNlICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnOlxuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMoYm9keSkubWFwKGtleSA9PiBgJHtlbmNvZGVVUklDb21wb25lbnQoa2V5KX09JHtlbmNvZGVVUklDb21wb25lbnQoYm9keVtrZXldKX1gKS5qb2luKCcmJyk7XG4gICAgICBjYXNlICdhcHBsaWNhdGlvbi9qc29uJzpcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGJvZHkpO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGJvZHk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXRIZWFkZXJzKHhocjogWE1MSHR0cFJlcXVlc3QsIGhlYWRlcnM6IE9iamVjdCkge1xuICAgIGZvciAobGV0IGtleSBpbiBoZWFkZXJzKSB7XG4gICAgICBpZiAoaGVhZGVycy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgaGVhZGVyc1trZXldKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNldHVwRXZlbnRzKHhocjogWE1MSHR0cFJlcXVlc3QsIHJlcXVlc3Q6IEFqYXhSZXF1ZXN0KSB7XG4gICAgY29uc3QgcHJvZ3Jlc3NTdWJzY3JpYmVyID0gcmVxdWVzdC5wcm9ncmVzc1N1YnNjcmliZXI7XG5cbiAgICBmdW5jdGlvbiB4aHJUaW1lb3V0KHRoaXM6IFhNTEh0dHBSZXF1ZXN0LCBlOiBQcm9ncmVzc0V2ZW50KSB7XG4gICAgICBjb25zdCB7c3Vic2NyaWJlciwgcHJvZ3Jlc3NTdWJzY3JpYmVyLCByZXF1ZXN0IH0gPSAoPGFueT54aHJUaW1lb3V0KTtcbiAgICAgIGlmIChwcm9ncmVzc1N1YnNjcmliZXIpIHtcbiAgICAgICAgcHJvZ3Jlc3NTdWJzY3JpYmVyLmVycm9yKGUpO1xuICAgICAgfVxuICAgICAgY29uc3QgYWpheFRpbWVvdXRFcnJvciA9IG5ldyBBamF4VGltZW91dEVycm9yKHRoaXMsIHJlcXVlc3QpOyAvL1RPRE86IE1ha2UgYmV0dGVyZXIuXG4gICAgICBpZiAoYWpheFRpbWVvdXRFcnJvci5yZXNwb25zZSA9PT0gZXJyb3JPYmplY3QpIHtcbiAgICAgICAgc3Vic2NyaWJlci5lcnJvcihlcnJvck9iamVjdC5lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN1YnNjcmliZXIuZXJyb3IoYWpheFRpbWVvdXRFcnJvcik7XG4gICAgICB9XG4gICAgfVxuICAgIHhoci5vbnRpbWVvdXQgPSB4aHJUaW1lb3V0O1xuICAgICg8YW55PnhoclRpbWVvdXQpLnJlcXVlc3QgPSByZXF1ZXN0O1xuICAgICg8YW55PnhoclRpbWVvdXQpLnN1YnNjcmliZXIgPSB0aGlzO1xuICAgICg8YW55PnhoclRpbWVvdXQpLnByb2dyZXNzU3Vic2NyaWJlciA9IHByb2dyZXNzU3Vic2NyaWJlcjtcbiAgICBpZiAoeGhyLnVwbG9hZCAmJiAnd2l0aENyZWRlbnRpYWxzJyBpbiB4aHIpIHtcbiAgICAgIGlmIChwcm9ncmVzc1N1YnNjcmliZXIpIHtcbiAgICAgICAgbGV0IHhoclByb2dyZXNzOiAoZTogUHJvZ3Jlc3NFdmVudCkgPT4gdm9pZDtcbiAgICAgICAgeGhyUHJvZ3Jlc3MgPSBmdW5jdGlvbihlOiBQcm9ncmVzc0V2ZW50KSB7XG4gICAgICAgICAgY29uc3QgeyBwcm9ncmVzc1N1YnNjcmliZXIgfSA9ICg8YW55PnhoclByb2dyZXNzKTtcbiAgICAgICAgICBwcm9ncmVzc1N1YnNjcmliZXIubmV4dChlKTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHJvb3QuWERvbWFpblJlcXVlc3QpIHtcbiAgICAgICAgICB4aHIub25wcm9ncmVzcyA9IHhoclByb2dyZXNzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHhoci51cGxvYWQub25wcm9ncmVzcyA9IHhoclByb2dyZXNzO1xuICAgICAgICB9XG4gICAgICAgICg8YW55PnhoclByb2dyZXNzKS5wcm9ncmVzc1N1YnNjcmliZXIgPSBwcm9ncmVzc1N1YnNjcmliZXI7XG4gICAgICB9XG4gICAgICBsZXQgeGhyRXJyb3I6IChlOiBhbnkpID0+IHZvaWQ7XG4gICAgICB4aHJFcnJvciA9IGZ1bmN0aW9uKHRoaXM6IFhNTEh0dHBSZXF1ZXN0LCBlOiBFcnJvckV2ZW50KSB7XG4gICAgICAgIGNvbnN0IHsgcHJvZ3Jlc3NTdWJzY3JpYmVyLCBzdWJzY3JpYmVyLCByZXF1ZXN0IH0gPSAoPGFueT54aHJFcnJvcik7XG4gICAgICAgIGlmIChwcm9ncmVzc1N1YnNjcmliZXIpIHtcbiAgICAgICAgICBwcm9ncmVzc1N1YnNjcmliZXIuZXJyb3IoZSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYWpheEVycm9yID0gbmV3IEFqYXhFcnJvcignYWpheCBlcnJvcicsIHRoaXMsIHJlcXVlc3QpO1xuICAgICAgICBpZiAoYWpheEVycm9yLnJlc3BvbnNlID09PSBlcnJvck9iamVjdCkge1xuICAgICAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyb3JPYmplY3QuZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3Vic2NyaWJlci5lcnJvcihhamF4RXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgeGhyLm9uZXJyb3IgPSB4aHJFcnJvcjtcbiAgICAgICg8YW55PnhockVycm9yKS5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgICAgICg8YW55PnhockVycm9yKS5zdWJzY3JpYmVyID0gdGhpcztcbiAgICAgICg8YW55PnhockVycm9yKS5wcm9ncmVzc1N1YnNjcmliZXIgPSBwcm9ncmVzc1N1YnNjcmliZXI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24geGhyUmVhZHlTdGF0ZUNoYW5nZSh0aGlzOiBYTUxIdHRwUmVxdWVzdCwgZTogRXZlbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IHhoclJlYWR5U3RhdGVDaGFuZ2U7XG4gICAgKDxhbnk+eGhyUmVhZHlTdGF0ZUNoYW5nZSkuc3Vic2NyaWJlciA9IHRoaXM7XG4gICAgKDxhbnk+eGhyUmVhZHlTdGF0ZUNoYW5nZSkucHJvZ3Jlc3NTdWJzY3JpYmVyID0gcHJvZ3Jlc3NTdWJzY3JpYmVyO1xuICAgICg8YW55PnhoclJlYWR5U3RhdGVDaGFuZ2UpLnJlcXVlc3QgPSByZXF1ZXN0O1xuXG4gICAgZnVuY3Rpb24geGhyTG9hZCh0aGlzOiBYTUxIdHRwUmVxdWVzdCwgZTogRXZlbnQpIHtcbiAgICAgIGNvbnN0IHsgc3Vic2NyaWJlciwgcHJvZ3Jlc3NTdWJzY3JpYmVyLCByZXF1ZXN0IH0gPSAoPGFueT54aHJMb2FkKTtcbiAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgLy8gbm9ybWFsaXplIElFOSBidWcgKGh0dHA6Ly9idWdzLmpxdWVyeS5jb20vdGlja2V0LzE0NTApXG4gICAgICAgIGxldCBzdGF0dXM6IG51bWJlciA9IHRoaXMuc3RhdHVzID09PSAxMjIzID8gMjA0IDogdGhpcy5zdGF0dXM7XG4gICAgICAgIGxldCByZXNwb25zZTogYW55ID0gKHRoaXMucmVzcG9uc2VUeXBlID09PSAndGV4dCcgPyAgKFxuICAgICAgICAgIHRoaXMucmVzcG9uc2UgfHwgdGhpcy5yZXNwb25zZVRleHQpIDogdGhpcy5yZXNwb25zZSk7XG5cbiAgICAgICAgLy8gZml4IHN0YXR1cyBjb2RlIHdoZW4gaXQgaXMgMCAoMCBzdGF0dXMgaXMgdW5kb2N1bWVudGVkKS5cbiAgICAgICAgLy8gT2NjdXJzIHdoZW4gYWNjZXNzaW5nIGZpbGUgcmVzb3VyY2VzIG9yIG9uIEFuZHJvaWQgNC4xIHN0b2NrIGJyb3dzZXJcbiAgICAgICAgLy8gd2hpbGUgcmV0cmlldmluZyBmaWxlcyBmcm9tIGFwcGxpY2F0aW9uIGNhY2hlLlxuICAgICAgICBpZiAoc3RhdHVzID09PSAwKSB7XG4gICAgICAgICAgc3RhdHVzID0gcmVzcG9uc2UgPyAyMDAgOiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gNHh4IGFuZCA1eHggc2hvdWxkIGVycm9yIChodHRwczovL3d3dy53My5vcmcvUHJvdG9jb2xzL3JmYzI2MTYvcmZjMjYxNi1zZWMxMC5odG1sKVxuICAgICAgICBpZiAoc3RhdHVzIDwgNDAwKSB7XG4gICAgICAgICAgaWYgKHByb2dyZXNzU3Vic2NyaWJlcikge1xuICAgICAgICAgICAgcHJvZ3Jlc3NTdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHN1YnNjcmliZXIubmV4dChlKTtcbiAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHByb2dyZXNzU3Vic2NyaWJlcikge1xuICAgICAgICAgICAgcHJvZ3Jlc3NTdWJzY3JpYmVyLmVycm9yKGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBhamF4RXJyb3IgPSBuZXcgQWpheEVycm9yKCdhamF4IGVycm9yICcgKyBzdGF0dXMsIHRoaXMsIHJlcXVlc3QpO1xuICAgICAgICAgIGlmIChhamF4RXJyb3IucmVzcG9uc2UgPT09IGVycm9yT2JqZWN0KSB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmVycm9yKGVycm9yT2JqZWN0LmUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmVycm9yKGFqYXhFcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHhoci5vbmxvYWQgPSB4aHJMb2FkO1xuICAgICg8YW55PnhockxvYWQpLnN1YnNjcmliZXIgPSB0aGlzO1xuICAgICg8YW55PnhockxvYWQpLnByb2dyZXNzU3Vic2NyaWJlciA9IHByb2dyZXNzU3Vic2NyaWJlcjtcbiAgICAoPGFueT54aHJMb2FkKS5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgfVxuXG4gIHVuc3Vic2NyaWJlKCkge1xuICAgIGNvbnN0IHsgZG9uZSwgeGhyIH0gPSB0aGlzO1xuICAgIGlmICghZG9uZSAmJiB4aHIgJiYgeGhyLnJlYWR5U3RhdGUgIT09IDQgJiYgdHlwZW9mIHhoci5hYm9ydCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgeGhyLmFib3J0KCk7XG4gICAgfVxuICAgIHN1cGVyLnVuc3Vic2NyaWJlKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBBIG5vcm1hbGl6ZWQgQUpBWCByZXNwb25zZS5cbiAqXG4gKiBAc2VlIHtAbGluayBhamF4fVxuICpcbiAqIEBjbGFzcyBBamF4UmVzcG9uc2VcbiAqL1xuZXhwb3J0IGNsYXNzIEFqYXhSZXNwb25zZSB7XG4gIC8qKiBAdHlwZSB7bnVtYmVyfSBUaGUgSFRUUCBzdGF0dXMgY29kZSAqL1xuICBzdGF0dXM6IG51bWJlcjtcblxuICAvKiogQHR5cGUge3N0cmluZ3xBcnJheUJ1ZmZlcnxEb2N1bWVudHxvYmplY3R8YW55fSBUaGUgcmVzcG9uc2UgZGF0YSAqL1xuICByZXNwb25zZTogYW55O1xuXG4gIC8qKiBAdHlwZSB7c3RyaW5nfSBUaGUgcmF3IHJlc3BvbnNlVGV4dCAqL1xuICByZXNwb25zZVRleHQ6IHN0cmluZztcblxuICAvKiogQHR5cGUge3N0cmluZ30gVGhlIHJlc3BvbnNlVHlwZSAoZS5nLiAnanNvbicsICdhcnJheWJ1ZmZlcicsIG9yICd4bWwnKSAqL1xuICByZXNwb25zZVR5cGU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgb3JpZ2luYWxFdmVudDogRXZlbnQsIHB1YmxpYyB4aHI6IFhNTEh0dHBSZXF1ZXN0LCBwdWJsaWMgcmVxdWVzdDogQWpheFJlcXVlc3QpIHtcbiAgICB0aGlzLnN0YXR1cyA9IHhoci5zdGF0dXM7XG4gICAgdGhpcy5yZXNwb25zZVR5cGUgPSB4aHIucmVzcG9uc2VUeXBlIHx8IHJlcXVlc3QucmVzcG9uc2VUeXBlO1xuICAgIHRoaXMucmVzcG9uc2UgPSBwYXJzZVhoclJlc3BvbnNlKHRoaXMucmVzcG9uc2VUeXBlLCB4aHIpO1xuICB9XG59XG5cbmV4cG9ydCB0eXBlIEFqYXhFcnJvck5hbWVzID0gJ0FqYXhFcnJvcicgfCAnQWpheFRpbWVvdXRFcnJvcic7XG5cbi8qKlxuICogQSBub3JtYWxpemVkIEFKQVggZXJyb3IuXG4gKlxuICogQHNlZSB7QGxpbmsgYWpheH1cbiAqXG4gKiBAY2xhc3MgQWpheEVycm9yXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWpheEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAvKiogQHR5cGUge1hNTEh0dHBSZXF1ZXN0fSBUaGUgWEhSIGluc3RhbmNlIGFzc29jaWF0ZWQgd2l0aCB0aGUgZXJyb3IgKi9cbiAgeGhyOiBYTUxIdHRwUmVxdWVzdDtcblxuICAvKiogQHR5cGUge0FqYXhSZXF1ZXN0fSBUaGUgQWpheFJlcXVlc3QgYXNzb2NpYXRlZCB3aXRoIHRoZSBlcnJvciAqL1xuICByZXF1ZXN0OiBBamF4UmVxdWVzdDtcblxuICAvKiogQHR5cGUge251bWJlcn0gVGhlIEhUVFAgc3RhdHVzIGNvZGUgKi9cbiAgc3RhdHVzOiBudW1iZXI7XG5cbiAgLyoqIEB0eXBlIHtzdHJpbmd9IFRoZSByZXNwb25zZVR5cGUgKGUuZy4gJ2pzb24nLCAnYXJyYXlidWZmZXInLCBvciAneG1sJykgKi9cbiAgcmVzcG9uc2VUeXBlOiBzdHJpbmc7XG5cbiAgLyoqIEB0eXBlIHtzdHJpbmd8QXJyYXlCdWZmZXJ8RG9jdW1lbnR8b2JqZWN0fGFueX0gVGhlIHJlc3BvbnNlIGRhdGEgKi9cbiAgcmVzcG9uc2U6IGFueTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBamF4RXJyb3JDdG9yIHtcbiAgbmV3KG1lc3NhZ2U6IHN0cmluZywgeGhyOiBYTUxIdHRwUmVxdWVzdCwgcmVxdWVzdDogQWpheFJlcXVlc3QpOiBBamF4RXJyb3I7XG59XG5cbmZ1bmN0aW9uIEFqYXhFcnJvckltcGwodGhpczogYW55LCBtZXNzYWdlOiBzdHJpbmcsIHhocjogWE1MSHR0cFJlcXVlc3QsIHJlcXVlc3Q6IEFqYXhSZXF1ZXN0KTogQWpheEVycm9yIHtcbiAgRXJyb3IuY2FsbCh0aGlzKTtcbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgdGhpcy5uYW1lID0gJ0FqYXhFcnJvcic7XG4gIHRoaXMueGhyID0geGhyO1xuICB0aGlzLnJlcXVlc3QgPSByZXF1ZXN0O1xuICB0aGlzLnN0YXR1cyA9IHhoci5zdGF0dXM7XG4gIHRoaXMucmVzcG9uc2VUeXBlID0geGhyLnJlc3BvbnNlVHlwZSB8fCByZXF1ZXN0LnJlc3BvbnNlVHlwZTtcbiAgdGhpcy5yZXNwb25zZSA9IHBhcnNlWGhyUmVzcG9uc2UodGhpcy5yZXNwb25zZVR5cGUsIHhocik7XG4gIHJldHVybiB0aGlzO1xufVxuXG5BamF4RXJyb3JJbXBsLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcblxuZXhwb3J0IGNvbnN0IEFqYXhFcnJvcjogQWpheEVycm9yQ3RvciA9IEFqYXhFcnJvckltcGwgYXMgYW55O1xuXG5mdW5jdGlvbiBwYXJzZUpzb24oeGhyOiBYTUxIdHRwUmVxdWVzdCkge1xuICAvLyBIQUNLKGJlbmxlc2gpOiBUeXBlU2NyaXB0IHNoZW5uYW5pZ2Fuc1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55IFhNTEh0dHBSZXF1ZXN0IGlzIGRlZmluZWQgdG8gYWx3YXlzIGhhdmUgJ3Jlc3BvbnNlJyBpbmZlcnJpbmcgeGhyIGFzIG5ldmVyIGZvciB0aGUgZWxzZSBjbGF1c2UuXG4gIGlmICgncmVzcG9uc2UnIGluICh4aHIgYXMgYW55KSkge1xuICAgIC8vSUUgZG9lcyBub3Qgc3VwcG9ydCBqc29uIGFzIHJlc3BvbnNlVHlwZSwgcGFyc2UgaXQgaW50ZXJuYWxseVxuICAgIHJldHVybiB4aHIucmVzcG9uc2VUeXBlID8geGhyLnJlc3BvbnNlIDogSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UgfHwgeGhyLnJlc3BvbnNlVGV4dCB8fCAnbnVsbCcpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBKU09OLnBhcnNlKCh4aHIgYXMgYW55KS5yZXNwb25zZVRleHQgfHwgJ251bGwnKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZVhoclJlc3BvbnNlKHJlc3BvbnNlVHlwZTogc3RyaW5nLCB4aHI6IFhNTEh0dHBSZXF1ZXN0KSB7XG4gIHN3aXRjaCAocmVzcG9uc2VUeXBlKSB7XG4gICAgY2FzZSAnanNvbic6XG4gICAgICAgIHJldHVybiB0cnlDYXRjaChwYXJzZUpzb24pKHhocik7XG4gICAgICBjYXNlICd4bWwnOlxuICAgICAgICByZXR1cm4geGhyLnJlc3BvbnNlWE1MO1xuICAgICAgY2FzZSAndGV4dCc6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICAgIC8vIEhBQ0soYmVubGVzaCk6IFR5cGVTY3JpcHQgc2hlbm5hbmlnYW5zXG4gICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueSBYTUxIdHRwUmVxdWVzdCBpcyBkZWZpbmVkIHRvIGFsd2F5cyBoYXZlICdyZXNwb25zZScgaW5mZXJyaW5nIHhociBhcyBuZXZlciBmb3IgdGhlIGVsc2Ugc3ViLWV4cHJlc3Npb24uXG4gICAgICAgICAgcmV0dXJuICAoJ3Jlc3BvbnNlJyBpbiAoeGhyIGFzIGFueSkpID8geGhyLnJlc3BvbnNlIDogeGhyLnJlc3BvbnNlVGV4dDtcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFqYXhUaW1lb3V0RXJyb3IgZXh0ZW5kcyBBamF4RXJyb3Ige1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFqYXhUaW1lb3V0RXJyb3JDdG9yIHtcbiAgbmV3KHhocjogWE1MSHR0cFJlcXVlc3QsIHJlcXVlc3Q6IEFqYXhSZXF1ZXN0KTogQWpheFRpbWVvdXRFcnJvcjtcbn1cblxuZnVuY3Rpb24gQWpheFRpbWVvdXRFcnJvckltcGwodGhpczogYW55LCB4aHI6IFhNTEh0dHBSZXF1ZXN0LCByZXF1ZXN0OiBBamF4UmVxdWVzdCkge1xuICBBamF4RXJyb3IuY2FsbCh0aGlzLCAnYWpheCB0aW1lb3V0JywgeGhyLCByZXF1ZXN0KTtcbiAgdGhpcy5uYW1lID0gJ0FqYXhUaW1lb3V0RXJyb3InO1xuICByZXR1cm4gdGhpcztcbn1cblxuLyoqXG4gKiBAc2VlIHtAbGluayBhamF4fVxuICpcbiAqIEBjbGFzcyBBamF4VGltZW91dEVycm9yXG4gKi9cbmV4cG9ydCBjb25zdCBBamF4VGltZW91dEVycm9yOiBBamF4VGltZW91dEVycm9yQ3RvciA9IEFqYXhUaW1lb3V0RXJyb3JJbXBsIGFzIGFueTtcbiJdfQ==