import type { Product } from "../../../../shared/types/Product";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
            {product.name}
          </h2>
        </div>

        <p className="text-sm text-gray-500 mb-2 capitalize">
          {product.category_name}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-green-600">
            ${product.price}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(product)}
              className="text-blue-600 hover:text-blue-800"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="text-red-600 hover:text-red-800"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
