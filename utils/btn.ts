export function isShowMinioUploadBtn() {
  const { user } = useUserSession()
  const config = useRuntimeConfig()
  return user.value ? String(user.value.id) === config.public.showUploadBtnGithubUserId : false
}
