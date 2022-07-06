const rpc_comment_getList: nkruntime.RpcFunction =
    function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
        try {
            const input: QueryInputModel = JSON.parse(payload);
            let dbRes: CommentModel[] = getCommentsList(ctx, logger, nk, input);
            return JSON.stringify(dbRes);
        } catch (e) {
            return JSON.stringify(new BaseResponseModel(null, new BaseErrorModel(0, "exception")));
        }
        
    }
    
//TODO save comment
//TODO delete comment
//TODO update comment
