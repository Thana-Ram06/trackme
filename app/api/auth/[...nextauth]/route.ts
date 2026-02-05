import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import clientPromise from '@/lib/mongodb'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'database'
  },
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) {
        session.user.id = user.id
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  }
})

export { handler as GET, handler as POST }