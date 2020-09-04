import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CookieStorageService {

    isConsented = false;

    /**
     * get cookie
     * @param {string} name
     * @returns {string}
     */
    public get(name: string): any {
        const ca: Array<string> = decodeURIComponent(document.cookie).split(';');
        const caLen: number = ca.length;
        const cookieName = `${name}=`;
        let c: string;

        for (let i = 0; i < caLen; i += 1) {
            c = ca[i].replace(/^\s+/g, '');
            if (c.indexOf(cookieName) === 0) {
                return JSON.parse(c.substring(cookieName.length, c.length));
            }
        }
        return null;
    }

    /**
   * Expires default 1 day 
   * If params.session is set and true expires is not added
   * If params.path is not set or value is not greater than 0 its default value will be root "/"
   * Secure flag can be activated only with https implemented
   * Examples of usage:
   * {service instance}.setCookie({name:'token',value:'abcd12345', session:true }); <- This cookie will not expire
   * {service instance}.setCookie({name:'userName',value:'John Doe', secure:true }); <- If page is not https then secure will not apply
   * {service instance}.setCookie({name:'niceCar', value:'red', expireDays:10 }); <- For all this examples if path is not provided default will be root
   */
    public set(params: { name?: string, expireDays?: number, value?: any, session?: boolean, path?: string, secure?: boolean }) {
        let d: Date = new Date();
        d.setTime(d.getTime() + (params.expireDays ? params.expireDays : 1) * 24 * 60 * 60 * 1000);
        document.cookie =
            (params.name ? params.name : '') + "=" + (params.value ? JSON.stringify(params.value) : '') + ";"
            + (params.session && params.session == true ? "" : "expires=" + d.toUTCString() + ";")
            + "path=" + (params.path && params.path.length > 0 ? params.path : "/") + ";"
            + (location.protocol === 'https:' && params.secure && params.secure == true ? "secure" : "");
    }

    /**
   * delete cookie
   * @param name
   */
    public deleteCookie(name) {
        this.set({ name: name, value: '', expireDays: -1 });
    }

    /**
     * consent
     * @param {boolean} isConsent
     * @param e
     * @param {string} COOKIE
     * @param {string} EXPIRE_DAYS
     * @returns {boolean}
     */
    public consent(isConsent: boolean, e: any, COOKIE: string, EXPIRE_DAYS: number) {
        if (!isConsent) {
            return this.isConsented;
        } else if (isConsent) {
            this.set({ name: COOKIE, value: '1', expireDays: EXPIRE_DAYS });
            this.isConsented = true;
            e.preventDefault();
        }
    }
}

export class CookieStorageKeys {
    public static PLAYER_STATE = 'player-state';
    public static SCHOOL_STATE = 'school-state';
}
