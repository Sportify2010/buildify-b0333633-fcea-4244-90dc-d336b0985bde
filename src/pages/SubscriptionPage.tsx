
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../components/ui/use-toast';
import { CreditCard, Building, Check } from 'lucide-react';
import PaypalIcon from '../components/icons/PaypalIcon';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const SubscriptionPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('card');

  const handleSubscribe = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to subscribe",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: {
          payment_method: paymentMethod,
          payment_id: `sim_${Date.now()}`, // Simulated payment ID
          amount: 60,
          currency: 'THB'
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Subscription successful!",
        description: "You now have access to all premium content",
        variant: "default",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container max-w-4xl py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Subscribe to Sportify Premium</h1>
        <p className="text-muted-foreground mt-2">
          Get unlimited access to all sports content in high quality
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Premium Subscription</CardTitle>
          <CardDescription>
            Watch all sports events in HD and 4K quality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold">฿60<span className="text-lg font-normal text-muted-foreground">/month</span></div>
                <p className="text-muted-foreground">Approximately $1.86 USD</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Access to all live sports events</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>HD and 4K streaming quality</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Watch on any device</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>No ads during streaming</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Event notifications</span>
              </div>
            </div>

            <Tabs defaultValue="card" onValueChange={setPaymentMethod}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="card">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Card
                </TabsTrigger>
                <TabsTrigger value="bank_transfer">
                  <Building className="h-4 w-4 mr-2" />
                  Bank
                </TabsTrigger>
                <TabsTrigger value="paypal">
                  <PaypalIcon className="h-4 w-4 mr-2" />
                  PayPal
                </TabsTrigger>
              </TabsList>
              <TabsContent value="card" className="mt-4">
                <p className="text-sm text-muted-foreground">Pay with your credit or debit card.</p>
              </TabsContent>
              <TabsContent value="bank_transfer" className="mt-4">
                <p className="text-sm text-muted-foreground">Pay directly from your bank account.</p>
              </TabsContent>
              <TabsContent value="paypal" className="mt-4">
                <p className="text-sm text-muted-foreground">Pay using your PayPal account.</p>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleSubscribe}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Subscribe Now"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SubscriptionPage;