import axios from 'axios'

const api = axios.create({ baseURL: 'https://forge-backend-production-84fc.up.railway.app' })

export const generatePlan = (data) => api.post('/generate', data).then(r => r.data)
export const generateTips = (data) => api.post('/tips', data).then(r => r.data)
export const generateRecovery = (data) => api.post('/recovery', data).then(r => r.data)
