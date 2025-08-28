"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  CreditCard,
  Loader2,
  CheckCircle,
  Package,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { createOrder } from "@/actions/order";

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface CheckoutFormProps {
  cartItems: any[];
}

export function CheckoutForm({ cartItems }: CheckoutFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [customerPhone, setCustomerPhone] = useState("");

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    const { street, city, state, zipCode, country } = shippingAddress;

    if (
      !street.trim() ||
      !city.trim() ||
      !state.trim() ||
      !zipCode.trim() ||
      !country.trim()
    ) {
      toast.error("Please fill in all required shipping address fields");
      return false;
    }

    return true;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsSubmitting(true);

    try {
      const items = cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      const tax = subtotal * 0.1;
      const shipping = subtotal > 100 ? 0 : 9.99;
      const total = subtotal + tax + shipping;

      const orderData = {
        shippingAddress,
        customerPhone: customerPhone || undefined,
        items,
        total,
      };

      const result = await createOrder(orderData);

      if (result.success) {
        setOrderSuccess(true);
        toast.success(result.message);

        // Redirect to orders page after a delay
        setTimeout(() => {
          router.push("/orders");
        }, 3000);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      toast.error("Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <Card className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
        <CardContent className="space-y-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
              Order Placed Successfully!
            </h2>
            <p className="text-green-600 dark:text-green-300 mb-4">
              Thank you for your order. You will receive a confirmation email
              shortly.
            </p>
          </div>
          <div className="space-y-3">
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
              onClick={() => router.push("/orders")}
            >
              <Package className="w-4 h-4 mr-2" />
              View Your Orders
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/products")}
              className="w-full"
            >
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmitOrder} className="space-y-6">
      {/* Shipping Address */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Package className="w-5 h-5" />
          Shipping Address
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="street">Street Address *</Label>
            <Input
              id="street"
              type="text"
              value={shippingAddress.street}
              onChange={(e) => handleInputChange("street", e.target.value)}
              placeholder="123 Main Street"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              type="text"
              value={shippingAddress.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              placeholder="New York"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              type="text"
              value={shippingAddress.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              placeholder="NY"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="zipCode">ZIP Code *</Label>
            <Input
              id="zipCode"
              type="text"
              value={shippingAddress.zipCode}
              onChange={(e) => handleInputChange("zipCode", e.target.value)}
              placeholder="10001"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="country">Country *</Label>
            <Input
              id="country"
              type="text"
              value={shippingAddress.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              placeholder="United States"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Information
        </h3>

        <div className="bg-muted/30 p-4 rounded-lg border border-dashed">
          <div className="text-center text-muted-foreground">
            <CreditCard className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">
              Payment processing will be handled securely
            </p>
            <p className="text-xs">
              This is a demo - no actual payment will be processed
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 border-0"
          size="lg"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing Order...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              <span>Place Order</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </Button>
      </div>

      {/* Terms */}
      <p className="text-xs text-muted-foreground text-center">
        By placing your order, you agree to our Terms of Service and Privacy
        Policy
      </p>
    </form>
  );
}
