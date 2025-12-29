"use client";

import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";

interface FormData {
  name: string;
  email: string;
  age: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  age?: string;
  password?: string;
  confirmPassword?: string;
}

export default function VanillaReactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    age: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  // 수동 유효성 검사 함수
  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "name":
        if (!value) return "이름을 입력해주세요";
        if (value.length < 2) return "이름은 최소 2자 이상이어야 합니다";
        break;
      case "email":
        if (!value) return "이메일을 입력해주세요";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "올바른 이메일 형식이 아닙니다";
        break;
      case "age":
        if (!value) return "나이를 입력해주세요";
        const ageNum = Number(value);
        if (isNaN(ageNum)) return "나이는 숫자여야 합니다";
        if (ageNum < 18) return "나이는 18세 이상이어야 합니다";
        if (ageNum > 100) return "나이는 100세 이하여야 합니다";
        break;
      case "password":
        if (!value) return "비밀번호를 입력해주세요";
        if (value.length < 8) return "비밀번호는 최소 8자 이상이어야 합니다";
        break;
      case "confirmPassword":
        if (!value) return "비밀번호 확인을 입력해주세요";
        if (value !== formData.password) return "비밀번호가 일치하지 않습니다";
        break;
    }
    return undefined;
  };

  // 전체 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof FormData]);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // 입력 변경 핸들러
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 실시간 검증 (touched된 필드만)
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  // 포커스 아웃 핸들러
  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 모든 필드를 touched로 표시
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    // 전체 검증
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 제출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmittedData({ ...formData });
      console.log("제출된 데이터:", formData);
    } catch (error) {
      console.error("제출 오류:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 초기화 핸들러
  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      age: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setTouched({});
    setSubmittedData(null);
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
          순수 React (Vanilla React)
        </h1>

        {/* 동작원리 */}
        <section className="mb-12 p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
            동작원리
          </h2>
          <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
            <p>
              <strong className="text-black dark:text-white">순수 React</strong>
              만을 사용하여 form 상태를 관리하는 방법입니다. 외부 라이브러리
              없이 React의 기본 훅만 사용합니다.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>useState:</strong> 각 입력 필드의 값을 state로
                관리합니다.
              </li>
              <li>
                <strong>수동 이벤트 핸들링:</strong> onChange, onBlur 이벤트를
                직접 처리합니다.
              </li>
              <li>
                <strong>수동 유효성 검사:</strong> 검증 로직을 직접 작성하고
                실행합니다.
              </li>
              <li>
                <strong>에러 상태 관리:</strong> 에러 메시지를 별도의 state로
                관리합니다.
              </li>
              <li>
                <strong>touched 상태:</strong> 필드 방문 여부를 추적하여 UX를
                개선합니다.
              </li>
            </ul>
            <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-md">
              <p className="text-sm">
                <strong>장점:</strong> 외부 의존성 없음, 완전한 제어, 작은 번들
                사이즈
              </p>
              <p className="text-sm mt-2">
                <strong>단점:</strong> 많은 보일러플레이트 코드, 반복적인 검증
                로직 작성 필요
              </p>
            </div>
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
                1. State 설정
              </h3>
              <pre className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-md overflow-x-auto">
                <code className="text-sm">{`import { useState } from "react";

const [formData, setFormData] = useState({
  name: "",
  email: "",
  age: "",
});

const [errors, setErrors] = useState({});
const [touched, setTouched] = useState({});`}</code>
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
                2. 유효성 검사 함수
              </h3>
              <pre className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-md overflow-x-auto">
                <code className="text-sm">{`const validateField = (name: string, value: string) => {
  switch (name) {
    case "email":
      if (!value) return "이메일을 입력해주세요";
      const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      if (!emailRegex.test(value)) return "올바른 이메일 형식이 아닙니다";
      break;
    // ... 다른 필드들
  }
  return undefined;
};`}</code>
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
                3. 이벤트 핸들러
              </h3>
              <pre className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-md overflow-x-auto">
                <code className="text-sm">{`const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
  
  // 실시간 검증
  if (touched[name]) {
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  }
};

const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setTouched(prev => ({ ...prev, [name]: true }));
  
  const error = validateField(name, value);
  setErrors(prev => ({ ...prev, [name]: error }));
};`}</code>
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
                4. JSX에서 사용
              </h3>
              <pre className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-md overflow-x-auto">
                <code className="text-sm">{`<input
  name="email"
  value={formData.email}
  onChange={handleChange}
  onBlur={handleBlur}
/>
{touched.email && errors.email && (
  <span className="error">{errors.email}</span>
)}`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 활용예시 */}
        <section className="mb-12 p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
            활용예시
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                이름
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
                placeholder="이름을 입력하세요"
              />
              {touched.name && errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                이메일
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
                placeholder="email@example.com"
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                나이
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
                placeholder="18-100"
              />
              {touched.age && errors.age && (
                <p className="mt-1 text-sm text-red-500">{errors.age}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                비밀번호
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
                placeholder="최소 8자"
              />
              {touched.password && errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                비밀번호 확인
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
                placeholder="비밀번호를 다시 입력하세요"
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
              >
                {isSubmitting ? "제출 중..." : "제출"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 bg-gray-300 dark:bg-zinc-700 text-black dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-zinc-600"
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

          <div className="mt-6 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-md">
            <h3 className="font-semibold mb-2 text-black dark:text-white">
              현재 Form 상태:
            </h3>
            <div className="text-sm space-y-1 text-zinc-700 dark:text-zinc-300">
              <p>
                <strong>변경됨:</strong>{" "}
                {Object.values(formData).some((v) => v !== "") ? "✅" : "❌"}
              </p>
              <p>
                <strong>유효성:</strong>{" "}
                {Object.keys(errors).length === 0 &&
                Object.values(formData).every((v) => v !== "")
                  ? "✅ 통과"
                  : "❌ 실패"}
              </p>
              <p>
                <strong>제출 중:</strong> {isSubmitting ? "⏳" : "✓"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
