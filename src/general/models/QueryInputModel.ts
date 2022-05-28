class QueryInputModel {
  tableName: string;
  selectColumnNames: string[];
  asOfSystemModel: AsOfSystemModel;
  whereModels: DbWhereModel[];
  sort: DbSortModel[];
  limit: number;
  offset: number;
  queryType: QueryType;
  setFields : SetField[];

  constructor(tableName: string = "", selectColumnNames: string[] = [], asOfSystemModel: AsOfSystemModel = null,
              whereModels: DbWhereModel[] = [], sort: DbSortModel[] = [], limit: number = null, offset: number = null) {
    this.tableName = tableName;
    this.selectColumnNames = selectColumnNames;
    this.asOfSystemModel = asOfSystemModel;
    this.whereModels = whereModels;
    this.sort = sort;
    this.limit = limit;
    this.offset = offset;
  }
}

class DbWhereModel {
  whereFields: DbWhereFieldModel[];
  operator: OperatorType;

  constructor(whereFields: DbWhereFieldModel[] = [], operator: OperatorType = OperatorType.None) {
    this.whereFields = whereFields;
    this.operator = operator;
  }
}

class DbWhereFieldModel {
  fieldName: string;
  fieldValue: any;
  operator: OperatorType;

  constructor(fieldName: string = "", fieldValue: any = {}, operator: OperatorType = OperatorType.None) {
    this.fieldName = fieldName;
    this.fieldValue = fieldValue;
    this.operator = operator;
  }
}

class DbSortModel {
  fieldName: string;
  sortType: SortType;

  constructor(fieldName: string = "", sortType: SortType = SortType.None) {
    this.fieldName = fieldName;
    this.sortType = sortType;
  }
}

class SetField{
  keyName : string;
  value : string;

  constructor(keyName: string="", value: string="") {
    this.keyName = keyName;
    this.value = value;
  }
}

enum QueryType {
  None = 0,
  SELECT = 1,
  INSERT = 2,
  UPDATE = 3,
  DELETE = 4
}

enum SortType {
  None = 0,
  ASC = 1,
  DESC = 2
}

enum OperatorType {
  None = 0,
  GreaterThan = 1,
  GreaterThanOrEqual = 2,
  LessThan = 3,
  LessThanOrEqual = 4,
  Equal = 5,
  NotEqual = 6,
  And = 7,
  Or = 8,
  Not = 9,
  Like = 10,
  NotLike = 11,
  ANY = 12,
  IN = 13,
  ISNULL = 14,
  NOTNULL = 15,
}

class KeyValueModel {
  key: string;
  value: any;

  constructor(key: string, value: any) {
    this.key = key;
    this.value = value;
  }
}

class DbPageableModel {
  pageNumber: number;
  pageSize: any;

  constructor(pageNumber: number = 0, pageSize: any = {}) {
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
  }
}


class SelectQueryOutputModel {
  pageNumber: number;
  totalPageSize: number;
  rows: any[];

  constructor(pageNumber: number = 0, totalPageSize: number = 0, rows: any[] = []) {
    this.pageNumber = pageNumber;
    this.totalPageSize = totalPageSize;
    this.rows = rows;
  }
}


class AsOfSystemModel {
  type: AsOfSystemType;
  value: string;

  constructor(type: AsOfSystemType = AsOfSystemType.None, value: string = "") {
    this.type = type;
    this.value = value;
  }
}

enum AsOfSystemType {
  None = 0,
  Time = 1
}
