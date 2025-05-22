// @ts-ignore
function MyApp({ Component, pageProps }) {
    // Component represents the current page being rendered (e.g., HomePage, HelloPage)
    // pageProps are the props passed to that page component (e.g., from getServerSideProps)
    return <Component {...pageProps} />;
}

export default MyApp;