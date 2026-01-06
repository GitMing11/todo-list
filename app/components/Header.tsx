'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
	Search,
	Bell,
	Sun,
	Moon,
	User,
	AlertCircle,
	Clock,
	Flame,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getNotificationTodos } from '@/app/actions/todo';

// User 타입 정의
type UserProps = {
	name?: string | null;
	image?: string | null;
};

// Props 인터페이스 정의
interface HeaderProps {
	user?: UserProps;
}

export default function Header({ user }: HeaderProps) {
	const { isDarkMode, toggleTheme } = useTheme();
	const pathname = usePathname();

	// 알림 관련 상태
	const [notifications, setNotifications] = useState<any[]>([]);
	const [showNotifications, setShowNotifications] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// 알림 데이터 불러오기
	const fetchNotifications = async () => {
		if (user) {
			const data = await getNotificationTodos();
			setNotifications(data);
		}
	};

	useEffect(() => {
		fetchNotifications();
	}, [user, pathname]);

	// 외부 클릭 시 드롭다운 닫기
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setShowNotifications(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const today = new Date().toLocaleDateString('ko-KR', {
		month: 'long',
		day: 'numeric',
		weekday: 'long',
	});

	const navItems = [
		{ name: '오늘', href: '/today' },
		{ name: '전체', href: '/all' },
		{ name: '완료', href: '/completed' },
		{ name: '캘린더', href: '/calendar' },
	];

	return (
		<header className="sticky top-0 z-50 bg-mainBg text-highlight shadow-sm border-b border-subBg/50 transition-colors duration-300">
			<div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
				{/* 1. Left: 로고 (클릭 시 홈으로) */}
				<Link
					href="/"
					className="flex flex-col justify-center hover:opacity-80 transition-opacity cursor-pointer"
				>
					<h1 className="text-xl font-bold tracking-tight flex items-center gap-2 text-highlight">
						Todo
					</h1>
					<span className="text-xs font-medium mt-0.5 text-textSub">
						{today}
					</span>
				</Link>

				{/* 2. Center: 네비게이션 */}
				<nav className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
					<ul className="flex items-center gap-1 text-sm bg-subBg/20 p-1 rounded-full border border-subBg/30 backdrop-blur-sm">
						{navItems.map((item) => {
							const isActive = pathname === item.href;

							return (
								<li key={item.name}>
									<Link
										href={item.href}
										className={`block px-4 py-1.5 rounded-full transition-all duration-200
                                            ${
																							isActive
																								? 'bg-subBg font-bold text-highlight shadow-sm' // 활성 상태 스타일
																								: 'hover:bg-subBg/50 text-textSub hover:text-highlight font-medium' // 비활성 상태 스타일
																						}
                                        `}
									>
										{item.name}
									</Link>
								</li>
							);
						})}
					</ul>
				</nav>

				{/* 3. Right: 유틸리티 버튼 */}
				<div className="flex items-center gap-2">
					{/* <button className="p-2 rounded-full hover:bg-subBg transition-colors text-textSub hover:text-highlight">
						<Search className="w-5 h-5" />
					</button> */}

					<button
						onClick={toggleTheme}
						className="p-2 rounded-full hover:bg-subBg transition-colors text-textSub hover:text-highlight"
					>
						{isDarkMode ? (
							<Sun className="w-5 h-5" />
						) : (
							<Moon className="w-5 h-5" />
						)}
					</button>

					{/* 알림 버튼 */}
					<div
						className="relative"
						ref={dropdownRef}
					>
						<button
							onClick={() => setShowNotifications(!showNotifications)}
							className="p-2 rounded-full hover:bg-subBg transition-colors text-textSub hover:text-highlight relative"
						>
							<Bell className="w-5 h-5" />
							{notifications.length > 0 && (
								<span className="absolute top-0.5 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red text-[10px] text-white font-bold border-2 border-mainBg">
									{notifications.length > 9 ? '9+' : notifications.length}
								</span>
							)}
						</button>

						{/* 알림 드롭다운 */}
						{showNotifications && (
							<div className="absolute right-0 mt-2 w-80 bg-mainBg border border-subBg rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
								<div className="p-3 border-b border-subBg flex justify-between items-center bg-subBg/10">
									<h3 className="font-bold text-sm text-highlight">
										알림 ({notifications.length})
									</h3>
									<Link
										href="/user"
										className="text-xs text-textSub hover:underline"
									>
										설정
									</Link>
								</div>
								<ul className="max-h-80 overflow-y-auto">
									{notifications.length > 0 ? (
										notifications.map((todo) => (
											<li
												key={todo.id}
												className="p-3 hover:bg-subBg/30 border-b border-subBg/30 last:border-none transition-colors"
											>
												<div className="flex items-start gap-3">
													<div className="mt-0.5 shrink-0">
														{todo.priority === 'HIGH' ? (
															<Flame className="w-4 h-4 text-red" />
														) : (
															<Clock className="w-4 h-4 text-warning" />
														)}
													</div>
													<div>
														<p className="text-sm font-medium text-highlight line-clamp-1">
															{todo.title}
														</p>
														<p className="text-xs text-textSub mt-0.5">
															{todo.dueDate
																? new Date(todo.dueDate).toLocaleDateString()
																: '마감일 없음'}
															{' · '}
															<span
																className={`font-bold ${
																	todo.priority === 'HIGH'
																		? 'text-red'
																		: todo.priority === 'MEDIUM'
																		? 'text-warning'
																		: 'text-blue'
																}`}
															>
																{todo.priority}
															</span>
														</p>
													</div>
												</div>
											</li>
										))
									) : (
										<li className="p-8 text-center text-textSub text-sm">
											<p>새로운 알림이 없습니다 🎉</p>
										</li>
									)}
								</ul>
							</div>
						)}
					</div>

					<Link
						href="/user"
						className={`
                            ml-1 flex items-center gap-2 transition-all border
                            ${
															pathname === '/user'
																? 'bg-subBg border-highlight/30'
																: 'bg-subBg/50 border-highlight/10 hover:bg-subBg hover:border-highlight/30'
														}
                            ${
															user
																? 'pl-3 pr-1 py-1 rounded-full' // 로그인 시: 왼쪽 여백을 더 줘서 이름 공간 확보
																: 'p-2 rounded-full' // 비로그인 시: 동그라미 유지
														}
                        `}
					>
						{/* 로그인 상태일 때만 이름 표시 */}
						{user && (
							<span className="text-sm font-medium max-w-20 truncate hidden sm:block">
								{user.name}
							</span>
						)}

						{/* 사용자 아이콘 */}
						<div className="flex items-center justify-center w-7 h-7 rounded-full bg-mainBg border border-subBg/50 shadow-sm">
							<User className="w-4 h-4 text-highlight" />
						</div>
					</Link>
				</div>
			</div>
		</header>
	);
}
