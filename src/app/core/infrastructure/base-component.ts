import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

export abstract class BaseComponent implements OnDestroy {

    protected unsubscribe = new Subject();

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
