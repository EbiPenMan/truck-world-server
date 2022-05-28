const login_init = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama) {
    
    //TODO init db table needed for store codes
    //TODO get login configs from server
    createTables(ctx, logger, nk);
    initPrivateLoginConfigsDefault(nk, logger);
    
    
    
}


