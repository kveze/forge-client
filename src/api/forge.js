import axios from 'axios'

const api = axios.create({ baseURL: 'https://forge-backend-e6je.onrender.com' })

export const generatePlan = (data) => api.post('/generate', data).then(r => r.data)
export const generateTips = (data) => api.post('/tips', data).then(r => r.data)
export const generateRecovery = (data) => api.post('/recovery', data).then(r => r.data)
