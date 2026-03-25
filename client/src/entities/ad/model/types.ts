export type AdCategory = 'electronics' | 'auto' | 'real_estate';
export type AdLayout = 'grid' | 'list';
export type SortColumn = 'title' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export type AutoItemParams = {
  brand?: string;
  model?: string;
  yearOfManufacture?: number | '';
  transmission?: 'automatic' | 'manual' | '';
  mileage?: number | '';
  enginePower?: number | '';
};

export type RealEstateItemParams = {
  type?: 'flat' | 'house' | 'room' | '';
  address?: string;
  area?: number | '';
  floor?: number | '';
};

export type ElectronicsItemParams = {
  type?: 'phone' | 'laptop' | 'misc' | '';
  brand?: string;
  model?: string;
  condition?: 'new' | 'used' | '';
  color?: string;
};

export type AdParams = AutoItemParams | RealEstateItemParams | ElectronicsItemParams;

export type AdItem = {
  id: number;
  category: AdCategory;
  title: string;
  description?: string;
  price: number;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt?: string;
  params: AdParams;
};

export type AdListItem = Pick<
  AdItem,
  'id' | 'category' | 'title' | 'price' | 'imageUrl' | 'createdAt' | 'updatedAt'
> & {
  description?: string;
  params?: AdParams;
  needsRevision?: boolean;
};

export type AdsResponse = {
  items: AdListItem[];
  total: number;
};

export type AdResponse =
  | {
      item: AdItem;
    }
  | {
      items: AdItem[];
      total?: number;
    };

export type DescriptionSuggestionResponse = {
  description: string;
  source: 'llm' | 'stub';
};

export type PriceSuggestionResponse = {
  price: number;
  comment: string;
  source: 'llm' | 'stub';
};

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type ChatResponse = {
  answer: string;
  source: 'llm' | 'stub';
};

export type EditDraft = {
  category: AdCategory;
  title: string;
  description: string;
  price: number | '';
  params: AdParams;
};

export type UpdateAdResponse = {
  success: boolean;
};
