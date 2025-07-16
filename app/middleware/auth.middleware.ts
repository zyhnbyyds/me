export default defineNuxtRouteMiddleware((to, _from) => {
  const { loggedIn } = useUserSession()

  if (!loggedIn.value && to.path === '/gallery/upload') {
    return abortNavigation()
  }
})
