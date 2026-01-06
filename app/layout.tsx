// app/layout.tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from './components/Header';
import { ThemeProvider } from './context/ThemeContext';
import { auth } from '@/app/auth';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Todo List',
	description: 'Todo',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();

	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider>
					<Header user={session?.user} />
					<main className="min-h-screen bg-mainBg text-highlight transition-colors duration-300">
						{children}
					</main>
				</ThemeProvider>
			</body>
		</html>
	);
}
