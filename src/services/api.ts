import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add JWT token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle 401 errors (unauthorized)
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(username: string, email: string, password: string) {
    const response = await this.client.post('/auth/register', { username, email, password });
    return response.data;
  }

  async login(username: string, password: string) {
    const response = await this.client.post('/auth/login', { username, password });
    localStorage.setItem('access_token', response.data.access_token);
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  // Category endpoints
  async getCategories() {
    const response = await this.client.get('/categories');
    return response.data;
  }

  async createCategory(name: string, description: string) {
    const response = await this.client.post('/categories', { name, description });
    return response.data;
  }

  async updateCategory(id: string, data: { name?: string; description?: string }) {
    const response = await this.client.put(`/categories/${id}`, data);
    return response.data;
  }

  async deleteCategory(id: string) {
    const response = await this.client.delete(`/categories/${id}`);
    return response.data;
  }

  // Feature endpoints
  async createFeature(categoryId: string, feature: any) {
    const response = await this.client.post(`/categories/${categoryId}/features`, feature);
    return response.data;
  }

  async updateFeature(featureId: string, data: any) {
    const response = await this.client.put(`/features/${featureId}`, data);
    return response.data;
  }

  async deleteFeature(featureId: string) {
    const response = await this.client.delete(`/features/${featureId}`);
    return response.data;
  }
}

export const apiClient = new ApiClient();
