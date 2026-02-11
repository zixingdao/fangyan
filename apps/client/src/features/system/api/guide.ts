import { api } from '@/lib/axios';

export interface GuideSection {
  title: string;
  items: string[];
}

export interface GuideScenario {
  id: string;
  title: string;
  description: string;
  sections: GuideSection[];
}

export const getGuideContent = async (): Promise<GuideScenario[]> => {
  return api.get('/system/guide');
};
