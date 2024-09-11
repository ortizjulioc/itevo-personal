import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize (credentials, req) {
        console.log('credentials', credentials)
        const user = { id: 1, name: 'J Smith', email: 'vnc3xp@gmail.com' }
        if (user) {
          return user
        } else {
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt ({ token, user, account, profile, trigger, session }) {
        if (user) {
            token.user = user
        }
    },
    session ({ session, token }) {
      session.user = token.user
      return session
    }
  },
  pages: {
    signIn: '/login'
  }
})

export { handler as GET, handler as POST }
