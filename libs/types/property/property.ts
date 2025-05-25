import { WatchBrand, WatchCondition, WatchCountry, WatchGender, WatchMaterial, WatchMovement, WatchStatus } from '../../enums/property.enum';
import { Member } from '../member/member';

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

export interface TotalCounter {
	total: number;
}

export interface Property {
	_id: string;
	propertyBrand: WatchBrand;
	propertyStatus: WatchStatus;
	propertyCountry: WatchCountry;
	propertyAddress: string;
	propertyModel: string;
	propertyPrice: number;
	propertyYear: number;
	propertyCategory: WatchGender;
	propertyMaterial: WatchMaterial;
	propertyCondition: WatchCondition;
	propertyMovement: WatchMovement;
	propertyViews: number;
	propertyLikes: number;
	propertyRank: number;
	propertyComments: number[];
	propertyImages: string[];
	propertyDesc?: string;
	memberId: string;
	soldAt?: Date;
	deletedAt?: Date;
	constructedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface Properties {
	list: Property[];
	metaCounter: TotalCounter[];
}
