export interface ItemType {
  _id: string;
  name: string;
  description?: string;
  link?: string;
  thumb?: string;
  lg_img?: string;
  categories?: string;
  subcategory?: string;
  price?: string;
  short_name?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserType {
  _id: string;
  email: string;
  displayName?: string;
  active: boolean;
  favorites: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
