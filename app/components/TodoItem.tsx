'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Check, Trash2, Calendar, Flag, Pencil, X, Save } from 'lucide-react';
import { toggleTodo, deleteTodo, updateTodo } from '../../app/actions/todo';

// Prisma 모델 타입
interface TodoItemProps {
	todo: {
		id: string;
		title: string;
		description?: string | null;
		completed: boolean;
		priority: 'HIGH' | 'MEDIUM' | 'LOW';
		dueDate?: Date | null;
		createdAt: Date;
	};
}

type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export default function TodoItem({ todo }: TodoItemProps) {
	// --- 상태 관리 ---
	const [isEditing, setIsEditing] = useState(false);

	// 수정 모드용 상태
	const [editTitle, setEditTitle] = useState(todo.title);
	const [editDesc, setEditDesc] = useState(todo.description || '');
	const [editPriority, setEditPriority] = useState<Priority>(todo.priority);

	// [수정됨] 날짜만 추출 (YYYY-MM-DD)
	const initialDate = todo.dueDate
		? new Date(todo.dueDate).toISOString().split('T')[0]
		: '';
	const [editDueDate, setEditDueDate] = useState(initialDate);

	// --- 핸들러 ---
	const handleToggle = async () => {
		if (isEditing) return;
		await toggleTodo(todo.id, !todo.completed);
	};

	const handleDelete = async () => {
		if (confirm('정말 삭제하시겠습니까?')) {
			await deleteTodo(todo.id);
		}
	};

	const handleSave = async () => {
		if (!editTitle.trim()) return;

		await updateTodo(todo.id, {
			title: editTitle,
			description: editDesc || undefined,
			priority: editPriority,
			// 날짜 객체로 변환 (시간은 00:00:00이 됨)
			dueDate: editDueDate ? new Date(editDueDate) : undefined,
		});

		setIsEditing(false);
	};

	const handleCancel = () => {
		setEditTitle(todo.title);
		setEditDesc(todo.description || '');
		setEditPriority(todo.priority);
		setEditDueDate(initialDate);
		setIsEditing(false);
	};

	// --- 유틸 ---
	const priorityConfig = {
		HIGH: { color: 'text-red', bg: 'bg-red/10' },
		MEDIUM: { color: 'text-yellow', bg: 'bg-yellow/10' },
		LOW: { color: 'text-blue', bg: 'bg-blue/10' },
	};

	// 날짜 포맷팅 (시간 부분 제거)
	const formatDate = (date: Date) =>
		format(new Date(date), 'M월 d일 (eee)', { locale: ko });

	// --- 렌더링 ---
	return (
		<div
			className={`
        group flex items-start gap-3 p-4 rounded-2xl border transition-all duration-200 relative
        ${
					isEditing
						? 'bg-mainBg border-highlight/50 ring-1 ring-highlight/20 shadow-md z-10'
						: todo.completed
						? 'bg-subBg/10 border-transparent opacity-60'
						: 'bg-mainBg border-subBg hover:border-highlight/30 hover:shadow-sm'
				}
      `}
		>
			{/* 1. 체크박스 */}
			{!isEditing && (
				<button
					onClick={handleToggle}
					className={`
            mt-1 shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all
            ${
							todo.completed
								? 'bg-highlight border-highlight text-mainBg'
								: 'border-textSub hover:border-highlight'
						}
          `}
				>
					{todo.completed && (
						<Check
							className="w-3.5 h-3.5"
							strokeWidth={3}
						/>
					)}
				</button>
			)}

			{/* 2. 내용 영역 */}
			<div className="flex-1 min-w-0">
				{/* === [VIEW MODE] === */}
				{!isEditing ? (
					<>
						<div className="flex flex-wrap items-center gap-2 mb-1 pr-16">
							<h3
								className={`font-medium text-lg leading-tight truncate ${
									todo.completed
										? 'text-textSub line-through'
										: 'text-highlight'
								}`}
							>
								{todo.title}
							</h3>
							<span
								className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider ${
									priorityConfig[todo.priority].bg
								} ${priorityConfig[todo.priority].color}`}
							>
								<Flag
									className="w-3 h-3"
									fill="currentColor"
								/>
								{todo.priority}
							</span>
						</div>

						{todo.description && (
							<p className="text-sm text-textSub/80 mb-2 line-clamp-2 whitespace-pre-wrap">
								{todo.description}
							</p>
						)}

						<div className="flex items-center gap-3 text-xs text-textSub font-medium">
							{todo.dueDate && (
								<div
									className={`flex items-center gap-1 ${
										!todo.completed && new Date(todo.dueDate) < new Date()
											? 'text-red'
											: ''
									}`}
								>
									<Calendar className="w-3.5 h-3.5" />
									<span>{formatDate(todo.dueDate)}</span>
								</div>
							)}
						</div>
					</>
				) : (
					/* === [EDIT MODE] === */
					<div className="flex flex-col gap-3 w-full">
						{/* 제목 수정 */}
						<input
							type="text"
							value={editTitle}
							onChange={(e) => setEditTitle(e.target.value)}
							className="w-full bg-transparent border-b border-subBg focus:border-highlight outline-none text-lg font-medium text-highlight pb-1"
							placeholder="할 일 제목"
							autoFocus
						/>

						{/* 설명 수정 */}
						<textarea
							value={editDesc}
							onChange={(e) => setEditDesc(e.target.value)}
							className="w-full bg-subBg/20 rounded-lg p-2 text-sm text-textMain outline-none focus:ring-1 focus:ring-highlight/30 resize-none"
							rows={2}
							placeholder="상세 설명 (선택)"
						/>

						{/* 옵션 수정 */}
						<div className="flex flex-wrap items-center gap-2">
							{/* 우선순위 선택 */}
							<div className="flex bg-subBg/30 rounded-lg p-1 gap-1">
								{(['LOW', 'MEDIUM', 'HIGH'] as Priority[]).map((p) => (
									<button
										key={p}
										onClick={() => setEditPriority(p)}
										className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
											editPriority === p
												? `${priorityConfig[p].bg} ${priorityConfig[p].color} shadow-sm`
												: 'text-textSub hover:text-textMain'
										}`}
									>
										{p}
									</button>
								))}
							</div>

							{/* [수정됨] 날짜 선택 (type="date") */}
							<input
								type="date"
								value={editDueDate}
								onChange={(e) => setEditDueDate(e.target.value)}
								className="bg-subBg/30 text-textMain text-xs rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-highlight/30"
							/>
						</div>
					</div>
				)}
			</div>

			{/* 3. 액션 버튼들 */}
			<div
				className={`flex items-center gap-1 ${
					isEditing
						? 'self-start'
						: 'opacity-0 group-hover:opacity-100 transition-opacity'
				}`}
			>
				{!isEditing ? (
					<>
						<button
							onClick={() => setIsEditing(true)}
							className="p-2 text-textSub hover:text-highlight hover:bg-subBg rounded-lg transition-all"
							title="수정"
						>
							<Pencil className="w-4 h-4" />
						</button>
						<button
							onClick={handleDelete}
							className="p-2 text-textSub hover:text-red hover:bg-red/10 rounded-lg transition-all"
							title="삭제"
						>
							<Trash2 className="w-4 h-4" />
						</button>
					</>
				) : (
					<>
						<button
							onClick={handleSave}
							className="p-2 text-green hover:bg-greenBg rounded-lg transition-all"
							title="저장"
						>
							<Save className="w-4 h-4" />
						</button>
						<button
							onClick={handleCancel}
							className="p-2 text-textSub hover:text-red hover:bg-subBg rounded-lg transition-all"
							title="취소"
						>
							<X className="w-4 h-4" />
						</button>
					</>
				)}
			</div>
		</div>
	);
}
