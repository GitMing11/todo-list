// app/user/page.tsx
import React from 'react';
import { getTodoStats } from '../../actions/todo';
import UserSettings from '../../components/UserSettings';
import { Zap, User as UserIcon } from 'lucide-react';
import { auth } from '@/app/auth';
import { redirect } from 'next/navigation';

export const metadata = {
	title: '마이 페이지 - Todo App',
	description: '프로필 및 앱 설정을 관리합니다.',
};

export default async function UserPage() {
	// 1. 세션 확인 (로그인 여부)
	const session = await auth();

	// 2. 로그인이 안 되어 있다면 로그인 페이지로 리다이렉트
	if (!session?.user) {
		redirect('/login');
	}

	// 3. 로그인 된 경우: 기존 로직 실행
	const stats = await getTodoStats();
	const totalTasks = stats.ongoing + stats.completed;
	const completionRate =
		totalTasks > 0 ? Math.round((stats.completed / totalTasks) * 100) : 0;

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 px-4 py-8 md:px-8 md:py-12">
				<div className="max-w-4xl mx-auto space-y-10">
					{/* 프로필 카드 (유저 정보 표시) */}
					<section className="flex flex-col items-center text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
						<div className="relative">
							<div className="w-24 h-24 rounded-full bg-linear-to-tr from-blue-400 to-purple-500 p-1 shadow-lg">
								<div className="w-full h-full rounded-full bg-mainBg flex items-center justify-center border-4 border-transparent overflow-hidden">
									{/* 프로필 이미지가 있으면 이미지 표시, 없으면 아이콘 */}
									{session.user.image ? (
										<img
											src={session.user.image}
											alt="Profile"
											className="w-full h-full object-cover"
										/>
									) : (
										<UserIcon className="w-10 h-10 text-textSub" />
									)}
								</div>
							</div>
							<div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-mainBg flex items-center justify-center">
								<Zap className="w-4 h-4 text-white fill-current" />
							</div>
						</div>
						<div>
							{/* 유저 이름 또는 이메일 표시 */}
							<h2 className="text-2xl font-bold text-highlight">
								안녕하세요, {session.user.name || '사용자'}님
							</h2>
							<p className="text-textSub text-sm">{session.user.email}</p>
						</div>
					</section>

					<section className="grid grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-6 duration-500 delay-100">
						<div className="bg-mainBg border border-subBg rounded-2xl p-4 text-center shadow-sm">
							<p className="text-textSub text-xs font-bold uppercase mb-1">
								진행 중
							</p>
							<p className="text-2xl font-bold text-blue-500">
								{stats.ongoing}
							</p>
						</div>
						<div className="bg-mainBg border border-subBg rounded-2xl p-4 text-center shadow-sm">
							<p className="text-textSub text-xs font-bold uppercase mb-1">
								오늘 완료
							</p>
							<p className="text-2xl font-bold text-green-500">
								{stats.completed}
							</p>
						</div>
						<div className="bg-mainBg border border-subBg rounded-2xl p-4 text-center shadow-sm">
							<p className="text-textSub text-xs font-bold uppercase mb-1">
								달성률
							</p>
							<p className="text-2xl font-bold text-purple-500">
								{completionRate}%
							</p>
						</div>
					</section>

					<div className="animate-in fade-in slide-in-from-bottom-8 duration-500 delay-200">
						<UserSettings />
					</div>
				</div>
			</main>
		</div>
	);
}
