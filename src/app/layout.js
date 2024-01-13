import './globals.css';

export const metadata = {
  title: '메인 | 투두',
  description: '할일관리서비스입니다.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body> {children} </body>
    </html>
  );
}
