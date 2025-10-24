/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'raw.githubusercontent.com',
      'images.unsplash.com',
      'maps.googleapis.com'
    ],
  },
  webpack: (config, { isServer }) => {
    // Fix for Firebase Storage and undici compatibility
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Handle undici module parsing issues
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });

    return config;
  },
  transpilePackages: ['@hcaptcha/react-hcaptcha'],
}

module.exports = nextConfig
