const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.name,
  unitName: state => state.user.unitName,
  role: state => state.user.role,
  roleName: state => state.user.roleName,
  unitId: state => state.user.unitId,
  province: state => state.user.province,
  city: state => state.user.city,
  region: state => state.user.region,
  area: state => state.user.area,
  permission_routes: state => state.permission.routes
}
export default getters
