import React, { useState } from 'react';
import { ChevronDown, Check, Info } from 'lucide-react';
import { useCurrency, CURRENCY_CONFIG } from './config/currency';
import { CurrencySelector } from './components/CurrencySelector';
import { InvoiceSummary } from './components/InvoiceSummary';
import PlaybooksNetflixLayout, { ALL_PLAYBOOKS } from './components/PlaybooksNetflixLayout';
import './styles/invoice-print.css';

//import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const QuantitySelector = ({ value, onChange, max = 99 }) => {
  return (
    <div className="inline-flex items-center bg-gray-800/50 rounded-md">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="px-1.5 py-0.5 hover:bg-gray-700/50 text-gray-400 text-xs rounded-l bg-gray-800/50 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={value === 0}
      >
        -
      </button>
      <input
        type="number"
        min="0"
        max={max}
        value={value}
        onChange={(e) => {
          const newValue = parseInt(e.target.value);
          if (!isNaN(newValue) && newValue >= 0 && newValue <= max) {
            onChange(newValue);
          }
        }}
        className="w-8 bg-transparent text-center text-gray-300 text-xs focus:outline-none focus:ring-0 focus:border-none"
      />
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="px-1.5 py-0.5 hover:bg-gray-700/50 text-gray-400 text-xs rounded-r bg-gray-800/50 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={value === max}
      >
        +
      </button>
    </div>
  );
};

const panelDescriptions = {
  "Foundations": "Custom ABM programmes & individual strategic deliverables tailored to your specific needs, setting the foundations for scale and time to market goals.",
  "Insights": "On-demand market, account and stakeholder intelligence forming the foundations for scale and personalised messaging.",
  "Content": "Hyper-personalised content designed to solve the relationship needs of your most important accounts, delivered for approval within 72hrs to 96hrs.",
  "Training": "Comprehensive ABM training modules covering the full spectrum of account-based marketing—from foundational concepts to advanced optimization techniques. Each module combines strategic frameworks with practical implementation guidance.",
  "Pricing Features": "Compare and contrast our custom vs credits-based pricing models, both designed to offer clients the speed, scale, and agility needed to support the ever-evolving demands of account-based sales and marketing teams.",
  "Playbooks": "Sprint-based playbooks that map to buyer journeys, delivering quantifiable micro-outcomes through personalized content and activation plans. Built for agility and rapid deployment."
};

const panelCaveats = {
  "Foundations": "",
  "Pricing Features": "",
  "Insights Credits": "",
  "Personalized Content Credits": "*requires existing cluster manifesto",
  "Playbook Credits": "Excludes activation",
  "In-house ABM Training Credits": ""
}

const itemGroups = {
  insights: [
    { title: "Market Insights", credits: "8", customPrice: "9.5" },
    { title: "Account Insights", credits: "2", customPrice: "2.5" },
    { title: "Stakeholder Deepdive Insights", credits: "7", customPrice: "7.5" },
    { title: "Stakeholder Tactical Insights", credits: "2", customPrice: "2.5" }
  ],
  engagement: [
    { title: "Cluster Manifesto", credits: "7", customPrice: "7.5" },
    { title: "Account Manifesto", credits: "2", customPrice: "2.5" },
    { title: "Stakeholder Manifesto", credits: "2", customPrice: "2.5" },
    { title: "Annotated Report", credits: "5.5", customPrice: "6" }
  ],
  revenue: [
    { title: "Executive Briefing", credits: "6.5", customPrice: "7.5" }
  ],
  training: [
    { title: "How to set ABM Programme Objectives", tacticalCredits: "3", impactCredits: "3", enterpriseCredits: "2.5", customPrice: "3" },
    { title: "How to improve Sales & Marketing Alignment", tacticalCredits: "3", impactCredits: "3", enterpriseCredits: "2.5", customPrice: "3" },
    { title: "Developing Account Selection & Prioritisation Frameworks", tacticalCredits: "7", impactCredits: "7", enterpriseCredits: "6", customPrice: "7" },
    { title: "An introduction to ABM Value Proposition Development", tacticalCredits: "3", impactCredits: "3", enterpriseCredits: "2.5", customPrice: "3" },
    { title: "An introduction to Account-based Reporting & Measurement", tacticalCredits: "3", impactCredits: "3", enterpriseCredits: "2.5", customPrice: "3" },
    { title: "An introduction to Social Selling", tacticalCredits: "3", impactCredits: "3", enterpriseCredits: "2.5", customPrice: "3" }
  ]
};

const Panel = ({title, children, defaultExpanded = false}) => {
  const isCreditsPanel = title.toString().toLowerCase().includes('credits');
  const isVideoPanel = title.toString().toLowerCase().includes('discover abm');
  
  const getPanelBackground = () => {
    if (isVideoPanel) return 'bg-gradient-to-b from-gray-900 to-gray-950';
    if (isCreditsPanel) return 'bg-gradient-to-b from-gray-900/70 to-gray-950/70';
    return 'bg-gradient-to-b from-gray-900/40 to-gray-950/40';
  };
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  return (
    <div className={`backdrop-blur-sm rounded-lg mb-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] border-t-2 border-t-orange-600/20 border border-gray-800/80 hover:border-orange-600/30 transition-all duration-300 hover:shadow-[0_25px_65px_-5px_rgba(233,90,12,0.25)] ${getPanelBackground()}`}>
      <div 
        className={`sticky top-[150px] px-6 py-5 backdrop-blur-sm border-b border-gray-800/80 flex justify-between items-center cursor-pointer z-10 rounded-t-lg shadow-[0_10px_20px_-5px_rgba(0,0,0,0.7)] ${getPanelBackground().replace('to-b', 'to-r')}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg tracking-wide">
          {title}
        </h3>
        <ChevronDown className={`w-6 h-6 text-gray-400 transform duration-300 ${isExpanded ? '' : '-rotate-90'}`}/>
      </div>
      {isExpanded && (
          <div className="p-8 bg-gradient-to-b from-gray-900/95 to-gray-950">
            <p className="text-gray-400 text-sm mb-8">{panelDescriptions[title]}</p>
            {children}
            {panelCaveats[title] && (
            <div className="p-5 mt-6 bg-gray-900/80 rounded-lg border border-gray-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.35)]">
              <p className="text-gray-400 text-sm">{panelCaveats[title]}</p>
            </div>
            )}
          </div>
        )}
    </div>
  );
};

const ComparisonRow = ({feature, subtitle, values }) => (
  <div className="contents group">
    <div className="w-full">
      {feature && (
        <div className="font-medium text-sm text-white py-3 pl-6 bg-gray-800/80">
          {feature}
        </div>
      )}
      <div className={`grid grid-cols-[minmax(200px,1fr)_1fr_1fr_1fr_1fr] items-center py-3`}>
        <div className="text-xs text-gray-400 pl-6">{subtitle}</div>
        <div className="flex justify-center">
          {typeof values.custom === 'string' ? (
            <div className="text-xs text-gray-400 text-center">{values.custom}</div>
          ) : (
            values.custom ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <span className="text-gray-400 text-xs">-</span>
            )
          )}
        </div>
        <div className="flex justify-center">
          {typeof values.tactical === 'string' ? (
            <div className="text-xs text-gray-400 text-center">{values.tactical}</div>
          ) : (
            values.tactical ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <span className="text-gray-400 text-xs">-</span>
            )
          )}
        </div>
        <div className="flex justify-center">
          {typeof values.impact === 'string' ? (
            <div className="text-xs text-gray-400 text-center">{values.impact}</div>
          ) : (
            values.impact ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <span className="text-gray-400 text-xs">-</span>
            )
          )}
        </div>
        <div className="flex justify-center">
          {typeof values.enterprise === 'string' ? (
            <div className="text-xs text-gray-400 text-center">{values.enterprise}</div>
          ) : (
            values.enterprise ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <span className="text-gray-400 text-xs">-</span>
            )
          )}
        </div>
      </div>
    </div>
  </div>
);

const TotalCredits = ({ total, description, selectedCurrency, currencyRate }) => (
  <div className="grid grid-cols-[minmax(200px,1fr)_1fr_1fr_1fr_1fr] mb-6">
    <div className="col-span-4">
      <p className="text-gray-400 text-sm pr-4">{description}</p>
    </div>
    <div className="p-3 bg-gray-800/50 rounded-lg">
      <div className="text-gray-300 text-sm text-center">
        Total Credits: <span className="text-green-500 font-bold">{total}</span>
      </div>
    </div>
  </div>
);

const FoundationsPanel = ({ items, quantities, onQuantityChange, selectedCurrency, currencyRate }) => {

  const totalCredits = Object.entries(quantities).reduce((total, [id, quantity]) => {
    const item = items.find(item => 
      id === item.title.toLowerCase().replace(/\s+/g, '-')
    );
    return total + (item ? parseFloat(item.tacticalCredits) * quantity : 0);
  }, 0);

  return (
    <div>
      <TotalCredits 
        total={totalCredits} 
        description={panelDescriptions["Foundations"]} 
        selectedCurrency={selectedCurrency}
        currencyRate={currencyRate}
      />
      {items.map((item, i) => (
        <InsightItem
          key={i}
          id={item.title.toLowerCase().replace(/\s+/g, '-')}
          title={item.title}
          customPrice={item.customPrice}
          tacticalCredits={item.tacticalCredits}
          impactCredits={item.impactCredits}
          enterpriseCredits={item.enterpriseCredits}
          quantity={quantities[item.title.toLowerCase().replace(/\s+/g, '-')] || 0}
          onQuantityChange={onQuantityChange}
          showDelivery={false}
          selectedCurrency={selectedCurrency}
          currencyRate={currencyRate}
        />
      ))}
    </div>
  );
};

const ContentPanel = ({ engagementItems, revenueItems, quantities, onQuantityChange, selectedCurrency, currencyRate }) => {

  const calculateTotal = (items) => {
    return Object.entries(quantities).reduce((total, [id, quantity]) => {
      const item = items.find(item => 
        id === item.title.toLowerCase().replace(/\s+/g, '-')
      );
      return total + (item ? parseFloat(item.tacticalCredits) * quantity : 0);
    }, 0);
  };

  const totalCredits = calculateTotal([...engagementItems, ...revenueItems]);

  const renderItems = (items, title) => (
    <div className="mb-8">
      <h4 className="text-lg mb-4" style={{ color: '#e95a0c' }}>{title}</h4>
      {items.map((item, i) => (
        <InsightItem
          key={i}
          id={item.title.toLowerCase().replace(/\s+/g, '-')}
          title={item.title}
          customPrice={item.customPrice}
          tacticalCredits={item.tacticalCredits}
          impactCredits={item.impactCredits}
          enterpriseCredits={item.enterpriseCredits}
          quantity={quantities[item.title.toLowerCase().replace(/\s+/g, '-')] || 0}
          onQuantityChange={onQuantityChange}
          selectedCurrency={selectedCurrency}
          currencyRate={currencyRate}
        />
      ))}
    </div>
  );

  return (
    <div>
      <TotalCredits 
        total={totalCredits} 
        description={panelDescriptions["Content"]} 
        selectedCurrency={selectedCurrency}
        currencyRate={currencyRate}
      />
      {renderItems(engagementItems, "Engagement Content")}
      {renderItems(revenueItems, "Revenue Content")}
    </div>
  );
};

const TrainingPanel = ({ items, quantities, onQuantityChange, selectedCurrency, currencyRate }) => {

  const totalCredits = Object.entries(quantities).reduce((total, [id, quantity]) => {
    const item = items.find(item => 
      id === item.title.toLowerCase().replace(/\s+/g, '-')
    );
    return total + (item ? parseFloat(item.tacticalCredits) * quantity : 0);
  }, 0);

  return (
    <div>
      <TotalCredits 
        total={totalCredits} 
        description={panelDescriptions["Training"]} 
        selectedCurrency={selectedCurrency}
        currencyRate={currencyRate}
      />
      {items.map((item, i) => (
        <InsightItem
          key={i}
          id={item.title.toLowerCase().replace(/\s+/g, '-')}
          title={item.title}
          customPrice={item.customPrice}
          tacticalCredits={item.tacticalCredits}
          impactCredits={item.impactCredits}
          enterpriseCredits={item.enterpriseCredits}
          quantity={quantities[item.title.toLowerCase().replace(/\s+/g, '-')] || 0}
          onQuantityChange={onQuantityChange}
          showDelivery={false}
          selectedCurrency={selectedCurrency}
          currencyRate={currencyRate}
        />
      ))}
    </div>
  );
};

const PlaybooksPanel = ({ quantities, onQuantityChange, selectedCurrency, currencyRate }) => {
  const items = ITEM_GROUPS.revenue;

  const totalCredits = Object.entries(quantities).reduce((total, [id, quantity]) => {
    const item = items.find(item => 
      id === item.title.toLowerCase().replace(/\s+/g, '-')
    );
    return total + (item ? parseFloat(item.tacticalCredits) * quantity : 0);
  }, 0);

  return (
    <div>
      <TotalCredits 
        total={totalCredits} 
        description={panelDescriptions["Playbooks"]} 
        selectedCurrency={selectedCurrency}
        currencyRate={currencyRate}
      />
      <PlaybooksNetflixLayout
        items={items}
        quantities={quantities}
        onQuantityChange={onQuantityChange}
        selectedCurrency={selectedCurrency}
        currencyRate={currencyRate}
      />
    </div>
  );
};

const InsightsPanel = ({ items, quantities, onQuantityChange, selectedCurrency, currencyRate }) => {

  const totalCredits = Object.entries(quantities).reduce((total, [id, quantity]) => {
    const item = items.find(item => 
      id === item.title.toLowerCase().replace(/\s+/g, '-')
    );
    return total + (item ? parseFloat(item.tacticalCredits) * quantity : 0);
  }, 0);

  return (
    <div>
      <TotalCredits 
        total={totalCredits} 
        description={panelDescriptions["Insights"]} 
        selectedCurrency={selectedCurrency}
        currencyRate={currencyRate}
      />
      {items.map((item, i) => (
        <InsightItem
          key={i}
          id={item.title.toLowerCase().replace(/\s+/g, '-')}
          title={item.title}
          customPrice={item.customPrice}
          tacticalCredits={item.tacticalCredits}
          impactCredits={item.impactCredits}
          enterpriseCredits={item.enterpriseCredits}
          quantity={quantities[item.title.toLowerCase().replace(/\s+/g, '-')] || 0}
          onQuantityChange={onQuantityChange}
          selectedCurrency={selectedCurrency}
          currencyRate={currencyRate}
        />
      ))}
    </div>
  );
};

const VideoEmbed = ({ embedCode = '' }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Only load script if we have embed code
    if (!embedCode) return;

    const script = document.createElement('script');
    script.src = 'https://play.vidyard.com/embed/v4.js';
    script.async = true;
    script.type = 'text/javascript';

    // Add event listener to know when script is loaded
    script.onload = () => {
      // Force Vidyard to scan for players
      if (window.VidyardV4?.api?.renderDOMPlayers) {
        window.VidyardV4.api.renderDOMPlayers();
      }
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [embedCode]);

  return (
    <div 
      ref={containerRef}
      className="aspect-video relative bg-gray-950 mb-6 rounded-lg overflow-hidden border border-gray-800/80"
      style={{ minHeight: '400px' }}
    >
      {embedCode ? (
        <div className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          <div 
            className="w-full h-full"
            style={{ pointerEvents: 'auto' }}
            dangerouslySetInnerHTML={{ __html: embedCode }} 
          />
        </div>
      ) : (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-950 text-gray-600">
          <span>Add your Vidyard embed code here</span>
        </div>
      )}
    </div>
  );
};

// Item descriptions mapping
export const itemDescriptions = {
  // Foundations
  "Account Selection": "Identify and prioritize target accounts based on fit, intent, and opportunity size.",
  "Account Segmentation/Prioritisation": "Segment accounts into tiers based on strategic value and engagement potential.",
  "ABM Value Proposition Development": "Create compelling, account-specific value propositions that resonate with decision-makers.",
  "ABM Readiness Workshops": "Interactive sessions to assess and enhance your organization's ABM readiness.",
  "Synthetic Audiences": "Build custom audience profiles for precise targeting and personalization.",
  
  // Insights
  "Market Insights": "Deep-dive analysis of market trends, competitive landscape, and industry dynamics.",
  "Account Insights": "Detailed account profiling including business challenges, tech stack, and buying patterns.",
  "Stakeholder Deepdive Insights": "Comprehensive analysis of key decision-makers and their priorities.",
  "Stakeholder Tactical Insights": "Actionable insights on stakeholder engagement preferences and triggers.",
  
  // Content items
  "Cluster Manifesto": "Our cluster manifesto is designed to drive strategic awareness and engagement within a new industry or market segment by targeting high-value accounts with customised content & tailored messaging.",
  "Account Manifesto": "Our Account Manifesto is personalised to target accounts using account-level insights, establishing market differentiation by showcasing innovative solutions and thought leadership while shifting outdated perceptions.",
  "Stakeholder Manifesto": "Our Stakeholder Manifesto is personalised to specific decision-makers using stakeholder-level insights, establishing individual relevance by showcasing solutions aligned to personal priorities while addressing role-specific challenges and objectives.",
  "Annotated Report": "Our Annotated Report provides strategic analysis of a target account's public statements and priorities, highlighting specific alignment opportunities with your solutions. By extracting key themes from annual reports and official communications, we deliver actionable insights that enable precise messaging and value proposition development tailored to the account's stated business objectives and technology initiatives.",
  "Executive Briefing": "Our Executive Briefing is a highly personalised content asset designed to engage and build credibility with C-suite and senior executives within target accounts by delivering strategic insights and tailored value propositions aligned with their business priorities.",
  "Account Roadmap": "Strategic engagement plan mapping key touchpoints and milestones.",
  "ABM Roadmap": "This personalised content asset focuses on accelerating deal progression through targeted engagement and barrier removal.",
  
  // Training
  "How to set ABM Programme Objectives": "This interactive workshop guides participants through setting clear success metrics, defining strategic goals, and aligning business priorities to build a strong ABM foundation.",
  "How to improve Sales & Marketing Alignment": "A hands-on workshop providing actionable frameworks to improve sales and marketing alignment. In-house ABMers will learn to support multiple sales and commercial stakeholders, develop shared account intelligence, and align on commercial priorities by identifying best next-step actions for priority accounts.",
  "Developing Account Selection & Prioritisation Frameworks": "A practical workshop on building a structured framework to segment and prioritise high-value accounts, ensuring ABM efforts are focused on the right opportunities.",
  "An introduction to ABM Value Proposition Development": "This workshop focuses on developing compelling value propositions and strategic narratives that align with key decision-makers' needs. Learn the critical differences between brand, segment, account, stakeholder and deal-based value propositions and when to apply each approach for maximum impact.",
  "An introduction to Account-based Reporting & Measurement": "This workshop provides participants with best practices for tracking key ABM metrics, measuring engagement, and refining strategies using real-time data insights. Learn how to develop best practice account-based dashboards that provide actionable next step recommendations and effectively quantify campaign outcomes.",
  "An introduction to Social Selling": "Understand the fundamentals of social selling, its role in modern B2B sales, and how it differs from traditional selling models. Learn how to build a compelling personal brand and grow your network authentically."
};

export const InsightItem = ({ 
  id, 
  title, 
  customPrice, 
  tacticalCredits, 
  impactCredits, 
  enterpriseCredits, 
  showDelivery = true, 
  quantity = 0, 
  onQuantityChange, 
  selectedCurrency, 
  currencyRate,
  description
}) => (
  <div className="bg-gray-800/30 rounded mb-4 last:mb-0">
    <div className="p-3 border-b border-gray-700/50 bg-gray-900">
      <div className="text-gray-300 text-sm">
        {title.split(' (')[0]}
        {title.includes('(') && (
          <div className="text-gray-400 text-xs mt-1">
            {title.split('(')[1].replace(')', '')}
          </div>
        )}
        {description && (
          <div className="text-gray-400 text-xs mt-2">
            {description}
          </div>
        )}
        {!description && itemDescriptions[title.split(' (')[0]] && (
          <div className="text-gray-400 text-xs mt-2">
            {itemDescriptions[title.split(' (')[0]]}
          </div>
        )}
      </div>
    </div>
    <div className="p-3">
      <div className="grid grid-cols-[minmax(200px,1fr)_1fr_1fr_1fr_1fr] items-center">
        <div className="flex justify-start pl-4">
          <QuantitySelector
            value={quantity}
            onChange={(value) => onQuantityChange?.(id, value)}
          />
        </div>
        <div className="text-gray-400 text-xs text-center">
          {customPrice === '£-k' ? customPrice :
            (() => {
              let price = parseFloat(customPrice);
              if (isNaN(price)) {
                return '£-k';
              }
              
              const symbol = selectedCurrency === 'GBP' ? '£' : selectedCurrency === 'EUR' ? '€' : '$';
              const final = `${symbol}${(price * currencyRate).toFixed(1)}k`;
              return final;
            })()
          }
        </div>
        <div className="text-center">
          <div className="text-green-500 text-sm text-center">{tacticalCredits} credits</div>
        </div>
        <div className="text-center">
          <div className="text-green-500 text-sm text-center">{impactCredits} credits</div>
        </div>
        <div className="text-center">
          <div className="text-green-500 text-sm text-center">{enterpriseCredits} credits</div>
        </div>
      </div>
    </div>
  </div>
);

const ContentSection = ({ title, items }) => (
  <div className="mb-8 last:mb-0">
    <h4 className="text-xl mb-4" style={{ color: '#e95a0c' }}>{title}</h4>
    {items.map((item, i) => <InsightItem key={i} {...item} />)}
  </div>
);

// Define static data first
const FOUNDATION_ITEMS = [
  { title: "Account Selection", tacticalCredits: "3.5", impactCredits: "3.5", enterpriseCredits: "2.5", customPrice: "3.5" },
  { title: "Account Segmentation/Prioritisation", tacticalCredits: "3.5", impactCredits: "3.5", enterpriseCredits: "2.5", customPrice: "3.5" },
  { title: "ABM Value Proposition Development", tacticalCredits: "12", impactCredits: "12", enterpriseCredits: "11", customPrice: "12" },
  { title: "ABM Readiness Workshops", tacticalCredits: "8", impactCredits: "8", enterpriseCredits: "7", customPrice: "8" },
  { title: "Synthetic Audiences", tacticalCredits: "21", impactCredits: "21", enterpriseCredits: "20", customPrice: "21" }
];

const ITEM_GROUPS = {
  foundations: FOUNDATION_ITEMS,
  insights: [
    { title: "Market Insights", tacticalCredits: "8", impactCredits: "8", enterpriseCredits: "7", customPrice: "8" },
    { title: "Account Insights", tacticalCredits: "2", impactCredits: "2", enterpriseCredits: "1", customPrice: "2" },
    { title: "Stakeholder Deepdive Insights", tacticalCredits: "7", impactCredits: "7", enterpriseCredits: "6", customPrice: "7" },
    { title: "Stakeholder Tactical Insights", tacticalCredits: "2", impactCredits: "2", enterpriseCredits: "1", customPrice: "2" }
  ],
  engagement: [
    { title: "Cluster Manifesto", tacticalCredits: "7", impactCredits: "7", enterpriseCredits: "6", customPrice: "7" },
    { title: "Account Manifesto", tacticalCredits: "2", impactCredits: "2", enterpriseCredits: "1", customPrice: "2" },
    { title: "Stakeholder Manifesto", tacticalCredits: "2", impactCredits: "2", enterpriseCredits: "1", customPrice: "2" },
    { title: "Annotated Report", tacticalCredits: "5.5", impactCredits: "5.5", enterpriseCredits: "4.5", customPrice: "5.5" }
  ],
  revenueContent: [
    { title: "Executive Briefing", tacticalCredits: "7", impactCredits: "7", enterpriseCredits: "6", customPrice: "7" },
    { title: "ABM Roadmap", tacticalCredits: "7", impactCredits: "7", enterpriseCredits: "6", customPrice: "7" }
  ],
  revenue: [
    { title: "Custom Playbook Design", tacticalCredits: "12", impactCredits: "12", enterpriseCredits: "11", customPrice: "12" },
    { title: "Engagement Playbooks", tacticalCredits: "27", impactCredits: "27", enterpriseCredits: "26", customPrice: "27" },
    { title: "Revenue Playbooks", tacticalCredits: "8", impactCredits: "8", enterpriseCredits: "7", customPrice: "8" }
  ],
  training: [
    { title: "How to set ABM Programme Objectives", tacticalCredits: "3", impactCredits: "3", enterpriseCredits: "2.5", customPrice: "3" },
    { title: "How to improve Sales & Marketing Alignment", tacticalCredits: "3", impactCredits: "3", enterpriseCredits: "2.5", customPrice: "3" },
    { title: "Developing Account Selection & Prioritisation Frameworks", tacticalCredits: "7", impactCredits: "7", enterpriseCredits: "6", customPrice: "7" },
    { title: "An introduction to ABM Value Proposition Development", tacticalCredits: "3", impactCredits: "3", enterpriseCredits: "2.5", customPrice: "3" },
    { title: "An introduction to Account-based Reporting & Measurement", tacticalCredits: "3", impactCredits: "3", enterpriseCredits: "2.5", customPrice: "3" },
    { title: "An introduction to Social Selling", tacticalCredits: "3", impactCredits: "3", enterpriseCredits: "2.5", customPrice: "3" }
  ]
};

export default function ABMTiers() {
  const [customPrice, setCustomPrice] = useState('Custom');
  const [quantities, setQuantities] = useState({});
  const [selectedTier, setSelectedTier] = useState('Tactical ABM');
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(true);

  const { selectedCurrency, handleCurrencyChange, formatPrice } = useCurrency();

  const tiers = ['Custom SOW', 'Tactical ABM', 'Impact ABM', 'Enterprise ABM'];
  
  // Calculate totals for each tier
  const tierTotals = {
    'Custom SOW': 0,
    'Tactical ABM': 30,
    'Impact ABM': 45,
    'Enterprise ABM': 60
  };

  const getTierDisplayValue = (tier) => {
    if (tier === 'Custom SOW') return 0;
    return tier === 'Tactical ABM' ? 30 : tier === 'Impact ABM' ? 45 : 60;
  };

  const tierCredits = {
    'Custom SOW': '',
    'Tactical ABM': '30',
    'Impact ABM': '50',
    'Enterprise ABM': '70'
  };

  const handleQuantityChange = (id, value) => {
    setQuantities(prev => ({ ...prev, [id]: value }));
  };

  const calculateTotals = () => {
    let credits = 0;
    let cost = 0;
    
    console.log('Starting calculations with quantities:', quantities);
    
    // Add up quantities * credits for each panel
    Object.entries(quantities).forEach(([id, quantity]) => {
      console.log('\nCalculating for item:', id, 'quantity:', quantity);
      
      // Find matching item across all item groups
      let item = FOUNDATION_ITEMS.find(item => id === item.title.toLowerCase().replace(/\s+/g, '-'));
      if (!item) item = ITEM_GROUPS.insights.find(item => id === item.title.toLowerCase().replace(/\s+/g, '-'));
      if (!item) item = [...ITEM_GROUPS.engagement, ...ITEM_GROUPS.revenueContent].find(item => id === item.title.toLowerCase().replace(/\s+/g, '-'));
      if (!item) item = ITEM_GROUPS.revenue.find(item => id === item.title.toLowerCase().replace(/\s+/g, '-'));
      if (!item) item = ITEM_GROUPS.training.find(item => id === item.title.toLowerCase().replace(/\s+/g, '-'));
      
      // Look for the item in the ALL_PLAYBOOKS array
      if (!item) {
        // First try direct title match
        item = ALL_PLAYBOOKS.find(playbook => 
          id === playbook.title.toLowerCase().replace(/\s+/g, '-')
        );
        
        // If not found and array has items with subtitles, try more complex matching
        if (!item) {
          item = ALL_PLAYBOOKS.find(playbook => {
            if (playbook.subtitle) {
              // Try matching with combined title and subtitle
              const combinedId = `${playbook.title}-${playbook.subtitle}`.toLowerCase().replace(/\s+/g, '-');
              return id === combinedId;
            }
            return false;
          });
        }
      }
      
      console.log('Found item:', item);
      
      if (item) {
        let itemCredits;
        if (selectedTier === 'Enterprise ABM') {
          itemCredits = parseFloat(item.enterpriseCredits || item.tacticalCredits) * quantity;
        } else if (selectedTier === 'Impact ABM') {
          itemCredits = parseFloat(item.impactCredits || item.tacticalCredits) * quantity;
        } else {
          itemCredits = parseFloat(item.tacticalCredits || item.customPrice) * quantity;
        }
        
        credits += itemCredits;
        const itemCost = parseFloat(item.customPrice) * quantity;
        cost += itemCost;
        console.log(`Adding credits: ${itemCredits}, cost: ${itemCost} for ${item.title}`);
      }
    });
    
    console.log('\nFinal totals:', { credits, cost });
    return { credits, cost };
  };

  const { credits: grandTotal, cost: currencyTotal } = calculateTotals();

  // Calculate total credits cost based on tier
  const getCostPerCredit = (totalCredits) => {
    if (totalCredits >= 70) return 0.86;
    if (totalCredits >= 50) return 0.90;
    if (totalCredits >= 30) return 0.95;
    return 1.0;
  };

  const totalCostGBP = grandTotal * getCostPerCredit(grandTotal);
  const totalCostInCurrency = totalCostGBP * CURRENCY_CONFIG[selectedCurrency].rate;
  const symbol = selectedCurrency === 'GBP' ? '£' : selectedCurrency === 'EUR' ? '€' : '$';

  const comparisonData = [
    { feature: "ABMaaS", subtitle: "Use case", values: {
      custom: "Custom statements of work",
      tactical: "For single priority outcomes",
      impact: "For single ABM buyer journeys",
      enterprise: "Multiple ABM buyer journeys for multiple regions"
    }},
    { feature: "Pricing Model", subtitle: "Fixed price", values: { custom: true, tactical: false, impact: false, enterprise: false } },
    { subtitle: "Scalable credit model", values: { custom: false, tactical: true, impact: true, enterprise: true } },
    { feature: "Planning Model", subtitle: "Fixed timelines", values: { custom: true, tactical: false, impact: false, enterprise: false } },
    { subtitle: "Agile delivery", values: { custom: false, tactical: true, impact: true, enterprise: true } },
    { feature: "Target Account List", subtitle: "Fixed account list", values: { custom: true, tactical: false, impact: false, enterprise: false } },
    { subtitle: "Flexible account list", values: { custom: false, tactical: true, impact: true, enterprise: true } },
    { feature: "Scale", subtitle: "Pre-defined deliverables", values: { custom: true, tactical: false, impact: false, enterprise: false } },
    { subtitle: "Scalable credit tiers", values: { custom: false, tactical: true, impact: true, enterprise: true } },
    { feature: "Speed", subtitle: "Time to delivery", values: { custom: "weeks", tactical: "72h/96hrs", impact: "72h/96hrs", enterprise: "72h/96hrs" } },
    { subtitle: "Time to market", values: { custom: "weeks", tactical: "days", impact: "days", enterprise: "days" } }
  ];



  const mapItemToProps = item => ({
    id: item.id || item.title.toLowerCase().replace(/\s+/g, '-'),
    title: item.subtitle ? `${item.title} - ${item.subtitle}` : item.title,
    customPrice: item.customPrice || "-",
    tacticalCredits: item.tacticalCredits,
    impactCredits: item.impactCredits,
    enterpriseCredits: item.enterpriseCredits,
    showDelivery: true,
    quantity: quantities[item.id || item.title.toLowerCase().replace(/\s+/g, '-')] || 0,
    onQuantityChange: onQuantityChange
  });

  return (
    <div className={`bg-black text-white min-h-screen transition-all duration-300 ${isInvoiceOpen ? 'lg:pl-[400px]' : 'lg:pl-[50px]'}`}>
      <div className="max-w-6xl mx-auto relative">

        {/* Overlay when panel is open on mobile */}
        {isInvoiceOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsInvoiceOpen(false)}
          />
        )}
        <header className="p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-5xl font-bold mb-2">
                <span className="text-white">ABM</span>
                <span className="text-gray-500"> as a Service</span>
                <span style={{ color: '#e95a0c' }}>.</span>
              </h1>
              <p className="text-xl text-gray-500">A simpler, outcome-driven approach to ABM</p>
            </div>
            <div className="text-2xl pt-2">
              <span className="text-gray-500">strategic</span>
              <span className="text-white">abm</span>
              <span style={{ color: '#e95a0c' }}>.</span>
            </div>
          </div>
        </header>

        <div className="sticky top-0 bg-black/95 backdrop-blur-sm z-20 px-6 pb-4">
          <div className="rounded-lg overflow-hidden">
            <div className="grid grid-cols-[minmax(200px,1fr)_1fr_1fr_1fr_1fr] items-center">
              <div className="p-4"></div>
              <div className="bg-gray-700 p-4 text-lg font-bold text-center">Custom SOW</div>
              {['Tactical', 'Impact', 'Enterprise'].map((tier, index) => (
                <div key={tier} 
                  onClick={() => setSelectedTier(`${tier} ABM`)}
                  style={{ backgroundColor: selectedTier === `${tier} ABM` ? '#e95a0c' : '#d84d01' }} 
                  className={`p-4 text-lg font-bold text-center relative ${index > 0 ? 'border-l border-orange-700' : ''} cursor-pointer hover:bg-orange-600 transition-colors`}>
                  {tier} ABM
                  {/* White underline for active tier */}
                  {((tier === 'Tactical' && grandTotal >= 30 && grandTotal < 50) ||
                    (tier === 'Impact' && grandTotal >= 50 && grandTotal < 70) ||
                    (tier === 'Enterprise' && grandTotal >= 70)) && (
                    <div className="absolute bottom-2 left-1/4 right-1/4 h-1 bg-white opacity-50"></div>
                  )}
                </div>
              ))}
            </div>

            <div className="sticky top-0 z-10 grid grid-cols-[minmax(200px,1fr)_1fr_1fr_1fr_1fr] items-center bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
              <div className="p-4 flex items-center justify-end gap-3">
                <button
                  onClick={() => setQuantities({})}
                  className="px-3 py-1.5 text-xs text-gray-400 hover:text-gray-200 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                >
                  Reset All
                </button>
                <CurrencySelector
                  selectedCurrency={selectedCurrency}
                  onCurrencyChange={handleCurrencyChange}
                />
              </div>
              {tiers.map((tier, index) => (
                <div key={tier} className="p-4 text-center text-gray-300 text-sm border-l border-gray-800 relative">

                  <span className={`${tier === 'Custom SOW' ? 'text-green-500' : 'text-gray-300'} text-lg`}>
                    {tier === 'Custom SOW' ? (
                      <>
                        {symbol}{(currencyTotal * CURRENCY_CONFIG[selectedCurrency].rate).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }).replace('.', ',')}
                      </>
                    ) : (
                      <>
                        {symbol}{(getTierDisplayValue(tier) * CURRENCY_CONFIG[selectedCurrency].rate).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }).replace('.', ',')}
                      </>
                    )}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    {tier === 'Custom SOW' ? 'SOW' : `${tierCredits[tier]} credits`}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        <div className="px-6 pt-4">
          <Panel 
            title={<>
              <span className="text-white">Pricing model</span>{' '}
              <span className="text-gray-500">comparisons</span>
              <span style={{ color: '#e95a0c' }}>.</span>
            </>}
          >
            <div className="space-y-8">
              <div className="mt-1">
                <h3 className="text-gray-300 mb-3 text-2xl font-medium">Two ways to power your ABM strategy</h3>
                <p className="text-gray-400 leading-relaxed">
                  Choose between a traditional custom Statement of Work for structured, scoped projects or our ABM Credits Model—a flexible, on-demand system that lets you tap into playbooks, outcomes, training, and support whenever you need them.
                </p>
                <p className="text-gray-400 mt-4">
                  More agility, more control, more impact—designed to scale with your business as you grow.
                </p>
              </div>

              <div className="grid grid-cols-1 divide-y divide-gray-800/30 bg-gray-900/30">
                {comparisonData.map((row, i) => (<ComparisonRow key={i} {...row} />))}
              </div>




            </div>
          </Panel>


          <Panel title={<>
            <span style={{ color: '#e95a0c' }}>1.</span>{' '}<span className="text-white">ABM foundations</span>{' '}
            <span className="text-gray-500">credits</span>
            <span style={{ color: '#e95a0c' }}>.</span>
          </>}>
            <div className="bg-gray-900 p-4 rounded-lg">
              <FoundationsPanel 
                items={FOUNDATION_ITEMS} 
                quantities={quantities}
                onQuantityChange={handleQuantityChange}
                selectedCurrency={selectedCurrency}
                currencyRate={CURRENCY_CONFIG[selectedCurrency].rate}
              />
            </div>
          </Panel>

          <Panel title={<>
            <span style={{ color: '#e95a0c' }}>2.</span>{' '}<span className="text-white">Insights</span>{' '}
            <span className="text-gray-500">credits</span>
            <span style={{ color: '#e95a0c' }}>.</span>
          </>}>
            <div className="bg-gray-900 p-4 rounded-lg">
              <InsightsPanel 
                items={ITEM_GROUPS.insights}
                quantities={quantities}
                onQuantityChange={handleQuantityChange}
                selectedCurrency={selectedCurrency}
                currencyRate={CURRENCY_CONFIG[selectedCurrency].rate}
              />
            </div>
          </Panel>

          <Panel 
            title={<>
              <span style={{ color: '#e95a0c' }}>3.</span>{' '}<span className="text-white">Personalized content & creative</span>{' '}
              <span className="text-gray-500">credits</span><span style={{ color: '#e95a0c' }}>.</span>
            </>}
          >
            <div className="bg-gray-900 p-4 rounded-lg">
              <ContentPanel 
                engagementItems={ITEM_GROUPS.engagement}
                revenueItems={ITEM_GROUPS.revenueContent}
                quantities={quantities}
                onQuantityChange={handleQuantityChange}
                selectedCurrency={selectedCurrency}
                currencyRate={CURRENCY_CONFIG[selectedCurrency].rate}
              />
            </div>
          </Panel>

          <Panel title={<>
            <span style={{ color: '#e95a0c' }}>4.</span>{' '}<span className="text-white">Playbook</span>{' '}
            <span className="text-gray-500">credits</span>
            <span style={{ color: '#e95a0c' }}>.</span>
          </>}>
            <div className="bg-gray-900 p-4 rounded-lg">
              <PlaybooksPanel 
                quantities={quantities}
                onQuantityChange={handleQuantityChange}
                selectedCurrency={selectedCurrency}
                currencyRate={CURRENCY_CONFIG[selectedCurrency].rate}
              />
            </div>
          </Panel>

          <Panel title={<>
            <span style={{ color: '#e95a0c' }}>5.</span>{' '}<span className="text-white">ABM Training</span>{' '}
            <span className="text-gray-500">credits</span>
            <span style={{ color: '#e95a0c' }}>.</span>
          </>}>
            <div className="bg-gray-900 p-4 rounded-lg">
              <TrainingPanel 
                items={[
                  { title: "How to set ABM Programme Objectives", tacticalCredits: "3", impactCredits: "3", enterpriseCredits: "2.5", customPrice: "3" },
                  { title: "How to improve Sales & Marketing Alignment", tacticalCredits: "3", impactCredits: "3", enterpriseCredits: "2.5", customPrice: "3" },
                  { title: "Developing Account Selection & Prioritisation Frameworks", tacticalCredits: "7", impactCredits: "7", enterpriseCredits: "6", customPrice: "7" },
                  { title: "An introduction to ABM Value Proposition Development", tacticalCredits: "3", impactCredits: "3", enterpriseCredits: "2.5", customPrice: "3" },
                  { title: "An introduction to Account-based Reporting & Measurement", tacticalCredits: "3", impactCredits: "3", enterpriseCredits: "2.5", customPrice: "3" },
                  { title: "An introduction to Social Selling", tacticalCredits: "3", impactCredits: "3", enterpriseCredits: "2.5", customPrice: "3" }
                ]}
                quantities={quantities}
                onQuantityChange={handleQuantityChange}
                selectedCurrency={selectedCurrency}
                currencyRate={CURRENCY_CONFIG[selectedCurrency].rate}
              />
            </div>
          </Panel>

          <div className="py-8 text-center text-gray-400">
            <p>Credit allocation and delivery times are estimates. Actual requirements may vary based on complexity.</p>
          </div>
        </div>
      </div>

      {/* Invoice Summary Modal */}
      <InvoiceSummary
        isOpen={isInvoiceOpen}
        onClose={(newState) => setIsInvoiceOpen(newState)}
        selectedTier={grandTotal >= 70 ? 'Enterprise ABM' : grandTotal >= 50 ? 'Impact ABM' : grandTotal >= 30 ? 'Tactical ABM' : 'Custom SOW'}
        items={Object.entries(quantities)
          .filter(([_, quantity]) => quantity > 0)
          .map(([id, quantity]) => {
            // Order matches the numbered panels on the page
            const categoryOrder = [
              'ABM foundations',      // 1.
              'Insights',             // 2.
              'Personalized content & creative', // 3.
              'Playbook credits',     // 4.
              'ABM Training'          // 5.
            ];
            const allItems = [
              // Order matches the numbered panels on the page
              ...FOUNDATION_ITEMS.map(i => ({ ...i, category: 'ABM foundations', order: 1 })),
              ...ITEM_GROUPS.insights.map(i => ({ ...i, category: 'Insights', order: 2 })),
              ...ITEM_GROUPS.engagement.map(i => ({ ...i, category: 'Personalized content & creative', order: 3 })),
              ...ITEM_GROUPS.revenueContent.map(i => ({ ...i, category: 'Personalized content & creative', order: 3 })),
              ...ITEM_GROUPS.revenue.map(i => ({ ...i, category: 'Playbook credits', order: 4 })),
              // Add PlaybooksNetflixLayout items
              ...ALL_PLAYBOOKS.map(i => ({ ...i, category: `${i.stage} Playbooks`, order: 4 })),
              ...[
                    { title: "How to set ABM Programme Objectives", tacticalCredits: "3", impactCredits: "3", enterpriseCredits: "2.5", customPrice: "3" },
                    { title: "How to improve Sales & Marketing Alignment", tacticalCredits: "3", impactCredits: "3", enterpriseCredits: "2.5", customPrice: "3" },
                    { title: "Developing Account Selection & Prioritisation Frameworks", tacticalCredits: "7", impactCredits: "7", enterpriseCredits: "6", customPrice: "7" },
                    { title: "An introduction to ABM Value Proposition Development", tacticalCredits: "3", impactCredits: "3", enterpriseCredits: "2.5", customPrice: "3" },
                    { title: "An introduction to Account-based Reporting & Measurement", tacticalCredits: "3", impactCredits: "3", enterpriseCredits: "2.5", customPrice: "3" },
                    { title: "An introduction to Social Selling", tacticalCredits: "3", impactCredits: "3", enterpriseCredits: "2.5", customPrice: "3" }
                  ].map(i => ({ ...i, category: 'ABM Training', order: 5 }))
            ];
            const item = allItems.find(item => {
              // Standard item matching by ID
              if (id === item.title.toLowerCase().replace(/\s+/g, '-')) {
                return true;
              }
              
              // Try to match with subtitle if available
              if (item.subtitle) {
                const combinedId = `${item.title}-${item.subtitle}`.toLowerCase().replace(/\s+/g, '-');
                if (id === combinedId) {
                  return true;
                }
              }
              
              return false;
            });
            if (!item) return null;
            const basePrice = parseFloat(item.tacticalCredits || item.customPrice);
            const credits = basePrice * quantity;
            return {
              id,
              title: item.subtitle ? `${item.title} - ${item.subtitle}` : item.title,
              credits,
              basePrice,
              category: item.category,
              quantity,
              amount: `${symbol}${(credits * CURRENCY_CONFIG[selectedCurrency].rate).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }).replace('.', ',')}`
            };
          }).filter(Boolean)}
        totalCredits={grandTotal}
        customSowCost={`${symbol}${(currencyTotal * CURRENCY_CONFIG[selectedCurrency].rate).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }).replace('.', ',')}`}
        creditsCost={`${symbol}${(totalCostInCurrency).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }).replace('.', ',')}`}
        currencySymbol={symbol}
        selectedCurrency={selectedCurrency}
      />
    </div>
  );
}