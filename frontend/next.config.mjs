/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        BACKEND_BASE_URL: 'http://localhost:8080',
        NEXTAUTH_SECRET: 'my-secret'
    },
    images: {
        domains: ['localhost'],
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8080',
                pathname: '/uploads/**',
            },
        ],
    },
    logging: {
        fetches: {
            fullUrl: true
        }
    },
    webpack: (config) => {
        // Disable CSS source maps in development
        if (config.mode === 'development') {
            config.devtool = 'eval';
        }
        return config;
    },
};

export default nextConfig;
