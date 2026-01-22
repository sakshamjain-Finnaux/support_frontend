import React from 'react'
import useAuth from '../../../contexts/AuthContext'
function Home() {
  const { user } = useAuth();
  return (
    <div>
      <h2 className='capitalize text-3xl text-primary-500 font-semibold mb-4'>Hi, {user.first_name}</h2>
      <p className='text-xl text-body-400'>Use the side panel to navigate around this dashboard.</p>
    </div>
  )
}

export default Home