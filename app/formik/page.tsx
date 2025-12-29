"use client";

import { useFormik } from "formik";
import * as yup from "yup";
import Link from "next/link";
import { useState } from "react";

// 간단한 예제 스키마
const validationSchema = yup.object({
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
    .min(18, "나이는 18세 이상이어야 합니다")
    .required("나이를 입력해주세요"),
});

type FormValues = yup.InferType<typeof validationSchema>;

export default function FormikPage() {
  const [submittedData, setSubmittedData] = useState<FormValues | null>(null);

  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      email: "",
      age: 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmittedData(values);
      console.log("제출된 데이터:", values);
    },
  });

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
          Formik
        </h1>

        {/* 동작원리 */}
        <section className="mb-12 p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
            동작원리
          </h2>
          <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
            <p>
              <strong className="text-black dark:text-white">Formik</strong>은
              <strong className="text-green-600 dark:text-green-400"> controlled components</strong>를
              사용하여 form 상태를 관리합니다.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>State 관리:</strong> 모든 form 값을 내부 state로 관리합니다.
              </li>
              <li>
                <strong>Helper 함수:</strong> handleChange, handleBlur, handleSubmit 등의 helper 함수를
                제공합니다.
              </li>
              <li>
                <strong>Validation:</strong> Yup 스키마를 통한 검증을 지원합니다.
              </li>
              <li>
                <strong>Form State:</strong> values, errors, touched, isSubmitting 등의 상태를 제공합니다.
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
                <code className="text-sm">npm install formik</code>
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
                2. 기본 사용법
              </h3>
              <pre className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-md overflow-x-auto">
                <code className="text-sm">{`import { useFormik } from "formik";

const formik = useFormik({
  initialValues: { name: "", email: "" },
  onSubmit: (values) => {
    console.log(values);
  },
});

<form onSubmit={formik.handleSubmit}>
  <input
    name="name"
    value={formik.values.name}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  />
  {formik.touched.name && formik.errors.name && (
    <span>{formik.errors.name}</span>
  )}
  <button type="submit">제출</button>
</form>`}</code>
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
                3. Yup과 통합
              </h3>
              <pre className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-md overflow-x-auto">
                <code className="text-sm">{`import * as yup from "yup";

const validationSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
});

const formik = useFormik({
  initialValues: { name: "", email: "" },
  validationSchema,
  onSubmit: (values) => console.log(values),
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
          <form onSubmit={formik.handleSubmit} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                이름
              </label>
              <input
                type="text"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
                placeholder="이름을 입력하세요"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                이메일
              </label>
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
                placeholder="email@example.com"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                나이
              </label>
              <input
                type="number"
                name="age"
                value={formik.values.age || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
                placeholder="18 이상"
              />
              {formik.touched.age && formik.errors.age && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.age}</p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {formik.isSubmitting ? "제출 중..." : "제출"}
              </button>
              <button
                type="button"
                onClick={() => {
                  formik.resetForm();
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

