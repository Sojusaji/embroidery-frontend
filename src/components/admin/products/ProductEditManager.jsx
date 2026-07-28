import React from 'react';
import { X, Save, Edit3, Image as ImageIcon } from 'lucide-react';
import { validateProductImage } from '../../../utils/productUtils';

export const ProductEditModal = ({
  handleEditFormChange,
  editFormData,
  editFileInputRef,
  editFile,
  editPreview,
  onImageFileSelect,
  closeEditModal,
  handleEditSubmit,
  loading,
}) => {
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateProductImage(selectedFile)) {
      onImageFileSelect(selectedFile);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-black/20">
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-primary" /> Edit Product
          </h3>
          <button
            type="button"
            onClick={closeEditModal}
            disabled={loading}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content - Scrollable Form */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          <form id="edit-product-form" onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label htmlFor="edit-name" className="text-xs sm:text-sm text-gray-400 block mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-name"
                type="text"
                name="name"
                value={editFormData.name || ''}
                onChange={handleEditFormChange}
                disabled={loading}
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="edit-description" className="text-xs sm:text-sm text-gray-400 block mb-1">
                Description
              </label>
              <textarea
                id="edit-description"
                name="description"
                value={editFormData.description || ''}
                onChange={handleEditFormChange}
                disabled={loading}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white min-h-[90px] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none disabled:opacity-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-price" className="text-xs sm:text-sm text-gray-400 block mb-1">
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  min="0"
                  name="price"
                  value={editFormData.price || ''}
                  onChange={handleEditFormChange}
                  disabled={loading}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none disabled:opacity-50"
                />
              </div>

              <div>
                <label htmlFor="edit-comparePrice" className="text-xs sm:text-sm text-gray-400 block mb-1">
                  Compare Price ($)
                </label>
                <input
                  id="edit-comparePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  name="comparePrice"
                  value={editFormData.comparePrice || ''}
                  onChange={handleEditFormChange}
                  disabled={loading}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none disabled:opacity-50"
                />
              </div>

              <div>
                <label htmlFor="edit-sku" className="text-xs sm:text-sm text-gray-400 block mb-1">
                  SKU
                </label>
                <input
                  id="edit-sku"
                  type="text"
                  name="sku"
                  value={editFormData.sku || ''}
                  onChange={handleEditFormChange}
                  disabled={loading}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none disabled:opacity-50"
                />
              </div>

              <div>
                <label htmlFor="edit-totalStock" className="text-xs sm:text-sm text-gray-400 block mb-1">
                  Stock <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit-totalStock"
                  type="number"
                  name="totalStock"
                  min="0"
                  value={editFormData.totalStock ?? ''}
                  onChange={handleEditFormChange}
                  disabled={loading}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none disabled:opacity-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-category" className="text-xs sm:text-sm text-gray-400 block mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="edit-category"
                  name="category"
                  value={editFormData.category || 'embroidery'}
                  onChange={handleEditFormChange}
                  disabled={loading}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer disabled:opacity-50"
                >
                  <option value="embroidery">Embroidery</option>
                  <option value="stitching">Stitching</option>
                  <option value="ornaments">Rolled Gold Ornaments</option>
                </select>
              </div>

              <div>
                <label htmlFor="edit-status" className="text-xs sm:text-sm text-gray-400 block mb-1">
                  Status
                </label>
                <select
                  id="edit-status"
                  name="status"
                  value={editFormData.status || 'active'}
                  onChange={handleEditFormChange}
                  disabled={loading}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer disabled:opacity-50"
                >
                  <option value="active">Active (Visible)</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="edit-tags" className="text-xs sm:text-sm text-gray-400 block mb-1">
                Tags / Material
              </label>
              <input
                id="edit-tags"
                type="text"
                name="tags"
                value={editFormData.tags || ''}
                onChange={handleEditFormChange}
                disabled={loading}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none disabled:opacity-50"
              />
            </div>

            <div className="flex items-center gap-3 bg-black/20 p-4 rounded-xl border border-white/5">
              <input
                type="checkbox"
                id="edit-isFeatured"
                name="isFeatured"
                checked={Boolean(editFormData.isFeatured)}
                onChange={handleEditFormChange}
                disabled={loading}
                className="w-5 h-5 accent-primary cursor-pointer rounded disabled:opacity-50"
              />
              <label htmlFor="edit-isFeatured" className="text-sm text-gray-300 cursor-pointer select-none">
                Feature this product on the homepage
              </label>
            </div>

            {/* Edit Photo Section */}
            <div>
              <label className="text-xs sm:text-sm text-gray-400 block mb-2">Product Photo</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-black/40 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                  {editPreview ? (
                    <img src={editPreview} alt="Edit preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={24} className="text-gray-600" />
                  )}
                </div>
                <label className="flex-1 border-2 border-dashed border-white/10 hover:border-primary transition-colors bg-black/30 rounded-xl p-4 cursor-pointer text-center">
                  <span className="text-xs sm:text-sm text-gray-400 block">
                    {editFile ? editFile.name : 'Click to replace image (optional)'}
                  </span>
                  <input
                    ref={editFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={loading}
                  />
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:p-6 border-t border-white/10 bg-black/20 flex justify-end gap-3">
          <button
            type="button"
            onClick={closeEditModal}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors text-sm font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-product-form"
            disabled={loading}
            className="bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white font-bold px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 text-sm disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
