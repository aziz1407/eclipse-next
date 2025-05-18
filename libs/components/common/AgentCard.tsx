import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Box, Typography } from '@mui/material';
import Link from 'next/link';
import { REACT_APP_API_URL } from '../../config';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface AgentCardProps {
	agent: any;
	likeMemberHandler: any;
}

const AgentCard = (props: AgentCardProps) => {
	const { agent, likeMemberHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath: string = agent?.memberImage
		? `${REACT_APP_API_URL}/${agent?.memberImage}`
		: '/img/profile/defaultUser.svg';

	if (device === 'mobile') {
		return (
			<div className="agent-general-card">
				<div className="agent-img" style={{ backgroundImage: `url(${imagePath})` }}>
					<div>{agent?.memberProperties} properties</div>
				</div>
				<div className="agent-desc">
					<div className="agent-info">
						<Link href={`/agent/${agent?._id}`} passHref>
							<strong>{agent?.memberFullName ?? agent?.memberNick}</strong>
						</Link>
						<span>Agent</span>
					</div>
					<div className="buttons">
						<RemoveRedEyeIcon />
						<span className="view-cnt">{agent?.memberViews}</span>
						<IconButton onClick={() => likeMemberHandler(user, agent?._id)}>
							{agent?.meLiked && agent?.meLiked[0]?.myFavorite ? (
								<FavoriteIcon color="error" />
							) : (
								<FavoriteBorderIcon />
							)}
						</IconButton>
						<span>{agent?.memberLikes}</span>
					</div>
				</div>
			</div>
		);
	} else {
		return (
			<div className="agent-general-card">
				<div className="agent-img" style={{ backgroundImage: `url(${imagePath})` }}>
					<div className="watch-count">{agent?.memberProperties} watches</div>
				</div>
				<div className="agent-desc">
					<div className="agent-info">
						<Link href={`/agent/detail?${agent?._id}`} passHref>
							<strong>{agent?.memberFullName ?? agent?.memberNick}</strong>
						</Link>
						<span>Dealer</span>
					</div>
					<div className="buttons">
						<RemoveRedEyeIcon sx={{ color: '#fafafa' }} />

						<span className="view-cnt">{agent?.memberViews}</span>
						<IconButton onClick={() => likeMemberHandler(user, agent?._id)} className="like-button">
							{agent?.meLiked && agent?.meLiked[0]?.myFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
						</IconButton>

						<span style={{ color: '#fafafa' }}>{agent?.memberLikes}</span>
					</div>
				</div>
			</div>
		);
	}
};

export default AgentCard;
