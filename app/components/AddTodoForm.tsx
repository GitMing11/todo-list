// app/components/AddTodoForm.tsx
'use client';

import React from 'react';
import TodoInput from './TodoInput';
import { createTodo } from '../actions/todo';

interface AddTodoFormProps {
	onSuccess?: () => void;
}

export default function AddTodoForm({ onSuccess }: AddTodoFormProps) {
	const handleAddTodo = async (data: {
		title: string;
		description?: string;
		priority: 'HIGH' | 'MEDIUM' | 'LOW';
		dueDate?: Date;
	}) => {
		try {
			await createTodo(
				data.title,
				data.description,
				data.priority,
				data.dueDate
			);
			alert('할 일이 추가되었습니다.');

			// ✨ 성공 후 콜백 실행 (통계 갱신 등)
			if (onSuccess) {
				onSuccess();
			}
		} catch (e) {
			console.error(e);
			alert('오류가 발생했습니다.');
		}
	};

	return <TodoInput onAdd={handleAddTodo} />;
}
