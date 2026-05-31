import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Public env vars (fallback for Vercel deployment)
  // These are overridden by .env.local in development
  env: {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "https://hcuybmrlozknmyijqabp.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjdXlibXJsb3prbm15aWpxYWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0ODYzMjIsImV4cCI6MjA5MjA2MjMyMn0.EiOFYCByHhd7WCPtVYpw0lCOz7l_agJSARSU_uqDj60",
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"),
  },
};

export default nextConfig;
