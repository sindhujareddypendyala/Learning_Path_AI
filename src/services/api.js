import axios from 'axios';

export const api = axios.create({
  baseURL: '/api/v1',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('learnpath-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function loginUser(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  localStorage.setItem('learnpath-auth', 'true');
  localStorage.setItem('learnpath-token', data.access_token);
  localStorage.setItem('learnpath-user-email', data.user.email);
  return data;
}

export async function registerUser(email, password) {
  const { data } = await api.post('/auth/register', { email, password });
  return data;
}

export async function saveProfile(profile) {
  const { data } = await api.post('/users/profile', profile);
  localStorage.setItem('learnpath-profile', 'true');
  return data;
}

export async function getProfile() {
  const { data } = await api.get('/users/profile');
  localStorage.setItem('learnpath-profile', 'true');
  return data;
}

function normalizeCourse(data) {
  if (!data) return null;
  const projects = (data.projects || []).map((project) => ({
    ...project,
    duration: project.estimated_time || project.duration || 'Portfolio sprint',
    skills: Array.isArray(project.skills) ? project.skills : [],
  }));

  return {
    ...data,
    topic: data.goal || data.title || 'Personalized Learning Path',
    progress: data.progress_percent || 0,
    modules: (data.modules || []).map((module) => ({
      ...module,
      progress: module.progress_percent || module.progress || 0,
      quiz: module.quiz?.questions || module.quiz || [],
      projects,
    })),
    interview: (data.interview_questions || []).map((item) => ({
      ...item,
      type: item.question_type || item.type || 'Technical',
    })),
  };
}

export async function generateCourse(payload) {
  const { data } = await api.post('/courses/generate', payload);
  const course = normalizeCourse(data);
  localStorage.setItem('learnpath-generated', JSON.stringify(course));
  return course;
}

export async function getCurrentCourse() {
  const { data } = await api.get('/courses/current');
  const course = normalizeCourse(data);
  localStorage.setItem('learnpath-generated', JSON.stringify(course));
  return course;
}
