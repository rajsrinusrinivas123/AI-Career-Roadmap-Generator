
export interface SkillPoint {
  skill: string;
  current: number;
  target: number;
}

export interface DayTask {
  day: number;
  topic: string;
  description: string;
  resources: string[];
}

export interface Project {
  title: string;
  description: string;
  techStack: string[];
  keySkills: string[];
  potentialChallenges: string;
  careerContribution: string;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface RoadmapResponse {
  careerPath: string;
  skillAnalysis: SkillPoint[];
  sixtyDayPlan: DayTask[];
  recommendedCourses: { title: string; provider: string; url: string }[];
  capstoneProjects: Project[];
  summary: string;
}

export interface UserProfile {
  currentRole: string;
  targetRole: string;
  skills: string;
  weeklyHours: number;
}
