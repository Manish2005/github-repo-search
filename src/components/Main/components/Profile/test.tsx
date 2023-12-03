import {render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Profile from '.'

describe('Profile', () => {

  const userData = {
    avatarUrl: 'https://example.com/avatar.png',
    bio: 'Bio',
    followers: { totalCount: 5 },
    following: { totalCount: 10 },
    id: '123',
    login: 'john_doe',
    name: 'John Doe',
    __typename: "User",
  }

  it('should render user data', () => {
    render(<Profile userData={userData} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john_doe')).toBeInTheDocument()
    expect(screen.getByAltText("john_doe's avatar")).toBeInTheDocument()
    expect(screen.getByText('Bio')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('should display a Follow button', () => {
    render(<Profile userData={userData} />)
    expect(screen.getAllByRole('button', { name: 'Follow' })).toHaveLength(2)
  })

  it('should format follower and following count', () => {
    const userDataWithManyFollowers = {
      avatarUrl: 'https://example.com/avatar.png',
      bio: 'Bio',
      followers: { totalCount: 195333 },
      following: { totalCount: 1227 },
      id: '123',
      login: 'john_doe',
      name: 'John Doe',
      __typename: "User",
    }
    render(<Profile userData={userDataWithManyFollowers} />)
    expect(screen.getByText('1.2k')).toBeInTheDocument()
    expect(screen.getByText('195.3k')).toBeInTheDocument()
  })

})
