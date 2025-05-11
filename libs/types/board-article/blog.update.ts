import { BlogStatus } from '../../enums/blog.enum';

export interface BlogUpdate {
	_id: string;
	blogStatus?: BlogStatus;
	blogTitle?: string;
	blogContent?: string;
	blogImage?: string;
}
