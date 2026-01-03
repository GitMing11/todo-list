// app/all/page.tsx
import React from 'react';
import { getTodos } from '../actions/todo';
import TodoItem from '../components/TodoItem';
import { Layers, ListChecks } from 'lucide-react';

// 페이지 메타데이터
export const metadata = {
	title: '전체 할 일 - Todo App',
	description: '모든 할 일 목록을 확인합니다.',
};

// 동적 렌더링 설정 (항상 최신 데이터 fetch)
export const dynamic = 'force-dynamic';

export default async function AllTodosPage() {
	const todos = await getTodos();

	const activeTodos = todos.filter((t) => !t.completed);
	const completedTodos = todos.filter((t) => t.completed);

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 px-4 py-8 md:px-8 md:py-12">
				<div className="max-w-3xl mx-auto space-y-8">
					{/* 페이지 헤더 */}
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-3xl font-bold text-highlight flex items-center gap-2">
								<Layers className="w-8 h-8" />
								전체 보기
							</h2>
							<p className="text-textSub mt-1">
								총{' '}
								<span className="text-highlight font-bold">{todos.length}</span>
								개의 할 일이 있습니다.
							</p>
						</div>
					</div>

					{/* 할 일이 없을 때 표시 */}
					{todos.length === 0 && (
						<div className="py-20 text-center flex flex-col items-center justify-center text-textSub/50">
							<ListChecks className="w-16 h-16 mb-4 opacity-50" />
							<p className="text-lg">등록된 할 일이 없습니다.</p>
							<p className="text-sm mt-2">새로운 작업을 추가해보세요!</p>
						</div>
					)}

					{/* 진행 중인 할 일 목록 */}
					{activeTodos.length > 0 && (
						<section className="space-y-4">
							<h3 className="text-sm font-bold text-textSub uppercase tracking-wider pl-1">
								진행 중 ({activeTodos.length})
							</h3>
							<div className="flex flex-col gap-3">
								{activeTodos.map((todo) => (
									<TodoItem
										key={todo.id}
										todo={todo}
									/>
								))}
							</div>
						</section>
					)}

					{/* 완료된 할 일 목록 */}
					{completedTodos.length > 0 && (
						<section className="space-y-4 pt-4">
							<h3 className="text-sm font-bold text-textSub uppercase tracking-wider pl-1">
								완료됨 ({completedTodos.length})
							</h3>
							<div className="flex flex-col gap-3">
								{completedTodos.map((todo) => (
									<TodoItem
										key={todo.id}
										todo={todo}
									/>
								))}
							</div>
						</section>
					)}
				</div>
			</main>
		</div>
	);
}
