export interface RankingItem {
  rank_number: number;
  user: {
    name: string;
    student_id: string;
    school: string;
  };
  duration: number;
}
