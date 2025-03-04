import { stringify } from "querystring";
import { get } from "../utils/request";
import { baseUrl } from "../utils/urlConfig";
import { createHandleCatched, createHandleResponse} from "../utils/response";

export function getAllBoxFeatureData(
    data: {
        start_version: string,
        end_version: string,
        repo: string
        company_list: string
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
        end_version: string,
        repo: string
        company_list: string
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
        end_version: string,
        repo: string
        company_list: string
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
    data: { start_version: string; end_version: string; repo: string }
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
    data: { start_version: string; end_version: string; repo: string }
) {
    const url = `${baseUrl}/company/getCompanyCodeContribution`;
    return get(`${url}?${stringify(data)}`)
        .then(createHandleResponse(url))
        .catch(createHandleCatched(url));
}

export function getBoxFeatureContribution(
    data: {
        start_version: string,
        end_version: string,
        eid: number | null,
        company_list: string
    }
){
    const url = `${baseUrl}/company/getBoxFeatureData`;
    return get(`${url}?${stringify(data)}`)
    .then(createHandleResponse(url))
    .catch(createHandleCatched(url));
}

export function getBoxCommitContribution(
    data: {
        start_version: string,
        end_version: string,
        eid: number | null,
        repo: string,
        company_list: string
    }
){
    const url = `${baseUrl}/company/getBoxCommitData`;
    return get(`${url}?${stringify(data)}`)
    .then(createHandleResponse(url))
    .catch(createHandleCatched(url));
}

export function getBoxCodeContribution(
    data: {
        start_version: string,
        end_version: string,
        eid: number | null,
        repo: string,
        company_list: string
    }
){
    const url = `${baseUrl}/company/getBoxCodeData`;
    return get(`${url}?${stringify(data)}`)
    .then(createHandleResponse(url))
    .catch(createHandleCatched(url));
}

export function getCompanyListByVersion(
    data: {
        start_version: string,
        end_version: string
    }
){
    const url = `${baseUrl}/company/getCompanyListByVersion`;
    return get(`${url}?${stringify(data)}`)
    .then(createHandleResponse(url))
    .catch(createHandleCatched(url));
}

export function getBoxMaintainerData(
    data: {
        endVersion: string,
        repoPath: string
    }
){
    const url = `${baseUrl}/company/getBoxMaintainerData`;
    console.log(url);
    return get(`${url}?${stringify(data)}`)
        .then(createHandleResponse(url))
        .catch(createHandleCatched(url));
}

export function getMAINTAINERSList(
    data: {
        endVersion: string,
        repoPath: string
    }
){
    const url = `${baseUrl}/company/getMAINTAINERSList`;
    console.log(url);
    return get(`${url}?${stringify(data)}`)
        .then(createHandleResponse(url))
        .catch(createHandleCatched(url));
}

export function getCompanyFeatureDataByVersionAndCompany(
    data: {
        start_version: string,
        end_version: string,
        company_name: string
    }
){
    const url = `${baseUrl}/company/getCompanyFeatureDataByVersionAndCompany`;
    return get(`${url}?${stringify(data)}`)
    .then(createHandleResponse(url))
    .catch(createHandleCatched(url));
}

export function getCompanyCommitDataByVersionAndCompany(
    data: {
        start_version: string,
        end_version: string,
        repo: string,
        company_name: string
    }
){
    const url = `${baseUrl}/company/getCompanyCommitDataByVersionAndCompany`;
    return get(`${url}?${stringify(data)}`)
    .then(createHandleResponse(url))
    .catch(createHandleCatched(url));
}

export function  getBoxFeatureDataByVersionAndCompany(
    data: {
        start_version: string,
        end_version: string,
        company_name: string,
        eid: number | null
    }
){
    const url = `${baseUrl}/company/getBoxFeatureDataByVersionAndCompany`;
    return get(`${url}?${stringify(data)}`)
    .then(createHandleResponse(url))
    .catch(createHandleCatched(url));
}

export function  getBoxCommitDataByVersionAndCompany(
    data: {
        start_version: string,
        end_version: string,
        company_name: string,
        eid: number | null
        repo: string
    }
){
    const url = `${baseUrl}/company/getBoxCommitDataByVersionAndCompany`;
    return get(`${url}?${stringify(data)}`)
    .then(createHandleResponse(url))
    .catch(createHandleCatched(url));
}