import { mockExceptions } from '../data/data';
import type { ExceptionItem } from '../types/index';

const wait = (ms = 400) => new Promise((res) => setTimeout(res, ms));

// GET /api/exceptions 
export async function fetchExceptions(): Promise<ExceptionItem[]> {
  await wait();
  return [...mockExceptions];
}

//  PATCH /api/exceptions/:id
export async function resolveException(
  id: string,
  resolvedBy: string,
  resolverComments: string
): Promise<ExceptionItem> {
  await wait(200);
  const exception = mockExceptions.find((e) => e.id === id);
  if (!exception) throw new Error(`Exception ${id} not found`);
  exception.isResolved = true;
  exception.resolvedBy = resolvedBy;
  exception.resolverComments = resolverComments;
  return exception;
}
