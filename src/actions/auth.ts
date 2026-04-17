'use server';

import { getPbServerClient, setServerAuthCookie } from '@/lib/pocketbase';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const authSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

export async function loginAction(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = authSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const pb = await getPbServerClient();

  try {
    await pb.collection('users').authWithPassword(parsed.data.email, parsed.data.password);
    await setServerAuthCookie(pb);
    revalidatePath('/', 'layout');
  } catch (error: any) {
    return { error: 'بيانات الدخول غير صحيحة' };
  }

  redirect('/series');
}

export async function signupAction(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = authSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const pb = await getPbServerClient();

  try {
    // Generate a default username/display name
    const tempUsername = parsed.data.email.split('@')[0] + Math.floor(Math.random() * 1000);
    
    // Create the user
    await pb.collection('users').create({
      email: parsed.data.email,
      password: parsed.data.password,
      passwordConfirm: parsed.data.password,
      username: tempUsername,
      display_name: tempUsername,
      power_level: 5,
      streak: 0,
      show_on_leaderboard: true,
      zenkai_boosts: 0,
      active_zenkai_multiplier: 1,
      zenkai_attempts_left: 0,
      current_form: 'base',
      skill_points: 0,
      unlocked_skills: ["basic_knowledge"]
    });

    // Auto login
    await pb.collection('users').authWithPassword(parsed.data.email, parsed.data.password);
    await setServerAuthCookie(pb);
    revalidatePath('/', 'layout');
  } catch (error: any) {
    return { error: 'حدث خطأ أثناء التسجيل. قد يكون البريد مستخدماً.' };
  }

  redirect('/series');
}

export async function logoutAction() {
  const pb = await getPbServerClient();
  pb.authStore.clear();
  await setServerAuthCookie(pb);
  revalidatePath('/', 'layout');
  redirect('/');
}
