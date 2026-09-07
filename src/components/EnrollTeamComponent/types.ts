export interface FeatureItem {
  text: string;
  included: boolean;
}

export interface Plan {
  id: string | number;
  plan_id?: string;
  plan_name: string;
  name?: string;
  plan_description: string;
  description?: string;
  banner_text?: string;
  amount: number;
  monthly_amount: number;
  currency: string;
  plan_type: number;
  no_of_licence: number;
  original_price: number;
  feature?: string[];
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  gstNumber: string;
}

export interface CheckoutErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
}

export interface CheckoutCalculation {
  seatsPrice: number;
  savings: number;
  subtotal: number;
  couponDiscount: number;
  tax: number;
  total: number;
  currencySymbol: string;
}
