"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebSocketSubject_1 = require("./WebSocketSubject");
/**
 * Wrapper around the w3c-compatible WebSocket object provided by the browser.
 *
 * <span class="informal">{@link Subject} that communicates with a server via WebSocket</span>
 *
 * `webSocket` is a factory function that produces a `WebSocketSubject`,
 * which can be used to make WebSocket connection with an arbitrary endpoint.
 * `webSocket` accepts as an argument either a string with url of WebSocket endpoint, or an
 * {@link WebSocketSubjectConfig} object for providing additional configuration, as
 * well as Observers for tracking lifecycle of WebSocket connection.
 *
 * When `WebSocketSubject` is subscribed, it attempts to make a socket connection,
 * unless there is one made already. This means that many subscribers will always listen
 * on the same socket, thus saving resources. If however, two instances are made of `WebSocketSubject`,
 * even if these two were provided with the same url, they will attempt to make separate
 * connections. When consumer of a `WebSocketSubject` unsubscribes, socket connection is closed,
 * only if there are no more subscribers still listening. If after some time a consumer starts
 * subscribing again, connection is reestablished.
 *
 * Once connection is made, whenever a new message comes from the server, `WebSocketSubject` will emit that
 * message as a value in the stream. By default, a message from the socket is parsed via `JSON.parse`. If you
 * want to customize how deserialization is handled (if at all), you can provide custom `resultSelector`
 * function in {@link WebSocketSubject}. When connection closes, stream will complete, provided it happened without
 * any errors. If at any point (starting, maintaining or closing a connection) there is an error,
 * stream will also error with whatever WebSocket API has thrown.
 *
 * By virtue of being a {@link Subject}, `WebSocketSubject` allows for receiving and sending messages from the server. In order
 * to communicate with a connected endpoint, use `next`, `error` and `complete` methods. `next` sends a value to the server, so bear in mind
 * that this value will not be serialized beforehand. Because of This, `JSON.stringify` will have to be called on a value by hand,
 * before calling `next` with a result. Note also that if at the moment of nexting value
 * there is no socket connection (for example no one is subscribing), those values will be buffered, and sent when connection
 * is finally established. `complete` method closes socket connection. `error` does the same,
 * as well as notifying the server that something went wrong via status code and string with details of what happened.
 * Since status code is required in WebSocket API, `WebSocketSubject` does not allow, like regular `Subject`,
 * arbitrary values being passed to the `error` method. It needs to be called with an object that has `code`
 * property with status code number and optional `reason` property with string describing details
 * of an error.
 *
 * Calling `next` does not affect subscribers of `WebSocketSubject` - they have no
 * information that something was sent to the server (unless of course the server
 * responds somehow to a message). On the other hand, since calling `complete` triggers
 * an attempt to close socket connection. If that connection is closed without any errors, stream will
 * complete, thus notifying all subscribers. And since calling `error` closes
 * socket connection as well, just with a different status code for the server, if closing itself proceeds
 * without errors, subscribed Observable will not error, as one might expect, but complete as usual. In both cases
 * (calling `complete` or `error`), if process of closing socket connection results in some errors, *then* stream
 * will error.
 *
 * **Multiplexing**
 *
 * `WebSocketSubject` has an additional operator, not found in other Subjects. It is called `multiplex` and it is
 * used to simulate opening several socket connections, while in reality maintaining only one.
 * For example, an application has both chat panel and real-time notifications about sport news. Since these are two distinct functions,
 * it would make sense to have two separate connections for each. Perhaps there could even be two separate services with WebSocket
 * endpoints, running on separate machines with only GUI combining them together. Having a socket connection
 * for each functionality could become too resource expensive. It is a common pattern to have single
 * WebSocket endpoint that acts as a gateway for the other services (in this case chat and sport news services).
 * Even though there is a single connection in a client app, having the ability to manipulate streams as if it
 * were two separate sockets is desirable. This eliminates manually registering and unregistering in a gateway for
 * given service and filter out messages of interest. This is exactly what `multiplex` method is for.
 *
 * Method accepts three parameters. First two are functions returning subscription and unsubscription messages
 * respectively. These are messages that will be sent to the server, whenever consumer of resulting Observable
 * subscribes and unsubscribes. Server can use them to verify that some kind of messages should start or stop
 * being forwarded to the client. In case of the above example application, after getting subscription message with proper identifier,
 * gateway server can decide that it should connect to real sport news service and start forwarding messages from it.
 * Note that both messages will be sent as returned by the functions, meaning they will have to be serialized manually, just
 * as messages pushed via `next`. Also bear in mind that these messages will be sent on *every* subscription and
 * unsubscription. This is potentially dangerous, because one consumer of an Observable may unsubscribe and the server
 * might stop sending messages, since it got unsubscription message. This needs to be handled
 * on the server or using {@link publish} on a Observable returned from 'multiplex'.
 *
 * Last argument to `multiplex` is a `messageFilter` function which filters out messages
 * sent by the server to only those that belong to simulated WebSocket stream. For example, server might mark these
 * messages with some kind of string identifier on a message object and `messageFilter` would return `true`
 * if there is such identifier on an object emitted by the socket.
 *
 * Return value of `multiplex` is an Observable with messages incoming from emulated socket connection. Note that this
 * is not a `WebSocketSubject`, so calling `next` or `multiplex` again will fail. For pushing values to the
 * server, use root `WebSocketSubject`.
 *
 * ### Examples
 * #### Listening for messages from the server
 * const subject = Rx.Observable.webSocket('ws://localhost:8081');
 *
 * subject.subscribe(
 *    (msg) => console.log('message received: ' + msg), // Called whenever there is a message from the server.
 *    (err) => console.log(err), // Called if at any point WebSocket API signals some kind of error.
 *    () => console.log('complete') // Called when connection is closed (for whatever reason).
 *  );
 *
 *
 * #### Pushing messages to the server
 * const subject = Rx.Observable.webSocket('ws://localhost:8081');
 *
 * subject.subscribe(); // Note that at least one consumer has to subscribe to
 *                      // the created subject - otherwise "nexted" values will be just
 *                      // buffered and not sent, since no connection was established!
 *
 * subject.next(JSON.stringify({message: 'some message'})); // This will send a message to the server
 *                                                          // once a connection is made.
 *                                                          // Remember to serialize sent value first!
 *
 * subject.complete(); // Closes the connection.
 *
 *
 * subject.error({code: 4000, reason: 'I think our app just broke!'}); // Also closes the connection,
 *                                                                     // but let's the server know that
 *                                                                     // this closing is caused by some error.
 *
 *
 * #### Multiplexing WebSocket
 * const subject = Rx.Observable.webSocket('ws://localhost:8081');
 *
 * const observableA = subject.multiplex(
 *   () => JSON.stringify({subscribe: 'A'}), // When server gets this message, it will start sending messages for 'A'...
 *   () => JSON.stringify({unsubscribe: 'A'}), // ...and when gets this one, it will stop.
 *   message => message.type === 'A' // Server will tag all messages for 'A' with type property.
 * );
 *
 * const observableB = subject.multiplex( // And the same goes for 'B'.
 *   () => JSON.stringify({subscribe: 'B'}),
 *   () => JSON.stringify({unsubscribe: 'B'}),
 *   message => message.type === 'B'
 * );
 *
 * const subA = observableA.subscribe(messageForA => console.log(messageForA));
 * // At this moment WebSocket connection
 * // is established. Server gets '{"subscribe": "A"}'
 * // message and starts sending messages for 'A',
 * // which we log here.
 *
 * const subB = observableB.subscribe(messageForB => console.log(messageForB));
 * // Since we already have a connection,
 * // we just send '{"subscribe": "B"}' message
 * // to the server. It starts sending
 * // messages for 'B', which we log here.
 *
 * subB.unsubscribe();
 * // Message '{"unsubscribe": "B"}' is sent to the
 * // server, which stops sending 'B' messages.
 *
 * subA.unubscribe();
 * // Message '{"unsubscribe": "A"}' makes the server
 * // stop sending messages for 'A'. Since there is
 * // no more subscribers to root Subject, socket
 * // connection closes.
 *
 *
 *
 * @param {string|WebSocketSubjectConfig} urlConfigOrSource The WebSocket endpoint as an url or an object with
 * configuration and additional Observers.
 * @return {WebSocketSubject} Subject which allows to both send and receive messages via WebSocket connection.
 */
function webSocket(urlConfigOrSource) {
    return new WebSocketSubject_1.WebSocketSubject(urlConfigOrSource);
}
exports.webSocket = webSocket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViU29ja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL2RvbS93ZWJTb2NrZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1REFBOEU7QUFFOUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXlKRztBQUNILFNBQWdCLFNBQVMsQ0FBSSxpQkFBcUQ7SUFDaEYsT0FBTyxJQUFJLG1DQUFnQixDQUFJLGlCQUFpQixDQUFDLENBQUM7QUFDcEQsQ0FBQztBQUZELDhCQUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgV2ViU29ja2V0U3ViamVjdCwgV2ViU29ja2V0U3ViamVjdENvbmZpZyB9IGZyb20gJy4vV2ViU29ja2V0U3ViamVjdCc7XG5cbi8qKlxuICogV3JhcHBlciBhcm91bmQgdGhlIHczYy1jb21wYXRpYmxlIFdlYlNvY2tldCBvYmplY3QgcHJvdmlkZWQgYnkgdGhlIGJyb3dzZXIuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPntAbGluayBTdWJqZWN0fSB0aGF0IGNvbW11bmljYXRlcyB3aXRoIGEgc2VydmVyIHZpYSBXZWJTb2NrZXQ8L3NwYW4+XG4gKlxuICogYHdlYlNvY2tldGAgaXMgYSBmYWN0b3J5IGZ1bmN0aW9uIHRoYXQgcHJvZHVjZXMgYSBgV2ViU29ja2V0U3ViamVjdGAsXG4gKiB3aGljaCBjYW4gYmUgdXNlZCB0byBtYWtlIFdlYlNvY2tldCBjb25uZWN0aW9uIHdpdGggYW4gYXJiaXRyYXJ5IGVuZHBvaW50LlxuICogYHdlYlNvY2tldGAgYWNjZXB0cyBhcyBhbiBhcmd1bWVudCBlaXRoZXIgYSBzdHJpbmcgd2l0aCB1cmwgb2YgV2ViU29ja2V0IGVuZHBvaW50LCBvciBhblxuICoge0BsaW5rIFdlYlNvY2tldFN1YmplY3RDb25maWd9IG9iamVjdCBmb3IgcHJvdmlkaW5nIGFkZGl0aW9uYWwgY29uZmlndXJhdGlvbiwgYXNcbiAqIHdlbGwgYXMgT2JzZXJ2ZXJzIGZvciB0cmFja2luZyBsaWZlY3ljbGUgb2YgV2ViU29ja2V0IGNvbm5lY3Rpb24uXG4gKlxuICogV2hlbiBgV2ViU29ja2V0U3ViamVjdGAgaXMgc3Vic2NyaWJlZCwgaXQgYXR0ZW1wdHMgdG8gbWFrZSBhIHNvY2tldCBjb25uZWN0aW9uLFxuICogdW5sZXNzIHRoZXJlIGlzIG9uZSBtYWRlIGFscmVhZHkuIFRoaXMgbWVhbnMgdGhhdCBtYW55IHN1YnNjcmliZXJzIHdpbGwgYWx3YXlzIGxpc3RlblxuICogb24gdGhlIHNhbWUgc29ja2V0LCB0aHVzIHNhdmluZyByZXNvdXJjZXMuIElmIGhvd2V2ZXIsIHR3byBpbnN0YW5jZXMgYXJlIG1hZGUgb2YgYFdlYlNvY2tldFN1YmplY3RgLFxuICogZXZlbiBpZiB0aGVzZSB0d28gd2VyZSBwcm92aWRlZCB3aXRoIHRoZSBzYW1lIHVybCwgdGhleSB3aWxsIGF0dGVtcHQgdG8gbWFrZSBzZXBhcmF0ZVxuICogY29ubmVjdGlvbnMuIFdoZW4gY29uc3VtZXIgb2YgYSBgV2ViU29ja2V0U3ViamVjdGAgdW5zdWJzY3JpYmVzLCBzb2NrZXQgY29ubmVjdGlvbiBpcyBjbG9zZWQsXG4gKiBvbmx5IGlmIHRoZXJlIGFyZSBubyBtb3JlIHN1YnNjcmliZXJzIHN0aWxsIGxpc3RlbmluZy4gSWYgYWZ0ZXIgc29tZSB0aW1lIGEgY29uc3VtZXIgc3RhcnRzXG4gKiBzdWJzY3JpYmluZyBhZ2FpbiwgY29ubmVjdGlvbiBpcyByZWVzdGFibGlzaGVkLlxuICpcbiAqIE9uY2UgY29ubmVjdGlvbiBpcyBtYWRlLCB3aGVuZXZlciBhIG5ldyBtZXNzYWdlIGNvbWVzIGZyb20gdGhlIHNlcnZlciwgYFdlYlNvY2tldFN1YmplY3RgIHdpbGwgZW1pdCB0aGF0XG4gKiBtZXNzYWdlIGFzIGEgdmFsdWUgaW4gdGhlIHN0cmVhbS4gQnkgZGVmYXVsdCwgYSBtZXNzYWdlIGZyb20gdGhlIHNvY2tldCBpcyBwYXJzZWQgdmlhIGBKU09OLnBhcnNlYC4gSWYgeW91XG4gKiB3YW50IHRvIGN1c3RvbWl6ZSBob3cgZGVzZXJpYWxpemF0aW9uIGlzIGhhbmRsZWQgKGlmIGF0IGFsbCksIHlvdSBjYW4gcHJvdmlkZSBjdXN0b20gYHJlc3VsdFNlbGVjdG9yYFxuICogZnVuY3Rpb24gaW4ge0BsaW5rIFdlYlNvY2tldFN1YmplY3R9LiBXaGVuIGNvbm5lY3Rpb24gY2xvc2VzLCBzdHJlYW0gd2lsbCBjb21wbGV0ZSwgcHJvdmlkZWQgaXQgaGFwcGVuZWQgd2l0aG91dFxuICogYW55IGVycm9ycy4gSWYgYXQgYW55IHBvaW50IChzdGFydGluZywgbWFpbnRhaW5pbmcgb3IgY2xvc2luZyBhIGNvbm5lY3Rpb24pIHRoZXJlIGlzIGFuIGVycm9yLFxuICogc3RyZWFtIHdpbGwgYWxzbyBlcnJvciB3aXRoIHdoYXRldmVyIFdlYlNvY2tldCBBUEkgaGFzIHRocm93bi5cbiAqXG4gKiBCeSB2aXJ0dWUgb2YgYmVpbmcgYSB7QGxpbmsgU3ViamVjdH0sIGBXZWJTb2NrZXRTdWJqZWN0YCBhbGxvd3MgZm9yIHJlY2VpdmluZyBhbmQgc2VuZGluZyBtZXNzYWdlcyBmcm9tIHRoZSBzZXJ2ZXIuIEluIG9yZGVyXG4gKiB0byBjb21tdW5pY2F0ZSB3aXRoIGEgY29ubmVjdGVkIGVuZHBvaW50LCB1c2UgYG5leHRgLCBgZXJyb3JgIGFuZCBgY29tcGxldGVgIG1ldGhvZHMuIGBuZXh0YCBzZW5kcyBhIHZhbHVlIHRvIHRoZSBzZXJ2ZXIsIHNvIGJlYXIgaW4gbWluZFxuICogdGhhdCB0aGlzIHZhbHVlIHdpbGwgbm90IGJlIHNlcmlhbGl6ZWQgYmVmb3JlaGFuZC4gQmVjYXVzZSBvZiBUaGlzLCBgSlNPTi5zdHJpbmdpZnlgIHdpbGwgaGF2ZSB0byBiZSBjYWxsZWQgb24gYSB2YWx1ZSBieSBoYW5kLFxuICogYmVmb3JlIGNhbGxpbmcgYG5leHRgIHdpdGggYSByZXN1bHQuIE5vdGUgYWxzbyB0aGF0IGlmIGF0IHRoZSBtb21lbnQgb2YgbmV4dGluZyB2YWx1ZVxuICogdGhlcmUgaXMgbm8gc29ja2V0IGNvbm5lY3Rpb24gKGZvciBleGFtcGxlIG5vIG9uZSBpcyBzdWJzY3JpYmluZyksIHRob3NlIHZhbHVlcyB3aWxsIGJlIGJ1ZmZlcmVkLCBhbmQgc2VudCB3aGVuIGNvbm5lY3Rpb25cbiAqIGlzIGZpbmFsbHkgZXN0YWJsaXNoZWQuIGBjb21wbGV0ZWAgbWV0aG9kIGNsb3NlcyBzb2NrZXQgY29ubmVjdGlvbi4gYGVycm9yYCBkb2VzIHRoZSBzYW1lLFxuICogYXMgd2VsbCBhcyBub3RpZnlpbmcgdGhlIHNlcnZlciB0aGF0IHNvbWV0aGluZyB3ZW50IHdyb25nIHZpYSBzdGF0dXMgY29kZSBhbmQgc3RyaW5nIHdpdGggZGV0YWlscyBvZiB3aGF0IGhhcHBlbmVkLlxuICogU2luY2Ugc3RhdHVzIGNvZGUgaXMgcmVxdWlyZWQgaW4gV2ViU29ja2V0IEFQSSwgYFdlYlNvY2tldFN1YmplY3RgIGRvZXMgbm90IGFsbG93LCBsaWtlIHJlZ3VsYXIgYFN1YmplY3RgLFxuICogYXJiaXRyYXJ5IHZhbHVlcyBiZWluZyBwYXNzZWQgdG8gdGhlIGBlcnJvcmAgbWV0aG9kLiBJdCBuZWVkcyB0byBiZSBjYWxsZWQgd2l0aCBhbiBvYmplY3QgdGhhdCBoYXMgYGNvZGVgXG4gKiBwcm9wZXJ0eSB3aXRoIHN0YXR1cyBjb2RlIG51bWJlciBhbmQgb3B0aW9uYWwgYHJlYXNvbmAgcHJvcGVydHkgd2l0aCBzdHJpbmcgZGVzY3JpYmluZyBkZXRhaWxzXG4gKiBvZiBhbiBlcnJvci5cbiAqXG4gKiBDYWxsaW5nIGBuZXh0YCBkb2VzIG5vdCBhZmZlY3Qgc3Vic2NyaWJlcnMgb2YgYFdlYlNvY2tldFN1YmplY3RgIC0gdGhleSBoYXZlIG5vXG4gKiBpbmZvcm1hdGlvbiB0aGF0IHNvbWV0aGluZyB3YXMgc2VudCB0byB0aGUgc2VydmVyICh1bmxlc3Mgb2YgY291cnNlIHRoZSBzZXJ2ZXJcbiAqIHJlc3BvbmRzIHNvbWVob3cgdG8gYSBtZXNzYWdlKS4gT24gdGhlIG90aGVyIGhhbmQsIHNpbmNlIGNhbGxpbmcgYGNvbXBsZXRlYCB0cmlnZ2Vyc1xuICogYW4gYXR0ZW1wdCB0byBjbG9zZSBzb2NrZXQgY29ubmVjdGlvbi4gSWYgdGhhdCBjb25uZWN0aW9uIGlzIGNsb3NlZCB3aXRob3V0IGFueSBlcnJvcnMsIHN0cmVhbSB3aWxsXG4gKiBjb21wbGV0ZSwgdGh1cyBub3RpZnlpbmcgYWxsIHN1YnNjcmliZXJzLiBBbmQgc2luY2UgY2FsbGluZyBgZXJyb3JgIGNsb3Nlc1xuICogc29ja2V0IGNvbm5lY3Rpb24gYXMgd2VsbCwganVzdCB3aXRoIGEgZGlmZmVyZW50IHN0YXR1cyBjb2RlIGZvciB0aGUgc2VydmVyLCBpZiBjbG9zaW5nIGl0c2VsZiBwcm9jZWVkc1xuICogd2l0aG91dCBlcnJvcnMsIHN1YnNjcmliZWQgT2JzZXJ2YWJsZSB3aWxsIG5vdCBlcnJvciwgYXMgb25lIG1pZ2h0IGV4cGVjdCwgYnV0IGNvbXBsZXRlIGFzIHVzdWFsLiBJbiBib3RoIGNhc2VzXG4gKiAoY2FsbGluZyBgY29tcGxldGVgIG9yIGBlcnJvcmApLCBpZiBwcm9jZXNzIG9mIGNsb3Npbmcgc29ja2V0IGNvbm5lY3Rpb24gcmVzdWx0cyBpbiBzb21lIGVycm9ycywgKnRoZW4qIHN0cmVhbVxuICogd2lsbCBlcnJvci5cbiAqXG4gKiAqKk11bHRpcGxleGluZyoqXG4gKlxuICogYFdlYlNvY2tldFN1YmplY3RgIGhhcyBhbiBhZGRpdGlvbmFsIG9wZXJhdG9yLCBub3QgZm91bmQgaW4gb3RoZXIgU3ViamVjdHMuIEl0IGlzIGNhbGxlZCBgbXVsdGlwbGV4YCBhbmQgaXQgaXNcbiAqIHVzZWQgdG8gc2ltdWxhdGUgb3BlbmluZyBzZXZlcmFsIHNvY2tldCBjb25uZWN0aW9ucywgd2hpbGUgaW4gcmVhbGl0eSBtYWludGFpbmluZyBvbmx5IG9uZS5cbiAqIEZvciBleGFtcGxlLCBhbiBhcHBsaWNhdGlvbiBoYXMgYm90aCBjaGF0IHBhbmVsIGFuZCByZWFsLXRpbWUgbm90aWZpY2F0aW9ucyBhYm91dCBzcG9ydCBuZXdzLiBTaW5jZSB0aGVzZSBhcmUgdHdvIGRpc3RpbmN0IGZ1bmN0aW9ucyxcbiAqIGl0IHdvdWxkIG1ha2Ugc2Vuc2UgdG8gaGF2ZSB0d28gc2VwYXJhdGUgY29ubmVjdGlvbnMgZm9yIGVhY2guIFBlcmhhcHMgdGhlcmUgY291bGQgZXZlbiBiZSB0d28gc2VwYXJhdGUgc2VydmljZXMgd2l0aCBXZWJTb2NrZXRcbiAqIGVuZHBvaW50cywgcnVubmluZyBvbiBzZXBhcmF0ZSBtYWNoaW5lcyB3aXRoIG9ubHkgR1VJIGNvbWJpbmluZyB0aGVtIHRvZ2V0aGVyLiBIYXZpbmcgYSBzb2NrZXQgY29ubmVjdGlvblxuICogZm9yIGVhY2ggZnVuY3Rpb25hbGl0eSBjb3VsZCBiZWNvbWUgdG9vIHJlc291cmNlIGV4cGVuc2l2ZS4gSXQgaXMgYSBjb21tb24gcGF0dGVybiB0byBoYXZlIHNpbmdsZVxuICogV2ViU29ja2V0IGVuZHBvaW50IHRoYXQgYWN0cyBhcyBhIGdhdGV3YXkgZm9yIHRoZSBvdGhlciBzZXJ2aWNlcyAoaW4gdGhpcyBjYXNlIGNoYXQgYW5kIHNwb3J0IG5ld3Mgc2VydmljZXMpLlxuICogRXZlbiB0aG91Z2ggdGhlcmUgaXMgYSBzaW5nbGUgY29ubmVjdGlvbiBpbiBhIGNsaWVudCBhcHAsIGhhdmluZyB0aGUgYWJpbGl0eSB0byBtYW5pcHVsYXRlIHN0cmVhbXMgYXMgaWYgaXRcbiAqIHdlcmUgdHdvIHNlcGFyYXRlIHNvY2tldHMgaXMgZGVzaXJhYmxlLiBUaGlzIGVsaW1pbmF0ZXMgbWFudWFsbHkgcmVnaXN0ZXJpbmcgYW5kIHVucmVnaXN0ZXJpbmcgaW4gYSBnYXRld2F5IGZvclxuICogZ2l2ZW4gc2VydmljZSBhbmQgZmlsdGVyIG91dCBtZXNzYWdlcyBvZiBpbnRlcmVzdC4gVGhpcyBpcyBleGFjdGx5IHdoYXQgYG11bHRpcGxleGAgbWV0aG9kIGlzIGZvci5cbiAqXG4gKiBNZXRob2QgYWNjZXB0cyB0aHJlZSBwYXJhbWV0ZXJzLiBGaXJzdCB0d28gYXJlIGZ1bmN0aW9ucyByZXR1cm5pbmcgc3Vic2NyaXB0aW9uIGFuZCB1bnN1YnNjcmlwdGlvbiBtZXNzYWdlc1xuICogcmVzcGVjdGl2ZWx5LiBUaGVzZSBhcmUgbWVzc2FnZXMgdGhhdCB3aWxsIGJlIHNlbnQgdG8gdGhlIHNlcnZlciwgd2hlbmV2ZXIgY29uc3VtZXIgb2YgcmVzdWx0aW5nIE9ic2VydmFibGVcbiAqIHN1YnNjcmliZXMgYW5kIHVuc3Vic2NyaWJlcy4gU2VydmVyIGNhbiB1c2UgdGhlbSB0byB2ZXJpZnkgdGhhdCBzb21lIGtpbmQgb2YgbWVzc2FnZXMgc2hvdWxkIHN0YXJ0IG9yIHN0b3BcbiAqIGJlaW5nIGZvcndhcmRlZCB0byB0aGUgY2xpZW50LiBJbiBjYXNlIG9mIHRoZSBhYm92ZSBleGFtcGxlIGFwcGxpY2F0aW9uLCBhZnRlciBnZXR0aW5nIHN1YnNjcmlwdGlvbiBtZXNzYWdlIHdpdGggcHJvcGVyIGlkZW50aWZpZXIsXG4gKiBnYXRld2F5IHNlcnZlciBjYW4gZGVjaWRlIHRoYXQgaXQgc2hvdWxkIGNvbm5lY3QgdG8gcmVhbCBzcG9ydCBuZXdzIHNlcnZpY2UgYW5kIHN0YXJ0IGZvcndhcmRpbmcgbWVzc2FnZXMgZnJvbSBpdC5cbiAqIE5vdGUgdGhhdCBib3RoIG1lc3NhZ2VzIHdpbGwgYmUgc2VudCBhcyByZXR1cm5lZCBieSB0aGUgZnVuY3Rpb25zLCBtZWFuaW5nIHRoZXkgd2lsbCBoYXZlIHRvIGJlIHNlcmlhbGl6ZWQgbWFudWFsbHksIGp1c3RcbiAqIGFzIG1lc3NhZ2VzIHB1c2hlZCB2aWEgYG5leHRgLiBBbHNvIGJlYXIgaW4gbWluZCB0aGF0IHRoZXNlIG1lc3NhZ2VzIHdpbGwgYmUgc2VudCBvbiAqZXZlcnkqIHN1YnNjcmlwdGlvbiBhbmRcbiAqIHVuc3Vic2NyaXB0aW9uLiBUaGlzIGlzIHBvdGVudGlhbGx5IGRhbmdlcm91cywgYmVjYXVzZSBvbmUgY29uc3VtZXIgb2YgYW4gT2JzZXJ2YWJsZSBtYXkgdW5zdWJzY3JpYmUgYW5kIHRoZSBzZXJ2ZXJcbiAqIG1pZ2h0IHN0b3Agc2VuZGluZyBtZXNzYWdlcywgc2luY2UgaXQgZ290IHVuc3Vic2NyaXB0aW9uIG1lc3NhZ2UuIFRoaXMgbmVlZHMgdG8gYmUgaGFuZGxlZFxuICogb24gdGhlIHNlcnZlciBvciB1c2luZyB7QGxpbmsgcHVibGlzaH0gb24gYSBPYnNlcnZhYmxlIHJldHVybmVkIGZyb20gJ211bHRpcGxleCcuXG4gKlxuICogTGFzdCBhcmd1bWVudCB0byBgbXVsdGlwbGV4YCBpcyBhIGBtZXNzYWdlRmlsdGVyYCBmdW5jdGlvbiB3aGljaCBmaWx0ZXJzIG91dCBtZXNzYWdlc1xuICogc2VudCBieSB0aGUgc2VydmVyIHRvIG9ubHkgdGhvc2UgdGhhdCBiZWxvbmcgdG8gc2ltdWxhdGVkIFdlYlNvY2tldCBzdHJlYW0uIEZvciBleGFtcGxlLCBzZXJ2ZXIgbWlnaHQgbWFyayB0aGVzZVxuICogbWVzc2FnZXMgd2l0aCBzb21lIGtpbmQgb2Ygc3RyaW5nIGlkZW50aWZpZXIgb24gYSBtZXNzYWdlIG9iamVjdCBhbmQgYG1lc3NhZ2VGaWx0ZXJgIHdvdWxkIHJldHVybiBgdHJ1ZWBcbiAqIGlmIHRoZXJlIGlzIHN1Y2ggaWRlbnRpZmllciBvbiBhbiBvYmplY3QgZW1pdHRlZCBieSB0aGUgc29ja2V0LlxuICpcbiAqIFJldHVybiB2YWx1ZSBvZiBgbXVsdGlwbGV4YCBpcyBhbiBPYnNlcnZhYmxlIHdpdGggbWVzc2FnZXMgaW5jb21pbmcgZnJvbSBlbXVsYXRlZCBzb2NrZXQgY29ubmVjdGlvbi4gTm90ZSB0aGF0IHRoaXNcbiAqIGlzIG5vdCBhIGBXZWJTb2NrZXRTdWJqZWN0YCwgc28gY2FsbGluZyBgbmV4dGAgb3IgYG11bHRpcGxleGAgYWdhaW4gd2lsbCBmYWlsLiBGb3IgcHVzaGluZyB2YWx1ZXMgdG8gdGhlXG4gKiBzZXJ2ZXIsIHVzZSByb290IGBXZWJTb2NrZXRTdWJqZWN0YC5cbiAqXG4gKiAjIyMgRXhhbXBsZXNcbiAqICMjIyMgTGlzdGVuaW5nIGZvciBtZXNzYWdlcyBmcm9tIHRoZSBzZXJ2ZXJcbiAqIGNvbnN0IHN1YmplY3QgPSBSeC5PYnNlcnZhYmxlLndlYlNvY2tldCgnd3M6Ly9sb2NhbGhvc3Q6ODA4MScpO1xuICpcbiAqIHN1YmplY3Quc3Vic2NyaWJlKFxuICogICAgKG1zZykgPT4gY29uc29sZS5sb2coJ21lc3NhZ2UgcmVjZWl2ZWQ6ICcgKyBtc2cpLCAvLyBDYWxsZWQgd2hlbmV2ZXIgdGhlcmUgaXMgYSBtZXNzYWdlIGZyb20gdGhlIHNlcnZlci5cbiAqICAgIChlcnIpID0+IGNvbnNvbGUubG9nKGVyciksIC8vIENhbGxlZCBpZiBhdCBhbnkgcG9pbnQgV2ViU29ja2V0IEFQSSBzaWduYWxzIHNvbWUga2luZCBvZiBlcnJvci5cbiAqICAgICgpID0+IGNvbnNvbGUubG9nKCdjb21wbGV0ZScpIC8vIENhbGxlZCB3aGVuIGNvbm5lY3Rpb24gaXMgY2xvc2VkIChmb3Igd2hhdGV2ZXIgcmVhc29uKS5cbiAqICApO1xuICpcbiAqXG4gKiAjIyMjIFB1c2hpbmcgbWVzc2FnZXMgdG8gdGhlIHNlcnZlclxuICogY29uc3Qgc3ViamVjdCA9IFJ4Lk9ic2VydmFibGUud2ViU29ja2V0KCd3czovL2xvY2FsaG9zdDo4MDgxJyk7XG4gKlxuICogc3ViamVjdC5zdWJzY3JpYmUoKTsgLy8gTm90ZSB0aGF0IGF0IGxlYXN0IG9uZSBjb25zdW1lciBoYXMgdG8gc3Vic2NyaWJlIHRvXG4gKiAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgY3JlYXRlZCBzdWJqZWN0IC0gb3RoZXJ3aXNlIFwibmV4dGVkXCIgdmFsdWVzIHdpbGwgYmUganVzdFxuICogICAgICAgICAgICAgICAgICAgICAgLy8gYnVmZmVyZWQgYW5kIG5vdCBzZW50LCBzaW5jZSBubyBjb25uZWN0aW9uIHdhcyBlc3RhYmxpc2hlZCFcbiAqXG4gKiBzdWJqZWN0Lm5leHQoSlNPTi5zdHJpbmdpZnkoe21lc3NhZ2U6ICdzb21lIG1lc3NhZ2UnfSkpOyAvLyBUaGlzIHdpbGwgc2VuZCBhIG1lc3NhZ2UgdG8gdGhlIHNlcnZlclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gb25jZSBhIGNvbm5lY3Rpb24gaXMgbWFkZS5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlbWVtYmVyIHRvIHNlcmlhbGl6ZSBzZW50IHZhbHVlIGZpcnN0IVxuICpcbiAqIHN1YmplY3QuY29tcGxldGUoKTsgLy8gQ2xvc2VzIHRoZSBjb25uZWN0aW9uLlxuICpcbiAqXG4gKiBzdWJqZWN0LmVycm9yKHtjb2RlOiA0MDAwLCByZWFzb246ICdJIHRoaW5rIG91ciBhcHAganVzdCBicm9rZSEnfSk7IC8vIEFsc28gY2xvc2VzIHRoZSBjb25uZWN0aW9uLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBidXQgbGV0J3MgdGhlIHNlcnZlciBrbm93IHRoYXRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcyBjbG9zaW5nIGlzIGNhdXNlZCBieSBzb21lIGVycm9yLlxuICpcbiAqXG4gKiAjIyMjIE11bHRpcGxleGluZyBXZWJTb2NrZXRcbiAqIGNvbnN0IHN1YmplY3QgPSBSeC5PYnNlcnZhYmxlLndlYlNvY2tldCgnd3M6Ly9sb2NhbGhvc3Q6ODA4MScpO1xuICpcbiAqIGNvbnN0IG9ic2VydmFibGVBID0gc3ViamVjdC5tdWx0aXBsZXgoXG4gKiAgICgpID0+IEpTT04uc3RyaW5naWZ5KHtzdWJzY3JpYmU6ICdBJ30pLCAvLyBXaGVuIHNlcnZlciBnZXRzIHRoaXMgbWVzc2FnZSwgaXQgd2lsbCBzdGFydCBzZW5kaW5nIG1lc3NhZ2VzIGZvciAnQScuLi5cbiAqICAgKCkgPT4gSlNPTi5zdHJpbmdpZnkoe3Vuc3Vic2NyaWJlOiAnQSd9KSwgLy8gLi4uYW5kIHdoZW4gZ2V0cyB0aGlzIG9uZSwgaXQgd2lsbCBzdG9wLlxuICogICBtZXNzYWdlID0+IG1lc3NhZ2UudHlwZSA9PT0gJ0EnIC8vIFNlcnZlciB3aWxsIHRhZyBhbGwgbWVzc2FnZXMgZm9yICdBJyB3aXRoIHR5cGUgcHJvcGVydHkuXG4gKiApO1xuICpcbiAqIGNvbnN0IG9ic2VydmFibGVCID0gc3ViamVjdC5tdWx0aXBsZXgoIC8vIEFuZCB0aGUgc2FtZSBnb2VzIGZvciAnQicuXG4gKiAgICgpID0+IEpTT04uc3RyaW5naWZ5KHtzdWJzY3JpYmU6ICdCJ30pLFxuICogICAoKSA9PiBKU09OLnN0cmluZ2lmeSh7dW5zdWJzY3JpYmU6ICdCJ30pLFxuICogICBtZXNzYWdlID0+IG1lc3NhZ2UudHlwZSA9PT0gJ0InXG4gKiApO1xuICpcbiAqIGNvbnN0IHN1YkEgPSBvYnNlcnZhYmxlQS5zdWJzY3JpYmUobWVzc2FnZUZvckEgPT4gY29uc29sZS5sb2cobWVzc2FnZUZvckEpKTtcbiAqIC8vIEF0IHRoaXMgbW9tZW50IFdlYlNvY2tldCBjb25uZWN0aW9uXG4gKiAvLyBpcyBlc3RhYmxpc2hlZC4gU2VydmVyIGdldHMgJ3tcInN1YnNjcmliZVwiOiBcIkFcIn0nXG4gKiAvLyBtZXNzYWdlIGFuZCBzdGFydHMgc2VuZGluZyBtZXNzYWdlcyBmb3IgJ0EnLFxuICogLy8gd2hpY2ggd2UgbG9nIGhlcmUuXG4gKlxuICogY29uc3Qgc3ViQiA9IG9ic2VydmFibGVCLnN1YnNjcmliZShtZXNzYWdlRm9yQiA9PiBjb25zb2xlLmxvZyhtZXNzYWdlRm9yQikpO1xuICogLy8gU2luY2Ugd2UgYWxyZWFkeSBoYXZlIGEgY29ubmVjdGlvbixcbiAqIC8vIHdlIGp1c3Qgc2VuZCAne1wic3Vic2NyaWJlXCI6IFwiQlwifScgbWVzc2FnZVxuICogLy8gdG8gdGhlIHNlcnZlci4gSXQgc3RhcnRzIHNlbmRpbmdcbiAqIC8vIG1lc3NhZ2VzIGZvciAnQicsIHdoaWNoIHdlIGxvZyBoZXJlLlxuICpcbiAqIHN1YkIudW5zdWJzY3JpYmUoKTtcbiAqIC8vIE1lc3NhZ2UgJ3tcInVuc3Vic2NyaWJlXCI6IFwiQlwifScgaXMgc2VudCB0byB0aGVcbiAqIC8vIHNlcnZlciwgd2hpY2ggc3RvcHMgc2VuZGluZyAnQicgbWVzc2FnZXMuXG4gKlxuICogc3ViQS51bnVic2NyaWJlKCk7XG4gKiAvLyBNZXNzYWdlICd7XCJ1bnN1YnNjcmliZVwiOiBcIkFcIn0nIG1ha2VzIHRoZSBzZXJ2ZXJcbiAqIC8vIHN0b3Agc2VuZGluZyBtZXNzYWdlcyBmb3IgJ0EnLiBTaW5jZSB0aGVyZSBpc1xuICogLy8gbm8gbW9yZSBzdWJzY3JpYmVycyB0byByb290IFN1YmplY3QsIHNvY2tldFxuICogLy8gY29ubmVjdGlvbiBjbG9zZXMuXG4gKlxuICpcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ3xXZWJTb2NrZXRTdWJqZWN0Q29uZmlnfSB1cmxDb25maWdPclNvdXJjZSBUaGUgV2ViU29ja2V0IGVuZHBvaW50IGFzIGFuIHVybCBvciBhbiBvYmplY3Qgd2l0aFxuICogY29uZmlndXJhdGlvbiBhbmQgYWRkaXRpb25hbCBPYnNlcnZlcnMuXG4gKiBAcmV0dXJuIHtXZWJTb2NrZXRTdWJqZWN0fSBTdWJqZWN0IHdoaWNoIGFsbG93cyB0byBib3RoIHNlbmQgYW5kIHJlY2VpdmUgbWVzc2FnZXMgdmlhIFdlYlNvY2tldCBjb25uZWN0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gd2ViU29ja2V0PFQ+KHVybENvbmZpZ09yU291cmNlOiBzdHJpbmcgfCBXZWJTb2NrZXRTdWJqZWN0Q29uZmlnPFQ+KTogV2ViU29ja2V0U3ViamVjdDxUPiB7XG4gIHJldHVybiBuZXcgV2ViU29ja2V0U3ViamVjdDxUPih1cmxDb25maWdPclNvdXJjZSk7XG59XG4iXX0=