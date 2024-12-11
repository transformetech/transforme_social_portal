import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export const authMiddleware = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  // Verifica se existe token no localStorage
  const token = localStorage.getItem('token')

  // Lista de rotas públicas que não precisam de autenticação
  const publicRoutes = ['/login', '/signup', '/forgot-password']

  // Se não tem token e a rota não é pública
  if (!token && !publicRoutes.includes(to.path)) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
  // Se tem token e está tentando acessar uma rota pública
  else if (token && publicRoutes.includes(to.path)) {
    next('/home')
  }
  else {
    next()
  }
}
