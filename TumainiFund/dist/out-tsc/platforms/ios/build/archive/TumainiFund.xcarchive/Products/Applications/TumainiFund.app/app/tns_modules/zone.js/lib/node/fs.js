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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3pvbmUuanMvbGliL25vZGUvZnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCx5Q0FBK0M7QUFFL0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUU7SUFDdEIsSUFBSSxFQUFPLENBQUM7SUFDWixJQUFJO1FBQ0YsRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNwQjtJQUFDLE9BQU8sR0FBRyxFQUFFO0tBQ2I7SUFFRCxpREFBaUQ7SUFDakQsd0NBQXdDO0lBQ3hDLElBQU0sMEJBQTBCLEdBQUc7UUFDakMsUUFBUSxFQUFHLFlBQVksRUFBRSxPQUFPLEVBQUssT0FBTyxFQUFLLE9BQU8sRUFBTSxRQUFRLEVBQUssUUFBUTtRQUNuRixRQUFRLEVBQUcsV0FBVyxFQUFHLE9BQU8sRUFBSyxPQUFPLEVBQUssV0FBVyxFQUFFLFNBQVMsRUFBSSxRQUFRO1FBQ25GLFFBQVEsRUFBRyxNQUFNLEVBQVEsT0FBTyxFQUFLLE9BQU8sRUFBSyxTQUFTLEVBQUksTUFBTSxFQUFPLE1BQU07UUFDakYsU0FBUyxFQUFFLFVBQVUsRUFBSSxVQUFVLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBSyxPQUFPLEVBQU0sTUFBTTtRQUNqRixTQUFTLEVBQUUsVUFBVSxFQUFJLFFBQVEsRUFBSSxRQUFRLEVBQUksT0FBTyxFQUFNLFdBQVc7S0FDMUUsQ0FBQztJQUVGLElBQUksRUFBRSxFQUFFO1FBQ04sMEJBQTBCLENBQUMsTUFBTSxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxVQUFVLEVBQTVDLENBQTRDLENBQUM7YUFDbEYsT0FBTyxDQUFDLFVBQUEsSUFBSTtZQUNYLHNCQUFjLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxVQUFDLElBQVMsRUFBRSxJQUFXO2dCQUM5QyxPQUFPO29CQUNMLElBQUksRUFBRSxLQUFLLEdBQUcsSUFBSTtvQkFDbEIsSUFBSSxFQUFFLElBQUk7b0JBQ1YsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM3QyxNQUFNLEVBQUUsSUFBSTtpQkFDYixDQUFDO1lBQ0osQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztLQUNSO0FBQ0gsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7cGF0Y2hNYWNyb1Rhc2t9IGZyb20gJy4uL2NvbW1vbi91dGlscyc7XG5cblpvbmUuX19sb2FkX3BhdGNoKCdmcycsICgpID0+IHtcbiAgbGV0IGZzOiBhbnk7XG4gIHRyeSB7XG4gICAgZnMgPSByZXF1aXJlKCdmcycpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgfVxuXG4gIC8vIHdhdGNoLCB3YXRjaEZpbGUsIHVud2F0Y2hGaWxlIGhhcyBiZWVuIHBhdGNoZWRcbiAgLy8gYmVjYXVzZSBFdmVudEVtaXR0ZXIgaGFzIGJlZW4gcGF0Y2hlZFxuICBjb25zdCBUT19QQVRDSF9NQUNST1RBU0tfTUVUSE9EUyA9IFtcbiAgICAnYWNjZXNzJywgICdhcHBlbmRGaWxlJywgJ2NobW9kJywgICAgJ2Nob3duJywgICAgJ2Nsb3NlJywgICAgICdleGlzdHMnLCAgICAnZmNobW9kJyxcbiAgICAnZmNob3duJywgICdmZGF0YXN5bmMnLCAgJ2ZzdGF0JywgICAgJ2ZzeW5jJywgICAgJ2Z0cnVuY2F0ZScsICdmdXRpbWVzJywgICAnbGNobW9kJyxcbiAgICAnbGNob3duJywgICdsaW5rJywgICAgICAgJ2xzdGF0JywgICAgJ21rZGlyJywgICAgJ21rZHRlbXAnLCAgICdvcGVuJywgICAgICAncmVhZCcsXG4gICAgJ3JlYWRkaXInLCAncmVhZEZpbGUnLCAgICdyZWFkbGluaycsICdyZWFscGF0aCcsICdyZW5hbWUnLCAgICAncm1kaXInLCAgICAgJ3N0YXQnLFxuICAgICdzeW1saW5rJywgJ3RydW5jYXRlJywgICAndW5saW5rJywgICAndXRpbWVzJywgICAnd3JpdGUnLCAgICAgJ3dyaXRlRmlsZScsXG4gIF07XG5cbiAgaWYgKGZzKSB7XG4gICAgVE9fUEFUQ0hfTUFDUk9UQVNLX01FVEhPRFMuZmlsdGVyKG5hbWUgPT4gISFmc1tuYW1lXSAmJiB0eXBlb2YgZnNbbmFtZV0gPT09ICdmdW5jdGlvbicpXG4gICAgICAgIC5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICAgIHBhdGNoTWFjcm9UYXNrKGZzLCBuYW1lLCAoc2VsZjogYW55LCBhcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgbmFtZTogJ2ZzLicgKyBuYW1lLFxuICAgICAgICAgICAgICBhcmdzOiBhcmdzLFxuICAgICAgICAgICAgICBjYklkeDogYXJncy5sZW5ndGggPiAwID8gYXJncy5sZW5ndGggLSAxIDogLTEsXG4gICAgICAgICAgICAgIHRhcmdldDogc2VsZlxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gIH1cbn0pO1xuIl19