import React, { useState, createContext, useContext } from 'react';
export type Priority = 'High' | 'Medium' | 'Low';
export type TShirtSize = 'XS' | 'S' | 'M' | 'L' | 'XL';
export interface Feature {
  id: string;
  title: string;
  priority: Priority;
  description: string;
  kpi: string;
  customerName: string;
  engineeringComment: string;
  engineeringSignoff: boolean;
  engineeringComplexity: TShirtSize;
  releaseDate: string; // YYYY-MM format
}
export interface Category {
  id: string;
  name: string;
  description: string;
  features: Feature[];
}
interface DataContextType {
  categories: Category[];
  selectedCategoryId: string | null;
  addCategory: (category: Omit<Category, 'id' | 'features'>) => void;
  updateCategory: (id: string, data: Partial<Omit<Category, 'id' | 'features'>>) => void;
  deleteCategory: (id: string) => void;
  selectCategory: (id: string | null) => void;
  addFeature: (categoryId: string, feature: Omit<Feature, 'id'>) => void;
  updateFeature: (categoryId: string, featureId: string, data: Partial<Omit<Feature, 'id'>>) => void;
  deleteFeature: (categoryId: string, featureId: string) => void;
}
const DataContext = createContext<DataContextType | undefined>(undefined);
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
export const DataProvider: React.FC<{
  children: ReactNode;
}> = ({
  children
}) => {
  const [categories, setCategories] = useState<Category[]>([{
    id: '1',
    name: 'User Authentication',
    description: 'Features related to user login, registration, and account management',
    features: [{
      id: '1.1',
      title: 'Social Login Integration',
      priority: 'High',
      description: 'Allow users to sign in with Google, Facebook, and Twitter',
      kpi: 'Increase sign-up rate by 30%',
      customerName: 'Marketing Team',
      engineeringComment: 'OAuth implementation required',
      engineeringSignoff: true,
      engineeringComplexity: 'M',
      releaseDate: '2023-06'
    }, {
      id: '1.2',
      title: 'Password Reset Flow',
      priority: 'High',
      description: 'Implement secure password reset via email',
      kpi: 'Reduce support tickets by 25%',
      customerName: 'Support Team',
      engineeringComment: 'Need to integrate with email service',
      engineeringSignoff: true,
      engineeringComplexity: 'S',
      releaseDate: '2023-05'
    }, {
      id: '1.3',
      title: 'Two-Factor Authentication',
      priority: 'Medium',
      description: 'Add SMS and authenticator app options for 2FA',
      kpi: 'Improve security metrics by 40%',
      customerName: 'Security Team',
      engineeringComment: 'Will require integration with SMS provider',
      engineeringSignoff: true,
      engineeringComplexity: 'L',
      releaseDate: '2023-07'
    }, {
      id: '1.4',
      title: 'Account Lockout Protection',
      priority: 'Medium',
      description: 'Implement temporary account lockout after failed login attempts',
      kpi: 'Reduce unauthorized access attempts by 60%',
      customerName: 'Security Team',
      engineeringComment: 'Need to design rate limiting system',
      engineeringSignoff: false,
      engineeringComplexity: 'M',
      releaseDate: '2023-08'
    }, {
      id: '1.5',
      title: 'Role-based Access Control',
      priority: 'High',
      description: 'Implement granular permission system for different user roles',
      kpi: 'Improve enterprise adoption by 20%',
      customerName: 'Enterprise Sales',
      engineeringComment: 'Will require database schema changes',
      engineeringSignoff: false,
      engineeringComplexity: 'XL',
      releaseDate: '2023-09'
    }]
  }, {
    id: '2',
    name: 'Analytics Dashboard',
    description: 'Features for data visualization and reporting',
    features: [{
      id: '2.1',
      title: 'Custom Report Builder',
      priority: 'Medium',
      description: 'Allow users to create and save custom reports',
      kpi: 'Increase user engagement by 15%',
      customerName: 'Data Science Team',
      engineeringComment: 'Will require new database schema',
      engineeringSignoff: false,
      engineeringComplexity: 'L',
      releaseDate: '2023-08'
    }, {
      id: '2.2',
      title: 'Real-time Data Visualization',
      priority: 'High',
      description: 'Implement live-updating charts and graphs for key metrics',
      kpi: 'Reduce time to insight by 50%',
      customerName: 'Executive Team',
      engineeringComment: 'Need to implement WebSocket connections',
      engineeringSignoff: true,
      engineeringComplexity: 'L',
      releaseDate: '2023-07'
    }, {
      id: '2.3',
      title: 'Export to PDF/CSV',
      priority: 'Low',
      description: 'Allow users to export reports in multiple formats',
      kpi: 'Improve sharing capabilities by 30%',
      customerName: 'Marketing Team',
      engineeringComment: 'Need to research PDF generation libraries',
      engineeringSignoff: true,
      engineeringComplexity: 'M',
      releaseDate: '2023-06'
    }, {
      id: '2.4',
      title: 'Scheduled Reports',
      priority: 'Medium',
      description: 'Allow users to schedule automated report generation and delivery',
      kpi: 'Reduce manual reporting time by 70%',
      customerName: 'Account Management',
      engineeringComment: 'Will need to set up cron jobs and email delivery',
      engineeringSignoff: false,
      engineeringComplexity: 'M',
      releaseDate: '2023-10'
    }]
  }, {
    id: '3',
    name: 'Mobile Application',
    description: 'Features for the iOS and Android mobile applications',
    features: [{
      id: '3.1',
      title: 'Offline Mode',
      priority: 'High',
      description: 'Allow users to access key features without internet connection',
      kpi: 'Increase mobile usage by 40%',
      customerName: 'Product Team',
      engineeringComment: 'Need to implement local storage and sync',
      engineeringSignoff: true,
      engineeringComplexity: 'XL',
      releaseDate: '2023-09'
    }, {
      id: '3.2',
      title: 'Push Notifications',
      priority: 'Medium',
      description: 'Implement customizable push notifications for important events',
      kpi: 'Improve re-engagement rate by 25%',
      customerName: 'Marketing Team',
      engineeringComment: 'Will use Firebase Cloud Messaging',
      engineeringSignoff: true,
      engineeringComplexity: 'M',
      releaseDate: '2023-06'
    }, {
      id: '3.3',
      title: 'Biometric Authentication',
      priority: 'Medium',
      description: 'Add fingerprint and face recognition login options',
      kpi: 'Improve login convenience score by 30%',
      customerName: 'UX Team',
      engineeringComment: 'Need to use native device APIs',
      engineeringSignoff: false,
      engineeringComplexity: 'L',
      releaseDate: '2023-08'
    }, {
      id: '3.4',
      title: 'AR Feature Integration',
      priority: 'Low',
      description: 'Implement augmented reality features for product visualization',
      kpi: 'Increase product interaction by 15%',
      customerName: 'Innovation Team',
      engineeringComment: 'Experimental feature, will need ARKit/ARCore',
      engineeringSignoff: false,
      engineeringComplexity: 'XL',
      releaseDate: '2023-11'
    }]
  }, {
    id: '4',
    name: 'Payment Processing',
    description: 'Features related to billing, subscriptions, and payment methods',
    features: [{
      id: '4.1',
      title: 'Subscription Management',
      priority: 'High',
      description: 'Allow users to manage their subscription plans and billing cycles',
      kpi: 'Reduce subscription churn by 20%',
      customerName: 'Finance Team',
      engineeringComment: 'Will integrate with Stripe API',
      engineeringSignoff: true,
      engineeringComplexity: 'L',
      releaseDate: '2023-07'
    }, {
      id: '4.2',
      title: 'Multiple Payment Methods',
      priority: 'Medium',
      description: 'Support credit cards, PayPal, and bank transfers',
      kpi: 'Increase payment success rate by 15%',
      customerName: 'Global Sales',
      engineeringComment: 'Need to implement multiple payment gateways',
      engineeringSignoff: true,
      engineeringComplexity: 'M',
      releaseDate: '2023-08'
    }, {
      id: '4.3',
      title: 'Invoice Generation',
      priority: 'Low',
      description: 'Automatically generate and email invoices for payments',
      kpi: 'Reduce accounting workload by 30%',
      customerName: 'Finance Team',
      engineeringComment: 'Will need PDF generation capability',
      engineeringSignoff: false,
      engineeringComplexity: 'S',
      releaseDate: '2023-09'
    }]
  }, {
    id: '5',
    name: 'Performance Optimization',
    description: 'Features focused on improving application speed and efficiency',
    features: [{
      id: '5.1',
      title: 'Image Compression',
      priority: 'Medium',
      description: 'Implement automatic image optimization for uploads',
      kpi: 'Reduce page load time by 25%',
      customerName: 'UX Team',
      engineeringComment: 'Will use server-side processing',
      engineeringSignoff: true,
      engineeringComplexity: 'M',
      releaseDate: '2023-06'
    }, {
      id: '5.2',
      title: 'Database Query Optimization',
      priority: 'High',
      description: 'Refactor database queries for improved performance',
      kpi: 'Reduce API response time by 40%',
      customerName: 'Engineering',
      engineeringComment: 'Will require significant refactoring',
      engineeringSignoff: true,
      engineeringComplexity: 'L',
      releaseDate: '2023-07'
    }, {
      id: '5.3',
      title: 'CDN Integration',
      priority: 'Medium',
      description: 'Implement content delivery network for static assets',
      kpi: 'Improve global load times by 50%',
      customerName: 'International Sales',
      engineeringComment: 'Will use CloudFront or similar',
      engineeringSignoff: false,
      engineeringComplexity: 'M',
      releaseDate: '2023-10'
    }]
  }, {
    id: '6',
    name: 'Collaboration Tools',
    description: 'Features that enable team collaboration and communication',
    features: [{
      id: '6.1',
      title: 'Shared Workspaces',
      priority: 'High',
      description: 'Create team workspaces with shared resources and permissions',
      kpi: 'Increase team productivity by 30%',
      customerName: 'Enterprise Customers',
      engineeringComment: 'Complex permission system required',
      engineeringSignoff: true,
      engineeringComplexity: 'XL',
      releaseDate: '2023-08'
    }, {
      id: '6.2',
      title: 'In-app Messaging',
      priority: 'Medium',
      description: 'Implement real-time chat functionality between team members',
      kpi: 'Reduce email communication by 40%',
      customerName: 'Product Team',
      engineeringComment: 'Will use WebSockets for real-time updates',
      engineeringSignoff: false,
      engineeringComplexity: 'L',
      releaseDate: '2023-09'
    }, {
      id: '6.3',
      title: 'Document Collaboration',
      priority: 'Medium',
      description: 'Allow multiple users to edit documents simultaneously',
      kpi: 'Improve document completion time by 50%',
      customerName: 'Content Team',
      engineeringComment: 'Will need operational transformation algorithm',
      engineeringSignoff: false,
      engineeringComplexity: 'XL',
      releaseDate: '2023-11'
    }, {
      id: '6.4',
      title: 'Activity Feed',
      priority: 'Low',
      description: 'Show recent activities and changes by team members',
      kpi: 'Increase awareness of team activities by 35%',
      customerName: 'Project Managers',
      engineeringComment: 'Will need to implement activity logging system',
      engineeringSignoff: true,
      engineeringComplexity: 'M',
      releaseDate: '2023-07'
    }]
  }]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>('1');
  const addCategory = (category: Omit<Category, 'id' | 'features'>) => {
    const newId = (categories.length + 1).toString();
    setCategories([...categories, {
      ...category,
      id: newId,
      features: []
    }]);
  };
  const updateCategory = (id: string, data: Partial<Omit<Category, 'id' | 'features'>>) => {
    setCategories(categories.map(category => category.id === id ? {
      ...category,
      ...data
    } : category));
  };
  const deleteCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id));
    if (selectedCategoryId === id) {
      setSelectedCategoryId(categories.length > 1 ? categories[0].id : null);
    }
  };
  const selectCategory = (id: string | null) => {
    setSelectedCategoryId(id);
  };
  const addFeature = (categoryId: string, feature: Omit<Feature, 'id'>) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        const newFeatureId = `${categoryId}.${category.features.length + 1}`;
        return {
          ...category,
          features: [...category.features, {
            ...feature,
            id: newFeatureId
          }]
        };
      }
      return category;
    }));
  };
  const updateFeature = (categoryId: string, featureId: string, data: Partial<Omit<Feature, 'id'>>) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          features: category.features.map(feature => feature.id === featureId ? {
            ...feature,
            ...data
          } : feature)
        };
      }
      return category;
    }));
  };
  const deleteFeature = (categoryId: string, featureId: string) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          features: category.features.filter(feature => feature.id !== featureId)
        };
      }
      return category;
    }));
  };
  const value = {
    categories,
    selectedCategoryId,
    addCategory,
    updateCategory,
    deleteCategory,
    selectCategory,
    addFeature,
    updateFeature,
    deleteFeature
  };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};