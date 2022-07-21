function like_createTables(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama) {

    logger.info(" ------ like start CREATE TABLE --------------------------------------")
    
    let parameters: any = [];
    let queryStr: string = 'CREATE TABLE IF NOT EXISTS z_like (' +
    
        'id UUID NOT NULL DEFAULT gen_random_uuid(),' +
        'CONSTRAINT "primary" PRIMARY KEY (id ASC),' +
    
        'created_at TIMESTAMP NOT NULL DEFAULT now(),' +
        'created_by UUID NOT NULL,' +
        'CONSTRAINT fk_created_by_ref_users  FOREIGN  KEY(created_by)  REFERENCES  users(id),' +
    
        'updated_at TIMESTAMP NOT NULL DEFAULT now(),' +
    
        'deleted BOOL DEFAULT FALSE,' +
        'deleted_at TIMESTAMP DEFAULT now(),' +
        'deleted_by UUID,' +
        'CONSTRAINT fk_deleted_by_ref_users  FOREIGN  KEY(deleted_by)  REFERENCES  users(id),' +
    
        'verify_state SMALLINT NOT NULL DEFAULT 0,' +
        'verified_at TIMESTAMP,' +
        'verify_text VARCHAR[],' +
        'verified_by UUID, ' +
        'CONSTRAINT fk_verified_by_ref_users  FOREIGN  KEY(verified_by)  REFERENCES  users(id),' +
    
        'status SMALLINT NOT NULL DEFAULT 0,' +
    
        'place_id UUID,' +
        'CONSTRAINT fk_place_id_ref_comments  FOREIGN  KEY(place_id)  REFERENCES  z_place(id),' +
    
        'help_id UUID,' +
        'CONSTRAINT fk_help_id_ref_helps  FOREIGN  KEY(help_id)  REFERENCES  z_help(id),' +
    
        'shop_id UUID,' +
        'CONSTRAINT fk_shop_id_ref_shops  FOREIGN  KEY(shop_id)  REFERENCES  z_shop(id),' +
    
        'news_id UUID,' +
        'CONSTRAINT fk_news_id_ref_news  FOREIGN  KEY(news_id)  REFERENCES  z_news(id),' +
        
        'like_value SMALLINT NOT NULL DEFAULT 0,' +
        'score_text VARCHAR,' +
        'score_value SMALLINT' +
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
