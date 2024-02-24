import { useState } from 'react'
import { useLazyQuery } from '@apollo/client';
import { GET_USERS } from './queries';
import { UsersType } from './types';

export function Header({ setSelectedUser }: { setSelectedUser: React.Dispatch<React.SetStateAction<string | null>> }) {

  const [userNameInputValue, setUsernameInputValue] = useState<string>('')

  const [getUsers, { data: usersData, loading: usersDataLoading }] = useLazyQuery(GET_USERS, {
    variables: {
      userQuery: userNameInputValue
    }
  })

  return (
    <header className='bg-[#f6f8fa] h-20 flex flex-col items-center'>
      {/* ===input to search user=== */}
      <div className='flex justify-center items-center h-20 w-7/12 lg:w-5/12'>
        <i className='fa-solid fa-magnifying-glass text-[#6e7781] relative left-4 w-0'></i>
        <input
          type='text'
          value={userNameInputValue}
          onChange={(e) => {
            setUsernameInputValue(e.target.value)
            getUsers()
          }}
          className='border-[1px] border-[#d0d7de] rounded-md bg-[#f6f8fa] text-sm py-1.5 px-10 w-full'
          placeholder='Find by username'
        />
        {userNameInputValue.length >= 1
          ? <button>
            <i className='fa-solid fa-circle-xmark text-[#656d76] cursor-pointer relative right-7 w-0' onClick={() => setUsernameInputValue('')} />
          </button>
          : <span className='w-4'></span>}

      </div>

      {/* ===search result of list of users=== */}
      {userNameInputValue.length !== 0 &&
        <ul className='bg-white border-[1px] border-[#d0d7de] rounded-md w-7/12 lg:w-5/12 mt-1 z-10 absolute top-16'>
          {usersDataLoading && <p className='text-sm text-[#656D76] m-4'>loading...</p>}
          {usersData?.search.nodes.length === 0 && <p className='text-sm text-[#656D76] m-4'>No search result</p>}
          {usersData?.search.nodes.map((node: UsersType, index: number) => {
            return (
              <li
                key={`${node.id}_${index}`}
                className='flex hover:bg-gray-200 cursor-pointer my-1'
                onClick={() => {
                  setSelectedUser(node.login)
                  setUsernameInputValue('')
                }}
              >
                <img src={node.avatarUrl} alt={`${node.login}'s avatar`} className='w-8 h-8 rounded-md ml-2' />
                <div className='ml-2'>
                  <h1 className='font-bold text-sm'>{node.login}</h1>
                  <h2 className='text-xs'>{node.name}</h2>
                </div>
              </li>
            )
          })}
        </ul>
      }
    </header>
  )
}
