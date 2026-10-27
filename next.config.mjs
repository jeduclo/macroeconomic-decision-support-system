/** @type {import('next').NextConfig} */
const nextConfig = {
  // Route /api/py/* to FastAPI:
  //   - API_URL set (Docker, deploy/docker-compose.yml): the API container
  //   - development: local uvicorn on port 8000
  //   - Vercel: the Python serverless function in api/index.py
  async rewrites() {
    const destination = process.env.API_URL
      ? `${process.env.API_URL}/api/py/:path*`
      : process.env.NODE_ENV === "development"
        ? "http://127.0.0.1:8000/api/py/:path*"
        : "/api/";
    return [{ source: "/api/py/:path*", destination }];
  },
  outputFileTracingIncludes: {
    "/": ["./labs/**/*.py", "./engine/**/*"],
  },
};

export default nextConfig;
