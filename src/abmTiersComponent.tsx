import React, { useState } from 'react';
import { ChevronDown, Check, Info } from 'lucide-react';


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
//import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
    { title: "Account Manifesto*", credits: "2", customPrice: "2.5" },
    { title: "Stakeholder Manifesto*", credits: "2", customPrice: "2.5" },
    { title: "Annotated Report", credits: "5.5", customPrice: "6" }
  ],
  revenue: [
    { title: "Account Roadmap", credits: "6.5", customPrice: "7.5" },
    { title: "Executive Briefing", credits: "6.5", customPrice: "7.5" }
  ],
  training: [
    { title: "AI Enabled ABM journey bootcamp", credits: "5" },
    { title: "Learn to how to scale personalisation with consistent outputs", credits: "3" },
    { title: "Learn how to deliver hyper-personalised content in days, not weeks or months", credits: "3" },
    { title: "Learn how to implement AI models in-house", credits: "4" },
    { title: "Learn how to build the foundations for scale and speed", credits: "3" },
    { title: "Learn how to deliver deep market, account and stakeholder insights", credits: "3" }
  ]
};

const Panel = ({title, children}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-950 backdrop-blur-sm rounded-lg mb-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] border-t-2 border-t-orange-600/20 border border-gray-800/80 hover:border-orange-600/30 transition-all duration-300 hover:shadow-[0_25px_65px_-5px_rgba(233,90,12,0.25)]">
      <div 
        className="sticky top-[150px] px-6 py-5 bg-gradient-to-r from-gray-900 to-gray-950 backdrop-blur-sm border-b border-gray-800/80 flex justify-between items-center cursor-pointer z-10 rounded-t-lg shadow-[0_10px_20px_-5px_rgba(0,0,0,0.7)]"
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

const FoundationsPanel = ({ items, quantities, onQuantityChange }) => {

  const totalCredits = Object.entries(quantities).reduce((total, [id, quantity]) => {
    const item = items.find(item => 
      id === item.title.toLowerCase().replace(/\s+/g, '-')
    );
    return total + (item ? parseFloat(item.credits) * quantity : 0);
  }, 0);

  return (
    <div>
      <TotalCredits total={totalCredits} description={panelDescriptions["Foundations"]} />
      {items.map((item, i) => (
        <InsightItem
          key={i}
          id={item.title.toLowerCase().replace(/\s+/g, '-')}
          title={item.title}
          customPrice={item.customPrice}
          credits={item.credits}
          quantity={quantities[item.title.toLowerCase().replace(/\s+/g, '-')] || 0}
          onQuantityChange={onQuantityChange}
          showDelivery={false}
        />
      ))}
    </div>
  );
};

const ContentPanel = ({ engagementItems, revenueItems, quantities, onQuantityChange }) => {

  const calculateTotal = (items) => {
    return Object.entries(quantities).reduce((total, [id, quantity]) => {
      const item = items.find(item => 
        id === item.title.toLowerCase().replace(/\s+/g, '-')
      );
      return total + (item ? parseFloat(item.credits) * quantity : 0);
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
          credits={item.credits}
          quantity={quantities[item.title.toLowerCase().replace(/\s+/g, '-')] || 0}
          onQuantityChange={onQuantityChange}
        />
      ))}
    </div>
  );

  return (
    <div>
      <TotalCredits total={totalCredits} description={panelDescriptions["Content"]} />
      {renderItems(engagementItems, "Engagement Content")}
      {renderItems(revenueItems, "Revenue Content")}
    </div>
  );
};

const TrainingPanel = ({ items, quantities, onQuantityChange }) => {

  const totalCredits = Object.entries(quantities).reduce((total, [id, quantity]) => {
    const item = items.find(item => 
      id === item.title.toLowerCase().replace(/\s+/g, '-')
    );
    return total + (item ? parseFloat(item.credits) * quantity : 0);
  }, 0);

  return (
    <div>
      <TotalCredits total={totalCredits} description={panelDescriptions["Training"]} />
      {items.map((item, i) => (
        <InsightItem
          key={i}
          id={item.title.toLowerCase().replace(/\s+/g, '-')}
          title={item.title}
          customPrice={item.customPrice}
          credits={item.credits}
          quantity={quantities[item.title.toLowerCase().replace(/\s+/g, '-')] || 0}
          onQuantityChange={onQuantityChange}
          showDelivery={false}
        />
      ))}
    </div>
  );
};

const TotalCredits = ({ total, description }) => (
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

const PlaybooksPanel = ({ quantities, onQuantityChange }) => {

  const items = [
    {
      title: "Custom Playbook Design",
      customPrice: "12",
      credits: "10",
      showDelivery: false
    },
    { 
      title: "Engagement Playbooks", 
      customPrice: "27",
      credits: "25",
      showDelivery: false
    },
    { 
      title: "Revenue Playbooks", 
      customPrice: "8",
      credits: "7",
      showDelivery: false
    }
  ];

  const totalCredits = Object.entries(quantities).reduce((total, [id, quantity]) => {
    const item = items.find(item => 
      (id === 'custom-playbook-design' && item.title === 'Custom Playbook Design') ||
      (id === 'engagement-playbook' && item.title === 'Engagement Playbooks') ||
      (id === 'revenue-playbook' && item.title === 'Revenue Playbooks')
    );
    return total + (item ? parseFloat(item.credits) * quantity : 0);
  }, 0);

  return (
    <div>
      <div className="space-y-8">
        <TotalCredits total={totalCredits} description={panelDescriptions["Playbooks"]} />
        <div>
          <InsightItem
            id="custom-playbook-design"
            title={items[0].title}
            customPrice={items[0].customPrice}
            credits={items[0].credits}
            quantity={quantities['custom-playbook-design'] || 0}
            onQuantityChange={onQuantityChange}
            showDelivery={false}
          />
        </div>
        <div>
          <InsightItem
            id="engagement-playbook"
            title={items[1].title}
            customPrice={items[1].customPrice}
            credits={items[1].credits}
            quantity={quantities['engagement-playbook'] || 0}
            onQuantityChange={onQuantityChange}
            showDelivery={false}
          />
        </div>
        <div>
          <InsightItem
            id="revenue-playbook"
            title={items[2].title}
            customPrice={items[2].customPrice}
            credits={items[2].credits}
            quantity={quantities['revenue-playbook'] || 0}
            onQuantityChange={onQuantityChange}
            showDelivery={false}
          />
        </div>
      </div>
    </div>
  );
};

const InsightsPanel = ({ items, quantities, onQuantityChange }) => {

  const totalCredits = Object.entries(quantities).reduce((total, [id, quantity]) => {
    const item = items.find(item => 
      id === item.title.toLowerCase().replace(/\s+/g, '-')
    );
    return total + (item ? parseFloat(item.credits) * quantity : 0);
  }, 0);

  return (
    <div>
      <TotalCredits total={totalCredits} description={panelDescriptions["Insights"]} />
      {items.map((item, i) => (
        <InsightItem
          key={i}
          id={item.title.toLowerCase().replace(/\s+/g, '-')}
          title={item.title}
          customPrice={item.customPrice}
          credits={item.credits}
          quantity={quantities[item.title.toLowerCase().replace(/\s+/g, '-')] || 0}
          onQuantityChange={onQuantityChange}
        />
      ))}
    </div>
  );
};

const InsightItem = ({ id, title, customPrice, credits, showDelivery = true, quantity = 0, onQuantityChange }) => (
  <div className="bg-gray-800/30 rounded mb-4 last:mb-0">
    <div className="p-3 border-b border-gray-700/50 bg-gray-900">
      <div className="text-gray-300 text-sm">
        {title.split(' (')[0]}
        {title.includes('(') && (
          <div className="text-gray-400 text-xs mt-1">
            {title.split('(')[1].replace(')', '')}
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
        <div className="text-gray-400 text-xs text-center">£{customPrice}k</div>
        <div className="text-center">
          <div className="text-green-500 text-sm text-center">{credits} credits</div>
          {showDelivery && <div className="text-gray-400 text-xs text-center">72hrs</div>}
        </div>
        <div className="text-center">
          <div className="text-green-500 text-sm text-center">{credits} credits</div>
          {showDelivery && <div className="text-gray-400 text-xs text-center">72hrs</div>}
        </div>
        <div className="text-center">
          <div className="text-green-500 text-sm text-center">{credits} credits</div>
          {showDelivery && <div className="text-gray-400 text-xs text-center">72hrs</div>}
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
  { title: "ICP Development", credits: "3.5", customPrice: "3.5" },
  { title: "Account Selection", credits: "3.5", customPrice: "4" },
  { title: "Account Segmentation/Prioritisation", credits: "2", customPrice: "2.5" },
  { title: "ABM Value Proposition Development", credits: "12", customPrice: "13" },
  { title: "ABM Readiness Workshops", credits: "8", customPrice: "8.5" },
  { title: "Synthetic Audiences", credits: "19", customPrice: "21.5" }
];

const ITEM_GROUPS = {
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
    { title: "Account Roadmap", credits: "6.5", customPrice: "7.5" },
    { title: "Executive Briefing", credits: "6.5", customPrice: "7.5" }
  ],
  training: [
    { title: "ABM Fundamentals (ICP, Account Selection, Segmentation)", credits: "3", customPrice: "4" },
    { title: "Strategy & Playbooks (Campaign Planning, Sales Alignment)", credits: "3", customPrice: "4" },
    { title: "Execution & Activation (Content Personalization, Multi-Channel Engagement)", credits: "3", customPrice: "4" },
    { title: "Measurement & Optimization (ROI, Attribution, Tech Stack)", credits: "3", customPrice: "4" }
  ]
};

export default function ABMTiers() {
  const [customPrice, setCustomPrice] = useState('Custom');
  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (id, value) => {
    setQuantities(prev => ({ ...prev, [id]: value }));
  };

  const calculatePanelTotal = (items, quantities) => {
    return Object.entries(quantities).reduce((total, [id, quantity]) => {
      const item = items.find(item => 
        id === (typeof item === 'string' ? item : item.title).toLowerCase().replace(/\s+/g, '-')
      );
      return total + (item ? parseFloat(item.credits || item.customPrice) * quantity : 0);
    }, 0);
  };

  const calculateTotals = () => {
    let credits = 0;
    let cost = 0;
    
    // Add up quantities * credits for each panel
    Object.entries(quantities).forEach(([id, quantity]) => {
      // Find matching item across all item groups
      let item = FOUNDATION_ITEMS.find(item => id === item.title.toLowerCase().replace(/\s+/g, '-'));
      if (!item) item = ITEM_GROUPS.insights.find(item => id === item.title.toLowerCase().replace(/\s+/g, '-'));
      if (!item) item = [...ITEM_GROUPS.engagement, ...ITEM_GROUPS.revenue].find(item => id === item.title.toLowerCase().replace(/\s+/g, '-'));
      if (!item) item = ITEM_GROUPS.training.find(item => id === item.title.toLowerCase().replace(/\s+/g, '-'));
      
      // Special handling for playbooks
      if (id === 'custom-playbook-design') {
        credits += 10 * quantity; // Custom Playbook Design credits
        cost += 12 * quantity; // Custom Playbook Design cost
      } else if (id === 'engagement-playbook') {
        credits += 25 * quantity; // Engagement Playbook credits
        cost += 27 * quantity; // Engagement Playbook cost
      } else if (id === 'revenue-playbook') {
        credits += 7 * quantity; // Revenue Playbook credits
        cost += 8 * quantity; // Revenue Playbook cost
      } else if (item) {
        credits += parseFloat(item.credits) * quantity;
        if (item.customPrice !== '£-k') {
          cost += parseFloat(item.customPrice) * quantity;
        }
      }
    });
    
    return { credits, cost };
  };

  const { credits: grandTotal, cost: currencyTotal } = calculateTotals();

  const comparisonData = [
    { feature: "ABMaaS tiers", subtitle: "Use case", values: {
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
    title: item.title,
    customPrice: item.customPrice || "-",
    credits: item.credits,
    showDelivery: true,
    quantity: quantities[item.id || item.title.toLowerCase().replace(/\s+/g, '-')] || 0,
    onQuantityChange: onQuantityChange
  });

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="max-w-6xl mx-auto relative">
        <header className="flex justify-between items-center p-6 mb-8">
          <h1 className="text-5xl font-bold">
            <span className="text-white">ABM</span>
            <span className="text-gray-500">aaS tiers</span>
            <span style={{ color: '#e95a0c' }}>.</span>
          </h1>
          <div className="text-2xl">
            <span className="text-gray-500">strategic</span>
            <span className="text-white">abm</span>
            <span style={{ color: '#e95a0c' }}>.</span>
          </div>
        </header>

        <div className="sticky top-0 bg-black/95 backdrop-blur-sm z-20 px-6 pb-4">
          <div className="rounded-lg overflow-hidden">
            <div className="grid grid-cols-[minmax(200px,1fr)_1fr_1fr_1fr_1fr] items-center">
              <div></div>
              <div className="bg-gray-700 p-4 text-lg font-bold text-center">Custom SOW</div>
              {['Tactical', 'Impact', 'Enterprise'].map((tier, index) => (
                <div key={tier} style={{ backgroundColor: '#e95a0c' }} 
                  className={`p-4 text-lg font-bold text-center ${index > 0 ? 'border-l border-orange-700' : ''}`}>
                  {tier} ABM
                </div>
              ))}
            </div>

            <div className="grid grid-cols-[minmax(200px,1fr)_1fr_1fr_1fr_1fr] items-center bg-gray-900">
              <div className="p-4 flex items-center gap-6">
                <div className="text-gray-300 text-sm flex items-center gap-1">
                  Total Credits: <span className="text-green-500 font-medium">{grandTotal.toFixed(1)}</span>
                </div>
                <button 
                  onClick={() => setQuantities({})}
                  className="px-3 py-1.5 text-xs text-gray-400 hover:text-gray-200 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                >
                  Reset All
                </button>
              </div>
              <div className="p-4">
                <div className="text-gray-300 text-sm flex items-center gap-1">
                  Total Cost: <span className="text-green-500 font-medium">£{currencyTotal.toFixed(1)}k</span>
                </div>
              </div>
              {[{c:30,p:30}, {c:50,p:45}, {c:70,p:60}].map(({c,p}, i) => (
                <div key={i} className={`p-4 ${i > 0 ? 'border-l border-gray-800' : ''}`}>
                  <div className="text-green-500 text-base mb-1 text-center">{c} credits</div>
                  <div className="text-gray-400 text-xs text-center">£{p}k+ per qtr</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 pt-4">
          <Panel title={<>
            <span className="text-white">Pricing model</span>{' '}
            <span className="text-gray-500">comparisons</span>
            <span style={{ color: '#e95a0c' }}>.</span>
          </>}>
            <div className="space-y-8">
              <div>
                <h3 className="text-orange-500 mb-3 text-2xl font-medium">Two ways to power your ABM strategy</h3>
                <p className="text-gray-400 leading-relaxed">
                  Choose between a traditional <span className="text-green-500">custom Statement of Work</span> for structured, scoped projects or our <span className="text-green-500">ABM Credits Model</span>—a flexible, on-demand system that lets you tap into playbooks, outcomes, training, and support whenever you need them.
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
            <span className="text-white">ABM foundations</span>{' '}
            <span className="text-gray-500">credits</span>
            <span style={{ color: '#e95a0c' }}>.</span>
          </>}>
            <div className="bg-gray-900 p-4 rounded-lg">
              <h4 className="text-lg mb-4" style={{ color: '#e95a0c' }}>ABM Strategy Foundations</h4>
              <FoundationsPanel 
                items={FOUNDATION_ITEMS} 
                quantities={quantities}
                onQuantityChange={handleQuantityChange}
              />
            </div>
          </Panel>

          <Panel title={<>
            <span className="text-white">Insights</span>{' '}
            <span className="text-gray-500">credits</span>
            <span style={{ color: '#e95a0c' }}>.</span>
          </>}>
            <div className="bg-gray-900 p-4 rounded-lg">

              <InsightsPanel 
                items={ITEM_GROUPS.insights}
                quantities={quantities}
                onQuantityChange={handleQuantityChange}
              />
            </div>
          </Panel>

          <Panel title={<>
            <span className="text-white">Personalized content & creative</span>{' '}
            <span className="text-gray-500">credits</span>
            <span style={{ color: '#e95a0c' }}>.</span>
          </>}>
            <div className="bg-gray-900 p-4 rounded-lg">

              <ContentPanel 
                engagementItems={ITEM_GROUPS.engagement}
                revenueItems={ITEM_GROUPS.revenue}
                quantities={quantities}
                onQuantityChange={handleQuantityChange}
              />
            </div>
          </Panel>

          <Panel title={<>
            <span className="text-white">Playbook</span>{' '}
            <span className="text-gray-500">credits</span>
            <span style={{ color: '#e95a0c' }}>.</span>
          </>}>
            <div className="bg-gray-900 p-4 rounded-lg">

              <PlaybooksPanel 
                quantities={quantities}
                onQuantityChange={handleQuantityChange}
              />
            </div>
          </Panel>

          <Panel title={<>
            <span className="text-white">ABM Training</span>{' '}
            <span className="text-gray-500">credits</span>
            <span style={{ color: '#e95a0c' }}>.</span>
          </>}>
            <div className="bg-gray-900 p-4 rounded-lg">
              <TrainingPanel 
                items={ITEM_GROUPS.training}
                quantities={quantities}
                onQuantityChange={handleQuantityChange}
              />
            </div>
          </Panel>

          <div className="py-8 text-center text-gray-400">
            <p>Credit allocation and delivery times are estimates. Actual requirements may vary based on complexity.</p>
          </div>
        </div>
      </div>
    </div>
  );
}