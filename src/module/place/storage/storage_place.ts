function place_createTables(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama) {

    logger.info(" ------ place start CREATE TABLE --------------------------------------")
    
    let parameters: any = [];
    let queryStr: string = 'CREATE TABLE IF NOT EXISTS z_place (' +
    
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
    
        'owned_by UUID,' +
        'CONSTRAINT fk_owned_by_ref_users  FOREIGN  KEY(owned_by)  REFERENCES  users(id),' +
        
        'place_type SMALLINT NOT NULL DEFAULT 0,' +
        'category SMALLINT NOT NULL DEFAULT 0,' +
        
        'logo_url VARCHAR(512),' +
        'images_url VARCHAR[],' +
        'title VARCHAR(512),' +
        'description VARCHAR,' +
        'location GEOGRAPHY,' +
        'address VARCHAR(512),' +
        'attributes_key VARCHAR(128)[],' +
        'attributes_type SMALLINT[],' +
        'attributes_value VARCHAR[]' +
        ')';
    runSqlQuery(nk, logger, queryStr, parameters);
    logger.info(" ------ place end CREATE TABLE --------------------------------------")
}


function initPrivatePlaceConfigsDefault(nk: nkruntime.Nakama, logger: nkruntime.Logger) {
    let configs: StorageWriteRequest =
        {
            collection: "private_configuration",
            key: "place_configs",
            userId: StaticData.ADMIN_USER_ID,
            value: createPrivatePlaceConfigsDefault(),
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
function createPrivatePlaceConfigsDefault(): PrivatePlaceConfigsModel {
    let result = new PrivatePlaceConfigsModel();
    // result.ghasedakSmsPlaceTemplateName = "PlaceTest";
    // result.tokenSeed = "F7QFWDM5OZPZW56WMF2EKDGLKB73NE7S";
    return result;
}
function getPrivatePlaceConfigs(nk: nkruntime.Nakama, logger: nkruntime.Logger): [string, PrivatePlaceConfigsModel] {
    try {
        let configs: StorageReadRequest =
            {
                collection: "private_configuration",
                key: "place_configs",
                userId: StaticData.ADMIN_USER_ID
            };
        let res: nkruntime.StorageObject[] = nk.storageRead([configs]);
        return [res[0].version, res[0].value as PrivatePlaceConfigsModel]
    } catch (error) {
        logger.error('An error occurred: %s', error);
        return [null, null];
    }
}

function getPlacesList(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, queryModel: QueryInputModel): PlaceModel[] {
    
    logger.info(" ------ login getVerifyCodeByPhone --------------------------------------")
    
    queryModel.tableName = "z_place";
    // queryModel.whereModels = [new DbWhereModel([new DbWhereFieldModel("phone_number", `'${phoneNumber}'`, OperatorType.Equal)])];
    
    
    const query = generate_select_query(nk, logger, queryModel);
    try {
        const result: nkruntime.SqlQueryResult = runSqlQuery(nk, logger, query, []);
        if (result.length > 0)
            return result as PlaceModel[];
        return null;
    } catch (e) {
        return null;
    }
    
    
}
