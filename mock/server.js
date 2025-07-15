const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const users = [
  {
    id: 1,
    name: '测试用户',
    phone: '123456',
    role: 'user',
    code: '0000',
    avatar: 'https://dummyimage.com/100x100/007aff/fff&text=U',
    token: 'mock-token-user'
  },
  {
    id: 2,
    name: '管理员',
    phone: 'admin',
    role: 'merchant',
    code: '9999',
    avatar: 'https://dummyimage.com/100x100/ff6600/fff&text=A',
    token: 'mock-token-merchant'
  }
];

const services = [
  {
    id: 1,
    title: '家政保洁',
    desc: '专业家庭保洁服务，安全放心',
    icon: 'https://dummyimage.com/100x100/1aad19/fff&text=家',
    designer: '张小美',
    price: 88,
    duration: 60,
    dates: ['2025-06-10', '2025-06-11', '2025-06-12'],
    times: ['09:00', '10:00', '14:00', '16:00'],
    status: 'on'
  },
  {
    id: 2,
    title: '上门维修',
    desc: '水电维修、家电维修，快速上门',
    icon: 'https://dummyimage.com/100x100/007aff/fff&text=修',
    designer: '李师傅',
    price: 128,
    duration: 90,
    dates: ['2025-06-10', '2025-06-12'],
    times: ['10:00', '13:00', '15:00'],
    status: 'on'
  },
  {
    id: 3,
    title: '家教辅导',
    desc: '一对一上门家教，名师辅导',
    icon: 'https://dummyimage.com/100x100/ff6600/fff&text=教',
    designer: '王老师',
    price: 200,
    duration: 120,
    dates: ['2025-06-11', '2025-06-13'],
    times: ['09:00', '11:00', '16:00'],
    status: 'on'
  }
];

let orders = [];

let favorites = [];

// 获取服务列表
app.get('/api/services', (req, res) => {
  const { status } = req.query
  let result = services
  if (status) {
    result = services.filter(s => s.status === status)
  }
  res.json({ code: 0, msg: '获取服务列表成功', data: result });
});

// 获取服务详情
app.get('/api/services/:id', (req, res) => {
  const id = Number(req.params.id)
  const service = services.find(s => s.id === id)
  if (service) {
    res.json({ code: 0, msg: '获取服务详情成功', data: service })
  } else {
    res.json({ code: 1, msg: '未找到该服务' })
  }
})

// 上架服务
app.post('/api/services/:id/up', (req, res) => {
  const id = Number(req.params.id)
  const service = services.find(s => s.id === id)
  if (service) {
    service.status = 'on'
    res.json({ code: 0, msg: '上架成功' })
  } else {
    res.json({ code: 1, msg: '未找到该服务' })
  }
})
// 下架服务
app.post('/api/services/:id/down', (req, res) => {
  const id = Number(req.params.id)
  const service = services.find(s => s.id === id)
  if (service) {
    service.status = 'off'
    res.json({ code: 0, msg: '下架成功' })
  } else {
    res.json({ code: 1, msg: '未找到该服务' })
  }
})
// 删除服务
app.delete('/api/services/:id', (req, res) => {
  const id = Number(req.params.id)
  const idx = services.findIndex(s => s.id === id)
  if (idx !== -1) {
    services.splice(idx, 1)
    res.json({ code: 0, msg: '删除成功' })
  } else {
    res.json({ code: 1, msg: '未找到该服务' })
  }
})

// 发布新服务
app.post('/api/services', (req, res) => {
  const { title, desc, icon, designer, price, duration, dates, times } = req.body;
  const id = services.length ? services[services.length - 1].id + 1 : 1;
  const newService = {
    id,
    title,
    desc,
    icon,
    designer,
    price,
    duration,
    dates,
    times,
    status: 'on'
  };
  services.push(newService);
  res.json({ code: 0, msg: '发布成功', data: newService });
});

// 获取验证码
app.post('/api/code', (req, res) => {
  const { phone, role } = req.body;
  const user = users.find(u => u.phone === phone && u.role === role);
  if (user) {
    res.json({ code: 0, msg: '验证码发送成功', data: { code: user.code } });
  } else {
    res.json({ code: 1, msg: '未找到该用户' });
  }
});

// 登录
app.post('/api/login', (req, res) => {
  const { phone, code, role } = req.body;
  const user = users.find(u => u.phone === phone && u.code === code && u.role === role);
  if (user) {
    res.json({ code: 0, msg: '登录成功', data: { token: user.token, role: user.role } });
  } else {
    res.json({ code: 1, msg: '手机号/验证码/身份不匹配' });
  }
});

// 获取用户信息
app.get('/api/user', (req, res) => {
  const token = req.headers.authorization || req.headers.Authorization;
  const user = users.find(u => u.token === token);
  if (user) {
    const { code, token, ...info } = user;
    res.json({ code: 0, msg: '获取用户信息成功', data: { ...info, roles: ['user', 'merchant'] } });
  } else {
    res.json({ code: 1, msg: '无效token' });
  }
});

app.get('/api/orders', (req, res) => {
  res.json({ code: 0, msg: '获取订单列表成功', data: orders });
});

app.post('/api/orders', (req, res) => {
  const { serviceId, service, date, time, price } = req.body;
  const newOrder = {
    id: orders.length ? orders[orders.length - 1].id + 1 : 1,
    service,
    status: 'pending',
    price,
    time: date + ' ' + time
  };
  orders.push(newOrder);
  res.json({ code: 0, msg: '预约成功', data: newOrder });
});

app.post('/api/favorites', (req, res) => {
  const { serviceId, service, icon } = req.body;
  if (!favorites.find(f => f.serviceId === serviceId)) {
    favorites.push({ serviceId, service, icon });
  }
  res.json({ code: 0, msg: '收藏成功' });
});

app.get('/api/favorites', (req, res) => {
  res.json({ code: 0, msg: '获取收藏列表成功', data: favorites });
});

app.delete('/api/favorites/:id', (req, res) => {
  const id = Number(req.params.id)
  const idx = favorites.findIndex(f => f.serviceId === id)
  if (idx !== -1) {
    favorites.splice(idx, 1)
    res.json({ code: 0, msg: '取消收藏成功' })
  } else {
    res.json({ code: 1, msg: '未找到该收藏' })
  }
})

// 确认接单
app.post('/api/orders/:id/confirm', (req, res) => {
  const id = Number(req.params.id)
  const order = orders.find(o => o.id === id)
  if (order) {
    order.status = 'confirmed'
    res.json({ code: 0, msg: '确认接单成功' })
  } else {
    res.json({ code: 1, msg: '未找到该订单' })
  }
})
// 完成服务
app.post('/api/orders/:id/finish', (req, res) => {
  const id = Number(req.params.id)
  const order = orders.find(o => o.id === id)
  if (order) {
    order.status = 'finished'
    res.json({ code: 0, msg: '服务已完成' })
  } else {
    res.json({ code: 1, msg: '未找到该订单' })
  }
})
// 拒绝订单
app.post('/api/orders/:id/reject', (req, res) => {
  const id = Number(req.params.id)
  const order = orders.find(o => o.id === id)
  if (order) {
    order.status = 'rejected'
    res.json({ code: 0, msg: '订单已拒绝' })
  } else {
    res.json({ code: 1, msg: '未找到该订单' })
  }
})

const port = 3000;
app.listen(port, () => {
  console.log(`Mock server is running at http://localhost:${port}`);
}); 