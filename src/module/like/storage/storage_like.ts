function like_createTables(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama) {

    logger.info(" ------ like start CREATE TABLE --------------------------------------")
    
    let parameters: any = [];
    let queryStr: string = 'CREATE TABLE IF NOT EXISTS z_like (' +
        'id UUID NOT NULL DEFAULT gen_random_uuid(),' +
        'created_at TIMESTAMP NOT NULL DEFAULT now(),' +
        'updated_at TIMESTAMP NOT NULL DEFAULT now(),' +
        'text VARCHAR,' +
        'liked BOOL,' +
        'creator_id UUID NOT NULL,' +
        'status SMALLINT NOT NULL DEFAULT 0,' +
        'deleted BOOL,' +
        'deleted_at TIMESTAMP DEFAULT now(),,' +
        'deleted_by UUID,' +
        'CONSTRAINT "primary" PRIMARY KEY (id ASC),' +
        'CONSTRAINT fk_like_id_ref_likes  FOREIGN  KEY(like_id)  REFERENCES  z_like(id),' +
        'CONSTRAINT fk_unlike_id_ref_unlikes  FOREIGN  KEY(unlike_id)  REFERENCES  z_unlike(id),' +
        'CONSTRAINT fk_rate_id_ref_rates  FOREIGN  KEY(rate_id)  REFERENCES  z_rate(id),' +
        'CONSTRAINT fk_quote_like_id_ref_likes  FOREIGN  KEY(quote_like_id)  REFERENCES  z_like(id),' +
        'CONSTRAINT fk_creator_id_ref_users  FOREIGN  KEY(creator_id)  REFERENCES  users(id),' +
        'CONSTRAINT fk_deleted_by_ref_users  FOREIGN  KEY(deleted_by)  REFERENCES  users(id)' +
        ')';
    runSqlQuery(nk, logger, queryStr, parameters);
    logger.info(" ------ like end CREATE TABLE --------------------------------------")
}


function initPrivateLikeConfigsDefault(nk: nkruntime.Nakama, logger: nkruntime.Logger) {
    let configs: StorageWriteRequest =
        {
            collection: "private_configuration",
            key: "like_configs",
            userId: StaticData.ADMIN_USER_ID,
            value: createPrivateLikeConfigsDefault(),
            permissionRead: 0,
            permissionWrite: 0,
            version: "*"
        };
    try {
        nk.storageWrite([configs]);
    } catch (e) {
        logger.error("init configs error", e);
    }
}
function createPrivateLikeConfigsDefault(): PrivateLikeConfigsModel {
    let result = new PrivateLikeConfigsModel();
    // result.ghasedakSmsLikeTemplateName = "LikeTest";
    // result.tokenSeed = "F7QFWDM5OZPZW56WMF2EKDGLKB73NE7S";
    return result;
}
function getPrivateLikeConfigs(nk: nkruntime.Nakama, logger: nkruntime.Logger): [string, PrivateLikeConfigsModel] {
    try {
        let configs: StorageReadRequest =
            {
                collection: "private_configuration",
                key: "like_configs",
                userId: StaticData.ADMIN_USER_ID
            };
        let res: nkruntime.StorageObject[] = nk.storageRead([configs]);
        return [res[0].version, res[0].value as PrivateLikeConfigsModel]
    } catch (error) {
        logger.error('An error occurred: %s', error);
        return [null, null];
    }
}

function getLikesList(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, queryModel: QueryInputModel): LikeModel[] {
    
    logger.info(" ------ login getVerifyCodeByPhone --------------------------------------")
    
    queryModel.tableName = "z_like";
    // queryModel.whereModels = [new DbWhereModel([new DbWhereFieldModel("phone_number", `'${phoneNumber}'`, OperatorType.Equal)])];
    
    
    const query = generate_select_query(nk, logger, queryModel);
    try {
        const result: nkruntime.SqlQueryResult = runSqlQuery(nk, logger, query, []);
        if (result.length > 0)
            return result as LikeModel[];
        return null;
    } catch (e) {
        return null;
    }
    
    
}
