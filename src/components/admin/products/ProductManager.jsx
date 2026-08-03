import React, { useState, useEffect, useRef } from 'react';
import { Plus, Upload, ZoomIn, X, Image as ImageIcon, Package } from 'lucide-react';
import { toast } from 'react-hot-toast';

import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

import { useUploadImage, useCreateProduct, useUpdateProduct, useUpdateProductImage } from '../../../hook/useProducts';
import { validateProductForm, validateProductImage, getCategoryLabel } from '../../../utils/productUtils';
import { logError } from '../../../utils/logger';

import ProductInventory from './ProductInventoryTable';
import TrashBinManager from './TrashBinManager';
import { ProductEditModal } from './ProductEditManager';

const INITIAL_FORM_STATE = {
  name: '',
  description: '',
  price: '',
  comparePrice: '',
  sku: '',
  totalStock: '',
  category: 'embroidery',
  status: 'active',
  tags: '',
  isFeatured: false,
};

export const ProductManager = () => {
  const uploadImageMutation = useUploadImage();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const updateProductImageMutation = useUpdateProductImage();

  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [productView, setProductView] = useState('catalog');
  const [isOpen, setIsOpen] = useState(false);

  // Edit Product Modal States
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState(INITIAL_FORM_STATE);
  const [editFile, setEditFile] = useState(null);
  const [editPreview, setEditPreview] = useState(null);

  const loading =
    uploadImageMutation.isPending ||
    createProductMutation.isPending ||
    updateProductMutation.isPending ||
    updateProductImageMutation.isPending;

  useEffect(() => {
    return () => {
      if (preview && preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
      if (editPreview && editPreview?.startsWith('blob:')) URL.revokeObjectURL(editPreview);
    };
  }, [preview, editPreview]);

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const clearFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!validateProductImage(selectedFile)) {
      clearFileInput();
      return;
    }

    if (preview) URL.revokeObjectURL(preview);
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files?.[0];
    if (!selectedFile) return;

    if (!validateProductImage(selectedFile)) {
      clearFileInput();
      return;
    }

    if (preview) URL.revokeObjectURL(preview);
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setFile(null);
    setIsOpen(false);
    clearFileInput();
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please upload a product image.');
      return;
    }

    const validatedPayload = validateProductForm(formData);
    if (!validatedPayload) return;

    try {
      const uploadResult = await uploadImageMutation.mutateAsync({
        file,
        category: validatedPayload.category,
      });

      const imageUrl = uploadResult?.data?.imageUrl || '';
      const sha = uploadResult?.data?.sha;
      const filePath = uploadResult?.data?.filePath;

      if (!imageUrl || !sha || !filePath) {
        throw new Error('Image upload failed');
      }

      const productPayload = {
        ...validatedPayload,
        image: imageUrl,
        imageInfo: {
          filePath,
          sha,
        },
      };

      await createProductMutation.mutateAsync(productPayload);

      const successMsg =
        formData.status === 'draft'
          ? 'Product saved as a draft! 📝'
          : 'Product published to store successfully! 🎉';

      toast.success(successMsg);

      if (preview) URL.revokeObjectURL(preview);

      setFormData(INITIAL_FORM_STATE);
      setFile(null);
      setPreview(null);
      setIsOpen(false);
      clearFileInput();
    } catch (err) {
      logError('AdminDashboard_ProductUpload_error:', err);
    }
  };

  // --- EDIT MODAL HANDLERS ---
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price !== undefined && product.price !== null ? String(product.price) : '',
      comparePrice: product.comparePrice !== undefined && product.comparePrice !== null ? String(product.comparePrice) : '',
      sku: product.sku || '',
      totalStock: product.totalStock !== undefined ? String(product.totalStock) : '',
      category: product.category || 'embroidery',
      status: product.status || 'active',
      tags: Array.isArray(product.tags) ? product.tags.join(',') : product.tags || '',
      isFeatured: Boolean(product.isFeatured),
    });
    setEditPreview(product.image || null);
    setEditFile(null);
  };

  const handleEditImageSelect = (selectedFile) => {
    if (editPreview && editPreview.startsWith('blob:')) {
      URL.revokeObjectURL(editPreview);
    }
    setEditFile(selectedFile);
    setEditPreview(URL.createObjectURL(selectedFile));
  };

  const closeEditModal = () => {
    if (editPreview && editPreview.startsWith('blob:')) {
      URL.revokeObjectURL(editPreview);
    }
    setEditingProduct(null);
    setEditFormData(INITIAL_FORM_STATE);
    setEditFile(null);
    setEditPreview(null);
  };

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const validatedPayload = validateProductForm(editFormData, true);
    if (!validatedPayload) return;

    try {
      let finalImageUrl = editingProduct.image;
      let finalImageInfo = editingProduct.imageInfo;

      // Handle optional new image upload during edit
      if (editFile) {
        const uploadResult = await updateProductImageMutation.mutateAsync({
          file: editFile,
          filePath: editingProduct?.imageInfo?.filePath,
          sha: editingProduct?.imageInfo?.sha,
          folder: editingProduct?.category,
          productId: editingProduct?._id || editingProduct?.id,
        });
        console.log('updateResult of image:', uploadResult);
        const imgData = uploadResult?.data || uploadResult?.response?.data;
        finalImageUrl = imgData?.imageUrl || finalImageUrl;
        finalImageInfo = {
          filePath: imgData?.filePath || editingProduct?.imageInfo?.filePath,
          sha: imgData?.sha || editingProduct?.imageInfo?.sha,
        };
      }

      const updatedProductData = {
        ...validatedPayload,
        image: finalImageUrl,
        imageInfo: finalImageInfo,
      };
      const productId = editingProduct._id || editingProduct.id;

      const productUpdate = await updateProductMutation.mutateAsync({
        productId,
        productData: updatedProductData,
      });
      toast.success('Product updated successfully! ✨');
      closeEditModal();
    } catch (err) {
      logError('ProductUpdate_error', err);
    }
  };

  // Safe formatting for prices in live preview
  const formatDisplayPrice = (val) => {
    const num = parseFloat(val);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {productView === 'catalog' ? (
        <>
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">Manage Products</h1>
              <p className="text-gray-400 text-sm sm:text-base mt-1">
                Add new embroidery designs, stitching services, or ornaments to your catalog.
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* FORM SECTION */}
            <div className="lg:col-span-7 glass-panel p-4 sm:p-6 bg-surface/50 border-white/5 w-full">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2 text-white">
                <Plus className="text-primary w-5 h-5" /> Add New Product
              </h2>

              <form onSubmit={handleProductSubmit} className="space-y-5">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="product-name" className="text-xs sm:text-sm text-gray-400 block mb-1">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="product-name"
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleProductChange}
                      disabled={loading}
                      required
                      className="w-full bg-black/40 border border-white/10 hover:border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 disabled:opacity-50"
                      placeholder="e.g. Floral Embroidery Saree"
                    />
                  </div>
                  <div>
                    <label htmlFor="product-description" className="text-xs sm:text-sm text-gray-400 block mb-1">
                      Description
                    </label>
                    <textarea
                      id="product-description"
                      name="description"
                      value={formData.description || ''}
                      onChange={handleProductChange}
                      disabled={loading}
                      className="w-full bg-black/40 border border-white/10 hover:border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white min-h-[90px] sm:min-h-[100px] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 disabled:opacity-50"
                      placeholder="Describe the material, design, and features..."
                    />
                  </div>
                </div>

                <hr className="border-white/5" />

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label htmlFor="product-price" className="text-xs sm:text-sm text-gray-400 block mb-1">
                      Price ($) <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="product-price"
                      type="number"
                      step="0.01"
                      min="0"
                      name="price"
                      value={formData.price || ''}
                      onChange={handleProductChange}
                      disabled={loading}
                      required
                      placeholder="0.00"
                      className="w-full bg-black/40 border border-white/10 hover:border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label htmlFor="product-comparePrice" className="text-xs sm:text-sm text-gray-400 block mb-1">
                      Compare Price ($)
                    </label>
                    <input
                      id="product-comparePrice"
                      type="number"
                      step="0.01"
                      min="0"
                      name="comparePrice"
                      value={formData.comparePrice || ''}
                      onChange={handleProductChange}
                      disabled={loading}
                      placeholder="0.00"
                      className="w-full bg-black/40 border border-white/10 hover:border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label htmlFor="product-sku" className="text-xs sm:text-sm text-gray-400 block mb-1">
                      SKU
                    </label>
                    <input
                      id="product-sku"
                      type="text"
                      name="sku"
                      value={formData.sku || ''}
                      onChange={handleProductChange}
                      disabled={loading}
                      placeholder="EMB-001"
                      className="w-full bg-black/40 border border-white/10 hover:border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label htmlFor="product-totalStock" className="text-xs sm:text-sm text-gray-400 block mb-1">
                      Stock <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="product-totalStock"
                      type="number"
                      name="totalStock"
                      min="0"
                      value={formData.totalStock ?? ''}
                      onChange={handleProductChange}
                      disabled={loading}
                      required
                      placeholder="0"
                      className="w-full bg-black/40 border border-white/10 hover:border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 disabled:opacity-50"
                    />
                  </div>
                </div>

                <hr className="border-white/5" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="product-category" className="text-xs sm:text-sm text-gray-400 block mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="product-category"
                      name="category"
                      value={formData.category || 'embroidery'}
                      onChange={handleProductChange}
                      disabled={loading}
                      className="w-full bg-black/40 border border-white/10 hover:border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 cursor-pointer disabled:opacity-50"
                    >
                      <option value="embroidery">Embroidery</option>
                      <option value="stitching">Stitching</option>
                      <option value="ornaments">Rolled Gold Ornaments</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="product-status" className="text-xs sm:text-sm text-gray-400 block mb-1">
                      Status
                    </label>
                    <select
                      id="product-status"
                      name="status"
                      value={formData.status || 'active'}
                      onChange={handleProductChange}
                      disabled={loading}
                      className="w-full bg-black/40 border border-white/10 hover:border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 cursor-pointer disabled:opacity-50"
                    >
                      <option value="active">Active (Visible)</option>
                      <option value="draft">Draft (Hidden)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="product-tags" className="text-xs sm:text-sm text-gray-400 block mb-1">
                      Tags / Material (Comma separated)
                    </label>
                    <input
                      id="product-tags"
                      type="text"
                      name="tags"
                      value={formData.tags || ''}
                      onChange={handleProductChange}
                      disabled={loading}
                      placeholder="Cotton, Hand-stitched, 18k Gold"
                      className="w-full bg-black/40 border border-white/10 hover:border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-black/20 p-3 sm:p-4 rounded-xl border border-white/5">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    name="isFeatured"
                    checked={Boolean(formData.isFeatured)}
                    onChange={handleProductChange}
                    disabled={loading}
                    className="w-4 h-4 sm:w-5 sm:h-5 accent-primary cursor-pointer rounded disabled:opacity-50"
                  />
                  <label htmlFor="isFeatured" className="text-xs sm:text-sm text-gray-300 cursor-pointer select-none">
                    Feature this product on the homepage
                  </label>
                </div>

                <div>
                  <label className="text-xs sm:text-sm text-gray-400 block mb-1">Upload Photo</label>
                  <label
                    htmlFor="product-image"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-white/10 hover:border-primary transition-colors bg-black/30 rounded-xl flex flex-col items-center justify-center py-6 sm:py-8 cursor-pointer group px-4 text-center"
                  >
                    <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500 group-hover:text-primary mb-2 transition-colors" />
                    <span className="text-xs sm:text-sm text-gray-400">
                      Tap to upload photo <span className="hidden sm:inline">or drag & drop file here</span>
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB</span>
                    <input
                      ref={fileInputRef}
                      id="product-image"
                      type="file"
                      name="image"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={loading}
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary-dark disabled:bg-primary/50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl mt-6 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : formData.status === 'draft' ? (
                    'Save as Draft'
                  ) : (
                    'Publish to Store'
                  )}
                </button>
              </form>
            </div>

            {/* LIVE PREVIEW SECTION */}
            <div className="lg:col-span-5 w-full glass-panel p-4 sm:p-6 bg-black/20 border-white/5 border-dashed border lg:sticky lg:top-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-400">Live Card Preview</h2>
              <div className="max-w-[280px] sm:max-w-[320px] mx-auto opacity-90 hover:opacity-100 transition-opacity">
                <div className="overflow-hidden rounded-2xl glass-panel p-2 bg-surface/80 shadow-2xl relative">
                  {Boolean(formData.isFeatured) && (
                    <div className="absolute top-4 left-4 z-20 bg-yellow-500 text-black text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
                      Featured
                    </div>
                  )}

                  {formData.totalStock !== '' && Number(formData.totalStock) === 0 && (
                    <div className="absolute top-4 right-4 z-20 bg-red-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm shadow-lg">
                      Out of Stock
                    </div>
                  )}

                  <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-subtle flex items-center justify-center bg-black/40">
                    {preview ? (
                      <div
                        role="button"
                        tabIndex={0}
                        aria-label="View full size image"
                        onClick={() => setIsOpen(true)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setIsOpen(true);
                          }
                        }}
                        className="relative w-full h-full group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded-xl"
                      >
                        <img src={preview} alt="Live Preview" className="w-full h-full object-cover touch-none transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-[10px] text-white/90 flex items-center gap-1"><ZoomIn size={12} /> Fullscreen</p>
                        </div>
                        <button
                          type="button"
                          aria-label="Remove image"
                          onClick={(e) => { e.stopPropagation(); removeImage(); }}
                          className="absolute top-3 right-3 z-30 bg-black/60 hover:bg-red-500 text-white rounded-full p-2 backdrop-blur-md hover:scale-110 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-red-400"
                        >
                          <X size={16} strokeWidth={3} />
                        </button>
                      </div>
                    ) : (
                      <ImageIcon className="w-12 h-12 text-gray-600" />
                    )}
                  </div>

                  <div className="mt-4 p-2 sm:p-3">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-white font-semibold line-clamp-1">{formData.name || 'Product Name'}</h3>
                      <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-1 rounded-md capitalize whitespace-nowrap">
                        {getCategoryLabel(formData.category)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-primary font-bold text-base sm:text-lg">
                        ${formatDisplayPrice(formData.price)}
                      </p>
                      {formData.comparePrice && parseFloat(formData.comparePrice) > parseFloat(formData.price) && (
                        <p className="text-gray-500 text-xs sm:text-sm line-through">
                          ${formatDisplayPrice(formData.comparePrice)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-8 sm:mt-12 overflow-x-auto">
            <ProductInventory
              onViewTrash={() => setProductView('trash')}
              onEditProduct={handleEditClick}
            />
          </div>
        </>
      ) : (
        <TrashBinManager onBackToInventory={() => setProductView('catalog')} />
      )}

      {editingProduct && (
        <ProductEditModal
          handleEditFormChange={handleEditFormChange}
          editFormData={editFormData}
          editFileInputRef={editFileInputRef}
          editFile={editFile}
          editPreview={editPreview}
          onImageFileSelect={handleEditImageSelect}
          closeEditModal={closeEditModal}
          handleEditSubmit={handleEditSubmit}
          loading={loading}
        />
      )}

      {/* LIGHTBOX COMPONENT */}
      <Lightbox
        open={isOpen && Boolean(preview)}
        close={() => setIsOpen(false)}
        plugins={[Zoom]}
        slides={preview ? [{ src: preview }] : []}
        render={{
          buttonPrev: () => null,
          buttonNext: () => null,
        }}
      />
    </div>
  );
};