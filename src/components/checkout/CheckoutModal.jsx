import React, { useState } from 'react';
import { useEffect } from 'react';
import { useCreateOrder } from '../../hook/useOrders'

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems = [],
  product = null,
  variant = null,
  quantity = 1,
}) {
  const { mutateAsync: createOrder, isPending: isOrderPending } = useCreateOrder();

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState('');

  const [paymentMethod, setPaymentMethod] = useState("razorpay"); // 'razorpay' or 'cod'
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    postalCode: "",
    state: "",
    country: "India",
  });

  useEffect(() => {
    if (isOpen) {
      setIdempotencyKey(crypto.randomUUID());
    }
  }, [isOpen])

  if (!isOpen) return null;

  const cartList = cartItems.length > 0 ?
    cartItems.map(item => ({
      productId: item.id || item._Id,
      quantity: item.quantity,
      variantId: item.variantId?._id || item.variantId.id || undefined
    })) : [{
      productId: product.id || product._id,
      quantity: quantity,
      variantId: variant?.id || variant?._id || undefined

    }]

  const basePrice = cartItems.length > 0
    ? cartItems.reduce((acc, item) => acc + (item.quantity * item.price), 0)
    : (variant?.price || product?.price || 0) * quantity;

  const finalAmount = Math.max(0, basePrice - discount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    // Example logic: implement your backend coupon validation here
    if (couponCode.toUpperCase() === "SAVE100") {
      setDiscount(100);
    } else {
      alert("Invalid coupon code");
    }
  };
  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  }

  // Load Razorpay dynamic script
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckoutSubmit = async () => {
    try {
      setLoading(true);


      let orderPayloads = {
        idempotencyKey,
        items: cartList,
        paymentMethod,
        deliveryAddress: address,
        couponCode: discount > 0 ? couponCode : null,
        totalAmount: finalAmount,

      }
      if (paymentMethod === 'cod') {
        await createOrder(orderPayloads);
      } else {
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

        if (!res) {
          alert('Razorpay SDK failed to load. Check your internet connection.');
          setLoading(false);
          return;
        }
        // 1. Fetch order from backend
        const order = await createOrder(orderPayloads);

        const { id: order_id, amount, currency } = order;

        // 2. Configure Razorpay options matching your branding
        const options = {
          key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your test Key ID
          amount: amount.toString(),
          currency: currency,
          name: 'Stitch&Art',
          description: 'Secure E-Commerce Purchase',
          order_id: order_id,
          handler: function (response) {
            alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
            onClose(); // Close modal on success
          },
          theme: {
            color: '#F59E0B', // Matches your --color-primary amber token
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-[var(--color-background-card)] border border-white/10 rounded-2xl p-6 shadow-2xl relative text-[var(--color-foreground)] max-h-[90vh] overflow-y-auto">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[var(--color-foreground)] transition-colors cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-1 text-[var(--color-foreground)]">Complete Your Order</h2>
        <p className="text-xs text-gray-400 mb-6">
          {step === 1 ? "Step 1 of 2: Shipping & Details" : "Step 2 of 2: Payment & Review"}
        </p>

        {/* STEP 1: ADDRESS & CONTACT DETAILS */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={address.fullName}
                  onChange={handleAddressChange}
                  placeholder="John Doe"
                  className="w-full bg-[var(--color-surface)] border border-white/10 rounded-xl p-3 text-sm text-[var(--color-foreground)] focus:border-[var(--color-primary)] outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={address.phone}
                  onChange={handleAddressChange}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[var(--color-surface)] border border-white/10 rounded-xl p-3 text-sm text-[var(--color-foreground)] focus:border-[var(--color-primary)] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Street Address</label>
              <input
                type="text"
                name="addressLine"
                required
                value={address.addressLine}
                onChange={handleAddressChange}
                placeholder="House/Flat no., Street, Landmark"
                className="w-full bg-[var(--color-surface)] border border-white/10 rounded-xl p-3 text-sm text-[var(--color-foreground)] focus:border-[var(--color-primary)] outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={address.city}
                  onChange={handleAddressChange}
                  placeholder="City"
                  className="w-full bg-[var(--color-surface)] border border-white/10 rounded-xl p-3 text-sm text-[var(--color-foreground)] focus:border-[var(--color-primary)] outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">State</label>
                <input
                  type="text"
                  name="state"
                  required
                  value={address.state}
                  onChange={handleAddressChange}
                  placeholder="State"
                  className="w-full bg-[var(--color-surface)] border border-white/10 rounded-xl p-3 text-sm text-[var(--color-foreground)] focus:border-[var(--color-primary)] outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  value={address.postalCode}
                  onChange={handleAddressChange}
                  placeholder="PIN Code"
                  className="w-full bg-[var(--color-surface)] border border-white/10 rounded-xl p-3 text-sm text-[var(--color-foreground)] focus:border-[var(--color-primary)] outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full mt-4 py-3.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-black font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:opacity-90 cursor-pointer"
            >
              Proceed to Payment
            </button>
          </div>
        )}

        {/* STEP 2: SUMMARY, COUPON, PAYMENT METHOD */}
        {step === 2 && (
          <div className="space-y-4">
            {/* Product & Summary Box */}
            <div className="bg-[var(--color-surface)] p-4 rounded-xl border border-white/5 space-y-2">
              <div className="flex justify-between text-sm text-gray-300">
                <span>Item ({quantity}x):</span>
                <span className="font-semibold text-[var(--color-foreground)]">
                  {product?.name} {variant?.name ? `- ${variant.name}` : ""}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Subtotal:</span>
                <span>₹{basePrice}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-xs text-[var(--color-status-success)]">
                  <span>Discount Applied:</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-[var(--color-primary)] pt-2 border-t border-white/5">
                <span>Total Payable:</span>
                <span>₹{finalAmount}</span>
              </div>
            </div>

            {/* Coupon Code Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Coupon (e.g. SAVE100)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 bg-[var(--color-surface)] border border-white/10 rounded-xl px-3 py-2 text-sm text-[var(--color-foreground)] focus:border-[var(--color-primary)] outline-none uppercase"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-xs font-semibold rounded-xl transition-colors cursor-pointer text-[var(--color-foreground)]"
              >
                Apply
              </button>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Select Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`p-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 cursor-pointer transition-all ${paymentMethod === "razorpay"
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-foreground)]"
                    : "border-white/10 bg-[var(--color-surface)] text-gray-400"
                    }`}
                >
                  Razorpay (Online)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 cursor-pointer transition-all ${paymentMethod === "cod"
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-foreground)]"
                    : "border-white/10 bg-[var(--color-surface)] text-gray-400"
                    }`}
                >
                  Cash on Delivery
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-3.5 bg-white/10 hover:bg-white/20 text-sm font-semibold rounded-xl transition-colors cursor-pointer text-[var(--color-foreground)]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleCheckoutSubmit}
                disabled={loading}
                className="flex-1 py-3.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-black font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:opacity-90 cursor-pointer disabled:opacity-50"
              >
                {loading ? "Processing..." : `Pay ₹ ${finalAmount}`}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
