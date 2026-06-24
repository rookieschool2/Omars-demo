'use client';
import { useEffect, useState } from 'react';
import { getCart, saveCart } from '@/lib/cart';

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export default function Order() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState({});
  const [step, setStep] = useState('browse');
  const [error, setError] = useState('');
  const [pendingOrder, setPendingOrder] = useState(null);
  const [sentCode, setSentCode] = useState('');
  const [codeInput, setCodeInput] = useState('');

  useEffect(() => {
    fetch('/api/menu-items')
      .then((r) => r.json())
      .then(setMenu);
    setCart(getCart());
  }, []);

  function updateCart(next) {
    setCart(next);
    saveCart(next);
  }

  function addToCart(item) {
    updateCart({ ...cart, [item.id]: { item, qty: (cart[item.id]?.qty || 0) + 1 } });
  }
  function removeFromCart(item) {
    const next = { ...cart };
    if (!next[item.id]) return;
    if (next[item.id].qty <= 1) delete next[item.id];
    else next[item.id] = { item, qty: next[item.id].qty - 1 };
    updateCart(next);
  }

  const cartLines = Object.values(cart);
  const total = cartLines.reduce((sum, line) => sum + line.item.price * line.qty, 0);

  function handleCheckout(e) {
    e.preventDefault();
    if (cartLines.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    const form = new FormData(e.target);
    const payload = {
      customerName: form.get('name'),
      contact: form.get('contact'),
      items: cartLines.map((l) => ({ name: l.item.name, qty: l.qty, price: l.item.price })),
      total,
    };
    if (!payload.customerName || !payload.contact) {
      setError('Please fill in your name and contact info.');
      return;
    }
    setError('');
    setPendingOrder(payload);
    setSentCode(generateCode());
    setCodeInput('');
    setStep('verify');
  }

  async function handleVerify(e) {
    e.preventDefault();
    if (codeInput !== sentCode) {
      setError("That code doesn't match. Check it and try again.");
      return;
    }
    setError('');
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pendingOrder),
    });
    if (res.ok) {
      updateCart({});
      setStep('confirmed');
    } else {
      setError('Something went wrong placing your order.');
    }
  }

  if (step === 'confirmed') {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <h1 className="font-serif text-3xl text-brand-burgundy">Order placed</h1>
        <p className="mt-4">Thanks! This is a demo order. No real payment was charged.</p>
      </div>
    );
  }

  if (step === 'verify') {
    return (
      <div className="max-w-md mx-auto px-6 py-16">
        <h1 className="font-serif text-3xl text-brand-burgundy mb-4">Verify Your Order</h1>
        <p className="mb-2">
          We sent a 6-digit code to {pendingOrder.contact} to confirm this order is really you.
        </p>
        <p className="mb-6 text-sm text-brand-dark/60">
          Demo only: in a real deployment this code would arrive by text or email. For this demo,
          your code is <span className="font-serif text-brand-gold text-lg">{sentCode}</span>.
        </p>
        <form onSubmit={handleVerify} className="space-y-3">
          {error && <p className="text-red-700 text-sm">{error}</p>}
          <input
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            placeholder="Enter 6-digit code"
            className="w-full border border-brand-gold px-3 py-2"
          />
          <button
            type="submit"
            className="w-full bg-brand-burgundy text-brand-cream px-4 py-2 uppercase text-sm tracking-wide hover:bg-brand-gold hover:text-brand-dark transition"
          >
            Confirm Order
          </button>
        </form>
        <button
          type="button"
          onClick={() => setStep('browse')}
          className="mt-4 text-sm text-brand-burgundy underline"
        >
          Back to cart
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-10">
      <div className="md:col-span-2">
        <h1 className="font-serif text-4xl text-brand-burgundy mb-8">Order Online</h1>
        <ul className="space-y-3">
          {menu.map((item) => (
            <li key={item.id} className="flex justify-between items-center border-b border-brand-gold/40 pb-2">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-brand-dark/70">{item.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-serif text-brand-gold">${item.price.toFixed(2)}</span>
                <button
                  onClick={() => addToCart(item)}
                  className="bg-brand-burgundy text-brand-cream px-3 py-1 text-sm uppercase hover:bg-brand-gold hover:text-brand-dark transition"
                >
                  Add
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-serif text-2xl text-brand-burgundy mb-4">Your Order</h2>
        {cartLines.length === 0 && <p className="text-sm text-brand-dark/60">No items yet.</p>}
        <ul className="space-y-2 mb-4">
          {cartLines.map((line) => (
            <li key={line.item.id} className="flex justify-between items-center text-sm">
              <span>{line.qty} &times; {line.item.name}</span>
              <button onClick={() => removeFromCart(line.item)} className="text-brand-burgundy underline text-xs">
                remove
              </button>
            </li>
          ))}
        </ul>
        <p className="font-serif text-lg mb-4">Total: ${total.toFixed(2)}</p>
        <form onSubmit={handleCheckout} className="space-y-3">
          {error && <p className="text-red-700 text-sm">{error}</p>}
          <input name="name" placeholder="Name" className="w-full border border-brand-gold px-3 py-2" />
          <input name="contact" placeholder="Email or phone" className="w-full border border-brand-gold px-3 py-2" />
          <button
            type="submit"
            className="w-full bg-brand-burgundy text-brand-cream px-4 py-2 uppercase text-sm tracking-wide hover:bg-brand-gold hover:text-brand-dark transition"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
}
