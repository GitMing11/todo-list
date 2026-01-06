'use client';

import React, { useState, useEffect } from 'react';
import { ListTodo, CheckCircle2, Zap } from 'lucide-react';
import { getTodoStats } from '@/app/actions/todo';

import HomeHeader from '@/app/components/home/HomeHeader';
import StatsSection, { StatItem } from '@/app/components/home/StatsSection';
import QuickLinksSection from '@/app/components/home/QuickLinksSection';
import StatDetailModal from '@/app/components/home/StatDetailModal';

const MOCK_USER = {
	name: '사용자',
};

export default function HomePage() {
	const [selectedStat, setSelectedStat] = useState<StatItem | null>(null);

	// 초기 상태 정의
	const [stats, setStats] = useState<StatItem[]>([
		{
			id: 'ongoing',
			label: '진행 중',
			count: 0,
			icon: <ListTodo className="w-6 h-6" />,
			colorClass: 'text-info bg-infoBg',
		},
		{
			id: 'completed',
			label: '오늘 완료',
			count: 0,
			icon: <CheckCircle2 className="w-6 h-6" />,
			colorClass: 'text-success bg-successBg',
		},
		{
			id: 'urgent',
			label: '급한 일',
			count: 0,
			icon: <Zap className="w-6 h-6" />,
			colorClass: 'text-warning bg-warningBg',
		},
	]);

	// 데이터 불러오기 함수
	const fetchStats = async () => {
		try {
			const data = await getTodoStats();
			setStats((prev) =>
				prev.map((item) => {
					if (item.id === 'ongoing') return { ...item, count: data.ongoing };
					if (item.id === 'completed')
						return { ...item, count: data.completed };
					if (item.id === 'urgent') return { ...item, count: data.urgent };
					return item;
				})
			);
		} catch (error) {
			console.error('통계 불러오기 실패:', error);
		}
	};

	useEffect(() => {
		fetchStats();
	}, []);

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 px-4 py-8 md:px-8 md:py-12">
				<div className="max-w-4xl mx-auto space-y-10">
					{/* 1. 헤더 섹션 (인사말 + 투두 추가) */}
					<HomeHeader
						userName={MOCK_USER.name}
						onTodoSuccess={fetchStats}
					/>

					{/* 2. 통계 섹션 */}
					<StatsSection
						stats={stats}
						onStatClick={setSelectedStat}
					/>

					{/* 3. 바로가기 섹션 */}
					<QuickLinksSection />
				</div>
			</main>

			{/* 모달 렌더링 */}
			{selectedStat && (
				<StatDetailModal
					stat={selectedStat}
					onClose={() => setSelectedStat(null)}
				/>
			)}
		</div>
	);
}
