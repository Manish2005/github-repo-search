import { act, render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MockedProvider } from '@apollo/client/testing'
import userEvent from '@testing-library/user-event'
import Repositories from '.'
import { GET_REPOSITORIES } from './queries'


describe('Repositories', () => {

  it('should display an input field for searching repositories', () => {
    render(
      <MockedProvider>
        <Repositories selectedUser={null} />
      </MockedProvider>
    )
    const inputElement = screen.getByPlaceholderText('Find a repository...')
    expect(inputElement).toBeInTheDocument()
  })

  it('should display a select field for filtering repositories by language', () => {
    render(
      <MockedProvider>
        <Repositories selectedUser={null} />
      </MockedProvider>
    )
    const selectElement = screen.getByRole('combobox')
    expect(selectElement).toBeInTheDocument()
  })

  it('should handle the case when there are no repositories found', async () => {
    const selectedUser = 'john_doe'
    const repositoryInputValue = ''
    const selectedLanguage = ''
    const repositoriesDataWithNoRepositories = {
      request: {
        query: GET_REPOSITORIES,
        variables: { searchQuery: `user:${selectedUser} ${repositoryInputValue} in:name,description sort:updated fork:true language:${selectedLanguage}` }
      },
      result: {
        data: {
          search: {
            nodes: [],
            repositoryCount: 0
          }
        }
      }
    }
    render(
      <MockedProvider mocks={[repositoriesDataWithNoRepositories]} addTypename={false}>
        <Repositories selectedUser={selectedUser} />
      </MockedProvider>
    )
    expect(await screen.findByText('There are no public repositories yet')).toBeInTheDocument()
  })

  it('should render repositories successfully', async () => {
    const selectedUser = 'john_doe'
    const repositoryInputValue = ''
    const selectedLanguage = ''
    const repositoriesData = {
      request: {
        query: GET_REPOSITORIES,
        variables: { searchQuery: `user:${selectedUser} ${repositoryInputValue} in:name,description sort:updated fork:true language:${selectedLanguage}` }
      },
      result: {
        data: {
          search: {
            repositoryCount: 1,
            nodes: [
              {
                description: 'done by JS',
                id: '123',
                isPrivate: false,
                name: 'test-repo-1',
                primaryLanguage: {
                  color: '#f1e05a',
                  name: 'JavaScript',
                  __typename: 'Language',
                },
                pushedAt: '2023-12-01T12:05:16Z',
                url: 'https://test/repo1',
                __typename: 'Repository',
              },
              {
                description: null,
                id: '456',
                isPrivate: false,
                name: 'test-repo-2',
                primaryLanguage: {
                  color: '#3178c6',
                  name: 'TypeScript',
                  __typename: 'Language',
                },
                pushedAt: '2022-01-01T12:05:16Z',
                url: 'https://test/repo2',
                __typename: 'Repository',
              },
              {
                description: 'random description',
                id: '789',
                isPrivate: false,
                name: 'test-repo-3',
                primaryLanguage: {
                  color: '#563d7c',
                  name: 'CSS',
                  __typename: 'Language',
                },
                pushedAt: '2021-02-01T12:05:16Z',
                url: 'https://test/repo3',
                __typename: 'Repository',
              },
            ]
          }
        }
      }
    }
    render(
      <MockedProvider mocks={[repositoriesData]} addTypename={false}>
        <Repositories selectedUser={selectedUser} />
      </MockedProvider>
    )
    expect(await screen.findByText('test-repo-1')).toBeInTheDocument()
    expect(await screen.findByText('done by JS')).toBeInTheDocument()
    expect(await screen.findByText('JavaScript')).toBeInTheDocument()
    expect(await screen.findByText('test-repo-2')).toBeInTheDocument()
    expect(await screen.findByText('TypeScript')).toBeInTheDocument()
    expect(await screen.findByText('test-repo-3')).toBeInTheDocument()
    expect(await screen.findByText('random description')).toBeInTheDocument()
    expect(await screen.findByText('CSS')).toBeInTheDocument()
    expect(await screen.findAllByRole('button', {name: /star/i})).toHaveLength(3)
  })


  it("should filter correctly by entering repository's name", async()=> {
    const selectedUser = 'john_doe'
    const repositoryInputValue = 'repo-2'
    const selectedLanguage = ''
    const repositoriesDataFilteredByName = {
      request: {
        query: GET_REPOSITORIES,
        variables: { searchQuery: `user:${selectedUser} ${repositoryInputValue} in:name,description sort:updated fork:true language:${selectedLanguage}` }
      },
      result: {
        data: {
          search: {
            repositoryCount: 1,
            nodes: [
              {
                description: null,
                id: '456',
                isPrivate: false,
                name: 'test-repo-2',
                primaryLanguage: {
                  color: '#3178c6',
                  name: 'TypeScript',
                  __typename: 'Language',
                },
                pushedAt: '2022-01-01T12:05:16Z',
                url: 'https://test/repo2',
                __typename: 'Repository',
              },
            ]
          }
        }
      }
    }
    render(
      <MockedProvider mocks={[repositoriesDataFilteredByName]} addTypename={false}>
        <Repositories selectedUser={selectedUser} />
      </MockedProvider>
    )
    const inputElement = screen.getByPlaceholderText('Find a repository...')
    fireEvent.change(inputElement, { target: { value: 'repo-2' } })
    await act(() => new Promise(resolve => setTimeout(resolve, 0)))
    expect(screen.queryByText('test-repo-1')).not.toBeInTheDocument()
    expect(screen.queryByText('test-repo-2')).toBeInTheDocument()
    expect(screen.queryByText('test-repo-3')).not.toBeInTheDocument()
  })


  it('should display correct list of languages, and should filter correctly by selecting language', async()=> {
    const selectedUser = 'john_doe'
    const repositoryInputValue = ''
    const selectedLanguage2 = 'JavaScript'
    const repositoriesDatatoRetrieveLanguage = {
      request: {
        query: GET_REPOSITORIES,
        variables: { searchQuery: `user:${selectedUser} fork:true` }
      },
      result: {
        data: {
          search: {
            repositoryCount: 3,
            nodes: [
              {
                description: 'done by JS',
                id: '123',
                isPrivate: false,
                name: 'test-repo-1',
                primaryLanguage: {
                  color: '#f1e05a',
                  name: 'JavaScript',
                  __typename: 'Language',
                },
                pushedAt: '2023-12-01T12:05:16Z',
                url: 'https://test/repo1',
                __typename: 'Repository',
              },
              {
                description: null,
                id: '456',
                isPrivate: false,
                name: 'test-repo-2',
                primaryLanguage: {
                  color: '#3178c6',
                  name: 'TypeScript',
                  __typename: 'Language',
                },
                pushedAt: '2022-01-01T12:05:16Z',
                url: 'https://test/repo2',
                __typename: 'Repository',
              },
              {
                description: 'random description',
                id: '789',
                isPrivate: false,
                name: 'test-repo-3',
                primaryLanguage: {
                  color: '#563d7c',
                  name: 'CSS',
                  __typename: 'Language',
                },
                pushedAt: '2021-02-01T12:05:16Z',
                url: 'https://test/repo3',
                __typename: 'Repository',
              },
            ]
          }
        }
      }
    }
    const repositoriesDataFilteredByLanguage = {
      request: {
        query: GET_REPOSITORIES,
        variables: { searchQuery: `user:${selectedUser} ${repositoryInputValue} in:name,description sort:updated fork:true language:${selectedLanguage2}` }
      },
      result: {
        data: {
          search: {
            repositoryCount: 1,
            nodes: [
              {
                description: 'done by JS',
                id: '123',
                isPrivate: false,
                name: 'test-repo-1',
                primaryLanguage: {
                  color: '#f1e05a',
                  name: 'JavaScript',
                  __typename: 'Language',
                },
                pushedAt: '2023-12-01T12:05:16Z',
                url: 'https://test/repo1',
                __typename: 'Repository',
              },
            ]
          }
        }
      }
    }
    render(
      <MockedProvider mocks={[repositoriesDatatoRetrieveLanguage, repositoriesDataFilteredByLanguage]} addTypename={false}>
        <Repositories selectedUser={selectedUser} />
      </MockedProvider>
    )
    await act(() => new Promise(resolve => setTimeout(resolve, 0)))
    const selectElement = screen.getByRole('combobox')
    userEvent.click(selectElement)
    expect(screen.getByRole('option', {name: 'JavaScript'})).toBeInTheDocument()
    expect(screen.getByRole('option', {name: 'TypeScript'})).toBeInTheDocument()
    expect(screen.getByRole('option', {name: 'CSS'})).toBeInTheDocument()
    userEvent.selectOptions(selectElement, 'JavaScript');
    await act(() => new Promise(resolve => setTimeout(resolve, 0)))
    expect(await screen.findByText('test-repo-1')).toBeInTheDocument()
    expect(screen.queryByText('test-repo-2')).not.toBeInTheDocument()
    expect(screen.queryByText('test-repo-3')).not.toBeInTheDocument()
  })

})
