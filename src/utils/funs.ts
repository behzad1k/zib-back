import * as jwtDecode from "jwt-decode";
import { Repository } from "typeorm";

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

export const getSlug = async (repository: Repository<any>, value:string ) => {
    let index = 1;
    let slug = value;
    while(await repository.findOne({
        where: {
            slug: slug
        }
    })){
        slug = slug + index
        await repository.findOne({
            where: {
                slug: slug
            }
        });
        ++index;
    }
    return slug;
}

export const omit = (keys, obj) => {
    if (!keys.length) return obj
    const { [keys.pop()]: omitted, ...rest } = obj;
    return omit(keys, rest);
}