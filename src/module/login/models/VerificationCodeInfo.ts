class VerificationCodeInfo {
    
    public phoneNumber: string;
    public deviceId: string;
    public code: number;
    
    
    constructor(phoneNumber: string = "", deviceId: string = "", code: number = null) {
        this.phoneNumber = phoneNumber;
        this.deviceId = deviceId;
        this.code = code;
    }
}
