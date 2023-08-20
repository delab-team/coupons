import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const PrivateRoute = (): JSX.Element => {
    const auth = useAuth()
    return auth ? <Outlet /> : <Navigate to="login" />
}
