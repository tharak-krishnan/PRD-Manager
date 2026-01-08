from app import create_app, db
from app.models import Category, Feature, Priority, TShirtSize

def seed_database():
    """Seed database with initial categories and features from the original React app"""
    print('Seeding database...')

    # Clear existing data
    Feature.query.delete()
    Category.query.delete()

    # Category 1: User Authentication
    category_1 = Category(
        id='1',
        name='User Authentication',
        description='Features related to user login, registration, and account management'
    )
    db.session.add(category_1)

    features_1 = [
        Feature(id='1.1', category_id='1', title='Social Login Integration', priority=Priority.HIGH,
                description='Allow users to sign in with Google, Facebook, and Twitter',
                kpi='Increase sign-up rate by 30%', customer_name='Marketing Team',
                engineering_comment='OAuth implementation required', engineering_signoff=True,
                engineering_complexity=TShirtSize.M, release_date='2023-06'),
        Feature(id='1.2', category_id='1', title='Password Reset Flow', priority=Priority.HIGH,
                description='Implement secure password reset via email',
                kpi='Reduce support tickets by 25%', customer_name='Support Team',
                engineering_comment='Need to integrate with email service', engineering_signoff=True,
                engineering_complexity=TShirtSize.S, release_date='2023-05'),
        Feature(id='1.3', category_id='1', title='Two-Factor Authentication', priority=Priority.MEDIUM,
                description='Add SMS and authenticator app options for 2FA',
                kpi='Improve security metrics by 40%', customer_name='Security Team',
                engineering_comment='Will require integration with SMS provider', engineering_signoff=True,
                engineering_complexity=TShirtSize.L, release_date='2023-07'),
        Feature(id='1.4', category_id='1', title='Account Lockout Protection', priority=Priority.MEDIUM,
                description='Implement temporary account lockout after failed login attempts',
                kpi='Reduce unauthorized access attempts by 60%', customer_name='Security Team',
                engineering_comment='Need to design rate limiting system', engineering_signoff=False,
                engineering_complexity=TShirtSize.M, release_date='2023-08'),
        Feature(id='1.5', category_id='1', title='Role-based Access Control', priority=Priority.HIGH,
                description='Implement granular permission system for different user roles',
                kpi='Improve enterprise adoption by 20%', customer_name='Enterprise Sales',
                engineering_comment='Will require database schema changes', engineering_signoff=False,
                engineering_complexity=TShirtSize.XL, release_date='2023-09'),
    ]
    db.session.add_all(features_1)

    # Category 2: Analytics Dashboard
    category_2 = Category(
        id='2',
        name='Analytics Dashboard',
        description='Features for data visualization and reporting'
    )
    db.session.add(category_2)

    features_2 = [
        Feature(id='2.1', category_id='2', title='Custom Report Builder', priority=Priority.MEDIUM,
                description='Allow users to create and save custom reports',
                kpi='Increase user engagement by 15%', customer_name='Data Science Team',
                engineering_comment='Will require new database schema', engineering_signoff=False,
                engineering_complexity=TShirtSize.L, release_date='2023-08'),
        Feature(id='2.2', category_id='2', title='Real-time Data Visualization', priority=Priority.HIGH,
                description='Implement live-updating charts and graphs for key metrics',
                kpi='Reduce time to insight by 50%', customer_name='Executive Team',
                engineering_comment='Need to implement WebSocket connections', engineering_signoff=True,
                engineering_complexity=TShirtSize.L, release_date='2023-07'),
        Feature(id='2.3', category_id='2', title='Export to PDF/CSV', priority=Priority.LOW,
                description='Allow users to export reports in multiple formats',
                kpi='Improve sharing capabilities by 30%', customer_name='Marketing Team',
                engineering_comment='Need to research PDF generation libraries', engineering_signoff=True,
                engineering_complexity=TShirtSize.M, release_date='2023-06'),
        Feature(id='2.4', category_id='2', title='Scheduled Reports', priority=Priority.MEDIUM,
                description='Allow users to schedule automated report generation and delivery',
                kpi='Reduce manual reporting time by 70%', customer_name='Account Management',
                engineering_comment='Will need to set up cron jobs and email delivery', engineering_signoff=False,
                engineering_complexity=TShirtSize.M, release_date='2023-10'),
    ]
    db.session.add_all(features_2)

    # Category 3: Mobile Application
    category_3 = Category(
        id='3',
        name='Mobile Application',
        description='Features for the iOS and Android mobile applications'
    )
    db.session.add(category_3)

    features_3 = [
        Feature(id='3.1', category_id='3', title='Offline Mode', priority=Priority.HIGH,
                description='Allow users to access key features without internet connection',
                kpi='Increase mobile usage by 40%', customer_name='Product Team',
                engineering_comment='Need to implement local storage and sync', engineering_signoff=True,
                engineering_complexity=TShirtSize.XL, release_date='2023-09'),
        Feature(id='3.2', category_id='3', title='Push Notifications', priority=Priority.MEDIUM,
                description='Implement customizable push notifications for important events',
                kpi='Improve re-engagement rate by 25%', customer_name='Marketing Team',
                engineering_comment='Will use Firebase Cloud Messaging', engineering_signoff=True,
                engineering_complexity=TShirtSize.M, release_date='2023-06'),
        Feature(id='3.3', category_id='3', title='Biometric Authentication', priority=Priority.MEDIUM,
                description='Add fingerprint and face recognition login options',
                kpi='Improve login convenience score by 30%', customer_name='UX Team',
                engineering_comment='Need to use native device APIs', engineering_signoff=False,
                engineering_complexity=TShirtSize.L, release_date='2023-08'),
        Feature(id='3.4', category_id='3', title='AR Feature Integration', priority=Priority.LOW,
                description='Implement augmented reality features for product visualization',
                kpi='Increase product interaction by 15%', customer_name='Innovation Team',
                engineering_comment='Experimental feature, will need ARKit/ARCore', engineering_signoff=False,
                engineering_complexity=TShirtSize.XL, release_date='2023-11'),
    ]
    db.session.add_all(features_3)

    # Category 4: Payment Processing
    category_4 = Category(
        id='4',
        name='Payment Processing',
        description='Features related to billing, subscriptions, and payment methods'
    )
    db.session.add(category_4)

    features_4 = [
        Feature(id='4.1', category_id='4', title='Subscription Management', priority=Priority.HIGH,
                description='Allow users to manage their subscription plans and billing cycles',
                kpi='Reduce subscription churn by 20%', customer_name='Finance Team',
                engineering_comment='Will integrate with Stripe API', engineering_signoff=True,
                engineering_complexity=TShirtSize.L, release_date='2023-07'),
        Feature(id='4.2', category_id='4', title='Multiple Payment Methods', priority=Priority.MEDIUM,
                description='Support credit cards, PayPal, and bank transfers',
                kpi='Increase payment success rate by 15%', customer_name='Global Sales',
                engineering_comment='Need to implement multiple payment gateways', engineering_signoff=True,
                engineering_complexity=TShirtSize.M, release_date='2023-08'),
        Feature(id='4.3', category_id='4', title='Invoice Generation', priority=Priority.LOW,
                description='Automatically generate and email invoices for payments',
                kpi='Reduce accounting workload by 30%', customer_name='Finance Team',
                engineering_comment='Will need PDF generation capability', engineering_signoff=False,
                engineering_complexity=TShirtSize.S, release_date='2023-09'),
    ]
    db.session.add_all(features_4)

    # Category 5: Performance Optimization
    category_5 = Category(
        id='5',
        name='Performance Optimization',
        description='Features focused on improving application speed and efficiency'
    )
    db.session.add(category_5)

    features_5 = [
        Feature(id='5.1', category_id='5', title='Image Compression', priority=Priority.MEDIUM,
                description='Implement automatic image optimization for uploads',
                kpi='Reduce page load time by 25%', customer_name='UX Team',
                engineering_comment='Will use server-side processing', engineering_signoff=True,
                engineering_complexity=TShirtSize.M, release_date='2023-06'),
        Feature(id='5.2', category_id='5', title='Database Query Optimization', priority=Priority.HIGH,
                description='Refactor database queries for improved performance',
                kpi='Reduce API response time by 40%', customer_name='Engineering',
                engineering_comment='Will require significant refactoring', engineering_signoff=True,
                engineering_complexity=TShirtSize.L, release_date='2023-07'),
        Feature(id='5.3', category_id='5', title='CDN Integration', priority=Priority.MEDIUM,
                description='Implement content delivery network for static assets',
                kpi='Improve global load times by 50%', customer_name='International Sales',
                engineering_comment='Will use CloudFront or similar', engineering_signoff=False,
                engineering_complexity=TShirtSize.M, release_date='2023-10'),
    ]
    db.session.add_all(features_5)

    # Category 6: Collaboration Tools
    category_6 = Category(
        id='6',
        name='Collaboration Tools',
        description='Features that enable team collaboration and communication'
    )
    db.session.add(category_6)

    features_6 = [
        Feature(id='6.1', category_id='6', title='Shared Workspaces', priority=Priority.HIGH,
                description='Create team workspaces with shared resources and permissions',
                kpi='Increase team productivity by 30%', customer_name='Enterprise Customers',
                engineering_comment='Complex permission system required', engineering_signoff=True,
                engineering_complexity=TShirtSize.XL, release_date='2023-08'),
        Feature(id='6.2', category_id='6', title='In-app Messaging', priority=Priority.MEDIUM,
                description='Implement real-time chat functionality between team members',
                kpi='Reduce email communication by 40%', customer_name='Product Team',
                engineering_comment='Will use WebSockets for real-time updates', engineering_signoff=False,
                engineering_complexity=TShirtSize.L, release_date='2023-09'),
        Feature(id='6.3', category_id='6', title='Document Collaboration', priority=Priority.MEDIUM,
                description='Allow multiple users to edit documents simultaneously',
                kpi='Improve document completion time by 50%', customer_name='Content Team',
                engineering_comment='Will need operational transformation algorithm', engineering_signoff=False,
                engineering_complexity=TShirtSize.XL, release_date='2023-11'),
        Feature(id='6.4', category_id='6', title='Activity Feed', priority=Priority.LOW,
                description='Show recent activities and changes by team members',
                kpi='Increase awareness of team activities by 35%', customer_name='Project Managers',
                engineering_comment='Will need to implement activity logging system', engineering_signoff=True,
                engineering_complexity=TShirtSize.M, release_date='2023-07'),
    ]
    db.session.add_all(features_6)

    # Commit all data
    db.session.commit()

    print(f'Database seeded successfully!')
    print(f'- Created 6 categories')
    print(f'- Created 23 features')

if __name__ == '__main__':
    app = create_app('development')
    with app.app_context():
        seed_database()
