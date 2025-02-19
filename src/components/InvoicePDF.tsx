import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
import { Font } from '@react-pdf/renderer';
import logo from '../assets/images/sabmlogo.png';
import { formatPrice, CURRENCY_CONFIG } from '../config/currency';
import type { CurrencyCode } from '../config/currency';

// Register font
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyCg4TYFv.ttf' },
  ],
});

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
    color: '#666666',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginVertical: 15,
  },
  sectionMarker: {
    borderLeftWidth: 2,
    borderLeftColor: '#E5E7EB',
    paddingLeft: 10,
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
    flex: 1,
  },
  totalValue: {
    width: 120,
    textAlign: 'right',
  },
  totalAmount: {
    fontWeight: 'bold',
    color: '#22C55E',
    width: 120,
    textAlign: 'right',
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
  clientName: string;
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ 
  items, 
  currency, 
  selectedTier,
  totalCredits,
  customSowCost,
  creditsCost,
  clientName
}) => {
  console.log('Raw items:', items);

  console.log('Received items:', items);

  // Group items by category, preserving the formatted amounts
  const itemsByCategory = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    // Keep the original item with its formatted amount
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
            <View style={{ marginBottom: 30 }}>
              <View style={{ alignItems: 'flex-end', marginBottom: 20 }}>
                <Image 
                  src={logo}
                  style={{ width: 120, objectFit: 'contain' }}
                />
              </View>
              <View>
                <Text style={{ ...styles.categoryTitle, fontSize: 24, marginBottom: 8 }}>Draft SOW</Text>
                <Text style={{ fontSize: 15, color: '#666666', marginBottom: 24 }}>for {clientName || '[Client Name]'}</Text>
                <Text style={{ fontSize: 16, color: '#E95A0C' }}>{selectedTier} tier</Text>
              </View>
            </View>
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
                  <Text style={{ ...styles.amount, color: '#666666' }}>
                    {item.amount}
                  </Text>
                </View>
              ))}
              
              <View style={styles.divider} />
            </View>
          ))}

          {/* Summary Section */}
          <View style={styles.section}>
            <View style={styles.sectionMarker}>
              <View style={styles.row}>
                <Text style={styles.totalLabel}>Custom SOW Cost</Text>
                <Text style={{ ...styles.totalValue, color: '#666666' }}>{customSowCost}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.sectionMarker}>
              <View style={styles.row}>
                <Text style={styles.totalLabel}>Total Credits</Text>
                <Text style={styles.totalValue}>{totalCredits}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.totalLabel}>Credits Cost</Text>
                <Text style={{ ...styles.totalValue, color: '#666666' }}>{creditsCost}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={[styles.sectionMarker, { borderLeftColor: '#22C55E' }]}>
              <View style={styles.row}>
                <Text style={styles.totalLabel}>Total Savings</Text>
                <Text style={styles.totalAmount}>{(() => {
                  const sowCost = parseFloat(customSowCost.replace(/[^0-9.]/g, ''));
                  const credCost = parseFloat(creditsCost.replace(/[^0-9.]/g, ''));
                  const savings = sowCost - credCost;
                  const config = CURRENCY_CONFIG[currency];
                  const convertedAmount = savings * config.rate;
                  return `${config.symbol}${convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
                })()}</Text>
              </View>
            </View>
            {/* Terms and Conditions */}
            <View style={{ marginTop: 40, borderTop: 1, borderColor: '#E5E7EB', paddingTop: 20 }}>
              <Text style={{ fontSize: 12, color: '#666666', marginBottom: 16, fontWeight: 'bold' }}>Credit Terms and Conditions</Text>
              <Text style={{ fontSize: 11, color: '#666666', marginBottom: 12, fontWeight: 'bold' }}>Credit Invoicing & Payment:</Text>
              <Text style={{ fontSize: 9, color: '#666666', marginBottom: 12 }}>The full credit amount will be invoiced upon contract signature and payable within 15 days.</Text>

              <Text style={{ fontSize: 11, color: '#666666', marginBottom: 12, fontWeight: 'bold' }}>Credit Agility, Usage & Carryover:</Text>
              <Text style={{ fontSize: 9, color: '#666666', marginBottom: 12 }}>Unused credits may be carried over into the next quarter.</Text>

              <Text style={{ fontSize: 11, color: '#666666', marginBottom: 12, fontWeight: 'bold' }}>Changes to Planned Deliverables:</Text>
              <Text style={{ fontSize: 9, color: '#666666', marginBottom: 4 }}>Requests to modify planned deliverables must be made at least 48 hours in advance.</Text>
              <Text style={{ fontSize: 9, color: '#666666', marginBottom: 12 }}>Once a deliverable has commenced, changes are not permitted, and the associated credit will be considered consumed.</Text>

              <Text style={{ fontSize: 11, color: '#666666', marginBottom: 12, fontWeight: 'bold' }}>Credit Reconciliation & Tracking:</Text>
              <Text style={{ fontSize: 9, color: '#666666', marginBottom: 12 }}>Credit reconciliation is available upon request or provided monthly through your client services contact.</Text>

              <Text style={{ fontSize: 11, color: '#666666', marginBottom: 12, fontWeight: 'bold' }}>Credit Allocation & Delivery Timelines:</Text>
              <Text style={{ fontSize: 9, color: '#666666', marginBottom: 12 }}>Credit allocation and estimated delivery times are subject to variation based on project complexity and specific requirements.</Text>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default InvoicePDF;
