import axios from 'axios'

export default defineNuxtPlugin(() => {
  const instance = axios.create({
    withCredentials: true,
    timeout: 5000,
  })

  instance.interceptors.response.use(
    res => res.data,
    (err) => {
      console.error('Axios error:', err?.response?.data || err)
      throw err?.response?.data || err
    },
  )

  return {
    provide: {
      axios: instance,
    },
  }
})
