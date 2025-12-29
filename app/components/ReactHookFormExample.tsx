"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

// Zod 스키마 정의 - 모든 Form 입력 타입 포함
const formSchema = z
  .object({
    // 기본 텍스트 입력
    name: z.string().min(2, "이름은 최소 2자 이상이어야 합니다"),
    email: z.string().email("올바른 이메일 형식이 아닙니다"),
    password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다"),
    confirmPassword: z.string(),
    // 숫자 입력
    age: z
      .number()
      .min(18, "나이는 18세 이상이어야 합니다")
      .max(100, "나이는 100세 이하여야 합니다"),
    phone: z
      .string()
      .regex(/^[0-9-]+$/, "올바른 전화번호 형식이 아닙니다")
      .min(10, "전화번호는 최소 10자 이상이어야 합니다"),
    // URL 입력
    website: z
      .string()
      .url("올바른 URL 형식이 아닙니다")
      .optional()
      .or(z.literal("")),
    // 날짜/시간 입력
    birthDate: z.string().min(1, "생년월일을 선택해주세요"),
    appointmentDate: z.string().optional(),
    appointmentTime: z.string().optional(),
    // 범위 입력
    satisfaction: z.number().min(0).max(100).optional(),
    // 색상 선택
    favoriteColor: z.string().optional(),
    // 파일 업로드
    avatar: z
      .instanceof(FileList)
      .refine((files) => files.length > 0, "파일을 선택해주세요")
      .refine(
        (files) => files[0]?.size <= 5000000,
        "파일 크기는 5MB 이하여야 합니다"
      )
      .optional(),
    // 체크박스
    agreeToTerms: z
      .boolean()
      .refine((val) => val === true, "약관에 동의해주세요"),
    subscribeNewsletter: z.boolean().optional(),
    // 라디오 버튼
    gender: z.enum(["male", "female", "other"], {
      message: "성별을 선택해주세요",
    }),
    // 셀렉트 드롭다운
    country: z.string().min(1, "국가를 선택해주세요"),
    // 텍스트 영역
    bio: z.string().max(500, "자기소개는 500자 이하여야 합니다").optional(),
    // 검색 입력
    searchQuery: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

export default function ReactHookFormExample() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // 실시간 유효성 검사
    defaultValues: {
      agreeToTerms: false,
      subscribeNewsletter: false,
      satisfaction: 50,
    },
  });

  // 실시간 값 감시 (디버깅용)
  const watchedValues = watch();

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitError(null);
      setSubmitSuccess(false);

      // 폼 제출 시뮬레이션 (로딩 처리)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 에러 시뮬레이션 (10% 확률)
      if (Math.random() < 0.1) {
        throw new Error("서버 오류가 발생했습니다. 다시 시도해주세요.");
      }

      console.log("제출된 데이터:", data);
      console.log("데이터 타입:", {
        name: typeof data.name,
        age: typeof data.age,
        email: typeof data.email,
        agreeToTerms: typeof data.agreeToTerms,
        gender: typeof data.gender,
        country: typeof data.country,
        satisfaction: typeof data.satisfaction,
      });

      setSubmitSuccess(true);
      alert(
        `제출 성공!\n이름: ${data.name}\n이메일: ${data.email}\n나이: ${data.age}`
      );
      reset();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다"
      );
      console.error("제출 오류:", error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">
        React Hook Form + Zod
      </h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        Form 상태: {isDirty ? "변경됨" : "초기"} | 유효성:{" "}
        {isValid ? "✅ 통과" : "❌ 실패"} | 제출 중: {isSubmitting ? "⏳" : "✓"}
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 기본 텍스트 입력 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-black dark:text-white">
              이름 (text)
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
              placeholder="이름을 입력하세요"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black dark:text-white">
              이메일 (email)
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
        </div>

        {/* 비밀번호 입력 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-black dark:text-white">
              비밀번호 (password)
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
              placeholder="최소 8자 이상"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black dark:text-white">
              비밀번호 확인
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
              placeholder="비밀번호를 다시 입력하세요"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword.message}
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
              {...register("age", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
              placeholder="18-100"
            />
            {errors.age && (
              <p className="mt-1 text-sm text-red-500">{errors.age.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black dark:text-white">
              전화번호 (tel)
            </label>
            <input
              type="tel"
              {...register("phone")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
              placeholder="010-1234-5678"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">
                {errors.phone.message}
              </p>
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
            {...register("website")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
            placeholder="https://example.com"
          />
          {errors.website && (
            <p className="mt-1 text-sm text-red-500">
              {errors.website.message}
            </p>
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
              {...register("birthDate")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
            />
            {errors.birthDate && (
              <p className="mt-1 text-sm text-red-500">
                {errors.birthDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black dark:text-white">
              예약 날짜/시간 (datetime-local)
            </label>
            <input
              type="datetime-local"
              {...register("appointmentDate")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
            />
            {errors.appointmentDate && (
              <p className="mt-1 text-sm text-red-500">
                {errors.appointmentDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black dark:text-white">
              시간 (time)
            </label>
            <input
              type="time"
              {...register("appointmentTime")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
            />
            {errors.appointmentTime && (
              <p className="mt-1 text-sm text-red-500">
                {errors.appointmentTime.message}
              </p>
            )}
          </div>
        </div>

        {/* 범위 입력 */}
        <div>
          <label className="block text-sm font-medium mb-1 text-black dark:text-white">
            만족도: {watchedValues.satisfaction}% (range)
          </label>
          <input
            type="range"
            min="0"
            max="100"
            {...register("satisfaction", { valueAsNumber: true })}
            className="w-full"
          />
          {errors.satisfaction && (
            <p className="mt-1 text-sm text-red-500">
              {errors.satisfaction.message}
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
            {...register("favoriteColor")}
            className="w-full h-12 border border-gray-300 dark:border-zinc-700 rounded-md"
          />
          {errors.favoriteColor && (
            <p className="mt-1 text-sm text-red-500">
              {errors.favoriteColor.message}
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
            {...register("avatar")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
          />
          {errors.avatar && (
            <p className="mt-1 text-sm text-red-500">{errors.avatar.message}</p>
          )}
        </div>

        {/* 체크박스 */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-black dark:text-white">
            <input
              type="checkbox"
              {...register("agreeToTerms")}
              className="w-4 h-4"
            />
            <span>약관에 동의합니다 (checkbox) *</span>
          </label>
          {errors.agreeToTerms && (
            <p className="text-sm text-red-500">
              {errors.agreeToTerms.message}
            </p>
          )}

          <label className="flex items-center gap-2 text-black dark:text-white">
            <input
              type="checkbox"
              {...register("subscribeNewsletter")}
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
                value="male"
                {...register("gender")}
                className="w-4 h-4"
              />
              <span>남성</span>
            </label>
            <label className="flex items-center gap-2 text-black dark:text-white">
              <input
                type="radio"
                value="female"
                {...register("gender")}
                className="w-4 h-4"
              />
              <span>여성</span>
            </label>
            <label className="flex items-center gap-2 text-black dark:text-white">
              <input
                type="radio"
                value="other"
                {...register("gender")}
                className="w-4 h-4"
              />
              <span>기타</span>
            </label>
          </div>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-500">{errors.gender.message}</p>
          )}
        </div>

        {/* 셀렉트 드롭다운 */}
        <div>
          <label className="block text-sm font-medium mb-1 text-black dark:text-white">
            국가 (select) *
          </label>
          <select
            {...register("country")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
          >
            <option value="">선택하세요</option>
            <option value="kr">대한민국</option>
            <option value="us">미국</option>
            <option value="jp">일본</option>
            <option value="cn">중국</option>
            <option value="uk">영국</option>
          </select>
          {errors.country && (
            <p className="mt-1 text-sm text-red-500">
              {errors.country.message}
            </p>
          )}
        </div>

        {/* 텍스트 영역 */}
        <div>
          <label className="block text-sm font-medium mb-1 text-black dark:text-white">
            자기소개 (textarea)
          </label>
          <textarea
            {...register("bio")}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
            placeholder="자기소개를 입력하세요 (최대 500자)"
          />
          {errors.bio && (
            <p className="mt-1 text-sm text-red-500">{errors.bio.message}</p>
          )}
        </div>

        {/* 검색 입력 */}
        <div>
          <label className="block text-sm font-medium mb-1 text-black dark:text-white">
            검색 (search)
          </label>
          <input
            type="search"
            {...register("searchQuery")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
            placeholder="검색어를 입력하세요"
          />
          {errors.searchQuery && (
            <p className="mt-1 text-sm text-red-500">
              {errors.searchQuery.message}
            </p>
          )}
        </div>

        {/* 제출 버튼 */}
        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
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
              reset();
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
