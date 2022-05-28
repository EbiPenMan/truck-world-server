class VerificationCodeDbModel {
    
    public phone_number: string;
    public unique_identifier: string;
    public code: number;
    public updated_at: string;
    
    
    constructor(phone_number: string = null, unique_identifier: string = null, code: number = null, updated_at: string = null) {
        this.phone_number = phone_number;
        this.unique_identifier = unique_identifier;
        this.code = code;
        this.updated_at = updated_at;
    }
}
