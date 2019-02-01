"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var noop_1 = require("./noop");
/* tslint:enable:max-line-length */
function pipe() {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return pipeFromArray(fns);
}
exports.pipe = pipe;
/** @internal */
function pipeFromArray(fns) {
    if (!fns) {
        return noop_1.noop;
    }
    if (fns.length === 1) {
        return fns[0];
    }
    return function piped(input) {
        return fns.reduce(function (prev, fn) { return fn(prev); }, input);
    };
}
exports.pipeFromArray = pipeFromArray;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL3V0aWwvcGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUE4QjtBQWU5QixtQ0FBbUM7QUFFbkMsU0FBZ0IsSUFBSTtJQUFDLGFBQXNDO1NBQXRDLFVBQXNDLEVBQXRDLHFCQUFzQyxFQUF0QyxJQUFzQztRQUF0Qyx3QkFBc0M7O0lBQ3pELE9BQU8sYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzVCLENBQUM7QUFGRCxvQkFFQztBQUVELGdCQUFnQjtBQUNoQixTQUFnQixhQUFhLENBQU8sR0FBK0I7SUFDakUsSUFBSSxDQUFDLEdBQUcsRUFBRTtRQUNSLE9BQU8sV0FBK0IsQ0FBQztLQUN4QztJQUVELElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDcEIsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDZjtJQUVELE9BQU8sU0FBUyxLQUFLLENBQUMsS0FBUTtRQUM1QixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBQyxJQUFTLEVBQUUsRUFBdUIsSUFBSyxPQUFBLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBUixDQUFRLEVBQUUsS0FBWSxDQUFDLENBQUM7SUFDcEYsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQVpELHNDQVlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4vbm9vcCc7XG5pbXBvcnQgeyBVbmFyeUZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiBwaXBlPFQ+KCk6IFVuYXJ5RnVuY3Rpb248VCwgVD47XG5leHBvcnQgZnVuY3Rpb24gcGlwZTxULCBBPihmbjE6IFVuYXJ5RnVuY3Rpb248VCwgQT4pOiBVbmFyeUZ1bmN0aW9uPFQsIEE+O1xuZXhwb3J0IGZ1bmN0aW9uIHBpcGU8VCwgQSwgQj4oZm4xOiBVbmFyeUZ1bmN0aW9uPFQsIEE+LCBmbjI6IFVuYXJ5RnVuY3Rpb248QSwgQj4pOiBVbmFyeUZ1bmN0aW9uPFQsIEI+O1xuZXhwb3J0IGZ1bmN0aW9uIHBpcGU8VCwgQSwgQiwgQz4oZm4xOiBVbmFyeUZ1bmN0aW9uPFQsIEE+LCBmbjI6IFVuYXJ5RnVuY3Rpb248QSwgQj4sIGZuMzogVW5hcnlGdW5jdGlvbjxCLCBDPik6IFVuYXJ5RnVuY3Rpb248VCwgQz47XG5leHBvcnQgZnVuY3Rpb24gcGlwZTxULCBBLCBCLCBDLCBEPihmbjE6IFVuYXJ5RnVuY3Rpb248VCwgQT4sIGZuMjogVW5hcnlGdW5jdGlvbjxBLCBCPiwgZm4zOiBVbmFyeUZ1bmN0aW9uPEIsIEM+LCBmbjQ6IFVuYXJ5RnVuY3Rpb248QywgRD4pOiBVbmFyeUZ1bmN0aW9uPFQsIEQ+O1xuZXhwb3J0IGZ1bmN0aW9uIHBpcGU8VCwgQSwgQiwgQywgRCwgRT4oZm4xOiBVbmFyeUZ1bmN0aW9uPFQsIEE+LCBmbjI6IFVuYXJ5RnVuY3Rpb248QSwgQj4sIGZuMzogVW5hcnlGdW5jdGlvbjxCLCBDPiwgZm40OiBVbmFyeUZ1bmN0aW9uPEMsIEQ+LCBmbjU6IFVuYXJ5RnVuY3Rpb248RCwgRT4pOiBVbmFyeUZ1bmN0aW9uPFQsIEU+O1xuZXhwb3J0IGZ1bmN0aW9uIHBpcGU8VCwgQSwgQiwgQywgRCwgRSwgRj4oZm4xOiBVbmFyeUZ1bmN0aW9uPFQsIEE+LCBmbjI6IFVuYXJ5RnVuY3Rpb248QSwgQj4sIGZuMzogVW5hcnlGdW5jdGlvbjxCLCBDPiwgZm40OiBVbmFyeUZ1bmN0aW9uPEMsIEQ+LCBmbjU6IFVuYXJ5RnVuY3Rpb248RCwgRT4sIGZuNjogVW5hcnlGdW5jdGlvbjxFLCBGPik6IFVuYXJ5RnVuY3Rpb248VCwgRj47XG5leHBvcnQgZnVuY3Rpb24gcGlwZTxULCBBLCBCLCBDLCBELCBFLCBGLCBHPihmbjE6IFVuYXJ5RnVuY3Rpb248VCwgQT4sIGZuMjogVW5hcnlGdW5jdGlvbjxBLCBCPiwgZm4zOiBVbmFyeUZ1bmN0aW9uPEIsIEM+LCBmbjQ6IFVuYXJ5RnVuY3Rpb248QywgRD4sIGZuNTogVW5hcnlGdW5jdGlvbjxELCBFPiwgZm42OiBVbmFyeUZ1bmN0aW9uPEUsIEY+LCBmbjc6IFVuYXJ5RnVuY3Rpb248RiwgRz4pOiBVbmFyeUZ1bmN0aW9uPFQsIEc+O1xuZXhwb3J0IGZ1bmN0aW9uIHBpcGU8VCwgQSwgQiwgQywgRCwgRSwgRiwgRywgSD4oZm4xOiBVbmFyeUZ1bmN0aW9uPFQsIEE+LCBmbjI6IFVuYXJ5RnVuY3Rpb248QSwgQj4sIGZuMzogVW5hcnlGdW5jdGlvbjxCLCBDPiwgZm40OiBVbmFyeUZ1bmN0aW9uPEMsIEQ+LCBmbjU6IFVuYXJ5RnVuY3Rpb248RCwgRT4sIGZuNjogVW5hcnlGdW5jdGlvbjxFLCBGPiwgZm43OiBVbmFyeUZ1bmN0aW9uPEYsIEc+LCBmbjg6IFVuYXJ5RnVuY3Rpb248RywgSD4pOiBVbmFyeUZ1bmN0aW9uPFQsIEg+O1xuZXhwb3J0IGZ1bmN0aW9uIHBpcGU8VCwgQSwgQiwgQywgRCwgRSwgRiwgRywgSCwgST4oZm4xOiBVbmFyeUZ1bmN0aW9uPFQsIEE+LCBmbjI6IFVuYXJ5RnVuY3Rpb248QSwgQj4sIGZuMzogVW5hcnlGdW5jdGlvbjxCLCBDPiwgZm40OiBVbmFyeUZ1bmN0aW9uPEMsIEQ+LCBmbjU6IFVuYXJ5RnVuY3Rpb248RCwgRT4sIGZuNjogVW5hcnlGdW5jdGlvbjxFLCBGPiwgZm43OiBVbmFyeUZ1bmN0aW9uPEYsIEc+LCBmbjg6IFVuYXJ5RnVuY3Rpb248RywgSD4sIGZuOTogVW5hcnlGdW5jdGlvbjxILCBJPik6IFVuYXJ5RnVuY3Rpb248VCwgST47XG5leHBvcnQgZnVuY3Rpb24gcGlwZTxULCBBLCBCLCBDLCBELCBFLCBGLCBHLCBILCBJPihmbjE6IFVuYXJ5RnVuY3Rpb248VCwgQT4sIGZuMjogVW5hcnlGdW5jdGlvbjxBLCBCPiwgZm4zOiBVbmFyeUZ1bmN0aW9uPEIsIEM+LCBmbjQ6IFVuYXJ5RnVuY3Rpb248QywgRD4sIGZuNTogVW5hcnlGdW5jdGlvbjxELCBFPiwgZm42OiBVbmFyeUZ1bmN0aW9uPEUsIEY+LCBmbjc6IFVuYXJ5RnVuY3Rpb248RiwgRz4sIGZuODogVW5hcnlGdW5jdGlvbjxHLCBIPiwgZm45OiBVbmFyeUZ1bmN0aW9uPEgsIEk+LCAuLi5mbnM6IFVuYXJ5RnVuY3Rpb248YW55LCBhbnk+W10pOiBVbmFyeUZ1bmN0aW9uPFQsIHt9Pjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbmV4cG9ydCBmdW5jdGlvbiBwaXBlKC4uLmZuczogQXJyYXk8VW5hcnlGdW5jdGlvbjxhbnksIGFueT4+KTogVW5hcnlGdW5jdGlvbjxhbnksIGFueT4ge1xuICByZXR1cm4gcGlwZUZyb21BcnJheShmbnMpO1xufVxuXG4vKiogQGludGVybmFsICovXG5leHBvcnQgZnVuY3Rpb24gcGlwZUZyb21BcnJheTxULCBSPihmbnM6IEFycmF5PFVuYXJ5RnVuY3Rpb248VCwgUj4+KTogVW5hcnlGdW5jdGlvbjxULCBSPiB7XG4gIGlmICghZm5zKSB7XG4gICAgcmV0dXJuIG5vb3AgYXMgVW5hcnlGdW5jdGlvbjxhbnksIGFueT47XG4gIH1cblxuICBpZiAoZm5zLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBmbnNbMF07XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gcGlwZWQoaW5wdXQ6IFQpOiBSIHtcbiAgICByZXR1cm4gZm5zLnJlZHVjZSgocHJldjogYW55LCBmbjogVW5hcnlGdW5jdGlvbjxULCBSPikgPT4gZm4ocHJldiksIGlucHV0IGFzIGFueSk7XG4gIH07XG59XG4iXX0=