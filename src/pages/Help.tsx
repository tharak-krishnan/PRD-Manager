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
            <a href="#categories" className="text-blue-400 hover:text-blue-300">Managing Categories</a>
            <a href="#features" className="text-blue-400 hover:text-blue-300">Managing Features</a>
            <a href="#roadmap" className="text-blue-400 hover:text-blue-300">Product Roadmap</a>
            <a href="#metadata" className="text-blue-400 hover:text-blue-300">Feature Metadata</a>
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
              <li>Explore the pre-loaded sample categories and features</li>
              <li>Click on different categories in the sidebar to filter features</li>
              <li>Switch between Dashboard and Roadmap views using the navigation</li>
              <li>Create your first category or feature to get started</li>
            </ol>
          </div>
        </section>

        {/* Categories */}
        <section id="categories" className="mb-12">
          <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">Managing Categories</h2>

          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">What are Categories?</h3>
              <p className="text-gray-300">
                Categories are high-level groupings that organize related features. For example:
                "User Authentication", "Analytics Dashboard", "Mobile Application", etc.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Creating a Category</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Click the <span className="bg-blue-600 px-2 py-1 rounded text-sm">+ Add Category</span> button in the sidebar</li>
                <li>Enter a name (required) and description (optional)</li>
                <li>Click "Add Category" to save</li>
                <li>Your new category will appear in the sidebar</li>
              </ol>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Editing & Deleting Categories</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Click the pencil icon next to a category to edit its name and description</li>
                <li>Click the trash icon to delete a category</li>
                <li><span className="text-yellow-400">Warning:</span> Deleting a category will also delete all its features</li>
              </ul>
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

        {/* Tips */}
        <section id="tips" className="mb-12">
          <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">Tips & Best Practices</h2>

          <div className="bg-gray-800 rounded-lg p-6">
            <ul className="space-y-3 text-gray-300">
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
                <span><strong>Get engineering signoff early:</strong> Technical validation prevents surprises during implementation</span>
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
              The application is fully containerized with Docker and uses a SQLite database for persistence.
              All your data is stored securely and persists across sessions.
            </p>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm pt-8 border-t border-gray-800">
          <p>PRD Manager - Built with Flask, React, and SQLite</p>
          <Link to="/" className="text-blue-400 hover:text-blue-300 mt-2 inline-block">
            Return to Dashboard →
          </Link>
        </div>
      </div>
    </div>
  );
}
