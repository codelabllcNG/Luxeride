import React, { useState } from 'react';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { StarIcon } from 'lucide-react';
type ReviewFormProps = {
  bookingId: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
};
export function ReviewForm({
  bookingId,
  onSubmit,
  onCancel
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      bookingId,
      rating,
      comment
    });
  };
  return <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-grey-pastel mb-2">
          Rate your experience
        </h3>
        <p className="text-sm text-grey-medium mb-4">How was your trip?</p>

        <div className="flex justify-center space-x-2 mb-6">
          {[1, 2, 3, 4, 5].map(star => <button key={star} type="button" className="focus:outline-none transition-transform hover:scale-110" onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(star)}>
              <StarIcon className={`w-8 h-8 ${star <= (hoverRating || rating) ? 'text-primary fill-primary' : 'text-grey-muted'}`} />
            </button>)}
        </div>
      </div>

      <Input label="Your Review" as="textarea" placeholder="Tell us about your experience..." value={comment} onChange={e => setComment(e.target.value)} rows={4} required />

      <div className="flex space-x-4">
        <Button variant="secondary" fullWidth onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" fullWidth disabled={rating === 0}>
          Submit Review
        </Button>
      </div>
    </form>;
}