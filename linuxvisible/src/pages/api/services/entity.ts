import { stringify } from "querystring";
import { get } from "../../utils/request";
import { baseUrl } from "../../utils/urlConfig";
import { createHandleCatched, createHandleResponse} from "../../utils/response";

export function getEntities(
    data: {
        repoPath: string,
        startVersion: string,
        endVersion: string
    }
){
    const url = `${baseUrl}/kg/getEntityPosition`;
    return get(`${url}?${stringify(data)}`)
    .then(createHandleResponse(url))
    .catch(createHandleCatched(url));
}