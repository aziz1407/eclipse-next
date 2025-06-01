import React from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { GET_ALL_NOTICES, GET_NOTICE } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { AllNoticesInquiry, typeNotice } from '../../types/notice/notice';

interface NoticeProps {
	initialInput: AllNoticesInquiry;
}

const Notice = (props: NoticeProps) => {
	const device = useDeviceDetect();
	const { initialInput } = props;

	/** APOLLO REQUESTS **/
	const {
			loading: getAllNoticesLoading,
			data: getAllNoticesData,
			error: getAllNoticesError,
			refetch: getAllNoticesRefetch,
		} = useQuery(GET_ALL_NOTICES, {
			fetchPolicy: 'cache-and-network',
			variables: { input: initialInput },
		});

	/** LIFECYCLES **/
	/** HANDLERS **/

	

	if (device === 'mobile') {
		return <div>NOTICE MOBILE</div>;
	} else {
		return (
			<Stack className={'notice-content'}>
				<span className={'title'}>Notice</span>
				<Stack className={'main'}>
					<Box component={'div'} className={'top'}>
						<span>number</span>
						<span>title</span>
						<span>date</span>
					</Box>
					<Stack className={'bottom'}>
						{getAllNoticesData?.getAllNotices?.list?.map((ele: typeNotice) => (
							<div className={`notice-card ${ele?.noticeCategory && 'event'}`} key={ele._id}>
								{ele?.noticeCategory ? <div>event</div> : <span className={'notice-number'}></span>}
								<span className={'notice-title'}>{ele.noticeTitle}</span>
								{/* <span className={'notice-date'}>{ele.createdAt}</span> */}
							</div>
						))}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};


Notice.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
	},
};

export default Notice;
