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
	const conditionRef: any = useRef();
	const router = useRouter();
	const [openCountry, setOpenCountry] = useState(false);
	const [openBrand, setOpenBrand] = useState(false);
	const [openCondition, setOpenCondition] = useState(false);
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
			if (!conditionRef?.current?.contains(event.target)) {
				setOpenCondition(false);
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
	};

	const countryStateChangeHandler = () => {
		setOpenCountry((prev) => !prev);
		setOpenMaterial(false);
		setOpenBrand(false);
		setOpenCondition(false);
	};

	const brandStateChangeHandler = () => {
		setOpenBrand((prev) => !prev);
		setOpenCountry(false);
		setOpenMaterial(false);
		setOpenCondition(false);
	};

	const genderStateChangeHandler = () => {
		setOpenMaterial((prev) => !prev);
		setOpenBrand(false);
		setOpenCountry(false);
		setOpenCondition(false);
	};

	const disableAllStateHandler = () => {
		setOpenMaterial(false);
		setOpenBrand(false);
		setOpenCountry(false);
		setOpenCondition(false);
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
							{openCountry ? <CloseIcon /> : <ExpandMoreIcon />}
						</Box>
						<Box className={`box ${openBrand ? 'on' : ''}`} onClick={brandStateChangeHandler}>
							<span> {searchFilter?.search?.typeList ? searchFilter?.search?.typeList[0] : t('Brand')} </span>
							{openBrand ? <CloseIcon /> : <ExpandMoreIcon />}
						</Box>
						<Box className={`box ${openMaterial ? 'on' : ''}`} onClick={genderStateChangeHandler}>
							<span>
								{searchFilter?.search?.propertyMaterial
									? `${searchFilter?.search?.propertyMaterial[0]}`
									: t('Material')}
							</span>
							{openMaterial ? <CloseIcon /> : <ExpandMoreIcon />}
						</Box>

						<Box className={`box ${openCondition ? 'on' : ''}`} onClick={() => setOpenCondition((prev) => !prev)}>
							<span>
								{searchFilter?.search?.propertyCondition
									? `${searchFilter?.search?.propertyCondition[0]}`
									: t('Condition')}
							</span>
							{openCondition ? <CloseIcon /> : <ExpandMoreIcon />}
						</Box>
					</Stack>
					<Stack className={'search-box-other'}>
						{/* <Box className={'advanced-filter'} onClick={() => advancedFilterHandler(true)}>
							<img src="/img/icons/tune.svg" alt="" />
						</Box> */}
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

					<div className={`filter-material ${openCondition ? 'on' : ''}`} ref={conditionRef}>
						{Object.values(WatchCondition).map((condition: any) => (
							<div
								key={condition}
								className={`option ${searchFilter.search?.propertyCondition?.includes(condition) ? 'active' : ''}`}
								onClick={() => watchConditionSelectHandler(condition as WatchCondition)}
							>
								{condition}
							</div>
						))}
					</div>
				</Stack>
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