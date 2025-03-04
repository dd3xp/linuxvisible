import { stringify } from "querystring";
import { get, post } from "../utils/request";
import { baseUrl } from "../utils/urlConfig";
import { createHandleCatched, createHandleResponse} from "../utils/response";

/**
 * versionList可以有3种情况:
 * (1)getVersion的返回结果
 * (2)自定义versionList
 * (3)不传,则默认为[2.6.12, 3.0, 4.0, 5.0, 6.0, 6.6]
 * @param versionList 版本列表
 * @param repoPath 仓库路径,e.g.linux-stable
 * @param filePath 文件路径,e.g.mm/memory.c
 * @returns 
 */
export function getRetainCodeHistory(
    data: {
        versionList: string[],
        repoPath: string,
        filePath: string
    }
) {
    const url = `${baseUrl}/commit/getRetainCodeHistory`;
    return get(`${url}?${stringify(data)}`)
        .then(createHandleResponse(url))
        .catch(createHandleCatched(url));
}

/**
 * 获取某个文件最初的提交者以及提交的commit
 * @param repoPath 仓库路径,e.g.linux-stable
 * @param filePath 文件路径,e.g.mm/memory.c
 * @returns 
 */
export function findOriginMessage(
    data: {
        repoPath: string,
        filePath: string
    }
){
    const url = `${baseUrl}/commit/findOriginMessage`;
    return get(`${url}?${stringify(data)}`)
    .then(createHandleResponse(url))
    .catch(createHandleCatched(url));
}
