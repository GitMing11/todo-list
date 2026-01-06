'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Clock } from 'lucide-react';
import {
	getUserSettings,
	updateNotificationSettings,
} from '@/app/actions/user';

type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export default function NotificationSettings() {
	const [notifyPriority, setNotifyPriority] = useState<Priority>('HIGH');
	const [notifyDays, setNotifyDays] = useState<number>(0);
	const [isLoading, setIsLoading] = useState(true);

	// 설정 불러오기
	useEffect(() => {
		async function loadSettings() {
			try {
				const settings = await getUserSettings();
				if (settings) {
					setNotifyPriority(settings.notifyPriority as Priority);
					setNotifyDays(settings.notifyDays);
				}
			} catch (e) {
				console.error(e);
			} finally {
				setIsLoading(false);
			}
		}
		loadSettings();
	}, []);

	// 설정 저장
	const handleSaveSettings = async (p: Priority, d: number) => {
		setNotifyPriority(p);
		setNotifyDays(d);
		await updateNotificationSettings(p, d);
	};

	if (isLoading)
		return (
			<div className="p-4 text-center text-sm text-textSub">
				설정 로딩 중...
			</div>
		);

	return (
		<section className="space-y-3">
			<h3 className="text-sm font-bold text-textSub uppercase tracking-wider pl-1">
				알림 설정
			</h3>
			<div className="bg-mainBg border border-subBg rounded-2xl p-5 space-y-6">
				{/* 1. 우선순위 설정 */}
				<div>
					<p className="text-sm font-bold text-highlight mb-3 flex items-center gap-2">
						<Bell className="w-4 h-4" />
						우선순위 알림 기준
					</p>
					<div className="grid grid-cols-3 gap-2">
						{[
							{ value: 'LOW', label: '낮음 ~ 높음' },
							{ value: 'MEDIUM', label: '중간 ~ 높음' },
							{ value: 'HIGH', label: '높음' },
						].map((option) => (
							<button
								key={option.value}
								onClick={() =>
									handleSaveSettings(option.value as Priority, notifyDays)
								}
								className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
									notifyPriority === option.value
										? 'bg-highlight text-mainBg border-highlight'
										: 'bg-subBg/20 text-textSub border-transparent hover:bg-subBg/50'
								}`}
							>
								{option.label}
							</button>
						))}
					</div>
					<p className="text-[10px] text-textSub mt-2">
						선택한 우선순위 이상의 할 일에 대해 알림을 받습니다.
					</p>
				</div>

				<div className="h-px bg-subBg/50" />

				{/* 2. 마감일 설정 */}
				<div>
					<p className="text-sm font-bold text-highlight mb-3 flex items-center gap-2">
						<Clock className="w-4 h-4" />
						마감 임박 알림
					</p>
					<div className="grid grid-cols-4 gap-2">
						{[0, 1, 2, 3, 7].map((day) => (
							<button
								key={day}
								onClick={() => handleSaveSettings(notifyPriority, day)}
								className={`px-2 py-2 rounded-lg text-xs font-medium border transition-all ${
									notifyDays === day
										? 'bg-highlight text-mainBg border-highlight'
										: 'bg-subBg/20 text-textSub border-transparent hover:bg-subBg/50'
								}`}
							>
								{day === 0 ? '당일' : `${day}일 전`}
							</button>
						))}
					</div>
					<p className="text-[10px] text-textSub mt-2">
						마감일이 {notifyDays === 0 ? '오늘' : `${notifyDays}일 이내`}인 할
						일을 알려줍니다.
					</p>
				</div>
			</div>
		</section>
	);
}
