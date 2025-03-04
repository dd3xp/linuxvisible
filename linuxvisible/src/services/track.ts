import { stringify } from "querystring";
import { get } from "../utils/request";
import { baseUrl } from "../utils/urlConfig";
import { createHandleCatched, createHandleResponse} from "../utils/response";

export async function getTimeTraceInfo(
    data: { repo: string; featureId: number }
  ) {
    const url = `${baseUrl}/tracker/getTimeTraceInfo`;
    return get(`${url}?${stringify(data)}`)
    .then(createHandleResponse(url))
    .catch(createHandleCatched(url));
  }
  
  export async function getDependTraceInfo(
    data: { repo: string; featureId: number }
  ) {
    const url = `${baseUrl}/tracker/getDependTraceInfo`;
    return get(`${url}?${stringify(data)}`)
    .then(createHandleResponse(url))
    .catch(createHandleCatched(url));
  }
  
  export async function getTrackMethod(
    data: {
      repoPath: string;
      filePaths: string;
      methodName: string;
      version: string;
      targetCommit: string;
    }
  ) {
    const url = `${baseUrl}/tracker/trackMethod`;
    return get(`${url}?${stringify(data)}`)
    .then(createHandleResponse(url))
    .catch(createHandleCatched(url));
  }