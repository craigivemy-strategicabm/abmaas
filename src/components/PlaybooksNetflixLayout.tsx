import React, { useState, useEffect } from 'react';
import { InsightItem } from '../abmTiersComponent';
import { X } from 'lucide-react';

// Playbook interface
export interface Playbook {
  title: string;
  subtitle?: string;
  category: string;
  stage: string;
  tacticalCredits: string;
  impactCredits: string;
  enterpriseCredits: string;
  customPrice: string;
  description: string;
  includes: string[];
  kpis: string[];
}

// Custom Playbook Budget component
const CustomPlaybookBudget = ({ id, value, onChange, selectedCurrency, currencyRate }) => {
  // Define the credit values for each tier based on the same value for tactical and impact, and 90% for enterprise
  const tacticalCredits = value;
  const impactCredits = value;
  const enterpriseCredits = Math.round(value * 0.9 * 10) / 10; // 90% with one decimal place
  
  // Format the price similar to other items
  const priceDisplay = (() => {
    const symbol = selectedCurrency === 'GBP' ? '£' : selectedCurrency === 'EUR' ? '€' : '$';
    return `${symbol}${(value * currencyRate).toFixed(1)}k`;
  })();

  // Handle custom input
  const handleInputChange = (e) => {
    const newValue = parseInt(e.target.value) || 0;
    onChange(id, newValue);
  };
  
  return (
    <div className="bg-gray-800/30 rounded mb-6">
      <div className="p-3 border-b border-gray-700/50 bg-gray-900">
        <div className="text-gray-300 text-sm">
          Custom Playbook Budget
          <div className="text-gray-400 text-xs mt-2">
            Flexible playbook budget allocation for custom strategic frameworks aligned with your specific business objectives and target accounts.
          </div>
        </div>
      </div>
      <div className="p-3">
        <div className="grid grid-cols-[minmax(200px,1fr)_1fr_1fr_1fr_1fr] items-center">
          <div className="flex justify-start pl-4 items-center">
            <input 
              type="range" 
              min="0" 
              max="100" 
              step="5" 
              value={Math.min(value, 100)} 
              onChange={(e) => onChange(id, parseInt(e.target.value))} 
              className="w-24 mr-2"
            />
            <input 
              type="number" 
              value={value} 
              onChange={handleInputChange}
              className="bg-gray-800 text-white w-20 h-8 text-center border border-gray-700 rounded focus:outline-none focus:border-gray-500"
            />
          </div>
          <div className="text-gray-400 text-xs text-center">
            {priceDisplay}
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
};

// Define the playbook data structure
export interface Playbook {
  title: string;
  subtitle?: string;
  category: 'net-new' | 'customer-growth' | 'custom';
  stage: string;
  tacticalCredits: string;
  impactCredits: string;
  enterpriseCredits: string;
  customPrice: string;
  description?: string;
  includes?: string[];
  kpis?: string[];
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
  'Advocacy': '#e95a0c',        // Orange
  'Custom': '#8f0a1a'          // Custom stage color
};

// Playbook data
export const ALL_PLAYBOOKS: Playbook[] = [
  // Playbooks definitions...
  // Net-new Target Accounts - Awareness
  {
    title: "Engage",
    subtitle: "new market segment",
    category: "net-new",
    stage: "Awareness",
    tacticalCredits: "27",
    impactCredits: "27",
    enterpriseCredits: "26",
    customPrice: "27",
    description: "This ABM playbook is designed to drive strategic awareness and engagement within a new industry or market segment by targeting high-value accounts with customised content, tailored messaging and personalised outreach",
    includes: [
      "Personalised Cluster Manifesto",
      "Market insights report"
    ],
    kpis: [
      "Growth in new account engagements (email responses, social interactions, event attendance)",
      "Increased account recognition and recall",
      "Early-stage pipeline growth from new accounts"
    ]
  },
  {
    title: "Engage",
    subtitle: "untouched accounts",
    category: "net-new",
    stage: "Awareness",
    tacticalCredits: "27",
    impactCredits: "27",
    enterpriseCredits: "26",
    customPrice: "27",
    description: "This playbook focuses on initiating engagement with high-value accounts that have not previously interacted with the client or have been hard to reach and engage with",
    includes: [
      "Personalised account-based content",
      "Targeted outreach cadence"
    ],
    kpis: [
      "First-time engagement metrics",
      "Account response rates",
      "Meeting conversion rates"
    ]
  },
  {
    title: "Stay front of mind",
    subtitle: "during multi-channel awareness",
    category: "net-new",
    stage: "Awareness",
    tacticalCredits: "27",
    impactCredits: "27",
    enterpriseCredits: "26",
    customPrice: "27",
    description: "This playbook ensures ongoing brand presence and visibility across multiple channels to reinforce market relevance through multi-threaded engagement with key stakeholders within target accounts.",
    includes: [
      "Multi-channel content distribution",
      "Consistent brand messaging",
      "Stakeholder mapping"
    ],
    kpis: [
      "Engagement frequency across channels",
      "Content consumption metrics",
      "Brand recall improvements"
    ]
  },
  {
    title: "Exec peer-to-peer",
    subtitle: "leadership connections",
    category: "net-new",
    stage: "Awareness",
    tacticalCredits: "27",
    impactCredits: "27",
    enterpriseCredits: "26",
    customPrice: "27",
    description: "This playbook facilitates executive-level engagement by connecting senior leaders with counterparts in target accounts.",
    includes: [
      "Executive profiling and matching",
      "Thought leadership content",
      "Executive engagement events"
    ],
    kpis: [
      "Executive meetings secured",
      "C-level engagement metrics",
      "Senior stakeholder feedback quality"
    ]
  },
  {
    title: "Take your proposition upstream",
    category: "net-new",
    stage: "Awareness",
    tacticalCredits: "27",
    impactCredits: "27",
    enterpriseCredits: "26",
    customPrice: "27",
    description: "This playbook focuses on repositioning the brand from a mid-market vendor to a trusted enterprise partner by building credibility and demonstrating strategic value to high-level decision-makers.",
    includes: [
      "C-suite value proposition development",
      "Enterprise-focused case studies",
      "Strategic validation research"
    ],
    kpis: [
      "Meetings with senior decision-makers",
      "Perception shift in brand positioning",
      "Enterprise opportunity pipeline growth"
    ]
  },

  // Net-new Target Accounts - Educate
  {
    title: "Build trust",
    subtitle: "with accounts through thought leadership",
    category: "net-new",
    stage: "Educate",
    tacticalCredits: "2",
    impactCredits: "2",
    enterpriseCredits: "1.5",
    customPrice: "2",
    description: "This ABM playbook leverages high-value thought leadership content to establish a strong point of view in the market, positioning the company as a leading authority and trusted advisor within its industry.",
    includes: [
      "Original research and insights",
      "Executive viewpoints",
      "Industry trend analysis"
    ],
    kpis: [
      "Content engagement metrics",
      "Brand authority measures",
      "Sales conversation quality"
    ]
  },
  {
    title: "Changing Perceptions",
    subtitle: "of brand",
    category: "net-new",
    stage: "Educate",
    tacticalCredits: "2",
    impactCredits: "2",
    enterpriseCredits: "1.5",
    customPrice: "2",
    description: "This playbook is designed to shift outdated or negative perceptions of the brand by showcasing innovation, expertise, and value.",
    includes: [
      "Perception audit and analysis",
      "Targeted myth-busting content",
      "Success stories and case studies"
    ],
    kpis: [
      "Brand perception improvement metrics",
      "Message reception among target accounts",
      "Competitive win rate improvements"
    ]
  },
  {
    title: "Demonstrate capabilities",
    subtitle: "through innovation engagement",
    category: "net-new",
    stage: "Educate",
    tacticalCredits: "2",
    impactCredits: "2",
    enterpriseCredits: "1.5",
    customPrice: "2",
    description: "This playbook showcases the company's innovative solutions and thought leadership to drive account engagement and differentiation.",
    includes: [
      "Personalized demo experiences",
      "Innovation showcases",
      "Solution walkthroughs"
    ],
    kpis: [
      "Demo to meeting conversion rates",
      "Solution understanding metrics",
      "Competitive differentiation scores"
    ]
  },
  {
    title: "Competitor differentiation",
    subtitle: "stand out in a crowded market",
    category: "net-new",
    stage: "Educate",
    tacticalCredits: "2",
    impactCredits: "2",
    enterpriseCredits: "1.5",
    customPrice: "2",
    description: "This playbook helps establish clear market differentiation by articulating unique value propositions against competitors.",
    includes: [
      "Competitive landscape analysis",
      "Differentiation messaging framework",
      "Battle cards and competitive FAQs"
    ],
    kpis: [
      "Competitive win rates",
      "Differentiation understanding in target accounts",
      "Reduction in feature comparison objections"
    ]
  },
  {
    title: "Build an executive",
    subtitle: "into an industry thought-leader",
    category: "net-new",
    stage: "Educate",
    tacticalCredits: "2",
    impactCredits: "2",
    enterpriseCredits: "1.5",
    customPrice: "2",
    description: "This playbook focuses on positioning a senior executive as a respected industry thought leader through strategic content, speaking engagements, and peer engagement.",
    includes: [
      "Executive thought leadership platform",
      "Speaking opportunity development",
      "Industry network building"
    ],
    kpis: [
      "Executive visibility metrics",
      "Thought leadership content engagement",
      "Executive relationship growth"
    ]
  },
  {
    title: "Multi-threaded nurture",
    subtitle: "of personas to build a business case",
    category: "net-new",
    stage: "Educate",
    tacticalCredits: "2",
    impactCredits: "2",
    enterpriseCredits: "1.5",
    customPrice: "2",
    description: "This playbook focuses on nurturing key personas within target accounts by providing tailored insights and value-driven content that supports their internal business case for investment.",
    includes: [
      "Persona-based content journeys",
      "ROI calculators and tools",
      "Business case templates"
    ],
    kpis: [
      "Multi-persona engagement metrics",
      "Content consumption across stakeholders",
      "Business case advancement indicators"
    ]
  },

  // Net-new Target Accounts - Influence
  {
    title: "Expand & penetrate",
    subtitle: "a decision-making unit (DMU)",
    category: "net-new",
    stage: "Influence",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8",
    description: "This ABM playbook focuses on deepening engagement within key target accounts by influencing multiple stakeholders across the decision-making unit (DMU).",
    includes: [
      "Stakeholder mapping and influence strategy",
      "Role-based messaging and content",
      "Multi-channel engagement approach"
    ],
    kpis: [
      "Number of active stakeholders engaged",
      "Depth of engagement per stakeholder",
      "DMU coverage percentage"
    ]
  },
  {
    title: "Influence executive decision-makers",
    category: "net-new",
    stage: "Influence",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8",
    description: "This playbook is designed to engage and build credibility with C-suite and senior executives within target accounts.",
    includes: [
      "Executive-level content and insights",
      "Personalized outreach strategies",
      "Executive roundtables and events"
    ],
    kpis: [
      "Executive meetings secured",
      "C-level engagement metrics",
      "Senior stakeholder feedback quality"
    ]
  },
  {
    title: "Unblock a stalled deal",
    category: "net-new",
    stage: "Influence",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8",
    description: "This playbook focuses on reactivating and accelerating stalled opportunities through targeted engagement and value reinforcement.",
    includes: [
      "Deal blockage analysis",
      "Stakeholder re-engagement strategy",
      "Value reinforcement content"
    ],
    kpis: [
      "Stalled deal reactivation rate",
      "Deal progression velocity",
      "Conversion of stalled to active opportunities"
    ]
  },
  {
    title: "Pipeline velocity",
    subtitle: "accelerate open deals",
    category: "net-new",
    stage: "Influence",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8",
    description: "This playbook focuses on accelerating deal progression through targeted engagement and barrier removal.",
    includes: [
      "Deal progression analysis",
      "Stakeholder alignment strategies",
      "Decision enablement content"
    ],
    kpis: [
      "Deal cycle time reduction",
      "Stage progression velocity",
      "Decision-maker engagement metrics"
    ]
  },
  {
    title: "Re-engage closed-lost accounts",
    category: "net-new",
    stage: "Influence",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8",
    description: "This playbook focuses on re-engaging and winning back previously lost opportunities through new value propositions and targeted outreach.",
    includes: [
      "Loss reason analysis",
      "Refreshed value proposition",
      "Multi-touch re-engagement campaign"
    ],
    kpis: [
      "Closed-lost reactivation rate",
      "Converted previously-lost opportunities",
      "New engagement quality metrics"
    ]
  },

  // Net-new Target Accounts - Commit (not Convert)
  {
    title: "Deal protection",
    subtitle: "objection handling playbook",
    category: "net-new",
    stage: "Commit",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8",
    description: "This playbook focuses on protecting strategic opportunities from competitive threats and ensuring successful closure.",
    includes: [
      "Competitive defense strategies",
      "Objection handling toolkit",
      "Value reinforcement communications"
    ],
    kpis: [
      "Competitive win rate improvement",
      "Late-stage deal retention rate",
      "Objection resolution effectiveness"
    ]
  },
  {
    title: "Sales enablement",
    subtitle: "towards deal closure",
    category: "net-new",
    stage: "Commit",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8",
    description: "This playbook proactively addresses risks that could prevent deal closure, ensuring a smoother final-stage process.",
    includes: [
      "Deal risk assessment",
      "Sales team support materials",
      "Customer validation content"
    ],
    kpis: [
      "Deal closure rate improvement",
      "Sales cycle time reduction",
      "Sales team confidence metrics"
    ]
  },
  {
    title: "Last-mile",
    subtitle: "decision-alignment",
    category: "net-new",
    stage: "Commit",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8",
    description: "This playbook focuses on aligning key stakeholders and addressing final concerns to ensure smooth deal closure.",
    includes: [
      "Final stakeholder alignment tactics",
      "Concern resolution framework",
      "Decision facilitation content"
    ],
    kpis: [
      "Final decision timeline acceleration",
      "Stakeholder alignment metrics",
      "Concern resolution effectiveness"
    ]
  },
  {
    title: "Executive value",
    subtitle: "validation",
    category: "net-new",
    stage: "Commit",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8",
    description: "This playbook focuses on securing executive buy-in and validation of the proposed solution value.",
    includes: [
      "Executive value proposition",
      "ROI validation framework",
      "Executive engagement strategy"
    ],
    kpis: [
      "Executive approval rate",
      "Value perception metrics",
      "Deal approval velocity"
    ]
  },
  {
    title: "Targeted risk",
    subtitle: "mitigation",
    category: "net-new",
    stage: "Commit",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8",
    description: "This playbook focuses on identifying and addressing specific risks that could derail deal closure.",
    includes: [
      "Risk assessment framework",
      "Mitigation strategies development",
      "Proactive risk communications"
    ],
    kpis: [
      "Risk identification effectiveness",
      "Mitigation success rate",
      "Deal closure confidence metrics"
    ]
  },

  // Customer Growth - Adoption
  {
    title: "Increase adoption of solutions",
    subtitle: "from untapped teams",
    category: "customer-growth",
    stage: "Adoption",
    tacticalCredits: "2",
    impactCredits: "2",
    enterpriseCredits: "1.5",
    customPrice: "2",
    description: "This ABM playbook focuses on driving increased usage of existing solutions within customer accounts to maximise deal value and strengthen long-term retention.",
    includes: [
      "User adoption analysis",
      "Solution value reinforcement",
      "Team-specific onboarding materials"
    ],
    kpis: [
      "Adoption rate metrics",
      "User engagement increase",
      "Solution usage expansion"
    ]
  },
  {
    title: "Build internal advocacy & champions",
    category: "customer-growth",
    stage: "Adoption",
    tacticalCredits: "2",
    impactCredits: "2",
    enterpriseCredits: "1.5",
    customPrice: "2",
    description: "This playbook focuses on turning key users and stakeholders into internal advocates who promote solution adoption and retention.",
    includes: [
      "Champion identification framework",
      "Advocacy toolkit development",
      "Internal community building"
    ],
    kpis: [
      "Number of active champions",
      "Advocate-driven adoption increase",
      "Internal referral metrics"
    ]
  },
  {
    title: "Delivering additional value for user enablement",
    category: "customer-growth",
    stage: "Adoption",
    tacticalCredits: "2",
    impactCredits: "2",
    enterpriseCredits: "1.5",
    customPrice: "2",
    description: "This playbook focuses on enhancing user experience and competency through additional value-add services and enablement resources.",
    includes: [
      "User experience enhancement",
      "Training and enablement resources",
      "Value-add services development"
    ],
    kpis: [
      "User proficiency improvement",
      "Solution utilization metrics",
      "Customer satisfaction scores"
    ]
  },

  // Customer Growth - Expansion
  {
    title: "Cross-sell into new lines of business",
    category: "customer-growth",
    stage: "Expansion",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8",
    description: "This playbook focuses on expanding relationships by introducing new product lines and solutions to different business units within existing accounts.",
    includes: [
      "Business unit mapping",
      "Cross-departmental need analysis",
      "New business unit engagement strategy"
    ],
    kpis: [
      "New business unit penetration rate",
      "Cross-sell conversion metrics",
      "Account revenue expansion"
    ]
  },
  {
    title: "Upsell complementary adjacent solutions",
    category: "customer-growth",
    stage: "Expansion",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8",
    description: "This playbook focuses on identifying and capitalizing on opportunities to expand solution footprint through complementary offerings.",
    includes: [
      "Solution usage analysis",
      "Complementary solution mapping",
      "Value amplification messaging"
    ],
    kpis: [
      "Adjacent solution adoption rate",
      "Solution portfolio expansion metrics",
      "Upsell conversion effectiveness"
    ]
  },
  {
    title: "Introduce new solutions",
    subtitle: "into existing accounts",
    category: "customer-growth",
    stage: "Expansion",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8",
    description: "This playbook focuses on leveraging trusted customer relationships to introduce entirely new solutions and product lines.",
    includes: [
      "New solution fit analysis",
      "Trusted relationship leverage strategy",
      "Solution introduction toolkit"
    ],
    kpis: [
      "New solution adoption metrics",
      "Solution portfolio diversity",
      "New offering revenue contribution"
    ]
  },
  {
    title: "Build executive alignment",
    subtitle: "to strengthen partnerships",
    category: "customer-growth",
    stage: "Expansion",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8",
    description: "This playbook focuses on strengthening executive relationships to ensure long-term partnership success.",
    includes: [
      "Executive engagement strategy",
      "Strategic alignment workshops",
      "Joint vision development"
    ],
    kpis: [
      "Executive relationship strength metrics",
      "Strategic alignment scores",
      "Executive-sponsored initiatives"
    ]
  },
  {
    title: "Develop expansion partnerships",
    subtitle: "for strategic growth",
    category: "customer-growth",
    stage: "Expansion",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8",
    description: "This playbook focuses on developing strategic partnerships to drive mutual growth and expansion opportunities.",
    includes: [
      "Partnership opportunity mapping",
      "Joint business planning",
      "Collaborative go-to-market strategy"
    ],
    kpis: [
      "Partnership contribution to revenue",
      "Joint opportunity creation",
      "Strategic partnership strength metrics"
    ]
  },

  // Customer Growth - Retention
  {
    title: "Grow renewal potential pipeline",
    category: "customer-growth",
    stage: "Retention",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8",
    description: "This ABM playbook focuses on proactively securing renewals by nurturing existing accounts and ensuring long-term value alignment.",
    includes: [
      "Renewal opportunity analysis",
      "Value realization assessment",
      "Renewal strategy planning"
    ],
    kpis: [
      "Renewal pipeline growth metrics",
      "Early renewal identification rate",
      "Renewal forecast accuracy"
    ]
  },
  {
    title: "Renewal risk mitigation",
    category: "customer-growth",
    stage: "Retention",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8",
    description: "This playbook helps identify and address risks that may prevent an account from renewing, ensuring a proactive approach to retention.",
    includes: [
      "Risk assessment framework",
      "Early warning system development",
      "Mitigation action planning"
    ],
    kpis: [
      "Risk identification accuracy",
      "Mitigation success rate",
      "At-risk account recovery metrics"
    ]
  },
  {
    title: "Defend against competitor activity",
    category: "customer-growth",
    stage: "Retention",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8",
    description: "This playbook focuses on protecting key accounts from competitive threats by reinforcing differentiation and strategic value.",
    includes: [
      "Competitive threat analysis",
      "Value reinforcement strategy",
      "Differentiation messaging toolkit"
    ],
    kpis: [
      "Competitive displacement prevention rate",
      "Customer loyalty metrics",
      "Competitive win-back success"
    ]
  },
  {
    title: "Wake the dead",
    subtitle: "re-engage dormant accounts",
    category: "customer-growth",
    stage: "Retention",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8",
    description: "This playbook focuses on re-engaging past customers who have disengaged or lapsed in engagement, reviving opportunities for future business.",
    includes: [
      "Disengagement pattern analysis",
      "Re-engagement campaign development",
      "Value reintroduction strategy"
    ],
    kpis: [
      "Dormant account reactivation rate",
      "Re-engagement response metrics",
      "Revived revenue opportunities"
    ]
  },
  {
    title: "Recover a strategically important relationship",
    category: "customer-growth",
    stage: "Retention",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8",
    description: "This playbook focuses on repairing and revitalising relationships with previously lost or strained accounts.",
    includes: [
      "Relationship breakdown analysis",
      "Trust rebuilding framework",
      "Strategic re-engagement plan"
    ],
    kpis: [
      "Relationship recovery rate",
      "Trust restoration metrics",
      "Strategic account reactivation"
    ]
  },

  // Customer Growth - Advocacy
  {
    title: "Showcase key customer partnerships",
    category: "customer-growth",
    stage: "Advocacy",
    tacticalCredits: "2",
    impactCredits: "2",
    enterpriseCredits: "1.5",
    customPrice: "2",
    description: "This ABM playbook focuses on leveraging successful customer relationships to demonstrate value and credibility.",
    includes: [
      "Customer success story development",
      "Joint marketing opportunities",
      "Partnership showcase strategy"
    ],
    kpis: [
      "Partnership visibility metrics",
      "Credibility enhancement scores",
      "Referral generation from showcases"
    ]
  },
  {
    title: "Generate case studies and testimonials",
    category: "customer-growth",
    stage: "Advocacy",
    tacticalCredits: "2",
    impactCredits: "2",
    enterpriseCredits: "1.5",
    customPrice: "2",
    description: "This playbook focuses on collecting and publishing customer success stories to support sales and marketing efforts.",
    includes: [
      "Success story identification process",
      "Customer testimonial collection",
      "Case study production framework"
    ],
    kpis: [
      "Case study production rate",
      "Testimonial quality and impact",
      "Content utilization in sales cycles"
    ]
  },
  {
    title: "Create referral opportunities",
    category: "customer-growth",
    stage: "Advocacy",
    tacticalCredits: "2",
    impactCredits: "2",
    enterpriseCredits: "1.5",
    customPrice: "2",
    description: "This playbook focuses on encouraging existing customers to refer new business, leveraging advocacy to drive growth.",
    includes: [
      "Referral program development",
      "Advocate identification and activation",
      "Referral facilitation process"
    ],
    kpis: [
      "Referral generation rate",
      "Conversion of referrals to opportunities",
      "Advocate participation metrics"
    ]
  },

  // Custom Playbooks
  {
    title: "Custom playbook design",
    category: "custom",
    stage: "Custom",
    tacticalCredits: "12",
    impactCredits: "12",
    enterpriseCredits: "11",
    customPrice: "12",
    description: "A tailored playbook design service that creates custom strategic frameworks aligned with your specific business objectives and target accounts.",
  },
  {
    title: "Engagement playbook",
    category: "custom",
    stage: "Custom",
    tacticalCredits: "27",
    impactCredits: "27",
    enterpriseCredits: "25",
    customPrice: "27",
    description: "A comprehensive engagement framework designed to drive meaningful interactions with key accounts across multiple touchpoints.",
  },
  {
    title: "Revenue playbook",
    category: "custom",
    stage: "Custom",
    tacticalCredits: "8",
    impactCredits: "8",
    enterpriseCredits: "7",
    customPrice: "8",
    description: "A strategically designed playbook focused on optimizing revenue generation from target accounts through structured engagement tactics.",
  },
];

// ALL_PLAYBOOKS is already exported above

export interface PlaybooksNetflixLayoutProps {
  items: any[];
  quantities: Record<string, number>;
  onQuantityChange: (id: string, quantity: number) => void;
  selectedCurrency: string;
  currencyRate: number;
}

// Update the function that constructs the title with description
const getTitleWithSubtitle = (playbook: Playbook) => {
  return playbook.subtitle ? `${playbook.title} - ${playbook.subtitle}` : playbook.title;
};

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
  const [netNewExpanded, setNetNewExpanded] = useState(false);
  const [customerGrowthExpanded, setCustomerGrowthExpanded] = useState(false);
  const [customExpanded, setCustomExpanded] = useState(false);
  
  // Auto-expand panels when search query is made
  useEffect(() => {
    if (searchQuery.trim() !== '') {
      setNetNewExpanded(true);
      setCustomerGrowthExpanded(true);
      setCustomExpanded(true);
    }
  }, [searchQuery]);

  // Filter playbooks based on search query
  const filteredPlaybooks = ALL_PLAYBOOKS.filter(playbook => 
    playbook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (playbook.subtitle && playbook.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
    playbook.stage.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Group playbooks by category and stage
  const netNewPlaybooks = filteredPlaybooks.filter(p => p.category === 'net-new');
  const customerGrowthPlaybooks = filteredPlaybooks.filter(p => p.category === 'customer-growth');
  const customPlaybooks = filteredPlaybooks.filter(p => p.category === 'custom');

  // Filter playbooks by active stage (or show all if no stage is selected)
  const filteredNetNewPlaybooks = activeNetNewStage 
    ? netNewPlaybooks.filter(p => p.stage === activeNetNewStage)
    : netNewPlaybooks;
    
  const filteredCustomerGrowthPlaybooks = activeCustomerGrowthStage 
    ? customerGrowthPlaybooks.filter(p => p.stage === activeCustomerGrowthStage)
    : customerGrowthPlaybooks;

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

      {/* Net-new playbooks Section */}
      {netNewPlaybooks.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-8 cursor-pointer" onClick={() => setNetNewExpanded(!netNewExpanded)}>
            <div className="w-1.5 h-12 mr-4 bg-white"></div>
            <h2 className="text-xl font-bold text-white">Net-new playbooks</h2>
            <div className="ml-auto">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-6 w-6 text-white transition-transform ${netNewExpanded ? 'transform rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {netNewExpanded && (
            <>
              <div className="flex mb-6 space-x-4 overflow-x-auto pb-2">
                <button 
                  className={`px-4 py-2 rounded-lg text-white font-medium transition-colors duration-300 text-base relative focus:outline-none ${activeNetNewStage === null ? 'bg-gray-600' : 'bg-gray-800/80'}`}
                  onClick={showAllPlaybooks}
                >
                  Show All
                  {activeNetNewStage === null && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></div>}
                </button>
                {NET_NEW_STAGES.map(stage => (
                  <button 
                    key={stage} 
                    className={`px-4 py-2 rounded-lg text-white font-medium transition-colors duration-300 text-base relative focus:outline-none`}
                    style={{ 
                      backgroundColor: stageColors[stage], 
                      opacity: activeNetNewStage === stage ? 1 : 0.75,
                      border: 'none',
                      boxShadow: 'none'
                    }}
                    onClick={() => setActiveNetNewStage(stage)}
                  >
                    {stage}
                    {activeNetNewStage === stage && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></div>}
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
                            // Create a unique ID by combining title and subtitle if available
                            const id = playbook.subtitle 
                              ? `${playbook.title}-${playbook.subtitle}`.toLowerCase().replace(/\s+/g, '-')
                              : playbook.title.toLowerCase().replace(/\s+/g, '-');
                            return (
                              <div key={`${playbook.title}-${playbook.subtitle || ''}`} className="flex mb-2">
                                <div className="w-1 mr-2" style={{ backgroundColor: stageColors[playbook.stage] }}></div>
                                <div className="flex-grow">
                                  <div className="flex flex-col">
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
                                      description={playbook.description}
                                    />
                                  </div>
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
                  // Create a unique ID by combining title and subtitle if available
                  const id = playbook.subtitle 
                    ? `${playbook.title}-${playbook.subtitle}`.toLowerCase().replace(/\s+/g, '-')
                    : playbook.title.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <div key={`${playbook.title}-${playbook.subtitle || ''}`} className="flex mb-2">
                      <div className="w-1 mr-2" style={{ backgroundColor: stageColors[playbook.stage] }}></div>
                      <div className="flex-grow">
                        <div className="flex flex-col">
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
                            description={playbook.description}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* Customer Growth playbooks Section */}
      {customerGrowthPlaybooks.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-8 cursor-pointer" onClick={() => setCustomerGrowthExpanded(!customerGrowthExpanded)}>
            <div className="w-1.5 h-12 mr-4 bg-white"></div>
            <h2 className="text-xl font-bold text-white">Customer Growth playbooks</h2>
            <div className="ml-auto">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-6 w-6 text-white transition-transform ${customerGrowthExpanded ? 'transform rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {customerGrowthExpanded && (
            <>
              <div className="flex mb-6 space-x-4 overflow-x-auto pb-2">
                <button 
                  className={`px-4 py-2 rounded-lg text-white font-medium transition-colors duration-300 text-base relative focus:outline-none ${activeCustomerGrowthStage === null ? 'bg-gray-600' : 'bg-gray-800/80'}`}
                  onClick={showAllPlaybooks}
                >
                  Show All
                  {activeCustomerGrowthStage === null && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></div>}
                </button>
                {CUSTOMER_GROWTH_STAGES.map(stage => (
                  <button 
                    key={stage} 
                    className={`px-4 py-2 rounded-lg text-white font-medium transition-colors duration-300 text-base relative focus:outline-none`}
                    style={{ 
                      backgroundColor: stageColors[stage], 
                      opacity: activeCustomerGrowthStage === stage ? 1 : 0.75,
                      border: 'none',
                      boxShadow: 'none'
                    }}
                    onClick={() => setActiveCustomerGrowthStage(stage)}
                  >
                    {stage}
                    {activeCustomerGrowthStage === stage && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></div>}
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
                            // Create a unique ID by combining title and subtitle if available
                            const id = playbook.subtitle 
                              ? `${playbook.title}-${playbook.subtitle}`.toLowerCase().replace(/\s+/g, '-')
                              : playbook.title.toLowerCase().replace(/\s+/g, '-');
                            return (
                              <div key={`${playbook.title}-${playbook.subtitle || ''}`} className="flex mb-2">
                                <div className="w-1 mr-2" style={{ backgroundColor: stageColors[playbook.stage] }}></div>
                                <div className="flex-grow">
                                  <div className="flex flex-col">
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
                                      description={playbook.description}
                                    />
                                  </div>
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
                  // Create a unique ID by combining title and subtitle if available
                  const id = playbook.subtitle 
                    ? `${playbook.title}-${playbook.subtitle}`.toLowerCase().replace(/\s+/g, '-')
                    : playbook.title.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <div key={`${playbook.title}-${playbook.subtitle || ''}`} className="flex mb-2">
                      <div className="w-1 mr-2" style={{ backgroundColor: stageColors[playbook.stage] }}></div>
                      <div className="flex-grow">
                        <div className="flex flex-col">
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
                            description={playbook.description}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* Custom Playbooks Section */}
      {customPlaybooks.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-8 cursor-pointer" onClick={() => setCustomExpanded(!customExpanded)}>
            <div className="w-1.5 h-12 mr-4 bg-white"></div>
            <h2 className="text-xl font-bold text-white">Custom Playbooks</h2>
            <div className="ml-auto">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-6 w-6 text-white transition-transform ${customExpanded ? 'transform rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {customExpanded && (
            <div>
              {/* Custom Playbook Budget */}
              <CustomPlaybookBudget
                id="custom-playbook-budget"
                value={quantities['custom-playbook-budget'] || 0}
                onChange={onQuantityChange}
                selectedCurrency={selectedCurrency}
                currencyRate={currencyRate}
              />
              {customPlaybooks.map(playbook => {
                // Create a unique ID by combining title and subtitle if available
                const id = playbook.subtitle 
                  ? `${playbook.title}-${playbook.subtitle}`.toLowerCase().replace(/\s+/g, '-')
                  : playbook.title.toLowerCase().replace(/\s+/g, '-');
                return (
                  <div key={`${playbook.title}-${playbook.subtitle || ''}`} className="flex mb-2">
                    <div className="w-1 mr-2" style={{ backgroundColor: stageColors[playbook.stage] }}></div>
                    <div className="flex-grow">
                      <div className="flex flex-col">
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
                          description={playbook.description}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
