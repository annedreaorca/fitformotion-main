"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Button,
  Card,
  CardBody
} from "@nextui-org/react";
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  coachId: string;
  coachName: string;
}

export const PaymentModal = ({ isOpen, onClose, coachId, coachName }: PaymentModalProps) => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleProceedToPayment = () => {
    if (!user) return;
    
    setIsLoading(true);
    
    // Store coach selection data in localStorage for after payment
    localStorage.setItem('pendingCoachSelection', JSON.stringify({
      userId: user.id,
      coachId,
      coachName,
      timestamp: Date.now()
    }));
    
 // Open payment link in new tab
    window.open('https://checkout.xendit.co/od/fitformotion', '_blank');
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="lg"
      backdrop="blur"
      classNames={{
        backdrop: "bg-black/50",
        base: "bg-zinc-900 border border-zinc-800",
        header: "border-b border-zinc-800",
        body: "py-6",
        footer: "border-t border-zinc-800"
      }}
    >
      <ModalContent>
        <ModalHeader className="text-white">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">Payment for Coaching Program</h3>
            <p className="text-sm text-zinc-400">
              Pay ₱500 to select Coach {coachName}
            </p>
          </div>
        </ModalHeader>
        
        <ModalBody>
          <div className="space-y-4">
            <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">Coach Selection Fee</span>
                <span className="text-white font-bold">₱500.00</span>
              </div>
              <p className="text-sm text-zinc-400">
                One-time payment to get started with Coach {coachName}
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-zinc-300 font-medium">Payment Method:</p>
              
              <Card className="border-2 border-zinc-700 bg-zinc-800/30">
                <CardBody className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Secure Payment</h4>
                      <p className="text-zinc-400 text-sm">GCash, PayMaya, Credit Card, and more</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
              
              <div className="bg-zinc-800/30 p-3 rounded-lg border border-zinc-700">
                <p className="text-xs text-zinc-400 text-center">
                  You&apos;ll be redirected to a secure payment page to complete your transaction
                </p>
              </div>
            </div>
          </div>
        </ModalBody>
        
        <ModalFooter>
          <Button 
            variant="bordered" 
            onPress={onClose}
            className="border-zinc-600 text-zinc-300"
          >
            Cancel
          </Button>
          <Button 
            color="primary"
            onPress={handleProceedToPayment}
            isLoading={isLoading}
          >
            {isLoading ? "Redirecting..." : "Proceed to Payment"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};