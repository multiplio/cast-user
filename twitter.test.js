/* eslint-disable */

// local dependencies mocks
jest.mock('./logger')
jest.mock('./email')

describe('twitter', () => {
  // external dependencies mocks
  const mockPassport = {
    serializeUser: jest.fn(),
    deserializeUser: jest.fn(),
    use: jest.fn(),
    initialize: jest.fn(),
    session: jest.fn(),
    authenticate: jest.fn(),
  }
  jest.setMock('passport', mockPassport)

  const mockStrategy = jest.fn()
  jest.setMock('passport-twitter', {
    Strategy: mockStrategy,
  })

  // require module
  const m = require('./twitter')

  // tests
  test('sets all routes', () => {
    const app = {
      use: jest.fn(),
      get: jest.fn(),
    }
    m(app, null)

    expect(app.get.mock.calls.length).toBe(3)
    expect(app.get.mock.calls[0][0]).toBe('/auth/twitter')
    expect(app.get.mock.calls[1][0]).toBe('/auth/twitter/callback')
    expect(app.get.mock.calls[2][0]).toBe('/logout')
  })
  test('logout works', done => {
    const app = {
      use: jest.fn(),
      get: jest.fn(),
    }

    app.get.mockImplementation((route, cb) => {
      if (route == '/logout') {
        const req = { logout: jest.fn() }
        const res = { redirect: jest.fn() }
        cb(req, res)

        expect(req.logout).toHaveBeenCalled()
        expect(res.redirect).toHaveBeenCalledWith('/login')
        done()
      }
    })

    m(app, null)
  })
  test('callback redirects home on success', done => {
    const app = {
      use: jest.fn(),
      get: jest.fn(),
    }

    app.get.mockImplementation((route, auth, cb) => {
      if (route == '/auth/twitter/callback') {
        const res = { redirect: jest.fn() }
        cb({ user: { displayName: "user.displayName" } }, res)

        expect(res.redirect).toHaveBeenCalledWith('/')
        done()
      }
    })

    m(app, null)
  })
  test('callback sets correct failure redirect', done => {
    const app = {
      use: jest.fn(),
      get: jest.fn(),
    }

    app.get.mockImplementation((route, auth, cb) => {
      if (route == '/auth/twitter/callback') {
        expect(mockPassport.authenticate).toHaveBeenCalledWith('twitter', {
          failureRedirect: '/login',
        })
        done()
      }
    })

    m(app, null)
  })
})

