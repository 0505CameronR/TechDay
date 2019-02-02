"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../common/utils");
Zone.__load_patch('fs', function () {
    var fs;
    try {
        fs = require('fs');
    }
    catch (err) {
    }
    // watch, watchFile, unwatchFile has been patched
    // because EventEmitter has been patched
    var TO_PATCH_MACROTASK_METHODS = [
        'access', 'appendFile', 'chmod', 'chown', 'close', 'exists', 'fchmod',
        'fchown', 'fdatasync', 'fstat', 'fsync', 'ftruncate', 'futimes', 'lchmod',
        'lchown', 'link', 'lstat', 'mkdir', 'mkdtemp', 'open', 'read',
        'readdir', 'readFile', 'readlink', 'realpath', 'rename', 'rmdir', 'stat',
        'symlink', 'truncate', 'unlink', 'utimes', 'write', 'writeFile',
    ];
    if (fs) {
        TO_PATCH_MACROTASK_METHODS.filter(function (name) { return !!fs[name] && typeof fs[name] === 'function'; })
            .forEach(function (name) {
            utils_1.patchMacroTask(fs, name, function (self, args) {
                return {
                    name: 'fs.' + name,
                    args: args,
                    cbIdx: args.length > 0 ? args.length - 1 : -1,
                    target: self
                };
            });
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy96b25lLmpzL2xpYi9ub2RlL2ZzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgseUNBQStDO0FBRS9DLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFO0lBQ3RCLElBQUksRUFBTyxDQUFDO0lBQ1osSUFBSTtRQUNGLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDcEI7SUFBQyxPQUFPLEdBQUcsRUFBRTtLQUNiO0lBRUQsaURBQWlEO0lBQ2pELHdDQUF3QztJQUN4QyxJQUFNLDBCQUEwQixHQUFHO1FBQ2pDLFFBQVEsRUFBRyxZQUFZLEVBQUUsT0FBTyxFQUFLLE9BQU8sRUFBSyxPQUFPLEVBQU0sUUFBUSxFQUFLLFFBQVE7UUFDbkYsUUFBUSxFQUFHLFdBQVcsRUFBRyxPQUFPLEVBQUssT0FBTyxFQUFLLFdBQVcsRUFBRSxTQUFTLEVBQUksUUFBUTtRQUNuRixRQUFRLEVBQUcsTUFBTSxFQUFRLE9BQU8sRUFBSyxPQUFPLEVBQUssU0FBUyxFQUFJLE1BQU0sRUFBTyxNQUFNO1FBQ2pGLFNBQVMsRUFBRSxVQUFVLEVBQUksVUFBVSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUssT0FBTyxFQUFNLE1BQU07UUFDakYsU0FBUyxFQUFFLFVBQVUsRUFBSSxRQUFRLEVBQUksUUFBUSxFQUFJLE9BQU8sRUFBTSxXQUFXO0tBQzFFLENBQUM7SUFFRixJQUFJLEVBQUUsRUFBRTtRQUNOLDBCQUEwQixDQUFDLE1BQU0sQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssVUFBVSxFQUE1QyxDQUE0QyxDQUFDO2FBQ2xGLE9BQU8sQ0FBQyxVQUFBLElBQUk7WUFDWCxzQkFBYyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBQyxJQUFTLEVBQUUsSUFBVztnQkFDOUMsT0FBTztvQkFDTCxJQUFJLEVBQUUsS0FBSyxHQUFHLElBQUk7b0JBQ2xCLElBQUksRUFBRSxJQUFJO29CQUNWLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDN0MsTUFBTSxFQUFFLElBQUk7aUJBQ2IsQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7S0FDUjtBQUNILENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge3BhdGNoTWFjcm9UYXNrfSBmcm9tICcuLi9jb21tb24vdXRpbHMnO1xuXG5ab25lLl9fbG9hZF9wYXRjaCgnZnMnLCAoKSA9PiB7XG4gIGxldCBmczogYW55O1xuICB0cnkge1xuICAgIGZzID0gcmVxdWlyZSgnZnMnKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gIH1cblxuICAvLyB3YXRjaCwgd2F0Y2hGaWxlLCB1bndhdGNoRmlsZSBoYXMgYmVlbiBwYXRjaGVkXG4gIC8vIGJlY2F1c2UgRXZlbnRFbWl0dGVyIGhhcyBiZWVuIHBhdGNoZWRcbiAgY29uc3QgVE9fUEFUQ0hfTUFDUk9UQVNLX01FVEhPRFMgPSBbXG4gICAgJ2FjY2VzcycsICAnYXBwZW5kRmlsZScsICdjaG1vZCcsICAgICdjaG93bicsICAgICdjbG9zZScsICAgICAnZXhpc3RzJywgICAgJ2ZjaG1vZCcsXG4gICAgJ2ZjaG93bicsICAnZmRhdGFzeW5jJywgICdmc3RhdCcsICAgICdmc3luYycsICAgICdmdHJ1bmNhdGUnLCAnZnV0aW1lcycsICAgJ2xjaG1vZCcsXG4gICAgJ2xjaG93bicsICAnbGluaycsICAgICAgICdsc3RhdCcsICAgICdta2RpcicsICAgICdta2R0ZW1wJywgICAnb3BlbicsICAgICAgJ3JlYWQnLFxuICAgICdyZWFkZGlyJywgJ3JlYWRGaWxlJywgICAncmVhZGxpbmsnLCAncmVhbHBhdGgnLCAncmVuYW1lJywgICAgJ3JtZGlyJywgICAgICdzdGF0JyxcbiAgICAnc3ltbGluaycsICd0cnVuY2F0ZScsICAgJ3VubGluaycsICAgJ3V0aW1lcycsICAgJ3dyaXRlJywgICAgICd3cml0ZUZpbGUnLFxuICBdO1xuXG4gIGlmIChmcykge1xuICAgIFRPX1BBVENIX01BQ1JPVEFTS19NRVRIT0RTLmZpbHRlcihuYW1lID0+ICEhZnNbbmFtZV0gJiYgdHlwZW9mIGZzW25hbWVdID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgICAgICBwYXRjaE1hY3JvVGFzayhmcywgbmFtZSwgKHNlbGY6IGFueSwgYXJnczogYW55W10pID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIG5hbWU6ICdmcy4nICsgbmFtZSxcbiAgICAgICAgICAgICAgYXJnczogYXJncyxcbiAgICAgICAgICAgICAgY2JJZHg6IGFyZ3MubGVuZ3RoID4gMCA/IGFyZ3MubGVuZ3RoIC0gMSA6IC0xLFxuICAgICAgICAgICAgICB0YXJnZXQ6IHNlbGZcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICB9XG59KTtcbiJdfQ==