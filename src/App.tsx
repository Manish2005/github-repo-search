import { useEffect, useState } from 'react';
import './App.css';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import moment from 'moment'

function App() {

  const [userNameInputValue, setUsernameInputValue] = useState<string>('')
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [repositoryInputValue, setRepositoryInputValue] = useState<string>('')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('')

  type UserType = {
    avatarUrl: string
    bio: string
    id: string
    location: string
    login: string
    name: string
  }

  type RepositoryType = {
    description: string
    id: string
    isPrivate: boolean
    primaryLanguage: {
      color: string
      name: string
    }
    name: string
    pushedAt: string
    url: string
    updatedAt: string
  }

  const GET_USERS = gql`
   query ($userQuery: String!){
      search(query: $userQuery, type: USER, first: 10){
          nodes{
            ... on User {
              avatarUrl
              id
              name
              login
            }
          }
        }
    }
  `

  const GET_USER = gql`
   query ($userQuery: String!){
      search(query: $userQuery, type: USER, first: 1){
          nodes{
            ... on User {
              avatarUrl
              bio
              id
              location
              login
              name
            }
          }
       }
    }
  `

  const GET_REPOSITORIES = gql`
     query($searchQuery: String!) {
      search(query: $searchQuery, type:REPOSITORY, first:100) {
        repositoryCount
        nodes {
          ... on Repository {
            description
              id
              isPrivate
              primaryLanguage {
                color 
                name
              }
              name
              pushedAt
              url
          }
        }
      }
    }
  `

  const [getUsers, { data: usersData }] = useLazyQuery(GET_USERS, {
    variables: {
      userQuery: userNameInputValue
    }
  })

  const [getUser, { data: userData, loading: userDataLoading }] = useLazyQuery(GET_USER, {
    variables: {
      userQuery: selectedUser
    }
  })

  const [getRepositories, { data: repositoriesData, loading: repositoriesDataLoading }] = useLazyQuery(GET_REPOSITORIES, {
    variables: {
      searchQuery: `user:${selectedUser} ${repositoryInputValue} in:name,description sort:updated fork:true language:${selectedLanguage}`
    }
  })

  // to make list of languages for filtering
  const { data: allRepositoriesData } = useQuery(GET_REPOSITORIES, {
    variables: {
      searchQuery: `user:${selectedUser} fork:true`
    }
  })
  const allLanguages = allRepositoriesData?.search.nodes.map((node: RepositoryType) => {
    return node.primaryLanguage?.name
  })
  const allLanguagesWithoutUndefined = allLanguages?.filter((language: string) => language !== undefined)
  const languagesForFiltering = [... new Set(allLanguagesWithoutUndefined)]


  return (
    <div>
      <header className='bg-[#f6f8fa] h-16'>
        <div className='flex justify-center items-center h-16'>
          {/* <i className="fa-solid fa-magnifying-glass text-red-300"></i> */}
          <input
            type='text'
            value={userNameInputValue}
            onChange={(e) => {
              setUsernameInputValue(e.target.value)
              getUsers()
            }}
            className='border-[1px] border-[#d0d7de] rounded-md bg-[#f6f8fa] text-sm py-1.5 pl-2 w-8/12'
            placeholder='Find by username'
          />
          {userNameInputValue.length >= 1 && <i className='fa-solid fa-circle-xmark text-[#656d76] relative right-6 cursor-pointer' onClick={() => setUsernameInputValue('')} />}
        </div>

        {usersData &&
          <section className='bg-white border-[1px] border-[#f6f8fa] rounded-md w-8/12 mx-auto'>
            {usersData.search.nodes.map((node: UserType) => {
              return (
                <div
                  key={node.id}
                  className='flex hover:bg-gray-200 cursor-pointer my-1'
                  onClick={() => {
                    setSelectedUser(node.login)
                    getUser()
                    setUsernameInputValue('')
                    getRepositories()
                  }}
                >
                  <img src={node.avatarUrl} alt={`${node.name}'s avatar`} className='w-8 h-8 rounded-md ml-2' />
                  <div className='ml-2'>
                    <h1 className='font-bold text-sm'>{node.login}</h1>
                    <h2 className='text-xs'>{node.name}</h2>
                  </div>
                </div>
              )
            })}
          </section>
        }
      </header>

      {userDataLoading && 'loading...'}
      {userData &&
        <main className='mx-4 my-2'>

          <section className='w-full border-b-[1px] border-[#d0d7de] py-8'>
            <div className='flex items-center mb-4'>
              <img src={userData.search.nodes[0].avatarUrl} alt={`${userData.search.nodes[0].name}'s avatar`} className='w-24 rounded-full mr-4' />
              <div className='py-4'>
                <h1 className='text-2xl text-[#1f2328] font-bold'>{userData.search.nodes[0].name}</h1>
                <h2 className='text-xl text-[#656d76]'>{userData.search.nodes[0].login}</h2>
              </div>
            </div>
            <p className='text-[#1f2328] mb-4'>{userData.search.nodes[0].bio}</p>
            <button className='w-full bg-[#f6f8fa] text-[#24282f] px-4 py-1.5 rounded-md text-sm border-[1px] border-[#d0d7de] shadow'>Follow</button>
          </section>

          <section className='py-8'>
            <div className='flex flex-col gap-2 border-b-[1px] border-[#d0d7de] pb-8'>
              <input
                type='text'
                placeholder='Find a repository...'
                className='border-[1px] border-[#d0d7de] rounded-md text-sm py-1.5 pl-3 w-full'
                value={repositoryInputValue}
                onChange={(e) => {
                  setRepositoryInputValue(e.target.value)
                  getRepositories()
                }}
              />
              <select
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value)
                  getRepositories()
                }}
                className='w-fit bg-[#f6f8fa] text-[#24282f] px-4 py-1.5 rounded-md text-sm border-[1px] border-[#d0d7de] shadow'
              >
                <option value={''}>All languages</option>
                {languagesForFiltering.map((language: any) => {
                  return <option key={language} value={language}>{language}</option>
                })}
              </select>
            </div>

            {
              (repositoryInputValue !== '' || selectedLanguage !== '') &&
              <div className='py-8 border-b-[1px] border-[#d0d7de]'>
                <p className='text-[#1f2328] text-sm'>
                  <b>{repositoriesData?.search.repositoryCount}</b> results for repositories
                  {repositoryInputValue !== '' && <> matching <b>{`${repositoryInputValue}`}</b></>}
                  {selectedLanguage !== '' && <> written in <b>{`${selectedLanguage}`}</b></>}
                </p>
              </div>
            }

            {repositoriesDataLoading && <>loading...</>}
            {
              repositoriesData?.search.nodes.map((node: RepositoryType) => {
                return (
                  <div key={node.id} className='border-b-[1px] border-[#d0d7de] py-6 flex justify-between items-center'>
                    <div>
                      <h3>
                        <a href={node.url} target='_blank' className='text-[#0969DA] text-xl font-bold hover:underline'>{node.name}</a>
                        {!node.isPrivate && <span className='text-xs text-[#656d76] ml-2 relative bottom-0.5 py-0.5 px-1.5 font-medium border-[1px] rounded-full'>Public</span>}
                      </h3>
                      <p className='text-[#656d76] text-sm mb-4 pr-6'>{node.description}</p>
                      <span className='text-xs'>
                        <span className='rounded-full mr-1.5' style={{ backgroundColor: node.primaryLanguage?.color }}>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <span className='text-[#656d76] mr-4'>{node.primaryLanguage?.name}</span>
                        <span className='text-[#656d76]'>Updated {moment(node.pushedAt).fromNow()}</span>
                      </span>
                    </div>
                    <div className='whitespace-nowrap'>
                      <button className='bg-[#f6f8fa] text-[#24282f] px-3 py-1 rounded-l-md text-xs border-[1px] border-[#d0d7de] font-medium shadow'>
                        <i className='fa-regular fa-star text-[#656d76] mr-2' />Star
                      </button>
                      <button className='bg-[#f6f8fa] px-3 py-1 rounded-r-md text-xs border-y-[1px] border-r-[1px] border-[#d0d7de] shadow'>
                        <i className='fa-solid fa-caret-down text-[#656d76]' />
                      </button>
                    </div>
                  </div>
                )
              })
            }

          </section>

        </main>
      }
    </div>
  );
}

export default App;

