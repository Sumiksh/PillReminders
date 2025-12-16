// src/app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
console.log("Hello")
// 1. Define the NextAuth Configuration
const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      // These environment variables MUST be set in your .env.local file
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ... potentially add more providers later (Apple, Email, etc.)
  ],
  
  // 2. Configure Session, Database, and Pages
  // You would add a Cassandra adapter here if you configure one.
  // adapter: CassandraAdapter(), 
  
  // Custom pages configuration
  pages: {
    signIn: '/', // Directs users to the root page for sign-in
    error: '/',  // Redirect errors back to the root page for simplicity
  },
  
  // Debug mode is helpful during setup
  debug: process.env.NODE_ENV === 'development',
};

// 3. Create the handler using the configuration
const handler = NextAuth(authOptions);

// 4. Export the handler for both GET and POST requests
// NextAuth needs to handle both to complete the OAuth flow.
export { handler as GET, handler as POST };