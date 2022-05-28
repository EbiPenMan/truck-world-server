class GhasedakSmsResponse {

    public result: GhasedakSmsResult;
    public items: number[];
    
    constructor(result: GhasedakSmsResult = null, items: number[] = []) {
        this.result = result;
        this.items = items;
    }
}



class GhasedakSmsResult {

    public code: number;
    public message: string;

    constructor(code: number = null, message: string = null) {
        this.code = code;
        this.message = message;
    }
}



