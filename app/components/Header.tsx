'use client';

import React from 'react';
import { Search, Bell, Sun, Moon, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// User 타입 정의 (필요한 필드만)
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
					</button>

					<button className="p-2 rounded-full hover:bg-subBg transition-colors text-textSub hover:text-highlight relative">
						<Bell className="w-5 h-5" />
						<span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-mainBg"></span>
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
