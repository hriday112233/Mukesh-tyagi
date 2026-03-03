export interface Room {
  id: string;
  name: string;
  points: { x: number; y: number }[];
  color: string;
  area: number; // in sq meters
}

export interface ProjectRequirement {
  id: string;
  category: string;
  item: string;
  quantity: number;
  specification: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface DesignTrend {
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
}

export interface LayoutSuggestion {
  title: string;
  description: string;
  furniture: string[];
  explanation: string;
}

export interface RoomStandard {
  roomType: string;
  minDimensions: { width: number; length: number };
  recommendedDimensions: { width: number; length: number };
  luxuryDimensions: { width: number; length: number };
  analysis: string;
  keyConsiderations: string[];
}

export interface CatalogItem {
  id: string;
  name: string;
  category: 'flooring' | 'paint' | 'wallpaper' | 'furniture' | 'lighting' | 'decorative' | 'plumbing' | 'scenery';
  type: string;
  style: 'modern' | 'minimalist' | 'bohemian' | 'industrial' | 'scandinavian' | 'classic';
  application: string[];
  specifications: { [key: string]: string };
  price: number;
  unit: string;
  brand: string;
  imageUrl: string;
  supplierUrl: string;
  isPro?: boolean;
}

export type SubscriptionTier = 'free' | 'pro';

export interface UserSubscription {
  tier: SubscriptionTier;
  expiresAt?: string;
}
