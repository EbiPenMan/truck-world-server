function comment_createTables(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama) {

    logger.info(" ------ comment start CREATE TABLE --------------------------------------")
    
    let parameters: any = [];
    let queryStr: string = 'CREATE TABLE IF NOT EXISTS z_comment (' +
        'id UUID NOT NULL DEFAULT gen_random_uuid(),' +
        'created_at TIMESTAMP NOT NULL DEFAULT now(),' +
        'updated_at TIMESTAMP NOT NULL DEFAULT now(),' +
        'text VARCHAR,' +
        'like_id UUID,' +
        'unlike_id UUID,' +
        'rate_id UUID,' +
        'quote_comment_id UUID,' +
        'type_comment SMALLINT NOT NULL DEFAULT 0,' +
        'category SMALLINT NOT NULL DEFAULT 0,' +
        'creator_id UUID NOT NULL,' +
        'verify_state SMALLINT NOT NULL DEFAULT 0,' +
        'verified_at TIMESTAMP,' +
        'verified_by UUID, ' +
        'status SMALLINT NOT NULL DEFAULT 0,' +
        'CONSTRAINT "primary" PRIMARY KEY (id ASC),' +
        'CONSTRAINT fk_like_id_ref_likes  FOREIGN  KEY(like_id)  REFERENCES  z_like(id),' +
        'CONSTRAINT fk_unlike_id_ref_unlikes  FOREIGN  KEY(unlike_id)  REFERENCES  z_unlike(id),' +
        'CONSTRAINT fk_rate_id_ref_rates  FOREIGN  KEY(rate_id)  REFERENCES  z_rate(id),' +
        'CONSTRAINT fk_quote_comment_id_ref_comments  FOREIGN  KEY(quote_comment_id)  REFERENCES  z_comment(id),' +
        'CONSTRAINT fk_creator_id_ref_users  FOREIGN  KEY(creator_id)  REFERENCES  users(id),' +
        'CONSTRAINT fk_verified_by_ref_users  FOREIGN  KEY(verified_by)  REFERENCES  users(id)' +
        ')';
    runSqlQuery(nk, logger, queryStr, parameters);
    logger.info(" ------ comment end CREATE TABLE --------------------------------------")
}


function initPrivateCommentConfigsDefault(nk: nkruntime.Nakama, logger: nkruntime.Logger) {
    let configs: StorageWriteRequest =
        {
            collection: "private_configuration",
            key: "comment_configs",
            userId: StaticData.ADMIN_USER_ID,
            value: createPrivateCommentConfigsDefault(),
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
function createPrivateCommentConfigsDefault(): PrivateCommentConfigsModel {
    let result = new PrivateCommentConfigsModel();
    // result.ghasedakSmsCommentTemplateName = "CommentTest";
    // result.tokenSeed = "F7QFWDM5OZPZW56WMF2EKDGLKB73NE7S";
    return result;
}
function getPrivateCommentConfigs(nk: nkruntime.Nakama, logger: nkruntime.Logger): [string, PrivateCommentConfigsModel] {
    try {
        let configs: StorageReadRequest =
            {
                collection: "private_configuration",
                key: "comment_configs",
                userId: StaticData.ADMIN_USER_ID
            };
        let res: nkruntime.StorageObject[] = nk.storageRead([configs]);
        return [res[0].version, res[0].value as PrivateCommentConfigsModel]
    } catch (error) {
        logger.error('An error occurred: %s', error);
        return [null, null];
    }
}

function getCommentsList(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, queryModel: QueryInputModel): CommentModel[] {
    
    logger.info(" ------ login getVerifyCodeByPhone --------------------------------------")
    
    queryModel.tableName = "z_comment";
    // queryModel.whereModels = [new DbWhereModel([new DbWhereFieldModel("phone_number", `'${phoneNumber}'`, OperatorType.Equal)])];
    
    
    const query = generate_select_query(nk, logger, queryModel);
    try {
        const result: nkruntime.SqlQueryResult = runSqlQuery(nk, logger, query, []);
        if (result.length > 0)
            return result as CommentModel[];
        return null;
    } catch (e) {
        return null;
    }
    
    
}
