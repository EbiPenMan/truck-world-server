let InitModule: nkruntime.InitModule =
    function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, initializer: nkruntime.Initializer) {
        logger.info("TypeScript - Main ****************");
        
        server_init(ctx, logger, nk);
        ghasedakSms_init(ctx, logger, nk);
        
        login_init(ctx, logger, nk);
        initializer.registerRpc('rpc_login_getVerificationCode', rpc_login_getVerificationCode);
        initializer.registerRpc('rpc_login_checkVerificationCode', rpc_login_checkVerificationCode);
        initializer.registerAfterAuthenticateDevice(hook_login_afterAuthenticateDevice);
        initializer.registerBeforeAuthenticateCustom(hook_login_beforeAuthenticateCustom);
        initializer.registerAfterAuthenticateCustom(hook_login_afterAuthenticateCustom);
        
        place_init(ctx, logger, nk);
        
        // InitTable(nk, logger);
        // InitConfigs(nk, logger);
        
        // --- debug - must disable on production
        // initializer.registerRpc('rpcSelectQuery', rpcSelectQuery);
        
        
        // --- user
        // initializer.registerRpc('rpcChangeOwnDisplayName', rpcChangeOwnDisplayName);
        
    }
