const place_init = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama) {
    
    place_createTables(ctx, logger, nk);
    initPrivateCommentConfigsDefault(nk, logger);
    
    
    
    
    
}


