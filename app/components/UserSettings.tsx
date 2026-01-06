'use client';

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { resetTodos } from '../../app/actions/todo';
import { logout } from '../../app/actions/auth';
import { Moon, Sun, Trash2, LogOut, Github } from 'lucide-react';

import SettingItem from './settings/SettingItem';
import NotificationSettings from './settings/NotificationSettings';

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

	return (
		<div className="space-y-6">
			{/* 1. 앱 설정 */}
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

			{/* 2. 알림 설정 */}
			<NotificationSettings />

			{/* 3. 데이터 관리 */}
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

			{/* 4. 계정 */}
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

			{/* 5. 푸터 */}
			<div className="pt-6 text-center">
				<p className="text-xs text-textSub mb-2">Todo App v1.0.0</p>
				<div className="flex justify-center gap-4">
					<a
						href="https://github.com/GitMing11/todo-list"
						className="text-textSub hover:text-highlight transition-colors"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Github className="w-5 h-5" />
					</a>
				</div>
			</div>
		</div>
	);
}
