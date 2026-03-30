export interface Semester {
  id: string;
  name: string;
  description?: string;
  orderIndex: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  modules?: Module[];
  stats?: {
    moduleCount: number;
    fileCount: number;
  };
}

export interface Module {
  id: string;
  name: string;
  code?: string;
  lecturer?: string;
  color: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  description?: string;
  orderIndex: number;
  semesterId: string;
  createdAt: string;
  updatedAt: string;
  files?: File[];
  notes?: Note[];
  todos?: Todo[];
}

export interface File {
  id: string;
  name: string;
  originalName: string;
  type: 'PDF' | 'VIDEO' | 'DOCUMENT' | 'IMAGE' | 'OTHER';
  category: 'LECTURE_MATERIAL' | 'VIDEO' | 'ASSIGNMENT' | 'REFERENCE_PAPER' | 'EBOOK' | 'NOTES' | 'OTHER';
  filePath: string;
  fileSize: number;
  mimeType: string;
  description?: string;
  tags: string[];
  isFavorite: boolean;
  metadata?: any;
  moduleId: string;
  createdAt: string;
  updatedAt: string;
  module?: Module;
}

export interface Note {
  id: string;
  title: string;
  content?: string;
  isPinned: boolean;
  moduleId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  moduleId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  mastered: boolean;
  moduleId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalSemesters: number;
  totalModules: number;
  totalFiles: number;
  totalStorage: number;
  recentActivity: Activity[];
  fileTypeDistribution: Record<string, number>;
}

export interface Activity {
  id: string;
  type: 'FILE_UPLOAD' | 'MODULE_CREATED' | 'TODO_COMPLETED';
  description: string;
  timestamp: string;
}