import React, { useCallback, useEffect, useState } from 'react';
import {
	Stack,
	Typography,
	Checkbox,
	Button,
	OutlinedInput,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Tooltip,
	IconButton,
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { WatchBrand, WatchCountry, WatchCondition, WatchMovement, WatchGender, WatchMaterial } from '../../enums/property.enum';
import { PropertiesInquiry } from '../../types/property/property.input';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { propertySquare } from '../../config';
import RefreshIcon from '@mui/icons-material/Refresh';

interface Range {
  start: number;
  end: number;
}

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

interface FilterType {
	searchFilter: PropertiesInquiry;
	setSearchFilter: any;
	initialInput: PropertiesInquiry;
}

const Filter = (props: FilterType) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [watchCountries, setWatchCountries] = useState<WatchCountry[]>(Object.values(WatchCountry));
	const [watchBrands, setWatchBrands] = useState<WatchBrand[]>(Object.values(WatchBrand));
	const [searchText, setSearchText] = useState<string>('');
	const [showMore, setShowMore] = useState<boolean>(false);

	/** LIFECYCLES **/
	useEffect(() => {
		const queryParams = JSON.stringify({
			...searchFilter,
			search: {
				...searchFilter.search,
			},
		});

		if (searchFilter?.search?.locationList?.length == 0) {
			delete searchFilter.search.locationList;
			setShowMore(false);
			
			// Reset to initial input for locationList if it becomes empty
			const updatedFilter = {
				...searchFilter,
				search: {
					...searchFilter.search,
					locationList: initialInput.search?.locationList || undefined
				}
			};
			
			setSearchFilter(updatedFilter);
			
			router
				.push(
					`/property?input=${JSON.stringify(updatedFilter)}`,
					`/property?input=${JSON.stringify(updatedFilter)}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.typeList?.length == 0) {
			delete searchFilter.search.typeList;
			router
				.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.propertyCategory?.length == 0) {
			delete searchFilter.search.propertyCategory;
			router
				.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.options?.length == 0) {
			delete searchFilter.search.options;
			router
				.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.propertyMaterial?.length == 0) {
			delete searchFilter.search.propertyMaterial;
			router
				.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.locationList) setShowMore(true);
	}, [searchFilter]);

	/** HANDLERS **/
	const watchCountrySelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				
				if (isChecked) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.locationList?.includes(value)) {
					// Check if this is the last selected item in locationList
					if (searchFilter?.search?.locationList?.length === 1) {
						// Reset to initial input state for the locationList
						setSearchFilter({
							...searchFilter,
							search: {
								...searchFilter.search,
								locationList: initialInput.search?.locationList || []
							}
						});
						
						await router.push(
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									locationList: initialInput.search?.locationList || []
								},
							})}`,
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									locationList: initialInput.search?.locationList || []
								},
							})}`,
							{ scroll: false },
						);
					} else {
						// Just remove the one item as before
						await router.push(
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
								},
							})}`,
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
								},
							})}`,
							{ scroll: false },
						);
					}
				}

				if (searchFilter?.search?.typeList?.length == 0) {
					console.log('No watch brand selected');
				}

				console.log('watchCountrySelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, watchCountrySelectHandler:', err);
			}
		},
		[searchFilter, initialInput, setSearchFilter],
	);

	const watchBrandSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.typeList?.includes(value)) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.typeList?.length == 0) {
					console.log('No watch brand selected');
				}

				console.log('watchBrandSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, watchBrandSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const watchGenderSelectHandler = useCallback(
		async (gender: WatchGender) => {
			try {
				if (searchFilter?.search?.propertyCategory?.includes(gender)) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								propertyCategory: searchFilter?.search?.propertyCategory?.filter((item: WatchGender) => item !== gender),
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								propertyCategory: searchFilter?.search?.propertyCategory?.filter((item: WatchGender) => item !== gender),
							},
						})}`,
						{ scroll: false },
					);
				} else {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, propertyCategory: [...(searchFilter?.search?.propertyCategory || []), gender] },
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, propertyCategory: [...(searchFilter?.search?.propertyCategory || []), gender] },
						})}`,
						{ scroll: false },
					);
				}

				console.log('watchGenderSelectHandler:', gender);
			} catch (err: any) {
				console.log('ERROR, watchGenderSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const watchOptionSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, options: [...(searchFilter?.search?.options || []), value] },
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, options: [...(searchFilter?.search?.options || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.options?.includes(value)) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								options: searchFilter?.search?.options?.filter((item: string) => item !== value),
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								options: searchFilter?.search?.options?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				console.log('watchOptionSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, watchOptionSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const watchMaterialSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, propertyMaterial: [...(searchFilter?.search?.propertyMaterial || []), value] },
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, propertyMaterial: [...(searchFilter?.search?.propertyMaterial || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.propertyMaterial?.includes(value)) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								propertyMaterial: searchFilter?.search?.propertyMaterial?.filter((item: string) => item !== value),
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								propertyMaterial: searchFilter?.search?.propertyMaterial?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				console.log('watchMaterialSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, watchMaterialSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const watchConditionHandler = useCallback(
		async (e: any) => {
			try {
				const value = e.target.value;
				await router.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							propertyCondition: value,
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							propertyCondition: value,
						},
					})}`,
					{ scroll: false },
				);
			} catch (err: any) {
				console.log('ERROR, watchConditionHandler:', err);
			}
		},
		[searchFilter],
	);

	const watchMovementHandler = useCallback(
		async (e: any) => {
			try {
				const value = e.target.value;
				await router.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							propertyMovement: value,
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							propertyMovement: value,
						},
					})}`,
					{ scroll: false },
				);
			} catch (err: any) {
				console.log('ERROR, watchMovementHandler:', err);
			}
		},
		[searchFilter],
	);

	const watchPriceHandler = useCallback(
		async (value: number, type: string) => {
			if (type == 'start') {
				await router.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);

	const refreshHandler = async () => {
		try {
			setSearchText('');
			await router.push(
				`/property?input=${JSON.stringify(initialInput)}`,
				`/property?input=${JSON.stringify(initialInput)}`,
				{ scroll: false },
			);
		} catch (err: any) {
			console.log('ERROR, refreshHandler:', err);
		}
	};

	if (device === 'mobile') {
		return <div>WATCHES FILTER</div>;
	} else {
		return (
			<Stack className={'filter-main'}>
				<Stack className={'find-your-home'} mb={'40px'}>
					<Typography className={'title-main'}>Find Your Watch</Typography>
					<Stack className={'input-box'}>
						<OutlinedInput
							value={searchText}
							type={'text'}
							className={'search-input'}
							placeholder={'What are you looking for?'}
							onChange={(e: any) => setSearchText(e.target.value)}
							onKeyDown={(event: any) => {
								if (event.key == 'Enter') {
									setSearchFilter({
										...searchFilter,
										search: { ...searchFilter.search, text: searchText },
									});
								}
							}}
							endAdornment={
								<>
									<CancelRoundedIcon
										onClick={() => {
											setSearchText('');
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: '' },
											});
										}}
									/>
								</>
							}
						/>
						<img src={'/img/icons/search_icon.png'} alt={''} />
						<Tooltip title="Reset">
							<IconButton onClick={refreshHandler}>
								<RefreshIcon />
							</IconButton>
						</Tooltip>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<p className={'title'} style={{ textShadow: '0px 3px 4px #b9b9b9' }}>
						Country of Origin
					</p>
					<Stack
						className={`property-location`}
						style={{ height: showMore ? '253px' : '115px' }}
						onMouseEnter={() => setShowMore(true)}
						onMouseLeave={() => {
							if (!searchFilter?.search?.locationList) {
								setShowMore(false);
							}
						}}
					>
						{watchCountries.map((country: string) => {
							return (
								<Stack className={'input-box'} key={country}>
									<Checkbox
										id={country}
										className="property-checkbox"
										color="default"
										size="small"
										value={country}
										checked={(searchFilter?.search?.locationList || []).includes(country as WatchCountry)}
										onChange={watchCountrySelectHandler}
									/>
									<label htmlFor={country} style={{ cursor: 'pointer' }}>
										<Typography className="property-type">{country}</Typography>
									</label>
								</Stack>
							);
						})}
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Watch Brand</Typography>
					{watchBrands.map((brand: string) => (
						<Stack className={'input-box'} key={brand}>
							<Checkbox
								id={brand}
								className="property-checkbox"
								color="default"
								size="small"
								value={brand}
								onChange={watchBrandSelectHandler}
								checked={(searchFilter?.search?.typeList || []).includes(brand as WatchBrand)}
							/>
							<label style={{ cursor: 'pointer' }}>
								<Typography className="property_type">{brand}</Typography>
							</label>
						</Stack>
					))}
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Gender</Typography>
					<Stack className="button-group">
						<Button
							sx={{
								borderRadius: '12px 0 0 12px',
								border: searchFilter?.search?.propertyCategory?.includes(WatchGender.MALE) ? '2px solid #181A20' : '1px solid #b9b9b9',
							}}
							onClick={() => watchGenderSelectHandler(WatchGender.MALE)}
						>
							Men's
						</Button>
						<Button
							sx={{
								borderRadius: 0,
								border: searchFilter?.search?.propertyCategory?.includes(WatchGender.FEMALE) ? '2px solid #181A20' : '1px solid #b9b9b9',
								borderLeft: searchFilter?.search?.propertyCategory?.includes(WatchGender.FEMALE) ? undefined : 'none',
							}}
							onClick={() => watchGenderSelectHandler(WatchGender.FEMALE)}
						>
							Women's
						</Button>
						<Button
							sx={{
								borderRadius: '0 12px 12px 0',
								border: searchFilter?.search?.propertyCategory?.includes(WatchGender.UNISEX) ? '2px solid #181A20' : '1px solid #b9b9b9',
								borderLeft: searchFilter?.search?.propertyCategory?.includes(WatchGender.UNISEX) ? undefined : 'none',
							}}
							onClick={() => watchGenderSelectHandler(WatchGender.UNISEX)}
						>
							Unisex
						</Button>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Watch Condition</Typography>
					<FormControl fullWidth>
						<InputLabel id="condition-select-label">Condition</InputLabel>
						<Select
							labelId="condition-select-label"
							id="condition-select"
							value={searchFilter?.search?.propertyCondition || ''}
							label="Condition"
							onChange={watchConditionHandler}
						>
							{Object.values(WatchCondition).map((condition: string) => (
								<MenuItem value={condition} key={condition}>
									{condition}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Watch Movement</Typography>
					<FormControl fullWidth>
						<InputLabel id="movement-select-label">Movement</InputLabel>
						<Select
							labelId="movement-select-label"
							id="movement-select"
							value={searchFilter?.search?.propertyMovement || ''}
							label="Movement"
							onChange={watchMovementHandler}
						>
							{Object.values(WatchMovement).map((movement: string) => (
								<MenuItem value={movement} key={movement}>
									{movement}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Watch Material</Typography>
					{Object.values(WatchMaterial).map((material: string) => (
						<Stack className={'input-box'} key={material}>
							<Checkbox
								id={material}
								className="property-checkbox"
								color="default"
								size="small"
								value={material}
								onChange={watchMaterialSelectHandler}
								checked={(searchFilter?.search?.propertyMaterial || []).includes(material as WatchMaterial)}
							/>
							<label style={{ cursor: 'pointer' }}>
								<Typography className="property_type">{material}</Typography>
							</label>
						</Stack>
					))}
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Options</Typography>
					<Stack className={'input-box'}>
						<Checkbox
							id={'forSale'}
							className="property-checkbox"
							color="default"
							size="small"
							value={'forSale'}
							checked={(searchFilter?.search?.options || []).includes('forSale')}
							onChange={watchOptionSelectHandler}
						/>
						<label htmlFor={'forSale'} style={{ cursor: 'pointer' }}>
							<Typography className="propert-type">For Sale</Typography>
						</label>
					</Stack>
					<Stack className={'input-box'}>
						<Checkbox
							id={'auction'}
							className="property-checkbox"
							color="default"
							size="small"
							value={'auction'}
							checked={(searchFilter?.search?.options || []).includes('auction')}
							onChange={watchOptionSelectHandler}
						/>
						<label htmlFor={'auction'} style={{ cursor: 'pointer' }}>
							<Typography className="propert-type">Auction</Typography>
						</label>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'}>
					<Typography className={'title'}>Price Range</Typography>
					<Stack className="square-year-input">
						<input
							type="number"
							placeholder="$ min"
							min={0}
							value={searchFilter?.search?.pricesRange?.start ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									watchPriceHandler(e.target.value, 'start');
								}
							}}
						/>
						<div className="central-divider"></div>
						<input
							type="number"
							placeholder="$ max"
							value={searchFilter?.search?.pricesRange?.end ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									watchPriceHandler(e.target.value, 'end');
								}
							}}
						/>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Filter;