/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    // Configure webpack for proper PDF.js and canvas handling
    webpack: (config, { isServer }) => {
        // Server-side configuration
        if (isServer) {
            // Externalize @napi-rs/canvas for server builds
            // This prevents webpack from trying to bundle native modules
            config.externals = config.externals || [];
            if (Array.isArray(config.externals)) {
                config.externals.push('@napi-rs/canvas');
            }
        }

        // Handle canvas-related modules
        config.resolve = config.resolve || {};
        config.resolve.alias = config.resolve.alias || {};

        // Prevent bundling of canvas modules in client-side code
        if (!isServer) {
            config.resolve.alias['@napi-rs/canvas'] = false;
            config.resolve.alias['canvas'] = false;
        }

        // Ignore encoding module warnings (optional dependency)
        config.resolve.alias['encoding'] = false;

        return config;
    },

    // Increase body size limit for PDF uploads (Next.js 14+)
    experimental: {
        serverActions: {
            bodySizeLimit: '50mb'
        }
    }
};

export default nextConfig;
