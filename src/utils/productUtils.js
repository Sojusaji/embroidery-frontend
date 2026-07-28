import { toast } from 'react-hot-toast';
import { logError } from './logger';

export const CATEGORY_LABELS = {
  embroidery: 'Embroidery',
  stitching: 'Stitching',
  ornaments: 'Rolled Gold',
};

export const getCategoryLabel = (category) => {
  if (!category) return 'Uncategorized';
  return CATEGORY_LABELS[category] || category.replace('-', ' ');
};

export const validateProductImage = (file) => {
  if (!file) return false;

  if (!file.type || !file.type.startsWith('image/')) {
    toast.error('Please select a valid image file (PNG, JPG, WEBP).');
    return false;
  }

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_FILE_SIZE) {
    toast.error('Image size must be under 5MB.');
    return false;
  }

  return true;
};

export const validateProductForm = (formData, isEdit = false) => {
  const numericPrice = parseFloat(formData.price);
  const numericStock = parseInt(formData.totalStock, 10);
  if (isNaN(numericPrice) || numericPrice < 0) {
    toast.error('Please enter a valid selling price.');
    return null;
  }

  let numericComparePrice = null;
  if (formData.comparePrice !== '' && formData.comparePrice !== null && formData.comparePrice !== undefined) {
    numericComparePrice = parseFloat(formData.comparePrice);
    if (isNaN(numericComparePrice) || numericComparePrice < 0) {
      toast.error('Please enter a valid compare-at price.');
      return null;
    }
    if (numericComparePrice <= numericPrice) {
      toast.error('Compare-at price must be higher than the regular selling price.');
      return null;
    }
  }

  const validStock = isNaN(numericStock) || numericStock < 0 ? 0 : numericStock;

  const parsedTags = formData.tags
    ? (Array.isArray(formData.tags)
      ? formData.tags
      : String(formData.tags).split(',').map((tag) => tag.trim()).filter(Boolean))
    : [];
 
  return {
    name: formData.name?.trim() || '',
    description: formData.description?.trim() || '',
    price: numericPrice,
    comparePrice: numericComparePrice,
    sku: formData.sku?.trim() || '',
    totalStock: validStock,
    inStock: validStock > 0,
    category: formData.category || 'embroidery',
    status: formData.status || 'active',
    tags: parsedTags,
    isFeatured: Boolean(formData.isFeatured),
  };
};
