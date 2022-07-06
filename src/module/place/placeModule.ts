const place_init = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama) {
    
    place_createTables(ctx, logger, nk);
    initPrivatePlaceConfigsDefault(nk, logger);
    
    
    
    
    
}


