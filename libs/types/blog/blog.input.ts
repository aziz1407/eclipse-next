import { BlogCategory, BlogStatus } from '../../enums/blog.enum';
import { Direction } from '../../enums/common.enum';

export interface BlogInput
 {
	blogCategory: BlogCategory;
	blogTitle: string;
	blogContent: string;
	blogImage: string;
	memberId?: string;
}

interface BAISearch {
	blogCategory: BlogCategory;
	text?: string;
}

export interface BlogsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: BAISearch;
}

interface ABAISearch {
	blogStatus?: BlogStatus;
	articleCategory?: BlogCategory;
}

export interface AllBoardArticlesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ABAISearch;
}
