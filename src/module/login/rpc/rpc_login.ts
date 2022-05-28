const rpc_login_getVerificationCode: nkruntime.RpcFunction =
    function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
        try {
            
            //check input data
            const input: VerificationCodeInfo = JSON.parse(payload);
            if (input.phoneNumber == null || input.phoneNumber == "" ||
                input.deviceId == null || input.deviceId == "") {
                return JSON.stringify(new BaseResponseModel(null, new BaseErrorModel(0, "input data is invalid.")));
            }
            
            //calc new code
            let code: number = randomIntegerMaxIncluded(1234, 9876);
            let res: any = {};
            
            // send sms code
            let plconfig: PrivateLoginConfigsModel = getPrivateLoginConfigs(nk, logger)[1];
            let smsRes: GhasedakSmsResponse;
            
            logger.info("plconfig: " + JSON.stringify(plconfig));
            
            if (plconfig != null)
                smsRes = sendVerificationCode(ctx, logger, nk, input.phoneNumber, plconfig.ghasedakSmsLoginTemplateName, [code.toString()])
            else
                return JSON.stringify(new BaseResponseModel(null, new BaseErrorModel(0, "can not send sms")));
            
            // check send sms code
            if (smsRes.items == null) {
                return JSON.stringify(new BaseResponseModel(null, new BaseErrorModel(0, "send sms receive error")));
            }
            
            // save code to db
            saveVerifyCode(ctx, logger, nk, input.phoneNumber, code, input.deviceId);
            res.status = true;
            
            //TODO delete test code
            res.code = code;
            
            return JSON.stringify(new BaseResponseModel(res, null));
        } catch (e) {
            return JSON.stringify(new BaseResponseModel(null, new BaseErrorModel(0, "exception")));
        }
        
    }


const rpc_login_checkVerificationCode: nkruntime.RpcFunction =
    function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
        try {
            const input: VerificationCodeInfo = JSON.parse(payload);
            if (input.phoneNumber == null || input.phoneNumber == "" ||
                input.code == null || input.code < 1000 || input.deviceId == null || input.deviceId == "") {
                return JSON.stringify(new BaseResponseModel(null, new BaseErrorModel(0, "input data is invalid.")));
            }
            let res: any = {};
            
            let dbRes: VerificationCodeDbModel = getVerifyCodeByPhone(ctx, logger, nk, input.phoneNumber);
            
            if (dbRes.code === input.code && dbRes.unique_identifier === input.deviceId) {
                //TODO create jwt token and send to user for use on login
                
                if (Date.now() > dateAdd(parseISOString(dbRes.updated_at.toString()), 'minute', 1).getTime()) {
                    return JSON.stringify(new BaseResponseModel(null, new BaseErrorModel(0, "expired")));
                }
                
                
                let token: string = crypt(getPrivateLoginConfigs(nk, logger)[1].tokenSeed, JSON.stringify({
                    phoneNumber: input.phoneNumber,
                    unique_identifier: input.deviceId,
                    createdAt: Date.now()
                }));
                logger.info("token: " + token);
                res.token = token;
                logger.info(token);
                
            } else {
                return JSON.stringify(new BaseResponseModel(null, new BaseErrorModel(0, "not valid data")));
            }
            
            return JSON.stringify(res);
        } catch (e) {
            return JSON.stringify(new BaseResponseModel(null, new BaseErrorModel(0, "exception")));
        }
        
    }


