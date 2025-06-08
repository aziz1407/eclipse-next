import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import TabProperties from '../libs/components/homepage/TabProperties';
import TopAgents from '../libs/components/homepage/TopAgents';
import Category from '../libs/components/homepage/Category';
import SpecialOffers from '../libs/components/homepage/SpecialOffers';
import { Stack } from '@mui/material';
import Advertisement from '../libs/components/homepage/Advertisement';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>
				<SpecialOffers />
				<TabProperties />
				<Advertisement />
				<TopAgents />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<SpecialOffers />
				<Category />
				<Advertisement />
				<TabProperties />
				<TopAgents />
				<CommunityBoards />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
