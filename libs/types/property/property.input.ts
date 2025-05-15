import { Direction } from '../../enums/common.enum';
import { WatchBrand, WatchCondition, WatchCountry, WatchGender, WatchMaterial, WatchMovement, WatchStatus } from '../../enums/property.enum';

export interface PropertyInput {
	propertyBrand: WatchBrand;
	propertyCountry: WatchCountry;
	propertyAddress: string;
	propertyModel: string;
	propertyPrice: number;
	propertyYear: number,
	propertyCategory: WatchGender;
	propertyMaterial: WatchMaterial;
	propertyCondition: WatchCondition;
	propertyMovement: WatchMovement;
	propertyImages: string[];
	propertyDesc?: string;
	memberId?: string;
	constructedAt?: Date;
}

interface PISearch {
	memberId?: string;
	locationList?: WatchCountry[];
	typeList?: WatchBrand [];
	propertyCondition?: WatchCondition[],
	propertyMovement?: WatchMovement,
	propertyCategory?: WatchGender[];
	options?: string[];
	propertyMaterial?: WatchMaterial[];
	pricesRange?: Range;
	text?: string;
}

export interface PropertiesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: PISearch;
}

interface APISearch {
	propertyStatus?: WatchStatus;
}

export interface AgentPropertiesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: APISearch;
}

interface ALPISearch {
	propertyStatus?: WatchStatus;
	propertyLocationList?: WatchCountry[];
}

export interface AllPropertiesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ALPISearch;
}

interface Range {
	start: number;
	end: number;
}

interface PeriodsRange {
	start: Date | number;
	end: Date | number;
}
