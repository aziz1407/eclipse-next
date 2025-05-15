import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Stack, Box, Modal, Divider, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { propertySquare, propertyYears } from '../../config';
import {
	WatchCountry,
	WatchBrand,
	WatchGender,
	WatchCondition,
	WatchMovement,
	WatchMaterial,
} from '../../enums/property.enum';
import { PropertiesInquiry } from '../../types/property/property.input';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 'auto',
	bgcolor: 'background.paper',
	borderRadius: '12px',
	outline: 'none',
	boxShadow: 24,
};

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

const thisYear = new Date().getFullYear();

interface HeaderFilterProps {
	initialInput: PropertiesInquiry;
}

const HeaderFilter = (props: HeaderFilterProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const { t, i18n } = useTranslation('common');
	const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>(initialInput);
	const countryRef: any = useRef();
	const brandRef: any = useRef();
	const materialRef: any = useRef();
	const router = useRouter();
	const [openAdvancedFilter, setOpenAdvancedFilter] = useState(false);
	const [openCountry, setOpenCountry] = useState(false);
	const [openBrand, setOpenBrand] = useState(false);
	const [openMaterial, setOpenMaterial] = useState(false);
	const [watchCountries, setWatchCountries] = useState<WatchCountry[]>(Object.values(WatchCountry));
	const [watchBrands, setWatchBrands] = useState<WatchBrand[]>(Object.values(WatchBrand));
	const [watchMaterials, setWatchMaterials] = useState<WatchMaterial[]>(Object.values(WatchMaterial));
	const [yearCheck, setYearCheck] = useState({ start: 2000, end: thisYear });
	const [optionCheck, setOptionCheck] = useState('all');

	/** LIFECYCLES **/
	useEffect(() => {
		const clickHandler = (event: MouseEvent) => {
			if (!countryRef?.current?.contains(event.target)) {
				setOpenCountry(false);
			}

			if (!brandRef?.current?.contains(event.target)) {
				setOpenBrand(false);
			}

			if (!materialRef?.current?.contains(event.target)) {
				setOpenMaterial(false);
			}
		};

		document.addEventListener('mousedown', clickHandler);

		return () => {
			document.removeEventListener('mousedown', clickHandler);
		};
	}, []);

	/** HANDLERS **/
	const advancedFilterHandler = (status: boolean) => {
		setOpenCountry(false);
		setOpenMaterial(false);
		setOpenBrand(false);
		setOpenAdvancedFilter(status);
	};

	const countryStateChangeHandler = () => {
		setOpenCountry((prev) => !prev);
		setOpenMaterial(false);
		setOpenBrand(false);
	};

	const brandStateChangeHandler = () => {
		setOpenBrand((prev) => !prev);
		setOpenCountry(false);
		setOpenMaterial(false);
	};

	const genderStateChangeHandler = () => {
		setOpenMaterial((prev) => !prev);
		setOpenBrand(false);
		setOpenCountry(false);
	};

	const disableAllStateHandler = () => {
		setOpenMaterial(false);
		setOpenBrand(false);
		setOpenCountry(false);
	};

	const watchCountrySelectHandler = useCallback(
		async (value: any) => {
			try {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						locationList: [value],
					},
				});
				brandStateChangeHandler();
			} catch (err: any) {
				console.log('ERROR, watchCountrySelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const watchBrandSelectHandler = useCallback(
		async (value: any) => {
			try {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						typeList: [value],
					},
				});
				genderStateChangeHandler();
			} catch (err: any) {
				console.log('ERROR, watchBrandSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	// const watchGenderSelectHandler = useCallback(
	// 	async (value: any) => {
	// 		try {
	// 			setSearchFilter({
	// 				...searchFilter,
	// 				search: {
	// 					...searchFilter.search,
	// 					propertyCategory: [value],
	// 				},
	// 			});
	// 			disableAllStateHandler();
	// 		} catch (err: any) {
	// 			console.log('ERROR, watchGenderSelectHandler:', err);
	// 		}
	// 	},
	// 	[searchFilter],
	// );

	const watchConditionSelectHandler = useCallback(
		async (condition: WatchCondition | null) => {
			try {
				if (condition) {
					if (searchFilter?.search?.propertyCondition?.includes(condition)) {
						setSearchFilter({
							...searchFilter,
							search: {
								...searchFilter.search,
								propertyCondition: searchFilter?.search?.propertyCondition?.filter((item) => item !== condition),
							},
						});
					} else {
						setSearchFilter({
							...searchFilter,
							search: {
								...searchFilter.search,
								propertyCondition: [...(searchFilter?.search?.propertyCondition || []), condition],
							},
						});
					}
				} else {
					delete searchFilter?.search.propertyCondition;
					setSearchFilter({ ...searchFilter });
				}
			} catch (err: any) {
				console.log('ERROR, watchConditionSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const watchMaterialSelectHandler = useCallback(
		async (material: WatchMaterial | null) => {
			try {
				if (material) {
					if (searchFilter?.search?.propertyMaterial?.includes(material)) {
						setSearchFilter({
							...searchFilter,
							search: {
								...searchFilter.search,
								propertyMaterial: searchFilter?.search?.propertyMaterial?.filter((item) => item !== material),
							},
						});
					} else {
						setSearchFilter({
							...searchFilter,
							search: {
								...searchFilter.search,
								propertyMaterial: [...(searchFilter?.search?.propertyMaterial || []), material],
							},
						});
					}
				} else {
					delete searchFilter?.search.propertyMaterial;
					setSearchFilter({ ...searchFilter });
				}
			} catch (err: any) {
				console.log('ERROR, watchMaterialSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const watchMovementSelectHandler = useCallback(
		async (e: any) => {
			try {
				const value = e.target.value;

				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						propertyMovement: value === 'all' ? undefined : value,
					},
				});
			} catch (err: any) {
				console.log('ERROR, watchMovementSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const watchOptionSelectHandler = useCallback(
		async (e: any) => {
			try {
				const value = e.target.value;
				setOptionCheck(value);

				if (value !== 'all') {
					setSearchFilter({
						...searchFilter,
						search: {
							...searchFilter.search,
							options: [value],
						},
					});
				} else {
					delete searchFilter.search.options;
					setSearchFilter({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					});
				}
			} catch (err: any) {
				console.log('ERROR, watchOptionSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const watchPriceRangeHandler = useCallback(
		async (e: any, type: string) => {
			const value = e.target.value;

			if (type == 'start') {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						// @ts-ignore
						pricesRange: { ...searchFilter.search.pricesRange, start: parseInt(value) },
					},
				});
			} else {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						// @ts-ignore
						pricesRange: { ...searchFilter.search.pricesRange, end: parseInt(value) },
					},
				});
			}
		},
		[searchFilter],
	);

	const resetFilterHandler = () => {
		setSearchFilter(initialInput);
		setOptionCheck('all');
		setYearCheck({ start: 1970, end: thisYear });
	};

	const pushSearchHandler = async () => {
		try {
			if (searchFilter?.search?.locationList?.length == 0) {
				delete searchFilter.search.locationList;
			}

			if (searchFilter?.search?.typeList?.length == 0) {
				delete searchFilter.search.typeList;
			}

			if (searchFilter?.search?.propertyCategory?.length == 0) {
				delete searchFilter.search.propertyCategory;
			}

			if (searchFilter?.search?.options?.length == 0) {
				delete searchFilter.search.options;
			}

			if (searchFilter?.search?.propertyCondition?.length == 0) {
				delete searchFilter.search.propertyCondition;
			}

			if (searchFilter?.search?.propertyMaterial?.length == 0) {
				delete searchFilter.search.propertyMaterial;
			}

			await router.push(
				`/property?input=${JSON.stringify(searchFilter)}`,
				`/property?input=${JSON.stringify(searchFilter)}`,
			);
		} catch (err: any) {
			console.log('ERROR, pushSearchHandler:', err);
		}
	};

	if (device === 'mobile') {
		return <div>HEADER FILTER MOBILE</div>;
	} else {
		return (
			<>
				<Stack className={'search-box'}>
					<Stack className={'select-box'}>
						<Box component={'div'} className={`box ${openCountry ? 'on' : ''}`} onClick={countryStateChangeHandler}>
							<span>{searchFilter?.search?.locationList ? searchFilter?.search?.locationList[0] : t('Country')} </span>
							<ExpandMoreIcon />
						</Box>
						<Box className={`box ${openBrand ? 'on' : ''}`} onClick={brandStateChangeHandler}>
							<span> {searchFilter?.search?.typeList ? searchFilter?.search?.typeList[0] : t('Brand')} </span>
							<ExpandMoreIcon />
						</Box>
						<Box className={`box ${openMaterial ? 'on' : ''}`} onClick={genderStateChangeHandler}>
							<span>
								{searchFilter?.search?.propertyMaterial
									? `${searchFilter?.search?.propertyMaterial[0]}`
									: t('Material')}
							</span>
							<ExpandMoreIcon />
						</Box>
					</Stack>
					<Stack className={'search-box-other'}>
						<Box className={'advanced-filter'} onClick={() => advancedFilterHandler(true)}>
							<img src="/img/icons/tune.svg" alt="" />
							<span>{t('Advanced')}</span>
						</Box>
						<Box className={'search-btn'} onClick={pushSearchHandler}>
							<img src="/img/icons/search_white.svg" alt="" />
						</Box>
					</Stack>

					{/*MENU */}
					<div className={`filter-location ${openCountry ? 'on' : ''}`} ref={countryRef}>
						{watchCountries.map((country: string) => {
							return (
								<div onClick={() => watchCountrySelectHandler(country)} key={country}>
									<img src={`img/banner/countries/${country}.webp`} alt="" />
									<span>{country}</span>
								</div>
							);
						})}
					</div>

					<div className={`filter-type ${openBrand ? 'on' : ''}`} ref={brandRef}>
						{watchBrands.map((brand: string) => {
							return (
								<div key={brand} className="brand-card" onClick={() => watchBrandSelectHandler(brand)}>
									<div
										className="brand-banner"
										style={{
											backgroundImage: `url(/img/banner/brands/${brand.toLowerCase()}.png)`,
										}}
									></div>
									<span>{brand}</span>
								</div>
							);
						})}
					</div>

					<div className={`filter-material ${openMaterial ? 'on' : ''}`} ref={materialRef}>
						{Object.values(WatchMaterial).map((material: any) => {
							return (
								<div key={material} className="material-card" onClick={() => watchMaterialSelectHandler(material)}>
									<div
										className="material-image"
										style={{
											backgroundImage: `url(/img/banner/straps/${material.toLowerCase()}.jpg)`,
										}}
									></div>
									<span>{material}</span>
								</div>
							);
						})}
					</div>
				</Stack>

				<Modal
					open={openAdvancedFilter}
					onClose={() => advancedFilterHandler(false)}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					{/* @ts-ignore */}
					<Box sx={style}>
						<Box className={'advanced-filter-modal'}>
							<div className={'close'} onClick={() => advancedFilterHandler(false)}>
								<CloseIcon />
							</div>
							<div className={'top'}>
								<span>Find your watch</span>
								<div className={'search-input-box'}>
									<img src="/img/icons/search.svg" alt="" />
									<input
										value={searchFilter?.search?.text ?? ''}
										type="text"
										placeholder={'What are you looking for?'}
										onChange={(e: any) => {
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: e.target.value },
											});
										}}
									/>
								</div>
							</div>
							<Divider sx={{ mt: '30px', mb: '35px' }} />
							<div className={'middle'}>
								<div className={'row-box'}>
									<div className={'box'}>
										<span>Condition</span>
										<div className={'inside'}>
											<div
												className={`room ${!searchFilter?.search?.propertyCondition ? 'active' : ''}`}
												onClick={() => watchConditionSelectHandler(null)}
											>
												Any
											</div>
											{Object.values(WatchCondition).map((condition: any) => (
												<div
													className={`room ${
														searchFilter?.search?.propertyCondition?.includes(condition) ? 'active' : ''
													}`}
													onClick={() => watchConditionSelectHandler(condition)}
													key={condition}
												>
													{condition}
												</div>
											))}
										</div>
									</div>
									<div className={'box'}>
										<span>Movement</span>
										<div className={'inside'}>
											<FormControl>
												<Select
													value={searchFilter?.search?.propertyMovement || 'all'}
													onChange={watchMovementSelectHandler}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
												>
													<MenuItem value={'all'}>All Movement</MenuItem>
													{Object.values(WatchMovement).map((movement) => (
														<MenuItem value={movement} key={movement}>
															{movement}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										</div>
									</div>
								</div>
								<div className={'row-box'} style={{ marginTop: '44px' }}>
									<div className={'box'}>
										<span>Material</span>
										<div className={'inside'}>
											<div
												className={`room ${!searchFilter?.search?.propertyMaterial ? 'active' : ''}`}
												onClick={() => watchMaterialSelectHandler(null)}
											>
												Any
											</div>
											{Object.values(WatchMaterial).map((material: any) => (
												<div
													className={`room ${
														searchFilter?.search?.propertyMaterial?.includes(material) ? 'active' : ''
													}`}
													onClick={() => watchMaterialSelectHandler(material)}
													key={material}
												>
													{material}
												</div>
											))}
										</div>
									</div>
									<div className={'box'}>
										<span>Options</span>
										<div className={'inside'}>
											<FormControl>
												<Select
													value={optionCheck}
													onChange={watchOptionSelectHandler}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
												>
													<MenuItem value={'all'}>All Options</MenuItem>
													<MenuItem value={'forSale'}>For Sale</MenuItem>
													<MenuItem value={'forTrade'}>For Trade</MenuItem>
												</Select>
											</FormControl>
										</div>
									</div>
								</div>
								<div className={'row-box'} style={{ marginTop: '44px' }}>
									<div className={'box'}>
										<span>Price range</span>
										<div className={'inside space-between align-center'}>
											<FormControl sx={{ width: '122px' }}>
												<Select
													value={searchFilter?.search?.pricesRange?.start}
													onChange={(e: any) => watchPriceRangeHandler(e, 'start')}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
													MenuProps={MenuProps}
												>
													{[0, 1000, 3000, 5000, 7000, 10000].map((price: number) => (
														<MenuItem
															value={price}
															disabled={(searchFilter?.search?.pricesRange?.end || 0) < price}
															key={price}
														>
															${price}
														</MenuItem>
													))}
												</Select>
											</FormControl>
											<div className={'minus-line'}></div>
											<FormControl sx={{ width: '122px' }}>
												<Select
													value={searchFilter?.search?.pricesRange?.end}
													onChange={(e: any) => watchPriceRangeHandler(e, 'end')}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
													MenuProps={MenuProps}
												>
													{[1000, 3000, 5000, 7000, 10000].map((price: number) => (
														<MenuItem
															value={price}
															disabled={(searchFilter?.search?.pricesRange?.start || 0) > price}
															key={price}
														>
															${price}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										</div>
									</div>
								</div>
							</div>
							<Divider sx={{ mt: '60px', mb: '18px' }} />
							<div className={'bottom'}>
								<div onClick={resetFilterHandler}>
									<img src="/img/icons/reset.svg" alt="" />
									<span>Reset all filters</span>
								</div>
								<Button
									startIcon={<img src={'/img/icons/search.svg'} />}
									className={'search-btn'}
									onClick={pushSearchHandler}
								>
									Search
								</Button>
							</div>
						</Box>
					</Box>
				</Modal>
			</>
		);
	}
};

HeaderFilter.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		search: {
			pricesRange: {
				start: 0,
				end: 100000,
			},
		},
	},
};

export default HeaderFilter;
