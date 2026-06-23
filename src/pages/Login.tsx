import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { useMutation } from '@tanstack/react-query'
import * as api from '../api'
import { AuthSidebar } from '~/components/AuthSidebar'
import { Button } from '~/components/Button'
import { Input } from '~/components/Input'

const SIGNUP_ENABLED = import.meta.env.VITE_ENABLE_SIGNUP === 'true'

function Login() {
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: api.login,
    onSuccess: () => {
      navigate('/')
    },
    onError: () => {
      alert('Login failed')
    },
  })

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: (values) => {
      mutation.mutate(values)
    },
  })

  return (
    <div className="flex h-screen w-screen bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white">
      <AuthSidebar />
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold mb-6">Login</h1>
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-4 w-64"
        >
          <Input
            type="text"
            name="username"
            placeholder="Username"
            onChange={formik.handleChange}
            value={formik.values.username}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            onChange={formik.handleChange}
            value={formik.values.password}
            required
          />
          <Button
            type="submit"
            kind="secondary"
            disabled={mutation.isPending}
            className="w-full justify-center"
          >
            {mutation.isPending ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        {SIGNUP_ENABLED && (
          <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-neutral-900 dark:text-white underline hover:no-underline"
            >
              Sign up
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}

export default Login
