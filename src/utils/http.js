import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

// 创建axios实例
const http = axios.create({
  baseURL: process.env.VUE_APP_API_URL || '', // 可以从环境变量获取基础URL
  timeout: 10000, // 请求超时时间
})

// 创建专用于图片上传的axios实例
const imageUploadHttp = axios.create({
  baseURL: 'http://8.137.108.237:8006', // 图片上传专用URL
  timeout: 30000, // 上传可能需要更长的超时时间
})

// 请求拦截器 - 主实例
http.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const token = localStorage.getItem('token')
    // 如果token存在，则在请求头中添加Authorization
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 请求拦截器 - 图片上传实例
imageUploadHttp.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const token = localStorage.getItem('token')
    // 如果token存在，则在请求头中添加Authorization
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('图片上传请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器 - 主实例
http.interceptors.response.use(
  response => {
    // 直接返回响应数据
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401: // 未授权
          // 清除token等登录信息
          localStorage.removeItem('token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('isLogin')
          localStorage.removeItem('userInfo')

          ElMessage.error('登录已过期，请重新登录')
          // 跳转到登录页
          router.replace('/login')
          break

        case 403: // 权限不足
          ElMessage.error('没有操作权限')
          break

        case 404: // 资源不存在
          ElMessage.error('请求的资源不存在')
          break

        case 500: // 服务器错误
          ElMessage.error('服务器错误，请稍后再试')
          break

        default:
          ElMessage.error(error.response.data?.msg || '请求失败')
      }
    } else if (error.request) {
      // 请求发出但没有收到响应
      ElMessage.error('网络错误，请检查您的网络连接')
    } else {
      // 请求配置出错
      ElMessage.error('请求配置错误')
    }
    return Promise.reject(error)
  }
)

// 为图片上传实例添加相同的响应拦截器
imageUploadHttp.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401: // 未授权
          // 清除token等登录信息
          localStorage.removeItem('token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('isLogin')
          localStorage.removeItem('userInfo')

          ElMessage.error('登录已过期，请重新登录')
          // 跳转到登录页
          router.replace('/login')
          break

        case 403: // 权限不足
          ElMessage.error('没有操作权限')
          break

        case 404: // 资源不存在
          ElMessage.error('请求的资源不存在')
          break

        case 500: // 服务器错误
          ElMessage.error('服务器错误，请稍后再试')
          break

        default:
          ElMessage.error(error.response.data?.msg || '图片上传失败')
      }
    } else if (error.request) {
      // 请求发出但没有收到响应
      ElMessage.error('网络错误，请检查您的网络连接')
    } else {
      // 请求配置出错
      ElMessage.error('请求配置错误')
    }
    return Promise.reject(error)
  }
)

// 刷新Token方法
const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) {
      // 如果没有刷新令牌，则直接跳转登录页
      router.replace('/login')
      return null
    }

    // 调用刷新token的API
    const response = await axios.post('/api/v1/users/refresh', {
      refresh_token: refreshToken
    })

    if (response.data && response.data.access_token) {
      // 更新localStorage中的token
      localStorage.setItem('token', response.data.access_token)
      if (response.data.refresh_token) {
        localStorage.setItem('refresh_token', response.data.refresh_token)
      }
      return response.data.access_token
    } else {
      // 刷新失败，跳转到登录页
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('isLogin')
      localStorage.removeItem('userInfo')
      router.replace('/login')
      return null
    }
  } catch (error) {
    console.error('刷新Token失败:', error)
    // 刷新失败，跳转到登录页
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('isLogin')
    localStorage.removeItem('userInfo')
    router.replace('/login')
    return null
  }
}

// 导出请求方法
export default {
  // GET请求
  get(url, params = {}, config = {}) {
    return http.get(url, { params, ...config })
  },

  // POST请求
  post(url, data = {}, config = {}) {
    return http.post(url, data, config)
  },

  // PUT请求
  put(url, data = {}, config = {}) {
    return http.put(url, data, config)
  },

  // DELETE请求
  delete(url, config = {}) {
    return http.delete(url, config)
  },

  // 带请求体的DELETE请求（用于批量删除等操作）
  deleteWithData(url, data = {}, config = {}) {
    return http.delete(url, {
      data,
      ...config
    })
  },

  // 图片上传专用POST请求
  uploadImage(formData, config = {}) {
    return imageUploadHttp.post('/api/v1/mini_core/upload_image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      ...config
    })
  }
}
