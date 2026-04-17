import { SignJWT, jwtVerify } from 'jose';
import { env } from './env';

const secret = new TextEncoder().encode(env.QUIZ_TOKEN_SECRET);

export interface QuizSessionPayload {
  userId: string;
  questionId: string;
  seriesSlug: string;
  nonce: string;
  iat?: number;
  exp?: number;
}

export async function signQuizToken(payload: Omit<QuizSessionPayload, 'iat' | 'exp'>) {
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('5m') // User has 5 minutes to answer
    .sign(secret);
}

export async function verifyQuizToken(token: string): Promise<QuizSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as QuizSessionPayload;
  } catch (error) {
    return null;
  }
}
