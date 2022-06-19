function place_createTables(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama) {
    
    logger.info(" ------ place start CREATE TABLE --------------------------------------")
    
    
    let parameters: any = [];
    let queryStr: string = 'CREATE TABLE IF NOT EXISTS z_place_verify_code (' +
        'id UUID NOT NULL DEFAULT gen_random_uuid(), ' +
        'created_at TIMESTAMP NOT NULL DEFAULT now(),' +
        'updated_at TIMESTAMP NOT NULL DEFAULT now(),' +
        'type_place SMALLINT NOT NULL,' +
        'category SMALLINT NOT NULL,' +
        'creator_id UUID NOT NULL, ' +
        'owner_id UUID NOT NULL, ' +
        'logo_url VARCHAR(512),' +
        'images_url VARCHAR[],' +
        'title VARCHAR(512),' +
        'description VARCHAR,' +
        'location GEOGRAPHY,' +
        'address VARCHAR(512),' +
        'attributes JSONB,' +
        'verify_state BOOL DEFAULT FALSE,' +
        'verified_at TIMESTAMP NOT NULL DEFAULT now(),' +
        'verified_by UUID NOT NULL, ' +
        'status SMALLINT NOT NULL,' +
        'CONSTRAINT "primary" PRIMARY KEY (id ASC)' +
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