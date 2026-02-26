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
