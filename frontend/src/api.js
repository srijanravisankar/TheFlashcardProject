import axios from 'axios'

const api = axios.create({
    baseURL: '/',
    // baseURL: 'http://127.0.0.1:8000' // for production, change to your backend URL
})

export default api;