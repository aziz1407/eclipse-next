import React, { useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { MyPropertyCard } from './MyPropertyCard';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { Property } from '../../types/property/property';
import { AgentPropertiesInquiry } from '../../types/property/property.input';
import { T } from '../../types/common';
import { WatchStatus } from '../../enums/property.enum';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { UPDATE_PROPERTY } from '../../../apollo/user/mutation';
import { GET_AGENT_PROPERTIES } from '../../../apollo/user/query';
import { sweetConfirmAlert, sweetErrorHandling } from '../../sweetAlert';

const MyProperties: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const [searchFilter, setSearchFilter] = useState<AgentPropertiesInquiry>(initialInput);
	const [agentProperties, setAgentProperties] = useState<Property[]>([]);
	const [total, setTotal] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** APOLLO REQUESTS **/
	const [updateProperty] = useMutation(UPDATE_PROPERTY);

	const {
		loading: getAgentPropertiesLoading,
		data: getAgentPropertiesData,
		error: getAgentPropertiesError,
		refetch: getAgentPropertiesRefetch,
	} = useQuery(GET_AGENT_PROPERTIES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data) => {
			setAgentProperties(data?.getAgentProperties?.list);
			setTotal(data?.getAgentProperties?.metaCounter[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const changeStatusHandler = (value: WatchStatus) => {
		setSearchFilter({ ...searchFilter, search: { propertyStatus: value } });
	};

	const deletePropertyHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to delete this property?')) {
				await updateProperty({
					variables: {
						input: {
							_id: id,
							propertyStatus: 'DELETE',
						},
					},
				});
			}
			await getAgentPropertiesRefetch({ input: searchFilter });
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	const updatePropertyHandler = async (status: string, id: string) => {
		try {
			if (await sweetConfirmAlert(`Are you sure to change to ${status} status?`)) {
				await updateProperty({
					variables: {
						input: {
							_id: id,
							propertyStatus: status,
						},
					},
				});
			}
			await getAgentPropertiesRefetch({ input: searchFilter });
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	if (user?.memberType !== 'DEALER') {
		router.back();
	}

	if (device === 'mobile') {
		return <div>NESTAR PROPERTIES MOBILE</div>;
	} else {
		return (
			<div id="my-property-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">My watches</Typography>
					</Stack>
				</Stack>
				<Stack className="property-list-box">
					<Stack className="tab-name-box">
						<Typography
							onClick={() => changeStatusHandler(WatchStatus.AVAILABLE)}
							className={searchFilter.search.propertyStatus === 'AVAILABLE' ? 'active-tab-name' : 'tab-name'}
						>
							On Sale
						</Typography>
						<Typography
							onClick={() => changeStatusHandler(WatchStatus.SOLD)}
							className={searchFilter.search.propertyStatus === 'DELETE' ? 'active-tab-name' : 'tab-name'}
						>
							On Sold
						</Typography>
					</Stack>
					<Stack className="list-box">
						<Stack className="listing-title-box">
							<Typography className="title-text">Watch</Typography>
							<Typography className="title-text">Produced in</Typography>
							<Typography className="title-text">Status</Typography>
							<Typography className="title-text">View</Typography>
							{searchFilter.search.propertyStatus === 'AVAILABLE' && (
								<Typography className="title-text">Action</Typography>
							)}
						</Stack>

						{agentProperties?.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Property found!</p>
							</div>
						) : (
							agentProperties.map((property: Property) => {
								return (
									<MyPropertyCard
										property={property}
										deletePropertyHandler={deletePropertyHandler}
										updatePropertyHandler={updatePropertyHandler}
									/>
								);
							})
						)}

						{agentProperties.length !== 0 && (
							<Stack className="pagination-config">
								<Stack className="pagination-box">
									<Pagination
										page={searchFilter.page}
										count={Math.ceil(total / searchFilter.limit)}
										onChange={paginationHandler}
										size="large"
										showFirstButton
										showLastButton
										sx={{
											'& .MuiPaginationItem-root': {
												fontWeight: 600,
												color: '#fff',
											},
										}}
									/>
								</Stack>
								<Stack className="total-result">
									<Typography>{total} watches available</Typography>
								</Stack>
							</Stack>
						)}
					</Stack>
				</Stack>
			</div>
		);
	}
};

MyProperties.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		search: {
			propertyStatus: 'AVAILABLE',
		},
	},
};

export default MyProperties;
