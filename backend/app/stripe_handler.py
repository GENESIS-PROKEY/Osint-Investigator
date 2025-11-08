"""
Stripe payment and subscription handler
"""
import stripe
from typing import Optional, Dict, Any
from app.config import settings

# Initialize Stripe
if settings.STRIPE_SECRET_KEY:
    stripe.api_key = settings.STRIPE_SECRET_KEY


PLAN_TO_PRICE: Dict[str, str] = {
    # Map internal plan keys to Stripe Price IDs (set in Stripe dashboard)
    # Example placeholders; replace with real price IDs
    "pro": "price_pro_INR_year",
    "investigator": "price_investigator_INR_year",
    "enterprise_basic": "price_enterprise_basic_INR_year",
}


async def create_checkout_session(plan_key: str, customer_email: str, success_url: str, cancel_url: str) -> Dict[str, Any]:
    """Create a Stripe checkout session for subscription."""
    if not settings.STRIPE_SECRET_KEY:
        raise ValueError("Stripe is not configured")

    price_id = PLAN_TO_PRICE.get(plan_key)
    if not price_id:
        raise ValueError("Unknown plan")

    session = stripe.checkout.Session.create(
        mode="subscription",
        payment_method_types=["card"],
        line_items=[{"price": price_id, "quantity": 1}],
        customer_email=customer_email,
        success_url=success_url + "?session_id={CHECKOUT_SESSION_ID}",
        cancel_url=cancel_url,
        allow_promotion_codes=True,
        metadata={"plan_key": plan_key},
    )
    return {"id": session["id"], "url": session.get("url")}


def construct_event_from_payload(payload: bytes, sig_header: str) -> stripe.Event:
    if not settings.STRIPE_WEBHOOK_SECRET:
        # Unsafe, but allows dev without signature
        return stripe.Event.construct_from({"type": "unknown", "data": {"object": {}}}, stripe.api_key)
    return stripe.Webhook.construct_event(
        payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
    )

