'use client';

import React, { useState } from 'react';
import {
	format,
	addMonths,
	subMonths,
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	eachDayOfInterval,
	isSameMonth,
	isSameDay,
	isToday,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import {
	ChevronLeft,
	ChevronRight,
	Calendar as CalendarIcon,
} from 'lucide-react';
import TodoItem from './TodoItem';

// Todo 타입 정의 (필요한 필드만)
interface Todo {
	id: string;
	title: string;
	description?: string | null;
	completed: boolean;
	priority: 'HIGH' | 'MEDIUM' | 'LOW';
	dueDate?: Date | null;
	createdAt: Date;
}

interface CalendarViewProps {
	todos: Todo[];
}

export default function CalendarView({ todos }: CalendarViewProps) {
	// 상태: 현재 보고 있는 월, 선택된 날짜
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState(new Date());

	// --- 1. 달력 데이터 계산 ---
	const monthStart = startOfMonth(currentMonth);
	const monthEnd = endOfMonth(monthStart);
	const startDate = startOfWeek(monthStart); // 달력의 시작 (이전 달의 날짜 포함)
	const endDate = endOfWeek(monthEnd); // 달력의 끝 (다음 달의 날짜 포함)

	const calendarDays = eachDayOfInterval({
		start: startDate,
		end: endDate,
	});

	// --- 2. 핸들러 ---
	const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
	const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

	const onDateClick = (day: Date) => {
		setSelectedDate(day);
		// 다른 달의 날짜를 누르면 달력도 이동
		if (!isSameMonth(day, monthStart)) {
			setCurrentMonth(day);
		}
	};

	// --- 3. 데이터 필터링 ---
	// 선택된 날짜의 할 일 목록
	const selectedTodos = todos.filter((todo) => {
		if (!todo.dueDate) return false;
		return isSameDay(new Date(todo.dueDate), selectedDate);
	});

	// 날짜별 할 일 존재 여부 확인 (점 표시용)
	const getTodosForDay = (day: Date) => {
		return todos.filter((todo) => {
			if (!todo.dueDate) return false;
			return isSameDay(new Date(todo.dueDate), day);
		});
	};

	// 우선순위 색상 매핑
	const dotColor = {
		HIGH: 'bg-red-500',
		MEDIUM: 'bg-yellow-500',
		LOW: 'bg-blue-500',
	};

	return (
		<div className="flex flex-col gap-8">
			{/* === 캘린더 영역 === */}
			<div className="bg-mainBg border border-subBg rounded-3xl p-6 shadow-sm">
				{/* 헤더: 월 이동 */}
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-bold text-highlight flex items-center gap-2">
						{format(currentMonth, 'yyyy년 M월', { locale: ko })}
					</h2>
					<div className="flex gap-2">
						<button
							onClick={prevMonth}
							className="p-2 hover:bg-subBg rounded-full transition-colors"
						>
							<ChevronLeft className="w-5 h-5 text-textSub" />
						</button>
						<button
							onClick={() => setCurrentMonth(new Date())}
							className="text-xs font-bold text-textSub hover:bg-subBg px-3 py-1 rounded-full transition-colors"
						>
							오늘
						</button>
						<button
							onClick={nextMonth}
							className="p-2 hover:bg-subBg rounded-full transition-colors"
						>
							<ChevronRight className="w-5 h-5 text-textSub" />
						</button>
					</div>
				</div>

				{/* 요일 헤더 */}
				<div className="grid grid-cols-7 mb-2">
					{['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
						<div
							key={day}
							className={`text-center text-xs font-semibold py-2 ${
								i === 0 ? 'text-red-400' : 'text-textSub'
							}`}
						>
							{day}
						</div>
					))}
				</div>

				{/* 날짜 그리드 */}
				<div className="grid grid-cols-7 gap-1">
					{calendarDays.map((day, dayIdx) => {
						const dayTodos = getTodosForDay(day);
						// 우선순위가 높은 순서대로 최대 3개 점 표시
						const dots = dayTodos
							.sort((a, b) => (a.priority === 'HIGH' ? -1 : 1))
							.slice(0, 3);

						const isSelected = isSameDay(day, selectedDate);
						const isCurrentMonth = isSameMonth(day, monthStart);
						const isTodayDate = isToday(day);

						return (
							<div
								key={day.toString()}
								onClick={() => onDateClick(day)}
								className={`
                  relative h-20 md:h-24 rounded-xl flex flex-col items-center pt-2 cursor-pointer transition-all border border-transparent
                  ${
										!isCurrentMonth
											? 'bg-subBg/10 text-textSub/30'
											: 'bg-transparent text-textMain'
									}
                  ${
										isSelected
											? 'bg-subBg/30 border-highlight/30 shadow-inner'
											: 'hover:bg-subBg/20'
									}
                `}
							>
								{/* 날짜 숫자 */}
								<span
									className={`
                    w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-1
                    ${
											isTodayDate
												? 'bg-highlight text-mainBg font-bold shadow-md'
												: ''
										}
                    ${
											!isTodayDate && isSelected
												? 'text-highlight font-bold'
												: ''
										}
                  `}
								>
									{format(day, 'd')}
								</span>

								{/* 할 일 점 (Dots) */}
								<div className="flex gap-1 mt-1">
									{dots.map((todo) => (
										<div
											key={todo.id}
											className={`w-1.5 h-1.5 rounded-full ${
												dotColor[todo.priority]
											}`}
										/>
									))}
									{dayTodos.length > 3 && (
										<div className="w-1.5 h-1.5 rounded-full bg-textSub/50" />
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* === 선택된 날짜의 목록 영역 === */}
			<section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
				<div className="flex items-center gap-2 px-1">
					<CalendarIcon className="w-5 h-5 text-highlight" />
					<h3 className="text-lg font-bold text-highlight">
						{format(selectedDate, 'M월 d일 EEEE', { locale: ko })}
					</h3>
					<span className="text-sm text-textSub bg-subBg/30 px-2 py-0.5 rounded-md">
						{selectedTodos.length}개
					</span>
				</div>

				{selectedTodos.length > 0 ? (
					<div className="flex flex-col gap-3">
						{selectedTodos.map((todo) => (
							<TodoItem
								key={todo.id}
								todo={todo}
							/>
						))}
					</div>
				) : (
					<div className="py-12 text-center border border-dashed border-subBg rounded-2xl text-textSub/50">
						<p>이 날은 일정이 없습니다.</p>
					</div>
				)}
			</section>
		</div>
	);
}
