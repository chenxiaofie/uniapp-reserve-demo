import { defineStore } from 'pinia'
import { ref } from 'vue'
import { request } from '@/utils/request'

export const useOrderStore = defineStore('order', () => {
  const orders = ref<any[]>([])

  async function fetchOrders() {
    const res = await request({ url: '/api/orders' })
    orders.value = res.data
  }

  async function addOrder(order: any) {
    await request({ url: '/api/orders', method: 'POST', data: order })
    await fetchOrders()
  }

  return { orders, fetchOrders, addOrder }
}) 