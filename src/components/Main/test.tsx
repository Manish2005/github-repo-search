import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MockedProvider } from '@apollo/client/testing'
import Main from '.'
import { GET_USER } from './queries'

describe('Main', () => {

  const userData = {
    request: {
      query: GET_USER,
      variables: { userQuery: 'john_doe' }
    },
    result: {
      data: {
        search: {
          nodes: [
            {
              avatarUrl: 'https://example.com/avatar.png',
              bio: 'Bio',
              followers: { totalCount: 10 },
              following: { totalCount: 5 },
              id: '123',
              login: 'john_doe',
              name: 'John Doe',
              __typename: "User",
            },
          ]
        }
      }
    }
  }

  it('should render "loading..." message when userData is being fetched', () => {
    const selectedUser = "john_doe"
    render(
      <MockedProvider mocks={[userData]} addTypename={false}>
        <Main selectedUser={selectedUser} />
      </MockedProvider>
    )
    expect(screen.getByText('loading...')).toBeInTheDocument()
  })

  it('should render the Profile component and the Repositories component when userData is fetched successfully', async () => {
    const selectedUser = "john_doe"
    render(
      <MockedProvider mocks={[userData]} addTypename={false}>
        <Main selectedUser={selectedUser} />
      </MockedProvider>
    )
    expect(await screen.findByText('John Doe')).toBeInTheDocument()
    expect(await screen.findByPlaceholderText('Find a repository...')).toBeInTheDocument()
  })

  it('should render nothing when selectedUser is null', () => {
    const selectedUser = null
    render(
      <MockedProvider addTypename={false}>
        <Main selectedUser={selectedUser} />
      </MockedProvider>
    )
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Find a repository...')).not.toBeInTheDocument()
  })
})
