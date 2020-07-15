export class Avatar {
    skin: string;
    hasUnicornHorn: boolean;
    hasGlasses: boolean;

    static resetAvatar(): Avatar {
        return {
            skin: '../../../assets/images/avatar/catHead.png',
            hasUnicornHorn: false,
            hasGlasses: false,
        };
    }
}