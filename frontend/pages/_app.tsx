import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { useRouter } from 'next/router';
import GlobalLayout from '../components/layout/GlobalLayout';
import { CurrencyProvider } from '../context/CurrencyContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Routes that shouldn't use the GlobalLayout shell
  const noLayoutRoutes = ['/login', '/onboarding'];
  const shouldUseLayout = !noLayoutRoutes.includes(router.pathname);

  return (
    <CurrencyProvider>
      <div className={`${inter.variable} font-sans`}>
        {shouldUseLayout ? (
          <GlobalLayout>
            <Component {...pageProps} />
          </GlobalLayout>
        ) : (
          <Component {...pageProps} />
        )}
      </div>
    </CurrencyProvider>
  );
}
