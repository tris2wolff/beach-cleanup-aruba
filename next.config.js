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
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }
    
    // Handle undici module parsing issues
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });

    // Exclude undici from webpack processing
    config.externals = config.externals || [];
    config.externals.push({
      'undici': 'undici',
    });

    return config;
  },
  transpilePackages: ['@hcaptcha/react-hcaptcha'],
}

module.exports = nextConfig
