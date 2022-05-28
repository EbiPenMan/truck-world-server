const rpcSelectQuery: nkruntime.RpcFunction =
  function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    const input: QueryInputModel = JSON.parse(payload)
    const query = generate_select_query(nk, logger, input);
    try {
      const result: nkruntime.SqlQueryResult = runSqlQuery(nk,logger,query, []);
      return JSON.stringify(result);
    } catch (e) {
      return query;
    }

  }
