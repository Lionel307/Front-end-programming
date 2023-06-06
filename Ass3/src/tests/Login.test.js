import Login from '../pages/Login'
import { render, screen } from '@testing-library/react'

// const noop = () => {}

describe('Login', () => {
  it('should render a login page', () => {
    render(<Login />)
    // expect(screen.getByRole('button', { email: /login/i })).toBeInTheDocument()
  })
})
