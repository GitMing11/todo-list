// app/signup/page.tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signup } from '@/app/actions/auth';
import { UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
	const [errorMessage, dispatch] = useActionState(signup, undefined);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center p-6 bg-mainBg">
			<div className="w-full max-w-sm space-y-8 bg-subBg/10 p-8 rounded-3xl border border-subBg shadow-lg">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-highlight">환영합니다! 🎉</h1>
					<p className="mt-2 text-sm text-textSub">
						새로운 계정을 만들어보세요.
					</p>
				</div>

				<form
					action={dispatch}
					className="space-y-4"
				>
					<div>
						<label className="block text-xs font-medium text-textSub mb-1">
							이름
						</label>
						<input
							type="text"
							name="name"
							placeholder="홍길동"
							required
							minLength={2}
							className="w-full px-4 py-3 rounded-xl bg-mainBg border border-subBg focus:border-highlight focus:ring-1 focus:ring-highlight outline-none transition-all"
						/>
					</div>
					<div>
						<label className="block text-xs font-medium text-textSub mb-1">
							이메일
						</label>
						<input
							type="email"
							name="email"
							placeholder="hello@example.com"
							required
							className="w-full px-4 py-3 rounded-xl bg-mainBg border border-subBg focus:border-highlight focus:ring-1 focus:ring-highlight outline-none transition-all"
						/>
					</div>
					<div>
						<label className="block text-xs font-medium text-textSub mb-1">
							비밀번호
						</label>
						<input
							type="password"
							name="password"
							placeholder="6자 이상 입력"
							required
							minLength={6}
							className="w-full px-4 py-3 rounded-xl bg-mainBg border border-subBg focus:border-highlight focus:ring-1 focus:ring-highlight outline-none transition-all"
						/>
					</div>

					<div
						className="flex items-end"
						aria-live="polite"
						aria-atomic="true"
					>
						{errorMessage && (
							<p className="text-sm text-red-500">{errorMessage}</p>
						)}
					</div>

					<SignupButton />
				</form>

				<div className="text-center text-sm text-textSub mt-4 pt-4 border-t border-subBg/50">
					이미 계정이 있으신가요?{' '}
					<Link
						href="/login"
						className="font-bold text-highlight hover:underline ml-1"
					>
						로그인하기
					</Link>
				</div>
			</div>
		</div>
	);
}

function SignupButton() {
	const { pending } = useFormStatus();
	return (
		<button
			className="w-full flex items-center justify-center gap-2 bg-highlight text-mainBg py-3 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
			aria-disabled={pending}
		>
			{pending ? (
				'가입 중...'
			) : (
				<>
					회원가입 <UserPlus className="w-4 h-4" />
				</>
			)}
		</button>
	);
}
