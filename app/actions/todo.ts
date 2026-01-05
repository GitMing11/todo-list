// app/actions/todo.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/app/auth';

// --- Helper Functions ---

/**
 * 현재 로그인한 유저의 ID 반환
 * 로그인하지 않은 경우 null 반환
 */
async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user.id;
}

/**
 * 변경 사항이 있는 모든 경로의 캐시 갱신
 */
function revalidateTodos() {
  const paths = ['/', '/home', '/all', '/today', '/completed', '/user'];
  paths.forEach((path) => revalidatePath(path));
}

// --- Server Actions ---
// 1. 할 일 가져오기
export async function getTodos() {const userId = await getUserId();
  if (!userId) return [];

  const todos = await prisma.todo.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  // "급한 순" 정렬
  // 로직: 
  // 1. 마감일이 있는 것이 없는 것보다 위에 옴
  // 2. 둘 다 마감일이 있으면, 날짜가 빠른 순서대로 (오름차순)
  // 3. 그 외에는 생성일 최신순 유지
  return todos.sort((a, b) => {
    // a만 마감일이 있으면 -> a를 앞으로 (-1)
    if (a.dueDate && !b.dueDate) return -1;
    
    // b만 마감일이 있으면 -> b를 앞으로 (1)
    if (!a.dueDate && b.dueDate) return 1;

    // 둘 다 마감일이 있으면 -> 날짜 비교 (오름차순: 이른 날짜가 위로)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }

    // 둘 다 마감일이 없으면 -> 원래 순서(생성일 내림차순) 유지
    return 0;
  });
}

// 2. 할 일 추가하기
export async function createTodo(
  title: string,
  description?: string,
  priority: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM',
  dueDate?: Date
) {
  const userId = await getUserId();
  if (!userId) throw new Error('로그인이 필요합니다.');

  try {
    await prisma.todo.create({
      data: {
        title,
        description,
        priority,
        dueDate,
        completed: false,
        userId,
      },
    });
    revalidateTodos();
  } catch (error) {
    console.error('Failed to create todo:', error);
  }
}

// 3. 통계 데이터 가져오기 (대시보드용)
export async function getTodoStats() {
  const userId = await getUserId();
  if (!userId) return { ongoing: 0, completed: 0, urgent: 0 };

  // 1. 오늘 날짜의 시작 시점(00:00:00) 구하기
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
// Promise.all을 사용하여 3개의 쿼리를 병렬로 실행 (속도 향상)
  const [ongoing, completed, urgent] = await Promise.all([
    // 1. 진행 중인 일 (날짜 상관없이 미완료된 전체 작업)
    prisma.todo.count({
      where: { completed: false, userId },
    }),
    // 2. 오늘 완료한 일
    // 조건: completed가 true이면서, updatedAt(수정일)이 오늘 0시 이후인 것
    prisma.todo.count({
      where: {
        completed: true,
        updatedAt: { gte: todayStart }, // gte: greater than or equal (크거나 같다)
        userId,
      },
    }),
    // 3. 급한 일 (미완료 + HIGH 우선순위)
    prisma.todo.count({
      where: { completed: false, priority: 'HIGH', userId },
    }),
  ]);

  return { ongoing, completed, urgent };
}

// 4. 할 일 완료 상태 토글
export async function toggleTodo(id: string, completed: boolean) {
  const userId = await getUserId();
  if (!userId) return;

  try {
    await prisma.todo.update({
      where: { id, userId },
      data: { completed },
    });
    revalidateTodos();
  } catch (error) {
    console.error('Failed to toggle todo:', error);
  }
}

// 5. 할 일 삭제
export async function deleteTodo(id: string) {
  const userId = await getUserId();
  if (!userId) return;

  try {
    await prisma.todo.delete({
      where: { id, userId },
    });
    revalidateTodos();
  } catch (error) {
    console.error('Failed to delete todo:', error);
  }
}

// 6. 할 일 내용 수정
export async function updateTodo(
  id: string,
  data: {
    title: string;
    description?: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    dueDate?: Date;
  }
) {
  const userId = await getUserId();
  if (!userId) return;

  try {
    await prisma.todo.update({
      where: { id, userId },
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate,
      },
    });
    revalidateTodos();
  } catch (error) {
    console.error('Failed to update todo:', error);
  }
}

export async function getCompletedTodos() {
  const userId = await getUserId();
  if (!userId) return [];

  return await prisma.todo.findMany({
    where: { completed: true, userId },
    orderBy: { updatedAt: 'desc' }, // 최근에 완료한 것부터 보이게
  });
}

export async function resetTodos() {
  const userId = await getUserId();
  if (!userId) return;

  try {
    await prisma.todo.deleteMany({
      where: { userId },
    });
    revalidateTodos();
  } catch (error) {
    console.error('Failed to reset todos:', error);
  }
}