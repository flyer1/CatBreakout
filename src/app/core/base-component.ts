import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

/** A base class for components which includes an "unsubscribe" subject which is automatically completed upon destruction of the component */
export abstract class BaseComponent implements OnDestroy {

    protected unsubscribe = new Subject();

    /** Completes the unsubscribe subject
     * @description IMPLEMENTATION note:  Ensure you call super.ngOnDestroy() if you override this method in component
    */
    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
