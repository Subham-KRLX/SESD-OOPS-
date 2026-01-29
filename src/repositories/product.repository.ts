import { Product, CreateProductDto, UpdateProductDto, ProductQueryOptions } from '../models/product.model';

export class ProductRepository {
    private products: Product[] = [];

    async findAll(options: ProductQueryOptions): Promise<{ data: Product[]; total: number }> {
        let result = [...this.products];

        // Search
        if (options.search) {
            const search = options.search.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(search) ||
                p.description.toLowerCase().includes(search)
            );
        }

        // Filter
        if (options.category) {
            result = result.filter(p => p.category === options.category);
        }

        // Sort
        if (options.sortBy) {
            const sortBy = options.sortBy as keyof Product;
            const order = options.sortOrder === 'desc' ? -1 : 1;
            result.sort((a, b) => {
                if (a[sortBy] < b[sortBy]) return -1 * order;
                if (a[sortBy] > b[sortBy]) return 1 * order;
                return 0;
            });
        }

        const total = result.length;

        // Pagination
        if (options.page && options.limit) {
            const start = (options.page - 1) * options.limit;
            result = result.slice(start, start + options.limit);
        }

        return { data: result, total };
    }

    async findById(id: string): Promise<Product | undefined> {
        return this.products.find(p => p.id === id);
    }

    async create(data: CreateProductDto): Promise<Product> {
        const newProduct: Product = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.products.push(newProduct);
        return newProduct;
    }

    async update(id: string, data: UpdateProductDto): Promise<Product | undefined> {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) return undefined;

        this.products[index] = {
            ...this.products[index],
            ...data,
            updatedAt: new Date()
        };
        return this.products[index];
    }

    async delete(id: string): Promise<boolean> {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) return false;

        this.products.splice(index, 1);
        return true;
    }
}
