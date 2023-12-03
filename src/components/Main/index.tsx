import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client';
import { GET_USER } from './queries';
import Profile from './components/Profile';
import Repositories from './components/Repositories';

export default function Main({ selectedUser }: { selectedUser: string | null }) {

  const [getUser, { data: userData, loading: userDataLoading }] = useLazyQuery(GET_USER, {
    variables: {
      userQuery: selectedUser
    }
  })

  console.log(userData, userDataLoading)

  useEffect(() => {
    getUser()
  }, [selectedUser, getUser])


  return (
    <main className='my-2 px-4 max-w-7xl mx-auto md:flex md:gap-4 md:px-6 lg:px-8 lg:gap-6'>
      {userDataLoading && <p className='text-sm text-[#656D76] my-4'>loading...</p>}
      {userData &&
        <>
          <Profile userData={userData.search.nodes[0]} />
          <Repositories selectedUser={selectedUser} />
        </>
      }
    </main>
  )
}
