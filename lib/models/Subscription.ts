import mongoose from 'mongoose'

// Subscription Schema with user isolation
// Each subscription is tied to a specific user ID for data security
const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true // Performance optimization for user-specific queries
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'USD',
    uppercase: true
  },
  billingCycle: {
    type: String,
    required: true,
    enum: ['monthly', 'yearly']
  },
  nextRenewalDate: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense']
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'paused', 'cancelled'],
    default: 'active'
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  // Ensure user cannot access another user's data
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Compound index for efficient user queries
subscriptionSchema.index({ userId: 1, status: 1 })
subscriptionSchema.index({ userId: 1, nextRenewalDate: 1 })

export type { SubscriptionType, BillingCycle, SubscriptionStatus }
const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema)

export default Subscription