export interface Address {
  id: number;
  label: string;
  line1: string;
  line2?: string | null;
  city: string;
  state?: string | null;
  postalCode: string;
  country: string;
}

export interface UserSummary {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  addressCount: number;
}

export interface UserDetail {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  addresses: Address[];
}

export interface UpdateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
}

export interface AddressRequest {
  label: string;
  line1: string;
  line2?: string | null;
  city: string;
  state?: string | null;
  postalCode: string;
  country: string;
}