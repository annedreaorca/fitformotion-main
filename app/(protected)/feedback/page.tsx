"use client";
import React, { useState } from 'react';
import { Card, CardBody } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import { Textarea } from '@nextui-org/input';
import { Star, Send } from 'lucide-react';

export default function SimpleFeedbackPage() {
  const [rating, setRating] = useState(0);
  const [experience, setExperience] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    if (!experience.trim()) {
      alert('Please describe your experience');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Reset form
    setRating(0);
    setExperience('');
    setIsSubmitting(false);
    
    // Show success message
    alert('Thank you for your feedback!');
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-8 h-8 cursor-pointer transition-all duration-200 hover:scale-110 ${
          index < rating 
            ? 'text-yellow-400 fill-yellow-400' 
            : 'text-gray-300 hover:text-yellow-200'
        }`}
        onClick={() => setRating(index + 1)}
      />
    ));
  };

  const getRatingText = () => {
    switch(rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardBody className="p-8 space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              How would you rate your experience with the app?
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Your feedback helps us improve
            </p>
          </div>

          {/* Star Rating */}
          <div className="text-center space-y-4">
            <div className="flex justify-center gap-2">
              {renderStars()}
            </div>
            {rating > 0 && (
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                {getRatingText()} ({rating}/5)
              </p>
            )}
          </div>

          {/* Experience Description */}
          <div className="space-y-3">
            <label className="block text-lg font-medium text-gray-900 dark:text-white">
              Describe your experience using the app
            </label>
            <Textarea
              placeholder="Tell us about your experience with the app. What did you like? What could be improved?"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              minRows={4}
              maxRows={8}
              maxLength={500}
              className="w-full"
            />
            <p className="text-xs text-gray-500 text-right">
              {experience.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              color="primary"
              isLoading={isSubmitting}
              startContent={!isSubmitting && <Send className="w-5 h-5" />}
              className="px-12 py-3 text-lg"
              onPress={handleSubmit}
              isDisabled={rating === 0 || !experience.trim()}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Thank you for taking the time to share your feedback with us!
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}