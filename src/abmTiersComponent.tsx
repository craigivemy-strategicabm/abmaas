import React, { useState } from 'react';
import { ChevronDown, Check, Info } from 'lucide-react';
//import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const panelDescriptions = {
  "Foundations": "Custom ABM programmes & individual strategic deliverables tailored to your specific needs, setting the foundations for scale and time to market goals.",
  "Pricing Features": "Compare the key features and benefits across our ABM service tiers",
  "Insights Credits": "Understand your target accounts with deep-dive research and analysis",
  "Personalized Content Credits": "Create targeted content assets that resonate with your key accounts",
  "Playbook Credits": "Sprint-based playbooks that map to buyer journeys, delivering quantifiable micro-outcomes through personalized content and activation plans. Built for agility and rapid deployment.",
  "In-house ABM Training Credits": "Upskill your team with comprehensive ABM training and enablement"
};

const itemGroups = {
  insights: [
    { title: "Market Insights", credits: "10", customPrice: "11.5" },
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
    <div className="bg-gray-900 rounded-lg mb-4">
      <div 
        className="sticky top-[150px] p-4 bg-gray-900 border-b border-gray-800 flex justify-between items-center cursor-pointer z-10 rounded-t-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg tracking-wide">
          {title === "Foundations" ? (
            <><span className="text-white">Foundations</span><span style={{ color: '#e95a0c' }}>.</span></>
          ) : (
            title.split(' ').map((word, i, arr) => (
              <span key={i}>
                {i === arr.length - 1 ? (
                  <><span className="text-gray-500">{word}</span><span style={{ color: '#e95a0c' }}>.</span></>
                ) : (
                  <><span className="text-gray-100">{word}</span>{' '}</>
                )}
              </span>
            ))
          )}
        </h3>
        <ChevronDown className={`w-6 h-6 text-gray-400 transform duration-200 ${isExpanded ? '' : '-rotate-90'}`}/>
      </div>
      {isExpanded && (
        <div className="p-4 mt-[1px]">
          <p className="text-gray-400 text-sm mb-4">{panelDescriptions[title]}</p>
          {children}
        </div>
      )}
    </div>
  );
};

const ComparisonRow = ({ feature, subtitle, values }) => (
  <div className="contents group">
    <div className="bg-gray-800/50">
      {feature && (
        <div className="font-medium text-sm text-white border-b border-gray-700/50 p-3">
          {feature}
        </div>
      )}
      <div className="grid grid-cols-5 items-center">
        <div className="text-sm text-gray-400 p-3 pl-6">{subtitle}</div>
        <div className="col-span-4 grid grid-cols-4">
          {['custom', 'tactical', 'impact', 'enterprise'].map((type) => (
            <div key={type} className="bg-gray-800/30 flex items-center justify-center py-3">
              {typeof values[type] === 'string' ? (
                <div className="text-xs text-gray-400">{values[type]}</div>
              ) : (
                values[type] ? <Check className="w-4 h-4 text-green-500" /> : <div className="text-gray-400 text-lg">-</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const InsightItem = ({ title, customPrice, tacticalCredits, impactCredits, enterpriseCredits, showDelivery = true }) => (
  <div className="bg-gray-800/30 rounded p-4 mb-4 last:mb-0">
    <div className="grid grid-cols-5 items-center">
      <div className="text-gray-300 text-sm col-span-1">{title}</div>
      <div className="col-span-4 grid grid-cols-4 text-sm">
        <div className="flex flex-col justify-center items-center">
          <div className="text-gray-400">£{customPrice}k</div>
        </div>
        {[tacticalCredits, impactCredits, enterpriseCredits].map((credits, i) => (
          <div key={i} className="flex flex-col justify-center items-center">
            <div className="text-green-500 text-sm">{credits} credits</div>
            {showDelivery && <div className="text-gray-400">{i === 0 ? '96hrs' : '72hrs'}</div>}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ContentSection = ({ title, items }) => (
  <div className="mb-8 last:mb-0">
    <h4 className="text-xl mb-4" style={{ color: '#e95a0c' }}>{title}</h4>
    {items.map((item, i) => (<InsightItem key={i} {...item} />))}
  </div>
);

export default function ABMTiers() {
  const [customPrice, setCustomPrice] = useState('Custom');
  
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
    { title: "Synthetic Audiences", credits: "10", customPrice: "10.5" }
  ];

  const mapItemToProps = item => ({
    title: item.title,
    customPrice: item.customPrice || "-",
    tacticalCredits: item.credits,
    impactCredits: item.credits,
    enterpriseCredits: item.credits,
    showDelivery: true
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
            <div className="grid grid-cols-5">
              <div className="col-span-1"></div>
              <div className="col-span-4 grid grid-cols-4 text-center">
                <div className="bg-gray-700 p-4 text-lg font-bold">Custom SOW</div>
                {['Tactical', 'Impact', 'Enterprise'].map((tier, index) => (
                  <div key={tier} style={{ backgroundColor: '#e95a0c' }} 
                    className={`p-4 text-lg font-bold ${index > 0 ? 'border-l border-orange-700' : ''}`}>
                    {tier} ABM
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-5 bg-gray-900">
              <div className="col-span-1"></div>
              <div className="col-span-4 grid grid-cols-4 text-center">
                <div className="p-4 flex flex-col justify-end">
                  <div className="text-gray-400">
                    <input type="text" value={customPrice} onChange={(e) => setCustomPrice(e.target.value)}
                      className="w-24 bg-transparent border-b border-gray-700 text-center focus:outline-none focus:border-gray-500"/>
                  </div>
                </div>
                {[{c:30,p:30}, {c:50,p:45}, {c:70,p:60}].map(({c,p}, i) => (
                  <div key={i} className={`p-4 ${i > 0 ? 'border-l border-gray-800' : ''}`}>
                    <div className="text-green-500 text-base mb-1">{c} credits</div>
                    <div className="text-gray-400 text-xs">£{p}k+ per qtr</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pt-4">
          <Panel title="Pricing Features">
            <div className="grid grid-cols-1 divide-y divide-gray-800/30">
              {comparisonData.map((row, i) => (<ComparisonRow key={i} {...row} />))}
            </div>
          </Panel>

          <Panel title="Foundations">
            <div className="bg-gray-900 p-4 rounded-lg">
              <h4 className="text-lg mb-4" style={{ color: '#e95a0c' }}>ABM Strategy Foundations</h4>
              {foundationItems.map((item, i) => (
                <InsightItem key={i} {...mapItemToProps(item)} showDelivery={false} />
              ))}
            </div>
          </Panel>

          <Panel title="Insights Credits">
            <div className="bg-gray-900 p-4 rounded-lg">
              {itemGroups.insights.map((item, i) => (
                <InsightItem key={i} {...mapItemToProps(item)} />
              ))}
            </div>
          </Panel>

          <Panel title="Personalized Content Credits">
            <div className="bg-gray-900 p-4 rounded-lg">
              <ContentSection title="Engagement Content" 
                items={itemGroups.engagement.map(item => mapItemToProps(item))} />
              <ContentSection title="Revenue Content" 
                items={itemGroups.revenue.map(item => mapItemToProps(item))} />
            </div>
          </Panel>

          <Panel title="Playbook Credits">
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

          <Panel title="In-house ABM Training Credits">
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