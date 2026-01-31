import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData, Feature } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  Edit2,
  Save,
  X,
  Calendar,
  User,
  CheckCircle,
  AlertCircle,
  Folder,
  Clock,
  Copy,
  Check,
  Target,
  MessageSquare,
  Zap
} from 'lucide-react';

const FeatureDetail: React.FC = () => {
  const { featureId } = useParams<{ featureId: string }>();
  const { categories, updateFeature, isLoading } = useData();
  const { user, canEditFeature } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editedFeature, setEditedFeature] = useState<Feature | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Find the feature and its category
  const featureData = React.useMemo(() => {
    for (const category of categories) {
      const feature = category.features.find((f) => f.id === featureId);
      if (feature) {
        return { feature, category };
      }
    }
    return null;
  }, [categories, featureId]);

  const feature = featureData?.feature;
  const category = featureData?.category;

  useEffect(() => {
    if (feature) {
      setEditedFeature({ ...feature });
    }
  }, [feature]);

  // Auto-dismiss messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (linkCopied) {
      const timer = setTimeout(() => setLinkCopied(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [linkCopied]);

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-400 text-lg">Loading feature details...</p>
        </div>
      </div>
    );
  }

  if (!feature || !category) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-900/10 border border-red-700/30 rounded-xl p-8 text-center backdrop-blur-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-900/20 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-semibold text-red-400 mb-2">Feature Not Found</h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            The feature with ID "<span className="font-mono text-red-300">{featureId}</span>" could not be found in the system.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft size={18} />
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const canEdit = user && canEditFeature(feature);
  const isEngineer = user?.role === 'engineer';

  const handleSave = async () => {
    if (!editedFeature || !category) return;

    // Basic validation
    if (!editedFeature.title.trim()) {
      setError('Feature title is required');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await updateFeature(category.id, editedFeature.id, editedFeature);
      setIsEditing(false);
      setSuccess('Changes saved successfully');
    } catch (err) {
      setError('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedFeature({ ...feature });
    setIsEditing(false);
    setError(null);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
  };

  const priorityConfig = {
    High: {
      color: 'text-red-400 bg-red-900/20 border-red-700/50',
      icon: '🔴'
    },
    Medium: {
      color: 'text-yellow-400 bg-yellow-900/20 border-yellow-700/50',
      icon: '🟡'
    },
    Low: {
      color: 'text-green-400 bg-green-900/20 border-green-700/50',
      icon: '🟢'
    },
  };

  const complexityConfig = {
    XS: { label: 'Extra Small', color: 'bg-green-900/30 text-green-400 border-green-700/50' },
    S: { label: 'Small', color: 'bg-blue-900/30 text-blue-400 border-blue-700/50' },
    M: { label: 'Medium', color: 'bg-yellow-900/30 text-yellow-400 border-yellow-700/50' },
    L: { label: 'Large', color: 'bg-orange-900/30 text-orange-400 border-orange-700/50' },
    XL: { label: 'Extra Large', color: 'bg-red-900/30 text-red-400 border-red-700/50' },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link to="/" className="text-gray-400 hover:text-blue-400 transition-colors">
              Dashboard
            </Link>
          </li>
          <li className="text-gray-600">/</li>
          <li>
            <span className="text-gray-400 flex items-center gap-1">
              <Folder size={14} />
              {category.name}
            </span>
          </li>
          <li className="text-gray-600">/</li>
          <li className="text-gray-300 font-medium truncate max-w-md">
            {feature.title}
          </li>
        </ol>
      </nav>

      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-4 mb-6 border-b border-gray-700/50">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-3">
            {canEdit && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Edit2 size={16} />
                <span className="hidden sm:inline">Edit Feature</span>
                <span className="sm:hidden">Edit</span>
              </button>
            )}

            {isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="hidden sm:inline">Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span className="hidden sm:inline">Save Changes</span>
                      <span className="sm:hidden">Save</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X size={16} />
                  <span className="hidden sm:inline">Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-900/20 border border-green-700/50 rounded-lg text-green-400 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle size={20} />
          <span>{success}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-700/50 rounded-lg text-red-400 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Content Card */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden shadow-2xl">
        {/* Header Section with Title and Priority */}
        <div className="p-6 sm:p-8 border-b border-gray-700/50 bg-gradient-to-br from-gray-800 to-gray-800/50">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div>
                  <label htmlFor="feature-title" className="sr-only">Feature Title</label>
                  <input
                    id="feature-title"
                    type="text"
                    value={editedFeature?.title || ''}
                    onChange={(e) => setEditedFeature({ ...editedFeature!, title: e.target.value })}
                    placeholder="Enter feature title..."
                    className="w-full text-2xl sm:text-3xl font-bold bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              ) : (
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-tight">
                  {feature.title}
                </h1>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <span className="font-medium text-gray-500">ID:</span>
                  <code className="px-2 py-0.5 bg-gray-900/50 rounded font-mono text-xs text-blue-400 border border-gray-700">
                    {feature.id}
                  </code>
                </span>
                <span className="flex items-center gap-1.5">
                  <Folder size={14} className="text-gray-500" />
                  <span className="text-gray-300">{category.name}</span>
                </span>
              </div>
            </div>

            {/* Priority Badge */}
            <div className="flex-shrink-0">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold ${priorityConfig[feature.priority].color}`}>
                <span className="text-lg">{priorityConfig[feature.priority].icon}</span>
                <span>{feature.priority} Priority</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Details - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <section>
                <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  <MessageSquare size={16} />
                  Description
                </h2>
                {isEditing ? (
                  <textarea
                    value={editedFeature?.description || ''}
                    onChange={(e) => setEditedFeature({ ...editedFeature!, description: e.target.value })}
                    rows={5}
                    placeholder="Describe the feature in detail..."
                    className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                ) : (
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {feature.description || (
                        <span className="text-gray-500 italic">No description provided</span>
                      )}
                    </p>
                  </div>
                )}
              </section>

              {/* KPI */}
              <section>
                <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  <Target size={16} />
                  Key Performance Indicator
                </h2>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedFeature?.kpi || ''}
                    onChange={(e) => setEditedFeature({ ...editedFeature!, kpi: e.target.value })}
                    placeholder="e.g., Increase user engagement by 20%"
                    className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                ) : (
                  <p className="text-gray-300 text-lg">
                    {feature.kpi || (
                      <span className="text-gray-500 italic text-base">No KPI defined</span>
                    )}
                  </p>
                )}
              </section>

              {/* Engineering Section */}
              <section className="pt-6 border-t border-gray-700/50">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-100 mb-4">
                  <Zap size={20} className="text-blue-400" />
                  Engineering Details
                </h2>

                <div className="space-y-4">
                  {/* Engineering Comment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Technical Notes
                    </label>
                    {isEditing && isEngineer ? (
                      <textarea
                        value={editedFeature?.engineeringComment || ''}
                        onChange={(e) => setEditedFeature({ ...editedFeature!, engineeringComment: e.target.value })}
                        rows={4}
                        placeholder="Add technical notes, implementation details, or concerns..."
                        className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      />
                    ) : (
                      <p className="text-gray-300 whitespace-pre-wrap">
                        {feature.engineeringComment || (
                          <span className="text-gray-500 italic">No technical notes</span>
                        )}
                      </p>
                    )}
                  </div>

                  {/* Complexity and Signoff Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Complexity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Complexity Estimate
                      </label>
                      {isEditing && isEngineer ? (
                        <select
                          value={editedFeature?.engineeringComplexity || 'M'}
                          onChange={(e) => setEditedFeature({ ...editedFeature!, engineeringComplexity: e.target.value as any })}
                          className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2.5 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="XS">XS - Extra Small</option>
                          <option value="S">S - Small</option>
                          <option value="M">M - Medium</option>
                          <option value="L">L - Large</option>
                          <option value="XL">XL - Extra Large</option>
                        </select>
                      ) : (
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-medium ${complexityConfig[feature.engineeringComplexity].color}`}>
                          <span className="font-bold">{feature.engineeringComplexity}</span>
                          <span className="text-sm opacity-80">{complexityConfig[feature.engineeringComplexity].label}</span>
                        </div>
                      )}
                    </div>

                    {/* Signoff Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Signoff Status
                      </label>
                      {isEditing && isEngineer ? (
                        <label className="flex items-center gap-3 px-4 py-2.5 bg-gray-900/50 border border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-all">
                          <input
                            type="checkbox"
                            checked={editedFeature?.engineeringSignoff || false}
                            onChange={(e) => setEditedFeature({ ...editedFeature!, engineeringSignoff: e.target.checked })}
                            className="w-5 h-5 rounded border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-gray-300 text-sm">Ready for implementation</span>
                        </label>
                      ) : (
                        <div className="flex items-center gap-2">
                          {feature.engineeringSignoff ? (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-900/20 text-green-400 rounded-lg border border-green-700/50">
                              <CheckCircle size={18} />
                              <span className="font-medium">Signed Off</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-900/20 text-yellow-400 rounded-lg border border-yellow-700/50">
                              <Clock size={18} />
                              <span className="font-medium">Pending Review</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar - Metadata */}
            <div className="lg:col-span-1 space-y-6">
              {/* Customer Info */}
              <section className="bg-gray-900/30 rounded-lg p-5 border border-gray-700/30">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
                  <User size={16} />
                  Customer
                </h3>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedFeature?.customerName || ''}
                    onChange={(e) => setEditedFeature({ ...editedFeature!, customerName: e.target.value })}
                    placeholder="Customer name"
                    className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                ) : (
                  <p className="text-gray-100 font-medium">
                    {feature.customerName || (
                      <span className="text-gray-500 italic font-normal">Not specified</span>
                    )}
                  </p>
                )}
              </section>

              {/* Release Date */}
              <section className="bg-gray-900/30 rounded-lg p-5 border border-gray-700/30">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
                  <Calendar size={16} />
                  Target Release
                </h3>
                {isEditing ? (
                  <input
                    type="month"
                    value={editedFeature?.releaseDate || ''}
                    onChange={(e) => setEditedFeature({ ...editedFeature!, releaseDate: e.target.value })}
                    className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                ) : (
                  <p className="text-gray-100 font-medium">
                    {feature.releaseDate ? (
                      new Date(feature.releaseDate + '-01').toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      })
                    ) : (
                      <span className="text-gray-500 italic font-normal">Not scheduled</span>
                    )}
                  </p>
                )}
              </section>

              {/* Priority Selection (when editing) */}
              {isEditing && (
                <section className="bg-gray-900/30 rounded-lg p-5 border border-gray-700/30">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
                    Priority Level
                  </h3>
                  <select
                    value={editedFeature?.priority || 'Medium'}
                    onChange={(e) => setEditedFeature({ ...editedFeature!, priority: e.target.value as any })}
                    className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="High">🔴 High Priority</option>
                    <option value="Medium">🟡 Medium Priority</option>
                    <option value="Low">🟢 Low Priority</option>
                  </select>
                </section>
              )}

              {/* Assigned Engineer */}
              {feature.assignedEngineerName && (
                <section className="bg-gray-900/30 rounded-lg p-5 border border-gray-700/30">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
                    Assigned To
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                      {feature.assignedEngineerName.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-gray-100 font-medium">{feature.assignedEngineerName}</p>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Share Link Section */}
      <div className="mt-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <Copy size={18} className="text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
            Share This Feature
          </h3>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            readOnly
            value={window.location.href}
            className="flex-1 bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2.5 text-gray-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer select-all"
            onClick={(e) => e.currentTarget.select()}
          />
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
          >
            {linkCopied ? (
              <>
                <Check size={16} />
                <span className="hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span className="hidden sm:inline">Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureDetail;
