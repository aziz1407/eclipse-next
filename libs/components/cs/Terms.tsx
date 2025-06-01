import React, { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ArticleIcon from '@mui/icons-material/Article';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useQuery } from '@apollo/client';
import { GET_ALL_NOTICES } from '../../../apollo/user/query';
import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';
import CircularProgress from '@mui/material/CircularProgress';

const Terms = () => {
	const device = useDeviceDetect();
	const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

	const toggleTerm = (termId: string) => {
		setExpandedTerm(expandedTerm === termId ? null : termId);
	};

	const { data: termsData, loading } = useQuery(GET_ALL_NOTICES, {
		variables: {
			input: {
				noticeCategory: NoticeCategory.TERMS,
				noticeStatus: NoticeStatus.ACTIVE,
			},
		},
	});

	if (device === 'mobile') {
		return <div>TERMS MOBILE</div>;
	}

	if (loading) {
		return (
			<Box sx={{ 
				display: 'flex', 
				justifyContent: 'center', 
				alignItems: 'center', 
				minHeight: '400px',
				background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)'
			}}>
				<CircularProgress sx={{ color: '#DAA520' }} />
			</Box>
		);
	}

	const terms = termsData?.getAllNotices?.list.slice().reverse() || [];

	return (
		<Stack 
			className={'terms-content'}
			sx={{
				minHeight: '100vh',
				p: 1,
			}}
		>
			<Box
				sx={{
					borderRadius: '8px',
					border: '1px solid rgba(218, 165, 32, 0.2)',
					overflow: 'hidden',
				}}
			>
				{terms.map((term: any, index: number) => (
					<Box key={term._id}>
						<Box
							onClick={() => toggleTerm(term._id)}
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: 2,
								p: 2,
								position: 'relative',
								cursor: 'pointer',
								transition: 'all 0.3s ease',
								'&:hover': {
									background: 'rgba(218, 165, 32, 0.1)',
								},
								'&::before': {
									content: '""',
									position: 'absolute',
									left: 0,
									top: 0,
									bottom: 0,
									width: '4px',
									background: '#DAA520',
								}
							}}
						>
							<Box sx={{
								background: '#DAA520',
								borderRadius: '6px',
								p: 0.5,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								minWidth: '28px',
								height: '28px',
							}}>
								<ArticleIcon sx={{ color: '#FFFFFF', fontSize: '1rem' }} />
							</Box>
							<Typography sx={{ 
								color: '#FFFFFF', 
								fontWeight: 600, 
								fontSize: '1rem',
								flex: 1,
								letterSpacing: '-0.01em',
							}}>
								{term.noticeTitle}
							</Typography>
							<ExpandMoreIcon 
								sx={{ 
									color: '#DAA520',
									transform: expandedTerm === term._id ? 'rotate(180deg)' : 'rotate(0deg)',
									transition: 'transform 0.3s ease',
								}} 
							/>
						</Box>
						
						{/* Collapsible Content */}
						<Box sx={{
							maxHeight: expandedTerm === term._id ? '200px' : '0px',
							overflow: 'hidden',
							transition: 'max-height 0.3s ease-in-out',
							borderBottom: index < terms.length - 1 ? '1px solid rgba(218, 165, 32, 0.1)' : 'none',
						}}>
							<Box sx={{ 
								p: 2,
							}}>
								<Typography sx={{ 
									color: '#CBD5E1', 
									lineHeight: 1.8,
									fontSize: '0.9rem',
									fontWeight: 400,
								}}>
									{term.noticeContent}
								</Typography>
							</Box>
						</Box>
					</Box>
				))}
				
				{terms.length === 0 && (
					<Box sx={{ 
						p: 4,
						textAlign: 'center',
						background: 'rgba(10, 10, 10, 0.3)',
					}}>
						<ArticleIcon sx={{ 
							color: '#64748B', 
							fontSize: '3rem',
							mb: 1.5,
							opacity: 0.5,
						}} />
						<Typography sx={{ 
							color: '#64748B', 
							fontSize: '1rem',
							fontWeight: 500,
						}}>
							No terms and conditions available at the moment
						</Typography>
					</Box>
				)}
			</Box>
		</Stack>
	);
};

export default Terms;