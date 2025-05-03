import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { useLoginMutation, useRegisterMutation, useLogoutMutation } from '../store/api/authApi'
import { logout as logoutAction } from '../store/reducers/authSlice'

export function useAuth() {
  const dispatch = useDispatch()
  const auth = useSelector((state: RootState) => state.auth)
  const [loginMutation] = useLoginMutation()
  const [registerMutation] = useRegisterMutation()
  const [logoutMutation] = useLogoutMutation()

  const login = async (email: string, password: string) => {
    try {
      await loginMutation({ email, password }).unwrap()
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      await registerMutation({ name, email, password }).unwrap()
      return true
    } catch (error) {
      console.error('Registration failed:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      await logoutMutation().unwrap()
      dispatch(logoutAction())
      return true
    } catch (error) {
      console.error('Logout failed:', error)
      return false
    }
  }

  return {
    ...auth,
    login,
    register,
    logout
  }
}