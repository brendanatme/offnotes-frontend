import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { useMutation } from '@tanstack/react-query'
import * as api from '../api'

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
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold mb-6">Login</h1>
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-4 w-64"
        >
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={formik.handleChange}
            value={formik.values.username}
            className="px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-white"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={formik.handleChange}
            value={formik.values.password}
            className="px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-white"
            required
          />
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-3 py-2 bg-neutral-200 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors cursor-pointer disabled:opacity-50 text-neutral-900 dark:text-white"
          >
            {mutation.isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
