'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import TodoItem from '../TodoItem';
import { getTodosByFilter } from '@/app/actions/todo';
import { StatItem } from './StatsSection';

interface StatDetailModalProps {
	stat: StatItem;
	onClose: () => void;
}

export default function StatDetailModal({
	stat,
	onClose,
}: StatDetailModalProps) {
	const [todos, setTodos] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchTodos = async () => {
			setIsLoading(true);
			try {
				const data = await getTodosByFilter(
					stat.id as 'ongoing' | 'completed' | 'urgent'
				);
				setTodos(data);
			} catch (error) {
				console.error('Failed to load todos:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchTodos();
	}, [stat.id]);

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-subBg/60 backdrop-blur-sm p-4 animate-fade-in"
			onClick={handleBackdropClick}
		>
			<div className="bg-mainBg w-full max-w-sm md:max-w-md rounded-2xl border border-subBg shadow-2xl overflow-hidden transform transition-all flex flex-col max-h-[60vh]">
				{/* Header */}
				<div className="flex items-center justify-between p-5 border-b border-subBg shrink-0">
					<h3 className="text-xl font-bold text-highlight flex items-center gap-3">
						<div
							className={`p-2 rounded-full ${stat.colorClass} bg-opacity-20`}
						>
							{stat.icon}
						</div>
						{stat.label} 상세 보기
					</h3>
					<button
						onClick={onClose}
						className="p-2 text-textSub hover:bg-subBg hover:text-highlight rounded-full transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Body */}
				<div className="p-6 flex-1 overflow-y-auto min-h-50">
					{isLoading ? (
						<div className="h-40 flex items-center justify-center text-textSub">
							불러오는 중...
						</div>
					) : todos.length > 0 ? (
						<div className="space-y-3">
							{todos.map((todo) => (
								<TodoItem
									key={todo.id}
									todo={todo}
								/>
							))}
						</div>
					) : (
						<div className="h-40 flex flex-col items-center justify-center text-textSub bg-subBg/10 rounded-xl">
							<p className="mb-2">해당하는 항목이 없습니다.</p>
							<p className="text-sm opacity-70">새로운 작업을 추가해보세요!</p>
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="p-4 border-t border-subBg bg-subBg/10 flex justify-end shrink-0">
					<button
						onClick={onClose}
						className="px-5 py-2.5 text-highlight font-medium rounded-xl hover:opacity-90 transition-all active:scale-95"
					>
						확인
					</button>
				</div>
			</div>
		</div>
	);
}
