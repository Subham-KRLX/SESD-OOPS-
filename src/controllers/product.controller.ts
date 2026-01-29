import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { ProductQueryOptions } from '../models/product.model';

export class ProductController {
    constructor(private productService: ProductService) { }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const options: ProductQueryOptions = {
                search: req.query.search as string,
                category: req.query.category as string,
                sortBy: req.query.sortBy as string,
                sortOrder: req.query.sortOrder as 'asc' | 'desc',
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 10
            };
            const result = await this.productService.getAllProducts(options);
            res.json({
                status: 'success',
                ...result
            });
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const product = await this.productService.getProductById(req.params.id);
            res.json({
                status: 'success',
                data: product
            });
        } catch (error) {
            next(error);
        }
    };

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const product = await this.productService.createProduct(req.body);
            res.status(201).json({
                status: 'success',
                data: product
            });
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const product = await this.productService.updateProduct(req.params.id, req.body);
            res.json({
                status: 'success',
                data: product
            });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.productService.deleteProduct(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}
