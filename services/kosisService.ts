
import { KosisData } from '../types';

export async function fetchKosisData(apiUrl: string): Promise<KosisData[]> {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`KOSIS API error: ${response.status} ${response.statusText}`);
    }
    const data: KosisData[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching KOSIS data:', error);
    throw error;
  }
}
