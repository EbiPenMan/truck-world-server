function createTables(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama) {
    
    logger.info(" ------ login start CREATE TABLE --------------------------------------")
    
    
    let parameters: any = [];
    let queryStr: string = 'CREATE TABLE IF NOT EXISTS z_login_verify_code (' +
        'phone_number VARCHAR(20) NOT NULL,' +
        'code SMALLINT NOT NULL,' +
        'unique_identifier VARCHAR(255) NOT NULL,' +
        'updated_at TIMESTAMP NOT NULL DEFAULT now(),' +
        'CONSTRAINT "primary" PRIMARY KEY (phone_number ASC)' +
        ')';
    
    
    runSqlQuery(nk, logger, queryStr, parameters);
    
    logger.info(" ------ login end CREATE TABLE --------------------------------------")
    
    
}
function saveVerifyCode(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, phoneNumber: string, code: number , uniqueIdentifier : string) {
    
    logger.info(" ------ login start saveVerifyCode --------------------------------------")
    
    
    let parameters: any = [];
    let queryStr: string = 'UPSERT INTO z_login_verify_code ' +
        '(phone_number,code,unique_identifier,updated_at) VALUES (' +
        `'${phoneNumber}',${code},'${uniqueIdentifier}','${new Date().toISOString()}')`;
    
    
    runSqlQuery(nk, logger, queryStr, parameters);
    
    logger.info(" ------ login end saveVerifyCode --------------------------------------")
    
    
}
function getVerifyCodeByPhone(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, phoneNumber: string): VerificationCodeDbModel {
    
    logger.info(" ------ login getVerifyCodeByPhone --------------------------------------")
    
    
    const queryModel: QueryInputModel = new QueryInputModel();
    queryModel.tableName = "z_login_verify_code";
    queryModel.selectColumnNames = ["*"];
    queryModel.whereModels = [new DbWhereModel([new DbWhereFieldModel("phone_number", `'${phoneNumber}'`, OperatorType.Equal)])];
    
    
    const query = generate_select_query(nk, logger, queryModel);
    try {
        const result: nkruntime.SqlQueryResult = runSqlQuery(nk, logger, query, []);
        if (result.length > 0)
            return result[0] as VerificationCodeDbModel;
        return null;
    } catch (e) {
        return null;
    }
    
    
}


function initPrivateLoginConfigsDefault(nk: nkruntime.Nakama, logger: nkruntime.Logger) {
    let configs: StorageWriteRequest =
        {
            collection: "private_configuration",
            key: "login_configs",
            userId: StaticData.ADMIN_USER_ID,
            value: createPrivateLoginConfigsDefault(),
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
function createPrivateLoginConfigsDefault(): PrivateLoginConfigsModel {
    let result = new PrivateLoginConfigsModel();
    result.ghasedakSmsLoginTemplateName = "LoginTest";
    result.tokenSeed = "F7QFWDM5OZPZW56WMF2EKDGLKB73NE7S";
    return result;
}
function getPrivateLoginConfigs(nk: nkruntime.Nakama, logger: nkruntime.Logger): [string, PrivateLoginConfigsModel] {
    try {
        let configs: StorageReadRequest =
            {
                collection: "private_configuration",
                key: "login_configs",
                userId: StaticData.ADMIN_USER_ID
            };
        let res: nkruntime.StorageObject[] = nk.storageRead([configs]);
        return [res[0].version, res[0].value as PrivateLoginConfigsModel]
    } catch (error) {
        logger.error('An error occurred: %s', error);
        return [null, null];
    }
}
