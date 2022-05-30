
const db_init = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama) {

}

function generate_select_query(nk: nkruntime.Nakama, logger: nkruntime.Logger, inputData: QueryInputModel): string {
    let params: any[] = [];
    let param1: string = inputData.selectColumnNames.join(',');
    params.push(param1);
    let param2: string = inputData.tableName;
    params.push(param2);
    let param3: string = "";
    if (inputData.asOfSystemModel != null) {
        param3 += " AS OF SYSTEM " + AsOfSystemType[inputData.asOfSystemModel.type] + " " + inputData.asOfSystemModel.value;
        params.push(param3);
    }
    if (inputData.whereModels != null && inputData.whereModels.length > 0) {
        param3 += " WHERE ";
        inputData.whereModels.forEach((value, index) => {
            value.whereFields.forEach((item) => {
                param3 += generateWhereField(item);
            });
            if (value.operator != OperatorType.None) {
                switch (value.operator) {
                    case OperatorType.And:
                        param3 += " AND "
                        break;
                    case OperatorType.Or:
                        param3 += " OR "
                        break;
                }
            }
        });
    }
    if (inputData.sort != null && inputData.sort.length > 0) {
        param3 += " ORDER by "
        inputData.sort.forEach((value, index) => {
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
    return `SELECT ${param1}
          FROM ${param2} ${param3};`;
}
function generateWhereField(whereField: DbWhereFieldModel): string {
    let res: string = " ";
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
            res = " "
            break;
        case OperatorType.Or:
            res = " "
            break;
        case OperatorType.Not:
            res = " "
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
function generate_update_query(nk: nkruntime.Nakama, logger: nkruntime.Logger, inputData: QueryInputModel): string {
    let params: any[] = [];
    let param1: string = inputData.tableName;
    params.push(param1);
    let param2: string = inputData.setFields.map(function (field) {
        return field.keyName + "=" + field.value;
    }).join(',');
    params.push(param2);
    let param3: string = "";
    if (inputData.whereModels != null && inputData.whereModels.length > 0) {
        param3 += " WHERE ";
        inputData.whereModels.forEach((value, index) => {
            value.whereFields.forEach((item) => {
                param3 += generateWhereField(item);
            });
            if (value.operator != OperatorType.None) {
                switch (value.operator) {
                    case OperatorType.And:
                        param3 += " AND "
                        break;
                    case OperatorType.Or:
                        param3 += " OR "
                        break;
                }
            }
        });
    }
    params.push(param3);
    console.info("generate_update_query params: ", params);
    return `UPDATE ${param1}
          SET ${param2}
                ${param3};`;
}


function runSqlQuery(nk: nkruntime.Nakama, logger: nkruntime.Logger = null, query: string, args: any[]): nkruntime.SqlQueryResult {
    logger.info("runSqlQuery: " + query);
    let result: nkruntime.SqlQueryResult = nk.sqlQuery(query, args);
    result.forEach(function (value: any) {
        value = parseDbToModel(value, logger);
    });
    return result;
}
function parseDbToModel(dbModel: any, logger: nkruntime.Logger = null): any {
    let propNames: string[] = Object.getOwnPropertyNames(dbModel);
    propNames.forEach((propName) => {
        if (dbModel[propName] != null && typeof dbModel[propName] == "object") {
            try {
                dbModel[propName] = JSON.parse(String.fromCharCode(...dbModel[propName]));
            } catch (e) {
            }
        }
    });
    return dbModel;
}
