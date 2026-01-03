// app/actions/todo.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

function revalidateTodos() {
  revalidatePath('/');
  revalidatePath('/home');
  revalidatePath('/all');
  revalidatePath('/today');
  revalidatePath('/completed');
  revalidatePath('/user');
}

// 1. 할 일 가져오기
export async function getTodos() {
  const todos = await prisma.todo.findMany({
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
  priority: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM', 
  dueDate?: Date
) {
  try {
    await prisma.todo.create({
      data: {
        title,
        priority,
        dueDate,
        completed: false,
        // userId: ... (나중에 로그인 구현 시 추가)
      },
    });
    revalidateTodos();
  } catch (error) {
    console.error('Failed to create todo:', error);
  }
}

// 3. 통계 데이터 가져오기 (대시보드용)
export async function getTodoStats() {
  // 1. 오늘 날짜의 시작 시점(00:00:00) 구하기
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // 2. 진행 중인 일 (날짜 상관없이 미완료된 전체 작업)
  const ongoing = await prisma.todo.count({ 
    where: { completed: false } 
  });
  
  // 3. [수정됨] 오늘 완료한 일
  // 조건: completed가 true이면서, updatedAt(수정일)이 오늘 0시 이후인 것
  const completed = await prisma.todo.count({
    where: {
      completed: true,
      updatedAt: {
        gte: todayStart, // gte: greater than or equal (크거나 같다)
      }
    }
  });
  
  // 4. 급한 일 (미완료 + HIGH 우선순위)
  const urgent = await prisma.todo.count({
    where: {
      completed: false,
      priority: 'HIGH'
    }
  });

  return { ongoing, completed, urgent };
}

// 4. 할 일 완료 상태 토글
export async function toggleTodo(id: string, completed: boolean) {
  try {
    await prisma.todo.update({
      where: { id },
      data: { completed },
    });
    revalidateTodos();
  } catch (error) {
    console.error('Failed to toggle todo:', error);
  }
}

// 5. 할 일 삭제
export async function deleteTodo(id: string) {
  try {
    await prisma.todo.delete({
      where: { id },
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
  try {
    await prisma.todo.update({
      where: { id },
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
  return await prisma.todo.findMany({
    where: { completed: true },
    orderBy: { updatedAt: 'desc' }, // 최근에 완료한 것부터 보이게
  });
}

export async function resetTodos() {
  try {
    await prisma.todo.deleteMany({});
    revalidateTodos();
  } catch (error) {
    console.error('Failed to reset todos:', error);
  }
}