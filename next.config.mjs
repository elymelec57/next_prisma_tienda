//import withFlowbiteReact from "flowbite-react/class-list.json";

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    remotePatterns: [
      new URL('https://duavmk3fx3tdpyi9.public.blob.vercel-storage.com/**'),
    ],
  },
};

//export default withFlowbiteReact(nextConfig);