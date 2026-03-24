# Contributing to Open Bharat Digital Consent by IDfy

Welcome! We are building a reference CMS implementation for the MeitY Code for Consent Challenge. Our goal is to provide a robust, compliant, and standardized foundation for the Indian data ecosystem.

## 🧩 Architectural Guidelines (Read This!)

This project follows a **Modular Provider Architecture**. This ensures that the core logic remains lightweight while external services (like Translation, Notification, Cloud Storage, Analytics, Audit Trail Storage) can be swapped easily.

* **Core Logic:** The app handles the flow, API contracts, and Consent Artifact generation.
* **Service Providers:** Features like **Localization** and **Notification** are implemented as pluggable adapters.
  * *Current Implementation:* The repository ships with **Standard Adapters** (e.g., Google Translate APIs / Local JSON files) to ensure immediate usability for developers without complex dependencies.
  * *Contributing:* If you contribute a new feature (e.g., new language support), please implement it within the existing Adapter interface. Do not hardcode proprietary logic into the core components.

## ⚖️ License & CLA

To ensure this project can serve as a stable Digital Public Good while allowing for ecosystem growth, we manage contributions strictly.

1. **Privy Public License:** This repository is licensed under the Privy Public License.
2. **Contributor License Agreement (CLA):** By contributing, you agree to our CLA. This grants us the right to re-license your contributions.
    * *Why?* This allows us to maintain this Open Source "Community Edition" alongside other implementations (including Enterprise versions with specialized drivers) without legal fragmentation.
    * **Process:** A bot will prompt you to sign the CLA on your first Pull Request.

## 🛠️ Development Standards

1. **API Compliance:** All changes must adhere to the `openapi.yaml` spec found in `/docs`. Do not alter the public API contract without a formal Request for Comment (RFC).
2. **Privacy First:** No PII in logs. No hardcoded secrets.
3. **Dependencies:** Prefer permissive open-source libraries. Avoid adding dependencies that require paid license keys to run the basic test suite.

## 🚀 How to Contribute

1. Fork the repo.
2. Create a branch (`feature/improved-accessibility`).
3. Run `npm test` to ensure the Standard Adapters are functioning.
4. Submit your PR.

---
*Thank you for building the future of Data Consent with us.*
