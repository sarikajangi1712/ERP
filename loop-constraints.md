# Loop Engineering Guardrails & Constraints
## Mini ERP + CRM Operations Portal

---

## NON-NEGOTIABLE SAFETY RULES

1. **NO AUTO-MERGE**: Automated loops MUST NEVER automatically merge Pull Requests or push directly to `main`/`master` production branches. All code changes require human review and approval.
2. **NO NEGATIVE INVENTORY**: Loops verifying inventory logic MUST enforce that stock balance can NEVER drop below zero.
3. **NO PLACEHOLDERS OR TODO REPLACEMENTS**: Automated refactoring loops must never replace working implementation logic with TODO comments or dummy fallbacks.
4. **IMMUTABLE CONFIRMED CHALLANS**: Confirmed sales challans and paid tax invoices cannot be edited or mutated without audit log recording.
5. **RESTORE STOCK ON CANCELLATION**: Any cancellation workflow must explicitly restore inventory balance to the corresponding warehouse.
6. **MANDATORY AUDIT LOGGING**: Every critical action (`USER_LOGIN`, `CREATE_CUSTOMER`, `CONFIRM_CHALLAN`, `STOCK_TRANSFER`, `PASSWORD_CHANGE`) must trigger an entry in `audit_logs`.
