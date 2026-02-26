import { PageType, PageComponent } from './page-config.entity';

export interface PageConfigResponse {
  id: number;
  pageType: PageType;
  title: string;
  components: PageComponent[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
