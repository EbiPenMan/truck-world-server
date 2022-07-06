

const rpc_place_getList: nkruntime.RpcFunction =
    function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
        try {
            const input: QueryInputModel = JSON.parse(payload);
            let dbRes: PlaceModel[] = getPlacesList(ctx, logger, nk, input);
            return JSON.stringify(dbRes);
        } catch (e) {
            return JSON.stringify(new BaseResponseModel(null, new BaseErrorModel(0, "exception")));
        }
        
    }


