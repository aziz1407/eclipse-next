import React from 'react';
import { useRouter } from 'next/router';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';

interface TopAgentProps {
	dealer: Member;
}
const TopAgentCard = (props: TopAgentProps) => {
	const { dealer: dealer } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const dealerImage = dealer?.memberImage
		? `${process.env.REACT_APP_API_URL}/${dealer?.memberImage}`
		: '/img/profile/defaultUser.svg';

	/** HANDLERS **/

	if (device === 'mobile') {
		return (
			<Stack className="top-agent-card">
				<img src={dealerImage} alt="" />

				<strong>{dealer?.memberNick}</strong>
				<span>{dealer?.memberType}</span>
			</Stack>
		);
	} else {
		return (
			<Stack className="top-agent-card">
				<img src={dealerImage} alt="" />

				<strong>{dealer?.memberNick}</strong>
				<span>{dealer?.memberType}</span>
			</Stack>
		);
	}
};

export default TopAgentCard;
