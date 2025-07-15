const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000' // 本地mock服务
    : 'https://your-prod-api.com'; // 生产环境API

interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  header?: Record<string, any>;
  showErrorToast?: boolean;
}

export function request(options: RequestOptions): Promise<any> {
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: options.header || {},
      success: (res) => {
        if (res.statusCode === 200 && (res.data as any).code === 0) {
          resolve(res.data);
        } else {
          if (options.showErrorToast !== false) {
            uni.showToast({
              title: (res.data as any).msg || '请求失败',
              icon: 'none'
            });
          }
          reject(res.data);
        }
      },
      fail: (err) => {
        if (options.showErrorToast !== false) {
          uni.showToast({
            title: '网络错误',
            icon: 'none'
          });
        }
        reject(err);
      }
    });
  });
} 