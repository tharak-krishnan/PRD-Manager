import React, { useState } from 'react';
import { useData, Feature, Priority, TShirtSize } from '../context/DataContext';
import { PlusIcon, Trash2Icon, CheckIcon, XIcon, EditIcon } from 'lucide-react';
interface FeatureTableProps {
  categoryId: string;
}
const FeatureTable: React.FC<FeatureTableProps> = ({
  categoryId
}) => {
  const {
    categories,
    addFeature,
    updateFeature,
    deleteFeature
  } = useData();
  const category = categories.find(c => c.id === categoryId);
  const [isAddingFeature, setIsAddingFeature] = useState(false);
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null);
  const [newFeature, setNewFeature] = useState<Omit<Feature, 'id'>>({
    title: '',
    priority: 'Medium',
    description: '',
    kpi: '',
    customerName: '',
    engineeringComment: '',
    engineeringSignoff: false,
    engineeringComplexity: 'M',
    releaseDate: ''
  });
  if (!category) return null;
  const handleAddFeature = () => {
    if (newFeature.title.trim()) {
      addFeature(categoryId, newFeature);
      setNewFeature({
        title: '',
        priority: 'Medium',
        description: '',
        kpi: '',
        customerName: '',
        engineeringComment: '',
        engineeringSignoff: false,
        engineeringComplexity: 'M',
        releaseDate: ''
      });
      setIsAddingFeature(false);
    }
  };
  const handleEditFeature = (feature: Feature) => {
    setEditingFeatureId(feature.id);
    setNewFeature({
      title: feature.title,
      priority: feature.priority,
      description: feature.description,
      kpi: feature.kpi,
      customerName: feature.customerName,
      engineeringComment: feature.engineeringComment,
      engineeringSignoff: feature.engineeringSignoff,
      engineeringComplexity: feature.engineeringComplexity,
      releaseDate: feature.releaseDate
    });
  };
  const handleUpdateFeature = () => {
    if (editingFeatureId && newFeature.title.trim()) {
      updateFeature(categoryId, editingFeatureId, newFeature);
      setEditingFeatureId(null);
      setNewFeature({
        title: '',
        priority: 'Medium',
        description: '',
        kpi: '',
        customerName: '',
        engineeringComment: '',
        engineeringSignoff: false,
        engineeringComplexity: 'M',
        releaseDate: ''
      });
    }
  };
  const priorityColorMap: Record<Priority, string> = {
    High: 'bg-red-900/50 text-red-400 border border-red-700/50',
    Medium: 'bg-yellow-900/50 text-yellow-400 border border-yellow-700/50',
    Low: 'bg-green-900/50 text-green-400 border border-green-700/50'
  };
  const FeatureForm = () => <tr className="bg-gray-800/60">
      <td className="px-4 py-2 border-b border-gray-700 text-gray-400">
        {editingFeatureId || 'New'}
      </td>
      <td className="px-4 py-2 border-b border-gray-700">
        <input type="text" value={newFeature.title} onChange={e => setNewFeature({
        ...newFeature,
        title: e.target.value
      })} placeholder="Feature title" className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      </td>
      <td className="px-4 py-2 border-b border-gray-700">
        <select value={newFeature.priority} onChange={e => setNewFeature({
        ...newFeature,
        priority: e.target.value as Priority
      })} className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </td>
      <td className="px-4 py-2 border-b border-gray-700">
        <textarea value={newFeature.description} onChange={e => setNewFeature({
        ...newFeature,
        description: e.target.value
      })} placeholder="Description" className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={2} />
      </td>
      <td className="px-4 py-2 border-b border-gray-700">
        <input type="text" value={newFeature.kpi} onChange={e => setNewFeature({
        ...newFeature,
        kpi: e.target.value
      })} placeholder="KPI" className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      </td>
      <td className="px-4 py-2 border-b border-gray-700">
        <input type="text" value={newFeature.customerName} onChange={e => setNewFeature({
        ...newFeature,
        customerName: e.target.value
      })} placeholder="Customer name" className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      </td>
      <td className="px-4 py-2 border-b border-gray-700">
        <textarea value={newFeature.engineeringComment} onChange={e => setNewFeature({
        ...newFeature,
        engineeringComment: e.target.value
      })} placeholder="Engineering comment" className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={2} />
      </td>
      <td className="px-4 py-2 border-b border-gray-700">
        <div className="flex justify-center">
          <input type="checkbox" checked={newFeature.engineeringSignoff} onChange={e => setNewFeature({
          ...newFeature,
          engineeringSignoff: e.target.checked
        })} className="h-4 w-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700" />
        </div>
      </td>
      <td className="px-4 py-2 border-b border-gray-700">
        <select value={newFeature.engineeringComplexity} onChange={e => setNewFeature({
        ...newFeature,
        engineeringComplexity: e.target.value as TShirtSize
      })} className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
      </td>
      <td className="px-4 py-2 border-b border-gray-700">
        <input type="month" value={newFeature.releaseDate} onChange={e => setNewFeature({
        ...newFeature,
        releaseDate: e.target.value
      })} className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      </td>
      <td className="px-4 py-2 border-b border-gray-700">
        <div className="flex space-x-1 justify-center">
          {editingFeatureId ? <>
              <button onClick={handleUpdateFeature} className="p-1 text-green-400 hover:text-green-300 transition-colors">
                <CheckIcon size={16} />
              </button>
              <button onClick={() => setEditingFeatureId(null)} className="p-1 text-red-400 hover:text-red-300 transition-colors">
                <XIcon size={16} />
              </button>
            </> : <>
              <button onClick={handleAddFeature} className="p-1 text-green-400 hover:text-green-300 transition-colors">
                <CheckIcon size={16} />
              </button>
              <button onClick={() => setIsAddingFeature(false)} className="p-1 text-red-400 hover:text-red-300 transition-colors">
                <XIcon size={16} />
              </button>
            </>}
        </div>
      </td>
    </tr>;
  return <div className="w-full overflow-x-auto">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-100">{category.name}</h2>
        <button onClick={() => setIsAddingFeature(true)} className="px-3 py-1.5 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700 transition-colors" disabled={isAddingFeature || !!editingFeatureId}>
          <PlusIcon size={16} className="mr-1.5" />
          Add Feature
        </button>
      </div>
      <div className="mb-4 p-4 bg-gray-800 border border-gray-700 rounded-md shadow-md">
        <h3 className="text-sm font-medium text-gray-300 mb-2">
          Category Description:
        </h3>
        <p className="text-gray-400">{category.description}</p>
      </div>
      <div className="rounded-lg overflow-hidden shadow-lg border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-700">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-700">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-700">
                Priority
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-700">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-700">
                KPI
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-700">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-700">
                Eng. Comment
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-700">
                Signoff
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-700">
                Complexity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-700">
                Release Date
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {isAddingFeature && <FeatureForm />}
            {category.features.map(feature => editingFeatureId === feature.id ? <FeatureForm key={feature.id} /> : <tr key={feature.id} className="hover:bg-gray-750">
                  <td className="px-4 py-3 border-b border-gray-700 whitespace-nowrap text-gray-300">
                    {feature.id}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-700 text-gray-300">
                    {feature.title}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-700">
                    <span className={`px-2 py-1 rounded-full text-xs ${priorityColorMap[feature.priority]}`}>
                      {feature.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b border-gray-700 text-gray-400">
                    <div className="max-w-xs truncate">
                      {feature.description}
                    </div>
                  </td>
                  <td className="px-4 py-3 border-b border-gray-700 text-gray-400">
                    <div className="max-w-xs truncate">{feature.kpi}</div>
                  </td>
                  <td className="px-4 py-3 border-b border-gray-700 text-gray-300">
                    {feature.customerName}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-700 text-gray-400">
                    <div className="max-w-xs truncate">
                      {feature.engineeringComment}
                    </div>
                  </td>
                  <td className="px-4 py-3 border-b border-gray-700 text-center">
                    {feature.engineeringSignoff ? <CheckIcon size={16} className="mx-auto text-green-400" /> : <XIcon size={16} className="mx-auto text-red-400" />}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-700 text-center text-gray-300">
                    {feature.engineeringComplexity}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-700 text-gray-300">
                    {feature.releaseDate ? new Date(feature.releaseDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short'
              }) : ''}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-700">
                    <div className="flex justify-center space-x-1">
                      <button onClick={() => handleEditFeature(feature)} className="p-1 text-blue-400 hover:text-blue-300 transition-colors" disabled={!!editingFeatureId || isAddingFeature}>
                        <EditIcon size={16} />
                      </button>
                      <button onClick={() => deleteFeature(categoryId, feature.id)} className="p-1 text-red-400 hover:text-red-300 transition-colors" disabled={!!editingFeatureId || isAddingFeature}>
                        <Trash2Icon size={16} />
                      </button>
                    </div>
                  </td>
                </tr>)}
            {category.features.length === 0 && !isAddingFeature && <tr>
                <td colSpan={11} className="px-4 py-8 text-center text-gray-500">
                  No features yet. Click "Add Feature" to create one.
                </td>
              </tr>}
          </tbody>
        </table>
      </div>
    </div>;
};
export default FeatureTable;