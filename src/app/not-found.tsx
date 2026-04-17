import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 py-20 text-center">
      <h1 className="text-6xl sm:text-8xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 mb-4 drop-shadow-lg">
        404
      </h1>
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
        لقد أضعت طريقك في درب الثعبان!
      </h2>
      <p className="text-slate-400 max-w-md mb-8">
        يبدو أن هذه الصفحة قد دمرها هجوم ماكونكوسابو. لا تقلق، يمكنك العودة للأرض بأمان.
      </p>
      <Link 
        href="/"
        className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg border border-slate-700"
      >
        العودة للرئيسية
      </Link>
    </div>
  );
}
