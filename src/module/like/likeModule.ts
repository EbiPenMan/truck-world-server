const like_init = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama) {
    
    like_createTables(ctx, logger, nk);
    initPrivateLikeConfigsDefault(nk, logger);
    
    
    
    
    
}


