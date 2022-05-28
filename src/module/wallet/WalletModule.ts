function getWallet(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, userId?: string): UserWalletModel {
    try {
        let results: nkruntime.Account;
        results = nk.accountGetId(userId ? userId : ctx.userId);
        let userWalletModel: any = results.wallet;
        return userWalletModel;
    } catch (error) {
        logger.info("getWallet - error: ", error);
        return null;
    }
}

function updateWallet(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, userWalletModel: UserWalletModel,
                      userWalletMetaDataModel?: UserWalletMetaDataModel, updateLedger: boolean = true, userId?: string): nkruntime.WalletUpdateResult {
    try {
        let results: nkruntime.WalletUpdateResult;
        results = nk.walletUpdate(ctx.userId, userWalletModel.toKeyValue(),
            userWalletMetaDataModel.toKeyValue(), updateLedger);
        return results;
    } catch (error) {
        logger.info("updateWallet - error: ", error);
        return null;
    }
}

function setDefaultWallet(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, userId?: string, isForce: boolean = false) {
    let result: nkruntime.WalletUpdateResult;
    try {
        if (isForce) {
            // result = nk.walletUpdate(userId ? userId : ctx.userId, new UserWalletModel(0, 0, 0).toKeyValue(), new UserWalletMetaDataModel(0, "setDefaultWallet", "init wallet").toKeyValue(), true);
            logger.info("setDefaultWallet - result.updated: ", result.updated);
        } else {
            let wallet = getWallet(ctx, logger, nk, userId);
            if (!wallet) {
                // result = nk.walletUpdate(userId ? userId : ctx.userId, new UserWalletModel(0, 0, 0).toKeyValue(), new UserWalletMetaDataModel(0, "setDefaultWallet", "init wallet").toKeyValue(), true);
                logger.info("setDefaultWallet - result.updated: ", result.updated);
            }
        }
    } catch (error) {
        logger.info("setDefaultWallet - error: ", error);
    }
}

