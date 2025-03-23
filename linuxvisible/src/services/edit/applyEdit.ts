import { post } from '../../utils/request';
import { EntityNode } from '../../utils/API';
import { createHandleCatched, createHandleResponse } from '../../utils/response';

export const submitEditGraph = async (entities: EntityNode[], version: string, repoPath: string) => {
  const url = `/api/applyEdit`;
  return post(url, { entities, version, repoPath })
    .then(createHandleResponse(url))
    .catch(createHandleCatched(url));
}; 