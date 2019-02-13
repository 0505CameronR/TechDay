"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AnimationFrameAction_1 = require("./AnimationFrameAction");
var AnimationFrameScheduler_1 = require("./AnimationFrameScheduler");
/**
 *
 * Animation Frame Scheduler
 *
 * <span class="informal">Perform task when `window.requestAnimationFrame` would fire</span>
 *
 * When `animationFrame` scheduler is used with delay, it will fall back to {@link asyncScheduler} scheduler
 * behaviour.
 *
 * Without delay, `animationFrame` scheduler can be used to create smooth browser animations.
 * It makes sure scheduled task will happen just before next browser content repaint,
 * thus performing animations as efficiently as possible.
 *
 * ## Example
 * Schedule div height animation
 * ```javascript
 * const div = document.querySelector('.some-div');
 *
 * Rx.Scheduler.animationFrame.schedule(function(height) {
 *   div.style.height = height + "px";
 *
 *   this.schedule(height + 1);  // `this` references currently executing Action,
 *                               // which we reschedule with new state
 * }, 0, 0);
 *
 * // You will see .some-div element growing in height
 * ```
 *
 * @static true
 * @name animationFrame
 * @owner Scheduler
 */
exports.animationFrame = new AnimationFrameScheduler_1.AnimationFrameScheduler(AnimationFrameAction_1.AnimationFrameAction);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uRnJhbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL3NjaGVkdWxlci9hbmltYXRpb25GcmFtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtEQUE4RDtBQUM5RCxxRUFBb0U7QUFFcEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0ErQkc7QUFFVSxRQUFBLGNBQWMsR0FBRyxJQUFJLGlEQUF1QixDQUFDLDJDQUFvQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBbmltYXRpb25GcmFtZUFjdGlvbiB9IGZyb20gJy4vQW5pbWF0aW9uRnJhbWVBY3Rpb24nO1xuaW1wb3J0IHsgQW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIgfSBmcm9tICcuL0FuaW1hdGlvbkZyYW1lU2NoZWR1bGVyJztcblxuLyoqXG4gKlxuICogQW5pbWF0aW9uIEZyYW1lIFNjaGVkdWxlclxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5QZXJmb3JtIHRhc2sgd2hlbiBgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZWAgd291bGQgZmlyZTwvc3Bhbj5cbiAqXG4gKiBXaGVuIGBhbmltYXRpb25GcmFtZWAgc2NoZWR1bGVyIGlzIHVzZWQgd2l0aCBkZWxheSwgaXQgd2lsbCBmYWxsIGJhY2sgdG8ge0BsaW5rIGFzeW5jU2NoZWR1bGVyfSBzY2hlZHVsZXJcbiAqIGJlaGF2aW91ci5cbiAqXG4gKiBXaXRob3V0IGRlbGF5LCBgYW5pbWF0aW9uRnJhbWVgIHNjaGVkdWxlciBjYW4gYmUgdXNlZCB0byBjcmVhdGUgc21vb3RoIGJyb3dzZXIgYW5pbWF0aW9ucy5cbiAqIEl0IG1ha2VzIHN1cmUgc2NoZWR1bGVkIHRhc2sgd2lsbCBoYXBwZW4ganVzdCBiZWZvcmUgbmV4dCBicm93c2VyIGNvbnRlbnQgcmVwYWludCxcbiAqIHRodXMgcGVyZm9ybWluZyBhbmltYXRpb25zIGFzIGVmZmljaWVudGx5IGFzIHBvc3NpYmxlLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIFNjaGVkdWxlIGRpdiBoZWlnaHQgYW5pbWF0aW9uXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBkaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc29tZS1kaXYnKTtcbiAqXG4gKiBSeC5TY2hlZHVsZXIuYW5pbWF0aW9uRnJhbWUuc2NoZWR1bGUoZnVuY3Rpb24oaGVpZ2h0KSB7XG4gKiAgIGRpdi5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyBcInB4XCI7XG4gKlxuICogICB0aGlzLnNjaGVkdWxlKGhlaWdodCArIDEpOyAgLy8gYHRoaXNgIHJlZmVyZW5jZXMgY3VycmVudGx5IGV4ZWN1dGluZyBBY3Rpb24sXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3aGljaCB3ZSByZXNjaGVkdWxlIHdpdGggbmV3IHN0YXRlXG4gKiB9LCAwLCAwKTtcbiAqXG4gKiAvLyBZb3Ugd2lsbCBzZWUgLnNvbWUtZGl2IGVsZW1lbnQgZ3Jvd2luZyBpbiBoZWlnaHRcbiAqIGBgYFxuICpcbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgYW5pbWF0aW9uRnJhbWVcbiAqIEBvd25lciBTY2hlZHVsZXJcbiAqL1xuXG5leHBvcnQgY29uc3QgYW5pbWF0aW9uRnJhbWUgPSBuZXcgQW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIoQW5pbWF0aW9uRnJhbWVBY3Rpb24pO1xuIl19