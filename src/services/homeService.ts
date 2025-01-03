import { $api } from '@/api/api';

export interface DashboardData {
  userName: string;
  donorSince: string;
  totalDonations: string;
  donationsCount: string;
  beneficiariesCount: number;
  lastDonation: {
    project: string;
    amount: string;
  };
  organization: {
    name: string;
    logo: string;
  };
}

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  status: {
    label: string;
    color: string;
  };
  progress: number;
  beneficiaries: number;
  goal: string;
}

export const homeService = {
    async getDonorData(): Promise<any> {
        const { data } = await $api.get('/perfil');
        return data.data;
    },

  async getDashboardData(): Promise<DashboardData> {
    const { data } = await $api.get('/dashboard');
    return data;
  },

  async getFeaturedProjects(): Promise<Project[]> {
    const { data } = await $api.get('/projects/featured');
    return data;
  },

  async getRecentActivities() {
    const { data } = await $api.get('/activities/recent');
    return data;
  },

  async getUpcomingEvents() {
    const { data } = await $api.get('/events/upcoming');
    return data;
  },

  async getAlerts() {
    const { data } = await $api.get('/alerts');
    return data;
  },

  async getMedia() {
    const { data } = await $api.get('/media');
    return data;
  },

  async getNews() {
    const { data } = await $api.get('/news');
    return data;
  },
};