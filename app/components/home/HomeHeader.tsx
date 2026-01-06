'use client';

import React, { useState, useEffect } from 'react';
import AddTodoForm from '../AddTodoForm';

interface HomeHeaderProps {
	userName: string;
	onTodoSuccess: () => void;
}

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

export default function HomeHeader({
	userName,
	onTodoSuccess,
}: HomeHeaderProps) {
	const [greeting, setGreeting] = useState('');

	useEffect(() => {
		setGreeting(getGreetingMessage(userName));
	}, [userName]);

	return (
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
				<AddTodoForm onSuccess={onTodoSuccess} />
			</div>
		</section>
	);
}
