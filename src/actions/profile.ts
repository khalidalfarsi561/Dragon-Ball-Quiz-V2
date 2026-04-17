'use server';

import { getPbServerClient, getPbAdminClient } from '@/lib/pocketbase';
import { uploadImage } from '@/lib/cloudinary';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const profileUpdateSchema = z.object({
  display_name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(50, 'الاسم طويل جداً'),
  bio: z.string().max(200, 'النبذة يجب أن لا تتجاوز 200 حرف').optional().transform(v => v || ''),
  show_on_leaderboard: z.boolean().default(true),
});

export async function updateProfileAction(formData: FormData) {
  const pb = await getPbServerClient();
  if (!pb.authStore.isValid || !pb.authStore.record) {
    return { error: 'غير مصرح' };
  }

  const userId = pb.authStore.record.id;
  
  // File upload logic
  const file = formData.get('avatar_file') as File | null;
  let avatar_url = undefined;

  if (file && file.size > 0) {
    if (!file.type.startsWith('image/')) {
      return { error: 'يجب اختيار صورة صالحة' };
    }
    if (file.size > 5 * 1024 * 1024) {
      return { error: 'حجم الصورة يجب أن لا يتجاوز 5 ميجابايت' };
    }
    
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      avatar_url = await uploadImage(buffer, 'db_avatars');
    } catch (e) {
      console.error('Avatar upload failed', e);
      return { error: 'حدث خطأ أثناء رفع الصورة' };
    }
  }

  const rawData = {
    display_name: formData.get('display_name') as string,
    bio: formData.get('bio') as string,
    show_on_leaderboard: formData.get('show_on_leaderboard') === 'on' || formData.get('show_on_leaderboard') === 'true',
  };

  const parsed = profileUpdateSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    const adminClient = await getPbAdminClient();
    
    // We update only allowed fields.
    // Notice that gameplay fields (power_level, streak, etc.) are strictly NOT updated here 
    // to prevent cheating.
    const updatePayload: Record<string, any> = {
      display_name: parsed.data.display_name,
      bio: parsed.data.bio,
      show_on_leaderboard: parsed.data.show_on_leaderboard,
    };
    
    if (avatar_url) {
      updatePayload.avatar_url = avatar_url;
    }

    await adminClient.collection('users').update(userId, updatePayload);
    
    revalidatePath('/profile');
    revalidatePath('/quiz/leaderboard');
    
    return { success: true };
  } catch (err: any) {
    console.error('Profile update PB error', err);
    return { error: 'حدث خطأ أثناء حفظ التحديثات' };
  }
}
