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
var AsyncScheduler_1 = require("./AsyncScheduler");
var AnimationFrameScheduler = /** @class */ (function (_super) {
    __extends(AnimationFrameScheduler, _super);
    function AnimationFrameScheduler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnimationFrameScheduler.prototype.flush = function (action) {
        this.active = true;
        this.scheduled = undefined;
        var actions = this.actions;
        var error;
        var index = -1;
        var count = actions.length;
        action = action || actions.shift();
        do {
            if (error = action.execute(action.state, action.delay)) {
                break;
            }
        } while (++index < count && (action = actions.shift()));
        this.active = false;
        if (error) {
            while (++index < count && (action = actions.shift())) {
                action.unsubscribe();
            }
            throw error;
        }
    };
    return AnimationFrameScheduler;
}(AsyncScheduler_1.AsyncScheduler));
exports.AnimationFrameScheduler = AnimationFrameScheduler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL3NjaGVkdWxlci9BbmltYXRpb25GcmFtZVNjaGVkdWxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQSxtREFBa0Q7QUFFbEQ7SUFBNkMsMkNBQWM7SUFBM0Q7O0lBMkJBLENBQUM7SUExQlEsdUNBQUssR0FBWixVQUFhLE1BQXlCO1FBRXBDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ25CLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBRXBCLElBQUEsc0JBQU8sQ0FBUztRQUN2QixJQUFJLEtBQVUsQ0FBQztRQUNmLElBQUksS0FBSyxHQUFXLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksS0FBSyxHQUFXLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDbkMsTUFBTSxHQUFHLE1BQU0sSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFbkMsR0FBRztZQUNELElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ3RELE1BQU07YUFDUDtTQUNGLFFBQVEsRUFBRSxLQUFLLEdBQUcsS0FBSyxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFO1FBRXhELElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBRXBCLElBQUksS0FBSyxFQUFFO1lBQ1QsT0FBTyxFQUFFLEtBQUssR0FBRyxLQUFLLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUU7Z0JBQ3BELE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQzthQUN0QjtZQUNELE1BQU0sS0FBSyxDQUFDO1NBQ2I7SUFDSCxDQUFDO0lBQ0gsOEJBQUM7QUFBRCxDQUFDLEFBM0JELENBQTZDLCtCQUFjLEdBMkIxRDtBQTNCWSwwREFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBc3luY0FjdGlvbiB9IGZyb20gJy4vQXN5bmNBY3Rpb24nO1xuaW1wb3J0IHsgQXN5bmNTY2hlZHVsZXIgfSBmcm9tICcuL0FzeW5jU2NoZWR1bGVyJztcblxuZXhwb3J0IGNsYXNzIEFuaW1hdGlvbkZyYW1lU2NoZWR1bGVyIGV4dGVuZHMgQXN5bmNTY2hlZHVsZXIge1xuICBwdWJsaWMgZmx1c2goYWN0aW9uPzogQXN5bmNBY3Rpb248YW55Pik6IHZvaWQge1xuXG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMuc2NoZWR1bGVkID0gdW5kZWZpbmVkO1xuXG4gICAgY29uc3Qge2FjdGlvbnN9ID0gdGhpcztcbiAgICBsZXQgZXJyb3I6IGFueTtcbiAgICBsZXQgaW5kZXg6IG51bWJlciA9IC0xO1xuICAgIGxldCBjb3VudDogbnVtYmVyID0gYWN0aW9ucy5sZW5ndGg7XG4gICAgYWN0aW9uID0gYWN0aW9uIHx8IGFjdGlvbnMuc2hpZnQoKTtcblxuICAgIGRvIHtcbiAgICAgIGlmIChlcnJvciA9IGFjdGlvbi5leGVjdXRlKGFjdGlvbi5zdGF0ZSwgYWN0aW9uLmRlbGF5KSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IHdoaWxlICgrK2luZGV4IDwgY291bnQgJiYgKGFjdGlvbiA9IGFjdGlvbnMuc2hpZnQoKSkpO1xuXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcblxuICAgIGlmIChlcnJvcikge1xuICAgICAgd2hpbGUgKCsraW5kZXggPCBjb3VudCAmJiAoYWN0aW9uID0gYWN0aW9ucy5zaGlmdCgpKSkge1xuICAgICAgICBhY3Rpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfVxufVxuIl19