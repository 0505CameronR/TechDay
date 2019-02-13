/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Zone.__load_patch('bluebird', (global, Zone, api) => {
    // TODO: @JiaLiPassion, we can automatically patch bluebird
    // if global.Promise = Bluebird, but sometimes in nodejs,
    // global.Promise is not Bluebird, and Bluebird is just be
    // used by other libraries such as sequelize, so I think it is
    // safe to just expose a method to patch Bluebird explicitly
    const BLUEBIRD = 'bluebird';
    Zone[Zone.__symbol__(BLUEBIRD)] = function patchBluebird(Bluebird) {
        // patch method of Bluebird.prototype which not using `then` internally
        const bluebirdApis = ['then', 'spread', 'finally'];
        bluebirdApis.forEach(bapi => {
            api.patchMethod(Bluebird.prototype, bapi, (delegate) => (self, args) => {
                const zone = Zone.current;
                for (let i = 0; i < args.length; i++) {
                    const func = args[i];
                    if (typeof func === 'function') {
                        args[i] = function () {
                            const argSelf = this;
                            const argArgs = arguments;
                            return new Bluebird((res, rej) => {
                                zone.scheduleMicroTask('Promise.then', () => {
                                    try {
                                        res(func.apply(argSelf, argArgs));
                                    }
                                    catch (error) {
                                        rej(error);
                                    }
                                });
                            });
                        };
                    }
                }
                return delegate.apply(self, args);
            });
        });
        Bluebird.onPossiblyUnhandledRejection(function (e, promise) {
            try {
                Zone.current.runGuarded(() => {
                    throw e;
                });
            }
            catch (err) {
                api.onUnhandledError(err);
            }
        });
        // override global promise
        global[api.symbol('ZoneAwarePromise')] = Bluebird;
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmx1ZWJpcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy96b25lLmpzL2xpYi9leHRyYS9ibHVlYmlyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxDQUFDLE1BQVcsRUFBRSxJQUFjLEVBQUUsR0FBaUIsRUFBRSxFQUFFO0lBQy9FLDJEQUEyRDtJQUMzRCx5REFBeUQ7SUFDekQsMERBQTBEO0lBQzFELDhEQUE4RDtJQUM5RCw0REFBNEQ7SUFDNUQsTUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDO0lBQzNCLElBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsU0FBUyxhQUFhLENBQUMsUUFBYTtRQUM3RSx1RUFBdUU7UUFDdkUsTUFBTSxZQUFZLEdBQWEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzdELFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDMUIsR0FBRyxDQUFDLFdBQVcsQ0FDWCxRQUFRLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLFFBQWtCLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBUyxFQUFFLElBQVcsRUFBRSxFQUFFO2dCQUMzRSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUMxQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDcEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNyQixJQUFJLE9BQU8sSUFBSSxLQUFLLFVBQVUsRUFBRTt3QkFDOUIsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHOzRCQUNSLE1BQU0sT0FBTyxHQUFRLElBQUksQ0FBQzs0QkFDMUIsTUFBTSxPQUFPLEdBQVEsU0FBUyxDQUFDOzRCQUMvQixPQUFPLElBQUksUUFBUSxDQUFDLENBQUMsR0FBUSxFQUFFLEdBQVEsRUFBRSxFQUFFO2dDQUN6QyxJQUFJLENBQUMsaUJBQWlCLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtvQ0FDMUMsSUFBSTt3Q0FDRixHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztxQ0FDbkM7b0NBQUMsT0FBTyxLQUFLLEVBQUU7d0NBQ2QsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO3FDQUNaO2dDQUNILENBQUMsQ0FBQyxDQUFDOzRCQUNMLENBQUMsQ0FBQyxDQUFDO3dCQUNMLENBQUMsQ0FBQztxQkFDSDtpQkFDRjtnQkFDRCxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3BDLENBQUMsQ0FBQyxDQUFDO1FBQ1QsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsNEJBQTRCLENBQUMsVUFBUyxDQUFNLEVBQUUsT0FBWTtZQUNqRSxJQUFJO2dCQUNGLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRTtvQkFDM0IsTUFBTSxDQUFDLENBQUM7Z0JBQ1YsQ0FBQyxDQUFDLENBQUM7YUFDSjtZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNaLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUMzQjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsMEJBQTBCO1FBQzFCLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUMsR0FBRyxRQUFRLENBQUM7SUFDcEQsQ0FBQyxDQUFDO0FBQ0osQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5ab25lLl9fbG9hZF9wYXRjaCgnYmx1ZWJpcmQnLCAoZ2xvYmFsOiBhbnksIFpvbmU6IFpvbmVUeXBlLCBhcGk6IF9ab25lUHJpdmF0ZSkgPT4ge1xuICAvLyBUT0RPOiBASmlhTGlQYXNzaW9uLCB3ZSBjYW4gYXV0b21hdGljYWxseSBwYXRjaCBibHVlYmlyZFxuICAvLyBpZiBnbG9iYWwuUHJvbWlzZSA9IEJsdWViaXJkLCBidXQgc29tZXRpbWVzIGluIG5vZGVqcyxcbiAgLy8gZ2xvYmFsLlByb21pc2UgaXMgbm90IEJsdWViaXJkLCBhbmQgQmx1ZWJpcmQgaXMganVzdCBiZVxuICAvLyB1c2VkIGJ5IG90aGVyIGxpYnJhcmllcyBzdWNoIGFzIHNlcXVlbGl6ZSwgc28gSSB0aGluayBpdCBpc1xuICAvLyBzYWZlIHRvIGp1c3QgZXhwb3NlIGEgbWV0aG9kIHRvIHBhdGNoIEJsdWViaXJkIGV4cGxpY2l0bHlcbiAgY29uc3QgQkxVRUJJUkQgPSAnYmx1ZWJpcmQnO1xuICAoWm9uZSBhcyBhbnkpW1pvbmUuX19zeW1ib2xfXyhCTFVFQklSRCldID0gZnVuY3Rpb24gcGF0Y2hCbHVlYmlyZChCbHVlYmlyZDogYW55KSB7XG4gICAgLy8gcGF0Y2ggbWV0aG9kIG9mIEJsdWViaXJkLnByb3RvdHlwZSB3aGljaCBub3QgdXNpbmcgYHRoZW5gIGludGVybmFsbHlcbiAgICBjb25zdCBibHVlYmlyZEFwaXM6IHN0cmluZ1tdID0gWyd0aGVuJywgJ3NwcmVhZCcsICdmaW5hbGx5J107XG4gICAgYmx1ZWJpcmRBcGlzLmZvckVhY2goYmFwaSA9PiB7XG4gICAgICBhcGkucGF0Y2hNZXRob2QoXG4gICAgICAgICAgQmx1ZWJpcmQucHJvdG90eXBlLCBiYXBpLCAoZGVsZWdhdGU6IEZ1bmN0aW9uKSA9PiAoc2VsZjogYW55LCBhcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgem9uZSA9IFpvbmUuY3VycmVudDtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBjb25zdCBmdW5jID0gYXJnc1tpXTtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBmdW5jID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgYXJnc1tpXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgY29uc3QgYXJnU2VsZjogYW55ID0gdGhpcztcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGFyZ0FyZ3M6IGFueSA9IGFyZ3VtZW50cztcbiAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQmx1ZWJpcmQoKHJlczogYW55LCByZWo6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB6b25lLnNjaGVkdWxlTWljcm9UYXNrKCdQcm9taXNlLnRoZW4nLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcyhmdW5jLmFwcGx5KGFyZ1NlbGYsIGFyZ0FyZ3MpKTtcbiAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgQmx1ZWJpcmQub25Qb3NzaWJseVVuaGFuZGxlZFJlamVjdGlvbihmdW5jdGlvbihlOiBhbnksIHByb21pc2U6IGFueSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgWm9uZS5jdXJyZW50LnJ1bkd1YXJkZWQoKCkgPT4ge1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGFwaS5vblVuaGFuZGxlZEVycm9yKGVycik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBvdmVycmlkZSBnbG9iYWwgcHJvbWlzZVxuICAgIGdsb2JhbFthcGkuc3ltYm9sKCdab25lQXdhcmVQcm9taXNlJyldID0gQmx1ZWJpcmQ7XG4gIH07XG59KTtcbiJdfQ==