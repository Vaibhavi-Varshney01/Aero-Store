"""
AeroStore Enterprise Knowledge Base for Retrieval-Augmented Generation (RAG).
Curated authoritative documentation spanning store policies, product manuals, ADRs, and promotions.
"""
from typing import List, Dict, Any

KNOWLEDGE_DOCUMENTS: List[Dict[str, Any]] = [
    # --------------------------------------------------------------------------
    # 1. STORE POLICIES & CUSTOMER SERVICE
    # --------------------------------------------------------------------------
    {
        "doc_id": "POL-001",
        "title": "AeroStore 30-Day Return & Refund Policy",
        "category": "Customer Support & Policies",
        "tags": ["returns", "refunds", "rma", "30 days", "money back", "satisfaction"],
        "content": (
            "AeroStore offers a 30-day risk-free return guarantee on all physical products purchased from our storefront. "
            "To be eligible for a full refund, items must be in their original packaging, with all accessories, cables, and documentation included. "
            "Customers can initiate an RMA (Return Merchandise Authorization) via the portal or customer service. "
            "Once received at our fulfillment hub, refunds are credited to the original payment method within 3 to 5 business days. "
            "Return shipping is completely free for damaged or defective units."
        )
    },
    {
        "doc_id": "POL-002",
        "title": "AeroStore 2-Year Limited Hardware Warranty",
        "category": "Customer Support & Policies",
        "tags": ["warranty", "repair", "hardware", "replacement", "defects", "guarantee"],
        "content": (
            "All electronic hardware devices (including HyperSound Headphones, Titan Pro Smartwatches, keyboards, and monitors) "
            "come with a comprehensive 2-Year Limited Manufacturer Warranty. "
            "This warranty covers internal component failures, manufacturing defects, battery degradation exceeding 20% within the first year, "
            "and display panel anomalies. The warranty does not cover accidental physical damage, unauthorized disassemblies, or immersion beyond certified IPX water ratings. "
            "Warranty claims are processed within 48 hours, providing expedited replacement units."
        )
    },
    {
        "doc_id": "POL-003",
        "title": "Domestic & International Shipping Delivery SLAs",
        "category": "Shipping & Logistics",
        "tags": ["shipping", "delivery", "sla", "express", "tracking", "fedex", "ups", "international"],
        "content": (
            "AeroStore operates high-velocity automated fulfillment hubs. Orders placed before 2:00 PM EST qualify for same-day dispatch. "
            "Standard Domestic Shipping is delivered within 2 business days via FedEx/UPS Express for a flat fee or free on orders above $75. "
            "Overnight Priority Shipping guarantees next-day delivery by 10:30 AM. "
            "International shipping is supported across 42 countries with all import customs duties and VAT prepaid at checkout (DDP terms)."
        )
    },

    # --------------------------------------------------------------------------
    # 2. PRODUCT SPECIFICATIONS & USER MANUALS
    # --------------------------------------------------------------------------
    {
        "doc_id": "PROD-SPEC-101",
        "title": "HyperSound ANC Wireless Headphones (PROD-101) Technical Manual",
        "category": "Product Specifications",
        "tags": ["headphones", "hypersound", "anc", "noise cancellation", "battery", "bluetooth", "audio"],
        "content": (
            "HyperSound ANC Wireless Headphones (Model PROD-101) feature custom 40mm beryllium drivers delivering 20Hz - 40kHz Hi-Res Audio. "
            "Equipped with Hybrid Active Noise Cancellation (ANC) utilizing 6 external feed-forward and feed-back microphones, reducing ambient noise by up to 35dB. "
            "Battery life offers 40 continuous hours with ANC enabled, or 60 hours with ANC disabled. "
            "Fast-charging via USB-C provides 5 hours of playback from a 10-minute charge. Supports Bluetooth 5.3 with AAC, LDAC, and multipoint dual-device pairing."
        )
    },
    {
        "doc_id": "PROD-SPEC-102",
        "title": "Mechanical RGB Gaming Keyboard (PROD-102) Technical Specifications",
        "category": "Product Specifications",
        "tags": ["keyboard", "mechanical", "rgb", "switches", "gaming", "hot-swap", "anti-ghosting"],
        "content": (
            "The AeroStore Mechanical RGB Gaming Keyboard (Model PROD-102) is engineered for high-performance esports and coding. "
            "Features hot-swappable pre-lubricated linear Red mechanical switches (45g actuation force, 2.0mm pre-travel) rated for 80 million keystrokes. "
            "Includes per-key 16.8M color customizable RGB illumination with onboard memory profiles, 1000Hz polling rate, full N-Key Rollover (NKRO) anti-ghosting, "
            "and aircraft-grade anodized aluminum top plate with detachable braided USB-C cable."
        )
    },
    {
        "doc_id": "PROD-SPEC-103",
        "title": "Ergonomic Vertical Wireless Mouse (PROD-103) Specifications",
        "category": "Product Specifications",
        "tags": ["mouse", "ergonomic", "vertical", "wrist", "dpi", "wireless", "sensor"],
        "content": (
            "The Ergonomic Vertical Wireless Mouse (Model PROD-103) is scientifically sculpted with a 57-degree natural handshake posture "
            "to alleviate forearm tension and carpal tunnel strain. Features an optical precision sensor adjustable from 800 to 4000 DPI, "
            "ultra-quiet acoustic silent-click switches (90% noise reduction), textured rubber thumb grip with forward/backward navigation keys, "
            "and dual connectivity via 2.4GHz USB nano-receiver or Bluetooth LE with up to 18 months of battery life on a single AA cell."
        )
    },
    {
        "doc_id": "PROD-SPEC-104",
        "title": "Ultra-Wide Curved Gaming Monitor 34\" (PROD-104) Specifications",
        "category": "Product Specifications",
        "tags": ["monitor", "curved", "ultrawide", "144hz", "1ms", "wqhd", "display", "hdr"],
        "content": (
            "The Ultra-Wide Curved Gaming Monitor (Model PROD-104) features a 34-inch 21:9 panoramic VA panel with 1500R curvature matching the human eye field of view. "
            "Resolution: 3440 x 1440 WQHD with 144Hz high refresh rate and 1ms Moving Picture Response Time (MPRT). "
            "Supports AMD FreeSync Premium Pro, HDR400 with 99% sRGB color gamut coverage, dual HDMI 2.1, DisplayPort 1.4, "
            "and integrated dual 5W stereo speakers with TÜV Rheinland certified low blue light and flicker-free eye care technology."
        )
    },
    {
        "doc_id": "PROD-SPEC-105",
        "title": "Titan Pro Smartwatch (PROD-105) Specifications & Water Resistance",
        "category": "Product Specifications",
        "tags": ["smartwatch", "titan pro", "battery", "waterproof", "sensors", "health", "5atm", "gps"],
        "content": (
            "The Titan Pro Smartwatch (Model PROD-105) boasts a 1.43-inch Always-On AMOLED display with 1000 nits peak brightness encased in titanium alloy. "
            "Equipped with advanced biometric sensors: continuous 24/7 heart rate, blood oxygen saturation (SpO2), stress monitoring, and scientific sleep stage analysis. "
            "Features dual-band 5-satellite GPS tracking and 100+ athletic sport modes. "
            "Water resistance is certified to 5ATM (50 meters depth ISO 22810), suitable for swimming. Battery lasts up to 14 days under typical use."
        )
    },

    # --------------------------------------------------------------------------
    # 3. ARCHITECTURAL DECISION RECORDS (ADRs) & PLATFORM SECURITY
    # --------------------------------------------------------------------------
    {
        "doc_id": "ADR-001",
        "title": "ADR-001: Adoption of Microservices Architecture for Online Shopping",
        "category": "Architecture & Engineering Governance",
        "tags": ["adr", "architecture", "microservices", "monolith", "scale", "concurrency", "tradeoffs"],
        "content": (
            "Context: The AeroStore e-commerce platform must scale to handle 10,000 concurrent shopping sessions with peak bursts during flash sales. "
            "Decision: Adopt a microservices architecture separating Product Catalog, Cart, Order Orchestration, and Payment Gateway into discrete domains. "
            "Consequences: Facilitates independent autoscaling, fault isolation (a spike in cart updates does not degrade catalog browsing), "
            "and contract-first REST boundaries with OpenAPI 3.0. Mitigates monolithic single-point-of-failure risks at the cost of distributed transaction orchestration."
        )
    },
    {
        "doc_id": "ADR-002",
        "title": "ADR-002: Strict Prohibition of AI/LLMs in Payment Settlement & Financial Invariants",
        "category": "Architecture & Engineering Governance",
        "tags": ["adr", "ai safety", "payment", "settlement", "deterministic", "sla", "security", "financial"],
        "content": (
            "Context: Proposals were evaluated regarding using GenAI LLMs to negotiate dynamic discounts and automate payment settlement logic. "
            "Decision: AI/LLMs are strictly forbidden from participating in payment settlement, price calculation, or financial transaction authorization. "
            "Rationale: LLMs are non-deterministic and susceptible to prompt injection, hallucinated discount states, and parameter tampering. "
            "Payment settlement must execute exclusively through deterministic ACID code with RFC 7807 structured problem details, strict idempotency tokens, "
            "and a hard 1500ms SLA timeout with automated saga rollback."
        )
    },
    {
        "doc_id": "TECH-OCC",
        "title": "Optimistic Concurrency Control (OCC) & Cart Versioning Invariants",
        "category": "Architecture & Engineering Governance",
        "tags": ["occ", "concurrency", "race condition", "cart version", "versioning", "conflict"],
        "content": (
            "AeroStore utilizes Optimistic Concurrency Control (OCC) to guarantee cart consistency across multiple browser tabs and mobile sessions. "
            "Every cart state contains an integer `concurrency_version` token. Any mutation (add item, update quantity, remove item) "
            "must submit the `expected_version`. If a concurrent modification has updated the version in the interim, the server rejects the request "
            "with an RFC 7807 HTTP 409 Conflict status. This prevents lost update race conditions without requiring coarse-grained database locks."
        )
    },

    # --------------------------------------------------------------------------
    # 4. PROMOTIONS, COUPONS & INVENTORY RULES
    # --------------------------------------------------------------------------
    {
        "doc_id": "PROMO-001",
        "title": "Promotional Coupons, Eligibility Rules & Stacking Policy",
        "category": "Promotions & Discounts",
        "tags": ["coupons", "promo", "save20", "flash50", "discount", "eligibility", "terms"],
        "content": (
            "AeroStore provides verified promotional coupon codes with automated validation rules: "
            "1. `SAVE20`: Grants 20% discount on orders where cart subtotal is $50 or more. "
            "2. `FLASH50`: Grants 50% discount on flash sales for orders exceeding $200. "
            "3. Stacking Policy: Only one promotional coupon code can be applied per checkout session. "
            "4. Edge Case Codes: Code `EXPIRED30` is permanently expired (testing HTTP 400 rejection), "
            "and `MINSPEND100` requires a minimum spend of $100.00. Maximum item quantity per cart line item is strictly capped at 99 units."
        )
    }
]
