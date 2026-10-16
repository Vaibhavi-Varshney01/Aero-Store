"""
Use Cases Direct REST Controller
Exposes live execution endpoints for all 5 AI Engineering Use Cases.
"""
from fastapi import APIRouter
from ...use_cases.uc1_architecture.architecture_engine import architecture_engine
from ...use_cases.uc1_architecture.adr_generator import adr_generator
from ...use_cases.uc1_architecture.token_explainer import token_explainer
from ...use_cases.uc2_api_scaffolding.openapi_generator import openapi_generator
from ...use_cases.uc2_api_scaffolding.schema_validator import api_schema_validator
from ...use_cases.uc2_api_scaffolding.token_limit_exp import token_limit_exp
from ...use_cases.uc3_frontend_risk.a11y_auditor import a11y_auditor
from ...use_cases.uc3_frontend_risk.ui_risk_analyzer import ui_risk_analyzer
from ...use_cases.uc3_frontend_risk.prompt_library import prompt_library
from ...use_cases.uc4_code_review.ast_code_analyzer import ast_code_analyzer
from ...use_cases.uc4_code_review.ai_reviewer import ai_reviewer
from ...use_cases.uc4_code_review.license_checker import license_checker
from ...use_cases.uc4_code_review.refactor_engine import refactor_engine
from ...use_cases.uc5_testing_edgecases.test_generator import test_generator
from ...use_cases.uc5_testing_edgecases.edge_case_simulator import edge_case_simulator
from ...use_cases.uc5_testing_edgecases.security_auditor import security_auditor
from ...use_cases.uc5_testing_edgecases.retry_reprompt_bench import retry_benchmark

router = APIRouter(prefix="/usecases", tags=["AI Use Cases 1-5"])

# Use Case 1 Endpoints
@router.get("/uc1/architecture", summary="UC1: Architecture JSON, ADRs & Prompt Analysis")
def get_uc1_data():
    return {
        "architecture_json": architecture_engine.generate_architecture_json(),
        "prompt_comparison": architecture_engine.compare_prompts(),
        "adr_001": adr_generator.get_adr_001(),
        "adr_002": adr_generator.get_adr_002(),
        "traceability_matrix": architecture_engine.get_traceability_matrix(),
        "token_guide": token_explainer.get_token_and_temperature_guide()
    }

# Use Case 2 Endpoints
@router.get("/uc2/openapi", summary="UC2: OpenAPI 3.0 Contract & Scaffolding Validation")
def get_uc2_data():
    yaml_spec = openapi_generator.get_spec_yaml()
    val_result = api_schema_validator.validate_yaml_spec(yaml_spec)
    return {
        "openapi_yaml": yaml_spec,
        "validation_result": val_result,
        "retry_vs_reprompt": api_schema_validator.run_retry_vs_reprompt_demo(),
        "token_limit_experiment": token_limit_exp.run_experiment()
    }

# Use Case 3 Endpoints
@router.get("/uc3/frontend-audit", summary="UC3: Accessibility Audit & UI Risk Control")
def get_uc3_data():
    # Audit storefront sample
    sample_html = """
    <header role="banner"><nav aria-label="Main Navigation"><a href="/">Home</a></nav></header>
    <main role="main" id="main-content">
        <h1>Product Catalog</h1>
        <article class="product-card">
            <img src="/static/assets/headphones.svg" alt="HyperSound Headphones" />
            <button aria-label="Add HyperSound Headphones to cart">Add to Cart</button>
        </article>
    </main>
    <div aria-live="polite" class="cart-announcer">1 item in cart</div>
    """
    return {
        "a11y_audit": a11y_auditor.audit_html(sample_html),
        "ui_risks": ui_risk_analyzer.analyze_ui_risks(),
        "prompt_library_entry": prompt_library.get_frontend_entry()
    }

# Use Case 4 Endpoints
@router.get("/uc4/code-review", summary="UC4: Sonar AST Scan, AI Review & License Check")
def get_uc4_data():
    review_result = ai_reviewer.review_code()
    packages = ["fastapi>=0.115.0", "uvicorn>=0.30.0", "pydantic>=2.8.0", "pytest>=8.0.0", "gpl-crypto-lib"]
    license_result = license_checker.audit_dependencies(packages)
    refactor_result = refactor_engine.get_comparison_and_summary()
    return {
        "ai_review_json": review_result,
        "license_audit": license_result,
        "sonar_vs_ai_comparison": refactor_result["comparison"],
        "quality_improvement_summary": refactor_result["quality_improvement_summary"],
        "refactored_code": refactor_result["refactored_code"]
    }

# Use Case 5 Endpoints
@router.get("/uc5/simulate/{scenario}", summary="UC5: Run Edge Case Simulation")
def run_simulation(scenario: str):
    s = scenario.lower().replace("-", "_")
    if "stock" in s:
        return edge_case_simulator.simulate_out_of_stock()
    elif "timeout" in s or "payment" in s:
        return edge_case_simulator.simulate_payment_timeout()
    elif "coupon" in s:
        return edge_case_simulator.simulate_invalid_coupon()
    elif "concurr" in s or "race" in s or "occ" in s:
        return edge_case_simulator.simulate_concurrent_modification()
    return {"error": f"Unknown simulation scenario '{scenario}'. Choose from: out_of_stock, payment_timeout, invalid_coupon, concurrency"}

@router.get("/uc5/tests", summary="UC5: AI-Generated Pytest Suite & Coverage Proof")
def get_tests():
    return test_generator.generate_cart_service_tests()

@router.get("/uc5/security", summary="UC5: Automated Security Audit (SQLi, Tampering, Replay)")
def run_security():
    return security_auditor.run_security_audit()

@router.get("/uc5/retry-demo", summary="UC5: Retry vs Re-prompt Benchmark")
def get_retry_demo():
    return retry_benchmark.get_benchmark_data()
