"use client";

import { z } from "zod";
import Link from "next/link";
import { useState } from "react";

export default function ZodPage() {
  const [validationResult, setValidationResult] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    password: "",
    confirmPassword: "",
  });

  // Zod 스키마 정의
  const schema = z
    .object({
      name: z.string().min(2, "이름은 최소 2자 이상이어야 합니다"),
      email: z.string().email("올바른 이메일 형식이 아닙니다"),
      age: z
        .number({ required_error: "나이를 입력해주세요" })
        .min(18, "나이는 18세 이상이어야 합니다")
        .max(100, "나이는 100세 이하여야 합니다"),
      password: z
        .string()
        .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          "비밀번호는 대문자, 소문자, 숫자를 포함해야 합니다"
        ),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "비밀번호가 일치하지 않습니다",
      path: ["confirmPassword"],
    });

  const handleValidate = () => {
    try {
      const parsed = schema.parse({
        ...formData,
        age: formData.age ? Number(formData.age) : undefined,
      });
      setValidationResult(
        `✅ 검증 성공!\n${JSON.stringify(parsed, null, 2)}`
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join("\n");
        setValidationResult(`❌ 검증 실패:\n${errors}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-block text-blue-600 dark:text-blue-400 hover:underline mb-4"
          >
            ← 메인으로 돌아가기
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8 text-black dark:text-white">
          Zod
        </h1>

        {/* 동작원리 */}
        <section className="mb-12 p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
            동작원리
          </h2>
          <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
            <p>
              <strong className="text-black dark:text-white">Zod</strong>은 TypeScript-first 스키마 검증
              라이브러리로, 타입 안전성을 보장합니다.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>타입 추론:</strong> 스키마로부터 TypeScript 타입을 자동으로 추론합니다.
              </li>
              <li>
                <strong>런타임 검증:</strong> 컴파일 타임과 런타임 모두에서 타입 안전성을 보장합니다.
              </li>
              <li>
                <strong>체이닝 API:</strong> 메서드 체이닝을 통해 직관적으로 검증 규칙을 작성합니다.
              </li>
              <li>
                <strong>고급 검증:</strong> refine(), superRefine()을 통해 복잡한 검증 로직을 구현할 수
                있습니다.
              </li>
            </ul>
          </div>
        </section>

        {/* 구현방법 */}
        <section className="mb-12 p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
            구현방법
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
                1. 설치
              </h3>
              <pre className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-md overflow-x-auto">
                <code className="text-sm">npm install zod</code>
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
                2. 기본 스키마 정의
              </h3>
              <pre className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-md overflow-x-auto">
                <code className="text-sm">{`import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  age: z.number().min(18).max(100),
});

// 타입 추론
type SchemaType = z.infer<typeof schema>;`}</code>
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
                3. 검증 실행
              </h3>
              <pre className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-md overflow-x-auto">
                <code className="text-sm">{`// parse (에러 발생)
try {
  const valid = schema.parse(data);
  console.log(valid);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error(error.errors);
  }
}

// safeParse (에러 없이 반환)
const result = schema.safeParse(data);
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error.errors);
}`}</code>
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
                4. 고급 기능
              </h3>
              <pre className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-md overflow-x-auto">
                <code className="text-sm">{`// 조건부 검증
z.string().refine((val) => val.length > 0, {
  message: "필수 입력입니다",
});

// 객체 간 검증
z.object({
  password: z.string(),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["confirmPassword"],
});

// 타입 변환
z.string().transform((val) => val.toUpperCase());
z.string().pipe(z.coerce.number());`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 활용예시 */}
        <section className="mb-12 p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
            활용예시
          </h2>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                이름
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
                placeholder="최소 2자"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                이메일
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                나이
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
                placeholder="18-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                비밀번호
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
                placeholder="최소 8자, 대소문자+숫자"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                비밀번호 확인
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
                placeholder="비밀번호를 다시 입력하세요"
              />
            </div>

            <button
              onClick={handleValidate}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              검증하기
            </button>

            {validationResult && (
              <div className="mt-4 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-md">
                <pre className="text-sm whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                  {validationResult}
                </pre>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

