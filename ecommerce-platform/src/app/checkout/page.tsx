'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { selectCartItems, selectCartTotal, clearCart } from '@/store/slices/cartSlice'
import { useToast } from '@/components/common/Toast'
import { Address } from '@/types'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { useFormik } from 'formik'
import api from '@/services/api'
import * as Yup from 'yup'

type Step = 'shipping' | 'payment' | 'review'

const steps: { key: Step; label: string; num: number }[] = [
  { key: 'shipping', label: 'Shipping',    num: 1 },
  { key: 'payment',  label: 'Payment',     num: 2 },
  { key: 'review',   label: 'Review',      num: 3 },
]

function formatPrice(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

// ─── Step 1: Shipping ────────────────────────────────────────────────────────

const ShippingSchema = Yup.object({
  street:     Yup.string().required('Street address is required'),
  city:       Yup.string().required('City is required'),
  state:      Yup.string().required('State is required'),
  postalCode: Yup.string().required('Postal code is required'),
  country:    Yup.string().required('Country is required'),
})

function ShippingStep({ onNext }: { onNext: (address: Address) => void }) {
  const formik = useFormik({
    initialValues: { street: '', city: '', state: '', postalCode: '', country: 'US' },
    validationSchema: ShippingSchema,
    onSubmit: (values) => onNext(values),
  })

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      <Input label="Street address" name="street" placeholder="123 Main Street"
        value={formik.values.street} onChange={formik.handleChange} onBlur={formik.handleBlur}
        error={formik.touched.street ? formik.errors.street : undefined} required />

      <div className="grid grid-cols-2 gap-4">
        <Input label="City" name="city" placeholder="New York"
          value={formik.values.city} onChange={formik.handleChange} onBlur={formik.handleBlur}
          error={formik.touched.city ? formik.errors.city : undefined} required />
        <Input label="State" name="state" placeholder="NY"
          value={formik.values.state} onChange={formik.handleChange} onBlur={formik.handleBlur}
          error={formik.touched.state ? formik.errors.state : undefined} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Postal code" name="postalCode" placeholder="10001"
          value={formik.values.postalCode} onChange={formik.handleChange} onBlur={formik.handleBlur}
          error={formik.touched.postalCode ? formik.errors.postalCode : undefined} required />
        <Input label="Country" name="country" placeholder="US"
          value={formik.values.country} onChange={formik.handleChange} onBlur={formik.handleBlur}
          error={formik.touched.country ? formik.errors.country : undefined} required />
      </div>

      <Button label="Continue to Payment" type="submit" fullWidth size="lg" />
    </form>
  )
}

// ─── Step 2: Payment ──────────────────────────────────────────────────────────

const PaymentSchema = Yup.object({
  cardNumber: Yup.string().min(16, 'Enter a valid card number').required('Card number is required'),
  expiry:     Yup.string().matches(/^\d{2}\/\d{2}$/, 'Format: MM/YY').required('Expiry is required'),
  cvc:        Yup.string().min(3, 'Enter a valid CVC').required('CVC is required'),
  name:       Yup.string().required('Cardholder name is required'),
})

function PaymentStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const formik = useFormik({
    initialValues: { cardNumber: '', expiry: '', cvc: '', name: '' },
    validationSchema: PaymentSchema,
    onSubmit: () => onNext(),
  })

  // Auto-format card number with spaces
  const handleCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16)
    formik.setFieldValue('cardNumber', val)
  }

  // Auto-format expiry MM/YY
  const handleExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4)
    if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2)
    formik.setFieldValue('expiry', val)
  }

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-700 font-medium">Test card number</p>
        <p className="text-xs text-blue-600 mt-1">4242 4242 4242 4242  |  12/26  |  123</p>
      </div>

      <Input label="Cardholder name" name="name" placeholder="John Doe"
        value={formik.values.name}
        onChange={formik.handleChange} onBlur={formik.handleBlur}
        error={formik.touched.name ? formik.errors.name : undefined} required />

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Card number <span className="text-red-500">*</span>
        </label>
        <input
          name="cardNumber"
          placeholder="4242 4242 4242 4242"
          value={formik.values.cardNumber.replace(/(\d{4})/g, '$1 ').trim()}
          onChange={handleCardNumber}
          onBlur={formik.handleBlur}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        {formik.touched.cardNumber && formik.errors.cardNumber && (
          <p className="text-xs text-red-500 mt-1">{formik.errors.cardNumber}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Expiry <span className="text-red-500">*</span></label>
          <input name="expiry" placeholder="MM/YY"
            value={formik.values.expiry}
            onChange={handleExpiry} onBlur={formik.handleBlur}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          {formik.touched.expiry && formik.errors.expiry && (
            <p className="text-xs text-red-500 mt-1">{formik.errors.expiry}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">CVC <span className="text-red-500">*</span></label>
          <input name="cvc" placeholder="123"
            value={formik.values.cvc}
            onChange={e => formik.setFieldValue('cvc', e.target.value.replace(/\D/g, '').slice(0, 4))}
            onBlur={formik.handleBlur}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          {formik.touched.cvc && formik.errors.cvc && (
            <p className="text-xs text-red-500 mt-1">{formik.errors.cvc}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button label="Back" variant="secondary" onClick={onBack} size="lg" className="flex-1" />
        <Button label="Review Order" type="submit" size="lg" className="flex-1" />
      </div>
    </form>
  )
}

// ─── Step 3: Review ───────────────────────────────────────────────────────────

function ReviewStep({
  address, onBack, onPlace, isPlacing,
}: {
  address: Address
  onBack: () => void
  onPlace: () => void
  isPlacing: boolean
}) {
  const items = useAppSelector(selectCartItems)
  const total = useAppSelector(selectCartTotal)
  const shipping = total >= 50 ? 0 : 9.99
  const tax = total * 0.08

  return (
    <div className="space-y-6">
      {/* Items */}
      <div>
        <h3 className="font-semibold text-slate-800 mb-3">Items ({items.length})</h3>
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-slate-600">{item.product.name} × {item.quantity}</span>
              <span className="font-medium">{formatPrice((item.product.discountPrice ?? item.product.price) * item.quantity)}</span>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Shipping address */}
      <div>
        <h3 className="font-semibold text-slate-800 mb-2">Shipping to</h3>
        <p className="text-sm text-slate-600">{address.street}, {address.city}, {address.state} {address.postalCode}, {address.country}</p>
      </div>

      <hr className="border-slate-100" />

      {/* Totals */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm"><span className="text-slate-600">Subtotal</span><span>{formatPrice(total)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-slate-600">Shipping</span><span className={shipping === 0 ? 'text-emerald-600 font-medium' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-slate-600">Tax</span><span>{formatPrice(tax)}</span></div>
        <div className="flex justify-between font-bold text-lg border-t border-slate-100 pt-2 mt-2">
          <span>Total</span>
          <span>{formatPrice(total + shipping + tax)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button label="Back" variant="secondary" onClick={onBack} size="lg" className="flex-1" />
        <Button label="Place Order" onClick={onPlace} isLoading={isPlacing} size="lg" className="flex-1" />
      </div>
    </div>
  )
}

// ─── Main Checkout Page ───────────────────────────────────────────────────────

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<Step>('shipping')
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null)
  const [isPlacing, setIsPlacing] = useState(false)

  const dispatch      = useAppDispatch()
  const router        = useRouter()
  const { showToast } = useToast()
  const cartTotal     = useAppSelector(selectCartTotal)
  const cartItems     = useAppSelector(selectCartItems)

  const handleShippingNext = (address: Address) => {
    setShippingAddress(address)
    setCurrentStep('payment')
  }

// Replace handlePlaceOrder with this:
const handlePlaceOrder = async () => {
  if (!shippingAddress) return
  setIsPlacing(true)

  try {
    await api.post('/orders', {
      items: cartItems.map(i => ({
        productId: i.product.id,
        quantity:  i.quantity,
        price:     Number(i.product.discountPrice ?? i.product.price),
      })),
      shippingAddress,
      paymentMethod: 'CREDIT_CARD',
    })

    dispatch(clearCart())
    showToast('Order placed successfully! 🎉', 'success')
    router.push('/dashboard/orders')
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to place order'
    showToast(message, 'error')
  } finally {
    setIsPlacing(false)
  }
}

  const currentStepIndex = steps.findIndex(s => s.key === currentStep)

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-10">
          {steps.map((step, i) => (
            <div key={step.key} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  i < currentStepIndex  ? 'bg-emerald-600 text-white'
                  : i === currentStepIndex ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                  : 'bg-slate-200 text-slate-400'
                }`}>
                  {i < currentStepIndex ? '✓' : step.num}
                </div>
                <span className={`text-xs mt-1.5 font-medium ${i === currentStepIndex ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-0.5 w-24 mx-3 mt-[-18px] transition-colors ${i < currentStepIndex ? 'bg-emerald-600' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl border border-slate-100 p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            {currentStep === 'shipping' && 'Shipping Address'}
            {currentStep === 'payment'  && 'Payment Details'}
            {currentStep === 'review'   && 'Review Your Order'}
          </h2>

          {currentStep === 'shipping' && <ShippingStep onNext={handleShippingNext} />}
          {currentStep === 'payment'  && (
            <PaymentStep
              onNext={() => setCurrentStep('review')}
              onBack={() => setCurrentStep('shipping')}
            />
          )}
          {currentStep === 'review' && shippingAddress && (
            <ReviewStep
              address={shippingAddress}
              onBack={() => setCurrentStep('payment')}
              onPlace={handlePlaceOrder}
              isPlacing={isPlacing}
            />
          )}
        </div>
      </div>
    </div>
  )
}