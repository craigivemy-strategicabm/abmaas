import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
import { Font } from '@react-pdf/renderer';
import logo from '../assets/images/sabmlogo.png';
import { formatPrice, CURRENCY_CONFIG } from '../config/currency';
import type { CurrencyCode } from '../config/currency';
import { itemDescriptions } from '../abmTiersComponent';
import { ALL_PLAYBOOKS } from './PlaybooksNetflixLayout';

const categoryDescriptions = {
  'ABM foundations': 'Custom ABM programmes & individual strategic deliverables tailored to your specific needs, setting the foundations for scale and time to market goals.',
  'Insights': 'On-demand market, account and stakeholder intelligence forming the foundations for scale and personalised messaging.',
  'Personalized content & creative': 'Hyper-personalised content designed to solve the relationship needs of your most important accounts, delivered for approval within 72hrs to 96hrs.',
  'Playbook credits': 'Comprehensive playbooks that provide strategic frameworks and tactical guidance for executing ABM campaigns effectively.',
  'ABM Training': 'Structured training programs covering ABM fundamentals, strategy development, and execution best practices to build internal capabilities.'
};

// Using standard PDF fonts - no registration needed

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 16,
    marginBottom: 2,
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
    marginBottom: 2,
  },
  itemDescription: {
    marginBottom: 4,
    fontSize: 10,
    color: '#666666',
  },
  quantity: {
    fontSize: 9,
    color: '#666',
  },
  highlight: {
    color: '#000000',
    fontWeight: 'bold',
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

// Terms and conditions styles
const paymentStyles = StyleSheet.create({
  card: {
    backgroundColor: '#F8F9FA',
    borderRadius: 4,
    padding: 15,
    marginBottom: 20,
  },
  bullet: {
    marginRight: 8,
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  amountText: {
    fontSize: 11,
    marginTop: 4,
  }
});

const termsStyles = StyleSheet.create({
  container: {
    marginTop: 30,
    fontSize: 10,
  },
  heading: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  paragraph: {
    marginBottom: 4,
    lineHeight: 1,
  }
});

const footerStyles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  footerText: {
    color: '#666666',
    fontSize: 10,
    marginBottom: 4,
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
    quantity: number;
  }>;
  currency: CurrencyCode;
  selectedTier: string;
  totalCredits: number;
  customSowCost: string;
  creditsCost: string;
  clientName: string;
}

// Function to get playbook by title
const getPlaybook = (title: string) => {
  // Clean the title by removing any text in parentheses and trimming
  const cleanTitle = title.split(' (')[0].trim();
  
  // First try exact title match
  let playbook = ALL_PLAYBOOKS.find(p => p.title === cleanTitle);
  
  // If not found, try with title + subtitle
  if (!playbook) {
    playbook = ALL_PLAYBOOKS.find(p => {
      const fullTitle = p.subtitle ? `${p.title} - ${p.subtitle}` : p.title;
      return fullTitle === cleanTitle;
    });
  }
  
  // If still not found, try a more relaxed match (title contains or is contained by the clean title)
  if (!playbook) {
    playbook = ALL_PLAYBOOKS.find(p => {
      const normalizedPlaybookTitle = p.title.toLowerCase();
      const normalizedCleanTitle = cleanTitle.toLowerCase();
      return normalizedPlaybookTitle.includes(normalizedCleanTitle) || 
             normalizedCleanTitle.includes(normalizedPlaybookTitle);
    });
  }
  
  return playbook;
};

// Function to get playbook description by title
const getPlaybookDescription = (title: string) => {
  const playbook = getPlaybook(title);
  return playbook?.description;
};

const Footer = () => (
  <View style={footerStyles.footerContainer}>
    <Text style={footerStyles.footerText}>
      Strategic Internet Consulting Ltd. t/a strategicabm
    </Text>
    <Text style={footerStyles.footerText}>
      Company Number: 6852900 | VAT Number: 844577004
    </Text>
    <Text style={footerStyles.footerText}>
      Suite 4, Richmond House, 2 Medwin Walk, Horsham, RH12 1AQ
    </Text>
  </View>
);

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

  console.log('Available categories:', sortedCategories);
  console.log('Category descriptions:', Object.keys(categoryDescriptions));

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
          <View style={{ alignItems: 'flex-end', marginBottom: 20 }}>
            <Image 
              src={logo}
              style={{ width: 120, objectFit: 'contain' }}
            />
          </View>
          {/* Header */}
          <View style={styles.section}>
            <View style={{ marginBottom: 0 }}>
              <View>
                <Text style={{ ...styles.categoryTitle, fontSize: 24, marginBottom: 8 }}>Draft SOW</Text>
                <Text style={{ fontSize: 15, color: '#666666', marginBottom: 16 }}>for {clientName || '[Client Name]'}</Text>
              </View>
            </View>
          </View>

          {/* Categories and Items */}
          <View style={{ marginTop: 0 }}>
            {sortedCategories.map((category, categoryIndex) => (
            <View key={category} style={[styles.section, { marginBottom: categoryIndex === sortedCategories.length - 1 ? 40 : 64 }]} break={false}>
              <View style={{ marginBottom: 24 }}>
                <Text style={{ ...styles.categoryTitle, color: '#E95A0C' }}>{category}</Text>
                <Text style={{ fontSize: 11, color: '#666666', marginTop: 2 }}>{categoryDescriptions[category]}</Text>
              </View>
              
              <View>
                {itemsByCategory[category].map((item, index) => (
                  <View key={item.id} style={{ backgroundColor: '#F8F9FC', padding: 12, borderRadius: 8, marginBottom: index === itemsByCategory[category].length - 1 ? 0 : 12 }} break={false}>
                    <View style={styles.row}>
                      <View style={styles.itemDetails}>
                        <Text style={{ ...styles.itemTitle, fontSize: 11 }}>{item.title}</Text>
                        {(() => {
                          const playbook = getPlaybook(item.title);
                          return (
                            <View>
                              <Text style={{ ...styles.itemDescription, fontSize: 9, marginTop: 4 }}>
                                {playbook?.description || itemDescriptions[item.title.split(' (')[0]]}
                              </Text>
                            </View>
                          );
                        })()}
                        <Text style={{ ...styles.quantity, marginTop: 6, fontSize: 8 }}>
                          Quantity: <Text style={styles.highlight}>{item.quantity || 1}</Text> @ <Text style={styles.highlight}>{`${CURRENCY_CONFIG[currency].symbol}${(item.basePrice * CURRENCY_CONFIG[currency].rate).toFixed(1)}k`}</Text> per credit
                        </Text>
                      </View>
                      <Text style={{ ...styles.amount, color: '#666666', fontSize: 11 }}>
                        {item.amount}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
          </View>

          {/* Summary Section */}
          <View style={{ ...styles.section, marginTop: 40 }}>
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
                <Text style={styles.totalAmount}>{formatPrice(Number(customSowCost.replace(/[^0-9.-]+/g, '')) - Number(creditsCost.replace(/[^0-9.-]+/g, '')), currency, true)}</Text>
              </View>
            </View>
          </View>

          <Footer />
        </Page>
        <Page size="A4" style={styles.page}>
          <View style={{ alignItems: 'flex-end', marginBottom: 20 }}>
            <Image 
              src={logo}
              style={{ width: 120, objectFit: 'contain' }}
            />
          </View>
          <View style={termsStyles.container}>
            <Text style={termsStyles.heading}>ABM Credits Model terms and conditions</Text>
            
            <Text style={termsStyles.paragraph}>
              Choose between a traditional custom Statement of Work for structured, scoped projects or our ABM Credits Model, a flexible,
              on-demand system that lets you tap into playbooks, outcomes, training, and support whenever you need them.
            </Text>
            
            <Text style={termsStyles.paragraph}>
              More agility, more control, more impact – designed to scale with your business as you grow.
            </Text>

            <Text style={termsStyles.subheading}>Invoicing & payment terms</Text>
            <Text style={termsStyles.paragraph}>
              Our ABM credits model is designed to offer clients significant cost benefits, agility, and flexibility compared to a traditionally delivered
              statement of work, enabling them to navigate the unpredictable nature of enterprise sales and marketing programs.
            </Text>

            <Text style={termsStyles.subheading}>Payment terms</Text>
            <Text style={termsStyles.paragraph}>
              To provide these benefits, prepayment is requested prior to the commencement of programme deliverables. Prepayment invoices for
              either 100% or 50% of the total credit budget will be issued upon contract signature.
            </Text>

            <View style={paymentStyles.card}>
              <Text style={[termsStyles.subheading, { fontFamily: 'Helvetica', fontWeight: 'bold' }]}>100% prepayment</Text>
              <Text style={termsStyles.paragraph}>
                By choosing to prepay 100% of the credits budget:
              </Text>
              <Text style={termsStyles.paragraph}>
                {"\n"}
              </Text>
              <View style={paymentStyles.row}>
                <Text style={paymentStyles.bullet}>•</Text>
                <Text style={paymentStyles.amountText}>
                  Total credit cost: <Text style={{ fontFamily: 'Helvetica', fontWeight: 'bold' }}>{formatPrice(Number(creditsCost.replace(/[^0-9.-]+/g, '')), currency, true)}</Text>
                </Text>
              </View>
              <View style={paymentStyles.row}>
                <Text style={paymentStyles.bullet}>•</Text>
                <Text style={paymentStyles.amountText}>
                  Your <Text style={{ fontFamily: 'Helvetica', fontWeight: 'bold' }}>prepayment invoice</Text> would be <Text style={{ fontFamily: 'Helvetica', fontWeight: 'bold' }}>{formatPrice(Number(creditsCost.replace(/[^0-9.-]+/g, '')), currency, true)}</Text> (on contract signature)
                </Text>
              </View>
              <View style={paymentStyles.row}>
                <Text style={paymentStyles.bullet}>•</Text>
                <Text style={paymentStyles.amountText}>
                  Your <Text style={{ fontFamily: 'Helvetica', fontWeight: 'bold' }}>total saving</Text> (vs a custom SOW) would be <Text style={{ fontFamily: 'Helvetica', fontWeight: 'bold', color: '#22C55E' }}>{formatPrice(Number(customSowCost.replace(/[^0-9.-]+/g, '')) - Number(creditsCost.replace(/[^0-9.-]+/g, '')), currency, true)}</Text>
                </Text>
              </View>
            </View>

            <View style={paymentStyles.card}>
              <Text style={[termsStyles.subheading, { fontFamily: 'Helvetica', fontWeight: 'bold' }]}>Staged prepayment</Text>
              <Text style={termsStyles.paragraph}>
                By prepaying your credits budget in stages of 50% on contract signature, and 50% at the mid-way point:
              </Text>
              <Text style={termsStyles.paragraph}>
                {"\n"}
              </Text>
              <View style={paymentStyles.row}>
                <Text style={paymentStyles.bullet}>•</Text>
                <Text style={paymentStyles.amountText}>
                  Total credit cost: <Text style={{ fontFamily: 'Helvetica', fontWeight: 'bold' }}>{(() => {
                    const credCost = Number(creditsCost.replace(/[^0-9.-]+/g, ''));
                    const sowCost = Number(customSowCost.replace(/[^0-9.-]+/g, ''));
                    const savings = sowCost - credCost;
                    return formatPrice(credCost + (savings * 0.5), currency, true);
                  })()}</Text>
                </Text>
              </View>
              <View style={paymentStyles.row}>
                <Text style={paymentStyles.bullet}>•</Text>
                <Text style={paymentStyles.amountText}>
                  Your first <Text style={{ fontFamily: 'Helvetica', fontWeight: 'bold' }}>prepayment invoice</Text> would be <Text style={{ fontFamily: 'Helvetica', fontWeight: 'bold' }}>{(() => {
                    const credCost = Number(creditsCost.replace(/[^0-9.-]+/g, ''));
                    const sowCost = Number(customSowCost.replace(/[^0-9.-]+/g, ''));
                    const savings = sowCost - credCost;
                    const totalCost = credCost + (savings * 0.5);
                    return formatPrice(totalCost * 0.5, currency, true);
                  })()}</Text> (on contract signature)
                </Text>
              </View>
              <View style={paymentStyles.row}>
                <Text style={paymentStyles.bullet}>•</Text>
                <Text style={paymentStyles.amountText}>
                  Your <Text style={{ fontFamily: 'Helvetica', fontWeight: 'bold' }}>second prepayment invoice</Text> would be <Text style={{ fontFamily: 'Helvetica', fontWeight: 'bold' }}>{(() => {
                    const credCost = Number(creditsCost.replace(/[^0-9.-]+/g, ''));
                    const sowCost = Number(customSowCost.replace(/[^0-9.-]+/g, ''));
                    const savings = sowCost - credCost;
                    const totalCost = credCost + (savings * 0.5);
                    return formatPrice(totalCost * 0.5, currency, true);
                  })()}</Text>
                </Text>
              </View>
              <View style={paymentStyles.row}>
                <Text style={paymentStyles.bullet}>•</Text>
                <Text style={paymentStyles.amountText}>
                  Your <Text style={{ fontFamily: 'Helvetica', fontWeight: 'bold' }}>total saving</Text> (vs a custom SOW) would be <Text style={{ fontFamily: 'Helvetica', fontWeight: 'bold', color: '#22C55E' }}>{(() => {
                    const sowCost = Number(customSowCost.replace(/[^0-9.-]+/g, ''));
                    const credCost = Number(creditsCost.replace(/[^0-9.-]+/g, ''));
                    const totalSavings = sowCost - credCost;
                    return formatPrice(totalSavings / 2, currency, true);
                  })()}</Text>
                </Text>
              </View>
            </View>

            <Text style={termsStyles.subheading}>Credit budget</Text>
            <Text style={termsStyles.paragraph}>
              The recommended credit budget has been planned in alignment to the client's budget investment, planning cycle, required
              deliverables and time to market goals.
            </Text>

            <Text style={termsStyles.subheading}>Credit consumption period</Text>
            <Text style={termsStyles.paragraph}>
              The credit consumption period refers to the timeframe within which purchased credits must be consumed. This period is defined by the
              contract start date, end date and pre-agreed delivery timescale.
            </Text>

            <Text style={termsStyles.subheading}>Credit carryover</Text>
            <Text style={termsStyles.paragraph}>
              Credits not consumed within the credit consumption period can be carried over by a maximum of 90 days post-contract end date, after
              which they will expire.
            </Text>

            <Text style={termsStyles.subheading}>Agility & flexibility</Text>
            <Text style={termsStyles.paragraph}>
              We get it, priorities can change. We are happy to receive requests to modify planned deliverables. All we ask is you provide a minimum
              of 3 working days notice.
            </Text>
            <Text style={termsStyles.paragraph}>
              Please note credits will be considered "consumed" upon the commencement of a deliverable.
            </Text>

            <Text style={termsStyles.subheading}>Credit reconciliation</Text>
            <Text style={termsStyles.paragraph}>
              Credit reconciliation is available upon request or provided monthly through your client services contact.
            </Text>
          </View>
          <Footer />
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default InvoicePDF;
