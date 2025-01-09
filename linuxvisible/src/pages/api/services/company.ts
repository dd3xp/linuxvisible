import { stringify } from "querystring";
import { get } from "../../utils/request";
import { baseUrl } from "../../utils/urlConfig";
import { createHandleCatched, createHandleResponse} from "../../utils/response";

export function getAllBoxFeatureData(
    data: {
        start_version: string,
        end_version: string
    }
){
    const url = `${baseUrl}/company/getAllBoxFeatureData`;
    return get(`${url}?${stringify(data)}`)
    .then(createHandleResponse(url))
    .catch(createHandleCatched(url));
}

export function getAllBoxCommitData(
    data: {
        start_version: string,
        end_version: string
    }
){
    const url = `${baseUrl}/company/getAllBoxCommitData`;
    return get(`${url}?${stringify(data)}`)
    .then(createHandleResponse(url))
    .catch(createHandleCatched(url));
}

export function getAllBoxCodeData(
    data: {
        start_version: string,
        end_version: string
    }
){
    const url = `${baseUrl}/company/getAllBoxCodeData`;
    return get(`${url}?${stringify(data)}`)
    .then(createHandleResponse(url))
    .catch(createHandleCatched(url));
}

/**
 * 获取公司特性贡献数据
 * @param data 请求参数，包含 start_version 和 end_version
 * @returns Promise<Result<CompanyFeatureContribution[]>>
 */
export function getCompanyFeatureContribution(
    data: { start_version: string; end_version: string }
) {
    const url = `${baseUrl}/company/getCompanyFeatureContribution`;
    return get(`${url}?${stringify(data)}`)
        .then(createHandleResponse(url))
        .catch(createHandleCatched(url));
}

/**
 * 获取公司提交贡献数据
 * @param data 请求参数，包含 start_version 和 end_version
 * @returns Promise<Result<CompanyCommitContribution[]>>
 */
export function getCompanyCommitContribution(
    data: { start_version: string; end_version: string }
) {
    const url = `${baseUrl}/company/getCompanyCommitContribution`;
    return get(`${url}?${stringify(data)}`)
        .then(createHandleResponse(url))
        .catch(createHandleCatched(url));
}

/**
 * 获取公司代码贡献数据
 * @param data 请求参数，包含 start_version 和 end_version
 * @returns Promise<Result<CompanyCodeContribution[]>>
 */
export function getCompanyCodeContribution(
    data: { start_version: string; end_version: string }
) {
    const url = `${baseUrl}/company/getCompanyCodeContribution`;
    return get(`${url}?${stringify(data)}`)
        .then(createHandleResponse(url))
        .catch(createHandleCatched(url));
}