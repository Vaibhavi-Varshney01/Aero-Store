"""
AI Service & Capgemini Generative Engine Client
Provides live LLM completions via Capgemini GenAI (openai.gpt-4o) with high-fidelity deterministic offline fallback.
"""
import json
import requests
from typing import Dict, Any, List, Optional
from ...core.config import settings
from ...core.models import ChatResponse

class AiService:
    def __init__(self):
        self.base_url = settings.openai.base_url.rstrip("/")
        self.api_key = settings.openai.api_key
        self.model = settings.openai.model
        self.timeout = settings.openai.timeout_seconds

    def call_llm(self, prompt: str, system_message: Optional[str] = None, temperature: float = 0.2, max_tokens: int = 1500) -> str:
        """Attempts live call to Capgemini Generative Engine / OpenAI; falls back to deterministic simulation on error."""
        messages = []
        if system_message:
            messages.append({"role": "system", "content": system_message})
        messages.append({"role": "user", "content": prompt})

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens
        }

        try:
            url = f"{self.base_url}/chat/completions"
            response = requests.post(url, headers=headers, json=payload, timeout=self.timeout)
            if response.status_code == 200:
                data = response.json()
                return data["choices"][0]["message"]["content"]
            else:
                print(f"[Capgemini GenAI] API returned status {response.status_code}: {response.text[:200]}")
        except Exception as e:
            print(f"[Capgemini GenAI] Connection error: {str(e)}")

        # Robust High-Fidelity Simulation Fallback
        return self._generate_fallback_response(prompt)

    def call_llm_with_tools(
        self,
        messages: List[Dict[str, Any]],
        tools: Optional[List[Dict[str, Any]]] = None,
        tool_choice: str = "auto",
        temperature: float = 0.1,
        max_tokens: int = 1000
    ) -> Optional[Dict[str, Any]]:
        """
        Calls Capgemini Generative Engine with tool definitions for agentic CRUD operations.
        Returns choice message dict containing 'content' and optional 'tool_calls'.
        """
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload: Dict[str, Any] = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens
        }
        if tools:
            payload["tools"] = tools
            payload["tool_choice"] = tool_choice

        try:
            url = f"{self.base_url}/chat/completions"
            response = requests.post(url, headers=headers, json=payload, timeout=self.timeout)
            if response.status_code == 200:
                data = response.json()
                return data["choices"][0]["message"]
            else:
                print(f"[Capgemini GenAI Tool] API status {response.status_code}: {response.text[:200]}")
        except Exception as e:
            print(f"[Capgemini GenAI Tool] Connection error: {str(e)}")

        return None

    def _generate_fallback_response(self, prompt: str) -> str:
        p_lower = prompt.lower()
        if "openapi" in p_lower or "scaffold" in p_lower:
            return "openapi: 3.0.0\ninfo:\n  title: Product & Cart Service API\n  version: 1.0.0\npaths:\n  /products:\n    get:\n      summary: List products\n      responses:\n        '200':\n          description: Success"
        elif "junit" in p_lower or "pytest" in p_lower or "test" in p_lower:
            return json.dumps({
                "testName": "Test_CartService_AddOutOfStockItem_ThrowsException",
                "scenario": "Customer attempts to add item with quantity exceeding available inventory",
                "expectedResult": "Throws OUT_OF_STOCK DomainException",
                "codeSnippet": "def test_add_out_of_stock():\n    with pytest.raises(OutOfStockException):\n        cart_service.add_item('cart-1', 'PROD-105', quantity=10)"
            })
        elif "code review" in p_lower or "order service" in p_lower:
            return json.dumps({
                "security_issues": ["Missing CSRF token on payment webhook", "SQL wildcard injection in search query"],
                "complexity_score": "B (Cyclomatic Complexity: 7)",
                "refactor_suggestions": ["Extract payment saga into standalone state machine", "Enforce positive quantity invariants at boundary"],
                "risk_level": "MEDIUM"
            })
        return "I am your AI assistant for the E-Commerce Platform. How can I assist you with products, orders, or AI use case simulations today?"

    def generate_comparison_verdict(self, products: List[Dict[str, Any]], persona: str = "general") -> Dict[str, Any]:
        """Synthesizes an AI buying verdict comparing multiple products for a specific shopper persona."""
        if not products:
            return {
                "winner_id": "",
                "winner_name": "None",
                "summary": "No products provided for comparison.",
                "pros_and_cons": {},
                "persona_fit": "N/A",
                "value_score": {},
                "recommendation": "Please select at least one product to compare."
            }

        persona_labels = {
            "general": "Everyday Balanced Shopper",
            "audiophile": "Audiophile & Sound Quality Enthusiast",
            "commuter": "Frequent Commuter & Travel Professional",
            "student_budget": "Budget-Conscious Student",
            "gamer": "High-Performance Gamer & Power User"
        }
        persona_name = persona_labels.get(persona.lower(), persona)

        prompt = (
            f"Analyze and compare the following products for a customer with persona: '{persona_name}'.\n"
            f"Products:\n{json.dumps(products, indent=2)}\n\n"
            "Return a strictly valid JSON object with keys:\n"
            "- winner_id (string, id of best product for this persona)\n"
            "- winner_name (string)\n"
            "- summary (string, 2 sentences explaining key trade-offs)\n"
            "- pros_and_cons (dict mapping product_id to {'pros': [list of 2 strings], 'cons': [list of 1 string]})\n"
            "- persona_fit (string explaining why the winner fits this persona)\n"
            "- value_score (dict mapping product_id to float score between 1.0 and 10.0)\n"
            "- recommendation (string, final actionable buying guidance)\n"
        )
        system_message = "You are AeroStore's AI Shopping Strategist. Provide concise, expert, unbiased buying advice."

        try:
            raw = self.call_llm(prompt, system_message=system_message, temperature=0.3, max_tokens=1000)
            # Try parsing JSON from LLM output
            cleaned = raw.strip()
            if "```json" in cleaned:
                cleaned = cleaned.split("```json")[1].split("```")[0].strip()
            elif "```" in cleaned:
                cleaned = cleaned.split("```")[1].split("```")[0].strip()
            parsed = json.loads(cleaned)
            if isinstance(parsed, dict) and "winner_id" in parsed:
                return parsed
        except Exception:
            pass

        return self._generate_comparison_fallback(products, persona, persona_name)

    def _generate_comparison_fallback(self, products: List[Dict[str, Any]], persona: str, persona_name: str) -> Dict[str, Any]:
        """Deterministic high-fidelity fallback for smart product comparison."""
        scores: Dict[str, float] = {}
        pros_cons: Dict[str, Dict[str, List[str]]] = {}

        p_type = persona.lower()

        for p in products:
            pid = p.get("id", "")
            price = float(p.get("price", 100.0))
            rating = float(p.get("rating", 4.5))
            cat = p.get("category", "").lower()
            specs = p.get("specs", {})

            base_score = min(10.0, max(1.0, rating * 1.8 + (200.0 - min(price, 300.0)) / 50.0))

            pros = []
            cons = []

            if p_type == "audiophile":
                if "audio" in cat or "electron" in cat:
                    base_score += 1.8
                    pros.append("Superior acoustic fidelity & hybrid active noise isolation")
                else:
                    base_score -= 1.0
                    cons.append("Not primarily engineered for dedicated high-fidelity acoustics")
            elif p_type == "commuter":
                if "battery" in str(specs).lower() or "watch" in cat or "headphone" in p.get("name", "").lower():
                    base_score += 1.5
                    pros.append("Outstanding battery endurance and portable form factor")
                else:
                    cons.append("Bulkier footprint less optimal for daily transit")
            elif p_type == "student_budget":
                if price <= 100.0:
                    base_score += 2.0
                    pros.append(f"Highly accessible price point (${price:.2f}) with premium build")
                else:
                    base_score -= 1.2
                    cons.append("Higher upfront investment on a tight budget")
            elif p_type == "gamer":
                if "keyboard" in p.get("name", "").lower() or "mouse" in p.get("name", "").lower() or "monitor" in p.get("name", "").lower():
                    base_score += 2.0
                    pros.append("Ultra-low input latency with esports-grade responsiveness")
                else:
                    cons.append("Standard refresh rate not optimized for competitive gaming")

            if not pros:
                pros.append(f"Top-tier {rating}★ user rating with official 2-year warranty")
            if not cons:
                cons.append("High consumer demand with limited promotional windows")

            scores[pid] = round(min(9.9, max(6.5, base_score)), 1)
            pros_cons[pid] = {"pros": pros[:2], "cons": cons[:1]}

        # Pick winner with highest score
        best_id = max(scores, key=scores.get)
        best_prod = next((p for p in products if p.get("id") == best_id), products[0])

        summary = (
            f"Comparing {len(products)} flagship items for the '{persona_name}' persona. "
            f"{best_prod.get('name')} emerges ahead with a score of {scores[best_id]}/10 based on value and feature alignment."
        )

        persona_fit = (
            f"For a {persona_name}, {best_prod.get('name')} delivers the optimal balance of specifications, "
            f"durability, and ergonomic design without unnecessary cost overhead."
        )

        recommendation = (
            f"Choose {best_prod.get('name')} for the best experience. "
            f"Add to cart with promo code SAVE20 at checkout for maximum savings."
        )

        return {
            "winner_id": best_id,
            "winner_name": best_prod.get("name", ""),
            "summary": summary,
            "pros_and_cons": pros_cons,
            "persona_fit": persona_fit,
            "value_score": scores,
            "recommendation": recommendation
        }


ai_service = AiService()
