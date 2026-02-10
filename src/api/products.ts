import apiClient from './client';
import {
  ApiResponse,
  Product,
  ProductCategory,
  ProductOrder,
  ProductStock,
  CreateProductCategoryRequest,
  CreateOrderRequest,
  AddStockRequest,
  PaginatedData,
} from './types';

export const productsApi = {
  // Categories
  createCategory: async (data: CreateProductCategoryRequest) => {
    const res = await apiClient.post<ApiResponse<ProductCategory>>('/product/create-category', data);
    return res.data;
  },

  getCategories: async (params: { pageNumber: number; pageSize: number; filterValue?: string }) => {
    const res = await apiClient.get<ApiResponse<PaginatedData<ProductCategory>>>('/product/get-category', { params });
    return res.data;
  },

  deleteCategory: async (categoryId: string) => {
    const res = await apiClient.delete<ApiResponse>('/product/delete-category', { params: { categoryId } });
    return res.data;
  },

  enableDisableCategory: async (categoryId: string, enable: boolean) => {
    const res = await apiClient.patch<ApiResponse>('/product/enable-disable-category', { enable }, { params: { categoryId } });
    return res.data;
  },

  getEnabledCategories: async () => {
    const res = await apiClient.get<ApiResponse<ProductCategory[]>>('/product/get-enabled-category');
    return res.data;
  },

  // Products
  addProduct: async (data: FormData) => {
    const res = await apiClient.post<ApiResponse<Product>>('/product/add-product', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  getByCategory: async (params: { pageNumber: number; pageSize: number; filterValue?: string; categoryId: string }) => {
    const res = await apiClient.get<ApiResponse<PaginatedData<Product>>>('/product/get-product-by-category', { params });
    return res.data;
  },

  deleteProduct: async (productId: string) => {
    const res = await apiClient.delete<ApiResponse>('/product/delete-product', { params: { productId } });
    return res.data;
  },

  enableDisableProduct: async (productId: string, enable: boolean) => {
    const res = await apiClient.patch<ApiResponse>('/product/enable-disable-product', { enable }, { params: { productId } });
    return res.data;
  },

  getById: async (productId: string) => {
    const res = await apiClient.get<ApiResponse<Product>>('/product/get-product-by-id', { params: { productId } });
    return res.data;
  },

  getBySalon: async (params: { pageNumber: number; pageSize: number; filterValue?: string }) => {
    const res = await apiClient.get<ApiResponse<PaginatedData<Product>>>('/product/get-product-by-salon', { params });
    return res.data;
  },

  getBySalonForMobile: async () => {
    const res = await apiClient.get<ApiResponse<Product[]>>('/product/get-product-by-salon-for-mobile');
    return res.data;
  },

  getSimilar: async (productId: string) => {
    const res = await apiClient.get<ApiResponse<Product[]>>('/product/get-similar-product', { params: { productId } });
    return res.data;
  },

  // Orders
  createOrder: async (data: CreateOrderRequest) => {
    const res = await apiClient.post<ApiResponse<ProductOrder>>('/product/add-order', data);
    return res.data;
  },

  getOrdersByUser: async (params: { pageNumber: number; pageSize: number }) => {
    const res = await apiClient.get<ApiResponse<PaginatedData<ProductOrder>>>('/product/get-order-by-user', { params });
    return res.data;
  },

  getOrdersBySalon: async (params: { pageNumber: number; pageSize: number }) => {
    const res = await apiClient.get<ApiResponse<PaginatedData<ProductOrder>>>('/product/get-order-by-salon', { params });
    return res.data;
  },

  changeOrderStatus: async (orderId: string, orderStatus: string) => {
    const res = await apiClient.patch<ApiResponse>('/product/change-order-status', { orderStatus }, { params: { orderId } });
    return res.data;
  },

  // Stock
  addStock: async (data: AddStockRequest) => {
    const res = await apiClient.post<ApiResponse>('/product/add-stock', data);
    return res.data;
  },

  getStockByProduct: async (params: { productId: string; pageNumber: number; pageSize: number }) => {
    const res = await apiClient.get<ApiResponse<PaginatedData<ProductStock>>>('/product/get-stock-by-product', { params });
    return res.data;
  },
};
