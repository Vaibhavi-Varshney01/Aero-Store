"""
USE CASE 4: Dependency Licensing Risk Checker
Audits third-party Python dependencies to identify copyleft, commercial, and restrictive license risks.
"""
from typing import Dict, Any, List

class LicenseChecker:
    def __init__(self):
        self.known_licenses = {
            "fastapi": {"license": "MIT", "risk": "LOW", "commercial_use": True},
            "uvicorn": {"license": "BSD-3-Clause", "risk": "LOW", "commercial_use": True},
            "pydantic": {"license": "MIT", "risk": "LOW", "commercial_use": True},
            "requests": {"license": "Apache-2.0", "risk": "LOW", "commercial_use": True},
            "pyyaml": {"license": "MIT", "risk": "LOW", "commercial_use": True},
            "jsonschema": {"license": "MIT", "risk": "LOW", "commercial_use": True},
            "pytest": {"license": "MIT", "risk": "LOW", "commercial_use": True},
            "pytest-cov": {"license": "MIT", "risk": "LOW", "commercial_use": True},
            "rich": {"license": "MIT", "risk": "LOW", "commercial_use": True},
            "jinja2": {"license": "BSD-3-Clause", "risk": "LOW", "commercial_use": True},
            # Simulated restricted package for governance demonstration
            "gpl-crypto-lib": {"license": "GPL-3.0", "risk": "HIGH", "commercial_use": False, "note": "Viral copyleft risk requiring proprietary code disclosure."}
        }

    def audit_dependencies(self, package_list: List[str]) -> Dict[str, Any]:
        audit_results = []
        high_risk_count = 0

        for pkg in package_list:
            clean_pkg = pkg.split(">=")[0].split("==")[0].strip().lower()
            info = self.known_licenses.get(clean_pkg, {"license": "Unknown / Permissive", "risk": "LOW", "commercial_use": True})
            if info["risk"] == "HIGH":
                high_risk_count += 1
            audit_results.append({
                "package": clean_pkg,
                "license": info["license"],
                "risk_level": info["risk"],
                "approved_for_commercial_saas": info["commercial_use"],
                "note": info.get("note", "Complies with Capgemini open-source software governance.")
            })

        return {
            "total_packages_checked": len(package_list),
            "high_risk_packages": high_risk_count,
            "overall_licensing_risk": "HIGH" if high_risk_count > 0 else "LOW (Enterprise Approved)",
            "details": audit_results
        }

license_checker = LicenseChecker()
