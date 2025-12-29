import ReactHookFormExample from "./components/ReactHookFormExample";
import FormikExample from "./components/FormikExample";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-black dark:text-white">
          React Form 상태 관리 비교
        </h1>
        <p className="text-center mb-12 text-zinc-600 dark:text-zinc-400">
          두 가지 인기 있는 Form 상태 관리 라이브러리 조합을 비교해보세요
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ReactHookFormExample />
          <FormikExample />
        </div>

        <div className="mt-12 max-w-4xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
            라이브러리 특징 비교
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">
                React Hook Form + Zod
              </h3>
              <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
                <li>✓ 성능 최적화 (uncontrolled components)</li>
                <li>✓ 작은 번들 사이즈</li>
                <li>✓ TypeScript 우수한 지원</li>
                <li>✓ Zod는 강력한 타입 안전성</li>
                <li>✓ 적은 리렌더링</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-green-600 dark:text-green-400">
                Formik + Yup
              </h3>
              <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
                <li>✓ 직관적인 API</li>
                <li>✓ 풍부한 생태계</li>
                <li>✓ Yup은 성숙한 검증 라이브러리</li>
                <li>✓ 많은 예제와 문서</li>
                <li>✓ 복잡한 폼에 적합</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
