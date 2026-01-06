// components/UserSettings.tsx
'use client';

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { resetTodos } from '../../app/actions/todo';
import { logout } from '../../app/actions/auth';
import { Moon, Sun, Trash2, LogOut, ChevronRight, Github } from 'lucide-react';

export default function UserSettings() {
	const { isDarkMode, toggleTheme } = useTheme();

	const handleReset = async () => {
		if (
			confirm(
				'정말 모든 할 일을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.'
			)
		) {
			await resetTodos();
			alert('모든 데이터가 초기화되었습니다.');
		}
	};

	const handleLogout = async () => {
		if (confirm('로그아웃 하시겠습니까?')) {
			await logout();
		}
	};

	// 재사용 가능한 설정 아이템 컴포넌트
	const SettingItem = ({
		icon: Icon,
		label,
		onClick,
		value,
		isDanger = false,
	}: any) => (
		<button
			onClick={onClick}
			className={`w-full flex items-center justify-between p-4 bg-mainBg border border-subBg rounded-2xl transition-all duration-200 hover:border-highlight/30 hover:shadow-sm group ${
				isDanger
					? 'hover:bg-red-50 dark:hover:bg-red-900/10'
					: 'hover:bg-subBg/30'
			}`}
		>
			<div className="flex items-center gap-3">
				<div
					className={`p-2 rounded-full ${
						isDanger
							? 'bg-red-100 text-red-500'
							: 'bg-subBg text-textSub group-hover:text-highlight'
					}`}
				>
					<Icon className="w-5 h-5" />
				</div>
				<span
					className={`font-medium ${
						isDanger ? 'text-red-500' : 'text-highlight'
					}`}
				>
					{label}
				</span>
			</div>
			<div className="flex items-center gap-2">
				{value && <span className="text-sm text-textSub">{value}</span>}
				<ChevronRight className="w-4 h-4 text-textSub/50" />
			</div>
		</button>
	);

	return (
		<div className="space-y-6">
			{/* 앱 설정 */}
			<section className="space-y-3">
				<h3 className="text-sm font-bold text-textSub uppercase tracking-wider pl-1">
					앱 설정
				</h3>
				<div className="flex flex-col gap-3">
					<SettingItem
						icon={isDarkMode ? Moon : Sun}
						label={isDarkMode ? '라이트 모드로 변경' : '다크 모드로 변경'}
						onClick={toggleTheme}
						value={isDarkMode ? 'On' : 'Off'}
					/>
				</div>
			</section>

			{/* 데이터 관리 */}
			<section className="space-y-3">
				<h3 className="text-sm font-bold text-textSub uppercase tracking-wider pl-1">
					데이터 관리
				</h3>
				<div className="flex flex-col gap-3">
					<SettingItem
						icon={Trash2}
						label="데이터 초기화"
						onClick={handleReset}
						isDanger={true}
					/>
				</div>
			</section>

			{/* 계정 */}
			<section className="space-y-3">
				<h3 className="text-sm font-bold text-textSub uppercase tracking-wider pl-1">
					계정
				</h3>
				<div className="flex flex-col gap-3">
					<SettingItem
						icon={LogOut}
						label="로그아웃"
						onClick={handleLogout}
					/>
				</div>
			</section>

			{/* 푸터 */}
			<div className="pt-6 text-center">
				<p className="text-xs text-textSub mb-2">Todo App v1.0.0</p>
				<div className="flex justify-center gap-4">
					<a
						href="https://github.com/GitMing11/todo-list"
						className="text-textSub hover:text-highlight transition-colors"
					>
						<Github className="w-5 h-5" />
					</a>
				</div>
			</div>
		</div>
	);
}
