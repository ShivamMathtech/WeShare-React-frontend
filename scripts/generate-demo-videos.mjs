// Optional: regenerate the two bundled, silent pan/zoom artwork clips.
// Requires FFmpeg on PATH. You do NOT need FFmpeg to run the frontend.
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const inputs = [
  { file: 'color-study.mp4', crop: '129:64:278:864', seconds: 12 },
  { file: 'soft-shapes.mp4', crop: '124:64:143:864', seconds: 10 },
];
for (const clip of inputs) {
  const result = spawnSync('ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-y', '-loop', '1',
    '-i', resolve(root, 'public/assets/reference.jpg'),
    '-vf', `crop=${clip.crop},scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,zoompan=z='1.06+0.03*sin(on/50)':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=960x540:fps=24,format=yuv420p`,
    '-t', String(clip.seconds), '-an', '-c:v', 'libx264', '-preset', 'fast', '-crf', '25', '-movflags', '+faststart',
    resolve(root, 'public/assets', clip.file),
  ], { stdio: 'inherit' });
  if (result.error || result.status !== 0) { console.error('Could not generate clips. Install FFmpeg to use this optional script.'); process.exit(1); }
  console.log(`Created public/assets/${clip.file}`);
}
