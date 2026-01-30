import React, { useState, useEffect } from 'react';
import { Feature, Priority, TShirtSize } from '../context/DataContext';
import { XIcon } from 'lucide-react';
import { canEditFeatureField, canAssignEngineer } from '../utils/permissions';
import { apiClient } from '../services/api';

interface Engineer {
  id: number;
  username: string;
  email: string;
}

interface FeatureEditModalProps {
  feature: Feature | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (featureData: Omit<Feature, 'id'>) => void;
  userRole: string;
  userId: number;
  isNewFeature?: boolean;
}

const FeatureEditModal: React.FC<FeatureEditModalProps> = ({
  feature,
  isOpen,
  onClose,
  onSave,
  userRole,
  userId,
  isNewFeature = false,
}) => {
  const [formData, setFormData] = useState<Omit<Feature, 'id'>>({
    title: '',
    priority: 'Medium',
    description: '',
    kpi: '',
    customerName: '',
    engineeringComment: '',
    engineeringSignoff: false,
    engineeringComplexity: 'M',
    releaseDate: '',
    assignedEngineerId: undefined,
  });

  const [engineers, setEngineers] = useState<Engineer[]>([]);

  useEffect(() => {
    if (canAssignEngineer(userRole)) {
      apiClient
        .getEngineers()
        .then(setEngineers)
        .catch((err) => console.error('Failed to load engineers:', err));
    }
  }, [userRole]);

  useEffect(() => {
    if (feature) {
      setFormData({
        title: feature.title,
        priority: feature.priority,
        description: feature.description,
        kpi: feature.kpi,
        customerName: feature.customerName,
        engineeringComment: feature.engineeringComment,
        engineeringSignoff: feature.engineeringSignoff,
        engineeringComplexity: feature.engineeringComplexity,
        releaseDate: feature.releaseDate,
        assignedEngineerId: feature.assignedEngineerId,
      });
    } else {
      setFormData({
        title: '',
        priority: 'Medium',
        description: '',
        kpi: '',
        customerName: '',
        engineeringComment: '',
        engineeringSignoff: false,
        engineeringComplexity: 'M',
        releaseDate: '',
        assignedEngineerId: undefined,
      });
    }
  }, [feature]);

  const isFieldDisabled = (fieldName: string): boolean => {
    if (isNewFeature) return false;
    if (!feature) return false;
    return !canEditFeatureField(userRole, fieldName, feature, userId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onSave(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-800/95">
          <h2 className="text-2xl font-semibold text-gray-100">
            {isNewFeature ? 'Add New Feature' : `Edit Feature: ${feature?.id}`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors p-1 hover:bg-gray-700 rounded"
          >
            <XIcon size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={isFieldDisabled('title')}
                placeholder="Enter feature title"
                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>

            {/* Priority and Release Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Priority <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                  disabled={isFieldDisabled('priority')}
                  className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Release Date
                </label>
                <input
                  type="month"
                  value={formData.releaseDate}
                  onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                  disabled={isFieldDisabled('releaseDate')}
                  className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={isFieldDisabled('description')}
                placeholder="Enter detailed description of the feature"
                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                rows={4}
              />
            </div>

            {/* KPI and Customer Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  KPI (Key Performance Indicator)
                </label>
                <input
                  type="text"
                  value={formData.kpi}
                  onChange={(e) => setFormData({ ...formData, kpi: e.target.value })}
                  disabled={isFieldDisabled('kpi')}
                  placeholder="e.g., Increase user engagement by 20%"
                  className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  disabled={isFieldDisabled('customerName')}
                  placeholder="Customer or stakeholder name"
                  className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Engineering Section */}
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-200 mb-4">Engineering Details</h3>

              {/* Engineering Comment */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Engineering Comment
                </label>
                <textarea
                  value={formData.engineeringComment}
                  onChange={(e) => setFormData({ ...formData, engineeringComment: e.target.value })}
                  disabled={isFieldDisabled('engineeringComment')}
                  placeholder="Technical notes, implementation details, or concerns"
                  className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={3}
                />
              </div>

              {/* Complexity and Signoff Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Complexity
                  </label>
                  <select
                    value={formData.engineeringComplexity}
                    onChange={(e) =>
                      setFormData({ ...formData, engineeringComplexity: e.target.value as TShirtSize })
                    }
                    disabled={isFieldDisabled('engineeringComplexity')}
                    className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="XS">XS - Extra Small</option>
                    <option value="S">S - Small</option>
                    <option value="M">M - Medium</option>
                    <option value="L">L - Large</option>
                    <option value="XL">XL - Extra Large</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Engineering Signoff
                  </label>
                  <div className="flex items-center h-[42px]">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.engineeringSignoff}
                        onChange={(e) =>
                          setFormData({ ...formData, engineeringSignoff: e.target.checked })
                        }
                        disabled={isFieldDisabled('engineeringSignoff')}
                        className="h-5 w-5 rounded border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800 bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <span className="text-gray-300 text-sm">
                        {formData.engineeringSignoff ? 'Signed Off' : 'Pending'}
                      </span>
                    </label>
                  </div>
                </div>

                {canAssignEngineer(userRole) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Assigned Engineer
                    </label>
                    <select
                      value={formData.assignedEngineerId || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          assignedEngineerId: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Unassigned</option>
                      {engineers.map((eng) => (
                        <option key={eng.id} value={eng.id}>
                          {eng.username}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!formData.title.trim()}
            >
              {isNewFeature ? 'Create Feature' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeatureEditModal;
