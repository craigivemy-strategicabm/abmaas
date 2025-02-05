import React, { useState } from 'react';
import { ChevronDown, Check, Info } from 'lucide-react';


const QuantitySelector = ({ value, onChange, max = 99 }) => {
  return (
    <div className="inline-flex items-center bg-gray-800/50 rounded-md">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="px-1.5 py-0.5 hover:bg-gray-700/50 text-gray-400 text-xs rounded-l"
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
        className="w-8 bg-transparent text-center text-gray-300 text-xs focus:outline-none"
      />
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="px-1.5 py-0.5 hover:bg-gray-700/50 text-gray-400 text-xs rounded-r"
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
  "Pricing Features": "Compare and contrast our custom vs credits-based pricing models, both designed to offer clients the speed, scale, and agility needed to support the ever-evolving demands of account-based sales and marketing teams.",
  "Insights Credits": "On-demand market, account and stakeholder intelligence forming the foundations for scale and personalised messaging.",
  "Personalized Content Credits": "Hyper-personalised content designed to solve the relationship needs of your most important accounts, delivered for approval within 72hrs to 96hrs.",
  "Playbook Credits": "Sprint-based playbooks that map to buyer journeys, delivering quantifiable micro-outcomes through personalized content and activation plans. Built for agility and rapid deployment.",
  "In-house ABM Training Credits": "Upskill your team with comprehensive ABM training and enablement"
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
  const [isExpanded, setIsExpanded] = useState(true);
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

const InsightItem = ({ id, title, customPrice, credits, showDelivery = true, quantity = 0, onQuantityChange }) => (
  <div className="bg-gray-800/30 rounded mb-4 last:mb-0">
    <div className="p-3 border-b border-gray-700/50 bg-gray-900">
      <div className="text-gray-300 text-sm font-bold">{title}</div>
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

export default function ABMTiers() {
  const [customPrice, setCustomPrice] = useState('Custom');
  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (id, value) => {
    setQuantities(prev => ({ ...prev, [id]: value }));
  };
  
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

  const foundationItems = [
    { title: "ICP Development", credits: "3.5", customPrice: "3.5" },
    { title: "Account Selection", credits: "3.5", customPrice: "4" },
    { title: "Account Segmentation/Prioritisation", credits: "2", customPrice: "2.5" },
    { title: "ABM Value Proposition Development", credits: "12", customPrice: "13" },
    { title: "ABM Readiness Workshops", credits: "8", customPrice: "8.5" },
    { title: "Custom Playbook Design", credits: "10", customPrice: "12" },
    { title: "Synthetic Audiences", credits: "19", customPrice: "21.5" }
  ];

  const mapItemToProps = item => ({
    id: item.id || item.title.toLowerCase().replace(/\s+/g, '-'),
    title: item.title,
    customPrice: item.customPrice || "-",
    credits: item.credits,
    showDelivery: true,
    quantity: quantities[item.id || item.title.toLowerCase().replace(/\s+/g, '-')] || 0,
    onQuantityChange: handleQuantityChange
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
              <div></div>
              <div className="p-4 flex flex-col items-center">
                <div className="text-gray-400">
                  <input type="text" value={customPrice} onChange={(e) => setCustomPrice(e.target.value)}
                    className="w-24 bg-transparent border-b border-gray-700 text-center focus:outline-none focus:border-gray-500"/>
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
                <h3 className="text-orange-500 mb-3">Two ways to power your ABM strategy</h3>
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
            <span className="text-white">Foundations</span>{' '}
            <span className="text-gray-500">features</span>
            <span style={{ color: '#e95a0c' }}>.</span>
          </>}>
            <div className="bg-gray-900 p-4 rounded-lg">
              <h4 className="text-lg mb-4" style={{ color: '#e95a0c' }}>ABM Strategy Foundations</h4>
              {foundationItems.map((item, i) => (
                <InsightItem key={i} {...mapItemToProps(item)} showDelivery={false} />
              ))}
            </div>
          </Panel>

          <Panel title={<>
            <span className="text-white">Insights</span>{' '}
            <span className="text-gray-500">credits</span>
            <span style={{ color: '#e95a0c' }}>.</span>
          </>}>
            <div className="bg-gray-900 p-4 rounded-lg">
              {itemGroups.insights.map((item, i) => (
                <InsightItem
                  key={i}
                  {...mapItemToProps(item)}
                  quantity={quantities[item.id] || 0}
                  onQuantityChange={handleQuantityChange}
                />
              ))}
            </div>
          </Panel>

          <Panel title={<>
            <span className="text-white">Personalized content & creative</span>{' '}
            <span className="text-gray-500">credits</span>
            <span style={{ color: '#e95a0c' }}>.</span>
          </>}>
            <div className="bg-gray-900 p-4 rounded-lg">
              <ContentSection title="Engagement Content" 
                items={itemGroups.engagement.map(item => mapItemToProps(item))} />
              <ContentSection title="Revenue Content" 
                items={itemGroups.revenue.map(item => mapItemToProps(item))} />
            </div>
          </Panel>

          <Panel title={<>
            <span className="text-white">Playbook</span>{' '}
            <span className="text-gray-500">credits</span>
            <span style={{ color: '#e95a0c' }}>.</span>
          </>}>
            <div className="bg-gray-900 p-4 rounded-lg">
              <ContentSection title="Engagement Playbooks" 
                items={[{ 
                  title: "Engagement Playbook", 
                  customPrice: "27",
                  tacticalCredits: "25",
                  impactCredits: "25",
                  enterpriseCredits: "25",
                  showDelivery: false
                }]} 
              />
              <ContentSection title="Revenue Playbooks" 
                items={[{ 
                  title: "Revenue Playbook", 
                  customPrice: "7-9",
                  tacticalCredits: "6.5-8",
                  impactCredits: "6.5-8",
                  enterpriseCredits: "6.5-8",
                  showDelivery: false
                }]} 
              />
            </div>
          </Panel>

          <Panel title={<>
            <span className="text-white">In-house ABM Training</span>{' '}
            <span className="text-gray-500">credits</span>
            <span style={{ color: '#e95a0c' }}>.</span>
          </>}>
            <div className="bg-gray-900 p-4 rounded-lg">
              {itemGroups.training.map((item, i) => (
                <InsightItem key={i} {...mapItemToProps(item)} showDelivery={false} />
              ))}
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