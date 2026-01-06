'use client';

import React, { useState, useEffect } from 'react';
import {
	CheckCircle2,
	ListTodo,
	Zap,
	ArrowRight,
	CalendarDays,
} from 'lucide-react';
import Link from 'next/link';
import AddTodoForm from '../components/AddTodoForm';

import { getTodoStats } from '../actions/todo';

// ----------------------------------------------------------------------
// 1. 타입 및 데이터 정의
// ----------------------------------------------------------------------

interface UserProfile {
	name: string;
}

interface StatItem {
	id: string;
	label: string;
	count: number;
	icon: React.ReactNode;
	colorClass: string;
}

interface QuickLinkItem {
	id: string;
	href: string;
	title: string;
	desc: string;
}

const MOCK_USER: UserProfile = {
	name: '사용자',
};

const QUICK_LINKS: QuickLinkItem[] = [
	{
		id: 'today',
		href: '/today',
		title: '오늘의 할 일',
		desc: '집중해서 끝내야 할 일 확인하기',
	},
	{
		id: 'calendar',
		href: '/calendar',
		title: '캘린더',
		desc: '이번 달 전체 일정 흐름 파악하기',
	},
	{
		id: 'all',
		href: '/all',
		title: '전체 보기',
		desc: '모든 작업 목록 관리하기',
	},
];

// ----------------------------------------------------------------------
// 2. 유틸리티 함수
// ----------------------------------------------------------------------

function getGreetingMessage(name: string): string {
	const hour = new Date().getHours();
	let greeting = '';

	if (hour >= 5 && hour < 12) {
		greeting = '좋은 아침입니다';
	} else if (hour >= 12 && hour < 18) {
		greeting = '활기찬 오후 되세요';
	} else if (hour >= 18 && hour < 22) {
		greeting = '오늘 하루도 수고하셨어요';
	} else {
		greeting = '편안한 밤 되세요';
	}

	return `${greeting}, ${name}님!`;
}

// ----------------------------------------------------------------------
// 3. 메인 컴포넌트
// ----------------------------------------------------------------------

export default function HomePage() {
	const [greeting, setGreeting] = useState('');

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
		setGreeting(getGreetingMessage(MOCK_USER.name));
		fetchStats();
	}, []);

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 px-4 py-8 md:px-8 md:py-12">
				<div className="max-w-4xl mx-auto space-y-10">
					{/* Header Section */}
					<section className="space-y-6">
						<div>
							<h2 className="text-3xl md:text-4xl font-bold text-highlight mb-2">
								{greeting || '안녕하세요!'} 👋
							</h2>
							<p className="text-textSub text-lg">
								오늘 예정된 작업을 확인하고 하루를 시작해보세요.
							</p>
						</div>

						<div className="max-w-xl">
							<AddTodoForm onSuccess={fetchStats} />
						</div>
					</section>

					{/* Stats Section */}
					<section className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{stats.map((stat) => (
							<div
								key={stat.id}
								className="bg-mainBg border border-subBg rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group"
							>
								<div>
									<p className="text-textSub font-medium mb-1">{stat.label}</p>
									<p className="text-3xl font-bold text-highlight">
										{stat.count}
									</p>
								</div>
								<div
									className={`p-3 rounded-full ${stat.colorClass} group-hover:scale-110 transition-transform duration-300`}
								>
									{stat.icon}
								</div>
							</div>
						))}
					</section>

					{/* Quick Links Section */}
					<section className="bg-subBg/30 rounded-3xl p-6 md:p-8 border border-subBg backdrop-blur-sm">
						<div className="flex items-center gap-2 mb-6">
							<CalendarDays className="w-5 h-5 text-highlight" />
							<h3 className="text-xl font-semibold text-highlight">바로가기</h3>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{QUICK_LINKS.map((link) => (
								<Link
									key={link.id}
									href={link.href}
									className="group flex flex-col justify-between p-5 bg-mainBg border border-subBg/60 rounded-xl hover:border-highlight/40 hover:shadow-sm transition-all duration-200"
								>
									<div className="mb-4">
										<h4 className="font-bold text-lg text-highlight group-hover:text-info transition-colors">
											{link.title}
										</h4>
										<p className="text-sm text-textSub mt-1">{link.desc}</p>
									</div>
									<div className="flex justify-end">
										<ArrowRight className="w-5 h-5 text-subBg group-hover:text-highlight group-hover:translate-x-1 transition-all" />
									</div>
								</Link>
							))}
						</div>
					</section>
				</div>
			</main>
		</div>
	);
}
