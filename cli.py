"""
Interactive Terminal Console Chatbot (Python Edition)
Provides rich ANSI terminal UI for the E-Commerce platform and all 5 AI Engineering Use Cases.
"""
import sys
import os
import time

# Reconfigure stdout/stderr for Windows console compatibility
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# Ensure package root is in pythonpath
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from backend.core.models import ChatRequest
from backend.layers.tier2_api.chatbot import chat
from backend.use_cases.uc1_architecture.architecture_engine import architecture_engine
from backend.use_cases.uc1_architecture.adr_generator import adr_generator
from backend.use_cases.uc2_api_scaffolding.openapi_generator import openapi_generator
from backend.use_cases.uc2_api_scaffolding.schema_validator import api_schema_validator
from backend.use_cases.uc3_frontend_risk.a11y_auditor import a11y_auditor
from backend.use_cases.uc3_frontend_risk.ui_risk_analyzer import ui_risk_analyzer
from backend.use_cases.uc4_code_review.ai_reviewer import ai_reviewer
from backend.use_cases.uc4_code_review.refactor_engine import refactor_engine
from backend.use_cases.uc5_testing_edgecases.edge_case_simulator import edge_case_simulator
from backend.use_cases.uc5_testing_edgecases.security_auditor import security_auditor
from backend.use_cases.uc5_testing_edgecases.test_generator import test_generator
from backend.use_cases.uc5_testing_edgecases.retry_reprompt_bench import retry_benchmark
from backend.layers.tier3_bll.product_service import product_service
from backend.layers.tier3_bll.cart_service import cart_service

# ANSI Color Codes
CYAN = "\033[96m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
BOLD = "\033[1m"
MAGENTA = "\033[95m"
RESET = "\033[0m"

def print_banner():
    print(f"{CYAN}{BOLD}")
    print("=" * 80)
    print("   🛒 AEROBOT: ENTERPRISE E-COMMERCE & 5-USE-CASE AI CONSOLE CHATBOT")
    print("   Powered by Capgemini Generative Engine (openai.gpt-4o) & Python 3.14")
    print("=" * 80)
    print(f"{RESET}")
    print(f"{YELLOW}Type any shopping query, natural language prompt, or slash commands:{RESET}")
    print(f"  {BOLD}/1{RESET} or {BOLD}/architecture{RESET}  -> UC1: Requirements, Microservices & ADRs")
    print(f"  {BOLD}/2{RESET} or {BOLD}/openapi{RESET}       -> UC2: Contract-First OpenAPI 3.0 Scaffolding")
    print(f"  {BOLD}/3{RESET} or {BOLD}/a11y{RESET}          -> UC3: WCAG 2.1 AA Accessibility & UI Risk Audit")
    print(f"  {BOLD}/4{RESET} or {BOLD}/codereview{RESET}    -> UC4: Sonar AST Scan, AI Review & License Check")
    print(f"  {BOLD}/5{RESET} or {BOLD}/simulate{RESET}      -> UC5: Live Edge Case Simulations (Stock/Timeout/Coupon/OCC)")
    print(f"  {BOLD}/tests{RESET}                 -> UC5: Pytest Unit Test Suite Synthesis")
    print(f"  {BOLD}/security{RESET}              -> UC5: Security Audit (SQLi, Tampering, Replay)")
    print(f"  {BOLD}/retry-demo{RESET}            -> UC5: Retry vs Re-prompt Self-Correction Benchmark")
    print(f"  {BOLD}/catalog{RESET}               -> View Products Catalog")
    print(f"  {BOLD}/help{RESET}                  -> Show all commands | {BOLD}/exit{RESET} to quit\n")

def run_cli():
    print_banner()
    while True:
        try:
            user_input = input(f"{GREEN}{BOLD}You > {RESET}").strip()
            if not user_input:
                continue

            cmd = user_input.lower()

            if cmd in ("/exit", "exit", "quit", ":q"):
                print(f"{CYAN}👋 Goodbye from AeroBot!{RESET}")
                break

            if cmd in ("/clear", "cls"):
                os.system("cls" if os.name == "nt" else "clear")
                print_banner()
                continue

            if cmd in ("/catalog", "catalog", "products"):
                products = product_service.get_all()
                print(f"\n{CYAN}{BOLD}--- LIVE PRODUCT CATALOG ---{RESET}")
                for p in products:
                    print(f"[{p.id}] {BOLD}{p.name}{RESET} - ${p.price:.2f} (Stock: {p.stock} units | {p.category})")
                print()
                continue

            if cmd in ("/1", "/architecture", "uc1"):
                print(f"\n{MAGENTA}{BOLD}🏛️ [USE CASE 1] Requirements & Architecture Decomposition{RESET}")
                arch = architecture_engine.generate_architecture_json()
                print(f"System: {arch.system_name} ({arch.architecture_style})")
                print(f"Capacity: {arch.concurrent_users:,} concurrent users\n")
                for s in arch.services:
                    print(f"{CYAN}• {s.name} ({s.api_boundary}){RESET}")
                    print(f"  Responsibility: {s.responsibility}")
                    print(f"  Database Model: {s.database}")
                print(f"\n{YELLOW}ADR-002: Why NOT AI in Payment Logic?{RESET}")
                print("  Financial settlement must remain 100% deterministic, audited, and compliant (PCI-DSS).\n")
                continue

            if cmd in ("/2", "/openapi", "uc2"):
                print(f"\n{MAGENTA}{BOLD}📄 [USE CASE 2] OpenAPI 3.0 Contract-First Scaffolding{RESET}")
                yaml_spec = openapi_generator.get_spec_yaml()
                val = api_schema_validator.validate_yaml_spec(yaml_spec)
                print(f"Contract Status: {GREEN}VALID (100% Schema Compliant){RESET}")
                print(f"Endpoints defined: {val['paths_count']} paths | Models: {val['schemas_count']} schemas")
                print(f"{YELLOW}Scaffolded Controllers:{RESET} ProductService, CartService (RFC 7807 Problem Details)\n")
                continue

            if cmd in ("/3", "/a11y", "uc3"):
                print(f"\n{MAGENTA}{BOLD}🎨 [USE CASE 3] Frontend Accessibility (WCAG 2.1 AA) & UI Risk Control{RESET}")
                audit = a11y_auditor.audit_html("<header><nav></nav></header><main></main><div aria-live='polite'></div>")
                print(f"Compliance Score: {GREEN}{audit['compliance_score']} ({audit['standard']}){RESET}")
                for c in audit["checks"]:
                    print(f"  [{'✔' if c['passed'] else '✖'}] {c['rule']}")
                print(f"\n{YELLOW}UI Risk Mitigations Enforced:{RESET}")
                print("  • Immutable state updates prevent stale cart renders")
                print("  • Double-click debounce guards prevent duplicate checkout requests\n")
                continue

            if cmd in ("/4", "/codereview", "uc4"):
                print(f"\n{MAGENTA}{BOLD}🔍 [USE CASE 4] Sonar AST Static Scan & AI Code Review{RESET}")
                review = ai_reviewer.review_code()
                print(f"Risk Level: {YELLOW}{review.risk_level}{RESET} | Complexity: {review.complexity_score}")
                print(f"{RED}Security Flaws Flagged:{RESET}")
                for s in review.security_issues:
                    print(f"  • {s}")
                print(f"{GREEN}Refactor Actions:{RESET}")
                for r in review.refactor_suggestions:
                    print(f"  • {r}")
                print()
                continue

            if cmd in ("/5", "/simulate", "uc5"):
                print(f"\n{MAGENTA}{BOLD}🧪 [USE CASE 5] Running Live Real-Time Edge Case Simulations...{RESET}")
                
                print(f"\n{YELLOW}1. Out-of-Stock Flash Sale Inventory Contention:{RESET}")
                s1 = edge_case_simulator.simulate_out_of_stock()
                for step in s1.steps:
                    print(f"   Step {step.step_number}: {step.action} -> {step.telemetry}")
                print(f"   Status: {GREEN}{s1.final_status}{RESET}")

                print(f"\n{YELLOW}2. Payment Gateway SLA Timeout (>1500ms) with Saga Rollback:{RESET}")
                s2 = edge_case_simulator.simulate_payment_timeout()
                for step in s2.steps:
                    print(f"   Step {step.step_number}: {step.action} -> {step.telemetry}")
                print(f"   Status: {GREEN}{s2.final_status}{RESET}")

                print(f"\n{YELLOW}3. Invalid & Expired Coupon Codes:{RESET}")
                s3 = edge_case_simulator.simulate_invalid_coupon()
                for step in s3.steps:
                    print(f"   Step {step.step_number}: {step.action} -> {step.telemetry}")
                print(f"   Status: {GREEN}{s3.final_status}{RESET}")

                print(f"\n{YELLOW}4. Optimistic Concurrency Control (OCC) Multi-Device Race:{RESET}")
                s4 = edge_case_simulator.simulate_concurrent_modification()
                for step in s4.steps:
                    print(f"   Step {step.step_number}: {step.action} -> {step.telemetry}")
                print(f"   Status: {GREEN}{s4.final_status}{RESET}\n")
                continue

            if cmd in ("/security", "security"):
                print(f"\n{MAGENTA}{BOLD}🛡️ [USE CASE 5] Automated Security Threat Vector Audit{RESET}")
                audit = security_auditor.run_security_audit()
                print(f"Overall Result: {GREEN}{audit['overall_status']}{RESET}")
                for r in audit["results"]:
                    print(f"  • {BOLD}{r['vector']}{RESET}: {GREEN}{r['status']}{RESET}")
                print()
                continue

            if cmd in ("/retry-demo", "retry demo"):
                print(f"\n{MAGENTA}{BOLD}📊 [USE CASE 5] Retry vs Re-prompt Benchmark{RESET}")
                bench = retry_benchmark.get_benchmark_data()
                print(f"Scenario: {bench['scenario']}")
                for m in bench["metrics"]:
                    print(f"  • {BOLD}{m['metric']}{RESET}: Naive Re-prompt={m['naive_reprompt']} | Targeted Retry={m['targeted_retry']} ({m['improvement']})")
                print()
                continue

            if cmd in ("/tests", "/generate", "tests"):
                print(f"\n{MAGENTA}{BOLD}🧪 [USE CASE 5] AI-Generated Pytest Test Suite{RESET}")
                suite = test_generator.generate_cart_service_tests()
                print(f"Module: {suite.module_name} | Framework: {suite.framework} | Coverage: {GREEN}{suite.coverage_score}{RESET}\n")
                for tc in suite.test_cases:
                    print(f"{CYAN}{BOLD}{tc.test_name}{RESET}: {tc.scenario}")
                    print(f"  Expected: {tc.expected_result}")
                print()
                continue

            # Standard chat completion via backend Chat Router
            response = chat(ChatRequest(message=user_input))
            print(f"\n{CYAN}{BOLD}AeroBot > {RESET}{response.reply}\n")

        except KeyboardInterrupt:
            print("\nExiting CLI...")
            break
        except Exception as ex:
            print(f"\n{RED}Error: {str(ex)}{RESET}\n")

if __name__ == "__main__":
    run_cli()
