  export const createHandleCatched = (url: string): ((error: Error) => null) => {
    return (error) => {
      if (console) console.error(url, error);
      return null;
    };
  };
  
  export function createHandleResponse(
    url: string,
  ): (resp: any) => any | null {
    return (resp) => {
      if (resp.status !== 200) {
        if (console) console.error(resp.msg ?? `获取 ${url} 数据失败`);
        return null;
      } else {
        return resp.data.data ?? null;
      }
    };
  }
  