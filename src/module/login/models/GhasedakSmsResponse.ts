class GhasedakSmsRes {

    public result: KavenegarSmsResReturn;
    public entries: KavenegarSmsResEntry;

    constructor(status: KavenegarSmsResReturn = null, entries: KavenegarSmsResEntry = null) {
        this.status = status;
        this.entries = entries;
    }
}

class KavenegarSmsResEntry {

    public messageid: number;
    public message: string;
    public status: number;
    public statustext: string;
    public sender: string;
    public receptor: string;
    public date: Date;
    public cost: number;


    constructor(messageid: number = null, message: string = null, status: number = null, statustext: string = null,
                sender: string = null, receptor: string = null, date: Date = null, cost: number = null) {
        this.messageid = messageid;
        this.message = message;
        this.status = status;
        this.statustext = statustext;
        this.sender = sender;
        this.receptor = receptor;
        this.date = date;
        this.cost = cost;
    }
}

class KavenegarSmsResReturn {

    public status: number;
    public message: string;


    constructor(status: number = null, message: string = null) {
        this.status = status;
        this.message = message;
    }
}

