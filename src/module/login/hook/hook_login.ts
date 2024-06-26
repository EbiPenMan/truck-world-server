const hook_login_afterAuthenticateDevice: nkruntime.AfterHookFunction<nkruntime.Session, nkruntime.AuthenticateDeviceRequest> =
    function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, data: nkruntime.Session, request: nkruntime.AuthenticateDeviceRequest) {
        if (data.created) {
            setDefaultWallet(ctx, logger, nk, null, true);
            changeDisplayName(ctx, logger, nk, "Guest " + ctx.username);
            initUserConfigsDefault(ctx, nk, logger);
        } else {
            
        
        }
        
    }


const hook_login_beforeAuthenticateCustom: nkruntime.BeforeHookFunction<nkruntime.AuthenticateCustomRequest> =
    function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, request: nkruntime.AuthenticateCustomRequest) {
        
        try {
            logger.info("hook_login_beforeAuthenticateCustom start");
            if (request.account.vars.token == null || request.account.vars.token == "") {
                return null;
            }
            
            logger.info("hook_login_beforeAuthenticateCustom 1");
    
            let tokenStr: string = decrypt(getPrivateLoginConfigs(nk, logger)[1].tokenSeed, request.account.vars.token);
            if (tokenStr == null || tokenStr == "") {
                return null;
            }
            logger.info("hook_login_beforeAuthenticateCustom 2");
    
            let tokenParsed: any = JSON.parse(tokenStr);
    
            logger.info("hook_login_beforeAuthenticateCustom 3");
            logger.info("hook_login_beforeAuthenticateCustom tokenParsed: " + JSON.stringify(tokenParsed));
            logger.info("parseISOString(tokenParsed.createdAt).getTime(): " + new Date(tokenParsed.createdAt).getTime());
            logger.info("dateAdd(new Date(), 'month', 6): " + dateAdd(new Date(), 'month', 6).getTime());
    
            if (tokenParsed.phoneNumber == null || tokenParsed.phoneNumber == "" ||
                tokenParsed.unique_identifier == null || tokenParsed.unique_identifier == "" ||
                tokenParsed.createdAt == null ||
                new Date(tokenParsed.createdAt).getTime() > dateAdd(new Date(), 'month', 6).getTime()) {
                logger.info("hook_login_beforeAuthenticateCustom 4");
                return null;
            }
            logger.info("hook_login_beforeAuthenticateCustom 5");
    
            request.account.id = tokenParsed.phoneNumber;
            
            return request;
            
        } catch (e) {
            return null;
        }
        
        
    }


const hook_login_afterAuthenticateCustom: nkruntime.AfterHookFunction<nkruntime.Session, nkruntime.AuthenticateCustomRequest> =
    function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, data: nkruntime.Session, request: nkruntime.AuthenticateCustomRequest) {
        if (data.created) {
            setDefaultWallet(ctx, logger, nk, null, true);
            changeDisplayName(ctx, logger, nk, "TIRO " + ctx.username);
            initUserConfigsDefault(ctx, nk, logger);
        } else {
            
        
        }
        
    }
