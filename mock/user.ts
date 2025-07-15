import { MockMethod } from 'vite-plugin-mock'

const users = [
  {
    id: 1,
    name: '测试用户',
    phone: '123456',
    password: '',
    code: '0000',
    avatar: 'https://dummyimage.com/100x100/007aff/fff&text=U',
    role: 'user',
    token: 'mock-token-user'
  },
  {
    id: 2,
    name: '管理员',
    phone: 'admin',
    password: '',
    code: '9999',
    avatar: 'https://dummyimage.com/100x100/ff6600/fff&text=A',
    role: 'admin',
    token: 'mock-token-admin'
  }
]

export default [
  {
    url: '/api/login',
    method: 'post',
    response: ({ body }) => {
      const { phone, code, role } = body
      const user = users.find(u => u.phone === phone && u.code === code && u.role === role)
      if (user) {
        return { code: 0, msg: '登录成功', data: { token: user.token, role: user.role } }
      }
      return { code: 1, msg: '手机号/验证码/身份不匹配' }
    }
  },
  {
    url: '/api/code',
    method: 'post',
    response: ({ body }) => {
      // 根据手机号和角色返回不同验证码
      const { phone, role } = body
      const user = users.find(u => u.phone === phone && u.role === role)
      if (user) {
        return { code: 0, msg: '验证码发送成功', data: { code: user.code } }
      }
      return { code: 1, msg: '未找到该用户' }
    }
  },
  {
    url: '/api/user',
    method: 'get',
    response: ({ headers }) => {
      // 根据token返回不同用户信息
      const token = headers.authorization || headers.Authorization
      const user = users.find(u => u.token === token)
      if (user) {
        const { password, code, token, ...info } = user
        return { code: 0, msg: '获取用户信息成功', data: info }
      }
      return { code: 1, msg: '无效token' }
    }
  }
] as MockMethod[] 