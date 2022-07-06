var StaticData = (function () {
    function StaticData() {
    }
    StaticData.ADMIN_USER_ID = "00000000-0000-0000-0000-000000000000";
    return StaticData;
}());
var InitModule = function (ctx, logger, nk, initializer) {
    logger.info("TypeScript - Main ****************");
    server_init(ctx, logger, nk);
    ghasedakSms_init(ctx, logger, nk);
    login_init(ctx, logger, nk);
    initializer.registerRpc('rpc_login_getVerificationCode', rpc_login_getVerificationCode);
    initializer.registerRpc('rpc_login_checkVerificationCode', rpc_login_checkVerificationCode);
    initializer.registerAfterAuthenticateDevice(hook_login_afterAuthenticateDevice);
    initializer.registerBeforeAuthenticateCustom(hook_login_beforeAuthenticateCustom);
    initializer.registerAfterAuthenticateCustom(hook_login_afterAuthenticateCustom);
    place_init(ctx, logger, nk);
    initializer.registerRpc('rpc_place_getList', rpc_place_getList);
    comment_init(ctx, logger, nk);
    initializer.registerRpc('rpc_comment_getList', rpc_comment_getList);
};
function InitTable(nk, logger) {
    logger.info("============= Start Init tables =============");
    var parameters = [];
    logger.info(" - CREATE TABLE z_hero --------------------------------------");
    nk.sqlExec('CREATE TABLE IF NOT EXISTS z_hero (' +
        'id UUID NOT NULL DEFAULT gen_random_uuid(), ' +
        'number_id INT NOT NULL DEFAULT 0,' +
        'name_hero VARCHAR(255) NOT NULL,' +
        'class_type SMALLINT NOT NULL DEFAULT 0,' +
        'xp INT4 NOT NULL DEFAULT 0,' +
        'current_owner_id UUID NOT NULL, ' +
        'stage SMALLINT NOT NULL DEFAULT 0,' +
        'birth_date TIMESTAMPTZ NOT NULL DEFAULT now(),' +
        'updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),' +
        'stats JSONB NOT NULL,' +
        'parents_id UUID ARRAY, ' +
        'source_hero SMALLINT NOT NULL DEFAULT 0,' +
        'current_sale JSONB,' +
        'sale_history JSONB,' +
        'breed_history JSONB,' +
        'genes JSONB NOT NULL,' +
        'CONSTRAINT "primary" PRIMARY KEY (id ASC),' +
        'CONSTRAINT fk_current_owner_id_ref_users  FOREIGN  KEY(current_owner_id)  REFERENCES  users(id))', parameters);
    logger.info(" - CREATE TABLE z_logic --------------------------------------");
    nk.sqlExec('CREATE TABLE IF NOT EXISTS z_logic(' +
        'id UUID NOT NULL DEFAULT gen_random_uuid(),' +
        'description VARCHAR NOT NULL,' +
        'image_url VARCHAR(512) NOT NULL,' +
        'created_at TIMESTAMPTZ NOT NULL DEFAULT now(),' +
        'updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),' +
        'CONSTRAINT "primary" PRIMARY KEY(id ASC))', parameters);
    logger.info(" - CREATE TABLE z_ability --------------------------------------");
    nk.sqlExec('CREATE TABLE IF NOT EXISTS z_ability(' +
        'id UUID NOT NULL DEFAULT gen_random_uuid(),' +
        'logic_id UUID NOT NULL,' +
        'display_name VARCHAR(255) NOT NULL,' +
        'energy SMALLINT NOT NULL DEFAULT 0,' +
        'attack SMALLINT NOT NULL DEFAULT 0,' +
        'defence SMALLINT NOT NULL DEFAULT 0,' +
        'image_url VARCHAR(512),' +
        'created_at TIMESTAMPTZ NOT NULL DEFAULT now(),' +
        'updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),' +
        'CONSTRAINT "primary" PRIMARY KEY(id ASC),' +
        'CONSTRAINT fk_logic_id_ref_logics  FOREIGN  KEY(logic_id)  REFERENCES  z_logic(id))', parameters);
    logger.info(" - CREATE TABLE z_part --------------------------------------");
    nk.sqlExec('CREATE TABLE IF NOT EXISTS z_part(' +
        'id UUID NOT NULL DEFAULT gen_random_uuid(),' +
        'ability_id UUID, ' +
        'display_name VARCHAR(255) NOT NULL,' +
        'special_type_data JSONB NOT NULL,' +
        'class_type SMALLINT NOT NULL DEFAULT 0,' +
        'created_at TIMESTAMPTZ NOT NULL DEFAULT now(),' +
        'updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),' +
        'CONSTRAINT "primary" PRIMARY KEY(id ASC),' +
        'CONSTRAINT fk_ability_id_ref_abilities  FOREIGN  KEY(ability_id)  REFERENCES  z_ability(id))', parameters);
    logger.info("============= End Init tables =============");
}
var QueryInputModel = (function () {
    function QueryInputModel(tableName, selectColumnNames, asOfSystemModel, whereModels, sort, limit, offset) {
        if (tableName === void 0) { tableName = ""; }
        if (selectColumnNames === void 0) { selectColumnNames = []; }
        if (asOfSystemModel === void 0) { asOfSystemModel = null; }
        if (whereModels === void 0) { whereModels = []; }
        if (sort === void 0) { sort = []; }
        if (limit === void 0) { limit = null; }
        if (offset === void 0) { offset = null; }
        this.tableName = tableName;
        this.selectColumnNames = selectColumnNames;
        this.asOfSystemModel = asOfSystemModel;
        this.whereModels = whereModels;
        this.sort = sort;
        this.limit = limit;
        this.offset = offset;
    }
    return QueryInputModel;
}());
var DbWhereModel = (function () {
    function DbWhereModel(whereFields, operator) {
        if (whereFields === void 0) { whereFields = []; }
        if (operator === void 0) { operator = OperatorType.None; }
        this.whereFields = whereFields;
        this.operator = operator;
    }
    return DbWhereModel;
}());
var DbWhereFieldModel = (function () {
    function DbWhereFieldModel(fieldName, fieldValue, operator) {
        if (fieldName === void 0) { fieldName = ""; }
        if (fieldValue === void 0) { fieldValue = {}; }
        if (operator === void 0) { operator = OperatorType.None; }
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
        this.operator = operator;
    }
    return DbWhereFieldModel;
}());
var DbSortModel = (function () {
    function DbSortModel(fieldName, sortType) {
        if (fieldName === void 0) { fieldName = ""; }
        if (sortType === void 0) { sortType = SortType.None; }
        this.fieldName = fieldName;
        this.sortType = sortType;
    }
    return DbSortModel;
}());
var SetField = (function () {
    function SetField(keyName, value) {
        if (keyName === void 0) { keyName = ""; }
        if (value === void 0) { value = ""; }
        this.keyName = keyName;
        this.value = value;
    }
    return SetField;
}());
var QueryType;
(function (QueryType) {
    QueryType[QueryType["None"] = 0] = "None";
    QueryType[QueryType["SELECT"] = 1] = "SELECT";
    QueryType[QueryType["INSERT"] = 2] = "INSERT";
    QueryType[QueryType["UPDATE"] = 3] = "UPDATE";
    QueryType[QueryType["DELETE"] = 4] = "DELETE";
})(QueryType || (QueryType = {}));
var SortType;
(function (SortType) {
    SortType[SortType["None"] = 0] = "None";
    SortType[SortType["ASC"] = 1] = "ASC";
    SortType[SortType["DESC"] = 2] = "DESC";
})(SortType || (SortType = {}));
var OperatorType;
(function (OperatorType) {
    OperatorType[OperatorType["None"] = 0] = "None";
    OperatorType[OperatorType["GreaterThan"] = 1] = "GreaterThan";
    OperatorType[OperatorType["GreaterThanOrEqual"] = 2] = "GreaterThanOrEqual";
    OperatorType[OperatorType["LessThan"] = 3] = "LessThan";
    OperatorType[OperatorType["LessThanOrEqual"] = 4] = "LessThanOrEqual";
    OperatorType[OperatorType["Equal"] = 5] = "Equal";
    OperatorType[OperatorType["NotEqual"] = 6] = "NotEqual";
    OperatorType[OperatorType["And"] = 7] = "And";
    OperatorType[OperatorType["Or"] = 8] = "Or";
    OperatorType[OperatorType["Not"] = 9] = "Not";
    OperatorType[OperatorType["Like"] = 10] = "Like";
    OperatorType[OperatorType["NotLike"] = 11] = "NotLike";
    OperatorType[OperatorType["ANY"] = 12] = "ANY";
    OperatorType[OperatorType["IN"] = 13] = "IN";
    OperatorType[OperatorType["ISNULL"] = 14] = "ISNULL";
    OperatorType[OperatorType["NOTNULL"] = 15] = "NOTNULL";
})(OperatorType || (OperatorType = {}));
var KeyValueModel = (function () {
    function KeyValueModel(key, value) {
        this.key = key;
        this.value = value;
    }
    return KeyValueModel;
}());
var DbPageableModel = (function () {
    function DbPageableModel(pageNumber, pageSize) {
        if (pageNumber === void 0) { pageNumber = 0; }
        if (pageSize === void 0) { pageSize = {}; }
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }
    return DbPageableModel;
}());
var SelectQueryOutputModel = (function () {
    function SelectQueryOutputModel(pageNumber, totalPageSize, rows) {
        if (pageNumber === void 0) { pageNumber = 0; }
        if (totalPageSize === void 0) { totalPageSize = 0; }
        if (rows === void 0) { rows = []; }
        this.pageNumber = pageNumber;
        this.totalPageSize = totalPageSize;
        this.rows = rows;
    }
    return SelectQueryOutputModel;
}());
var AsOfSystemModel = (function () {
    function AsOfSystemModel(type, value) {
        if (type === void 0) { type = AsOfSystemType.None; }
        if (value === void 0) { value = ""; }
        this.type = type;
        this.value = value;
    }
    return AsOfSystemModel;
}());
var AsOfSystemType;
(function (AsOfSystemType) {
    AsOfSystemType[AsOfSystemType["None"] = 0] = "None";
    AsOfSystemType[AsOfSystemType["Time"] = 1] = "Time";
})(AsOfSystemType || (AsOfSystemType = {}));
var PrivateServerConfigsModel = (function () {
    function PrivateServerConfigsModel() {
    }
    return PrivateServerConfigsModel;
}());
var PublicServerConfigsModel = (function () {
    function PublicServerConfigsModel() {
    }
    return PublicServerConfigsModel;
}());
var UserStorageMutableConfigsModel = (function () {
    function UserStorageMutableConfigsModel() {
    }
    return UserStorageMutableConfigsModel;
}());
var UserStoragePrivateConfigsModel = (function () {
    function UserStoragePrivateConfigsModel() {
    }
    return UserStoragePrivateConfigsModel;
}());
var UserStoragePublicConfigsModel = (function () {
    function UserStoragePublicConfigsModel() {
    }
    return UserStoragePublicConfigsModel;
}());
var UserStorageReadableConfigsModel = (function () {
    function UserStorageReadableConfigsModel() {
    }
    return UserStorageReadableConfigsModel;
}());
var UserWalletMetaDataModel = (function () {
    function UserWalletMetaDataModel() {
    }
    UserWalletMetaDataModel.prototype.toKeyValue = function () {
        return Object(this);
    };
    return UserWalletMetaDataModel;
}());
var UserWalletModel = (function () {
    function UserWalletModel() {
    }
    UserWalletModel.prototype.toKeyValue = function () {
        return Object(this);
    };
    return UserWalletModel;
}());
var BaseErrorModel = (function () {
    function BaseErrorModel(code, message) {
        this.code = code;
        this.message = message;
    }
    return BaseErrorModel;
}());
var BaseResponseModel = (function () {
    function BaseResponseModel(result, error) {
        if (error === void 0) { error = null; }
        this.result = result;
        this.error = error;
    }
    return BaseResponseModel;
}());
function ObjectAssign(source, target) {
    var keys = Object.getOwnPropertyNames(target);
    var _loop_1 = function (k) {
        if (keys.filter(function (x) { return x === k; }) != null)
            target[k] = source[k];
    };
    for (var k in source) {
        _loop_1(k);
    }
    return target;
}
function randomIntegerMaxIncluded(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomNumberMaxNotIncluded(min, max) {
    return Math.random() * (max - min) + min;
}
function toKeyValue(target) {
    return Object(target);
}
function dateAdd(date, interval, units) {
    var refDate = new Date(date.getTime());
    var ret = new Date(date.getTime());
    var checkRollover = function () { if (ret.getDate() != refDate.getDate())
        ret.setDate(0); };
    switch (String(interval).toLowerCase()) {
        case 'year':
            ret.setFullYear(ret.getFullYear() + units);
            checkRollover();
            break;
        case 'quarter':
            ret.setMonth(ret.getMonth() + 3 * units);
            checkRollover();
            break;
        case 'month':
            ret.setMonth(ret.getMonth() + units);
            checkRollover();
            break;
        case 'week':
            ret.setDate(ret.getDate() + 7 * units);
            break;
        case 'day':
            ret.setDate(ret.getDate() + units);
            break;
        case 'hour':
            ret.setTime(ret.getTime() + units * 3600000);
            break;
        case 'minute':
            ret.setTime(ret.getTime() + units * 60000);
            break;
        case 'second':
            ret.setTime(ret.getTime() + units * 1000);
            break;
        default:
            ret = undefined;
            break;
    }
    return ret;
}
var crypt = function (salt, text) {
    var textToChars = function (text) { return text.split("").map(function (c) { return c.charCodeAt(0); }); };
    var byteHex = function (n) { return ("0" + Number(n).toString(16)).substr(-2); };
    var applySaltToChar = function (code) { return textToChars(salt).reduce(function (a, b) { return a ^ b; }, code); };
    return text
        .split("")
        .map(textToChars)
        .map(applySaltToChar)
        .map(byteHex)
        .join("");
};
var decrypt = function (salt, encoded) {
    var textToChars = function (text) { return text.split("").map(function (c) { return c.charCodeAt(0); }); };
    var applySaltToChar = function (code) { return textToChars(salt).reduce(function (a, b) { return a ^ b; }, code); };
    return encoded
        .match(/.{1,2}/g)
        .map(function (hex) { return parseInt(hex, 16); })
        .map(applySaltToChar)
        .map(function (charCode) { return String.fromCharCode(charCode); })
        .join("");
};
function parseISOString(s) {
    var b = s.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}
var comment_init = function (ctx, logger, nk) {
    comment_createTables(ctx, logger, nk);
    initPrivateCommentConfigsDefault(nk, logger);
};
var CommentModel = (function () {
    function CommentModel() {
    }
    return CommentModel;
}());
var CommentType;
(function (CommentType) {
    CommentType[CommentType["None"] = 0] = "None";
})(CommentType || (CommentType = {}));
var CommentCategory;
(function (CommentCategory) {
    CommentCategory[CommentCategory["None"] = 0] = "None";
    CommentCategory[CommentCategory["ShopCar"] = 1] = "ShopCar";
    CommentCategory[CommentCategory["ShopCarAccessory"] = 2] = "ShopCarAccessory";
    CommentCategory[CommentCategory["GasStation"] = 3] = "GasStation";
    CommentCategory[CommentCategory["Restaurant"] = 4] = "Restaurant";
    CommentCategory[CommentCategory["CarService"] = 4] = "CarService";
})(CommentCategory || (CommentCategory = {}));
var CommentStatus;
(function (CommentStatus) {
    CommentStatus[CommentStatus["None"] = 0] = "None";
    CommentStatus[CommentStatus["VerifyNeed"] = 1] = "VerifyNeed";
    CommentStatus[CommentStatus["EditNeed"] = 2] = "EditNeed";
    CommentStatus[CommentStatus["Hide"] = 3] = "Hide";
    CommentStatus[CommentStatus["Disable"] = 4] = "Disable";
    CommentStatus[CommentStatus["Enable"] = 4] = "Enable";
})(CommentStatus || (CommentStatus = {}));
var PrivateCommentConfigsModel = (function () {
    function PrivateCommentConfigsModel() {
    }
    return PrivateCommentConfigsModel;
}());
var rpc_comment_getList = function (ctx, logger, nk, payload) {
    try {
        var input = JSON.parse(payload);
        var dbRes = getCommentsList(ctx, logger, nk, input);
        return JSON.stringify(dbRes);
    }
    catch (e) {
        return JSON.stringify(new BaseResponseModel(null, new BaseErrorModel(0, "exception")));
    }
};
function comment_createTables(ctx, logger, nk) {
    logger.info(" ------ comment start CREATE TABLE --------------------------------------");
    var parameters = [];
    var queryStr = 'CREATE TABLE IF NOT EXISTS z_comment (' +
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
    logger.info(" ------ comment end CREATE TABLE --------------------------------------");
}
function initPrivateCommentConfigsDefault(nk, logger) {
    var configs = {
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
    }
    catch (e) {
        logger.error("init configs error", e);
    }
}
function createPrivateCommentConfigsDefault() {
    var result = new PrivateCommentConfigsModel();
    return result;
}
function getPrivateCommentConfigs(nk, logger) {
    try {
        var configs = {
            collection: "private_configuration",
            key: "comment_configs",
            userId: StaticData.ADMIN_USER_ID
        };
        var res = nk.storageRead([configs]);
        return [res[0].version, res[0].value];
    }
    catch (error) {
        logger.error('An error occurred: %s', error);
        return [null, null];
    }
}
function getCommentsList(ctx, logger, nk, queryModel) {
    logger.info(" ------ login getVerifyCodeByPhone --------------------------------------");
    queryModel.tableName = "z_comment";
    var query = generate_select_query(nk, logger, queryModel);
    try {
        var result = runSqlQuery(nk, logger, query, []);
        if (result.length > 0)
            return result;
        return null;
    }
    catch (e) {
        return null;
    }
}
var db_init = function (ctx, logger, nk) {
};
function generate_select_query(nk, logger, inputData) {
    var params = [];
    var param1 = inputData.selectColumnNames.join(',');
    params.push(param1);
    var param2 = inputData.tableName;
    params.push(param2);
    var param3 = "";
    if (inputData.asOfSystemModel != null) {
        param3 += " AS OF SYSTEM " + AsOfSystemType[inputData.asOfSystemModel.type] + " " + inputData.asOfSystemModel.value;
        params.push(param3);
    }
    if (inputData.whereModels != null && inputData.whereModels.length > 0) {
        param3 += " WHERE ";
        inputData.whereModels.forEach(function (value, index) {
            value.whereFields.forEach(function (item) {
                param3 += generateWhereField(item);
            });
            if (value.operator != OperatorType.None) {
                switch (value.operator) {
                    case OperatorType.And:
                        param3 += " AND ";
                        break;
                    case OperatorType.Or:
                        param3 += " OR ";
                        break;
                }
            }
        });
    }
    if (inputData.sort != null && inputData.sort.length > 0) {
        param3 += " ORDER by ";
        inputData.sort.forEach(function (value, index) {
            if (index === 0)
                param3 += value.fieldName + " " + value.sortType;
            else
                param3 += "," + value.fieldName + " " + value.sortType;
        });
    }
    if (inputData.limit != null && inputData.limit > 0) {
        param3 += " Limit " + inputData.limit;
    }
    if (inputData.offset != null) {
        param3 += " OFFSET " + inputData.offset;
    }
    params.push(param3);
    return "SELECT ".concat(param1, "\n          FROM ").concat(param2, " ").concat(param3, ";");
}
function generateWhereField(whereField) {
    var res = " ";
    switch (whereField.operator) {
        case OperatorType.None:
            res = " ";
            break;
        case OperatorType.GreaterThan:
            res = whereField.fieldName + " > " + whereField.fieldValue;
            break;
        case OperatorType.GreaterThanOrEqual:
            res = whereField.fieldName + " >= " + whereField.fieldValue;
            break;
        case OperatorType.LessThan:
            res = whereField.fieldName + " < " + whereField.fieldValue;
            break;
        case OperatorType.LessThanOrEqual:
            res = whereField.fieldName + " <= " + whereField.fieldValue;
            break;
        case OperatorType.Equal:
            res = whereField.fieldName + " = " + whereField.fieldValue;
            break;
        case OperatorType.NotEqual:
            res = whereField.fieldName + " =! " + whereField.fieldValue;
            break;
        case OperatorType.And:
            res = " ";
            break;
        case OperatorType.Or:
            res = " ";
            break;
        case OperatorType.Not:
            res = " ";
            break;
        case OperatorType.Like:
            res = whereField.fieldName + " LIKE " + whereField.fieldValue;
            break;
        case OperatorType.NotLike:
            res = whereField.fieldName + " NOT LIKE " + whereField.fieldValue;
            break;
        case OperatorType.ANY:
            res = whereField.fieldName + " = ANY(ARRAY" + whereField.fieldValue + ")";
            break;
        case OperatorType.ISNULL:
            res = whereField.fieldName + " ISNULL";
            break;
        case OperatorType.NOTNULL:
            res = whereField.fieldName + " NOTNULL";
            break;
    }
    return res + " ";
}
function generate_update_query(nk, logger, inputData) {
    var params = [];
    var param1 = inputData.tableName;
    params.push(param1);
    var param2 = inputData.setFields.map(function (field) {
        return field.keyName + "=" + field.value;
    }).join(',');
    params.push(param2);
    var param3 = "";
    if (inputData.whereModels != null && inputData.whereModels.length > 0) {
        param3 += " WHERE ";
        inputData.whereModels.forEach(function (value, index) {
            value.whereFields.forEach(function (item) {
                param3 += generateWhereField(item);
            });
            if (value.operator != OperatorType.None) {
                switch (value.operator) {
                    case OperatorType.And:
                        param3 += " AND ";
                        break;
                    case OperatorType.Or:
                        param3 += " OR ";
                        break;
                }
            }
        });
    }
    params.push(param3);
    console.info("generate_update_query params: ", params);
    return "UPDATE ".concat(param1, "\n          SET ").concat(param2, "\n                ").concat(param3, ";");
}
function runSqlQuery(nk, logger, query, args) {
    if (logger === void 0) { logger = null; }
    logger.info("runSqlQuery: " + query);
    var result = nk.sqlQuery(query, args);
    result.forEach(function (value) {
        value = parseDbToModel(value, logger);
    });
    return result;
}
function parseDbToModel(dbModel, logger) {
    if (logger === void 0) { logger = null; }
    var propNames = Object.getOwnPropertyNames(dbModel);
    propNames.forEach(function (propName) {
        if (dbModel[propName] != null && typeof dbModel[propName] == "object") {
            try {
                dbModel[propName] = JSON.parse(String.fromCharCode.apply(String, dbModel[propName]));
            }
            catch (e) {
            }
        }
    });
    return dbModel;
}
var ghasedakSms_init = function (ctx, logger, nk) {
    initPrivateGhasedakSmsConfigsDefault(nk, logger);
};
function sendVerificationCode(ctx, logger, nk, phoneNumber, template, params) {
    logger.info("sendVerificationCode start");
    var smsConfig = getPrivateGhasedakSmsConfigs(nk, logger)[1];
    var smsApiUrl = "".concat(smsConfig.ghasedakSmsApiBaseUrl, "/").concat(smsConfig.verifySendEndPoint);
    var headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "apikey": smsConfig.ghasedakSmsApiKey,
    };
    var body = "receptor=".concat(phoneNumber, "&template=").concat(template, "&type=1");
    params.forEach(function (param, index) {
        body += "&param".concat(index + 1, "=").concat(param);
    });
    logger.info("sendVerificationCode smsApiUrl: " + smsApiUrl);
    logger.info("sendVerificationCode body: " + body);
    var res = nk.httpRequest(smsApiUrl, "post", headers, body, 7000);
    var kavenegarSmsRes = JSON.parse(res.body);
    return kavenegarSmsRes;
}
var PrivateGhasedakSmsConfigsModel = (function () {
    function PrivateGhasedakSmsConfigsModel(ghasedakSmsApiBaseUrl, ghasedakSmsApiKey, verifySendEndPoint) {
        if (ghasedakSmsApiBaseUrl === void 0) { ghasedakSmsApiBaseUrl = ""; }
        if (ghasedakSmsApiKey === void 0) { ghasedakSmsApiKey = ""; }
        if (verifySendEndPoint === void 0) { verifySendEndPoint = ""; }
        this.ghasedakSmsApiBaseUrl = ghasedakSmsApiBaseUrl;
        this.ghasedakSmsApiKey = ghasedakSmsApiKey;
        this.verifySendEndPoint = verifySendEndPoint;
    }
    return PrivateGhasedakSmsConfigsModel;
}());
function initPrivateGhasedakSmsConfigsDefault(nk, logger) {
    var configs = {
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
    }
    catch (e) {
        logger.error("init configs error", e);
    }
}
function createPrivateGhasedakSmsConfigsDefault() {
    var result = new PrivateGhasedakSmsConfigsModel();
    result.ghasedakSmsApiBaseUrl = "https://api.ghasedak.me/v2";
    result.ghasedakSmsApiKey = "bc8cc6d96c6c29abed28039a864895d32ced99abc91b2600b8b825fe3f7a6143";
    result.verifySendEndPoint = "/verification/send/simple";
    return result;
}
function getPrivateGhasedakSmsConfigs(nk, logger) {
    try {
        var configs = {
            collection: "private_configuration",
            key: "ghasedakSms_configs",
            userId: StaticData.ADMIN_USER_ID
        };
        var res = nk.storageRead([configs]);
        return [res[0].version, res[0].value];
    }
    catch (error) {
        logger.error('An error occurred: %s', error);
        return [null, null];
    }
}
var login_init = function (ctx, logger, nk) {
    login_createTables(ctx, logger, nk);
    initPrivateLoginConfigsDefault(nk, logger);
};
var hook_login_afterAuthenticateDevice = function (ctx, logger, nk, data, request) {
    if (data.created) {
        setDefaultWallet(ctx, logger, nk, null, true);
        changeDisplayName(ctx, logger, nk, "Guest " + ctx.username);
        initUserConfigsDefault(ctx, nk, logger);
    }
    else {
    }
};
var hook_login_beforeAuthenticateCustom = function (ctx, logger, nk, request) {
    try {
        logger.info("hook_login_beforeAuthenticateCustom start");
        if (request.account.vars.token == null || request.account.vars.token == "") {
            return null;
        }
        logger.info("hook_login_beforeAuthenticateCustom 1");
        var tokenStr = decrypt(getPrivateLoginConfigs(nk, logger)[1].tokenSeed, request.account.vars.token);
        if (tokenStr == null || tokenStr == "") {
            return null;
        }
        logger.info("hook_login_beforeAuthenticateCustom 2");
        var tokenParsed = JSON.parse(tokenStr);
        logger.info("hook_login_beforeAuthenticateCustom 3");
        logger.info("hook_login_beforeAuthenticateCustom tokenParsed: " + JSON.stringify(tokenParsed));
        logger.info("parseISOString(tokenParsed.createdAt).getTime(): " + new Date(tokenParsed.createdAt).getTime());
        logger.info("dateAdd(new Date(), 'month', 6): " + dateAdd(new Date(), 'month', 6).getTime());
        if (tokenParsed.phoneNumber == null || tokenParsed.phoneNumber == "" ||
            tokenParsed.unique_identifier == null || tokenParsed.unique_identifier == "" ||
            tokenParsed.createdAt == null ||
            new Date(tokenParsed.createdAt).getTime() > dateAdd(new Date(), 'month', 6).getTime()) {
            logger.info("hook_login_beforeAuthenticateCustom 4");
            return null;
        }
        logger.info("hook_login_beforeAuthenticateCustom 5");
        request.account.id = tokenParsed.phoneNumber;
        return request;
    }
    catch (e) {
        return null;
    }
};
var hook_login_afterAuthenticateCustom = function (ctx, logger, nk, data, request) {
    if (data.created) {
        setDefaultWallet(ctx, logger, nk, null, true);
        changeDisplayName(ctx, logger, nk, "TIRO " + ctx.username);
        initUserConfigsDefault(ctx, nk, logger);
    }
    else {
    }
};
var GhasedakSmsResponse = (function () {
    function GhasedakSmsResponse(result, items) {
        if (result === void 0) { result = null; }
        if (items === void 0) { items = []; }
        this.result = result;
        this.items = items;
    }
    return GhasedakSmsResponse;
}());
var GhasedakSmsResult = (function () {
    function GhasedakSmsResult(code, message) {
        if (code === void 0) { code = null; }
        if (message === void 0) { message = null; }
        this.code = code;
        this.message = message;
    }
    return GhasedakSmsResult;
}());
var PrivateLoginConfigsModel = (function () {
    function PrivateLoginConfigsModel(ghasedakSmsLoginTemplateName, tokenSeed) {
        if (ghasedakSmsLoginTemplateName === void 0) { ghasedakSmsLoginTemplateName = ""; }
        if (tokenSeed === void 0) { tokenSeed = ""; }
        this.ghasedakSmsLoginTemplateName = ghasedakSmsLoginTemplateName;
        this.tokenSeed = tokenSeed;
    }
    return PrivateLoginConfigsModel;
}());
var VerificationCodeDbModel = (function () {
    function VerificationCodeDbModel(phone_number, unique_identifier, code, updated_at) {
        if (phone_number === void 0) { phone_number = null; }
        if (unique_identifier === void 0) { unique_identifier = null; }
        if (code === void 0) { code = null; }
        if (updated_at === void 0) { updated_at = null; }
        this.phone_number = phone_number;
        this.unique_identifier = unique_identifier;
        this.code = code;
        this.updated_at = updated_at;
    }
    return VerificationCodeDbModel;
}());
var VerificationCodeInfo = (function () {
    function VerificationCodeInfo(phoneNumber, deviceId, code) {
        if (phoneNumber === void 0) { phoneNumber = ""; }
        if (deviceId === void 0) { deviceId = ""; }
        if (code === void 0) { code = null; }
        this.phoneNumber = phoneNumber;
        this.deviceId = deviceId;
        this.code = code;
    }
    return VerificationCodeInfo;
}());
var rpc_login_getVerificationCode = function (ctx, logger, nk, payload) {
    try {
        var input = JSON.parse(payload);
        if (input.phoneNumber == null || input.phoneNumber == "" ||
            input.deviceId == null || input.deviceId == "") {
            return JSON.stringify(new BaseResponseModel(null, new BaseErrorModel(0, "input data is invalid.")));
        }
        var code = randomIntegerMaxIncluded(1234, 9876);
        var res = {};
        var plconfig = getPrivateLoginConfigs(nk, logger)[1];
        var smsRes = void 0;
        logger.info("plconfig: " + JSON.stringify(plconfig));
        if (plconfig != null)
            smsRes = sendVerificationCode(ctx, logger, nk, input.phoneNumber, plconfig.ghasedakSmsLoginTemplateName, [code.toString()]);
        else
            return JSON.stringify(new BaseResponseModel(null, new BaseErrorModel(0, "can not send sms")));
        if (smsRes.items == null) {
            return JSON.stringify(new BaseResponseModel(null, new BaseErrorModel(0, "send sms receive error")));
        }
        saveVerifyCode(ctx, logger, nk, input.phoneNumber, code, input.deviceId);
        res.status = true;
        res.code = code;
        return JSON.stringify(new BaseResponseModel(res, null));
    }
    catch (e) {
        return JSON.stringify(new BaseResponseModel(null, new BaseErrorModel(0, "exception")));
    }
};
var rpc_login_checkVerificationCode = function (ctx, logger, nk, payload) {
    try {
        var input = JSON.parse(payload);
        if (input.phoneNumber == null || input.phoneNumber == "" ||
            input.code == null || input.code < 1000 || input.deviceId == null || input.deviceId == "") {
            return JSON.stringify(new BaseResponseModel(null, new BaseErrorModel(0, "input data is invalid.")));
        }
        var res = {};
        var dbRes = getVerifyCodeByPhone(ctx, logger, nk, input.phoneNumber);
        if (dbRes.code === input.code && dbRes.unique_identifier === input.deviceId) {
            if (Date.now() > dateAdd(parseISOString(dbRes.updated_at.toString()), 'minute', 1).getTime()) {
                return JSON.stringify(new BaseResponseModel(null, new BaseErrorModel(0, "expired")));
            }
            var token = crypt(getPrivateLoginConfigs(nk, logger)[1].tokenSeed, JSON.stringify({
                phoneNumber: input.phoneNumber,
                unique_identifier: input.deviceId,
                createdAt: Date.now()
            }));
            logger.info("token: " + token);
            res.token = token;
            logger.info(token);
        }
        else {
            return JSON.stringify(new BaseResponseModel(null, new BaseErrorModel(0, "not valid data")));
        }
        return JSON.stringify(res);
    }
    catch (e) {
        return JSON.stringify(new BaseResponseModel(null, new BaseErrorModel(0, "exception")));
    }
};
function login_createTables(ctx, logger, nk) {
    logger.info(" ------ login start CREATE TABLE --------------------------------------");
    var parameters = [];
    var queryStr = 'CREATE TABLE IF NOT EXISTS z_login_verify_code (' +
        'phone_number VARCHAR(20) NOT NULL,' +
        'code SMALLINT NOT NULL,' +
        'unique_identifier VARCHAR(255) NOT NULL,' +
        'updated_at TIMESTAMP NOT NULL DEFAULT now(),' +
        'CONSTRAINT "primary" PRIMARY KEY (phone_number ASC)' +
        ')';
    runSqlQuery(nk, logger, queryStr, parameters);
    logger.info(" ------ login end CREATE TABLE --------------------------------------");
}
function saveVerifyCode(ctx, logger, nk, phoneNumber, code, uniqueIdentifier) {
    logger.info(" ------ login start saveVerifyCode --------------------------------------");
    var parameters = [];
    var queryStr = 'UPSERT INTO z_login_verify_code ' +
        '(phone_number,code,unique_identifier,updated_at) VALUES (' +
        "'".concat(phoneNumber, "',").concat(code, ",'").concat(uniqueIdentifier, "','").concat(new Date().toISOString(), "')");
    runSqlQuery(nk, logger, queryStr, parameters);
    logger.info(" ------ login end saveVerifyCode --------------------------------------");
}
function getVerifyCodeByPhone(ctx, logger, nk, phoneNumber) {
    logger.info(" ------ login getVerifyCodeByPhone --------------------------------------");
    var queryModel = new QueryInputModel();
    queryModel.tableName = "z_login_verify_code";
    queryModel.selectColumnNames = ["*"];
    queryModel.whereModels = [new DbWhereModel([new DbWhereFieldModel("phone_number", "'".concat(phoneNumber, "'"), OperatorType.Equal)])];
    var query = generate_select_query(nk, logger, queryModel);
    try {
        var result = runSqlQuery(nk, logger, query, []);
        if (result.length > 0)
            return result[0];
        return null;
    }
    catch (e) {
        return null;
    }
}
function initPrivateLoginConfigsDefault(nk, logger) {
    var configs = {
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
    }
    catch (e) {
        logger.error("init configs error", e);
    }
}
function createPrivateLoginConfigsDefault() {
    var result = new PrivateLoginConfigsModel();
    result.ghasedakSmsLoginTemplateName = "LoginTest";
    result.tokenSeed = "F7QFWDM5OZPZW56WMF2EKDGLKB73NE7S";
    return result;
}
function getPrivateLoginConfigs(nk, logger) {
    try {
        var configs = {
            collection: "private_configuration",
            key: "login_configs",
            userId: StaticData.ADMIN_USER_ID
        };
        var res = nk.storageRead([configs]);
        return [res[0].version, res[0].value];
    }
    catch (error) {
        logger.error('An error occurred: %s', error);
        return [null, null];
    }
}
var place_init = function (ctx, logger, nk) {
    place_createTables(ctx, logger, nk);
    initPrivatePlaceConfigsDefault(nk, logger);
};
var WorkTime = (function () {
    function WorkTime() {
    }
    return WorkTime;
}());
var WorkTimeShift = (function () {
    function WorkTimeShift() {
    }
    return WorkTimeShift;
}());
var PlaceModel = (function () {
    function PlaceModel() {
    }
    return PlaceModel;
}());
var PlaceType;
(function (PlaceType) {
    PlaceType[PlaceType["None"] = 0] = "None";
})(PlaceType || (PlaceType = {}));
var PlaceCategory;
(function (PlaceCategory) {
    PlaceCategory[PlaceCategory["None"] = 0] = "None";
    PlaceCategory[PlaceCategory["ShopCar"] = 1] = "ShopCar";
    PlaceCategory[PlaceCategory["ShopCarAccessory"] = 2] = "ShopCarAccessory";
    PlaceCategory[PlaceCategory["GasStation"] = 3] = "GasStation";
    PlaceCategory[PlaceCategory["Restaurant"] = 4] = "Restaurant";
    PlaceCategory[PlaceCategory["CarService"] = 4] = "CarService";
})(PlaceCategory || (PlaceCategory = {}));
var PlaceStatus;
(function (PlaceStatus) {
    PlaceStatus[PlaceStatus["None"] = 0] = "None";
    PlaceStatus[PlaceStatus["VerifyNeed"] = 1] = "VerifyNeed";
    PlaceStatus[PlaceStatus["EditNeed"] = 2] = "EditNeed";
    PlaceStatus[PlaceStatus["Hide"] = 3] = "Hide";
    PlaceStatus[PlaceStatus["Disable"] = 4] = "Disable";
    PlaceStatus[PlaceStatus["Enable"] = 4] = "Enable";
})(PlaceStatus || (PlaceStatus = {}));
var PrivatePlaceConfigsModel = (function () {
    function PrivatePlaceConfigsModel() {
    }
    return PrivatePlaceConfigsModel;
}());
var rpc_place_getList = function (ctx, logger, nk, payload) {
    try {
        var input = JSON.parse(payload);
        var dbRes = getPlacesList(ctx, logger, nk, input);
        return JSON.stringify(dbRes);
    }
    catch (e) {
        return JSON.stringify(new BaseResponseModel(null, new BaseErrorModel(0, "exception")));
    }
};
function place_createTables(ctx, logger, nk) {
    logger.info(" ------ place start CREATE TABLE --------------------------------------");
    var parameters = [];
    var queryStr = 'CREATE TABLE IF NOT EXISTS z_place (' +
        'id UUID NOT NULL DEFAULT gen_random_uuid(),' +
        'created_at TIMESTAMP NOT NULL DEFAULT now(),' +
        'updated_at TIMESTAMP NOT NULL DEFAULT now(),' +
        'type_place SMALLINT NOT NULL DEFAULT 0,' +
        'category SMALLINT NOT NULL DEFAULT 0,' +
        'creator_id UUID NOT NULL,' +
        'owner_id UUID,' +
        'logo_url VARCHAR(512),' +
        'images_url VARCHAR[],' +
        'title VARCHAR(512),' +
        'description VARCHAR,' +
        'location GEOGRAPHY,' +
        'address VARCHAR(512),' +
        'attributes_key VARCHAR(128)[],' +
        'attributes_type SMALLINT[],' +
        'attributes_value VARCHAR[],' +
        'verify_state SMALLINT NOT NULL DEFAULT 0,' +
        'verified_at TIMESTAMP,' +
        'verified_by UUID, ' +
        'status SMALLINT NOT NULL DEFAULT 0,' +
        'CONSTRAINT "primary" PRIMARY KEY (id ASC),' +
        'CONSTRAINT fk_creator_id_ref_users  FOREIGN  KEY(creator_id)  REFERENCES  users(id),' +
        'CONSTRAINT fk_owner_id_ref_users  FOREIGN  KEY(owner_id)  REFERENCES  users(id),' +
        'CONSTRAINT fk_verified_by_ref_users  FOREIGN  KEY(verified_by)  REFERENCES  users(id)' +
        ')';
    runSqlQuery(nk, logger, queryStr, parameters);
    logger.info(" ------ place end CREATE TABLE --------------------------------------");
}
function initPrivatePlaceConfigsDefault(nk, logger) {
    var configs = {
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
    }
    catch (e) {
        logger.error("init configs error", e);
    }
}
function createPrivatePlaceConfigsDefault() {
    var result = new PrivatePlaceConfigsModel();
    return result;
}
function getPrivatePlaceConfigs(nk, logger) {
    try {
        var configs = {
            collection: "private_configuration",
            key: "place_configs",
            userId: StaticData.ADMIN_USER_ID
        };
        var res = nk.storageRead([configs]);
        return [res[0].version, res[0].value];
    }
    catch (error) {
        logger.error('An error occurred: %s', error);
        return [null, null];
    }
}
function getPlacesList(ctx, logger, nk, queryModel) {
    logger.info(" ------ login getVerifyCodeByPhone --------------------------------------");
    queryModel.tableName = "z_place";
    var query = generate_select_query(nk, logger, queryModel);
    try {
        var result = runSqlQuery(nk, logger, query, []);
        if (result.length > 0)
            return result;
        return null;
    }
    catch (e) {
        return null;
    }
}
var server_init = function (ctx, logger, nk) {
    initServerConfigs(ctx, logger, nk);
};
function initServerConfigs(ctx, logger, nk) {
    initPrivateServerConfigsDefault(nk, logger);
    initPublicServerConfigsDefault(nk, logger);
}
function initPrivateServerConfigsDefault(nk, logger) {
    var configs = {
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
    }
    catch (e) {
        logger.error("init configs error", e);
    }
}
function createPrivateServerConfigsDefault() {
    var result = new PrivateServerConfigsModel();
    return result;
}
function getPrivateServerConfigs(nk, logger) {
    try {
        var configs = {
            collection: "private_configuration",
            key: "server_configs",
            userId: StaticData.ADMIN_USER_ID
        };
        var res = nk.storageRead([configs]);
        return [res[0].version, res[0].value];
    }
    catch (error) {
        logger.error('An error occurred: %s', error);
        return [null, null];
    }
}
function initPublicServerConfigsDefault(nk, logger) {
    var configs = {
        collection: "public_configuration",
        key: "server_configs",
        userId: StaticData.ADMIN_USER_ID,
        value: createPublicServerConfigsDefault(),
        permissionRead: 2,
        permissionWrite: 0,
        version: "*"
    };
    try {
        nk.storageWrite([configs]);
    }
    catch (e) {
        logger.error("init configs error", e);
    }
}
function createPublicServerConfigsDefault() {
    var result = new PublicServerConfigsModel();
    result.baseCdnUrl = "http://localhost/hero-game/cdn";
    return result;
}
function getPublicServerConfigs(nk, logger) {
    try {
        var configs = {
            collection: "public_configuration",
            key: "server_configs",
            userId: StaticData.ADMIN_USER_ID
        };
        var res = nk.storageRead([configs]);
        return [res[0].version, res[0].value];
    }
    catch (error) {
        logger.error('An error occurred: %s', error);
        return [null, null];
    }
}
function getStorages(nk, objectIds) {
    try {
        return nk.storageRead(objectIds);
    }
    catch (error) {
        return null;
    }
}
function changeDisplayName(ctx, logger, nk, newName, userId) {
    try {
        nk.accountUpdateId(userId ? userId : ctx.userId, null, newName);
        return true;
    }
    catch (error) {
        logger.error('An error occurred: %s', error);
        return false;
    }
}
function setUserStoragePublic(ctx, logger, nk, configsData, userId, version) {
    try {
        var configs = {
            collection: "user_configuration",
            key: "public_configs",
            userId: userId ? userId : ctx.userId,
            value: configsData,
            permissionRead: 2,
            permissionWrite: 0
        };
        if (version)
            configs.version = version;
        nk.storageWrite([configs]);
        return true;
    }
    catch (error) {
        logger.error('An error occurred: %s', error);
        return false;
    }
}
function setUserStoragePrivate(ctx, logger, nk, configsData, userId, version) {
    try {
        var configs = {
            collection: "user_configuration",
            key: "private_configs",
            userId: userId ? userId : ctx.userId,
            value: configsData,
            permissionRead: 0,
            permissionWrite: 0
        };
        if (version)
            configs.version = version;
        nk.storageWrite([configs]);
        return true;
    }
    catch (error) {
        logger.error('An error occurred: %s', error);
        return false;
    }
}
function setUserStorageMutable(ctx, logger, nk, configsData, userId, version) {
    try {
        var configs = {
            collection: "user_configuration",
            key: "mutable_configs",
            userId: userId ? userId : ctx.userId,
            value: configsData,
            permissionRead: 2,
            permissionWrite: 1
        };
        if (version)
            configs.version = version;
        nk.storageWrite([configs]);
        return true;
    }
    catch (error) {
        logger.error('An error occurred: %s', error);
        return false;
    }
}
function setUserStorageReadable(ctx, logger, nk, configsData, userId, version) {
    try {
        var configs = {
            collection: "user_configuration",
            key: "readable_configs",
            userId: userId ? userId : ctx.userId,
            value: configsData,
            permissionRead: 1,
            permissionWrite: 0
        };
        if (version)
            configs.version = version;
        nk.storageWrite([configs]);
        return true;
    }
    catch (error) {
        logger.error('An error occurred: %s', error);
        return false;
    }
}
function getUserStoragePublic(ctx, logger, nk, userId) {
    try {
        var configs = {
            collection: "user_configuration",
            key: "public_configs",
            userId: userId ? userId : ctx.userId
        };
        var res = nk.storageRead([configs]);
        return [res[0].version, res[0].value];
    }
    catch (error) {
        logger.error('An error occurred: %s', error);
        return [null, null];
    }
}
function getUserStoragePrivate(ctx, logger, nk, userId) {
    try {
        var configs = {
            collection: "user_configuration",
            key: "private_configs",
            userId: userId ? userId : ctx.userId
        };
        var res = nk.storageRead([configs]);
        return [res[0].version, res[0].value];
    }
    catch (error) {
        logger.error('An error occurred: %s', error);
        return [null, null];
    }
}
function getUserStorageMutable(ctx, logger, nk, userId) {
    try {
        var configs = {
            collection: "user_configuration",
            key: "mutable_configs",
            userId: userId ? userId : ctx.userId
        };
        var res = nk.storageRead([configs]);
        return [res[0].version, res[0].value];
    }
    catch (error) {
        logger.error('An error occurred: %s', error);
        return [null, null];
    }
}
function getUserStorageReadable(ctx, logger, nk, userId) {
    try {
        var configs = {
            collection: "user_configuration",
            key: "readable_configs",
            userId: userId ? userId : ctx.userId
        };
        var res = nk.storageRead([configs]);
        return [res[0].version, res[0].value];
    }
    catch (error) {
        logger.error('An error occurred: %s', error);
        return [null, null];
    }
}
function initUserConfigsDefault(ctx, nk, logger) {
    var publicConfig = new UserStoragePublicConfigsModel();
    setUserStoragePublic(ctx, logger, nk, publicConfig);
    var privateConfig = new UserStoragePrivateConfigsModel();
    setUserStoragePrivate(ctx, logger, nk, privateConfig);
    var mutableConfig = new UserStorageMutableConfigsModel();
    mutableConfig.soundVolume = 1;
    mutableConfig.musicVolume = 1;
    setUserStorageMutable(ctx, logger, nk, mutableConfig);
}
var rpcChangeOwnDisplayName = function (ctx, logger, nk, newName) {
    try {
        if (changeDisplayName(ctx, logger, nk, newName))
            return JSON.stringify(new BaseResponseModel({ status: true }));
        else
            return JSON.stringify(new BaseResponseModel(null, new BaseErrorModel(0, "An error occurred")));
    }
    catch (error) {
        logger.error('An error occurred: %s', error);
        return JSON.stringify(new BaseResponseModel(null, new BaseErrorModel(0, JSON.stringify(error))));
    }
};
function getWallet(ctx, logger, nk, userId) {
    try {
        var results = void 0;
        results = nk.accountGetId(userId ? userId : ctx.userId);
        var userWalletModel = results.wallet;
        return userWalletModel;
    }
    catch (error) {
        logger.info("getWallet - error: ", error);
        return null;
    }
}
function updateWallet(ctx, logger, nk, userWalletModel, userWalletMetaDataModel, updateLedger, userId) {
    if (updateLedger === void 0) { updateLedger = true; }
    try {
        var results = void 0;
        results = nk.walletUpdate(ctx.userId, userWalletModel.toKeyValue(), userWalletMetaDataModel.toKeyValue(), updateLedger);
        return results;
    }
    catch (error) {
        logger.info("updateWallet - error: ", error);
        return null;
    }
}
function setDefaultWallet(ctx, logger, nk, userId, isForce) {
    if (isForce === void 0) { isForce = false; }
    var result;
    try {
        if (isForce) {
            logger.info("setDefaultWallet - result.updated: ", result.updated);
        }
        else {
            var wallet = getWallet(ctx, logger, nk, userId);
            if (!wallet) {
                logger.info("setDefaultWallet - result.updated: ", result.updated);
            }
        }
    }
    catch (error) {
        logger.info("setDefaultWallet - error: ", error);
    }
}
var rpcSelectQuery = function (ctx, logger, nk, payload) {
    var input = JSON.parse(payload);
    var query = generate_select_query(nk, logger, input);
    try {
        var result = runSqlQuery(nk, logger, query, []);
        return JSON.stringify(result);
    }
    catch (e) {
        return query;
    }
};
