/**
 * ==========================================
 * BACKEND CONTRACT (FastAPI Endpoints)
 * ==========================================
 * GET    /spaces          -> Space[]
 * DELETE /spaces/{id}     -> 204 No Content. Moves memories in that space to space_id = null (Unassigned) without deleting them.
 * ==========================================
 */

import { Space } from '../types/memory';
import { USE_MOCK } from '../lib/env';
import { apiClient } from './client';
import { getMockSpaces, deleteMockSpace } from '../data/mock';

const delay = (ms = 150): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export async function getSpaces(): Promise<Space[]> {
  if (!USE_MOCK) {
    return apiClient.get<Space[]>('spaces');
  }

  await delay(150);
  return getMockSpaces();
}

export async function deleteSpace(id: string): Promise<void> {
  if (!USE_MOCK) {
    await apiClient.delete(`spaces/${id}`);
    return;
  }

  await delay(200);
  deleteMockSpace(id);
}
