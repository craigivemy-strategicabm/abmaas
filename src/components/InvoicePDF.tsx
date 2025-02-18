import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { Font } from '@react-pdf/renderer';

// Register font
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyCg4TYFv.ttf' },
  ],
});
import { formatPrice } from '../config/currency';
import type { CurrencyCode } from '../config/currency';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 16,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 20,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    marginBottom: 4,
  },
  credits: {
    fontSize: 10,
    color: '#666',
  },
  amount: {
    width: 100,
    textAlign: 'right',
    color: '#22C55E', // green-500
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginVertical: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontWeight: 'bold',
  },
  totalAmount: {
    fontWeight: 'bold',
    color: '#22C55E',
  }
});

interface InvoicePDFProps {
  items: Array<{
    id: string;
    title: string;
    credits: number;
    amount: string;
    category: string;
    order: number;
  }>;
  currency: CurrencyCode;
  selectedTier: string;
  totalCredits: number;
  customSowCost: string;
  creditsCost: string;
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ 
  items, 
  currency, 
  selectedTier,
  totalCredits,
  customSowCost,
  creditsCost
}) => {
  console.log('Raw items:', items);

  // Group items by category
  const itemsByCategory = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  console.log('Items by category:', itemsByCategory);

  // Sort categories by the first item's order in each category
  const sortedCategories = Object.entries(itemsByCategory)
    .sort(([categoryA], [categoryB]) => {
      const itemA = items.find(i => i.category === categoryA);
      const itemB = items.find(i => i.category === categoryB);
      return (itemA?.order || 0) - (itemB?.order || 0);
    })
    .map(([category]) => category);

  console.log('Sorted categories:', sortedCategories);

  // Sort items within each category by order
  Object.values(itemsByCategory).forEach(categoryItems => {
    categoryItems.sort((a, b) => a.order - b.order);
  });

  // Calculate savings
  const sowCost = parseFloat(customSowCost.replace(/[^0-9.-]+/g, ''));
  const credCost = parseFloat(creditsCost.replace(/[^0-9.-]+/g, ''));
  const savings = sowCost - credCost;

  return (
    <PDFViewer style={{ width: '100%', height: '100vh' }}>
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.section}>
            <Text style={{ ...styles.categoryTitle, fontSize: 24, marginBottom: 8 }}>Draft SOW</Text>
            <Text style={{ fontSize: 16, color: '#E95A0C', marginBottom: 20 }}>{selectedTier} tier</Text>
          </View>

          {/* Categories and Items */}
          {sortedCategories.map(category => (
            <View key={category} style={styles.section} break={false}>
              <Text style={styles.categoryTitle}>{category}</Text>
              
              {itemsByCategory[category].map((item, index) => (
                <View key={item.id} style={styles.row} break={false}>
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.credits}>
                      {item.credits} {item.credits === 1 ? 'credit' : 'credits'}
                    </Text>
                  </View>
                  <Text style={styles.amount}>{item.amount}</Text>
                </View>
              ))}
              
              <View style={styles.divider} />
            </View>
          ))})

          {/* Summary Section */}
          <View style={styles.section}>
            <View style={styles.row}>
              <Text style={styles.totalLabel}>Custom SOW Cost</Text>
              <Text style={styles.amount}>{customSowCost}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.totalLabel}>Total Credits</Text>
              <Text style={styles.amount}>{totalCredits}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.totalLabel}>Credits Cost</Text>
              <Text style={styles.amount}>{creditsCost}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.totalLabel}>Total Savings</Text>
              <Text style={styles.totalAmount}>{formatPrice(savings, currency)}</Text>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default InvoicePDF;
