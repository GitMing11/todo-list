'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/app/auth';
import { revalidatePath } from 'next/cache';


function revalidateUser() {
  const paths = ['/', '/home', '/all', '/today', '/completed', '/user', 'layout'];
  paths.forEach((path) => revalidatePath(path));
}

// 사용자 알림 설정 업데이트
export async function updateNotificationSettings(
  priority: 'HIGH' | 'MEDIUM' | 'LOW',
  days: number
) {
  const session = await auth();
  if (!session?.user?.id) return;

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        notifyPriority: priority,
        notifyDays: days,
      },
    });
    revalidateUser();
  } catch (error) {
    console.error('Failed to update notification settings:', error);
  }
}

// 사용자 설정 가져오기
export async function getUserSettings() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { notifyPriority: true, notifyDays: true },
  });
  return user;
}