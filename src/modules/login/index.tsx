import toast from 'react-hot-toast'
import supabase, { useSession } from '../supabase'
import * as Tabs from '@radix-ui/react-tabs'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useAutoAnimate } from '@formkit/auto-animate/react'

export function Login({ children }: any) {
  const session = useSession()

  if (!session.loaded) return null
  else if (session.loaded && !session.session) {
    return (
      <div className='w-full flex flex-col items-center justify-center min-h-[calc(100vh-6rem)]'>
        <h1 className='text-5xl font-heading sm:text-7xl mb-10'>Notescroll</h1>
        <LogInDashboard />
      </div>
    )
  } else if (session.loaded && session.session) return <>{children}</>
  else return <div className='text-red-500'>An Error has occured.</div>
}

type Inputs = {
  name?: string
  email: string
  password: string
}

function LogInDashboard() {
  const [login_email] = useAutoAnimate<any>()
  const [login_password] = useAutoAnimate<any>()
  const [signup_name] = useAutoAnimate<any>()
  const [signup_email] = useAutoAnimate<any>()
  const [signup_password] = useAutoAnimate<any>()

  const {
    register: loginRegister,
    handleSubmit: loginHandleSubmit,
    formState: { errors: loginErrors, isSubmitting: loginIsSubmitting },
  } = useForm<Inputs>()

  const {
    register: signupRegister,
    handleSubmit: signupHandleSubmit,
    formState: { errors: signupErrors, isSubmitting: signupIsSubmitting },
  } = useForm<Inputs>()

  const onLoginSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const { error } = await supabase.auth.signIn({
        email: data.email,
        password: data.password,
      })
      if (error) throw error
      toast.success('Logged In')
    } catch (error: any) {
      toast.error(error.error_description || error.message || 'Login failed.')
    }
  }

  const onSignupSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const { error } = await supabase.auth.signUp(
        {
          email: data.email,
          password: data.password,
        },
        {
          data: {
            user_name: data.name,
          }
        })
      if (error) throw error
      toast.success('Account created.')
    } catch (error: any) {
      toast.error(error.error_description || error.message || 'Registration failed.')
      console.log(error)
    }
  }

  return (
    <div className='w-full max-w-xs'>
      <Tabs.Root
        defaultValue='login'
        orientation='vertical'
        className='flex flex-col items-center'>
        <Tabs.List
          aria-label='login or register an account'
          className='w-full flex justify-between'>
          <Tabs.Trigger value='login' className='btn-underline'>
            Login
          </Tabs.Trigger>
          <Tabs.Trigger value='register' className='btn-underline'>
            Register
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value='login' className='w-full'>
          <h2 className='text-3xl my-10 text-center'>
            Log into an account
          </h2>
          <form
            className='flex flex-col w-full space-y-6'
            onSubmit={loginHandleSubmit(onLoginSubmit)}>
            <div className='relative' ref={login_email}>
              <input
                {...loginRegister('email', { required: true })}
                aria-invalid={loginErrors.email ? 'true' : 'false'}
                className='peer input h-8 w-full placeholder-transparent input-border'
                name='email'
                placeholder='email'
              ></input>
              <label
                className='absolute left-2 -top-5 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-1 peer-focus:-top-5 peer-focus:text-sm pointer-events-none'
                htmlFor='email'>
                email
              </label>
              {loginErrors.email && (
                <span
                  className='absolute -bottom-5 right-0 text-sm text-red-600 whitespace-nowrap'
                  role='alert'>
                  This field is required
                </span>
              )}
            </div>
            <div className='relative' ref={login_password}>
              <input
                {...loginRegister('password', { required: true })}
                aria-invalid={loginErrors.password ? 'true' : 'false'}
                className='peer input h-8 w-full placeholder-transparent input-border'
                name='password'
                placeholder='password'
                type='password'
              />
              <label
                className='absolute left-2 -top-5 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-1 peer-focus:-top-5 peer-focus:text-sm pointer-events-none'
                htmlFor='password'>
                password
              </label>
              {loginErrors.password && (
                <span
                  className='absolute -bottom-5 right-0 text-sm text-red-600 whitespace-nowrap'
                  role='alert'>
                  This field is required
                </span>
              )}
            </div>
            <input className='btn' type='submit' value='submit' disabled={signupIsSubmitting}></input>
          </form>
        </Tabs.Content>
        {/* REGISTRATION */}
        <Tabs.Content value='register' className='w-full'>
          <h2 className='text-3xl my-6 text-center'>
            Create an account
          </h2>
          <form
            className='flex flex-col w-full space-y-6'
            onSubmit={signupHandleSubmit(onSignupSubmit)}>
            <div className='relative' ref={signup_name}>
              <input
                {...signupRegister('name', { required: true })}
                aria-invalid={signupErrors.name ? 'true' : 'false'}
                className='peer input h-8 w-full placeholder-transparent input-border'
                name='name'
                placeholder='name'></input>
              <label
                className='absolute left-2 -top-5 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-1 peer-focus:-top-5 peer-focus:text-sm pointer-events-none'
                htmlFor='name'>
                name
              </label>
              {signupErrors.name && (
                <span
                  className='absolute -bottom-5 right-0 text-sm text-red-600 whitespace-nowrap'
                  role='alert'>
                  This field is required
                </span>
              )}
            </div>
            <div className='relative' ref={signup_email}>
              <input
                {...signupRegister('email', { required: true })}
                aria-invalid={signupErrors.email ? 'true' : 'false'}
                className='peer input h-8 w-full placeholder-transparent input-border'
                name='email'
                placeholder='email'></input>
              <label
                className='absolute left-2 -top-5 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-1 peer-focus:-top-5 peer-focus:text-sm pointer-events-none'
                htmlFor='email'>
                email
              </label>
              {signupErrors.email && (
                <span
                  className='absolute -bottom-5 right-0 text-sm text-red-600 whitespace-nowrap'
                  role='alert'>
                  This field is required
                </span>
              )}
            </div>
            <div className='relative' ref={signup_password}>
              <input
                {...signupRegister('password', { required: true })}
                aria-invalid={signupErrors.password ? 'true' : 'false'}
                className='peer input h-8 w-full placeholder-transparent input-border'
                name='password'
                placeholder='password'
                type='password'
              />
              <label
                className='absolute left-2 -top-5 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-1 peer-focus:-top-5 peer-focus:text-sm pointer-events-none'
                htmlFor='password'>
                password
              </label>
              {signupErrors.password && (
                <span
                  className='absolute -bottom-5 right-0 text-sm text-red-600 whitespace-nowrap'
                  role='alert'>
                  This field is required
                </span>
              )}
            </div>
            <input className='btn' type='submit' value='submit' disabled={signupIsSubmitting}></input>
          </form>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
