class VerificationCodeInfo {

    public phoneNumber : string;
    public deviceId : string;

    constructor(phoneNumber: string = "", deviceId: string = "") {
        this.phoneNumber = phoneNumber;
        this.deviceId = deviceId;
    }
}
