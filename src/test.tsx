import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import App from './App';
import { MockedProvider } from '@apollo/client/testing'


describe('App', () => {

  it('should render Header and Main components', () => {
    render(<MockedProvider addTypename={false}>
      <App />
    </MockedProvider>)
    expect(screen.getByPlaceholderText(/find by username/i)).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})


