import StorageReadRequest = nkruntime.StorageReadRequest;

function changeDisplayName(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, newName: string, userId?: string): boolean {
  try {
    nk.accountUpdateId(userId ? userId : ctx.userId, null, newName);
    return true;
  } catch (error) {
    logger.error('An error occurred: %s', error);
    return false;
  }
}

function setUserStoragePublic(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, configsData: UserStoragePublicConfigsModel, userId?: string , version? : string): boolean {
  try {

    let configs: StorageWriteRequest =
      {
        collection: "user_configuration",
        key: "public_configs",
        userId: userId ? userId : ctx.userId,
        value: configsData,
        permissionRead: 2,
        permissionWrite: 0
      };

    if(version)
      configs.version = version;

    nk.storageWrite([configs]);

    return true;
  } catch (error) {
    logger.error('An error occurred: %s', error);
    return false;
  }
}
function setUserStoragePrivate(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, configsData: UserStoragePrivateConfigsModel, userId?: string , version? : string): boolean {
    try {

        let configs: StorageWriteRequest =
            {
                collection: "user_configuration",
                key: "private_configs",
                userId: userId ? userId : ctx.userId,
                value: configsData,
                permissionRead: 0,
                permissionWrite: 0
            };

        if(version)
            configs.version = version;

        nk.storageWrite([configs]);

        return true;
    } catch (error) {
        logger.error('An error occurred: %s', error);
        return false;
    }


}
function setUserStorageMutable(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, configsData: UserStorageMutableConfigsModel, userId?: string , version? : string): boolean {
  try {

    let configs: StorageWriteRequest =
      {
        collection: "user_configuration",
        key: "mutable_configs",
        userId: userId ? userId : ctx.userId,
        value: configsData,
        permissionRead: 2,
        permissionWrite: 1
      };

    if(version)
      configs.version = version;

    nk.storageWrite([configs]);

    return true;
  } catch (error) {
    logger.error('An error occurred: %s', error);
    return false;
  }


}
function setUserStorageReadable(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, configsData: UserStorageReadableConfigsModel, userId?: string , version? : string): boolean {
    try {

        let configs: StorageWriteRequest =
            {
                collection: "user_configuration",
                key: "readable_configs",
                userId: userId ? userId : ctx.userId,
                value: configsData,
                permissionRead: 1,
                permissionWrite: 0
            };

        if(version)
            configs.version = version;

        nk.storageWrite([configs]);

        return true;
    } catch (error) {
        logger.error('An error occurred: %s', error);
        return false;
    }


}

function getUserStoragePublic(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, userId?: string): [string, UserStoragePublicConfigsModel] {
  try {
    let configs: StorageReadRequest =
      {
        collection: "user_configuration",
        key: "public_configs",
        userId: userId ? userId : ctx.userId
      };
    let res: nkruntime.StorageObject[] = nk.storageRead([configs]);
    return [res[0].version, res[0].value as UserStoragePublicConfigsModel]
  } catch (error) {
    logger.error('An error occurred: %s', error);
    return [null, null];
  }
}
function getUserStoragePrivate(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, userId?: string):[string,UserStoragePrivateConfigsModel] {
  try {
    let configs: StorageReadRequest =
      {
        collection: "user_configuration",
        key: "private_configs",
        userId: userId ? userId : ctx.userId
      };
    let res: nkruntime.StorageObject[] = nk.storageRead([configs]);
    return [res[0].version, res[0].value as UserStoragePrivateConfigsModel]
  } catch (error) {
    logger.error('An error occurred: %s', error);
    return [null, null];
  }
}
function getUserStorageMutable(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, userId?: string): [string,UserStorageMutableConfigsModel] {
  try {
    let configs: StorageReadRequest =
      {
        collection: "user_configuration",
        key: "mutable_configs",
        userId: userId ? userId : ctx.userId
      };
    let res: nkruntime.StorageObject[] = nk.storageRead([configs]);
    return [res[0].version, res[0].value as UserStorageMutableConfigsModel]
  } catch (error) {
    logger.error('An error occurred: %s', error);
    return [null, null];
  }
}
function getUserStorageReadable(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, userId?: string):[string,UserStorageReadableConfigsModel] {
    try {
        let configs: StorageReadRequest =
            {
                collection: "user_configuration",
                key: "readable_configs",
                userId: userId ? userId : ctx.userId
            };
        let res: nkruntime.StorageObject[] = nk.storageRead([configs]);
        return [res[0].version, res[0].value as UserStorageReadableConfigsModel]
    } catch (error) {
        logger.error('An error occurred: %s', error);
        return [null, null];
    }
}

function initUserConfigsDefault(ctx: nkruntime.Context,nk: nkruntime.Nakama, logger: nkruntime.Logger) {

  let publicConfig : UserStoragePublicConfigsModel = new UserStoragePublicConfigsModel();
  // publicConfig.trophySeason = 0;
  // publicConfig.trophyGeneral = 0;
  setUserStoragePublic(ctx,logger,nk,publicConfig);

  let privateConfig : UserStoragePrivateConfigsModel = new UserStoragePrivateConfigsModel();
  // privateConfig.startFillEnergy = new Date();
  setUserStoragePrivate(ctx,logger,nk,privateConfig);

  let mutableConfig : UserStorageMutableConfigsModel = new UserStorageMutableConfigsModel();
  mutableConfig.soundVolume = 1;
  mutableConfig.musicVolume = 1;
  // mutableConfig.heroTeams = new HeroTeamsModel();
  setUserStorageMutable(ctx,logger,nk,mutableConfig);

}
