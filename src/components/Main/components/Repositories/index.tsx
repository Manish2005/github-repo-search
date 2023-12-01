import { useState, useEffect } from 'react'
import moment from 'moment';
import { GET_REPOSITORIES } from './queries';
import { useLazyQuery, useQuery } from '@apollo/client';
import { RepositoryType } from './types';

export default function Repositories({ selectedUser }: { selectedUser: string | null }) {

  const [repositoryInputValue, setRepositoryInputValue] = useState<string>('')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('')

  const [getRepositories, { data: repositoriesData, loading: repositoriesDataLoading }] = useLazyQuery(GET_REPOSITORIES, {
    variables: {
      searchQuery: `user:${selectedUser} ${repositoryInputValue} in:name,description sort:updated fork:true language:${selectedLanguage}`
    }
  })

  useEffect(() => {
    getRepositories()
    setRepositoryInputValue('')
    setSelectedLanguage('')
  }, [selectedUser, getRepositories])

  // to make list of languages for filtering
  const { data: allRepositoriesData } = useQuery(GET_REPOSITORIES, {
    variables: {
      searchQuery: `user:${selectedUser} fork:true`
    }
  })
  const makeListOfLanguages =()=> {
    let list:string[] = []
    allRepositoriesData?.search.nodes.filter((node: RepositoryType) => {
      if(list.indexOf(node.primaryLanguage?.name) === -1 && node.primaryLanguage?.name !== undefined) {
        list.push(node.primaryLanguage?.name)
      }
    })
    return list
  }



  return (
    <section className='py-8 md:w-full'>
      <div className='flex flex-col gap-2 border-b-[1px] border-[#d0d7de] pb-8 lg:flex-row'>
        <input
          type='text'
          placeholder='Find a repository...'
          className='border-[1px] border-[#d0d7de] rounded-md text-sm py-[5px] pl-3 w-full'
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
          className='w-fit bg-[#f6f8fa] text-[#24282f] font-medium px-4 py-[5px] rounded-md text-sm border-[1px] border-[#d0d7de] shadow'
        >
          <option value={''}>All languages</option>
            {makeListOfLanguages().map((language: string) => {
            return <option key={language} value={language}>{language}</option>
          })}
        </select>
      </div>
      {(repositoryInputValue !== '' || selectedLanguage !== '') &&
        <div className='py-8 border-b-[1px] border-[#d0d7de]'>
          <p className='text-[#1f2328] text-sm'>
            <b>{repositoriesData?.search.repositoryCount}</b> results for repositories
            {repositoryInputValue !== '' && <> matching <b>{`${repositoryInputValue}`}</b></>}
            {selectedLanguage !== '' && <> written in <b>{`${selectedLanguage}`}</b></>}
          </p>
        </div>
      }
      {repositoriesDataLoading && <p className='text-sm text-[#656D76] my-4'>loading...</p>}
      {repositoriesData?.search.nodes.map((node: RepositoryType) => {
        return (
          <div key={node.id} className='border-b-[1px] border-[#d0d7de] py-6 flex justify-between items-center'>
            <div className='max-w-md'>
              <h3>
                <a href={node.url} target='_blank' rel="noreferrer" className='text-[#0969DA] text-xl font-bold hover:underline whitespace-normal'>{node.name}</a>
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
      })}
    </section>

  )
}
