import config from '../config/environment.config';

interface Address {
  city?: string;
  country?: string;
  state?: string;
}

export async function getAddress(data: { latitude: number; longitude: number }): Promise<Address | undefined> {
  try {
    const response: any = await fetch(`${config.LOCATION_URL}?format=json&lat=${data.latitude}&lon=${data.longitude}`);
    const res = await response.json();

    return {
      city: res.address.city,
      country: res.address.country,
      state: res.address.state,
    };
  } catch (error) {
    console.log('error while fetching address');
  }
}
