import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      // We’ll send the user to your backend next step
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl + '/login'; // We'll handle redirect logic in the login page
    },
    async session({ session }) {
      return session; // Optional
    },
  },
});

export { handler as GET, handler as POST };
