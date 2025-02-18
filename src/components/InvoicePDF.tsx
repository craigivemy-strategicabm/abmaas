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
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ items, currency }) => {
  // Group and sort items by category and order
  const itemsByCategory = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  // Sort items within each category by order
  Object.values(itemsByCategory).forEach(categoryItems => {
    categoryItems.sort((a, b) => a.order - b.order);
  });

  // Calculate totals
  const totalCredits = items.reduce((sum, item) => sum + item.credits, 0);
  const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.amount.replace(/[^0-9.-]+/g, '')), 0);

  return (
    <PDFViewer style={{ width: '100%', height: '100vh' }}>
      <Document>
        <Page size="A4" style={styles.page}>
          {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
            <View key={category} style={styles.section} break={false}>
              <Text style={styles.categoryTitle}>{category}</Text>
              
              {categoryItems.map((item, index) => (
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
          ))}
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Credits: {totalCredits}</Text>
            <Text style={styles.totalAmount}>{formatPrice(totalAmount, currency)}</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default InvoicePDF;
