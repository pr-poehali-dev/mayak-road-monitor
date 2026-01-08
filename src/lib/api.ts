const API_BASE_URL = 'https://functions.poehali.dev';

const ENDPOINTS = {
  auth: 'b4a304a9-d983-4d12-9139-cc183a91e8f2',
  incidents: 'c34941e5-0f82-4dde-b572-be7940968d58',
  confirmations: 'edb55275-821a-4821-b51b-1653f19dd315',
};

export interface User {
  id: number;
  telegram_id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
  is_admin: boolean;
}

export interface Incident {
  id: number;
  user_id: number;
  type: 'accident' | 'ice' | 'snow' | 'repair' | 'police';
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  status: 'pending' | 'active' | 'resolved';
  created_at: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  confirmations_count?: number;
  distance?: number;
}

class API {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}/${ENDPOINTS[endpoint as keyof typeof ENDPOINTS]}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  }

  async authenticateWithTelegram(telegramData: any): Promise<User> {
    const result = await this.request('auth', {
      method: 'POST',
      body: JSON.stringify({ telegram_data: telegramData }),
    });
    return result.user;
  }

  async getIncidents(params?: { lat?: number; lng?: number; radius?: number; status?: string }): Promise<Incident[]> {
    const queryParams = new URLSearchParams();
    if (params?.lat) queryParams.append('lat', params.lat.toString());
    if (params?.lng) queryParams.append('lng', params.lng.toString());
    if (params?.radius) queryParams.append('radius', params.radius.toString());
    if (params?.status) queryParams.append('status', params.status);

    const url = `${API_BASE_URL}/${ENDPOINTS.incidents}${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.incidents;
  }

  async createIncident(incident: {
    user_id: number;
    type: string;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
  }): Promise<Incident> {
    const result = await this.request('incidents', {
      method: 'POST',
      body: JSON.stringify(incident),
    });
    return result.incident;
  }

  async updateIncidentStatus(id: number, status: string): Promise<Incident> {
    const result = await this.request('incidents', {
      method: 'PUT',
      body: JSON.stringify({ id, status }),
    });
    return result.incident;
  }

  async confirmIncident(incidentId: number, userId: number): Promise<{ success: boolean; confirmations_count: number }> {
    return await this.request('confirmations', {
      method: 'POST',
      body: JSON.stringify({ incident_id: incidentId, user_id: userId }),
    });
  }
}

export const api = new API();
