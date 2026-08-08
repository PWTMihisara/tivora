'use client';

import { useState } from 'react';

const FAQ_SECTIONS = [
  {
    title: 'SHIPPING',
    items: [
      { q: 'How long does shipping take?', a: 'Standard shipping takes 3–5 business days within Sri Lanka. Express shipping (1–2 business days) is available at checkout.' },
      { q: 'Do you offer free shipping?', a: 'Yes! We offer complimentary shipping on all orders over Rs. 3,000. Orders below that amount have a flat shipping fee of Rs. 350.' },
      { q: 'Do you ship internationally?', a: 'Currently we ship within Sri Lanka only. International shipping is coming soon.' },
      { q: 'How can I track my order?', a: 'Once your order is shipped, you will receive an email with a tracking number. You can also check your order status in your account under Order History.' },
    ],
  },
  {
    title: 'RETURNS & EXCHANGES',
    items: [
      { q: 'What is your return policy?', a: 'We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in their original packaging with tags attached.' },
      { q: 'How do I initiate a return?', a: 'Contact us at support@tivora.com with your order number and reason for return. We will provide a return shipping label.' },
      { q: 'Can I exchange for a different size?', a: 'Yes. If the size you need is in stock, we will ship the replacement as soon as we receive your return.' },
      { q: 'How long do refunds take?', a: 'Refunds are processed within 5–7 business days after we receive the returned item. The amount will be credited to your original payment method.' },
    ],
  },
  {
    title: 'ORDERS & PAYMENT',
    items: [
      { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, and cash on delivery for orders within Colombo.' },
      { q: 'Can I cancel or modify my order?', a: 'Orders can be cancelled or modified within 2 hours of placement. Contact us immediately at support@tivora.com.' },
      { q: 'I received a damaged or wrong item. What do I do?', a: 'We are sorry! Please email us at support@tivora.com with photos of the issue and your order number. We will arrange a replacement or refund immediately.' },
    ],
  },
  {
    title: 'SIZING & FIT',
    items: [
      { q: 'How do your sizes run?', a: 'Our garments are designed for a relaxed, considered fit. We recommend checking the size guide on each product page. If you are between sizes, we suggest sizing up.' },
      { q: 'Do you have a size guide?', a: 'Yes. Each product page includes detailed measurements. As a general reference: S (chest 36"), M (38"), L (40"), XL (42").' },
    ],
  },
  {
    title: 'ACCOUNT & PRIVACY',
    items: [
      { q: 'Do I need an account to order?', a: 'No, you can checkout as a guest. However, creating an account lets you track orders, save addresses, and manage your wishlist.' },
      { q: 'How do you protect my personal data?', a: 'We use industry-standard encryption and never share your personal information with third parties. Your payment details are processed securely through our payment provider.' },
    ],
  },
];

export default function FAQView() {
  const [openIdx, setOpenIdx] = useState<string | null>(null);

  const toggle = (key: string) => setOpenIdx(prev => prev === key ? null : key);

  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '56px 48px 96px' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h1 style={{ font: "800 32px/1.1 'Archivo',sans-serif", letterSpacing: '-0.01em', margin: '0 0 12px' }}>FREQUENTLY ASKED QUESTIONS</h1>
        <p style={{ font: "400 15px/1.6 'Inter',sans-serif", color: '#6b6b6b', margin: 0 }}>
          Everything you need to know about shopping with TIVORA.
        </p>
      </div>

      {FAQ_SECTIONS.map(section => (
        <div key={section.title} style={{ marginBottom: 36 }}>
          <div style={{ font: "700 11px/1 'Inter',sans-serif", letterSpacing: '0.14em', color: '#9a9a96', marginBottom: 16 }}>{section.title}</div>
          <div style={{ border: '1px solid rgba(10,10,10,0.1)', borderRadius: 10, overflow: 'hidden' }}>
            {section.items.map((item, i) => {
              const key = `${section.title}-${i}`;
              const isOpen = openIdx === key;
              return (
                <div key={key} style={{ borderBottom: i < section.items.length - 1 ? '1px solid rgba(10,10,10,0.08)' : 'none' }}>
                  <button
                    onClick={() => toggle(key)}
                    style={{
                      width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                      padding: '18px 20px', textAlign: 'left',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      font: "600 14px/1.3 'Inter',sans-serif", color: '#0a0a0a',
                    }}
                  >
                    {item.q}
                    <span style={{ fontSize: 18, color: '#9a9a96', flexShrink: 0, marginLeft: 16, transition: 'transform 0.2s', transform: isOpen ? 'rotate(45deg)' : 'none' }}>+</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 20px 18px', font: "400 14px/1.7 'Inter',sans-serif", color: '#4a4a48' }}>
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div style={{ textAlign: 'center', marginTop: 48, padding: '32px 24px', background: '#f5f3f0', borderRadius: 12 }}>
        <div style={{ font: "700 14px 'Inter',sans-serif", marginBottom: 8 }}>Still have questions?</div>
        <div style={{ font: "400 14px/1.6 'Inter',sans-serif", color: '#6b6b6b' }}>
          Email us at <span style={{ fontWeight: 600, color: '#0a0a0a' }}>support@tivora.com</span> and we will get back to you within 24 hours.
        </div>
      </div>
    </main>
  );
}
