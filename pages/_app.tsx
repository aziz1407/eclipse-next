import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React, { useState } from 'react';
import { light } from '../scss/MaterialTheme';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import { appWithTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import '../scss/app.scss';
import '../scss/pc/main.scss';
import '../scss/mobile/main.scss';

const Toaster = dynamic(
	() => import('sonner').then((mod) => mod.Toaster),
	{ ssr: false }
);

const App = ({ Component, pageProps }: AppProps) => {
	// @ts-ignore
	const [theme, setTheme] = useState(createTheme(light));
	const client = useApollo(pageProps.initialApolloState);

	return (
		<ApolloProvider client={client}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Component {...pageProps} />
				<Toaster 
					position="bottom-right"
					richColors
					closeButton={false}
					expand={true}
					visibleToasts={5}
				/>
			</ThemeProvider>
		</ApolloProvider>
	);
};

export default appWithTranslation(App);