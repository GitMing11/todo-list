'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
	Plus,
	Calendar,
	Flag,
	AlignLeft,
	ChevronDown,
	CalendarOff,
} from 'lucide-react';

type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

interface TodoFormData {
	title: string;
	description?: string;
	priority: Priority;
	dueDate?: Date;
}

interface TodoInputProps {
	onAdd: (data: TodoFormData) => void;
	placeholder?: string;
	className?: string;
}

export default function TodoInput({
	onAdd,
	placeholder = '할 일을 입력하고 엔터를 누르세요',
	className = '',
}: TodoInputProps) {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [priority, setPriority] = useState<Priority>('MEDIUM');
	const [dueDate, setDueDate] = useState<string>('');
	const [isExpanded, setIsExpanded] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);
	const dateInputRef = useRef<HTMLInputElement>(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (title.trim().length === 0) return;

		onAdd({
			title: title.trim(),
			description: description.trim() || undefined,
			priority,
			dueDate: dueDate ? new Date(dueDate) : undefined,
		});

		resetForm();
	};

	const resetForm = () => {
		setTitle('');
		setDescription('');
		setPriority('MEDIUM');
		setDueDate('');
		setIsExpanded(false);
	};

	// 날짜 초기화 (왼쪽 버튼)
	const clearDate = () => {
		setDueDate('');
	};

	// 날짜 선택창 열기 (오른쪽 버튼)
	const openDatePicker = () => {
		try {
			dateInputRef.current?.showPicker();
		} catch {
			dateInputRef.current?.focus();
		}
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				if (!title.trim() && !description.trim() && !dueDate) {
					setIsExpanded(false);
				}
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [title, description, dueDate]);

	const toggleExpand = () => setIsExpanded(!isExpanded);

	const priorityConfig = {
		HIGH: {
			label: '높음',
			color: 'text-red',
			bg: 'bg-red/10',
			ring: 'ring-red-500/30',
		},
		MEDIUM: {
			label: '보통',
			color: 'text-yellow-500',
			bg: 'bg-yellow-500/10',
			ring: 'ring-yellow-500/30',
		},
		LOW: {
			label: '낮음',
			color: 'text-blue',
			bg: 'bg-blue-500/10',
			ring: 'ring-blue-500/30',
		},
	};

	return (
		<div
			ref={containerRef}
			className={`w-full transition-all duration-300 ${className}`}
		>
			<div
				className={`
          group relative w-full bg-mainBg border border-subBg
          transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
          ${
						isExpanded
							? 'rounded-3xl shadow-xl ring-2 ring-highlight/20 border-highlight/50'
							: 'rounded-2xl shadow-sm hover:shadow-md hover:border-highlight/40'
					}
        `}
			>
				{/* 상단 입력 영역 */}
				<form
					onSubmit={handleSubmit}
					className="relative z-20"
				>
					<div className="relative flex items-center">
						<input
							type="text"
							value={title}
							onFocus={() => setIsExpanded(true)}
							onChange={(e) => setTitle(e.target.value)}
							className={`
                w-full pl-6 pr-32 py-5 bg-transparent outline-none 
                text-lg text-highlight placeholder:text-textSub/50 font-medium 
                transition-all duration-300
                ${isExpanded ? 'bg-transparent' : ''}
              `}
							placeholder={placeholder}
						/>

						<div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
							<button
								type="button"
								onClick={toggleExpand}
								className={`
                  p-2 text-textSub/70 hover:text-highlight hover:bg-subBg/50 rounded-xl 
                  transition-all duration-300 
                  ${isExpanded ? 'rotate-180 bg-subBg/30 text-highlight' : ''}
                `}
							>
								<ChevronDown className="w-5 h-5" />
							</button>

							<button
								type="submit"
								disabled={!title.trim()}
								className={`
                  flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ease-out
                  ${
										title.trim()
											? 'bg-highlight text-mainBg hover:scale-105 hover:shadow-lg hover:shadow-highlight/20 cursor-pointer'
											: 'bg-subBg text-textSub/50 cursor-not-allowed'
									}
                `}
							>
								<Plus
									className="w-6 h-6"
									strokeWidth={2.5}
								/>
							</button>
						</div>
					</div>
				</form>

				{/* 하단 옵션 패널 */}
				<div
					className={`
            overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
            ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
          `}
				>
					<div className="bg-subBg/20 border-t border-subBg/50 backdrop-blur-[2px] rounded-b-3xl">
						<div className="px-6 py-5 flex flex-col gap-5">
							<div className="flex gap-4 group/desc">
								<AlignLeft className="w-5 h-5 text-textSub group-focus-within/desc:text-highlight transition-colors mt-1" />
								<textarea
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									placeholder="메모를 추가하세요..."
									className="w-full bg-transparent outline-none text-textMain resize-none h-16 placeholder:text-textSub/50 text-[15px] leading-relaxed"
								/>
							</div>

							{/* 하단 툴바 */}
							<div className="flex flex-wrap items-center justify-between gap-4 pt-2">
								{/* [날짜 선택 UI] */}
								<div className="flex items-center bg-mainBg border border-subBg rounded-xl p-1 gap-1 shadow-sm">
									{/* 왼쪽 버튼: 기한 없음 (초기화) */}
									<button
										type="button"
										onClick={clearDate}
										className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                      ${
												!dueDate
													? 'bg-subBg text-textMain shadow-sm' // 활성화 상태 (날짜 없음)
													: 'text-textSub hover:text-textMain hover:bg-subBg/50' // 비활성화 상태
											}
                    `}
									>
										<CalendarOff className="w-3.5 h-3.5" />
									</button>

									{/* 오른쪽 버튼: 날짜 선택 (Calendar) */}
									<button
										type="button"
										onClick={openDatePicker}
										className={`
                      relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                      ${
												dueDate
													? 'bg-mainBg text-highlight shadow-sm ring-1 ring-highlight/30' // 활성화 상태 (날짜 있음)
													: 'text-textSub hover:text-textMain hover:bg-subBg/50' // 비활성화 상태
											}
                    `}
									>
										<Calendar className="w-3.5 h-3.5" />
										<span>{dueDate || '날짜 선택'}</span>

										<input
											ref={dateInputRef}
											type="date"
											value={dueDate}
											onChange={(e) => setDueDate(e.target.value)}
											className="absolute inset-0 w-full h-full opacity-0 cursor-pointer pointer-events-none"
											tabIndex={-1}
										/>
									</button>
								</div>

								{/* [우선순위 선택 UI] */}
								<div className="flex items-center bg-mainBg border border-subBg rounded-xl p-1 gap-1 shadow-sm">
									{(['LOW', 'MEDIUM', 'HIGH'] as Priority[]).map((p) => {
										const config = priorityConfig[p];
										const isSelected = priority === p;
										return (
											<button
												key={p}
												type="button"
												onClick={() => setPriority(p)}
												className={`
                          flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                          ${
														isSelected
															? `bg-mainBg ${config.color} shadow-sm ring-1 ${config.ring}`
															: 'text-textSub hover:text-textMain hover:bg-subBg/50'
													}
                        `}
											>
												<Flag
													className={`w-3.5 h-3.5 ${
														isSelected ? 'fill-current' : ''
													}`}
												/>
												{config.label}
											</button>
										);
									})}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
