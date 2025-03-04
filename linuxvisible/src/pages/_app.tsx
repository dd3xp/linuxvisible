import '../styles/Global.css'; // 导入全局样式
import type { AppProps } from 'next/app'
 
export default function App({ Component, pageProps }: AppProps) {
  return <>
  <Component {...pageProps} />
  </>
}
