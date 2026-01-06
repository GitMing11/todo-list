'use client';

import React from 'react';
import { ChevronRight, LucideIcon } from 'lucide-react';

interface SettingItemProps {
	icon: LucideIcon;
	label: string;
	onClick: () => void;
	value?: string;
	isDanger?: boolean;
}

export default function SettingItem({
	icon: Icon,
	label,
	onClick,
	value,
	isDanger = false,
}: SettingItemProps) {
	return (
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
}
