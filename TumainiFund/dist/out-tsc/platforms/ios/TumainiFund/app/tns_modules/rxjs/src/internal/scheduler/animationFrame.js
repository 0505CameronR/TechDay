import { AnimationFrameAction } from './AnimationFrameAction';
import { AnimationFrameScheduler } from './AnimationFrameScheduler';
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
 * // html: <div style="background: #0ff;"></div>
 * import { animationFrameScheduler } from 'rxjs';
 *
 * const div = document.querySelector('div');
 *
 * animationFrameScheduler.schedule(function(height) {
 *   div.style.height = height + "px";
 *
 *   this.schedule(height + 1);  // `this` references currently executing Action,
 *                               // which we reschedule with new state
 * }, 0, 0);
 *
 * // You will see a div element growing in height
 * ```
 *
 * @static true
 * @name animationFrame
 * @owner Scheduler
 */
export const animationFrame = new AnimationFrameScheduler(AnimationFrameAction);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uRnJhbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9zY2hlZHVsZXIvYW5pbWF0aW9uRnJhbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDOUQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFcEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrQ0c7QUFFSCxNQUFNLENBQUMsTUFBTSxjQUFjLEdBQUcsSUFBSSx1QkFBdUIsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQW5pbWF0aW9uRnJhbWVBY3Rpb24gfSBmcm9tICcuL0FuaW1hdGlvbkZyYW1lQWN0aW9uJztcbmltcG9ydCB7IEFuaW1hdGlvbkZyYW1lU2NoZWR1bGVyIH0gZnJvbSAnLi9BbmltYXRpb25GcmFtZVNjaGVkdWxlcic7XG5cbi8qKlxuICpcbiAqIEFuaW1hdGlvbiBGcmFtZSBTY2hlZHVsZXJcbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+UGVyZm9ybSB0YXNrIHdoZW4gYHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIHdvdWxkIGZpcmU8L3NwYW4+XG4gKlxuICogV2hlbiBgYW5pbWF0aW9uRnJhbWVgIHNjaGVkdWxlciBpcyB1c2VkIHdpdGggZGVsYXksIGl0IHdpbGwgZmFsbCBiYWNrIHRvIHtAbGluayBhc3luY1NjaGVkdWxlcn0gc2NoZWR1bGVyXG4gKiBiZWhhdmlvdXIuXG4gKlxuICogV2l0aG91dCBkZWxheSwgYGFuaW1hdGlvbkZyYW1lYCBzY2hlZHVsZXIgY2FuIGJlIHVzZWQgdG8gY3JlYXRlIHNtb290aCBicm93c2VyIGFuaW1hdGlvbnMuXG4gKiBJdCBtYWtlcyBzdXJlIHNjaGVkdWxlZCB0YXNrIHdpbGwgaGFwcGVuIGp1c3QgYmVmb3JlIG5leHQgYnJvd3NlciBjb250ZW50IHJlcGFpbnQsXG4gKiB0aHVzIHBlcmZvcm1pbmcgYW5pbWF0aW9ucyBhcyBlZmZpY2llbnRseSBhcyBwb3NzaWJsZS5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBTY2hlZHVsZSBkaXYgaGVpZ2h0IGFuaW1hdGlvblxuICogYGBgamF2YXNjcmlwdFxuICogLy8gaHRtbDogPGRpdiBzdHlsZT1cImJhY2tncm91bmQ6ICMwZmY7XCI+PC9kaXY+XG4gKiBpbXBvcnQgeyBhbmltYXRpb25GcmFtZVNjaGVkdWxlciB9IGZyb20gJ3J4anMnO1xuICpcbiAqIGNvbnN0IGRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2RpdicpO1xuICpcbiAqIGFuaW1hdGlvbkZyYW1lU2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uKGhlaWdodCkge1xuICogICBkaXYuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgXCJweFwiO1xuICpcbiAqICAgdGhpcy5zY2hlZHVsZShoZWlnaHQgKyAxKTsgIC8vIGB0aGlzYCByZWZlcmVuY2VzIGN1cnJlbnRseSBleGVjdXRpbmcgQWN0aW9uLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2hpY2ggd2UgcmVzY2hlZHVsZSB3aXRoIG5ldyBzdGF0ZVxuICogfSwgMCwgMCk7XG4gKlxuICogLy8gWW91IHdpbGwgc2VlIGEgZGl2IGVsZW1lbnQgZ3Jvd2luZyBpbiBoZWlnaHRcbiAqIGBgYFxuICpcbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgYW5pbWF0aW9uRnJhbWVcbiAqIEBvd25lciBTY2hlZHVsZXJcbiAqL1xuXG5leHBvcnQgY29uc3QgYW5pbWF0aW9uRnJhbWUgPSBuZXcgQW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIoQW5pbWF0aW9uRnJhbWVBY3Rpb24pO1xuIl19