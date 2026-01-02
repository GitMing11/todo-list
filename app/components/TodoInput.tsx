'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface TodoInputProps {
	onAdd: (text: string) => void;
	placeholder?: string;
	className?: string;
}

export default function TodoInput({
	onAdd,
	placeholder = '새로운 할 일을 입력하세요',
	className = '',
}: TodoInputProps) {
	const [text, setText] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (text.trim().length === 0) return;

		onAdd(text.trim());
		setText('');
	};

	return (
		<form
			onSubmit={handleSubmit}
			className={`relative w-full group ${className}`}
		>
			<input
				type="text"
				value={text}
				onChange={(e) => setText(e.target.value)}
				placeholder={placeholder}
				className="w-full pl-6 pr-14 py-4 rounded-full bg-mainBg border border-subBg shadow-sm outline-none 
                   text-highlight placeholder:text-textSub/60
                   focus:border-highlight/30 focus:shadow-md focus:ring-1 focus:ring-highlight/10 transition-all duration-200"
			/>
			<button
				type="button"
				onClick={handleSubmit}
				disabled={!text.trim()}
				className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-200
          ${
						text.trim()
							? 'bg-highlight text-mainBg hover:scale-105 hover:shadow-sm cursor-pointer'
							: 'bg-subBg text-textSub cursor-not-allowed opacity-50'
					}
        `}
			>
				<Plus className="w-5 h-5" />
			</button>
		</form>
	);
}
