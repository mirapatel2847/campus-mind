export type MemoryCategory = 'exam' | 'deadline' | 'event' | 'notice' | 'resource' | 'general';
export type MemoryImportance = 'high' | 'medium' | 'low';
export type SourceType = 'telegram' | 'whatsapp' | 'pdf' | 'image' | 'email' | 'web';
export type MemoryStatus = 'active' | 'superseded' | 'deleted';

export interface MemoryTag {
  name: string;
  ai: boolean;
}

export interface MemoryAttachment {
  id: string;
  name: string;
  size?: string;
  url?: string;
  type?: string;
}

export interface Memory {
  id: string;
  content: string;
  summary: string;
  title: string;
  category: MemoryCategory;
  subject: string;
  importance: MemoryImportance;
  source_type: SourceType;
  source_ref: string;
  preview_image_url?: string;
  tags: MemoryTag[];
  note: string;
  attachments: MemoryAttachment[];
  observed_at: string;
  valid_until?: string;
  status: MemoryStatus;
  supersedes_id?: string;
  space_id?: string;
  is_favourite: boolean;
  is_archived: boolean;
}

export interface Space {
  id: string;
  name: string;
  emoji: string;
  description?: string;
}

export interface CreateMemoryInput {
  content: string;
  files?: File[];
}

export interface UpdateMemoryInput {
  note?: string;
  tags?: MemoryTag[];
  is_favourite?: boolean;
  is_archived?: boolean;
  title?: string;
}

export interface GetMemoriesParams {
  status?: string;
  archived?: boolean;
  space_id?: string;
  category?: MemoryCategory;
}
