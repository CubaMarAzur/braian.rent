// Property types for dashboard
export type PaymentStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID';
export type DocumentType =
  | 'LEASE_AGREEMENT'
  | 'INSURANCE'
  | 'HANDOVER_PROTOCOL'
  | 'OTHER';

export interface TenantInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface CurrentPayment {
  id: string;
  amountDue: number;
  amountPaid: number | null;
  dueDate: string;
  status: PaymentStatus;
  type: string;
  description: string | null;
}

export interface PropertyDocument {
  id: string;
  type: DocumentType;
  fileUrl: string;
  expiresAt: string | null;
  createdAt: string;
}

export interface PropertyWithDetails {
  id: string;
  address: string;
  city: string;
  postalCode: string;
  tenant: TenantInfo | null;
  currentPayment: CurrentPayment | null;
  documents: PropertyDocument[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
