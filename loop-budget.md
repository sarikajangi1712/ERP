# Loop Execution Budget & Resource Allocation
## Mini ERP + CRM Operations Portal

---

## Resource Allocations & Limits

| Loop Workflow | Max Duration | Token / API Limit | Execution Cap | Retry Policy |
| :--- | :--- | :--- | :--- | :--- |
| **Daily Triage Loop** | 10 Minutes | 50,000 Tokens | 1 Run / Day | Max 2 Retries |
| **PR Babysitter Loop** | 5 Minutes | 25,000 Tokens | Per PR Event | Max 1 Retry |
| **Dependency Sweeper** | 15 Minutes | 10,000 Tokens | 1 Run / Week | Max 1 Retry |
| **Documentation Loop** | 5 Minutes | 15,000 Tokens | Per Release | Max 1 Retry |
| **Security Audit Loop**| 10 Minutes | 30,000 Tokens | 1 Run / Day | Max 2 Retries |

---

## Budget Safety Rule
If a loop execution exceeds 80% of its duration cap, it must terminate gracefully, log state to `STATE.md`, and raise a warning notification without interrupting active production applications.
