import React, { useState } from 'react';
import { ChevronDown, Watch, Shield, CreditCard, Users, Crown, MessageCircle, MoreHorizontal, Sparkles } from 'lucide-react';

interface Category {
  key: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface FaqItem {
  id: string;
  subject: string;
  content: string;
}

const EclipseFaq: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('timepieces');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const categories: Category[] = [
    { key: 'timepieces', label: 'Timepieces', icon: Watch },
    { key: 'authentication', label: 'Authentication', icon: Shield },
    { key: 'payment', label: 'Payment', icon: CreditCard },
    { key: 'collectors', label: 'Collectors', icon: Crown },
    { key: 'membership', label: 'Membership', icon: Users },
    { key: 'community', label: 'Community', icon: MessageCircle },
    { key: 'other', label: 'Other', icon: MoreHorizontal },
  ];

  const faqData: Record<string, FaqItem[]> = {
    timepieces: [
      {
        id: 'panel1',
        subject: 'Are all timepieces on Eclipse authenticated?',
        content: 'Every timepiece undergoes rigorous authentication by our certified horologists and comes with a certificate of authenticity.',
      },
      {
        id: 'panel2',
        subject: 'What luxury brands does Eclipse offer?',
        content: 'We curate exceptional timepieces from Rolex, Patek Philippe, Audemars Piguet, Vacheron Constantin, and other prestigious manufactures.',
      },
      {
        id: 'panel3',
        subject: 'How can I search for specific timepieces?',
        content: 'Use our advanced filters to search by brand, model, year, complications, materials, and price range for precise results.',
      },
      {
        id: 'panel4',
        subject: 'Do you assist first-time luxury watch buyers?',
        content: 'Our horological consultants provide personalized guidance to help you discover the perfect timepiece for your collection.',
      },
      {
        id: 'panel5',
        subject: 'What should I consider when acquiring a luxury watch?',
        content: 'Consider provenance, condition, rarity, investment potential, and personal connection to the timepiece\'s heritage.',
      },
      {
        id: 'panel6',
        subject: 'How long does the acquisition process take?',
        content: 'Most acquisitions are completed within 24-48 hours, with white-glove delivery arranged at your convenience.',
      },
      {
        id: 'panel7',
        subject: 'What if I encounter issues after purchase?',
        content: 'Eclipse provides comprehensive post-acquisition support and servicing through our network of authorized service centers.',
      },
      {
        id: 'panel8',
        subject: 'Do you offer rare and vintage pieces?',
        content: 'Yes, we specialize in sourcing exceptional vintage and limited-edition timepieces for discerning collectors.',
      },
      {
        id: 'panel9',
        subject: 'Can I consign my timepiece through Eclipse?',
        content: 'We offer premium consignment services with competitive rates and global reach to maximize your timepiece\'s value.',
      },
    //   {
    //     id: 'panel10',
    //     subject: 'Do you provide horological expertise and appraisals?',
    //     content: 'Our certified specialists offer professional appraisals, condition reports, and horological consultations.',
    //   },
    ],
    authentication: [
      {
        id: 'auth1',
        subject: 'How does Eclipse ensure authenticity?',
        content: 'Every timepiece undergoes multi-stage authentication using advanced technology and expert evaluation by certified horologists.',
      },
      {
        id: 'auth2',
        subject: 'What is your authentication guarantee?',
        content: 'We provide a lifetime authenticity guarantee with full documentation and can arrange independent verification if requested.',
      },
      {
        id: 'auth3',
        subject: 'How do you verify vintage timepieces?',
        content: 'Vintage pieces undergo specialized authentication including serial verification, movement analysis, and historical documentation review.',
      },
      {
        id: 'auth4',
        subject: 'What happens if a timepiece fails authentication?',
        content: 'Any timepiece that doesn\'t meet our standards is immediately removed from inventory with full transparency to our clients.',
      },
      {
        id: 'auth5',
        subject: 'Can you authenticate my existing timepiece?',
        content: 'Yes, we offer independent authentication services for timepieces not purchased through Eclipse.',
      },
      {
        id: 'auth6',
        subject: 'What documentation comes with authenticated pieces?',
        content: 'Each timepiece includes a detailed condition report, authenticity certificate, and provenance documentation when available.',
      },
      {
        id: 'auth7',
        subject: 'How do you handle modified timepieces?',
        content: 'All modifications are fully disclosed with detailed photography and impact assessment on value and authenticity.',
      },
      {
        id: 'auth8',
        subject: 'Do you work with insurance companies for authentication?',
        content: 'Yes, we provide authentication services for insurance claims and work directly with major insurance providers.',
      },
    ],
    payment: [
      {
        id: 'pay1',
        subject: 'What payment methods does Eclipse accept?',
        content: 'We accept wire transfers, certified checks, cryptocurrency, and offer flexible financing options for qualified clients.',
      },
      {
        id: 'pay2',
        subject: 'Are there additional fees for Eclipse services?',
        content: 'Our prices are transparent with no hidden fees. Premium services like expedited delivery may incur additional charges.',
      },
      {
        id: 'pay3',
        subject: 'Do you offer financing for luxury timepieces?',
        content: 'Yes, we partner with premier financial institutions to offer competitive financing terms for qualified collectors.',
      },
      {
        id: 'pay4',
        subject: 'How secure are Eclipse payment transactions?',
        content: 'All transactions use bank-grade encryption and are processed through secure, bonded channels with full insurance coverage.',
      },
      {
        id: 'pay5',
        subject: 'Can I make payments in cryptocurrency?',
        content: 'Yes, we accept major cryptocurrencies including Bitcoin and Ethereum for timepiece acquisitions.',
      },
      {
        id: 'pay6',
        subject: 'What is your refund and return policy?',
        content: 'We offer a 7-day inspection period with full refund guarantee if the timepiece doesn\'t meet your expectations.',
      },
      {
        id: 'pay7',
        subject: 'Do you offer trade-in opportunities?',
        content: 'Yes, we provide competitive trade-in valuations that can be applied toward your next Eclipse acquisition.',
      },
      {
        id: 'pay8',
        subject: 'Are there benefits for early payment?',
        content: 'Early payment discounts may be available for certain timepieces. Contact our specialists for current offers.',
      },
    ],
    collectors: [
      {
        id: 'coll1',
        subject: 'What should serious collectors consider?',
        content: 'Focus on provenance, rarity, condition, investment potential, and pieces that resonate with your collecting philosophy.',
      },
      {
        id: 'coll2',
        subject: 'How do I determine my collecting budget?',
        content: 'Our specialists help establish realistic budgets based on your goals, whether building a collection or acquiring individual statement pieces.',
      },
      {
        id: 'coll3',
        subject: 'What documentation should I maintain for my collection?',
        content: 'Maintain certificates, service records, purchase documentation, and periodic appraisals for insurance and resale purposes.',
      },
      {
        id: 'coll4',
        subject: 'How do I identify investment-grade timepieces?',
        content: 'Look for iconic models, limited productions, historical significance, and pieces from established manufactures with strong market performance.',
      },
      {
        id: 'coll5',
        subject: 'Can I negotiate prices on luxury timepieces?',
        content: 'Our pricing is competitive and transparent. For significant purchases, our specialists may discuss portfolio pricing.',
      },
      {
        id: 'coll6',
        subject: 'What are red flags when collecting vintage watches?',
        content: 'Avoid pieces with replaced dials, incorrect parts, poor service history, or questionable provenance without proper disclosure.',
      },
    //   {
    //     id: 'coll7',
    //     subject: 'Do you provide collection management services?',
    //     content: 'Yes, we offer comprehensive collection management including storage, insurance coordination, and portfolio optimization.',
    //   },
    //   {
    //     id: 'coll7',
    //     subject: 'Do you provide collection management services?',
    //     content: 'Yes, we offer comprehensive collection management including storage, insurance coordination, and portfolio optimization.',
    //   },
      {
        id: 'coll8',
        subject: 'How do I store and maintain my luxury timepieces?',
        content: 'Proper storage includes watch winders for automatics, controlled humidity, security, and regular servicing every 3-5 years.',
      },
    ],
    membership: [
      {
        id: 'mem1',
        subject: 'What are the benefits of Eclipse membership?',
        content: 'Members enjoy priority access to rare pieces, exclusive events, complimentary services, and personalized horological consultations.',
      },
      {
        id: 'mem2',
        subject: 'How do I become an Eclipse member?',
        content: 'Membership is by invitation or through significant acquisitions. Contact our specialists to discuss membership eligibility.',
      },
      {
        id: 'mem3',
        subject: 'Are there different membership tiers?',
        content: 'Yes, we offer Collector, Connoisseur, and Elite tiers with increasing benefits and exclusive access privileges.',
      },
      {
        id: 'mem4',
        subject: 'What exclusive events do members attend?',
        content: 'Private viewings, manufacture visits, horological seminars, and intimate gatherings with renowned watchmakers.',
      },
      {
        id: 'mem5',
        subject: 'Do members receive special pricing?',
        content: 'Members receive priority pricing, early access to collections, and exclusive opportunities not available to the general public.',
      },
      {
        id: 'mem6',
        subject: 'Can membership be transferred or inherited?',
        content: 'Elite memberships may be transferred to immediate family members with proper documentation and approval.',
      },
    ],
    community: [
      {
        id: 'comm1',
        subject: 'How can I connect with other collectors?',
        content: 'Join our exclusive community platform where collectors share insights, showcase pieces, and discuss horological trends.',
      },
      {
        id: 'comm2',
        subject: 'Do you host collector meetups?',
        content: 'Yes, we organize regional gatherings, private dinners, and special events for our collector community.',
      },
      {
        id: 'comm3',
        subject: 'Can I share my collection with other members?',
        content: 'Our secure platform allows verified members to showcase their collections and connect with like-minded enthusiasts.',
      },
      {
        id: 'comm4',
        subject: 'Are there educational resources available?',
        content: 'We provide extensive horological education including webinars, expert interviews, and detailed collecting guides.',
      },
      {
        id: 'comm5',
        subject: 'How do I stay updated on market trends?',
        content: 'Members receive exclusive market reports, trend analyses, and insights from our research team.',
      },
      {
        id: 'comm6',
        subject: 'Can I contribute content to the community?',
        content: 'We welcome expert contributions including articles, reviews, and educational content from qualified members.',
      },
    ],
    other: [
      {
        id: 'other1',
        subject: 'How can I contact Eclipse customer service?',
        content: 'Reach our specialists via phone, email, or live chat. Premium members have dedicated relationship managers.',
      },
      {
        id: 'other2',
        subject: 'Do you offer international shipping?',
        content: 'Yes, we provide secure worldwide shipping with full insurance and white-glove delivery services.',
      },
      {
        id: 'other3',
        subject: 'What are your business hours?',
        content: 'Our specialists are available Monday-Friday 9AM-7PM EST, with weekend appointments for VIP clients.',
      },
      {
        id: 'other4',
        subject: 'Do you have physical showrooms?',
        content: 'We maintain exclusive private showrooms in major cities for qualified clients and members.',
      },
      {
        id: 'other5',
        subject: 'How do you handle privacy and discretion?',
        content: 'Client confidentiality is paramount. All transactions and information are handled with absolute discretion.',
      },
      {
        id: 'other6',
        subject: 'What makes Eclipse different from other dealers?',
        content: 'Our combination of rigorous authentication, curator expertise, exclusive access, and white-glove service sets us apart.',
      },
      {
        id: 'other7',
        subject: 'Do you offer watch servicing and repairs?',
        content: 'We coordinate servicing through authorized service centers and certified independent horologists.',
      },
      {
        id: 'other8',
        subject: 'Can I schedule a private consultation?',
        content: 'Absolutely. Our specialists offer personalized consultations by appointment in person or virtually.',
      },
    ],
  };

  const toggleExpand = (itemId: string) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  const getCurrentFaqItems = (): FaqItem[] => {
    return faqData[activeCategory] || [];
  };

  return (
    <div className="eclipse-faq">
      <div className="faq-container">
        {/* Header Section */}
        <div className="faq-header">
          <div className="brand-logo">
            <div className="logo-icon">
              <Sparkles />
            </div>
            <div className="brand-name">ECLIPSE</div>
          </div>
          <h1 className="main-title">Frequently Asked Questions</h1>
          <div className="title-divider"></div>
          <p className="subtitle">
            Discover answers to common questions about luxury timepiece acquisition, 
            authentication, and our exclusive collector services.
          </p>
        </div>

        {/* Category Navigation */}
        <div className="faq-categories">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.key}
                className={`category-btn ${activeCategory === category.key ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(category.key);
                  setExpandedItem(null);
                }}
              >
                <IconComponent />
                {category.label}
              </button>
            );
          })}
        </div>

        {/* FAQ Content */}
        <div className="faq-content">
          {getCurrentFaqItems().map((item, index) => (
            <div key={item.id} className="faq-item">
              <button
                className="faq-question"
                onClick={() => toggleExpand(item.id)}
              >
                <div className="question-content">
                  <div className="question-badge">
                    <span>Q</span>
                  </div>
                  <span className="question-text">{item.subject}</span>
                </div>
                <ChevronDown 
                  className={`chevron-icon ${expandedItem === item.id ? 'expanded' : ''}`}
                />
              </button>
              
              <div className={`faq-answer ${expandedItem === item.id ? 'expanded' : ''}`}>
                <div className="answer-content">
                  <div className="answer-badge">
                    <span>A</span>
                  </div>
                  <p className="answer-text">{item.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="faq-cta">
          <div className="cta-container">
            <h2 className="cta-title">Still Have Questions?</h2>
            <p className="cta-subtitle">
              Our horological specialists are ready to assist with personalized guidance
              for your luxury timepiece journey.
            </p>
            <button className="cta-button">
              Speak with a Specialist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EclipseFaq;