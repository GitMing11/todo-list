import React from 'react';
import { getTodos } from '../actions/todo';
import TodoItem from '../components/TodoItem';
import { CalendarCheck, AlertCircle, CheckCircle2, Coffee } from 'lucide-react';
import { isSameDay, isBefore, startOfDay } from 'date-fns';

// 페이지 메타데이터
export const metadata = {
	title: '오늘의 할 일 - Todo App',
	description: '오늘 마감인 작업과 밀린 작업을 확인합니다.',
};

// 항상 최신 데이터 로드
export const dynamic = 'force-dynamic';

export default async function TodayPage() {
	// 모든 할 일 가져오기 (이미 정렬된 상태)
	const allTodos = await getTodos();

	// 기준 시간 (오늘 0시 0분 0초)
	// 서버 시간 기준이므로 배포 환경에 따라 UTC일 수 있음.
	const today = startOfDay(new Date());

	// 1. [지연됨] 마감일이 지났는데 아직 안 한 일 (Overdue)
	const overdueTodos = allTodos.filter((todo) => {
		if (todo.completed || !todo.dueDate) return false;
		// 비교를 위해 시간 부분 제거 (날짜만 비교)
		const due = startOfDay(new Date(todo.dueDate));
		return isBefore(due, today);
	});

	// 2. [오늘 할 일] 마감일이 오늘인 미완료 작업
	const todayTodos = allTodos.filter((todo) => {
		if (todo.completed || !todo.dueDate) return false;
		const due = startOfDay(new Date(todo.dueDate));
		return isSameDay(due, today);
	});

	// 3. [오늘 완료] 완료된 작업 중 수정일(완료일)이 오늘인 것
	const completedTodayTodos = allTodos.filter((todo) => {
		if (!todo.completed) return false;
		// updatedAt 기준으로 오늘 완료된 것 판단
		const updated = startOfDay(new Date(todo.updatedAt));
		// 오늘 이후에 업데이트 된 것 (오늘 0시 포함)
		return updated >= today;
	});

	const isEmpty =
		overdueTodos.length === 0 &&
		todayTodos.length === 0 &&
		completedTodayTodos.length === 0;

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 px-4 py-8 md:px-8 md:py-12">
				<div className="max-w-3xl mx-auto space-y-10">
					{/* 페이지 헤더 */}
					<div className="flex flex-col gap-2">
						<h2 className="text-3xl font-bold text-highlight flex items-center gap-2">
							<CalendarCheck className="w-8 h-8 text-blue-500" />
							오늘의 할 일
						</h2>
						<p className="text-textSub">
							오늘 처리해야 할 작업{' '}
							<span className="text-highlight font-bold">
								{todayTodos.length + overdueTodos.length}
							</span>
							개가 남아있습니다.
						</p>
					</div>

					{/* 데이터가 아예 없을 때 */}
					{isEmpty && (
						<div className="py-20 text-center flex flex-col items-center justify-center text-textSub/50 animate-in fade-in zoom-in duration-500">
							<Coffee className="w-20 h-20 mb-4 opacity-50 stroke-1" />
							<p className="text-xl font-medium text-textSub">
								오늘은 일정이 없네요!
							</p>
							<p className="text-sm mt-2">
								여유로운 하루를 보내거나 새로운 목표를 세워보세요.
							</p>
						</div>
					)}

					{/* 1. 지연된 작업 (경고 표시) */}
					{overdueTodos.length > 0 && (
						<section className="space-y-4 animate-in slide-in-from-bottom-2 duration-500">
							<div className="flex items-center gap-2 text-red-500 bg-red-500/10 px-4 py-3 rounded-xl border border-red-500/20">
								<AlertCircle className="w-5 h-5 shrink-0" />
								<h3 className="font-bold text-sm">
									기한이 지난 일 ({overdueTodos.length})
								</h3>
							</div>
							<div className="flex flex-col gap-3">
								{overdueTodos.map((todo) => (
									<TodoItem
										key={todo.id}
										todo={todo}
									/>
								))}
							</div>
						</section>
					)}

					{/* 2. 오늘 마감인 작업 */}
					{todayTodos.length > 0 && (
						<section className="space-y-4 animate-in slide-in-from-bottom-4 duration-500 delay-100">
							<h3 className="text-sm font-bold text-textSub uppercase tracking-wider pl-1">
								오늘 마감 ({todayTodos.length})
							</h3>
							<div className="flex flex-col gap-3">
								{todayTodos.map((todo) => (
									<TodoItem
										key={todo.id}
										todo={todo}
									/>
								))}
							</div>
						</section>
					)}

					{/* 3. 오늘 완료한 작업 */}
					{completedTodayTodos.length > 0 && (
						<section className="space-y-4 pt-4 animate-in slide-in-from-bottom-6 duration-500 delay-200">
							<h3 className="text-sm font-bold text-textSub uppercase tracking-wider pl-1 flex items-center gap-2">
								<CheckCircle2 className="w-4 h-4 text-green-500" />
								오늘 완료함 ({completedTodayTodos.length})
							</h3>
							<div className="flex flex-col gap-3">
								{completedTodayTodos.map((todo) => (
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
