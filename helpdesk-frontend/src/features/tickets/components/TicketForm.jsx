import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import TextArea from '../../../components/ui/TextArea';
import Button from '../../../components/ui/Button';
import { validateTicketForm } from '../utils/ticketMappers';

/**
 * Ticket Form Component
 * Reusable form for creating and editing tickets
 * Based on Figma design specifications
 */
const TicketForm = ({ 
  initialData = {}, 
  onSubmit, 
  onCancel, 
  isEdit = false,
  submitLabel = 'Create'
}) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    contactName: initialData.contactName || '',
    contactEmail: initialData.contactEmail || '',
    contactPhone: initialData.contactPhone || ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateTicketForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Submit form
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      {/* Title Input */}
      <Input
        label="Title"
        placeholder="Placeholder"
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        error={errors.title}
        maxLength={255}
      />
      
      {/* Description TextArea */}
      <TextArea
        label="Description"
        placeholder="Placeholder text..."
        rows={6}
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        error={errors.description}
        maxLength={2000}
      />
      
      {/* Contact Information Section */}
      <div className="border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        
        <div className="space-y-4">
          {/* Contact Name */}
          <div className="flex items-center gap-4">
            <label className="font-medium w-24 flex-shrink-0">Name :</label>
            <input
              type="text"
              placeholder="Placeholder"
              value={formData.contactName}
              onChange={(e) => handleChange('contactName', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Contact Email */}
          <div className="flex items-center gap-4">
            <label className="font-medium w-24 flex-shrink-0">Email :</label>
            <div className="flex-1">
              <input
                type="email"
                placeholder="Placeholder"
                value={formData.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.contactEmail ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.contactEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>
              )}
            </div>
          </div>
          
          {/* Contact Phone */}
          <div className="flex items-center gap-4">
            <label className="font-medium w-24 flex-shrink-0">Phone :</label>
            <input
              type="tel"
              placeholder="Placeholder"
              value={formData.contactPhone}
              onChange={(e) => handleChange('contactPhone', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end gap-3">
        <Button 
          type="button"
          variant="secondary" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default TicketForm;