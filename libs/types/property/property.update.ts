import {
	WatchBrand,
	WatchCondition,
	WatchCountry,
	WatchGender,
	WatchMaterial,
	WatchMovement,
	WatchStatus,
} from '../../enums/property.enum';

export interface PropertyUpdate {
	_id: string;
	propertyBrand?: WatchBrand;
	propertyStatus?: WatchStatus;
	propertyCountry?: WatchCountry;
	propertyAddress?: string;
	propertyModel?: string;
	propertyPrice?: number;
	propertyCategory: WatchGender;
	propertyMaterial: WatchMaterial;
	propertyCondition: WatchCondition;
	propertyMovement: WatchMovement;
	propertyImages?: string[];
	propertyDesc?: string;
	propertyBarter?: boolean;
	propertyRent?: boolean;
	soldAt?: Date;
	deletedAt?: Date;
	constructedAt?: Date;
}
