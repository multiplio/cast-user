/* eslint-disable */

jest.mock('./logger')

process.env.EMAILER_ADDRESS = 'email'

const email = "wile.e@acme.com"
const name = "wile.e"

const address = `http://${process.env.EMAILER_ADDRESS}/onboard/${email}/${name}`

describe('email', () => {
  const mockFetch = jest.fn()
  jest.setMock('node-fetch', mockFetch)

  const m = require('./email')

  test('creates the correct address', () => {
    m(email, name)
    expect(mockFetch).toBeCalledWith(address)
  })
})

