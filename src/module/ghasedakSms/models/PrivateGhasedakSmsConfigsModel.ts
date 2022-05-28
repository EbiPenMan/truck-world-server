class PrivateGhasedakSmsConfigsModel {
    public ghasedakSmsApiBaseUrl: string; // https://api.ghasedak.me/v2
    public ghasedakSmsApiKey: string;
    public verifySendEndPoint: string; // /verification/send/simple
    
    
    constructor(ghasedakSmsApiBaseUrl: string = "", ghasedakSmsApiKey: string = "", verifySendEndPoint: string = "") {
        this.ghasedakSmsApiBaseUrl = ghasedakSmsApiBaseUrl;
        this.ghasedakSmsApiKey = ghasedakSmsApiKey;
        this.verifySendEndPoint = verifySendEndPoint;
    }
}
