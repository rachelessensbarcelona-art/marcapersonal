/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    // El vídeo y su foto de portada no cambian nunca. Diciéndoselo al
    // navegador, la segunda visita los saca de su propia memoria y el vídeo
    // aparece al momento, sin volver a descargar 12 MB.
    return [
      {
        source: '/:archivo(video\\.mp4|video-poster\\.jpg|testimonio-.+\\.(?:mp4|jpg))',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};
export default nextConfig;
