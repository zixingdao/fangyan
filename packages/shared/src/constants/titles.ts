
export enum TitleType {
  RECORDING = 'recording', // 统一为录音称号
  ANNOTATION = 'annotation',
}

export interface TitleLevel {
  level: number;
  name: string;
  minDuration: number; // 秒
  description?: string;
}

// 录音称号 (基于总时长：单人 + 多人)
export const RECORDING_TITLES: TitleLevel[] = [
  { level: 1, name: '方言新人', minDuration: 0, description: '开始你的方言之旅' },
  { level: 2, name: '方言达人', minDuration: 3600 * 10, description: '累计录制时长达10小时' },
  { level: 3, name: '方言专家', minDuration: 3600 * 30, description: '累计录制时长达30小时' },
  { level: 4, name: '方言大师', minDuration: 3600 * 60, description: '累计录制时长达60小时' },
  { level: 5, name: '湘音传承大使', minDuration: 3600 * 100, description: '累计录制时长达100小时' },
];

// 标注称号 (上限 20h)
export const ANNOTATION_TITLES: TitleLevel[] = [
  { level: 1, name: '笔杆子', minDuration: 0, description: '开始标注工作' },
  { level: 2, name: '记录员', minDuration: 3600 * 2, description: '累计标注2小时' },
  { level: 3, name: '鉴定师', minDuration: 3600 * 5, description: '累计标注5小时' },
  { level: 4, name: '语言学家', minDuration: 3600 * 10, description: '累计标注10小时' },
  { level: 5, name: '非遗专家', minDuration: 3600 * 20, description: '累计标注20小时' },
];

export const getTitleByDuration = (duration: number, titles: TitleLevel[]): TitleLevel => {
  // 从高到低遍历，找到第一个满足条件的
  for (let i = titles.length - 1; i >= 0; i--) {
    if (duration >= titles[i].minDuration) {
      return titles[i];
    }
  }
  return titles[0];
};

export const getNextTitle = (duration: number, titles: TitleLevel[]): TitleLevel | null => {
  for (let i = 0; i < titles.length; i++) {
    if (duration < titles[i].minDuration) {
      return titles[i];
    }
  }
  return null; // 已经是最高级
};
