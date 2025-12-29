"use client";

import { useFormik } from "formik";
import * as yup from "yup";

// Yup 스키마 정의
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
    .max(100, "나이는 100세 이하여야 합니다")
    .required("나이를 입력해주세요"),
  password: yup
    .string()
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
    .required("비밀번호를 입력해주세요"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "비밀번호가 일치하지 않습니다")
    .required("비밀번호 확인을 입력해주세요"),
});

type FormValues = yup.InferType<typeof validationSchema>;

export default function FormikExample() {
  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      email: "",
      age: 0,
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      // 폼 제출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("제출된 데이터:", values);
      alert(
        `제출 성공!\n이름: ${values.name}\n이메일: ${values.email}\n나이: ${values.age}`
      );
      formik.resetForm();
    },
  });

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">
        Formik + Yup
      </h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="formik-name"
            className="block text-sm font-medium mb-1 text-black dark:text-white"
          >
            이름
          </label>
          <input
            id="formik-name"
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
          <label
            htmlFor="formik-email"
            className="block text-sm font-medium mb-1 text-black dark:text-white"
          >
            이메일
          </label>
          <input
            id="formik-email"
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
            placeholder="이메일을 입력하세요"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="formik-age"
            className="block text-sm font-medium mb-1 text-black dark:text-white"
          >
            나이
          </label>
          <input
            id="formik-age"
            type="number"
            name="age"
            value={formik.values.age || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
            placeholder="나이를 입력하세요"
          />
          {formik.touched.age && formik.errors.age && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.age}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="formik-password"
            className="block text-sm font-medium mb-1 text-black dark:text-white"
          >
            비밀번호
          </label>
          <input
            id="formik-password"
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
            placeholder="비밀번호를 입력하세요"
          />
          {formik.touched.password && formik.errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {formik.errors.password}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="formik-confirmPassword"
            className="block text-sm font-medium mb-1 text-black dark:text-white"
          >
            비밀번호 확인
          </label>
          <input
            id="formik-confirmPassword"
            type="password"
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
            placeholder="비밀번호를 다시 입력하세요"
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {formik.errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formik.isSubmitting ? "제출 중..." : "제출"}
          </button>
          <button
            type="button"
            onClick={() => formik.resetForm()}
            className="px-4 py-2 bg-gray-300 dark:bg-zinc-700 text-black dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-zinc-600"
          >
            초기화
          </button>
        </div>
      </form>
    </div>
  );
}
