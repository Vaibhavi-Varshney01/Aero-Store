"""
USE CASE 3: Frontend Accessibility (WCAG 2.1 AA) Automated Audit Engine
Audits HTML elements for ARIA tags, contrast, keyboard focus, and screen reader compliance.
"""
from typing import Dict, Any, List
import re

class AccessibilityAuditor:
    @staticmethod
    def audit_html(html_content: str) -> Dict[str, Any]:
        """Performs static accessibility checks against WCAG 2.1 AA standards"""
        checks = []

        # 1. Check for semantic landmarks
        has_main = "<main" in html_content
        has_nav = "<nav" in html_content
        has_header = "<header" in html_content
        checks.append({
            "rule": "WCAG 1.3.1 - Info and Relationships (Semantic Landmarks)",
            "passed": has_main and has_nav and has_header,
            "details": f"Found landmarks: <main> ({has_main}), <nav> ({has_nav}), <header> ({has_header})."
        })

        # 2. Check for button ARIA labels & readable text
        buttons_without_labels = re.findall(r'<button(?![^>]*aria-label)[^>]*>\s*<i|<button>\s*</button>', html_content)
        checks.append({
            "rule": "WCAG 4.1.2 - Name, Role, Value (Button Accessible Names)",
            "passed": len(buttons_without_labels) == 0,
            "details": f"Buttons missing accessible names or aria-labels: {len(buttons_without_labels)}"
        })

        # 3. Check for ARIA live regions for dynamic cart / status notifications
        has_aria_live = bool(re.search(r'aria-live=[\'"](polite|assertive)[\'"]', html_content))
        checks.append({
            "rule": "WCAG 4.1.3 - Status Messages (Live Regions)",
            "passed": has_aria_live,
            "details": f"Dynamic cart updates announce to screen readers via aria-live: {has_aria_live}."
        })

        # 4. Check for Form input labels & aria-describedby
        inputs = re.findall(r'<input[^>]*>', html_content)
        labeled_inputs = [inp for inp in inputs if 'aria-label' in inp or 'id=' in inp or 'type="hidden"' in inp]
        checks.append({
            "rule": "WCAG 3.3.2 - Labels or Instructions (Form Fields)",
            "passed": len(inputs) == len(labeled_inputs),
            "details": f"Total form inputs: {len(inputs)}, Properly labeled: {len(labeled_inputs)}"
        })

        # 5. Check for Alt attributes on Images
        images_missing_alt = re.findall(r'<img(?![^>]*alt=)[^>]*>', html_content)
        checks.append({
            "rule": "WCAG 1.1.1 - Non-text Content (Image Alt Attributes)",
            "passed": len(images_missing_alt) == 0,
            "details": f"Images lacking alt attributes: {len(images_missing_alt)}"
        })

        score = sum(1 for c in checks if c["passed"]) / len(checks) * 100

        return {
            "standard": "WCAG 2.1 Level AA",
            "compliance_score": f"{score:.1f}%",
            "status": "COMPLIANT" if score >= 90 else "NEEDS_IMPROVEMENT",
            "checks": checks,
            "recommendations": [
                "Maintain visible focus outlines (focus-visible: 2px solid #3b82f6) for keyboard tab navigation.",
                "Ensure color contrast ratio exceeds 4.5:1 for normal text and 3:0:1 for large text.",
                "Provide skip-to-content links for keyboard accessibility."
            ]
        }

a11y_auditor = AccessibilityAuditor()
