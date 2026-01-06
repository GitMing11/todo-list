// app/completed/page.tsx
import React from 'react';
import { getCompletedTodos } from '../../actions/todo';
import TodoItem from '../../components/TodoItem';
import { CheckCircle2, Trophy } from 'lucide-react';

export const metadata = {
	title: '완료한 일 - Todo App',
	description: '지금까지 완료한 작업 목록입니다.',
};

export const dynamic = 'force-dynamic';

export default async function CompletedPage() {
	const todos = await getCompletedTodos();

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 px-4 py-8 md:px-8 md:py-12">
				<div className="max-w-4xl mx-auto space-y-8">
					{/* 페이지 헤더 */}
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-3xl font-bold text-highlight flex items-center gap-2">
								<CheckCircle2 className="w-8 h-8 text-green" />
								완료한 일
							</h2>
							<p className="text-textSub mt-1">
								지금까지 총{' '}
								<span className="text-green font-bold">{todos.length}</span>
								개의 일을 해냈어요! 🎉
							</p>
						</div>
					</div>

					{/* 완료 목록이 없을 때 (Empty State) */}
					{todos.length === 0 && (
						<div className="py-20 text-center flex flex-col items-center justify-center text-textSub/50">
							<Trophy className="w-16 h-16 mb-4 opacity-30" />
							<p className="text-lg">아직 완료된 작업이 없습니다.</p>
							<p className="text-sm mt-2">오늘 할 일을 하나씩 끝내보세요!</p>
						</div>
					)}

					{/* 리스트 */}
					{todos.length > 0 && (
						<div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
							{todos.map((todo) => (
								<TodoItem
									key={todo.id}
									todo={todo}
								/>
							))}
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
