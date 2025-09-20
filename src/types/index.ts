export interface JobDescription {
  id: string;
  title: string;
  company: string;
  description: string;
  mustHaveSkills: string[];
  niceToHaveSkills: string[];
  createdAt: string;
}

export interface Resume {
  id: string;
  fileName: string;
  studentName: string;
  studentEmail: string;
  parsedText: string;
  extractedSkills: string[];
  education: string[];
  experience: string[];
  uploadedAt: string;
}

export interface Evaluation {
  id: string;
  resumeId: string;
  jobId: string;
  relevanceScore: number;
  hardScore: number;
  softScore: number;
  verdict: 'High' | 'Medium' | 'Low';
  missingSkills: string[];
  matchedSkills: string[];
  feedback: string;
  skillsBreakdown: {
    skill: string;
    status: 'found' | 'missing' | 'partial';
    confidence: number;
  }[];
  biasFlags: string[];
  evaluatedAt: string;
}

export interface DashboardStats {
  totalResumes: number;
  averageScore: number;
  highScoreCount: number;
  mediumScoreCount: number;
  lowScoreCount: number;
  topSkillGaps: { skill: string; count: number }[];
}