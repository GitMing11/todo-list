// app/calendar/page.tsx
import React from 'react';
import { getTodos } from '../../actions/todo';
import CalendarView from '../../components/CalendarView';

export const metadata = {
	title: '캘린더 - Todo App',
	description: '월별 일정과 할 일을 확인합니다.',
};

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
	// 데이터가 많아지면 월별 조회 API를 따로 만드는 게 좋음
	// 현재 규모에선 전체 조회 후 클라이언트 필터링이 반응성이 더 좋음
	const todos = await getTodos();

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 px-4 py-8 md:px-8 md:py-12">
				<div className="max-w-4xl mx-auto">
					<CalendarView todos={todos} />
				</div>
			</main>
		</div>
	);
}
