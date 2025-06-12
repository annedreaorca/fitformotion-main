"use client";
import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import { Input, Textarea } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { RadioGroup, Radio } from '@nextui-org/radio';
import { Checkbox } from '@nextui-org/checkbox';
import { 
  MessageSquare, 
  Star, 
  Send, 
  Bug, 
  Lightbulb, 
  Heart,
  ThumbsUp,
  AlertCircle
} from 'lucide-react';

export default function FeedbackPage() {
  const [feedbackType, setFeedbackType] = useState('');
  const [rating, setRating] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [allowContact, setAllowContact] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackTypes = [
    { key: 'bug', label: 'Bug Report', icon: Bug, color: 'text-red-500' },
    { key: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'text-yellow-500' },
    { key: 'improvement', label: 'Improvement Suggestion', icon: ThumbsUp, color: 'text-blue-500' },
    { key: 'general', label: 'General Feedback', icon: MessageSquare, color: 'text-green-500' },
    { key: 'complaint', label: 'Complaint', icon: AlertCircle, color: 'text-orange-500' },
    { key: 'compliment', label: 'Compliment', icon: Heart, color: 'text-pink-500' }
  ];

  const handleSubmit = async () => {
    if (!feedbackType || !subject || !message) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Reset form
    setFeedbackType('');
    setRating('');
    setSubject('');
    setMessage('');
    setEmail('');
    setAllowContact(false);
    setIsSubmitting(false);
    
    // Show success message (you can replace this with your toast system)
    alert('Thank you for your feedback! We appreciate your input.');
  };

  const renderStars = (currentRating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-6 h-6 cursor-pointer transition-colors ${
          index < currentRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
        onClick={() => setRating((index + 1).toString())}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            We Value Your Feedback
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Help us improve your workout experience by sharing your thoughts
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Feedback Type */}
            <Card shadow="sm">
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Feedback Type
                </h2>
              </CardHeader>
              <CardBody>
                <Select
                  placeholder="Select feedback type"
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value)}
                  required
                >
                  {feedbackTypes.map((type) => (
                    <SelectItem
                      key={type.key}
                      value={type.key}
                      startContent={<type.icon className={`w-4 h-4 ${type.color}`} />}
                    >
                      {type.label}
                    </SelectItem>
                  ))}
                </Select>
              </CardBody>
            </Card>

            {/* Rating */}
            <Card shadow="sm">
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Overall Rating
                </h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  <div className="flex gap-1">
                    {renderStars(parseInt(rating) || 0)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {rating ? `${rating} out of 5 stars` : 'Click to rate your experience'}
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Subject */}
          <Card shadow="sm">
            <CardHeader>
              <h2 className="text-xl font-semibold">Subject</h2>
            </CardHeader>
            <CardBody>
              <Input
                placeholder="Brief summary of your feedback"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">
                {subject.length}/100 characters
              </p>
            </CardBody>
          </Card>

          {/* Message */}
          <Card shadow="sm">
            <CardHeader>
              <h2 className="text-xl font-semibold">Details</h2>
            </CardHeader>
            <CardBody>
              <Textarea
                placeholder="Please provide detailed feedback. The more specific you are, the better we can address your concerns or suggestions."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                minRows={6}
                maxRows={10}
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">
                {message.length}/1000 characters
              </p>
            </CardBody>
          </Card>

          {/* Contact Information */}
          <Card shadow="sm">
            <CardHeader>
              <h2 className="text-xl font-semibold">Contact Information (Optional)</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                description="We'll only use this to follow up on your feedback if needed"
              />
              <Checkbox
                isSelected={allowContact}
                onValueChange={setAllowContact}
              >
                I&apos;m okay with being contacted about this feedback
              </Checkbox>
            </CardBody>
          </Card>

          {/* Quick Feedback Options */}
          <Card shadow="sm">
            <CardHeader>
              <h2 className="text-xl font-semibold">Quick Options</h2>
            </CardHeader>
            <CardBody>
              <RadioGroup orientation="horizontal" className="flex flex-wrap gap-4">
                <Radio value="anonymous">Submit Anonymously</Radio>
                <Radio value="public">Allow Public Display</Radio>
                <Radio value="private">Keep Private</Radio>
              </RadioGroup>
            </CardBody>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              type="button"
              size="lg"
              color="primary"
              isLoading={isSubmitting}
              startContent={!isSubmitting && <Send className="w-5 h-5" />}
              className="px-12"
              onPress={handleSubmit}
            >
              {isSubmitting ? 'Submitting...' : 'Send Feedback'}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Thank You!</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Your feedback helps us create a better workout experience for everyone. 
            We read every submission and use your input to prioritize improvements.
          </p>
        </div>
      </div>
    </div>
  );
}