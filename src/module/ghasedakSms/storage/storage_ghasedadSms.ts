
function initPrivateGhasedakSmsConfigsDefault(nk: nkruntime.Nakama, logger: nkruntime.Logger) {
    let configs: StorageWriteRequest =
        {
            collection: "private_configuration",
            key: "ghasedakSms_configs",
            userId: StaticData.ADMIN_USER_ID,
            value: createPrivateGhasedakSmsConfigsDefault(),
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
function createPrivateGhasedakSmsConfigsDefault(): PrivateGhasedakSmsConfigsModel {
    let result = new PrivateGhasedakSmsConfigsModel();
    result.ghasedakSmsApiBaseUrl = "https://api.ghasedak.me/v2"
    result.ghasedakSmsApiKey = "bc8cc6d96c6c29abed28039a864895d32ced99abc91b2600b8b825fe3f7a6143"
    result.verifySendEndPoint = "/verification/send/simple"
    return result;
}
function getPrivateGhasedakSmsConfigs(nk: nkruntime.Nakama, logger: nkruntime.Logger): [string, PrivateGhasedakSmsConfigsModel] {
    try {
        let configs: StorageReadRequest =
            {
                collection: "private_configuration",
                key: "ghasedakSms_configs",
                userId: StaticData.ADMIN_USER_ID
            };
        let res: nkruntime.StorageObject[] = nk.storageRead([configs]);
        return [res[0].version, res[0].value as PrivateGhasedakSmsConfigsModel]
    } catch (error) {
        logger.error('An error occurred: %s', error);
        return [null, null];
    }
}
