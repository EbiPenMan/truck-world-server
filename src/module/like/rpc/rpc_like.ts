const rpc_like_getList: nkruntime.RpcFunction =
    function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
        try {
            const input: QueryInputModel = JSON.parse(payload);
            let dbRes: LikeModel[] = getLikesList(ctx, logger, nk, input);
            return JSON.stringify(dbRes);
        } catch (e) {
            return JSON.stringify(new BaseResponseModel(null, new BaseErrorModel(0, "exception")));
        }
        
    }
    
//TODO save like
//TODO delete like
//TODO update like
