import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MockedProvider } from '@apollo/client/testing'
import Header from '.'
import { GET_USERS } from './queries'
import userEvent from '@testing-library/user-event'

describe('Header', () => {

  const usersData = {
    request: {
      query: GET_USERS,
      variables: { userQuery: 'john' }
    },
    result: {
      data: {
        search: {
          nodes: [
            {
              avatarUrl: 'https://example.com/avatar.png',
              id: '1234',
              name: 'john',
              login: 'john',
            }
          ]
        }
      }
    }
  }

  it('should render a header component with a search input and a search result section', () => {
    const setSelectedUser = jest.fn()
    render(
      <MockedProvider addTypename={false}>
        <Header setSelectedUser={setSelectedUser} />
      </MockedProvider>
    )
    expect(screen.getByPlaceholderText('Find by username')).toBeInTheDocument()
  })

  it('should allow the user to input a username to search for', () => {
    const setSelectedUser = jest.fn()
    render(
      <MockedProvider addTypename={false}>
        <Header setSelectedUser={setSelectedUser} />
      </MockedProvider>
    )
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'john' } })
    expect(screen.getByDisplayValue('john')).toBeInTheDocument();
  })

  it('should display a list of users when username input is entered', async () => {
    const setSelectedUser = jest.fn()
    render(
      <MockedProvider mocks={[usersData]} addTypename={false}>
        <Header setSelectedUser={setSelectedUser} />
      </MockedProvider>
    )
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'john' } })
    expect(await screen.findByRole('list')).toBeInTheDocument()
  })

  it('should display "loading..." while waiting for search results', async () => {
    const setSelectedUser = jest.fn()
    const usersDataWithDelay = {
      delay: Infinity,
      request: {
        query: GET_USERS,
        variables: { userQuery: 'john' }
      },
      result: {
        data: {
          search: {
            nodes: [
              {
                avatarUrl: 'https://example.com/avatar.png',
                id: '123',
                name: 'john',
                login: 'john',
                __typename: "User",
              }
            ]
          }
        }
      }
    }
    render(
      <MockedProvider mocks={[usersDataWithDelay]} addTypename={false}>
        <Header setSelectedUser={setSelectedUser} />
      </MockedProvider>
    )
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'john' } })
    expect(screen.getByText('loading...')).toBeInTheDocument()
  })

  it('should display no search results when search query is empty', () => {
    const setSelectedUser = jest.fn()
    render(
      <MockedProvider mocks={[usersData]} addTypename={false}>
        <Header setSelectedUser={setSelectedUser} />
      </MockedProvider>
    )
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('should display "No search result" when search query returns no users', async () => {
    const setSelectedUser = jest.fn()
    const usersDataWithNoResult = {
      request: {
        query: GET_USERS,
        variables: { userQuery: 'randomusername' }
      },
      result: {
        data: {
          search: { nodes: [] }
        }
      }
    }
    render(
      <MockedProvider mocks={[usersDataWithNoResult]} addTypename={false}>
        <Header setSelectedUser={setSelectedUser} />
      </MockedProvider>
    )
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'randomusername' } })
    expect(await screen.findByText('No search result')).toBeInTheDocument()
  })

  it('should clear input when "x" button in input is clicked ', () => {
    const setSelectedUser = jest.fn()
    render(
      <MockedProvider addTypename={false}>
        <Header setSelectedUser={setSelectedUser} />
      </MockedProvider>
    )
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'john' } })
    userEvent.click(screen.getByRole('button'))
    expect(screen.queryByText('john')).not.toBeInTheDocument()
  })

})

