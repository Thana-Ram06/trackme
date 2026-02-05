import { Subscription } from './types'

export const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    name: 'Netflix',
    amount: 15.99,
    currency: 'USD',
    billingCycle: 'monthly',
    nextRenewalDate: '2024-02-15',
    type: 'expense',
    status: 'active',
    notes: 'Premium plan with 4K streaming',
    createdAt: '2023-01-15'
  },
  {
    id: '2',
    name: 'Spotify',
    amount: 9.99,
    currency: 'USD',
    billingCycle: 'monthly',
    nextRenewalDate: '2024-02-20',
    type: 'expense',
    status: 'active',
    notes: 'Individual plan',
    createdAt: '2023-02-20'
  },
  {
    id: '3',
    name: 'GitHub Pro',
    amount: 4.00,
    currency: 'USD',
    billingCycle: 'monthly',
    nextRenewalDate: '2024-02-10',
    type: 'expense',
    status: 'active',
    notes: 'Developer tools and private repositories',
    createdAt: '2023-03-10'
  },
  {
    id: '4',
    name: 'Freelance Client A',
    amount: 2000.00,
    currency: 'USD',
    billingCycle: 'monthly',
    nextRenewalDate: '2024-02-01',
    type: 'income',
    status: 'active',
    notes: 'Web development retainer',
    createdAt: '2023-04-01'
  },
  {
    id: '5',
    name: 'Adobe Creative Cloud',
    amount: 599.88,
    currency: 'USD',
    billingCycle: 'yearly',
    nextRenewalDate: '2024-03-15',
    type: 'expense',
    status: 'active',
    notes: 'All apps plan for design work',
    createdAt: '2023-03-15'
  },
  {
    id: '6',
    name: 'Digital Ocean',
    amount: 24.00,
    currency: 'USD',
    billingCycle: 'monthly',
    nextRenewalDate: '2024-02-05',
    type: 'expense',
    status: 'active',
    notes: 'Droplet for personal projects',
    createdAt: '2023-05-05'
  },
  {
    id: '7',
    name: 'Freelance Client B',
    amount: 1500.00,
    currency: 'USD',
    billingCycle: 'monthly',
    nextRenewalDate: '2024-02-01',
    type: 'income',
    status: 'active',
    notes: 'SEO consulting retainer',
    createdAt: '2023-06-01'
  },
  {
    id: '8',
    name: 'Notion Pro',
    amount: 8.00,
    currency: 'USD',
    billingCycle: 'monthly',
    nextRenewalDate: '2024-02-25',
    type: 'expense',
    status: 'paused',
    notes: 'Currently not using frequently',
    createdAt: '2023-07-25'
  },
  {
    id: '9',
    name: 'ChatGPT Plus',
    amount: 20.00,
    currency: 'USD',
    billingCycle: 'monthly',
    nextRenewalDate: '2024-02-18',
    type: 'expense',
    status: 'active',
    notes: 'AI assistant for coding and writing',
    createdAt: '2023-08-18'
  },
  {
    id: '10',
    name: 'Figma Professional',
    amount: 15.00,
    currency: 'USD',
    billingCycle: 'monthly',
    nextRenewalDate: '2024-02-12',
    type: 'expense',
    status: 'active',
    notes: 'UI/UX design tool',
    createdAt: '2023-09-12'
  }
]