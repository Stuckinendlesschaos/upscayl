import { AppProps } from 'next/app'
import { Provider } from 'jotai'
import Head from 'next/head'
import '../styles/globals.css'
import '../styles/tabs.css'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>剪佳</title>
      </Head>
      <Provider>
        <Component {...pageProps} data-theme="dark" />
      </Provider>
    </>
  )
}

export default MyApp
