import { OnDestroy, Component } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    template: ''
})
export abstract class ComponentBase implements OnDestroy {

    protected unsubscribe = new Subject();

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
