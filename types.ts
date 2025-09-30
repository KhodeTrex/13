
export enum UserRole {
  ADMIN = 'ADMIN',
  VIEWER = 'VIEWER',
}

export interface Category {
  id: string;
  name: string;
}

export interface Flowchart {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  imageUrl: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
}
