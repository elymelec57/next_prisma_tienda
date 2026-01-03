//import withFlowbiteReact from "flowbite-react/class-list.json";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      new URL('https://duavmk3fx3tdpyi9.public.blob.vercel-storage.com/**'),
    ],
  },

  async headers() {
    return [
      {
        // Aplica a todas las rutas de la API
        source: "/api/admin/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "https://github.io" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
        ],
      },
    ];
  },
};

//export default withFlowbiteReact(nextConfig);
export default nextConfig;