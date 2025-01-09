//axios封装
//根域名配置
//超时
//请求拦截器/响应拦截器
import axios from 'axios'
import { parse, stringify } from 'querystring';

const http = axios.create({
    baseURL :  "",
    timeout : 5000
})

// 在发送请求之前拦截 插入自定义配置 对于参数的处理
http.interceptors.request.use(config => {

    return config;
  }, error => {
    // 对请求错误做些什么
    return Promise.reject(error);
});


// 对响应数据做拦截 处理返回数据
http.interceptors.response.use(response => {

    return response;
  }, error => {
    // 对响应错误做些什么
    return Promise.reject(error);
  });


  function get(url: string) {
    const urlencode = encodeQueryParams(url);
    return http(urlencode, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
  }

  function post(
    url: string,
    data: Object
  ) {
    return http(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data,
    });
  }

// 使用 parse -> stringify 转义字符功能
function encodeQueryParams(str: string) {
    const [url, uri] = str.split('?');
    const query = parse(uri);
    return uri ? url + '?' + stringify(query) : url;
  }

  export {get, post}
