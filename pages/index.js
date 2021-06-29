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
    <div className='min-h-screen flex  bg-white py-12 px-4 sm:px-6 lg:px-8'>
      <div className='w-full space-y-8'>
        <>
          {registerError && (
            <div className='flex items-center font-medium tracking-wide text-red-500 bg-red-100'>{error}</div>
          )}
          <form className='mt-8 max-w-md space-y-6' onSubmit={registerUser}>
            <input type='hidden' name='remember' value='true' />
            <div className='rounded-md shadow-sm -space-y-px'>
              <div>
                <label htmlFor='email-address' className='sr-only'>
                  Email address
                </label>
                <input
                  onChange={handleOnChange}
                  id='email-address'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                  placeholder='Email address'
                />
              </div>
              <div>
                <label htmlFor='name' className='sr-only'>
                  Name
                </label>
                <input
                  onChange={handleOnChange}
                  id='name'
                  name='name'
                  type='text'
                  required
                  className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                  placeholder='Name'
                />
              </div>
              <div>
                <label htmlFor='password' className='sr-only'>
                  Password
                </label>
                <input
                  onChange={handleOnChange}
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='current-password'
                  required
                  className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                  placeholder='Password'
                />
              </div>
            </div>

            <div>
              <button
                disabled={loading}
                type='submit'
                className={`${
                  loading && 'disabled:opacity-50'
                } group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {loading ? 'Adding...' : 'Add'}
              </button>
            </div>
          </form>
        </>

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
              <tr className='font-light' key={user.id}>
                <td>{user.email}</td>
                <td>{user.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
