
export interface ResumeAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface FilePayload {
  name: string;
  type: string;
  data: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: object) => Promise<void>;
  register: (userData: object) => Promise<void>;
  logout: () => void;
}

// Types for Resume Builder
export interface PersonalInfo {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    website: string;
    address: string;
}

export interface WorkExperience {
    id: string;
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    responsibilities: string;
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
}

export interface ResumeData {
    personalInfo: PersonalInfo;
    summary: string;
    workExperience: WorkExperience[];
    education: Education[];
    skills: string[];
}
