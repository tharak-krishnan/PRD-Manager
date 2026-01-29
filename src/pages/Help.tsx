import React from 'react';
import { Link } from 'react-router-dom';

export default function Help() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-100 mb-2">PRD Manager Help</h1>
          <p className="text-gray-400">Your guide to managing product requirements effectively</p>
        </div>

        {/* Table of Contents */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="#getting-started" className="text-blue-400 hover:text-blue-300">Getting Started</a>
            <a href="#projects" className="text-blue-400 hover:text-blue-300">Managing Projects</a>
            <a href="#categories" className="text-blue-400 hover:text-blue-300">Managing Categories</a>
            <a href="#features" className="text-blue-400 hover:text-blue-300">Managing Features</a>
            <a href="#roadmap" className="text-blue-400 hover:text-blue-300">Product Roadmap</a>
            <a href="#metadata" className="text-blue-400 hover:text-blue-300">Feature Metadata</a>
            <a href="#roles" className="text-blue-400 hover:text-blue-300">User Roles & Permissions</a>
            <a href="#tips" className="text-blue-400 hover:text-blue-300">Tips & Best Practices</a>
          </div>
        </div>

        {/* Getting Started */}
        <section id="getting-started" className="mb-12">
          <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">Getting Started</h2>

          <div className="bg-gray-800 rounded-lg p-6 mb-4">
            <h3 className="text-xl font-semibold mb-3">What is PRD Manager?</h3>
            <p className="text-gray-300 mb-3">
              PRD Manager is a comprehensive tool for organizing, tracking, and visualizing product features
              across different categories. It helps product and engineering teams manage product requirements
              with rich metadata including priorities, complexity estimates, release dates, and stakeholder feedback.
            </p>
            <p className="text-gray-300">
              The application provides a centralized dashboard for tracking features, a visual roadmap timeline,
              and collaboration tools to keep everyone aligned.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">First Steps</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Log in with your credentials (or register if you're new)</li>
              <li><strong>Select a project</strong> from the project selection screen or use the dropdown in the sidebar</li>
              <li>Explore the pre-loaded sample categories and features in the "Default Project"</li>
              <li>Click on different categories in the sidebar to filter features</li>
              <li>Switch between Dashboard and Roadmap views using the navigation</li>
              <li>Create your first project, category, or feature to get started</li>
            </ol>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="mb-12">
          <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">Managing Projects</h2>

          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">What are Projects?</h3>
              <p className="text-gray-300 mb-3">
                Projects are the top-level organizational units in PRD Manager. Each project contains its own set of
                categories and features, allowing you to manage multiple products or initiatives separately.
              </p>
              <p className="text-gray-300">
                For example, you might have separate projects for "Web Platform", "Mobile App", "API Services", etc.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Project Selection</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>On first login, you'll see a project selection screen with all available projects</li>
                <li>Click any project card to select it and view its categories and features</li>
                <li>Use the <strong>Project Selector dropdown</strong> at the top of the sidebar to switch between projects</li>
                <li>All users can see and access all projects (global visibility)</li>
              </ul>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Creating & Managing Projects</h3>
              <div className="space-y-3 text-gray-300">
                <p><span className="text-blue-400 font-semibold">Admins and Product Managers</span> can:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Create new projects via the project selector dropdown</li>
                  <li>Edit project names and descriptions</li>
                  <li>View all projects</li>
                </ul>
                <p className="mt-3"><span className="text-red-400 font-semibold">Admins only</span> can:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Delete projects (⚠️ deletes all categories and features within)</li>
                </ul>
                <p className="mt-3 text-yellow-400">
                  <strong>Note:</strong> When you delete a project, all its categories and features are permanently removed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section id="categories" className="mb-12">
          <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">Managing Categories</h2>

          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">What are Categories?</h3>
              <p className="text-gray-300 mb-3">
                Categories are high-level groupings within a project that organize related features. For example:
                "User Authentication", "Analytics Dashboard", "Mobile Application", etc.
              </p>
              <p className="text-gray-300">
                <strong>Important:</strong> Each category belongs to a specific project. When you select a project,
                you'll only see categories for that project.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Creating a Category</h3>
              <div className="space-y-3 text-gray-300">
                <p><span className="text-blue-400 font-semibold">Admins and Product Managers</span> can create categories:</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Select a project first (categories are created within the selected project)</li>
                  <li>Click the <span className="bg-blue-600 px-2 py-1 rounded text-sm">+</span> icon in the sidebar</li>
                  <li>Enter a name (required) and description (optional)</li>
                  <li>Click "Add Category" to save</li>
                  <li>Your new category will appear in the sidebar for the current project</li>
                </ol>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Editing & Deleting Categories</h3>
              <div className="space-y-3 text-gray-300">
                <p><span className="text-blue-400 font-semibold">Admins and Product Managers</span> can:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Click "Edit Category" button to modify name and description</li>
                </ul>
                <p className="mt-3"><span className="text-red-400 font-semibold">Admins only</span> can:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Delete categories using the "Delete Category" button</li>
                  <li><span className="text-yellow-400">⚠️ Warning:</span> Deleting a category will also delete all its features</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mb-12">
          <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">Managing Features</h2>

          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">What are Features?</h3>
              <p className="text-gray-300">
                Features are individual product requirements or user stories within a category.
                Each feature includes comprehensive metadata to track progress and communicate requirements.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Creating a Feature</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Select a category from the sidebar (or use "All Categories")</li>
                <li>Click the <span className="bg-blue-600 px-2 py-1 rounded text-sm">+ Add Feature</span> button</li>
                <li>Fill in the feature details (see metadata section below)</li>
                <li>Click "Add Feature" to save</li>
              </ol>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Editing & Deleting Features</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Click the edit icon in the Actions column to modify a feature</li>
                <li>Click the delete icon to remove a feature</li>
                <li>All changes are saved immediately</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Metadata */}
        <section id="metadata" className="mb-12">
          <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">Feature Metadata</h2>

          <div className="bg-gray-800 rounded-lg p-6">
            <p className="text-gray-300 mb-4">Each feature includes 9 fields to capture comprehensive requirements:</p>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-blue-400 mb-1">Title</h4>
                <p className="text-gray-300 text-sm">A clear, concise name for the feature (e.g., "Social Login Integration")</p>
              </div>

              <div>
                <h4 className="font-semibold text-blue-400 mb-1">Priority</h4>
                <p className="text-gray-300 text-sm">
                  Business importance: <span className="text-red-400">High</span>,
                  <span className="text-yellow-400"> Medium</span>, or
                  <span className="text-green-400"> Low</span>
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-blue-400 mb-1">Description</h4>
                <p className="text-gray-300 text-sm">Detailed explanation of what the feature does and why it's needed</p>
              </div>

              <div>
                <h4 className="font-semibold text-blue-400 mb-1">KPI</h4>
                <p className="text-gray-300 text-sm">Key Performance Indicator - how success will be measured (e.g., "Increase sign-up rate by 30%")</p>
              </div>

              <div>
                <h4 className="font-semibold text-blue-400 mb-1">Customer Name</h4>
                <p className="text-gray-300 text-sm">The stakeholder or customer requesting this feature</p>
              </div>

              <div>
                <h4 className="font-semibold text-blue-400 mb-1">Engineering Comment</h4>
                <p className="text-gray-300 text-sm">Technical notes, dependencies, or implementation details</p>
              </div>

              <div>
                <h4 className="font-semibold text-blue-400 mb-1">Engineering Signoff</h4>
                <p className="text-gray-300 text-sm">Whether the engineering team has approved the technical approach (✓ or ✗)</p>
              </div>

              <div>
                <h4 className="font-semibold text-blue-400 mb-1">Engineering Complexity</h4>
                <p className="text-gray-300 text-sm">T-shirt sizing for effort estimation: XS, S, M, L, or XL</p>
              </div>

              <div>
                <h4 className="font-semibold text-blue-400 mb-1">Release Date</h4>
                <p className="text-gray-300 text-sm">Target release month in YYYY-MM format (e.g., "2024-06" for June 2024)</p>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section id="roadmap" className="mb-12">
          <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">Product Roadmap</h2>

          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">What is the Roadmap?</h3>
              <p className="text-gray-300">
                The Roadmap view provides a visual timeline of all features organized by their release dates.
                It helps stakeholders understand what's coming and when.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Using the Roadmap</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Click "Roadmap" in the main navigation to access the timeline view</li>
                <li>Features are grouped by their release month</li>
                <li>Each feature card shows its priority, complexity, and category</li>
                <li>Features without release dates appear in the "No Release Date" section</li>
                <li>Use the category filter to see roadmaps for specific areas</li>
              </ul>
            </div>
          </div>
        </section>

        {/* User Roles */}
        <section id="roles" className="mb-12">
          <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">User Roles & Permissions</h2>

          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Role-Based Access Control (RBAC)</h3>
              <p className="text-gray-300 mb-4">
                PRD Manager uses a global role system where each user has one role that applies across all projects.
                The first user to register automatically becomes an Admin.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Role Breakdown</h3>

              <div className="space-y-6">
                {/* Admin Role */}
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="text-lg font-semibold text-red-400 mb-2">Admin</h4>
                  <p className="text-gray-300 mb-2">Full system access with all permissions:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4 text-sm">
                    <li>Create, edit, and delete projects</li>
                    <li>Create, edit, and delete categories</li>
                    <li>Create, edit, and delete features</li>
                    <li>Edit all feature fields (including engineering fields)</li>
                    <li>Manage users and change user roles</li>
                    <li>Export data to Excel, Word, and PowerPoint</li>
                    <li>Import data from Excel</li>
                  </ul>
                </div>

                {/* Product Manager Role */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="text-lg font-semibold text-blue-400 mb-2">Product Manager</h4>
                  <p className="text-gray-300 mb-2">Manages product requirements and planning:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4 text-sm">
                    <li>Create and edit projects (cannot delete)</li>
                    <li>Create and edit categories (cannot delete)</li>
                    <li>Create, edit, and delete features</li>
                    <li>Edit business fields (title, priority, description, KPI, customer name, release date)</li>
                    <li>View engineering fields but cannot edit them</li>
                    <li>Export data to Excel, Word, and PowerPoint</li>
                    <li>Import data from Excel</li>
                  </ul>
                </div>

                {/* Engineer Role */}
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="text-lg font-semibold text-green-400 mb-2">Engineer</h4>
                  <p className="text-gray-300 mb-2">Updates technical details for assigned features:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4 text-sm">
                    <li>View all projects, categories, and features</li>
                    <li>Edit engineering fields on features assigned to them (engineering comment, signoff, complexity)</li>
                    <li>Cannot create or delete projects, categories, or features</li>
                    <li>Cannot edit business fields or unassigned features</li>
                    <li>Can view the engineers list</li>
                  </ul>
                </div>

                {/* Viewer Role */}
                <div className="border-l-4 border-gray-500 pl-4">
                  <h4 className="text-lg font-semibold text-gray-400 mb-2">Viewer</h4>
                  <p className="text-gray-300 mb-2">Read-only access for stakeholders:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4 text-sm">
                    <li>View all projects, categories, and features</li>
                    <li>View roadmap and dashboards</li>
                    <li>Cannot create, edit, or delete anything</li>
                    <li>Cannot export or import data</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Managing Users</h3>
              <div className="space-y-3 text-gray-300">
                <p><span className="text-red-400 font-semibold">Admins only</span> can access user management:</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Click "Users" in the sidebar navigation</li>
                  <li>View all registered users and their current roles</li>
                  <li>Click the dropdown next to any user to change their role</li>
                  <li>Changes take effect immediately</li>
                </ol>
                <p className="mt-3 bg-blue-900/30 border border-blue-700 rounded p-3">
                  <strong>Note:</strong> Role changes apply globally across all projects. There are no per-project permissions.
                </p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Engineer Assignment</h3>
              <div className="space-y-2 text-gray-300">
                <p><span className="text-blue-400 font-semibold">Admins and Product Managers</span> can assign engineers to features:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>When editing a feature, select an engineer from the "Assigned Engineer" dropdown</li>
                  <li>Assigned engineers can then edit engineering fields for that feature</li>
                  <li>Unassigned features can only be edited by Admins and PMs</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section id="tips" className="mb-12">
          <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">Tips & Best Practices</h2>

          <div className="bg-gray-800 rounded-lg p-6">
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">💡</span>
                <span><strong>Organize by projects:</strong> Use separate projects for different products, platforms, or major initiatives to keep things organized</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">💡</span>
                <span><strong>Use clear titles:</strong> Feature titles should be concise but descriptive enough to understand at a glance</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">💡</span>
                <span><strong>Set priorities wisely:</strong> Not everything can be high priority. Use the full range to help with planning</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">💡</span>
                <span><strong>Define measurable KPIs:</strong> Good KPIs are specific and quantifiable (e.g., "Reduce load time by 50%" vs "Make it faster")</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">💡</span>
                <span><strong>Assign engineers early:</strong> Assign features to engineers so they can provide technical feedback and signoff</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">💡</span>
                <span><strong>Get engineering signoff:</strong> Technical validation prevents surprises during implementation</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">💡</span>
                <span><strong>Be realistic with complexity:</strong> Honest complexity estimates help with capacity planning</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">💡</span>
                <span><strong>Review the roadmap regularly:</strong> Keep release dates updated as priorities shift</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">💡</span>
                <span><strong>Use categories strategically:</strong> Group features by product area, team ownership, or business domain</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">💡</span>
                <span><strong>Grant appropriate roles:</strong> Assign roles based on responsibilities - not everyone needs Admin access</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">💡</span>
                <span><strong>Use the project selector:</strong> Switch between projects quickly using the dropdown at the top of the sidebar</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Support */}
        <section className="mb-12">
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-3">Need More Help?</h2>
            <p className="text-gray-300 mb-4">
              This guide covers the basics of using PRD Manager. As you use the application, you'll discover
              more features and workflows that fit your team's needs.
            </p>
            <p className="text-gray-300">
              The application is fully containerized with Docker and uses PostgreSQL for reliable data storage.
              All your data is stored securely with proper role-based access control and persists across sessions.
            </p>
          </div>
        </section>

        {/* Export/Import */}
        <section className="mb-12">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-3">Export & Import</h2>
            <div className="space-y-3 text-gray-300">
              <p><span className="text-blue-400 font-semibold">Admins and Product Managers</span> can export data:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Export to Excel:</strong> Get a detailed spreadsheet with all categories and features</li>
                <li><strong>Export to Word:</strong> Generate a formatted PRD document</li>
                <li><strong>Export Roadmap to PowerPoint:</strong> Create a visual timeline presentation</li>
                <li><strong>Import from Excel:</strong> Bulk import categories and features from a spreadsheet</li>
              </ul>
              <p className="mt-3 text-sm text-gray-400">
                Note: Exports include all categories for the currently selected project. Import assigns data to the default project.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm pt-8 border-t border-gray-800">
          <p>PRD Manager - Built with Flask, React, and PostgreSQL</p>
          <p className="mt-1">Full-stack application with role-based access control and multi-project support</p>
          <Link to="/" className="text-blue-400 hover:text-blue-300 mt-2 inline-block">
            Return to Dashboard →
          </Link>
        </div>
      </div>
    </div>
  );
}
