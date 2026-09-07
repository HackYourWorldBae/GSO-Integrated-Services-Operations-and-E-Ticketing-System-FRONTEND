import apiClient from './client';

/**
 * Projects & Announcements API Module
 *
 * Provides standardized methods for scheduled projects and announcements.
 * Leverages apiClient with automatic HttpOnly credentials and error interception.
 */

export const getProjects = () =>
  apiClient.get('/projects');

export const getProjectArchives = () =>
  apiClient.get('/projects/archives');

export const createProject = (projectData) =>
  apiClient.post('/projects', projectData);

export const updateProject = (projectId, projectData) =>
  apiClient.patch(`/projects/${projectId}`, projectData);
