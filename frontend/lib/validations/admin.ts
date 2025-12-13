import { z } from 'zod';

export const loginSchema = z.object({
  secret: z.string().min(32, 'Invalid admin secret'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters'),
  description: z
    .string()
    .max(5000, 'Description must be less than 5000 characters')
    .optional()
    .or(z.literal('')),
  price: z.number().min(0.01, 'Price must be at least $0.01'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  categoryId: z.string().uuid('Please select a category'),
  stock: z.number().int('Stock must be a whole number').min(0, 'Stock cannot be negative'),
});

export type ProductFormData = z.infer<typeof productSchema>;
