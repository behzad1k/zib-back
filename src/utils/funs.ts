import * as jwtDecode from "jwt-decode";

export const getUserId = (token:string):number =>{
    const tokens: any = jwtDecode(token);
    return tokens.userId
}

export const generateOTPCode = () => {
    var length = 6,
        charset = "0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}
