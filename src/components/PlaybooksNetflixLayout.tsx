import React, { useState } from 'react';
import { InsightItem } from '../abmTiersComponent';

// Define the playbook data structure
interface Playbook {
  title: string;
  subtitle?: string;
  category: 'net-new' | 'customer-growth';
  stage: string;
  tacticalCredits: string;
  impactCredits: string;
  enterpriseCredits: string;
  customPrice: string;
}

// Define the journey stages with their colors
const NET_NEW_STAGES = ['Awareness', 'Educate', 'Influence', 'Commit'];
const CUSTOMER_GROWTH_STAGES = ['Adoption', 'Expansion', 'Retention', 'Advocacy'];

// Stage color mapping
const stageColors = {
  'Awareness': '#a70000',      // Deep red
  'Educate': '#a26900',        // Gold/amber
  'Influence': '#008f8f',      // Teal
  'Commit': '#1a4ba3',         // Blue
  'Adoption': '#444444',       // Dark Gray
  'Expansion': '#444444',      // Dark Gray
  'Retention': '#777777',      // Light Gray
  'Advocacy': '#e95a0c'        // Orange
};

// Define all playbooks
const ALL_PLAYBOOKS: Playbook[] = [
  // Playbooks definitions...
  // Net-new Target Accounts - Awareness
  {
    title: "Engage",
    subtitle: "new market segment",
    category: "net-new",
    stage: "Awareness",
    tacticalCredits: "12",
    impactCredits: "12",
    enterpriseCredits: "11",
    customPrice: "12"
  },
  {
    title: "Engage",
    subtitle: "untouched accounts",
    category: "net-new",
    stage: "Awareness",
    tacticalCredits: "12",
    impactCredits: "12",
    enterpriseCredits: "11",
    customPrice: "12"
  },
  {
    title: "Stay front of mind",
    subtitle: "during multi-channel communications",
    category: "net-new",
    stage: "Awareness",
    tacticalCredits: "12",
    impactCredits: "12",
    enterpriseCredits: "11",
    customPrice: "12"
  },
  {
    title: "Exec peer-to-peer",
    subtitle: "leadership connections",
    category: "net-new",
    stage: "Awareness",
    tacticalCredits: "12",
    impactCredits: "12",
    enterpriseCredits: "11",
    customPrice: "12"
  },
  {
    title: "Take your proposition upstream",
    category: "net-new",
    stage: "Awareness",
    tacticalCredits: "12",
    impactCredits: "12",
    enterpriseCredits: "11",
    customPrice: "12"
  },

  // Net-new Target Accounts - Educate
  {
    title: "Build trust",
    subtitle: "with accounts through thought leadership",
    category: "net-new",
    stage: "Educate",
    tacticalCredits: "12",
    impactCredits: "12",
    enterpriseCredits: "11",
    customPrice: "12"
  },
  {
    title: "Changing Perceptions of",
    subtitle: "brand",
    category: "net-new",
    stage: "Educate",
    tacticalCredits: "12",
    impactCredits: "12",
    enterpriseCredits: "11",
    customPrice: "12"
  },
  {
    title: "Demonstrate capabilities",
    subtitle: "through innovation engagement",
    category: "net-new",
    stage: "Educate",
    tacticalCredits: "12",
    impactCredits: "12",
    enterpriseCredits: "11",
    customPrice: "12"
  },
  {
    title: "Competitor differentiation",
    subtitle: "stand out in a crowded market",
    category: "net-new",
    stage: "Educate",
    tacticalCredits: "12",
    impactCredits: "12",
    enterpriseCredits: "11",
    customPrice: "12"
  },
  {
    title: "Build an executive",
    subtitle: "into an industry thought-leader",
    category: "net-new",
    stage: "Educate",
    tacticalCredits: "12",
    impactCredits: "12",
    enterpriseCredits: "11",
    customPrice: "12"
  },
  {
    title: "Multi-threaded",
    subtitle: "mixture of personas to build a business case",
    category: "net-new",
    stage: "Educate",
    tacticalCredits: "12",
    impactCredits: "12",
    enterpriseCredits: "11",
    customPrice: "12"
  },

  // Net-new Target Accounts - Influence
  {
    title: "Expand & penetrate",
    subtitle: "a decision-making unit (DMU)",
    category: "net-new",
    stage: "Influence",
    tacticalCredits: "12",
    impactCredits: "12",
    enterpriseCredits: "11",
    customPrice: "12"
  },
  {
    title: "Influence executive decision-makers",
    category: "net-new",
    stage: "Influence",
    tacticalCredits: "12",
    impactCredits: "12",
    enterpriseCredits: "11",
    customPrice: "12"
  },
  {
    title: "Unlock a stalled deal",
    category: "net-new",
    stage: "Influence",
    tacticalCredits: "12",
    impactCredits: "12",
    enterpriseCredits: "11",
    customPrice: "12"
  },
  {
    title: "Pipeline velocity",
    subtitle: "across open deals",
    category: "net-new",
    stage: "Influence",
    tacticalCredits: "12",
    impactCredits: "12",
    enterpriseCredits: "11",
    customPrice: "12"
  },
  {
    title: "Re-engage closed-lost accounts",
    category: "net-new",
    stage: "Influence",
    tacticalCredits: "12",
    impactCredits: "12",
    enterpriseCredits: "11",
    customPrice: "12"
  },

  // Net-new Target Accounts - Commit (not Convert)
  {
    title: "Deal protection",
    subtitle: "solution handling playbook",
    category: "net-new",
    stage: "Commit",
    tacticalCredits: "12",
    impactCredits: "12",
    enterpriseCredits: "11",
    customPrice: "12"
  },
  {
    title: "Sales enablement",
    subtitle: "towards deal closure",
    category: "net-new",
    stage: "Commit",
    tacticalCredits: "12",
    impactCredits: "12",
    enterpriseCredits: "11",
    customPrice: "12"
  },
  {
    title: "Last-mile",
    subtitle: "solution alignment",
    category: "net-new",
    stage: "Commit",
    tacticalCredits: "12",
    impactCredits: "12",
    enterpriseCredits: "11",
    customPrice: "12"
  },
  {
    title: "Executive value validation",
    category: "net-new",
    stage: "Commit",
    tacticalCredits: "12",
    impactCredits: "12",
    enterpriseCredits: "11",
    customPrice: "12"
  },
  {
    title: "Targeted risk mitigation",
    category: "net-new",
    stage: "Commit",
    tacticalCredits: "12",
    impactCredits: "12",
    enterpriseCredits: "11",
    customPrice: "12"
  },

  // Customer Growth - Adoption
  {
    title: "Increase adoption of solutions",
    subtitle: "from untapped teams",
    category: "customer-growth",
    stage: "Adoption",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8"
  },
  {
    title: "Build internal advocacy & champions",
    category: "customer-growth",
    stage: "Adoption",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8"
  },
  {
    title: "Delivering additional value for user enablement",
    category: "customer-growth",
    stage: "Adoption",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8"
  },
  {
    title: "Build executive alignment",
    subtitle: "to strengthen partnerships",
    category: "customer-growth",
    stage: "Adoption",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8"
  },

  // Customer Growth - Expansion
  {
    title: "Cross-sell into new lines of business",
    category: "customer-growth",
    stage: "Expansion",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8"
  },
  {
    title: "Upsell complementary adjacent solutions",
    category: "customer-growth",
    stage: "Expansion",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8"
  },
  {
    title: "Introduce new solutions",
    subtitle: "into existing accounts",
    category: "customer-growth",
    stage: "Expansion",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8"
  },
  {
    title: "Develop expansion partnerships",
    subtitle: "for strategic growth",
    category: "customer-growth",
    stage: "Expansion",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8"
  },

  // Customer Growth - Retention
  {
    title: "Grow renewal potential pipeline",
    category: "customer-growth",
    stage: "Retention",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8"
  },
  {
    title: "Renewal risk mitigation",
    category: "customer-growth",
    stage: "Retention",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8"
  },
  {
    title: "Defend against competitor activity",
    category: "customer-growth",
    stage: "Retention",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8"
  },
  {
    title: "Wake the dead",
    subtitle: "re-engage dormant accounts",
    category: "customer-growth",
    stage: "Retention",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8"
  },
  {
    title: "Recover a strategically important relationship",
    category: "customer-growth",
    stage: "Retention",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8"
  },

  // Customer Growth - Advocacy
  {
    title: "Showcase key customer partnerships",
    category: "customer-growth",
    stage: "Advocacy",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8"
  },
  {
    title: "Generate case studies and testimonials",
    category: "customer-growth",
    stage: "Advocacy",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8"
  },
  {
    title: "Create referral opportunities",
    category: "customer-growth",
    stage: "Advocacy",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8"
  }
];

interface PlaybooksNetflixLayoutProps {
  items: any[];
  quantities: Record<string, number>;
  onQuantityChange: (id: string, quantity: number) => void;
  selectedCurrency: string;
  currencyRate: number;
}

const PlaybooksNetflixLayout: React.FC<PlaybooksNetflixLayoutProps> = ({
  items,
  quantities,
  onQuantityChange,
  selectedCurrency,
  currencyRate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNetNewStage, setActiveNetNewStage] = useState<string | null>(null);
  const [activeCustomerGrowthStage, setActiveCustomerGrowthStage] = useState<string | null>(null);
  
  // Filter playbooks based on search query
  const filteredPlaybooks = ALL_PLAYBOOKS.filter(playbook => 
    playbook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (playbook.subtitle && playbook.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
    playbook.stage.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Group playbooks by category and stage
  const netNewPlaybooks = filteredPlaybooks.filter(p => p.category === 'net-new');
  const customerGrowthPlaybooks = filteredPlaybooks.filter(p => p.category === 'customer-growth');

  // Filter playbooks by active stage (or show all if no stage is selected)
  const filteredNetNewPlaybooks = activeNetNewStage 
    ? netNewPlaybooks.filter(p => p.stage === activeNetNewStage)
    : netNewPlaybooks;
    
  const filteredCustomerGrowthPlaybooks = activeCustomerGrowthStage 
    ? customerGrowthPlaybooks.filter(p => p.stage === activeCustomerGrowthStage)
    : customerGrowthPlaybooks;

  // Create a modified title that includes the subtitle if present
  const getTitleWithSubtitle = (playbook: Playbook) => {
    if (playbook.subtitle) {
      return `${playbook.title} ${playbook.subtitle}`;
    }
    return playbook.title;
  };

  // Reset filters to show all playbooks
  const showAllPlaybooks = () => {
    setActiveNetNewStage(null);
    setActiveCustomerGrowthStage(null);
  };

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search playbooks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-800/50 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Net-New Target Accounts Section */}
      {netNewPlaybooks.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-8">
            <div className="w-1.5 h-12 mr-4 bg-white"></div>
            <h2 className="text-xl font-bold text-white">Net-new target accounts</h2>
          </div>
          
          <div className="flex mb-6 space-x-4 overflow-x-auto pb-2">
            <button 
              className={`px-4 py-2 rounded-lg text-white font-medium transition-colors duration-300 text-base ${activeNetNewStage === null ? 'bg-gray-600' : 'bg-gray-800/80'}`}
              onClick={showAllPlaybooks}
            >
              Show All
            </button>
            {NET_NEW_STAGES.map(stage => (
              <button 
                key={stage} 
                className={`px-4 py-2 rounded-lg text-white font-medium transition-colors duration-300 text-base`}
                style={{ 
                  backgroundColor: stageColors[stage], 
                  opacity: activeNetNewStage === stage ? 1 : 0.75 
                }}
                onClick={() => setActiveNetNewStage(stage)}
              >
                {stage}
              </button>
            ))}
          </div>
          
          {/* Display playbooks */}
          <div>
            {activeNetNewStage ? (
              <div className="flex items-center mb-4 mt-10">
                <div className="w-1 h-8 mr-3" style={{ backgroundColor: stageColors[activeNetNewStage] }}></div>
                <h3 className="text-lg font-medium text-white">{activeNetNewStage}</h3>
              </div>
            ) : (
              NET_NEW_STAGES.map(stage => {
                const stagePlaybooks = filteredNetNewPlaybooks.filter(p => p.stage === stage);
                if (stagePlaybooks.length > 0) {
                  return (
                    <div key={stage} className="mb-12">
                      <div className="flex items-center mb-4 mt-10">
                        <div className="w-1 h-8 mr-3" style={{ backgroundColor: stageColors[stage] }}></div>
                        <h3 className="text-lg font-medium text-white">{stage}</h3>
                      </div>
                      
                      {stagePlaybooks.map(playbook => {
                        const id = playbook.title.toLowerCase().replace(/\s+/g, '-');
                        return (
                          <div key={`${playbook.title}-${playbook.subtitle || ''}`} className="flex mb-2">
                            <div className="w-1 mr-2" style={{ backgroundColor: stageColors[playbook.stage] }}></div>
                            <div className="flex-grow">
                              <InsightItem
                                id={id}
                                title={getTitleWithSubtitle(playbook)}
                                customPrice={playbook.customPrice}
                                tacticalCredits={playbook.tacticalCredits}
                                impactCredits={playbook.impactCredits}
                                enterpriseCredits={playbook.enterpriseCredits}
                                quantity={quantities[id] || 0}
                                onQuantityChange={onQuantityChange}
                                selectedCurrency={selectedCurrency}
                                currencyRate={currencyRate}
                                showDelivery={false}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }
                return null;
              })
            )}

            {activeNetNewStage && filteredNetNewPlaybooks.map(playbook => {
              const id = playbook.title.toLowerCase().replace(/\s+/g, '-');
              return (
                <div key={`${playbook.title}-${playbook.subtitle || ''}`} className="flex mb-2">
                  <div className="w-1 mr-2" style={{ backgroundColor: stageColors[playbook.stage] }}></div>
                  <div className="flex-grow">
                    <InsightItem
                      id={id}
                      title={getTitleWithSubtitle(playbook)}
                      customPrice={playbook.customPrice}
                      tacticalCredits={playbook.tacticalCredits}
                      impactCredits={playbook.impactCredits}
                      enterpriseCredits={playbook.enterpriseCredits}
                      quantity={quantities[id] || 0}
                      onQuantityChange={onQuantityChange}
                      selectedCurrency={selectedCurrency}
                      currencyRate={currencyRate}
                      showDelivery={false}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Customer Growth Accounts Section */}
      {customerGrowthPlaybooks.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-8">
            <div className="w-1.5 h-12 mr-4 bg-white"></div>
            <h2 className="text-xl font-bold text-white">Customer growth accounts</h2>
          </div>
          
          <div className="flex mb-6 space-x-4 overflow-x-auto pb-2">
            <button 
              className={`px-4 py-2 rounded-lg text-white font-medium transition-colors duration-300 text-base ${activeCustomerGrowthStage === null ? 'bg-gray-600' : 'bg-gray-800/80'}`}
              onClick={showAllPlaybooks}
            >
              Show All
            </button>
            {CUSTOMER_GROWTH_STAGES.map(stage => (
              <button 
                key={stage} 
                className={`px-4 py-2 rounded-lg text-white font-medium transition-colors duration-300 text-base`}
                style={{ 
                  backgroundColor: stageColors[stage], 
                  opacity: activeCustomerGrowthStage === stage ? 1 : 0.75 
                }}
                onClick={() => setActiveCustomerGrowthStage(stage)}
              >
                {stage}
              </button>
            ))}
          </div>
          
          {/* Display playbooks */}
          <div>
            {activeCustomerGrowthStage ? (
              <div className="flex items-center mb-4 mt-10">
                <div className="w-1 h-8 mr-3" style={{ backgroundColor: stageColors[activeCustomerGrowthStage] }}></div>
                <h3 className="text-lg font-medium text-white">{activeCustomerGrowthStage}</h3>
              </div>
            ) : (
              CUSTOMER_GROWTH_STAGES.map(stage => {
                const stagePlaybooks = filteredCustomerGrowthPlaybooks.filter(p => p.stage === stage);
                if (stagePlaybooks.length > 0) {
                  return (
                    <div key={stage} className="mb-12">
                      <div className="flex items-center mb-4 mt-10">
                        <div className="w-1 h-8 mr-3" style={{ backgroundColor: stageColors[stage] }}></div>
                        <h3 className="text-lg font-medium text-white">{stage}</h3>
                      </div>
                      
                      {stagePlaybooks.map(playbook => {
                        const id = playbook.title.toLowerCase().replace(/\s+/g, '-');
                        return (
                          <div key={`${playbook.title}-${playbook.subtitle || ''}`} className="flex mb-2">
                            <div className="w-1 mr-2" style={{ backgroundColor: stageColors[playbook.stage] }}></div>
                            <div className="flex-grow">
                              <InsightItem
                                id={id}
                                title={getTitleWithSubtitle(playbook)}
                                customPrice={playbook.customPrice}
                                tacticalCredits={playbook.tacticalCredits}
                                impactCredits={playbook.impactCredits}
                                enterpriseCredits={playbook.enterpriseCredits}
                                quantity={quantities[id] || 0}
                                onQuantityChange={onQuantityChange}
                                selectedCurrency={selectedCurrency}
                                currencyRate={currencyRate}
                                showDelivery={false}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }
                return null;
              })
            )}

            {activeCustomerGrowthStage && filteredCustomerGrowthPlaybooks.map(playbook => {
              const id = playbook.title.toLowerCase().replace(/\s+/g, '-');
              return (
                <div key={`${playbook.title}-${playbook.subtitle || ''}`} className="flex mb-2">
                  <div className="w-1 mr-2" style={{ backgroundColor: stageColors[playbook.stage] }}></div>
                  <div className="flex-grow">
                    <InsightItem
                      id={id}
                      title={getTitleWithSubtitle(playbook)}
                      customPrice={playbook.customPrice}
                      tacticalCredits={playbook.tacticalCredits}
                      impactCredits={playbook.impactCredits}
                      enterpriseCredits={playbook.enterpriseCredits}
                      quantity={quantities[id] || 0}
                      onQuantityChange={onQuantityChange}
                      selectedCurrency={selectedCurrency}
                      currencyRate={currencyRate}
                      showDelivery={false}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No results message */}
      {filteredPlaybooks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No playbooks found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default PlaybooksNetflixLayout;
