"use client";

import * as yup from "yup";
import Link from "next/link";
import { useState } from "react";

export default function YupPage() {
  const [validationResult, setValidationResult] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    password: "",
    confirmPassword: "",
  });

  // Yup 스키마 정의
  const schema = yup.object({
    name: yup
      .string()
      .min(2, "이름은 최소 2자 이상이어야 합니다")
      .required("이름을 입력해주세요"),
    email: yup
      .string()
      .email("올바른 이메일 형식이 아닙니다")
      .required("이메일을 입력해주세요"),
    age: yup
      .number()
      .typeError("나이는 숫자여야 합니다")
      .min(18, "나이는 18세 이상이어야 합니다")
      .max(100, "나이는 100세 이하여야 합니다")
      .required("나이를 입력해주세요"),
    password: yup
      .string()
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "비밀번호는 대문자, 소문자, 숫자를 포함해야 합니다"
      )
      .required("비밀번호를 입력해주세요"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "비밀번호가 일치하지 않습니다")
      .required("비밀번호 확인을 입력해주세요"),
  });

  const handleValidate = async () => {
    try {
      const validated = await schema.validate(formData, { abortEarly: false });
      setValidationResult(
        `✅ 검증 성공!\n${JSON.stringify(validated, null, 2)}`
      );
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors = error.inner.map((err) => err.message).join("\n");
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
          Yup
        </h1>

        {/* 동작원리 */}
        <section className="mb-12 p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
            동작원리
          </h2>
          <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
            <p>
              <strong className="text-black dark:text-white">Yup</strong>은 JavaScript/TypeScript를 위한
              스키마 검증 라이브러리입니다.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>스키마 기반:</strong> 객체 스키마를 정의하여 데이터 구조와 검증 규칙을 명시합니다.
              </li>
              <li>
                <strong>체이닝 API:</strong> 메서드 체이닝을 통해 직관적으로 검증 규칙을 작성합니다.
              </li>
              <li>
                <strong>비동기 검증:</strong> Promise 기반으로 비동기 검증을 지원합니다.
              </li>
              <li>
                <strong>커스텀 검증:</strong> test() 메서드를 통해 커스텀 검증 로직을 추가할 수 있습니다.
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
                <code className="text-sm">npm install yup</code>
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
                2. 기본 스키마 정의
              </h3>
              <pre className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-md overflow-x-auto">
                <code className="text-sm">{`import * as yup from "yup";

const schema = yup.object({
  name: yup.string().required().min(2),
  email: yup.string().email().required(),
  age: yup.number().min(18).max(100).required(),
});`}</code>
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
                3. 검증 실행
              </h3>
              <pre className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-md overflow-x-auto">
                <code className="text-sm">{`// 동기 검증
try {
  const valid = schema.validateSync(data);
  console.log(valid);
} catch (error) {
  console.error(error.errors);
}

// 비동기 검증
schema.validate(data)
  .then(valid => console.log(valid))
  .catch(error => console.error(error.errors));`}</code>
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
                4. 고급 기능
              </h3>
              <pre className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-md overflow-x-auto">
                <code className="text-sm">{`// 조건부 검증
yup.string().when("otherField", {
  is: true,
  then: (schema) => schema.required(),
  otherwise: (schema) => schema.optional(),
});

// 참조 검증
confirmPassword: yup
  .string()
  .oneOf([yup.ref("password")], "비밀번호가 일치하지 않습니다");

// 커스텀 검증
yup.string().test("custom", "커스텀 메시지", (value) => {
  return value?.includes("test");
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
              className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
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

