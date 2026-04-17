import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  POCKETBASE_URL: z.string().url().default('http://localhost:8090'),
  POCKETBASE_ADMIN_EMAIL: z.string().email().default('admin@example.com'),
  POCKETBASE_ADMIN_PASSWORD: z.string().min(1).default('password'),
  CLOUDINARY_CLOUD_NAME: z.string().min(1).default('test'),
  CLOUDINARY_API_KEY: z.string().min(1).default('test'),
  CLOUDINARY_API_SECRET: z.string().min(1).default('test'),
  QUIZ_TOKEN_SECRET: z.string().min(16).default('generate-a-strong-secret-token-12345'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.warn('❌ Invalid environment variables', _env.error.format());
}

export const env = _env.success ? _env.data : envSchema.parse({});

export const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
