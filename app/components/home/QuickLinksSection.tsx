'use client';

import React from 'react';
import Link from 'next/link';
import { CalendarDays, ArrowRight } from 'lucide-react';

interface QuickLinkItem {
	id: string;
	href: string;
	title: string;
	desc: string;
}

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

export default function QuickLinksSection() {
	return (
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
	);
}
