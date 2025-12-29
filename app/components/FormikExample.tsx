"use client";

import { useFormik } from "formik";
import * as yup from "yup";
import { useState } from "react";

// Yup 스키마 정의 - 모든 Form 입력 타입 포함
const validationSchema = yup.object({
  // 기본 텍스트 입력
  name: yup
    .string()
    .min(2, "이름은 최소 2자 이상이어야 합니다")
    .required("이름을 입력해주세요"),
  email: yup
    .string()
    .email("올바른 이메일 형식이 아닙니다")
    .required("이메일을 입력해주세요"),
  password: yup
    .string()
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
    .required("비밀번호를 입력해주세요"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "비밀번호가 일치하지 않습니다")
    .required("비밀번호 확인을 입력해주세요"),
  // 숫자 입력
  age: yup
    .number()
    .min(18, "나이는 18세 이상이어야 합니다")
    .max(100, "나이는 100세 이하여야 합니다")
    .required("나이를 입력해주세요"),
  phone: yup
    .string()
    .matches(/^[0-9-]+$/, "올바른 전화번호 형식이 아닙니다")
    .min(10, "전화번호는 최소 10자 이상이어야 합니다")
    .required("전화번호를 입력해주세요"),
  // URL 입력
  website: yup.string().url("올바른 URL 형식이 아닙니다").optional(),
  // 날짜/시간 입력
  birthDate: yup.string().required("생년월일을 선택해주세요"),
  appointmentDate: yup.string().optional(),
  appointmentTime: yup.string().optional(),
  // 범위 입력
  satisfaction: yup.number().min(0).max(100).optional(),
  // 색상 선택
  favoriteColor: yup.string().optional(),
  // 파일 업로드
  avatar: yup
    .mixed<FileList>()
    .test("fileRequired", "파일을 선택해주세요", (value) => {
      return !value || (value instanceof FileList && value.length > 0);
    })
    .test("fileSize", "파일 크기는 5MB 이하여야 합니다", (value) => {
      if (!value || !(value instanceof FileList) || value.length === 0)
        return true;
      return value[0].size <= 5000000;
    })
    .optional(),
  // 체크박스
  agreeToTerms: yup.boolean().oneOf([true], "약관에 동의해주세요").required(),
  subscribeNewsletter: yup.boolean().optional(),
  // 라디오 버튼
  gender: yup
    .string<"male" | "female" | "other">()
    .oneOf(["male", "female", "other"], "성별을 선택해주세요")
    .required("성별을 선택해주세요"),
  // 셀렉트 드롭다운
  country: yup.string().required("국가를 선택해주세요"),
  // 텍스트 영역
  bio: yup.string().max(500, "자기소개는 500자 이하여야 합니다").optional(),
  // 검색 입력
  searchQuery: yup.string().optional(),
});

type FormValues = yup.InferType<typeof validationSchema>;

export default function FormikExample() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      age: 0,
      phone: "",
      website: "",
      birthDate: "",
      appointmentDate: "",
      appointmentTime: "",
      satisfaction: 50,
      favoriteColor: "#000000",
      avatar: undefined,
      agreeToTerms: false,
      subscribeNewsletter: false,
      gender: "male" as "male" | "female" | "other", // 초기값 설정
      country: "",
      bio: "",
      searchQuery: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setSubmitError(null);
        setSubmitSuccess(false);

        // 폼 제출 시뮬레이션 (로딩 처리)
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // 에러 시뮬레이션 (10% 확률)
        if (Math.random() < 0.1) {
          throw new Error("서버 오류가 발생했습니다. 다시 시도해주세요.");
        }

        console.log("제출된 데이터:", values);
        console.log("데이터 타입:", {
          name: typeof values.name,
          age: typeof values.age,
          email: typeof values.email,
          agreeToTerms: typeof values.agreeToTerms,
          gender: typeof values.gender,
          country: typeof values.country,
          satisfaction: typeof values.satisfaction,
        });

        setSubmitSuccess(true);
        alert(
          `제출 성공!\n이름: ${values.name}\n이메일: ${values.email}\n나이: ${values.age}`
        );
        resetForm();
      } catch (error) {
        setSubmitError(
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다"
        );
        console.error("제출 오류:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">
        Formik + Yup
      </h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        Form 상태: {formik.dirty ? "변경됨" : "초기"} | 유효성:{" "}
        {formik.isValid ? "✅ 통과" : "❌ 실패"} | 제출 중:{" "}
        {formik.isSubmitting ? "⏳" : "✓"}
      </p>

      {/* 전역 에러 메시지 */}
      {submitError && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 rounded">
          {submitError}
        </div>
      )}

      {/* 성공 메시지 */}
      {submitSuccess && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-400 text-green-700 dark:text-green-400 rounded">
          제출이 성공적으로 완료되었습니다!
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* 기본 텍스트 입력 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-black dark:text-white">
              이름 (text)
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
              이메일 (email)
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
        </div>

        {/* 비밀번호 입력 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-black dark:text-white">
              비밀번호 (password)
            </label>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
              placeholder="최소 8자 이상"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {formik.errors.password}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black dark:text-white">
              비밀번호 확인
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
              placeholder="비밀번호를 다시 입력하세요"
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {formik.errors.confirmPassword}
                </p>
              )}
          </div>
        </div>

        {/* 숫자 입력 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-black dark:text-white">
              나이 (number)
            </label>
            <input
              type="number"
              name="age"
              value={formik.values.age || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
              placeholder="18-100"
            />
            {formik.touched.age && formik.errors.age && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.age}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black dark:text-white">
              전화번호 (tel)
            </label>
            <input
              type="tel"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
              placeholder="010-1234-5678"
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.phone}</p>
            )}
          </div>
        </div>

        {/* URL 입력 */}
        <div>
          <label className="block text-sm font-medium mb-1 text-black dark:text-white">
            웹사이트 (url)
          </label>
          <input
            type="url"
            name="website"
            value={formik.values.website}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
            placeholder="https://example.com"
          />
          {formik.touched.website && formik.errors.website && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.website}</p>
          )}
        </div>

        {/* 날짜/시간 입력 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-black dark:text-white">
              생년월일 (date)
            </label>
            <input
              type="date"
              name="birthDate"
              value={formik.values.birthDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
            />
            {formik.touched.birthDate && formik.errors.birthDate && (
              <p className="mt-1 text-sm text-red-500">
                {formik.errors.birthDate}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black dark:text-white">
              예약 날짜/시간 (datetime-local)
            </label>
            <input
              type="datetime-local"
              name="appointmentDate"
              value={formik.values.appointmentDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
            />
            {formik.touched.appointmentDate &&
              formik.errors.appointmentDate && (
                <p className="mt-1 text-sm text-red-500">
                  {formik.errors.appointmentDate}
                </p>
              )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black dark:text-white">
              시간 (time)
            </label>
            <input
              type="time"
              name="appointmentTime"
              value={formik.values.appointmentTime}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
            />
            {formik.touched.appointmentTime &&
              formik.errors.appointmentTime && (
                <p className="mt-1 text-sm text-red-500">
                  {formik.errors.appointmentTime}
                </p>
              )}
          </div>
        </div>

        {/* 범위 입력 */}
        <div>
          <label className="block text-sm font-medium mb-1 text-black dark:text-white">
            만족도: {formik.values.satisfaction}% (range)
          </label>
          <input
            type="range"
            min="0"
            max="100"
            name="satisfaction"
            value={formik.values.satisfaction}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full"
          />
          {formik.touched.satisfaction && formik.errors.satisfaction && (
            <p className="mt-1 text-sm text-red-500">
              {formik.errors.satisfaction}
            </p>
          )}
        </div>

        {/* 색상 선택 */}
        <div>
          <label className="block text-sm font-medium mb-1 text-black dark:text-white">
            좋아하는 색상 (color)
          </label>
          <input
            type="color"
            name="favoriteColor"
            value={formik.values.favoriteColor}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full h-12 border border-gray-300 dark:border-zinc-700 rounded-md"
          />
          {formik.touched.favoriteColor && formik.errors.favoriteColor && (
            <p className="mt-1 text-sm text-red-500">
              {formik.errors.favoriteColor}
            </p>
          )}
        </div>

        {/* 파일 업로드 */}
        <div>
          <label className="block text-sm font-medium mb-1 text-black dark:text-white">
            프로필 사진 (file)
          </label>
          <input
            type="file"
            accept="image/*"
            name="avatar"
            onChange={(e) => {
              formik.setFieldValue("avatar", e.target.files);
            }}
            onBlur={formik.handleBlur}
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
          />
          {formik.touched.avatar && formik.errors.avatar && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.avatar}</p>
          )}
        </div>

        {/* 체크박스 */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-black dark:text-white">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formik.values.agreeToTerms}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-4 h-4"
            />
            <span>약관에 동의합니다 (checkbox) *</span>
          </label>
          {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
            <p className="text-sm text-red-500">{formik.errors.agreeToTerms}</p>
          )}

          <label className="flex items-center gap-2 text-black dark:text-white">
            <input
              type="checkbox"
              name="subscribeNewsletter"
              checked={formik.values.subscribeNewsletter}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-4 h-4"
            />
            <span>뉴스레터 구독 (checkbox)</span>
          </label>
        </div>

        {/* 라디오 버튼 */}
        <div>
          <label className="block text-sm font-medium mb-2 text-black dark:text-white">
            성별 (radio) *
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-black dark:text-white">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formik.values.gender === "male"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-4 h-4"
              />
              <span>남성</span>
            </label>
            <label className="flex items-center gap-2 text-black dark:text-white">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formik.values.gender === "female"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-4 h-4"
              />
              <span>여성</span>
            </label>
            <label className="flex items-center gap-2 text-black dark:text-white">
              <input
                type="radio"
                name="gender"
                value="other"
                checked={formik.values.gender === "other"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-4 h-4"
              />
              <span>기타</span>
            </label>
          </div>
          {formik.touched.gender && formik.errors.gender && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.gender}</p>
          )}
        </div>

        {/* 셀렉트 드롭다운 */}
        <div>
          <label className="block text-sm font-medium mb-1 text-black dark:text-white">
            국가 (select) *
          </label>
          <select
            name="country"
            value={formik.values.country}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
          >
            <option value="">선택하세요</option>
            <option value="kr">대한민국</option>
            <option value="us">미국</option>
            <option value="jp">일본</option>
            <option value="cn">중국</option>
            <option value="uk">영국</option>
          </select>
          {formik.touched.country && formik.errors.country && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.country}</p>
          )}
        </div>

        {/* 텍스트 영역 */}
        <div>
          <label className="block text-sm font-medium mb-1 text-black dark:text-white">
            자기소개 (textarea)
          </label>
          <textarea
            name="bio"
            value={formik.values.bio}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
            placeholder="자기소개를 입력하세요 (최대 500자)"
          />
          {formik.touched.bio && formik.errors.bio && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.bio}</p>
          )}
        </div>

        {/* 검색 입력 */}
        <div>
          <label className="block text-sm font-medium mb-1 text-black dark:text-white">
            검색 (search)
          </label>
          <input
            type="search"
            name="searchQuery"
            value={formik.values.searchQuery}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
            placeholder="검색어를 입력하세요"
          />
          {formik.touched.searchQuery && formik.errors.searchQuery && (
            <p className="mt-1 text-sm text-red-500">
              {formik.errors.searchQuery}
            </p>
          )}
        </div>

        {/* 제출 버튼 */}
        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {formik.isSubmitting ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>제출 중...</span>
              </>
            ) : (
              "제출"
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              formik.resetForm();
              setSubmitError(null);
              setSubmitSuccess(false);
            }}
            className="px-4 py-2 bg-gray-300 dark:bg-zinc-700 text-black dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-zinc-600"
          >
            초기화
          </button>
        </div>
      </form>
    </div>
  );
}
