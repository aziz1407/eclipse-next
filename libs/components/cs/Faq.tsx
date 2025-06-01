import React, { SyntheticEvent, useState } from 'react';
import { Box, Stack, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useQuery } from '@apollo/client';
import { GET_ALL_NOTICES } from '../../../apollo/user/query';
import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';
import CircularProgress from '@mui/material/CircularProgress';

const Faq = () => {
	const device = useDeviceDetect();
	const [expanded, setExpanded] = useState<string | false>('panel1');

	const { data: faqData, loading } = useQuery(GET_ALL_NOTICES, {
		variables: {
			input: {
				noticeCategory: NoticeCategory.FAQ,
				noticeStatus: NoticeStatus.ACTIVE,
			},
		},
	});

	const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false);
	};

	if (device === 'mobile') {
		return <div>FAQ MOBILE</div>;
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

	const faqs = faqData?.getAllNotices?.list.slice().reverse() || [];

	return (
		<Stack 
			className={'faq-content'}
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
				{faqs.map((faq: any, index: number) => (
					<Accordion
						key={faq._id}
						expanded={expanded === `panel${index + 1}`}
						onChange={handleChange(`panel${index + 1}`)}
						sx={{
							'&.MuiAccordion-root': {
								background: 'transparent',
								borderRadius: 0,
								mb: 0,
								overflow: 'hidden',
								border: 'none',
								borderBottom: index < faqs.length - 1 ? '1px solid rgba(218, 165, 32, 0.1)' : 'none',
								boxShadow: 'none',
								'&:before': {
									display: 'none',
								},
								'&.Mui-expanded': {
									margin: 0,
								},
							},
						}}
					>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon sx={{ color: '#DAA520' }} />}
							sx={{
								background: 'transparent',
								minHeight: '64px',
								transition: 'all 0.3s ease',
								'&:hover': {
									background: 'rgba(218, 165, 32, 0.1)',
								},
								'&.Mui-expanded': {
									background: 'rgba(218, 165, 32, 0.05)',
								},
								'& .MuiAccordionSummary-content': {
									margin: '12px 0',
								},
								position: 'relative',
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
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pl: 2 }}>
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
									<HelpOutlineIcon sx={{ color: '#FFFFFF', fontSize: '1rem' }} />
								</Box>
								<Typography sx={{ 
									color: '#FFFFFF', 
									fontWeight: 600,
									fontSize: '1rem',
									letterSpacing: '-0.01em',
									flex: 1,
								}}>
									{faq.noticeTitle}
								</Typography>
							</Box>
						</AccordionSummary>
						<AccordionDetails
							sx={{
								background: 'transparent',
								p: 0,
								borderTop: 'none',
							}}
						>
							<Box sx={{ pl: 6, pr: 2, pb: 2 }}>
								<Typography sx={{ 
									color: '#CBD5E1', 
									lineHeight: 1.8,
									fontSize: '0.9rem',
									fontWeight: 400,
									mt: "10px",
								}}>
									{faq.noticeContent}
								</Typography>
							</Box>
						</AccordionDetails>
					</Accordion>
				))}
				
				{faqs.length === 0 && (
					<Box sx={{ 
						p: 4,
						textAlign: 'center',
						background: 'rgba(10, 10, 10, 0.3)',
					}}>
						<HelpOutlineIcon sx={{ 
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
							No frequently asked questions available at the moment
						</Typography>
					</Box>
				)}
			</Box>
		</Stack>
	);
};

export default Faq;