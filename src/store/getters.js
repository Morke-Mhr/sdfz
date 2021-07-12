const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token,
  avatar: (state) => state.user.avatar,
  isAdmin: (state) => state.user.admin,
  userRoles: (state) => state.user.userRoles,
  userId: (state) => state.user.user.userId,
  userName: (state) => state.user.user.userName,
  theme: (state) => state.user.user.theme
}
export default getters
