import { Subscription } from './Subscription';
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
export class SubjectSubscription extends Subscription {
    constructor(subject, subscriber) {
        super();
        this.subject = subject;
        this.subscriber = subscriber;
        this.closed = false;
    }
    unsubscribe() {
        if (this.closed) {
            return;
        }
        this.closed = true;
        const subject = this.subject;
        const observers = subject.observers;
        this.subject = null;
        if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
            return;
        }
        const subscriberIndex = observers.indexOf(this.subscriber);
        if (subscriberIndex !== -1) {
            observers.splice(subscriberIndex, 1);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3ViamVjdFN1YnNjcmlwdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL1N1YmplY3RTdWJzY3JpcHRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTlDOzs7O0dBSUc7QUFDSCxNQUFNLE9BQU8sbUJBQXVCLFNBQVEsWUFBWTtJQUd0RCxZQUFtQixPQUFtQixFQUFTLFVBQXVCO1FBQ3BFLEtBQUssRUFBRSxDQUFDO1FBRFMsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQUFTLGVBQVUsR0FBVixVQUFVLENBQWE7UUFGdEUsV0FBTSxHQUFZLEtBQUssQ0FBQztJQUl4QixDQUFDO0lBRUQsV0FBVztRQUNULElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNmLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBRW5CLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDN0IsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztRQUVwQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUVwQixJQUFJLENBQUMsU0FBUyxJQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLE9BQU8sQ0FBQyxTQUFTLElBQUksT0FBTyxDQUFDLE1BQU0sRUFBRTtZQUMvRSxPQUFPO1NBQ1I7UUFFRCxNQUFNLGVBQWUsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUUzRCxJQUFJLGVBQWUsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUN0QztJQUNILENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuL1N1YmplY3QnO1xuaW1wb3J0IHsgT2JzZXJ2ZXIgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4vU3Vic2NyaXB0aW9uJztcblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmV4cG9ydCBjbGFzcyBTdWJqZWN0U3Vic2NyaXB0aW9uPFQ+IGV4dGVuZHMgU3Vic2NyaXB0aW9uIHtcbiAgY2xvc2VkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHN1YmplY3Q6IFN1YmplY3Q8VD4sIHB1YmxpYyBzdWJzY3JpYmVyOiBPYnNlcnZlcjxUPikge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICB1bnN1YnNjcmliZSgpIHtcbiAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNsb3NlZCA9IHRydWU7XG5cbiAgICBjb25zdCBzdWJqZWN0ID0gdGhpcy5zdWJqZWN0O1xuICAgIGNvbnN0IG9ic2VydmVycyA9IHN1YmplY3Qub2JzZXJ2ZXJzO1xuXG4gICAgdGhpcy5zdWJqZWN0ID0gbnVsbDtcblxuICAgIGlmICghb2JzZXJ2ZXJzIHx8IG9ic2VydmVycy5sZW5ndGggPT09IDAgfHwgc3ViamVjdC5pc1N0b3BwZWQgfHwgc3ViamVjdC5jbG9zZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzdWJzY3JpYmVySW5kZXggPSBvYnNlcnZlcnMuaW5kZXhPZih0aGlzLnN1YnNjcmliZXIpO1xuXG4gICAgaWYgKHN1YnNjcmliZXJJbmRleCAhPT0gLTEpIHtcbiAgICAgIG9ic2VydmVycy5zcGxpY2Uoc3Vic2NyaWJlckluZGV4LCAxKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==