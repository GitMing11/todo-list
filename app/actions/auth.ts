// app/actions/auth.ts
'use server';

import { signIn, signOut } from '@/app/auth';
import { AuthError } from 'next-auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { redirect } from 'next/navigation';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const credentials = Object.fromEntries(formData);

    await signIn('credentials', {
      ...credentials,
      redirectTo: '/user',
    });
    
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return '이메일 또는 비밀번호가 올바르지 않습니다.';
        default:
          return '로그인 중 문제가 발생했습니다.';
      }
    }
    throw error;
  }
}

// 회원가입 액션 스키마
const SignupSchema = z.object({
  name: z.string().min(2, { message: '이름은 2글자 이상이어야 합니다.' }),
  email: z.string().email({ message: '올바른 이메일 주소를 입력해주세요.' }),
  password: z.string().min(6, { message: '비밀번호는 6자 이상이어야 합니다.' }),
});

export async function signup(prevState: string | undefined, formData: FormData) {
  // 1. 데이터 검증
  const validatedFields = SignupSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return '입력 정보를 다시 확인해주세요.';
  }

  const { name, email, password } = validatedFields.data;

  try {
    // 2. 이미 존재하는 이메일인지 확인
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return '이미 가입된 이메일입니다.';
    }

    // 3. 비밀번호 해싱 (암호화)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. 유저 생성
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    
  } catch (error) {
    return '회원가입 중 오류가 발생했습니다.';
  }
  
  // 성공 시 로그인 페이지로 이동
  redirect('/login');
}

export async function logout() {
  await signOut({ redirectTo: '/login' });
}