import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
    // Component represents the current page being rendered (e.g., HomePage, HelloPage)
    // pageProps are the props passed to that page component (e.g., from getServerSideProps)
    return <Component {...pageProps} />;
}

export default MyApp;