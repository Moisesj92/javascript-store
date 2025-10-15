export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  stock: number;
  category_id: number;
}

export interface UpdateProductRequest {
  name?: string;
  price?: number;
  stock?: number;
  category_id?: number;
}
