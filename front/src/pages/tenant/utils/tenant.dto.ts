export interface Tenant {
  id: number;
  name: string;
  description: string;
  phone?: string;
  company?: string;
  licence: Licence;
  created_at: string;
  updated_at: string;
  licenceId: number;
}

export interface TenantCreateDto {
  name: string;
  description?: string;
  phone?: string;
  company?: string;
  adminId?: string;
  image?: string;
}

export interface TenantEditDto {
  id: number;
  name: string;
  description?: string;
  phone?: string;
  company?: string;
  image?: string;
  adminId?: string;
  licenceId: number;
}
export enum PlanType {
  FREE = "Free",
  PRO = "Pro",
  ENTERPRISE = "Enterprise",
  LIGHT = "Light",
  STANDARD = "Standard",
  PLUS = "Plus",
  CUSTOM = "Custom"
}

export type UpgradePlanDto={
  id: number;
  subscriptionPlanId: string;
}
export type Licence = {
  id:number;
  name:string;
endsAt:string;
startAt:string;
subscriptionPlan: SubscriptionPlan;
}
export type SubscriptionPlan = {
  id:number;
  name:string;
  description?:string;
  specs:string;
  price:string;
}