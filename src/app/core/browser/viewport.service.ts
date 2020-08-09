import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

const DOCUMENT_ELEMENT = window.document.documentElement;

@Injectable({ providedIn: 'root' })
export class ViewportService {

    private shellResizedSubject: BehaviorSubject<ShellResizedInfo>;
    shellResized$: Observable<ShellResizedInfo>;
    previousResizedInfo: ShellResizedInfo;

    /////////////////////////////////////////////

    /** Watch browser resizes. */
    constructor() {
        this.shellResizedSubject = new BehaviorSubject<ShellResizedInfo>(this.getShellInfo());
        this.shellResized$ = this.shellResizedSubject.asObservable();

        // Notifiy subscribers of browser resizes
        fromEvent(window, 'resize')
            .pipe(debounceTime(300))
            .subscribe(_ => this.onResize());
    }

    onResize() {
        this.shellResizedSubject.next(this.getShellInfo());
    }

    getViewportW() {
        const clientWidth = DOCUMENT_ELEMENT['clientWidth'];
        const innerWidth = window['innerWidth'];
        if (clientWidth < innerWidth) {
            return innerWidth;
        } else {
            return clientWidth;
        }
    }

    getViewportH() {
        const client = DOCUMENT_ELEMENT['clientHeight'];
        const inner = window['innerHeight'];

        if (client < inner) {
            return inner;
        } else {
            return client;
        }
    }

    // http://stackoverflow.com/a/5598797/989439
    getOffset(el: HTMLElement) {
        let offsetTop = 0;
        let offsetLeft = 0;

        do {
            if (!isNaN(el.offsetTop)) {
                offsetTop += el.offsetTop;
            }
            if (!isNaN(el.offsetLeft)) {
                offsetLeft += el.offsetLeft;
            }
        } while (el = el.offsetParent as HTMLElement);

        return {
            top: offsetTop,
            left: offsetLeft
        };
    }

    scrollY() {
        return window.pageYOffset || DOCUMENT_ELEMENT.scrollTop;
    }

    getShellInfo(): ShellResizedInfo {
        const shellInfo: ShellResizedInfo = {
            viewportWidth: this.getViewportW(),
            viewportHeight: this.getViewportH(),
        };

        if (!this.previousResizedInfo || shellInfo.viewportWidth !== this.previousResizedInfo.viewportWidth) {
            shellInfo.widthChanged = true;
        }
        if (!this.previousResizedInfo || shellInfo.viewportHeight !== this.previousResizedInfo.viewportHeight) {
            shellInfo.heightChanged = true;
        }
        this.previousResizedInfo = Object.assign({}, shellInfo);

        return shellInfo;
    }
}

export class ShellResizedInfo {
    viewportWidth: number;
    viewportHeight: number;
    widthChanged?: boolean;
    heightChanged?: boolean;
}

