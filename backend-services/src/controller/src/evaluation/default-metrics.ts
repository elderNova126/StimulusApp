/**
 * This information is fixed and should not change !
 */

export interface DefaultMetric {
  category: string;
  question: string;
  weight: number;
}

export const defaultMetrics = [
  {
    category: 'Quality',
    keyId: 'quality',
    question: 'How would you rate the quality of the products and services',
    weight: 20,
  },
  {
    category: 'Reliability',
    keyId: 'reliability',
    question: 'How would you rate the reliability of the supplier',
    weight: 18,
  },
  {
    category: 'Features',
    keyId: 'features',
    question: 'How would you rate the features of the products and services matching the needs of your your business',
    weight: 13,
  },
  {
    category: 'Cost',
    keyId: 'cost',
    question: 'How would you rate the cost of the products and services',
    weight: 12,
  },
  {
    category: 'Relationship',
    keyId: 'relationship',
    question: 'How would you rate the work relationship and ease of doing business with the supplier',
    weight: 10,
  },
  {
    category: 'Financial',
    keyId: 'financial',
    question: 'How would you rate the financial strength of the supplier',
    weight: 5,
  },
  {
    category: 'Diversity',
    keyId: 'diversity',
    question: 'How would you rate the supplier’s workforce and leadership diversity',
    weight: 5,
  },
  {
    category: 'Innovation',
    keyId: 'innovation',
    question: 'How would you rate the innovation or advanced features of the products and services',
    weight: 5,
  },
  {
    category: 'Flexibility',
    keyId: 'flexibility',
    question:
      'How would you rate the flexibility of the supplier to adapt to unusual requirements or unexpected changes',
    weight: 5,
  },
  {
    category: 'Brand',
    keyId: 'brand',
    question: 'How would you rate the supplier’s brand recognition',
    weight: 5,
  },
];
