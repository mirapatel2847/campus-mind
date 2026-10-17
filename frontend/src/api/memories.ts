/**
 * ==========================================
 * BACKEND CONTRACT (FastAPI Endpoints)
 * ==========================================
 * GET    /memories?status=active&archived=false   -> Memory[]
 * POST   /memories      body { content, files? }  -> Memory (sent as multipart when files are present)
 * PATCH  /memories/{id} body { note?, tags?, is_favourite?, is_archived? } -> Memory
 * DELETE /memories/{id}                           -> 204
 * GET    /spaces                                  -> Space[]
 * DELETE /spaces/{id}                             -> 204
 * ==========================================
 */

import { Memory, Space, CreateMemoryInput, UpdateMemoryInput, GetMemoriesParams } from '../types/memory';
import { USE_MOCK } from '../lib/env';
import { apiClient } from './client';
import { getMockMemories, saveMockMemories, getMockSpaces } from '../data/mock';

const delay = (ms = 250): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export async function getMemories(params: GetMemoriesParams = {}): Promise<Memory[]> {
  if (!USE_MOCK) {
    return apiClient.get<Memory[]>('memories', {
      status: params.status ?? 'active',
      archived: params.archived !== undefined ? String(params.archived) : 'false',
      space_id: params.space_id,
      category: params.category,
    });
  }

  await delay(200);
  const memories = getMockMemories();

  return memories.filter((m) => {
    if (params.status && m.status !== params.status) return false;
    if (params.archived !== undefined && m.is_archived !== params.archived) return false;
    if (params.space_id && m.space_id !== params.space_id) return false;
    if (params.category && m.category !== params.category) return false;
    return true;
  });
}

export async function createMemory(input: CreateMemoryInput): Promise<Memory> {
  if (!USE_MOCK) {
    if (input.files && input.files.length > 0) {
      const formData = new FormData();
      formData.append('content', input.content);
      input.files.forEach((file) => formData.append('files', file));
      return apiClient.post<Memory>('memories', formData);
    }
    return apiClient.post<Memory>('memories', { content: input.content });
  }

  await delay(350);
  const memories = getMockMemories();

  // Basic intelligent inference in mock mode
  const content = input.content.trim();
  const firstLine = content.split('\n')[0].replace(/^[#*-\s]+/, '') || 'Quick Note';
  const isUrl = /^https?:\/\/[^\s]+$/.test(content);

  let category: Memory['category'] = 'general';
  const lower = content.toLowerCase();
  if (lower.includes('exam') || lower.includes('mid-term') || lower.includes('midterm') || lower.includes('quiz')) {
    category = 'exam';
  } else if (lower.includes('deadline') || lower.includes('submit') || lower.includes('due')) {
    category = 'deadline';
  } else if (lower.includes('hackathon') || lower.includes('workshop') || lower.includes('meetup') || lower.includes('event')) {
    category = 'event';
  } else if (lower.includes('notice') || lower.includes('circular') || lower.includes('announcement')) {
    category = 'notice';
  } else if (isUrl || lower.includes('guide') || lower.includes('tutorial') || lower.includes('paper') || lower.includes('cheat sheet')) {
    category = 'resource';
  }

  const attachments = (input.files || []).map((file, idx) => ({
    id: `att_${Date.now()}_${idx}`,
    name: file.name,
    size: `${(file.size / 1024).toFixed(0)} KB`,
    type: file.type,
  }));

  const newMemory: Memory = {
    id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title: firstLine.length > 60 ? `${firstLine.substring(0, 60)}...` : firstLine,
    content,
    summary: content.length > 120 ? `${content.substring(0, 120)}...` : content,
    category,
    subject: lower.includes('dbms') ? 'DBMS' : lower.includes('math') ? 'Maths' : 'General',
    importance: lower.includes('urgent') || lower.includes('exam') || lower.includes('important') ? 'high' : 'medium',
    source_type: input.files && input.files.length > 0 ? (input.files[0].type.includes('pdf') ? 'pdf' : 'image') : isUrl ? 'web' : 'telegram',
    source_ref: isUrl ? new URL(content).hostname : 'Quick Capture',
    preview_image_url: isUrl
      ? 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60'
      : undefined,
    tags: [
      { name: 'quick-capture', ai: true },
      { name: category, ai: true },
    ],
    note: '',
    attachments,
    observed_at: new Date().toISOString(),
    status: 'active',
    is_favourite: false,
    is_archived: false,
  };

  const updated = [newMemory, ...memories];
  saveMockMemories(updated);
  return newMemory;
}

export async function updateMemory(id: string, updates: UpdateMemoryInput): Promise<Memory> {
  if (!USE_MOCK) {
    return apiClient.patch<Memory>(`memories/${id}`, updates);
  }

  await delay(150);
  const memories = getMockMemories();
  const index = memories.findIndex((m) => m.id === id);

  if (index === -1) {
    throw new Error(`Memory ${id} not found`);
  }

  const updated: Memory = {
    ...memories[index],
    ...updates,
  };

  memories[index] = updated;
  saveMockMemories(memories);
  return updated;
}

export async function deleteMemory(id: string): Promise<void> {
  if (!USE_MOCK) {
    await apiClient.delete(`memories/${id}`);
    return;
  }

  await delay(150);
  const memories = getMockMemories();
  const filtered = memories.filter((m) => m.id !== id);
  saveMockMemories(filtered);
}

export async function getSpaces(): Promise<Space[]> {
  if (!USE_MOCK) {
    return apiClient.get<Space[]>('spaces');
  }

  await delay(150);
  return getMockSpaces();
}

export { deleteSpace } from './spaces';

