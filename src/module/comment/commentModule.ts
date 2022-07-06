const comment_init = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama) {
    
    comment_createTables(ctx, logger, nk);
    initPrivateCommentConfigsDefault(nk, logger);
    
    
    
    
    
}


