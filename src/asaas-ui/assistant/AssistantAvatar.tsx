import faceCelebrate from '../assets/assistant/face-celebrate.webp';
import faceHappy from '../assets/assistant/face-happy.webp';
import faceSmile from '../assets/assistant/face-smile.webp';
import faceWaiting from '../assets/assistant/face-waiting.webp';
import robotWave from '../assets/assistant/robot-wave.webp';
import { cx } from '../lib/cx';
import { firstName } from '../lib/format';

/**
 * Asaas robot artwork (exported to WebP).
 * The full robot greets from outside the chat; inside it, only its face shows.
 */
const FACES: Record<string, any> = {
  smile: faceSmile,
  happy: faceHappy,
  waiting: faceWaiting,
  celebrate: faceCelebrate,
};

export type AssistantMood = 'smile' | 'happy' | 'waiting' | 'celebrate';

function getImgSrc(img: any): string {
  if (!img) return '';
  if (typeof img === 'string') return img;
  return img.src || '';
}

export function AssistantFace({ mood = 'happy', size = 'md' }: { mood?: AssistantMood; size?: 'sm' | 'md' }) {
  const src = getImgSrc(FACES[mood]);
  return <img src={src} alt="" className={cx('assistant-face', `assistant-face--${size}`)} draggable={false} />;
}

export function AssistantRobot({ className }: { className?: string }) {
  const src = getImgSrc(robotWave);
  return <img src={src} alt="" className={cx('assistant-robot', className)} draggable={false} />;
}

/** "صباح الخير" until noon, "مساء الخير" after, with the first name only. */
export function greeting(displayName: string, now = new Date()): string {
  const name = firstName(displayName);
  const salutation = now.getHours() < 12 ? 'صباح الخير' : 'مساء الخير';
  return name ? `${salutation} يا ${name}` : salutation;
}
