'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

function Stars({ rating, size = 16, interactive, onRate }: { rating: number; size?: number; interactive?: boolean; onRate?: (r: number) => void }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          onClick={() => interactive && onRate?.(i)}
          style={{
            fontSize: size, cursor: interactive ? 'pointer' : 'default',
            color: i <= rating ? '#0a0a0a' : '#dcd9d2',
            transition: 'color 0.15s',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function ReviewsSection({ productId }: { productId: string }) {
  const user = useStore(s => s.user);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchReviews = () => {
    fetch(`/api/reviews?product_id=${productId}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setReviews(data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, [productId]);

  const avgRating = reviews.length > 0
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
    : 0;

  const handleSubmit = async () => {
    if (!comment.trim() || !user) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          user_id: user.id,
          user_name: user.name,
          rating,
          comment: comment.trim(),
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        setComment('');
        setRating(5);
        setShowForm(false);
        fetchReviews();
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch { /* ignore */ }
    setSubmitting(false);
  };

  return (
    <section style={{ marginTop: 72, borderTop: '1px solid rgba(10,10,10,0.1)', paddingTop: 48 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h2 style={{ font: "800 24px 'Archivo',sans-serif", margin: '0 0 8px', letterSpacing: '-0.01em' }}>REVIEWS</h2>
          {reviews.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Stars rating={Math.round(avgRating)} />
              <span style={{ font: "600 14px 'Inter',sans-serif" }}>{avgRating}</span>
              <span style={{ font: "400 13px 'Inter',sans-serif", color: '#6b6b6b' }}>({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
            </div>
          )}
        </div>
        {user && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={{ background: '#0a0a0a', color: '#fff', border: 'none', padding: '10px 20px', font: "700 12px 'Inter',sans-serif", letterSpacing: '0.08em', cursor: 'pointer', borderRadius: 6 }}
          >
            WRITE A REVIEW
          </button>
        )}
      </div>

      {submitted && (
        <div style={{ font: "600 13px 'Inter',sans-serif", color: '#2F6B45', marginBottom: 20 }}>Thank you for your review!</div>
      )}

      {/* Review form */}
      {showForm && user && (
        <div style={{ background: '#f5f3f0', borderRadius: 10, padding: 24, marginBottom: 32 }}>
          <div style={{ font: "700 12px 'Inter',sans-serif", letterSpacing: '0.1em', marginBottom: 12 }}>YOUR RATING</div>
          <Stars rating={rating} size={24} interactive onRate={setRating} />
          <div style={{ font: "700 12px 'Inter',sans-serif", letterSpacing: '0.1em', marginTop: 20, marginBottom: 8 }}>YOUR REVIEW</div>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Share your thoughts about this product..."
            rows={4}
            style={{
              width: '100%', boxSizing: 'border-box', border: '1px solid rgba(10,10,10,0.2)',
              borderRadius: 6, padding: '12px 14px', font: "400 14px/1.6 'Inter',sans-serif",
              outline: 'none', resize: 'vertical', background: '#fff',
            }}
          />
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button
              onClick={handleSubmit}
              disabled={submitting || !comment.trim()}
              style={{
                background: comment.trim() ? '#0a0a0a' : '#c0bdb8', color: '#fff', border: 'none',
                padding: '12px 24px', font: "700 12px 'Inter',sans-serif", letterSpacing: '0.08em',
                cursor: comment.trim() ? 'pointer' : 'default', borderRadius: 6,
              }}
            >
              {submitting ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{ background: 'none', border: '1px solid rgba(10,10,10,0.2)', padding: '12px 20px', font: "600 12px 'Inter',sans-serif", cursor: 'pointer', borderRadius: 6 }}
            >
              CANCEL
            </button>
          </div>
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <div style={{ font: "400 14px 'Inter',sans-serif", color: '#6b6b6b' }}>Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div style={{ font: "400 14px 'Inter',sans-serif", color: '#6b6b6b', textAlign: 'center', padding: '32px 0' }}>
          No reviews yet. {user ? 'Be the first to leave a review!' : 'Sign in to write a review.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {reviews.map(review => (
            <div key={review.id} style={{ padding: '20px 0', borderBottom: '1px solid rgba(10,10,10,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', background: '#0a0a0a', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  font: "700 11px 'Inter',sans-serif", flexShrink: 0,
                }}>
                  {review.user_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <div style={{ font: "600 13px 'Inter',sans-serif" }}>{review.user_name}</div>
                  <div style={{ font: "400 11px 'Inter',sans-serif", color: '#9a9a96' }}>
                    {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <Stars rating={review.rating} size={14} />
                </div>
              </div>
              <p style={{ font: "400 14px/1.6 'Inter',sans-serif", color: '#4a4a48', margin: 0 }}>{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      {!user && reviews.length > 0 && (
        <div style={{ font: "400 13px 'Inter',sans-serif", color: '#6b6b6b', textAlign: 'center', marginTop: 20 }}>
          Sign in to write a review.
        </div>
      )}
    </section>
  );
}
