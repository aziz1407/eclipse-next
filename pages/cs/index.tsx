import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Box, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SupportIcon from '@mui/icons-material/Support';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ArticleIcon from '@mui/icons-material/Article';
import { useTranslation } from 'next-i18next';
import Notice from '../../libs/components/cs/Notice';
import Terms from '../../libs/components/cs/Terms';
import Faq from '../../libs/components/cs/Faq';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CS: NextPage = (props: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const tab = router.query.tab ?? 'notice';
	const { t } = useTranslation('common');

	const changeTabHandler = (tab: string) => {
		router.push(
			{
				pathname: '/cs',
				query: { tab: tab },
			},
			undefined,
			{ scroll: false },
		);
	};

	if (device === 'mobile') {
		return <h1>CS PAGE MOBILE</h1>;
	}

	return (
		<div id="pc-wrap">
			<Stack className={'cs-page'}>
				<Stack className={'container'}>
					<Box className={'cs-main-info'}>
						<Box className={'info'}>
							<Typography component="span" style={{ color: 'white' }}>{t('Customer Support')}</Typography>
							<Typography component="p" style={{ color: 'white' }}>
							</Typography>
						</Box>

						<Box className={'btns'}>
							<div 
								className={tab === 'notice' ? 'active' : ''} 
								onClick={() => changeTabHandler('notice')}
								style={{ 
									backgroundColor: tab === 'notice' ? '#DAA520' : '',
									color: 'white'
								}}
							>
								<SupportIcon />
								{t('Notices & Updates')}
							</div>
							<div 
								className={tab === 'faq' ? 'active' : ''} 
								onClick={() => changeTabHandler('faq')}
								style={{ 
									backgroundColor: tab === 'faq' ? '#DAA520' : '',
									color: 'white'
								}}
							>
								<QuestionAnswerIcon />
								{t('FAQ')}	
							</div>
							<div 
								className={tab === 'terms' ? 'active' : ''} 
								onClick={() => changeTabHandler('terms')}
								style={{ 
									backgroundColor: tab === 'terms' ? '#DAA520' : '',
									color: 'white'
								}}
							>
								<ArticleIcon />
								{t('Terms & Conditions')}
							</div>
						</Box>
					</Box>

					<Box className={'cs-content'}>
						{tab === 'notice' && <Notice />}
						{tab === 'faq' && <Faq />}
						{tab === 'terms' && <Terms />}
					</Box>
				</Stack>
			</Stack>
		</div>
	);
};

export default withLayoutBasic(CS);