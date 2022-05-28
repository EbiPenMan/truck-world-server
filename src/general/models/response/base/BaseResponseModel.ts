class BaseResponseModel {
  public result: any ;
  public error: BaseErrorModel | null;


  constructor(result: any, error: BaseErrorModel | null = null ) {
    this.result = result;
    this.error = error;
  }
}
