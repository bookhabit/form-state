"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";

// 간단한 예제 스키마
const exampleSchema = z.object({
  name: z.string().min(2, "이름은 최소 2자 이상이어야 합니다"),
  email: z.string().email("올바른 이메일 형식이 아닙니다"),
  age: z.number().min(18, "나이는 18세 이상이어야 합니다"),
});

type ExampleFormData = z.infer<typeof exampleSchema>;

export default function ReactHookFormPage() {
  const [submittedData, setSubmittedData] = useState<ExampleFormData | null>(
    null
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ExampleFormData>({
    resolver: zodResolver(exampleSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ExampleFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmittedData(data);
    console.log("제출된 데이터:", data);
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
          React Hook Form
        </h1>

        {/* 동작원리 */}
        <section className="mb-12 p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
            동작원리
          </h2>
          <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
            <p>
              <strong className="text-black dark:text-white">
                React Hook Form
              </strong>
              은
              <strong className="text-blue-600 dark:text-blue-400">
                {" "}
                uncontrolled components
              </strong>
              를 사용하여 성능을 최적화합니다.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Ref 기반 접근:</strong> DOM ref를 통해 직접 값에
                접근하여 불필요한 리렌더링을 방지합니다.
              </li>
              <li>
                <strong>Register 함수:</strong> 각 input을 register하여 form과
                연결합니다.
              </li>
              <li>
                <strong>Validation:</strong> resolver를 통해 Zod, Yup 등의 검증
                라이브러리와 통합합니다.
              </li>
              <li>
                <strong>Form State:</strong> errors, isSubmitting, isValid 등의
                상태를 제공합니다.
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
                <code className="text-sm">npm install react-hook-form</code>
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
                2. 기본 사용법
              </h3>
              <pre className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-md overflow-x-auto">
                <code className="text-sm">{`import { useForm } from "react-hook-form";

const { register, handleSubmit, formState: { errors } } = useForm();

const onSubmit = (data) => {
  console.log(data);
};

<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register("name")} />
  {errors.name && <span>{errors.name.message}</span>}
  <button type="submit">제출</button>
</form>`}</code>
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
                3. Zod와 통합
              </h3>
              <pre className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-md overflow-x-auto">
                <code className="text-sm">{`import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

const { register, handleSubmit } = useForm({
  resolver: zodResolver(schema),
});`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 활용예시 */}
        <section className="mb-12 p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
            활용예시
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 max-w-md"
          >
            <div>
              <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                이름
              </label>
              <input
                type="text"
                {...register("name", { valueAsNumber: false })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
                placeholder="이름을 입력하세요"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                이메일
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
                placeholder="email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                나이
              </label>
              <input
                type="number"
                {...register("age", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
                placeholder="18 이상"
              />
              {errors.age && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.age.message}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? "제출 중..." : "제출"}
              </button>
              <button
                type="button"
                onClick={() => {
                  reset();
                  setSubmittedData(null);
                }}
                className="px-4 py-2 bg-gray-300 dark:bg-zinc-700 text-black dark:text-white rounded-md hover:bg-gray-400"
              >
                초기화
              </button>
            </div>
          </form>

          {submittedData && (
            <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/30 rounded-md">
              <h3 className="font-semibold mb-2 text-black dark:text-white">
                제출된 데이터:
              </h3>
              <pre className="text-sm text-zinc-700 dark:text-zinc-300">
                {JSON.stringify(submittedData, null, 2)}
              </pre>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
