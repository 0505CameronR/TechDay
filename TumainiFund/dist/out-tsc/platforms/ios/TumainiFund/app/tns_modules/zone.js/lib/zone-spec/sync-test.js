/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class SyncTestZoneSpec {
    constructor(namePrefix) {
        this.runZone = Zone.current;
        this.name = 'syncTestZone for ' + namePrefix;
    }
    onScheduleTask(delegate, current, target, task) {
        switch (task.type) {
            case 'microTask':
            case 'macroTask':
                throw new Error(`Cannot call ${task.source} from within a sync test.`);
            case 'eventTask':
                task = delegate.scheduleTask(target, task);
                break;
        }
        return task;
    }
}
// Export the class so that new instances can be created with proper
// constructor params.
Zone['SyncTestZoneSpec'] = SyncTestZoneSpec;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3luYy10ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvem9uZS1zcGVjL3N5bmMtdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxNQUFNLGdCQUFnQjtJQUdwQixZQUFZLFVBQWtCO1FBRjlCLFlBQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBR3JCLElBQUksQ0FBQyxJQUFJLEdBQUcsbUJBQW1CLEdBQUcsVUFBVSxDQUFDO0lBQy9DLENBQUM7SUFNRCxjQUFjLENBQUMsUUFBc0IsRUFBRSxPQUFhLEVBQUUsTUFBWSxFQUFFLElBQVU7UUFDNUUsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2pCLEtBQUssV0FBVyxDQUFDO1lBQ2pCLEtBQUssV0FBVztnQkFDZCxNQUFNLElBQUksS0FBSyxDQUFDLGVBQWUsSUFBSSxDQUFDLE1BQU0sMkJBQTJCLENBQUMsQ0FBQztZQUN6RSxLQUFLLFdBQVc7Z0JBQ2QsSUFBSSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUMzQyxNQUFNO1NBQ1Q7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7Q0FDRjtBQUVELG9FQUFvRTtBQUNwRSxzQkFBc0I7QUFDckIsSUFBWSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsZ0JBQWdCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmNsYXNzIFN5bmNUZXN0Wm9uZVNwZWMgaW1wbGVtZW50cyBab25lU3BlYyB7XG4gIHJ1blpvbmUgPSBab25lLmN1cnJlbnQ7XG5cbiAgY29uc3RydWN0b3IobmFtZVByZWZpeDogc3RyaW5nKSB7XG4gICAgdGhpcy5uYW1lID0gJ3N5bmNUZXN0Wm9uZSBmb3IgJyArIG5hbWVQcmVmaXg7XG4gIH1cblxuICAvLyBab25lU3BlYyBpbXBsZW1lbnRhdGlvbiBiZWxvdy5cblxuICBuYW1lOiBzdHJpbmc7XG5cbiAgb25TY2hlZHVsZVRhc2soZGVsZWdhdGU6IFpvbmVEZWxlZ2F0ZSwgY3VycmVudDogWm9uZSwgdGFyZ2V0OiBab25lLCB0YXNrOiBUYXNrKTogVGFzayB7XG4gICAgc3dpdGNoICh0YXNrLnR5cGUpIHtcbiAgICAgIGNhc2UgJ21pY3JvVGFzayc6XG4gICAgICBjYXNlICdtYWNyb1Rhc2snOlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBjYWxsICR7dGFzay5zb3VyY2V9IGZyb20gd2l0aGluIGEgc3luYyB0ZXN0LmApO1xuICAgICAgY2FzZSAnZXZlbnRUYXNrJzpcbiAgICAgICAgdGFzayA9IGRlbGVnYXRlLnNjaGVkdWxlVGFzayh0YXJnZXQsIHRhc2spO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIHRhc2s7XG4gIH1cbn1cblxuLy8gRXhwb3J0IHRoZSBjbGFzcyBzbyB0aGF0IG5ldyBpbnN0YW5jZXMgY2FuIGJlIGNyZWF0ZWQgd2l0aCBwcm9wZXJcbi8vIGNvbnN0cnVjdG9yIHBhcmFtcy5cbihab25lIGFzIGFueSlbJ1N5bmNUZXN0Wm9uZVNwZWMnXSA9IFN5bmNUZXN0Wm9uZVNwZWM7XG4iXX0=