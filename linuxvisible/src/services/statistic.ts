import {stringify} from "querystring";
import {get} from "../utils/request";
import {baseUrl} from "../utils/urlConfig";
import {createHandleCatched, createHandleResponse} from "../utils/response";

// API 函数定义
// 统计部分
// 获得文件列表
export function getCommitFileList(data: {
    kgId: number;
    startVersion?: string;
    endVersion?: string;
    featureId?: number;
}) {
    console.log("data is",data);
    const url = `${baseUrl}/territory/getFileList`;
    const result = get(`${url}?${stringify(data)}`)
    .then(createHandleResponse(url))
    .catch(createHandleCatched(url));
    console.log("result is",result);
    return get(`${url}?${stringify(data)}`)
        .then(createHandleResponse(url))
        .catch(createHandleCatched(url));
}

// 根据版本号获得commit号
export function findCommitByVersionList(data: {
    versionList: string[];
    repoPath: string;
}) {
    const url = `${baseUrl}/territory/findCommitByVersionList`;
    return get(`${url}?${stringify(data)}`)
        .then(createHandleResponse(url))
        .catch(createHandleCatched(url));
}

// 留存代码最多的公司
export function findMaxRetainCodeCompany(data: {
    repoPath: string;
    filePath: string;
    endVersion?: string;
}) {
    const url = `${baseUrl}/territory/findMaxRetainCodeCompany`;
    return get(`${url}?${stringify(data)}`)
        .then(createHandleResponse(url))
        .catch(createHandleCatched(url));
}

// 最初的公司
export function findOriginMessage(data: {
        repoPath: string;
        filePath: string;
}) {
    const url = `${baseUrl}/territory/findOriginMessage`;
    return get(`${url}?${stringify(data)}`)
    .then(createHandleResponse(url))
    .catch(createHandleCatched(url));
}

// 最多特性的公司
export function findMaxFeatureCompany(data: {
    filePath: string;
    startVersion?: string;
    endVersion?: string;
}) {
    const url = `${baseUrl}/territory/findMaxFeature`;
    return get(`${url}?${stringify(data)}`)
        .then(createHandleResponse(url))
        .catch(createHandleCatched(url));
}

// 最多提交的公司
export function findMaxCommitCompany(data: {
    repoPath: string;
    filePath: string;
    startVersion?: string;
    endVersion?: string;
}) {
    const url = `${baseUrl}/territory/findMaxCommit`;
    return get(`${url}?${stringify(data)}`)
        .then(createHandleResponse(url))
        .catch(createHandleCatched(url));
}

// 最多代码增减的公司
export function findMaxAddAndDelCompany(data: {
    repoPath: string;
    filePath: string;
    startVersion?: string;
    endVersion?: string;
}) {
    const url = `${baseUrl}/territory/findMaxAddAndDel`;
    return get(`${url}?${stringify(data)}`)
        .then(createHandleResponse(url))
        .catch(createHandleCatched(url));
}

// 获取MAINTAINERS信息
export function getMaintainers(data: {
    fileList: string[];
    endVersion?: string;
    repoPath: string;
}) {
    const url = `${baseUrl}/territory/getMAINTAINERS`;
    return get(`${url}?${stringify(data)}`)
        .then(createHandleResponse(url))
        .catch(createHandleCatched(url));
}

// 柱状图部分
export function view_file_history(data:{
    repoPath: string;
    filePath: string;
    versionList?: string[];
    type: string;
}){
    const url = `${baseUrl}/territory/viewFileHistory`;
    return get(`${url}?${stringify(data)}`)
        .then(createHandleResponse(url))
        .catch(createHandleCatched(url));
}