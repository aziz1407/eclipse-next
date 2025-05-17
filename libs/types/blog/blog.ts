import { BlogCategory, BlogStatus, } from '../../enums/blog.enum';
import { Member } from '../member/member';
import { MeLiked, TotalCounter } from '../property/property';

export interface Blog {
	_id: string;
	blogCategory: BlogCategory;
	blogStatus: BlogStatus;
	blogTitle: string;
	blogContent: string;
	blogImage: string;
	blogViews: number;
	blogLikes: number;
	blogComments: number;
	memberId: string;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface Blogs {
	list: Blog[];
	metaCounter: TotalCounter[];
	blogImages: string[];
}
