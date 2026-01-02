// app/actions/todo.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// 1. 할 일 가져오기
export async function getTodos() {
  return await prisma.todo.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

// 2. 할 일 추가하기
export async function createTodo(title: string) {
  try {
    await prisma.todo.create({
      data: {
        title,
        completed: false,
      },
    });
    // 데이터가 변경되었음을 알리고 페이지 갱신
    revalidatePath('/'); 
    revalidatePath('/home');
  } catch (error) {
    console.error('Failed to create todo:', error);
  }
}

// 3. 통계 데이터 가져오기 (대시보드용)
export async function getTodoStats() {
  const total = await prisma.todo.count();
  const completed = await prisma.todo.count({ where: { completed: true } });
  const ongoing = total - completed;
  
  // '급한 일'은 로직에 따라 다를 수 있으나, 여기선 예시로 최근 24시간 내 생성된 미완료 작업으로 가정
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const urgent = await prisma.todo.count({
    where: {
      completed: false,
      createdAt: { lt: yesterday } // 하루가 지난 미완료 작업 등
    }
  });

  return { ongoing, completed, urgent };
}