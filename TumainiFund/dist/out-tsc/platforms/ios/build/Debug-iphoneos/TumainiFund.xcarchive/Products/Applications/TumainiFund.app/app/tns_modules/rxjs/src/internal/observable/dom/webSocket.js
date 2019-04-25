import { WebSocketSubject } from './WebSocketSubject';
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
export function webSocket(urlConfigOrSource) {
    return new WebSocketSubject(urlConfigOrSource);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViU29ja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVvcy9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb2JzZXJ2YWJsZS9kb20vd2ViU29ja2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxnQkFBZ0IsRUFBMEIsTUFBTSxvQkFBb0IsQ0FBQztBQUU5RTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBeUpHO0FBQ0gsTUFBTSxVQUFVLFNBQVMsQ0FBSSxpQkFBcUQ7SUFDaEYsT0FBTyxJQUFJLGdCQUFnQixDQUFJLGlCQUFpQixDQUFDLENBQUM7QUFDcEQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFdlYlNvY2tldFN1YmplY3QsIFdlYlNvY2tldFN1YmplY3RDb25maWcgfSBmcm9tICcuL1dlYlNvY2tldFN1YmplY3QnO1xuXG4vKipcbiAqIFdyYXBwZXIgYXJvdW5kIHRoZSB3M2MtY29tcGF0aWJsZSBXZWJTb2NrZXQgb2JqZWN0IHByb3ZpZGVkIGJ5IHRoZSBicm93c2VyLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj57QGxpbmsgU3ViamVjdH0gdGhhdCBjb21tdW5pY2F0ZXMgd2l0aCBhIHNlcnZlciB2aWEgV2ViU29ja2V0PC9zcGFuPlxuICpcbiAqIGB3ZWJTb2NrZXRgIGlzIGEgZmFjdG9yeSBmdW5jdGlvbiB0aGF0IHByb2R1Y2VzIGEgYFdlYlNvY2tldFN1YmplY3RgLFxuICogd2hpY2ggY2FuIGJlIHVzZWQgdG8gbWFrZSBXZWJTb2NrZXQgY29ubmVjdGlvbiB3aXRoIGFuIGFyYml0cmFyeSBlbmRwb2ludC5cbiAqIGB3ZWJTb2NrZXRgIGFjY2VwdHMgYXMgYW4gYXJndW1lbnQgZWl0aGVyIGEgc3RyaW5nIHdpdGggdXJsIG9mIFdlYlNvY2tldCBlbmRwb2ludCwgb3IgYW5cbiAqIHtAbGluayBXZWJTb2NrZXRTdWJqZWN0Q29uZmlnfSBvYmplY3QgZm9yIHByb3ZpZGluZyBhZGRpdGlvbmFsIGNvbmZpZ3VyYXRpb24sIGFzXG4gKiB3ZWxsIGFzIE9ic2VydmVycyBmb3IgdHJhY2tpbmcgbGlmZWN5Y2xlIG9mIFdlYlNvY2tldCBjb25uZWN0aW9uLlxuICpcbiAqIFdoZW4gYFdlYlNvY2tldFN1YmplY3RgIGlzIHN1YnNjcmliZWQsIGl0IGF0dGVtcHRzIHRvIG1ha2UgYSBzb2NrZXQgY29ubmVjdGlvbixcbiAqIHVubGVzcyB0aGVyZSBpcyBvbmUgbWFkZSBhbHJlYWR5LiBUaGlzIG1lYW5zIHRoYXQgbWFueSBzdWJzY3JpYmVycyB3aWxsIGFsd2F5cyBsaXN0ZW5cbiAqIG9uIHRoZSBzYW1lIHNvY2tldCwgdGh1cyBzYXZpbmcgcmVzb3VyY2VzLiBJZiBob3dldmVyLCB0d28gaW5zdGFuY2VzIGFyZSBtYWRlIG9mIGBXZWJTb2NrZXRTdWJqZWN0YCxcbiAqIGV2ZW4gaWYgdGhlc2UgdHdvIHdlcmUgcHJvdmlkZWQgd2l0aCB0aGUgc2FtZSB1cmwsIHRoZXkgd2lsbCBhdHRlbXB0IHRvIG1ha2Ugc2VwYXJhdGVcbiAqIGNvbm5lY3Rpb25zLiBXaGVuIGNvbnN1bWVyIG9mIGEgYFdlYlNvY2tldFN1YmplY3RgIHVuc3Vic2NyaWJlcywgc29ja2V0IGNvbm5lY3Rpb24gaXMgY2xvc2VkLFxuICogb25seSBpZiB0aGVyZSBhcmUgbm8gbW9yZSBzdWJzY3JpYmVycyBzdGlsbCBsaXN0ZW5pbmcuIElmIGFmdGVyIHNvbWUgdGltZSBhIGNvbnN1bWVyIHN0YXJ0c1xuICogc3Vic2NyaWJpbmcgYWdhaW4sIGNvbm5lY3Rpb24gaXMgcmVlc3RhYmxpc2hlZC5cbiAqXG4gKiBPbmNlIGNvbm5lY3Rpb24gaXMgbWFkZSwgd2hlbmV2ZXIgYSBuZXcgbWVzc2FnZSBjb21lcyBmcm9tIHRoZSBzZXJ2ZXIsIGBXZWJTb2NrZXRTdWJqZWN0YCB3aWxsIGVtaXQgdGhhdFxuICogbWVzc2FnZSBhcyBhIHZhbHVlIGluIHRoZSBzdHJlYW0uIEJ5IGRlZmF1bHQsIGEgbWVzc2FnZSBmcm9tIHRoZSBzb2NrZXQgaXMgcGFyc2VkIHZpYSBgSlNPTi5wYXJzZWAuIElmIHlvdVxuICogd2FudCB0byBjdXN0b21pemUgaG93IGRlc2VyaWFsaXphdGlvbiBpcyBoYW5kbGVkIChpZiBhdCBhbGwpLCB5b3UgY2FuIHByb3ZpZGUgY3VzdG9tIGByZXN1bHRTZWxlY3RvcmBcbiAqIGZ1bmN0aW9uIGluIHtAbGluayBXZWJTb2NrZXRTdWJqZWN0fS4gV2hlbiBjb25uZWN0aW9uIGNsb3Nlcywgc3RyZWFtIHdpbGwgY29tcGxldGUsIHByb3ZpZGVkIGl0IGhhcHBlbmVkIHdpdGhvdXRcbiAqIGFueSBlcnJvcnMuIElmIGF0IGFueSBwb2ludCAoc3RhcnRpbmcsIG1haW50YWluaW5nIG9yIGNsb3NpbmcgYSBjb25uZWN0aW9uKSB0aGVyZSBpcyBhbiBlcnJvcixcbiAqIHN0cmVhbSB3aWxsIGFsc28gZXJyb3Igd2l0aCB3aGF0ZXZlciBXZWJTb2NrZXQgQVBJIGhhcyB0aHJvd24uXG4gKlxuICogQnkgdmlydHVlIG9mIGJlaW5nIGEge0BsaW5rIFN1YmplY3R9LCBgV2ViU29ja2V0U3ViamVjdGAgYWxsb3dzIGZvciByZWNlaXZpbmcgYW5kIHNlbmRpbmcgbWVzc2FnZXMgZnJvbSB0aGUgc2VydmVyLiBJbiBvcmRlclxuICogdG8gY29tbXVuaWNhdGUgd2l0aCBhIGNvbm5lY3RlZCBlbmRwb2ludCwgdXNlIGBuZXh0YCwgYGVycm9yYCBhbmQgYGNvbXBsZXRlYCBtZXRob2RzLiBgbmV4dGAgc2VuZHMgYSB2YWx1ZSB0byB0aGUgc2VydmVyLCBzbyBiZWFyIGluIG1pbmRcbiAqIHRoYXQgdGhpcyB2YWx1ZSB3aWxsIG5vdCBiZSBzZXJpYWxpemVkIGJlZm9yZWhhbmQuIEJlY2F1c2Ugb2YgVGhpcywgYEpTT04uc3RyaW5naWZ5YCB3aWxsIGhhdmUgdG8gYmUgY2FsbGVkIG9uIGEgdmFsdWUgYnkgaGFuZCxcbiAqIGJlZm9yZSBjYWxsaW5nIGBuZXh0YCB3aXRoIGEgcmVzdWx0LiBOb3RlIGFsc28gdGhhdCBpZiBhdCB0aGUgbW9tZW50IG9mIG5leHRpbmcgdmFsdWVcbiAqIHRoZXJlIGlzIG5vIHNvY2tldCBjb25uZWN0aW9uIChmb3IgZXhhbXBsZSBubyBvbmUgaXMgc3Vic2NyaWJpbmcpLCB0aG9zZSB2YWx1ZXMgd2lsbCBiZSBidWZmZXJlZCwgYW5kIHNlbnQgd2hlbiBjb25uZWN0aW9uXG4gKiBpcyBmaW5hbGx5IGVzdGFibGlzaGVkLiBgY29tcGxldGVgIG1ldGhvZCBjbG9zZXMgc29ja2V0IGNvbm5lY3Rpb24uIGBlcnJvcmAgZG9lcyB0aGUgc2FtZSxcbiAqIGFzIHdlbGwgYXMgbm90aWZ5aW5nIHRoZSBzZXJ2ZXIgdGhhdCBzb21ldGhpbmcgd2VudCB3cm9uZyB2aWEgc3RhdHVzIGNvZGUgYW5kIHN0cmluZyB3aXRoIGRldGFpbHMgb2Ygd2hhdCBoYXBwZW5lZC5cbiAqIFNpbmNlIHN0YXR1cyBjb2RlIGlzIHJlcXVpcmVkIGluIFdlYlNvY2tldCBBUEksIGBXZWJTb2NrZXRTdWJqZWN0YCBkb2VzIG5vdCBhbGxvdywgbGlrZSByZWd1bGFyIGBTdWJqZWN0YCxcbiAqIGFyYml0cmFyeSB2YWx1ZXMgYmVpbmcgcGFzc2VkIHRvIHRoZSBgZXJyb3JgIG1ldGhvZC4gSXQgbmVlZHMgdG8gYmUgY2FsbGVkIHdpdGggYW4gb2JqZWN0IHRoYXQgaGFzIGBjb2RlYFxuICogcHJvcGVydHkgd2l0aCBzdGF0dXMgY29kZSBudW1iZXIgYW5kIG9wdGlvbmFsIGByZWFzb25gIHByb3BlcnR5IHdpdGggc3RyaW5nIGRlc2NyaWJpbmcgZGV0YWlsc1xuICogb2YgYW4gZXJyb3IuXG4gKlxuICogQ2FsbGluZyBgbmV4dGAgZG9lcyBub3QgYWZmZWN0IHN1YnNjcmliZXJzIG9mIGBXZWJTb2NrZXRTdWJqZWN0YCAtIHRoZXkgaGF2ZSBub1xuICogaW5mb3JtYXRpb24gdGhhdCBzb21ldGhpbmcgd2FzIHNlbnQgdG8gdGhlIHNlcnZlciAodW5sZXNzIG9mIGNvdXJzZSB0aGUgc2VydmVyXG4gKiByZXNwb25kcyBzb21laG93IHRvIGEgbWVzc2FnZSkuIE9uIHRoZSBvdGhlciBoYW5kLCBzaW5jZSBjYWxsaW5nIGBjb21wbGV0ZWAgdHJpZ2dlcnNcbiAqIGFuIGF0dGVtcHQgdG8gY2xvc2Ugc29ja2V0IGNvbm5lY3Rpb24uIElmIHRoYXQgY29ubmVjdGlvbiBpcyBjbG9zZWQgd2l0aG91dCBhbnkgZXJyb3JzLCBzdHJlYW0gd2lsbFxuICogY29tcGxldGUsIHRodXMgbm90aWZ5aW5nIGFsbCBzdWJzY3JpYmVycy4gQW5kIHNpbmNlIGNhbGxpbmcgYGVycm9yYCBjbG9zZXNcbiAqIHNvY2tldCBjb25uZWN0aW9uIGFzIHdlbGwsIGp1c3Qgd2l0aCBhIGRpZmZlcmVudCBzdGF0dXMgY29kZSBmb3IgdGhlIHNlcnZlciwgaWYgY2xvc2luZyBpdHNlbGYgcHJvY2VlZHNcbiAqIHdpdGhvdXQgZXJyb3JzLCBzdWJzY3JpYmVkIE9ic2VydmFibGUgd2lsbCBub3QgZXJyb3IsIGFzIG9uZSBtaWdodCBleHBlY3QsIGJ1dCBjb21wbGV0ZSBhcyB1c3VhbC4gSW4gYm90aCBjYXNlc1xuICogKGNhbGxpbmcgYGNvbXBsZXRlYCBvciBgZXJyb3JgKSwgaWYgcHJvY2VzcyBvZiBjbG9zaW5nIHNvY2tldCBjb25uZWN0aW9uIHJlc3VsdHMgaW4gc29tZSBlcnJvcnMsICp0aGVuKiBzdHJlYW1cbiAqIHdpbGwgZXJyb3IuXG4gKlxuICogKipNdWx0aXBsZXhpbmcqKlxuICpcbiAqIGBXZWJTb2NrZXRTdWJqZWN0YCBoYXMgYW4gYWRkaXRpb25hbCBvcGVyYXRvciwgbm90IGZvdW5kIGluIG90aGVyIFN1YmplY3RzLiBJdCBpcyBjYWxsZWQgYG11bHRpcGxleGAgYW5kIGl0IGlzXG4gKiB1c2VkIHRvIHNpbXVsYXRlIG9wZW5pbmcgc2V2ZXJhbCBzb2NrZXQgY29ubmVjdGlvbnMsIHdoaWxlIGluIHJlYWxpdHkgbWFpbnRhaW5pbmcgb25seSBvbmUuXG4gKiBGb3IgZXhhbXBsZSwgYW4gYXBwbGljYXRpb24gaGFzIGJvdGggY2hhdCBwYW5lbCBhbmQgcmVhbC10aW1lIG5vdGlmaWNhdGlvbnMgYWJvdXQgc3BvcnQgbmV3cy4gU2luY2UgdGhlc2UgYXJlIHR3byBkaXN0aW5jdCBmdW5jdGlvbnMsXG4gKiBpdCB3b3VsZCBtYWtlIHNlbnNlIHRvIGhhdmUgdHdvIHNlcGFyYXRlIGNvbm5lY3Rpb25zIGZvciBlYWNoLiBQZXJoYXBzIHRoZXJlIGNvdWxkIGV2ZW4gYmUgdHdvIHNlcGFyYXRlIHNlcnZpY2VzIHdpdGggV2ViU29ja2V0XG4gKiBlbmRwb2ludHMsIHJ1bm5pbmcgb24gc2VwYXJhdGUgbWFjaGluZXMgd2l0aCBvbmx5IEdVSSBjb21iaW5pbmcgdGhlbSB0b2dldGhlci4gSGF2aW5nIGEgc29ja2V0IGNvbm5lY3Rpb25cbiAqIGZvciBlYWNoIGZ1bmN0aW9uYWxpdHkgY291bGQgYmVjb21lIHRvbyByZXNvdXJjZSBleHBlbnNpdmUuIEl0IGlzIGEgY29tbW9uIHBhdHRlcm4gdG8gaGF2ZSBzaW5nbGVcbiAqIFdlYlNvY2tldCBlbmRwb2ludCB0aGF0IGFjdHMgYXMgYSBnYXRld2F5IGZvciB0aGUgb3RoZXIgc2VydmljZXMgKGluIHRoaXMgY2FzZSBjaGF0IGFuZCBzcG9ydCBuZXdzIHNlcnZpY2VzKS5cbiAqIEV2ZW4gdGhvdWdoIHRoZXJlIGlzIGEgc2luZ2xlIGNvbm5lY3Rpb24gaW4gYSBjbGllbnQgYXBwLCBoYXZpbmcgdGhlIGFiaWxpdHkgdG8gbWFuaXB1bGF0ZSBzdHJlYW1zIGFzIGlmIGl0XG4gKiB3ZXJlIHR3byBzZXBhcmF0ZSBzb2NrZXRzIGlzIGRlc2lyYWJsZS4gVGhpcyBlbGltaW5hdGVzIG1hbnVhbGx5IHJlZ2lzdGVyaW5nIGFuZCB1bnJlZ2lzdGVyaW5nIGluIGEgZ2F0ZXdheSBmb3JcbiAqIGdpdmVuIHNlcnZpY2UgYW5kIGZpbHRlciBvdXQgbWVzc2FnZXMgb2YgaW50ZXJlc3QuIFRoaXMgaXMgZXhhY3RseSB3aGF0IGBtdWx0aXBsZXhgIG1ldGhvZCBpcyBmb3IuXG4gKlxuICogTWV0aG9kIGFjY2VwdHMgdGhyZWUgcGFyYW1ldGVycy4gRmlyc3QgdHdvIGFyZSBmdW5jdGlvbnMgcmV0dXJuaW5nIHN1YnNjcmlwdGlvbiBhbmQgdW5zdWJzY3JpcHRpb24gbWVzc2FnZXNcbiAqIHJlc3BlY3RpdmVseS4gVGhlc2UgYXJlIG1lc3NhZ2VzIHRoYXQgd2lsbCBiZSBzZW50IHRvIHRoZSBzZXJ2ZXIsIHdoZW5ldmVyIGNvbnN1bWVyIG9mIHJlc3VsdGluZyBPYnNlcnZhYmxlXG4gKiBzdWJzY3JpYmVzIGFuZCB1bnN1YnNjcmliZXMuIFNlcnZlciBjYW4gdXNlIHRoZW0gdG8gdmVyaWZ5IHRoYXQgc29tZSBraW5kIG9mIG1lc3NhZ2VzIHNob3VsZCBzdGFydCBvciBzdG9wXG4gKiBiZWluZyBmb3J3YXJkZWQgdG8gdGhlIGNsaWVudC4gSW4gY2FzZSBvZiB0aGUgYWJvdmUgZXhhbXBsZSBhcHBsaWNhdGlvbiwgYWZ0ZXIgZ2V0dGluZyBzdWJzY3JpcHRpb24gbWVzc2FnZSB3aXRoIHByb3BlciBpZGVudGlmaWVyLFxuICogZ2F0ZXdheSBzZXJ2ZXIgY2FuIGRlY2lkZSB0aGF0IGl0IHNob3VsZCBjb25uZWN0IHRvIHJlYWwgc3BvcnQgbmV3cyBzZXJ2aWNlIGFuZCBzdGFydCBmb3J3YXJkaW5nIG1lc3NhZ2VzIGZyb20gaXQuXG4gKiBOb3RlIHRoYXQgYm90aCBtZXNzYWdlcyB3aWxsIGJlIHNlbnQgYXMgcmV0dXJuZWQgYnkgdGhlIGZ1bmN0aW9ucywgbWVhbmluZyB0aGV5IHdpbGwgaGF2ZSB0byBiZSBzZXJpYWxpemVkIG1hbnVhbGx5LCBqdXN0XG4gKiBhcyBtZXNzYWdlcyBwdXNoZWQgdmlhIGBuZXh0YC4gQWxzbyBiZWFyIGluIG1pbmQgdGhhdCB0aGVzZSBtZXNzYWdlcyB3aWxsIGJlIHNlbnQgb24gKmV2ZXJ5KiBzdWJzY3JpcHRpb24gYW5kXG4gKiB1bnN1YnNjcmlwdGlvbi4gVGhpcyBpcyBwb3RlbnRpYWxseSBkYW5nZXJvdXMsIGJlY2F1c2Ugb25lIGNvbnN1bWVyIG9mIGFuIE9ic2VydmFibGUgbWF5IHVuc3Vic2NyaWJlIGFuZCB0aGUgc2VydmVyXG4gKiBtaWdodCBzdG9wIHNlbmRpbmcgbWVzc2FnZXMsIHNpbmNlIGl0IGdvdCB1bnN1YnNjcmlwdGlvbiBtZXNzYWdlLiBUaGlzIG5lZWRzIHRvIGJlIGhhbmRsZWRcbiAqIG9uIHRoZSBzZXJ2ZXIgb3IgdXNpbmcge0BsaW5rIHB1Ymxpc2h9IG9uIGEgT2JzZXJ2YWJsZSByZXR1cm5lZCBmcm9tICdtdWx0aXBsZXgnLlxuICpcbiAqIExhc3QgYXJndW1lbnQgdG8gYG11bHRpcGxleGAgaXMgYSBgbWVzc2FnZUZpbHRlcmAgZnVuY3Rpb24gd2hpY2ggZmlsdGVycyBvdXQgbWVzc2FnZXNcbiAqIHNlbnQgYnkgdGhlIHNlcnZlciB0byBvbmx5IHRob3NlIHRoYXQgYmVsb25nIHRvIHNpbXVsYXRlZCBXZWJTb2NrZXQgc3RyZWFtLiBGb3IgZXhhbXBsZSwgc2VydmVyIG1pZ2h0IG1hcmsgdGhlc2VcbiAqIG1lc3NhZ2VzIHdpdGggc29tZSBraW5kIG9mIHN0cmluZyBpZGVudGlmaWVyIG9uIGEgbWVzc2FnZSBvYmplY3QgYW5kIGBtZXNzYWdlRmlsdGVyYCB3b3VsZCByZXR1cm4gYHRydWVgXG4gKiBpZiB0aGVyZSBpcyBzdWNoIGlkZW50aWZpZXIgb24gYW4gb2JqZWN0IGVtaXR0ZWQgYnkgdGhlIHNvY2tldC5cbiAqXG4gKiBSZXR1cm4gdmFsdWUgb2YgYG11bHRpcGxleGAgaXMgYW4gT2JzZXJ2YWJsZSB3aXRoIG1lc3NhZ2VzIGluY29taW5nIGZyb20gZW11bGF0ZWQgc29ja2V0IGNvbm5lY3Rpb24uIE5vdGUgdGhhdCB0aGlzXG4gKiBpcyBub3QgYSBgV2ViU29ja2V0U3ViamVjdGAsIHNvIGNhbGxpbmcgYG5leHRgIG9yIGBtdWx0aXBsZXhgIGFnYWluIHdpbGwgZmFpbC4gRm9yIHB1c2hpbmcgdmFsdWVzIHRvIHRoZVxuICogc2VydmVyLCB1c2Ugcm9vdCBgV2ViU29ja2V0U3ViamVjdGAuXG4gKlxuICogIyMjIEV4YW1wbGVzXG4gKiAjIyMjIExpc3RlbmluZyBmb3IgbWVzc2FnZXMgZnJvbSB0aGUgc2VydmVyXG4gKiBjb25zdCBzdWJqZWN0ID0gUnguT2JzZXJ2YWJsZS53ZWJTb2NrZXQoJ3dzOi8vbG9jYWxob3N0OjgwODEnKTtcbiAqXG4gKiBzdWJqZWN0LnN1YnNjcmliZShcbiAqICAgIChtc2cpID0+IGNvbnNvbGUubG9nKCdtZXNzYWdlIHJlY2VpdmVkOiAnICsgbXNnKSwgLy8gQ2FsbGVkIHdoZW5ldmVyIHRoZXJlIGlzIGEgbWVzc2FnZSBmcm9tIHRoZSBzZXJ2ZXIuXG4gKiAgICAoZXJyKSA9PiBjb25zb2xlLmxvZyhlcnIpLCAvLyBDYWxsZWQgaWYgYXQgYW55IHBvaW50IFdlYlNvY2tldCBBUEkgc2lnbmFscyBzb21lIGtpbmQgb2YgZXJyb3IuXG4gKiAgICAoKSA9PiBjb25zb2xlLmxvZygnY29tcGxldGUnKSAvLyBDYWxsZWQgd2hlbiBjb25uZWN0aW9uIGlzIGNsb3NlZCAoZm9yIHdoYXRldmVyIHJlYXNvbikuXG4gKiAgKTtcbiAqXG4gKlxuICogIyMjIyBQdXNoaW5nIG1lc3NhZ2VzIHRvIHRoZSBzZXJ2ZXJcbiAqIGNvbnN0IHN1YmplY3QgPSBSeC5PYnNlcnZhYmxlLndlYlNvY2tldCgnd3M6Ly9sb2NhbGhvc3Q6ODA4MScpO1xuICpcbiAqIHN1YmplY3Quc3Vic2NyaWJlKCk7IC8vIE5vdGUgdGhhdCBhdCBsZWFzdCBvbmUgY29uc3VtZXIgaGFzIHRvIHN1YnNjcmliZSB0b1xuICogICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGNyZWF0ZWQgc3ViamVjdCAtIG90aGVyd2lzZSBcIm5leHRlZFwiIHZhbHVlcyB3aWxsIGJlIGp1c3RcbiAqICAgICAgICAgICAgICAgICAgICAgIC8vIGJ1ZmZlcmVkIGFuZCBub3Qgc2VudCwgc2luY2Ugbm8gY29ubmVjdGlvbiB3YXMgZXN0YWJsaXNoZWQhXG4gKlxuICogc3ViamVjdC5uZXh0KEpTT04uc3RyaW5naWZ5KHttZXNzYWdlOiAnc29tZSBtZXNzYWdlJ30pKTsgLy8gVGhpcyB3aWxsIHNlbmQgYSBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9uY2UgYSBjb25uZWN0aW9uIGlzIG1hZGUuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSZW1lbWJlciB0byBzZXJpYWxpemUgc2VudCB2YWx1ZSBmaXJzdCFcbiAqXG4gKiBzdWJqZWN0LmNvbXBsZXRlKCk7IC8vIENsb3NlcyB0aGUgY29ubmVjdGlvbi5cbiAqXG4gKlxuICogc3ViamVjdC5lcnJvcih7Y29kZTogNDAwMCwgcmVhc29uOiAnSSB0aGluayBvdXIgYXBwIGp1c3QgYnJva2UhJ30pOyAvLyBBbHNvIGNsb3NlcyB0aGUgY29ubmVjdGlvbixcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYnV0IGxldCdzIHRoZSBzZXJ2ZXIga25vdyB0aGF0XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgY2xvc2luZyBpcyBjYXVzZWQgYnkgc29tZSBlcnJvci5cbiAqXG4gKlxuICogIyMjIyBNdWx0aXBsZXhpbmcgV2ViU29ja2V0XG4gKiBjb25zdCBzdWJqZWN0ID0gUnguT2JzZXJ2YWJsZS53ZWJTb2NrZXQoJ3dzOi8vbG9jYWxob3N0OjgwODEnKTtcbiAqXG4gKiBjb25zdCBvYnNlcnZhYmxlQSA9IHN1YmplY3QubXVsdGlwbGV4KFxuICogICAoKSA9PiBKU09OLnN0cmluZ2lmeSh7c3Vic2NyaWJlOiAnQSd9KSwgLy8gV2hlbiBzZXJ2ZXIgZ2V0cyB0aGlzIG1lc3NhZ2UsIGl0IHdpbGwgc3RhcnQgc2VuZGluZyBtZXNzYWdlcyBmb3IgJ0EnLi4uXG4gKiAgICgpID0+IEpTT04uc3RyaW5naWZ5KHt1bnN1YnNjcmliZTogJ0EnfSksIC8vIC4uLmFuZCB3aGVuIGdldHMgdGhpcyBvbmUsIGl0IHdpbGwgc3RvcC5cbiAqICAgbWVzc2FnZSA9PiBtZXNzYWdlLnR5cGUgPT09ICdBJyAvLyBTZXJ2ZXIgd2lsbCB0YWcgYWxsIG1lc3NhZ2VzIGZvciAnQScgd2l0aCB0eXBlIHByb3BlcnR5LlxuICogKTtcbiAqXG4gKiBjb25zdCBvYnNlcnZhYmxlQiA9IHN1YmplY3QubXVsdGlwbGV4KCAvLyBBbmQgdGhlIHNhbWUgZ29lcyBmb3IgJ0InLlxuICogICAoKSA9PiBKU09OLnN0cmluZ2lmeSh7c3Vic2NyaWJlOiAnQid9KSxcbiAqICAgKCkgPT4gSlNPTi5zdHJpbmdpZnkoe3Vuc3Vic2NyaWJlOiAnQid9KSxcbiAqICAgbWVzc2FnZSA9PiBtZXNzYWdlLnR5cGUgPT09ICdCJ1xuICogKTtcbiAqXG4gKiBjb25zdCBzdWJBID0gb2JzZXJ2YWJsZUEuc3Vic2NyaWJlKG1lc3NhZ2VGb3JBID0+IGNvbnNvbGUubG9nKG1lc3NhZ2VGb3JBKSk7XG4gKiAvLyBBdCB0aGlzIG1vbWVudCBXZWJTb2NrZXQgY29ubmVjdGlvblxuICogLy8gaXMgZXN0YWJsaXNoZWQuIFNlcnZlciBnZXRzICd7XCJzdWJzY3JpYmVcIjogXCJBXCJ9J1xuICogLy8gbWVzc2FnZSBhbmQgc3RhcnRzIHNlbmRpbmcgbWVzc2FnZXMgZm9yICdBJyxcbiAqIC8vIHdoaWNoIHdlIGxvZyBoZXJlLlxuICpcbiAqIGNvbnN0IHN1YkIgPSBvYnNlcnZhYmxlQi5zdWJzY3JpYmUobWVzc2FnZUZvckIgPT4gY29uc29sZS5sb2cobWVzc2FnZUZvckIpKTtcbiAqIC8vIFNpbmNlIHdlIGFscmVhZHkgaGF2ZSBhIGNvbm5lY3Rpb24sXG4gKiAvLyB3ZSBqdXN0IHNlbmQgJ3tcInN1YnNjcmliZVwiOiBcIkJcIn0nIG1lc3NhZ2VcbiAqIC8vIHRvIHRoZSBzZXJ2ZXIuIEl0IHN0YXJ0cyBzZW5kaW5nXG4gKiAvLyBtZXNzYWdlcyBmb3IgJ0InLCB3aGljaCB3ZSBsb2cgaGVyZS5cbiAqXG4gKiBzdWJCLnVuc3Vic2NyaWJlKCk7XG4gKiAvLyBNZXNzYWdlICd7XCJ1bnN1YnNjcmliZVwiOiBcIkJcIn0nIGlzIHNlbnQgdG8gdGhlXG4gKiAvLyBzZXJ2ZXIsIHdoaWNoIHN0b3BzIHNlbmRpbmcgJ0InIG1lc3NhZ2VzLlxuICpcbiAqIHN1YkEudW51YnNjcmliZSgpO1xuICogLy8gTWVzc2FnZSAne1widW5zdWJzY3JpYmVcIjogXCJBXCJ9JyBtYWtlcyB0aGUgc2VydmVyXG4gKiAvLyBzdG9wIHNlbmRpbmcgbWVzc2FnZXMgZm9yICdBJy4gU2luY2UgdGhlcmUgaXNcbiAqIC8vIG5vIG1vcmUgc3Vic2NyaWJlcnMgdG8gcm9vdCBTdWJqZWN0LCBzb2NrZXRcbiAqIC8vIGNvbm5lY3Rpb24gY2xvc2VzLlxuICpcbiAqXG4gKlxuICogQHBhcmFtIHtzdHJpbmd8V2ViU29ja2V0U3ViamVjdENvbmZpZ30gdXJsQ29uZmlnT3JTb3VyY2UgVGhlIFdlYlNvY2tldCBlbmRwb2ludCBhcyBhbiB1cmwgb3IgYW4gb2JqZWN0IHdpdGhcbiAqIGNvbmZpZ3VyYXRpb24gYW5kIGFkZGl0aW9uYWwgT2JzZXJ2ZXJzLlxuICogQHJldHVybiB7V2ViU29ja2V0U3ViamVjdH0gU3ViamVjdCB3aGljaCBhbGxvd3MgdG8gYm90aCBzZW5kIGFuZCByZWNlaXZlIG1lc3NhZ2VzIHZpYSBXZWJTb2NrZXQgY29ubmVjdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdlYlNvY2tldDxUPih1cmxDb25maWdPclNvdXJjZTogc3RyaW5nIHwgV2ViU29ja2V0U3ViamVjdENvbmZpZzxUPik6IFdlYlNvY2tldFN1YmplY3Q8VD4ge1xuICByZXR1cm4gbmV3IFdlYlNvY2tldFN1YmplY3Q8VD4odXJsQ29uZmlnT3JTb3VyY2UpO1xufVxuIl19