const ghasedakSms_init = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama) {
    initPrivateGhasedakSmsConfigsDefault(nk, logger);
}

function sendVerificationCode(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama,
                              phoneNumber: string, template: string, params: string[]): GhasedakSmsResponse {
    
    logger.info("sendVerificationCode start");
    
    
    let smsConfig: PrivateGhasedakSmsConfigsModel = getPrivateGhasedakSmsConfigs(nk, logger)[1];
    let smsApiUrl: string = `${smsConfig.ghasedakSmsApiBaseUrl}/${smsConfig.verifySendEndPoint}`;
    let headers: any = {
        "Content-Type": "application/x-www-form-urlencoded",
        "apikey": smsConfig.ghasedakSmsApiKey,
    };
    
    let body: string = `receptor=${phoneNumber}&template=${template}&type=1`
    
    params.forEach(function (param, index) {
        body += `&param${index+1}=${param}`
    })
    
    logger.info("sendVerificationCode smsApiUrl: " + smsApiUrl);
    logger.info("sendVerificationCode body: " + body);
    
    
    let res: nkruntime.HttpResponse = nk.httpRequest(smsApiUrl, "post", headers, body, 7000);
    let kavenegarSmsRes: GhasedakSmsResponse = JSON.parse(res.body) as GhasedakSmsResponse;
    return kavenegarSmsRes;
    
}
