import { Observable } from '../Observable';
import { async } from '../scheduler/async';
import { isNumeric } from '../util/isNumeric';
import { isScheduler } from '../util/isScheduler';
/**
 * Creates an Observable that starts emitting after an `dueTime` and
 * emits ever increasing numbers after each `period` of time thereafter.
 *
 * <span class="informal">Its like {@link index/interval}, but you can specify when
 * should the emissions start.</span>
 *
 * ![](timer.png)
 *
 * `timer` returns an Observable that emits an infinite sequence of ascending
 * integers, with a constant interval of time, `period` of your choosing
 * between those emissions. The first emission happens after the specified
 * `dueTime`. The initial delay may be a `Date`. By default, this
 * operator uses the {@link asyncScheduler} {@link SchedulerLike} to provide a notion of time, but you
 * may pass any {@link SchedulerLike} to it. If `period` is not specified, the output
 * Observable emits only one value, `0`. Otherwise, it emits an infinite
 * sequence.
 *
 * ## Examples
 * ### Emits ascending numbers, one every second (1000ms), starting after 3 seconds
 * ```javascript
 * const numbers = timer(3000, 1000);
 * numbers.subscribe(x => console.log(x));
 * ```
 *
 * ### Emits one number after five seconds
 * ```javascript
 * const numbers = timer(5000);
 * numbers.subscribe(x => console.log(x));
 * ```
 * @see {@link index/interval}
 * @see {@link delay}
 *
 * @param {number|Date} [dueTime] The initial delay time specified as a Date object or as an integer denoting
 * milliseconds to wait before emitting the first value of 0`.
 * @param {number|SchedulerLike} [periodOrScheduler] The period of time between emissions of the
 * subsequent numbers.
 * @param {SchedulerLike} [scheduler=async] The {@link SchedulerLike} to use for scheduling
 * the emission of values, and providing a notion of "time".
 * @return {Observable} An Observable that emits a `0` after the
 * `dueTime` and ever increasing numbers after each `period` of time
 * thereafter.
 * @static true
 * @name timer
 * @owner Observable
 */
export function timer(dueTime = 0, periodOrScheduler, scheduler) {
    let period = -1;
    if (isNumeric(periodOrScheduler)) {
        period = Number(periodOrScheduler) < 1 && 1 || Number(periodOrScheduler);
    }
    else if (isScheduler(periodOrScheduler)) {
        scheduler = periodOrScheduler;
    }
    if (!isScheduler(scheduler)) {
        scheduler = async;
    }
    return new Observable(subscriber => {
        const due = isNumeric(dueTime)
            ? dueTime
            : (+dueTime - scheduler.now());
        return scheduler.schedule(dispatch, due, {
            index: 0, period, subscriber
        });
    });
}
function dispatch(state) {
    const { index, period, subscriber } = state;
    subscriber.next(index);
    if (subscriber.closed) {
        return;
    }
    else if (period === -1) {
        return subscriber.complete();
    }
    state.index = index + 1;
    this.schedule(state, period);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZW9zL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL3RpbWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM5QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFHbEQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTZDRztBQUNILE1BQU0sVUFBVSxLQUFLLENBQUMsVUFBeUIsQ0FBQyxFQUMxQixpQkFBMEMsRUFDMUMsU0FBeUI7SUFDN0MsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDaEIsSUFBSSxTQUFTLENBQUMsaUJBQWlCLENBQUMsRUFBRTtRQUNoQyxNQUFNLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztLQUMxRTtTQUFNLElBQUksV0FBVyxDQUFDLGlCQUFpQixDQUFDLEVBQUU7UUFDekMsU0FBUyxHQUFHLGlCQUF3QixDQUFDO0tBQ3RDO0lBRUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsRUFBRTtRQUMzQixTQUFTLEdBQUcsS0FBSyxDQUFDO0tBQ25CO0lBRUQsT0FBTyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUNqQyxNQUFNLEdBQUcsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDO1lBQzVCLENBQUMsQ0FBRSxPQUFrQjtZQUNyQixDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUVqQyxPQUFPLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtZQUN2QyxLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxVQUFVO1NBQzdCLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQVFELFNBQVMsUUFBUSxDQUFvQyxLQUFpQjtJQUNwRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyxLQUFLLENBQUM7SUFDNUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUV2QixJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUU7UUFDckIsT0FBTztLQUNSO1NBQU0sSUFBSSxNQUFNLEtBQUssQ0FBQyxDQUFDLEVBQUU7UUFDeEIsT0FBTyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDOUI7SUFFRCxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDeEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDL0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFNjaGVkdWxlckFjdGlvbiwgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGFzeW5jIH0gZnJvbSAnLi4vc2NoZWR1bGVyL2FzeW5jJztcbmltcG9ydCB7IGlzTnVtZXJpYyB9IGZyb20gJy4uL3V0aWwvaXNOdW1lcmljJztcbmltcG9ydCB7IGlzU2NoZWR1bGVyIH0gZnJvbSAnLi4vdXRpbC9pc1NjaGVkdWxlcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBPYnNlcnZhYmxlIHRoYXQgc3RhcnRzIGVtaXR0aW5nIGFmdGVyIGFuIGBkdWVUaW1lYCBhbmRcbiAqIGVtaXRzIGV2ZXIgaW5jcmVhc2luZyBudW1iZXJzIGFmdGVyIGVhY2ggYHBlcmlvZGAgb2YgdGltZSB0aGVyZWFmdGVyLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5JdHMgbGlrZSB7QGxpbmsgaW5kZXgvaW50ZXJ2YWx9LCBidXQgeW91IGNhbiBzcGVjaWZ5IHdoZW5cbiAqIHNob3VsZCB0aGUgZW1pc3Npb25zIHN0YXJ0Ljwvc3Bhbj5cbiAqXG4gKiAhW10odGltZXIucG5nKVxuICpcbiAqIGB0aW1lcmAgcmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgYW4gaW5maW5pdGUgc2VxdWVuY2Ugb2YgYXNjZW5kaW5nXG4gKiBpbnRlZ2Vycywgd2l0aCBhIGNvbnN0YW50IGludGVydmFsIG9mIHRpbWUsIGBwZXJpb2RgIG9mIHlvdXIgY2hvb3NpbmdcbiAqIGJldHdlZW4gdGhvc2UgZW1pc3Npb25zLiBUaGUgZmlyc3QgZW1pc3Npb24gaGFwcGVucyBhZnRlciB0aGUgc3BlY2lmaWVkXG4gKiBgZHVlVGltZWAuIFRoZSBpbml0aWFsIGRlbGF5IG1heSBiZSBhIGBEYXRlYC4gQnkgZGVmYXVsdCwgdGhpc1xuICogb3BlcmF0b3IgdXNlcyB0aGUge0BsaW5rIGFzeW5jU2NoZWR1bGVyfSB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gcHJvdmlkZSBhIG5vdGlvbiBvZiB0aW1lLCBidXQgeW91XG4gKiBtYXkgcGFzcyBhbnkge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIGl0LiBJZiBgcGVyaW9kYCBpcyBub3Qgc3BlY2lmaWVkLCB0aGUgb3V0cHV0XG4gKiBPYnNlcnZhYmxlIGVtaXRzIG9ubHkgb25lIHZhbHVlLCBgMGAuIE90aGVyd2lzZSwgaXQgZW1pdHMgYW4gaW5maW5pdGVcbiAqIHNlcXVlbmNlLlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiAjIyMgRW1pdHMgYXNjZW5kaW5nIG51bWJlcnMsIG9uZSBldmVyeSBzZWNvbmQgKDEwMDBtcyksIHN0YXJ0aW5nIGFmdGVyIDMgc2Vjb25kc1xuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgbnVtYmVycyA9IHRpbWVyKDMwMDAsIDEwMDApO1xuICogbnVtYmVycy5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgRW1pdHMgb25lIG51bWJlciBhZnRlciBmaXZlIHNlY29uZHNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IG51bWJlcnMgPSB0aW1lcig1MDAwKTtcbiAqIG51bWJlcnMuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKiBAc2VlIHtAbGluayBpbmRleC9pbnRlcnZhbH1cbiAqIEBzZWUge0BsaW5rIGRlbGF5fVxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfERhdGV9IFtkdWVUaW1lXSBUaGUgaW5pdGlhbCBkZWxheSB0aW1lIHNwZWNpZmllZCBhcyBhIERhdGUgb2JqZWN0IG9yIGFzIGFuIGludGVnZXIgZGVub3RpbmdcbiAqIG1pbGxpc2Vjb25kcyB0byB3YWl0IGJlZm9yZSBlbWl0dGluZyB0aGUgZmlyc3QgdmFsdWUgb2YgMGAuXG4gKiBAcGFyYW0ge251bWJlcnxTY2hlZHVsZXJMaWtlfSBbcGVyaW9kT3JTY2hlZHVsZXJdIFRoZSBwZXJpb2Qgb2YgdGltZSBiZXR3ZWVuIGVtaXNzaW9ucyBvZiB0aGVcbiAqIHN1YnNlcXVlbnQgbnVtYmVycy5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcj1hc3luY10gVGhlIHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byB1c2UgZm9yIHNjaGVkdWxpbmdcbiAqIHRoZSBlbWlzc2lvbiBvZiB2YWx1ZXMsIGFuZCBwcm92aWRpbmcgYSBub3Rpb24gb2YgXCJ0aW1lXCIuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgYSBgMGAgYWZ0ZXIgdGhlXG4gKiBgZHVlVGltZWAgYW5kIGV2ZXIgaW5jcmVhc2luZyBudW1iZXJzIGFmdGVyIGVhY2ggYHBlcmlvZGAgb2YgdGltZVxuICogdGhlcmVhZnRlci5cbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgdGltZXJcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aW1lcihkdWVUaW1lOiBudW1iZXIgfCBEYXRlID0gMCxcbiAgICAgICAgICAgICAgICAgICAgICBwZXJpb2RPclNjaGVkdWxlcj86IG51bWJlciB8IFNjaGVkdWxlckxpa2UsXG4gICAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8bnVtYmVyPiB7XG4gIGxldCBwZXJpb2QgPSAtMTtcbiAgaWYgKGlzTnVtZXJpYyhwZXJpb2RPclNjaGVkdWxlcikpIHtcbiAgICBwZXJpb2QgPSBOdW1iZXIocGVyaW9kT3JTY2hlZHVsZXIpIDwgMSAmJiAxIHx8IE51bWJlcihwZXJpb2RPclNjaGVkdWxlcik7XG4gIH0gZWxzZSBpZiAoaXNTY2hlZHVsZXIocGVyaW9kT3JTY2hlZHVsZXIpKSB7XG4gICAgc2NoZWR1bGVyID0gcGVyaW9kT3JTY2hlZHVsZXIgYXMgYW55O1xuICB9XG5cbiAgaWYgKCFpc1NjaGVkdWxlcihzY2hlZHVsZXIpKSB7XG4gICAgc2NoZWR1bGVyID0gYXN5bmM7XG4gIH1cblxuICByZXR1cm4gbmV3IE9ic2VydmFibGUoc3Vic2NyaWJlciA9PiB7XG4gICAgY29uc3QgZHVlID0gaXNOdW1lcmljKGR1ZVRpbWUpXG4gICAgICA/IChkdWVUaW1lIGFzIG51bWJlcilcbiAgICAgIDogKCtkdWVUaW1lIC0gc2NoZWR1bGVyLm5vdygpKTtcblxuICAgIHJldHVybiBzY2hlZHVsZXIuc2NoZWR1bGUoZGlzcGF0Y2gsIGR1ZSwge1xuICAgICAgaW5kZXg6IDAsIHBlcmlvZCwgc3Vic2NyaWJlclxuICAgIH0pO1xuICB9KTtcbn1cblxuaW50ZXJmYWNlIFRpbWVyU3RhdGUge1xuICBpbmRleDogbnVtYmVyO1xuICBwZXJpb2Q6IG51bWJlcjtcbiAgc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxudW1iZXI+O1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaCh0aGlzOiBTY2hlZHVsZXJBY3Rpb248VGltZXJTdGF0ZT4sIHN0YXRlOiBUaW1lclN0YXRlKSB7XG4gIGNvbnN0IHsgaW5kZXgsIHBlcmlvZCwgc3Vic2NyaWJlciB9ID0gc3RhdGU7XG4gIHN1YnNjcmliZXIubmV4dChpbmRleCk7XG5cbiAgaWYgKHN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgcmV0dXJuO1xuICB9IGVsc2UgaWYgKHBlcmlvZCA9PT0gLTEpIHtcbiAgICByZXR1cm4gc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICB9XG5cbiAgc3RhdGUuaW5kZXggPSBpbmRleCArIDE7XG4gIHRoaXMuc2NoZWR1bGUoc3RhdGUsIHBlcmlvZCk7XG59XG4iXX0=