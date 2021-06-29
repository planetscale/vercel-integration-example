import useSWR from 'swr'
import { useEffect, useState } from 'react'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function Home() {
  const { data: fetchedData, getError } = useSWR('/api/users', fetcher)
  const [registerError, setRegisterError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [state, setState] = useState({
    email: null,
    name: null,
    password: null,
    users: []
  })
  const { users } = state

  useEffect(() => {
    if (fetchedData) {
      setState((prev) => ({ ...prev, users: fetchedData }))
    }
  }, [fetchedData])

  if (getError) return <div>Failed to load</div>
  if (!fetchedData) return <div>Loading...</div>

  const handleOnChange = (event) => {
    const { target } = event

    if (target.name == 'email') {
      setState((prev) => ({ ...prev, email: target.value }))
    } else if (target.name == 'name') {
      setState((prev) => ({ ...prev, name: target.value }))
    } else if (target.name == 'password') {
      setState((prev) => ({ ...prev, password: target.value }))
    }
  }

  const registerUser = async (event) => {
    setLoading(true)
    event.preventDefault()

    const res = await fetch('api/users', {
      body: JSON.stringify({
        ...state
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })

    if (res.status == 201) {
      const json = await res.json()
      setState((prev) => ({ ...prev, users: [json, ...users] }))
    } else {
      const error = await res.text()
      setRegisterError(error)
    }
    setLoading(false)
  }

  return (
    <div className='min-h-screen px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full'>
        {registerError && (
          <div className='flex items-center font-medium tracking-wide text-red-500 bg-red-100'>{error}</div>
        )}

        <form className='max-w-md mb-6 sm:mb-8 lg:mb-10' onSubmit={registerUser}>
          <input type='hidden' name='remember' value='true' />

          <div>
            <h1 className='text-lg font-semibold text-primary'>Users demo</h1>
            <p className='mb-3 text-secondary'>
              This app is deployed to vercel and connected to your PlanetScale database. The example project can be
              found{' '}
              <a className='text-blue' href='https://github.com/planetscale/vercel-integration-example'>
                here
              </a>
              .
            </p>
          </div>

          <div className='mb-2'>
            <label htmlFor='name'>Name</label>
            <input
              onChange={handleOnChange}
              id='name'
              name='name'
              type='text'
              required
              className='w-full px-1.5 py-sm rounded text-base ring-offset-0 border h-button shadow-sm focus-ring bg-secondary text-primary border-secondary'
            />
          </div>
          <div className='mb-2'>
            <label htmlFor='email-address'>Email address</label>
            <input
              onChange={handleOnChange}
              id='email-address'
              name='email'
              type='email'
              autoComplete='email'
              required
              className='w-full px-1.5 py-sm rounded text-base ring-offset-0 border h-button shadow-sm focus-ring bg-secondary text-primary border-secondary'
            />
          </div>
          <div className='mb-3'>
            <label htmlFor='password'>Password</label>
            <input
              onChange={handleOnChange}
              id='password'
              name='password'
              type='password'
              autoComplete='current-password'
              required
              className='w-full px-1.5 py-sm rounded text-base ring-offset-0 border h-button shadow-sm focus-ring bg-secondary text-primary border-secondary'
            />
          </div>
          <div>
            <button
              disabled={loading}
              type='submit'
              className={`${
                loading && 'disabled:opacity-50'
              } box-border relative inline-flex items-center justify-center text-center no-underline leading-none whitespace-nowrap font-semibold rounded flex-shrink-0 transition select-none overflow-hidden focus-ring bg-gray-800 hover:bg-gray-900 dark:bg-gray-50 text-gray-50 dark:text-gray-800 dark:hover:bg-white dark:hover:text-gray-900 cursor-pointer hover:text-white h-button py-1.5 px-2`}
            >
              {loading ? 'Adding...' : 'Add demo user'}
            </button>
          </div>
        </form>

        {!users.length === 0 && (
          <table className='table-auto'>
            <thead>
              <tr>
                <th className='w-6/12' scope='col'>
                  Name
                </th>
                <th className='w-6/12' scope='col'>
                  Email
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
