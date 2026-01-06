'use client';

import React from 'react';

export interface StatItem {
	id: string;
	label: string;
	count: number;
	icon: React.ReactNode;
	colorClass: string;
}

interface StatsSectionProps {
	stats: StatItem[];
	onStatClick: (stat: StatItem) => void;
}

export default function StatsSection({
	stats,
	onStatClick,
}: StatsSectionProps) {
	return (
		<section className="grid grid-cols-1 md:grid-cols-3 gap-6">
			{stats.map((stat) => (
				<div
					key={stat.id}
					onClick={() => onStatClick(stat)}
					className="bg-mainBg border border-subBg rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group hover:-translate-y-1"
				>
					<div>
						<p className="text-textSub font-medium mb-1">{stat.label}</p>
						<p className="text-3xl font-bold text-highlight">{stat.count}</p>
					</div>
					<div
						className={`p-3 rounded-full ${stat.colorClass} group-hover:scale-110 transition-transform duration-300`}
					>
						{stat.icon}
					</div>
				</div>
			))}
		</section>
	);
}
