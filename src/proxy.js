import { withAuth } from "next-auth/middleware";

export default withAuth({
  // This matches the 'pages' config in your authOptions
  pages: {
    signIn: "/",
  },
});

export const config = {
  matcher: [
    "/add-medication/:path*",
    "/dashboard/:path*",
    "/calendar/:path*",
    "/identifier/:path*",
    "/option/:path*",
    "/precautions/:path*",
    "/search-results/:path*",
  ],
};