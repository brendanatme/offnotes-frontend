import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { useMutation } from '@tanstack/react-query'
import * as api from '../api'
import { AuthSidebar } from '~/components/AuthSidebar'
import { Button } from '~/components/Button'
import { Input } from '~/components/Input'

function Signup() {
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: api.signup,
    onSuccess: () => {
      navigate('/')
    },
    onError: () => {
      alert('Signup failed')
    },
  })

  const formik = useFormik({
    initialValues: {
      email: '',
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
        <h1 className="text-2xl font-semibold mb-6">Sign Up</h1>
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-4 w-64"
        >
          <Input
            type="email"
            name="email"
            placeholder="Email"
            onChange={formik.handleChange}
            value={formik.values.email}
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
            {mutation.isPending ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
        <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-neutral-900 dark:text-white underline hover:no-underline"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}

export default Signup
