import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };

  try {
    const { code, discountType, discountValue, maxUses, expiryDate, description } = JSON.parse(event.body);

    if (!code || !discountType || !discountValue) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Missing required fields: code, discountType, discountValue' }) };
    }

    // Step 1: Create a Stripe Coupon
    const couponParams: Stripe.CouponCreateParams = {
      name: description || code,
      duration: 'once',
      metadata: { created_by: 'neome_admin', code },
    };

    if (discountType === 'percent') {
      couponParams.percent_off = Number(discountValue);
    } else {
      // Stripe uses smallest currency unit (cents for EUR)
      couponParams.amount_off = Math.round(Number(discountValue) * 100);
      couponParams.currency = 'eur';
    }

    const coupon = await stripe.coupons.create(couponParams);

    // Step 2: Create a Promotion Code attached to the coupon
    const promoParams: Stripe.PromotionCodeCreateParams = {
      coupon: coupon.id,
      code: code.toUpperCase(),
      active: true,
    };

    if (maxUses && Number(maxUses) > 0) {
      promoParams.max_redemptions = Number(maxUses);
    }

    if (expiryDate) {
      promoParams.expires_at = Math.floor(new Date(expiryDate).getTime() / 1000);
    }

    const promoCode = await stripe.promotionCodes.create(promoParams);

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({
        stripePromoId: promoCode.id,
        stripeCouponId: coupon.id,
        code: promoCode.code,
        active: promoCode.active,
      }),
    };
  } catch (error: any) {
    console.error('admin-create-promo-code error:', error);
    // Handle duplicate code errors gracefully
    if (error.code === 'resource_already_exists') {
      return { statusCode: 409, headers: CORS, body: JSON.stringify({ error: 'A promo code with this code already exists in Stripe.' }) };
    }
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: error.message }) };
  }
}
