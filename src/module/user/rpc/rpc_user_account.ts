const rpcChangeOwnDisplayName: nkruntime.RpcFunction =
  function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, newName: string): string {

    try {
      if (changeDisplayName(ctx, logger, nk, newName))
        return JSON.stringify(new BaseResponseModel({status: true}));
      else
        return JSON.stringify(new BaseResponseModel(null, new BaseErrorModel(0, "An error occurred")));

    } catch (error) {
      logger.error('An error occurred: %s', error);
      return JSON.stringify(new BaseResponseModel(null, new BaseErrorModel(0, JSON.stringify(error))));
    }

  }

