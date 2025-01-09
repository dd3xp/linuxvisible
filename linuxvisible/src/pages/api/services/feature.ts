import {stringify} from "querystring";
import {get} from "../../utils/request";
import {baseUrl} from "../../utils/urlConfig";
import {createHandleCatched, createHandleResponse} from "../../utils/response";

export function getVersion() {
    const url = `${baseUrl}/kg/getVersion`;
    return get(`${url}`)
        .then(createHandleResponse(url))
        .catch(createHandleCatched(url));
}

export function getFeatureListByVersion(
    data: {
        repo: string,
        startVersion: string,
        endVersion: string
    }
) {
    const url = `${baseUrl}/kg/getFeatureListByVersion`;
    return get(`${url}?${stringify(data)}`)
        .then(createHandleResponse(url))
        .catch(createHandleCatched(url));
}

export function getFeatureListByEid(
    data: {
        repo: string,
        startVersion: string,
        endVersion: string,
        kgId: number
    }
) {
    const url = `${baseUrl}/kg/getFeatureListByEid`;
    return get(`${url}?${stringify(data)}`)
        .then(createHandleResponse(url))
        .catch(createHandleCatched(url));
}

export function getFeatureModules(
    data: {
        featureId: number | undefined
    }
) {
    const url = `${baseUrl}/kg/lightKg`;
    return get(`${url}?${stringify(data)}`)
        .then(createHandleResponse(url))
        .catch(createHandleCatched(url));
}