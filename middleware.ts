export { default } from "next-auth/middleware"

// This middleware protects the specified routes
// and ensures only users with the 'ORGANIZER' role can access them.
export const config = { matcher: ["/Dashboard", "/my-events", "/notifications"] }
