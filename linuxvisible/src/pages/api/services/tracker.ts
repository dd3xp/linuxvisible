import { stringify } from "querystring";
import { get, post } from "../../utils/request";
import { baseUrl } from "../../utils/urlConfig";
import { createHandleCatched, createHandleResponse} from "../../utils/response";


export function getTimeTraceInfo(
    data: {
        repo: string,
        featureId: number | undefined
    }
){
    const url = `${baseUrl}/tracker/getTimeTraceInfo`;
    return get(`${url}?${stringify(data)}`)
        .then(createHandleResponse(url))
        .catch(createHandleCatched(url));
}

export function getDependTraceInfo(
    data: {
        repo: string,
        featureId: number | undefined
    }
){
    const url = `${baseUrl}/tracker/getDependTraceInfo`;
    return get(`${url}?${stringify(data)}`)
        .then(createHandleResponse(url))
        .catch(createHandleCatched(url));
}

export function trackMethod(
    data: {
        repo: string
        filePaths: string
        methodName: string
        version: string
        targetCommit: string | undefined
        baseCommit: string | undefined
    }
){
    const url = `${baseUrl}/tracker/trackMethod`;
    return get(`${url}?${stringify(data)}`)
        .then(createHandleResponse(url))
        .catch(createHandleCatched(url));
}