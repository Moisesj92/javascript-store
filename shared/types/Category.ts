export interface Category {
  id: number;
  name: String;
  created_at: Date;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name?: string;
}
