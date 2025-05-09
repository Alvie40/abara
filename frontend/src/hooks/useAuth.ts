import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { useLoginMutation, useRegisterMutation, useLogoutMutation } from '../store/api/authApi'
import { logout as logoutAction } from '../store/reducers/authSlice'
import { AuthState } from '../types'

interface AuthError {
  message: string;
  status?: number;
}

interface AuthResponse {
  success: boolean;
  error?: string;
}

export function useAuth(): AuthState & {
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (name: string, email: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<AuthResponse>;
} {
  const dispatch = useDispatch()
  const auth = useSelector((state: RootState) => state.auth)
  const [loginMutation] = useLoginMutation()
  const [registerMutation] = useRegisterMutation()
  const [logoutMutation] = useLogoutMutation()

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      await loginMutation({ email, password }).unwrap()
      return { success: true }
    } catch (error) {
      const err = error as AuthError
      return {
        success: false,
        error: err.message || 'Login failed. Please check your credentials and try again.'
      }
    }
  }

  const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
    try {
      await registerMutation({ name, email, password }).unwrap()
      return { success: true }
    } catch (error) {
      const err = error as AuthError
      return {
        success: false,
        error: err.message || 'Registration failed. Please try again.'
      }
    }
  }

  const logout = async (): Promise<AuthResponse> => {
    try {
      await logoutMutation().unwrap()
      dispatch(logoutAction())
      return { success: true }
    } catch (error) {
      const err = error as AuthError
      return {
        success: false,
        error: err.message || 'Logout failed. Please try again.'
      }
    }
  }

  return {
    ...auth,
    login,
    register,
    logout
  }
}