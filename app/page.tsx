import Link from "next/link";

export default function Home() {
  const pages = [
    {
      title: "비교 페이지",
      description: "React Hook Form + Zod vs Formik + Yup 비교",
      href: "/comparison",
      color: "bg-gradient-to-br from-blue-500 to-purple-600",
    },
    {
      title: "React Hook Form",
      description: "성능 최적화된 form 상태 관리 라이브러리",
      href: "/react-hook-form",
      color: "bg-gradient-to-br from-blue-500 to-cyan-500",
    },
    {
      title: "Formik",
      description: "직관적인 API의 form 상태 관리 라이브러리",
      href: "/formik",
      color: "bg-gradient-to-br from-green-500 to-emerald-500",
    },
    {
      title: "Yup",
      description: "JavaScript/TypeScript 스키마 검증 라이브러리",
      href: "/yup",
      color: "bg-gradient-to-br from-yellow-500 to-orange-500",
    },
    {
      title: "Zod",
      description: "TypeScript-first 스키마 검증 라이브러리",
      href: "/zod",
      color: "bg-gradient-to-br from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-4 text-black dark:text-white">
          React Form 상태 관리 가이드
        </h1>
        <p className="text-center mb-12 text-lg text-zinc-600 dark:text-zinc-400">
          다양한 Form 상태 관리 라이브러리를 학습하고 비교해보세요
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="group block p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div
                className={`${page.color} w-16 h-16 rounded-lg mb-4 flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform`}
              >
                {page.title.charAt(0)}
              </div>
              <h2 className="text-2xl font-bold mb-2 text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {page.title}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                {page.description}
              </p>
              <div className="mt-4 text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-2 transition-transform">
                자세히 보기 →
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
            각 페이지에서 확인할 수 있는 내용
          </h2>
          <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
            <li>✓ <strong>동작원리:</strong> 라이브러리가 어떻게 작동하는지 설명</li>
            <li>✓ <strong>구현방법:</strong> 설치부터 기본 사용법, 고급 기능까지</li>
            <li>✓ <strong>활용예시:</strong> 실제 동작하는 예제 코드</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
