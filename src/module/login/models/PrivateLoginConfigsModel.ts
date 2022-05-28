class PrivateLoginConfigsModel {
    public ghasedakSmsLoginTemplateName: string;
    public tokenSeed: string;
    
    constructor(ghasedakSmsLoginTemplateName: string = "", tokenSeed: string = "") {
        this.ghasedakSmsLoginTemplateName = ghasedakSmsLoginTemplateName;
        this.tokenSeed = tokenSeed;
    }
}
