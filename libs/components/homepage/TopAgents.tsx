import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { Stack } from '@mui/material';
import { Member } from '../../types/member/member';
import { AgentsInquiry } from '../../types/member/member.input';
import { T } from '../../types/common';
import { GET_AGENTS } from '../../../apollo/user/query';

interface TopAgentsProps {
	initialInput: AgentsInquiry;
}

const getDealerImage = (imagePath?: string) => {
	return imagePath ? `${process.env.REACT_APP_API_URL}/${imagePath}` : '/img/profile/defaultUser.svg';
};

const TopAgents = ({ initialInput }: TopAgentsProps) => {
	const router = useRouter();
	const [topAgents, setTopAgents] = useState<Member[]>([]);

	const { loading } = useQuery(GET_AGENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTopAgents(data?.getDealers?.list || []);
		},
	});

	const getStarClass = (i: number, stars: number) => {
		if (i < Math.floor(stars)) return 'full';
		if (stars > i && stars < i + 1) return 'half';
		return 'empty';
	};

	const getDescriptionByRank = (rank: number) => {
		if (rank >= 15) {
			return 'Elite dealer with outstanding performance and unmatched expertise.';
		}
		if (rank >= 10) {
			return 'Trusted dealer with proven reliability and customer satisfaction.';
		}
		return 'Upcoming dealer, eager to serve and grow with the community.';
	};

	const handleNavigate = (memberId: string) => {
		router.push(`/agent/detail?agentId=${memberId}`);
	};

	return (
		<Stack className="topAgents">
			<div className="topAgents-container">
				<div className="topAgents-header">
					<div className="left">
						<span>Meet the Elite</span>
						<p>Exceptional dealers. Unrivaled service.</p>
					</div>
					<div
						className="right"
						onClick={() =>
							router.push('/agent?input={"page":1,"limit":10,"sort":"createdAt","direction":"DESC","search":{}}')
						}
					>
						<span>See All Dealers...</span>
					</div>
				</div>

				<div className="cardGrid">
					{topAgents.map((agent) => {
						const stars = agent.memberRank >= 15 ? 5 : agent.memberRank >= 10 ? 3 : 0;
						const imageUrl = getDealerImage(agent.memberImage);

						return (
							<div
								key={agent._id}
								className="card"
								onClick={() => handleNavigate(agent._id)}
								style={{ cursor: 'pointer' }}
								role="button"
								tabIndex={0}
								onKeyDown={(e) => {
									if (e.key === 'Enter') handleNavigate(agent._id);
								}}
							>
								<img src={imageUrl} alt={agent.memberNick} className="image" />
								<div className="stars">
									{Array.from({ length: 5 }).map((_, i) => (
										<span key={i} className={getStarClass(i, stars)}>
											★
										</span>
									))}
								</div>

								<p className="desc">{getDescriptionByRank(agent.memberRank)}</p>

								<hr className="divider" />

								<p
									className="name"
									onClick={(e) => {
										e.stopPropagation();
										handleNavigate(agent._id);
									}}
								>
									{agent.memberNick}
								</p>
								<p className="role">DEALER</p>
							</div>
						);
					})}
				</div>
			</div>

			<style jsx>{`
				.card {
					background: #f4efe7;
					padding: 20px;
					border-radius: 10px;
					box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
					text-align: center;
					max-width: 350px;
					margin: 10px;
				}
				.image {
					width: 120px;
					height: 120px;
					object-fit: cover;
					border-radius: 50%;
					margin-bottom: 15px;
					box-shadow: 0 0 8px rgba(223, 226, 17, 0.5);
				}
				.stars span {
					font-size: 20px;
					margin: 0 2px;
					color: #ddd;
				}
				.stars span.full {
					color: #ffb400;
				}
				.stars span.half {
					color: #ffb400;
					position: relative;
				}
				.stars span.empty {
					color: #ddd;
				}
				.desc {
					font-style: italic;
					color: #555;
					margin-bottom: 10px;
					min-height: 50px;
				}
				.divider {
					border: 0;
					height: 2px;
					width: 50px;
					background: linear-gradient(90deg, rgb(8, 8, 8), rgb(8, 0, 14));
					margin: 0 auto 15px auto;
					border-radius: 10px;
				}
				.name {
					font-weight: 700;
					font-size: 1.1rem;
					margin-bottom: 5px;
					color: #222;
					transition: color 0.3s ease;
				}
				.name:hover {
					color: goldenrod;
					text-decoration: underline;
					cursor: pointer;
				}
				.role {
					font-size: 0.85rem;
					color: #666;
					letter-spacing: 1.5px;
				}
			`}</style>
		</Stack>
	);
};

TopAgents.defaultProps = {
	initialInput: {
		page: 1,
		limit: 3,
		sort: 'memberRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopAgents;
