
import StorageWriteRequest = nkruntime.StorageWriteRequest;


const server_init = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama) {
    
    initServerConfigs(ctx,logger,nk);
    

}



function initServerConfigs( ctx: nkruntime.Context,logger: nkruntime.Logger,nk: nkruntime.Nakama) {
    initPrivateServerConfigsDefault(nk, logger);
    initPublicServerConfigsDefault(nk, logger);
}

function initPrivateServerConfigsDefault(nk: nkruntime.Nakama, logger: nkruntime.Logger) {
    let configs: StorageWriteRequest =
        {
            collection: "private_configuration",
            key: "server_configs",
            userId: StaticData.ADMIN_USER_ID,
            value: createPrivateServerConfigsDefault(),
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
function createPrivateServerConfigsDefault(): PrivateServerConfigsModel {
    let result = new PrivateServerConfigsModel();
    return result;
}
function getPrivateServerConfigs(nk: nkruntime.Nakama, logger: nkruntime.Logger): [string, PrivateServerConfigsModel] {
    try {
        let configs: StorageReadRequest =
            {
                collection: "private_configuration",
                key: "server_configs",
                userId: StaticData.ADMIN_USER_ID
            };
        let res: nkruntime.StorageObject[] = nk.storageRead([configs]);
        return [res[0].version, res[0].value as PrivateServerConfigsModel]
    } catch (error) {
        logger.error('An error occurred: %s', error);
        return [null, null];
    }
}

function initPublicServerConfigsDefault(nk: nkruntime.Nakama, logger: nkruntime.Logger) {
    let configs: StorageWriteRequest =
        {
            collection: "public_configuration",
            key: "server_configs",
            userId: StaticData.ADMIN_USER_ID,
            value: createPublicServerConfigsDefault(),
            permissionRead: 2,
            permissionWrite: 0,
            version: "*"
        }
    try {
        nk.storageWrite([configs]);
    } catch (e) {
        logger.error("init configs error", e);
    }
}
function createPublicServerConfigsDefault(): PublicServerConfigsModel {
    let result = new PublicServerConfigsModel();
    // result.fillEnergyFixedHour = 7; //todo apply
    result.baseCdnUrl = "http://localhost/hero-game/cdn";
    // result.fillEnergyConfigs = [
    //     new FillEnergyConfigsModel(3, 9, 20),
    //     new FillEnergyConfigsModel(10, 19, 40),
    //     new FillEnergyConfigsModel(20, 99999, 60)
    // ]
    // result.breedCostEachParentConfigs = new BreedCostEachParentConfigsModel(
    //     [1800, 2700, 4500, 7200, 11700, 18900, 30600], 1
    // );
    // result.maxBreedCount = 7;
    // result.sellCost = 100;
    // result.buyFeePercent = 5;
    // result.changeNameCost = 10; // todo apply
    return result;
}
function getPublicServerConfigs(nk: nkruntime.Nakama, logger: nkruntime.Logger): [string, PublicServerConfigsModel] {
    try {
        let configs: StorageReadRequest =
            {
                collection: "public_configuration",
                key: "server_configs",
                userId: StaticData.ADMIN_USER_ID
            };
        let res: nkruntime.StorageObject[] = nk.storageRead([configs]);
        return [res[0].version, res[0].value as PublicServerConfigsModel]
    } catch (error) {
        logger.error('An error occurred: %s', error);
        return [null, null];
    }
}

function getStorages(nk: nkruntime.Nakama, objectIds: nkruntime.StorageReadRequest[]): nkruntime.StorageObject[] {
    try {
        return nk.storageRead(objectIds);
    } catch (error) {
        return null;
    }
}
