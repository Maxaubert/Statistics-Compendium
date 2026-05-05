"""
Audits the filter system against every exam delspørsmål from jan25,
jan26 and mai25. For each task we simulate a panicking student's filter
selection (based on the wording) and check whether the right entry is
reachable.
"""
import os, sys, io, yaml
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

ROOT = "content/entries"
entries = []
for f in sorted(os.listdir(ROOT)):
    if not f.endswith(".yaml"): continue
    d = yaml.safe_load(open(f"{ROOT}/{f}", encoding="utf-8")) or {}
    entries.append({"id": d["id"], "name": d["name_no"], "filters": d.get("filters", {}) or {}})


def apply_filters(selection):
    res = []
    for e in entries:
        ok = True
        for dim, vals in selection.items():
            if not vals: continue
            entry_vals = set(e["filters"].get(dim, []) or [])
            if not (set(vals) & entry_vals):
                ok = False
                break
        if ok:
            res.append(e["id"])
    return res


# Each test: (id, target_entry_or_None, student_selection_attempt, ordlyd)
tests = [
    # JAN25
    ("JAN25-O1a", "uordnet-utvalg-uten-tilbakelegging",
     {"setup": ["without_replacement", "finite_pool"], "computes": ["exact_probability"]},
     "5 kort fra 52, P(5 hjerter)"),
    ("JAN25-O1b", "komplementregelen",
     {"structural_cues": ["complement_pattern"], "computes": ["exact_probability"]},
     "P(ikke alle 5 hjerter)"),
    ("JAN25-O1c", "uordnet-utvalg-uten-tilbakelegging",
     {"setup": ["without_replacement"], "structural_cues": ["complement_pattern"]},
     "P(ingen er hjerter)"),
    ("JAN25-O1d", "unionssetningen",
     {"structural_cues": ["disjoint_events"]},
     "Er hendelsene disjunkte?"),
    ("JAN25-O2a", None,
     {"random_variable": ["discrete_count"]},
     "Diskret X med PMF gitt. P(X > 0)"),
    ("JAN25-O2b", "forventningsverdi-diskret",
     {"computes": ["expected_value"], "random_variable": ["discrete_count"]},
     "E(X)"),
    ("JAN25-O2c", "varians-standardavvik-diskret",
     {"computes": ["std_dev"], "random_variable": ["discrete_count"]},
     "Var(X)"),
    ("JAN25-O3a", "bayes-setning",
     {"computes": ["conditional_probability"], "structural_cues": ["conditional_given"]},
     "P(R|S) — Bayes-mønster"),
    ("JAN25-O3b", "total-sannsynlighet",
     {"structural_cues": ["conditional_given"], "computes": ["marginal_probability"]},
     "Spiregraden til andre frø — P(S|notR)"),
    ("JAN25-O4a", "poisson-fordeling",
     {"distribution_assumption": ["poisson"], "structural_cues": ["rate_given"]},
     "Vulkan med rate, P(X=1)+P(X=2)"),
    ("JAN25-O4b", "poisson-fordeling",
     {"structural_cues": ["complement_pattern", "rate_given"]},
     "Minst ett vulkanutbrudd"),
    ("JAN25-O4c", "ki-poissonrate",
     {"computes": ["confidence_interval"], "parameters_known": ["rate_lambda"]},
     "Tilnærmet 90% KI for rate"),
    ("JAN25-O5a", "normalfordeling",
     {"distribution_assumption": ["normal"], "computes": ["exact_probability"]},
     "Normal X, P(X<24)"),
    ("JAN25-O5b", "sum-uavhengige-normaler",
     {"random_variable": ["sum_of_samples"], "distribution_assumption": ["normal"]},
     "Sum av 5 trykk > 127 cl"),
    ("JAN25-O6a", "en-utvalg-z-test",
     {"computes": ["hypothesis_test"]},
     "Formuler H0, H1"),
    ("JAN25-O6b", "en-utvalg-z-test",
     {"computes": ["hypothesis_test"], "parameters_known": ["population_variance_known"]},
     "Hvorfor z-test? sigma=5, n=40"),
    ("JAN25-O6c", "en-utvalg-z-test",
     {"computes": ["hypothesis_test"], "parameters_known": ["population_variance_known"]},
     "Gjennomfør z-test"),
    ("JAN25-O6d", "en-utvalg-z-test",
     {"computes": ["hypothesis_test"]},
     "Finn p-verdi"),

    # JAN26
    ("JAN26-O1a", "produktregel",
     {"setup": ["without_replacement"]},
     "5 par sko, P(par)"),
    ("JAN26-O1b", "produktregel",
     {"setup": ["without_replacement"]},
     "P(høyre+venstre)"),
    ("JAN26-O1c", "binomial-fordeling",
     {"computes": ["find_n_for_threshold"]},
     "Antall myntkast for P>=0.99"),
    ("JAN26-O2a", "marginalfordeling",
     {"setup": ["joint_table_given"], "computes": ["expected_value"]},
     "E(X) og E(Y) fra simultantabell"),
    ("JAN26-O2b", "varians-standardavvik-diskret",
     {"setup": ["joint_table_given"], "computes": ["std_dev"]},
     "Std avvik fra simultantabell"),
    ("JAN26-O2c", "korrelasjon-joint",
     {"setup": ["joint_table_given"], "computes": ["correlation"]},
     "Korrelasjon fra simultantabell"),
    ("JAN26-O3a", "unionssetningen",
     {"computes": ["union_probability"]},
     "P(A union B)"),
    ("JAN26-O3b", "produktregel",
     {"computes": ["conditional_probability"]},
     "P(A | not C)"),
    ("JAN26-O4a", "poisson-fordeling",
     {"distribution_assumption": ["poisson"]},
     "P(X=0), Poissonprosess"),
    ("JAN26-O4b", "poisson-fordeling",
     {"distribution_assumption": ["poisson"], "structural_cues": ["complement_pattern"]},
     "P(X>=3)"),
    ("JAN26-O4c", "eksponential-fordeling",
     {"distribution_assumption": ["exponential"]},
     "T eksponentialfordelt"),
    ("JAN26-O4d", "eksponential-fordeling",
     {"distribution_assumption": ["exponential"], "random_variable": ["time_until_event"]},
     "P(T>48)"),
    ("JAN26-O4e", "ki-poissonrate",
     {"computes": ["confidence_interval"], "parameters_known": ["rate_lambda"]},
     "90% KI for lambda"),
    ("JAN26-O5a", "to-utvalgs-t-test",
     {"setup": ["two_independent_samples"], "computes": ["hypothesis_test"]},
     "To klasser, ny vs gammel metode"),
    ("JAN26-O5b", "to-utvalgs-t-test",
     {"setup": ["two_independent_samples"], "parameters_known": ["population_variance_unknown"]},
     "Gjennomfør t-test"),
    ("JAN26-O6", "regresjon-prediksjonsintervall",
     {"computes": ["prediction_interval"]},
     "Prediksjonsintervall"),

    # MAI25
    ("MAI25-O1a", "marginalfordeling",
     {"setup": ["joint_table_given"], "computes": ["expected_value"]},
     "E(X) og E(Y) fra simultantabell"),
    ("MAI25-O1b", "varians-standardavvik-diskret",
     {"setup": ["joint_table_given"], "computes": ["std_dev"]},
     "Std avvik"),
    ("MAI25-O1c", "korrelasjon-joint",
     {"setup": ["joint_table_given"], "computes": ["correlation"]},
     "rho"),
    ("MAI25-O2a", "produktregel",
     {"structural_cues": ["independent_events"]},
     "Er M og F uavhengige?"),
    ("MAI25-O2b", "produktregel",
     {"computes": ["conditional_probability"]},
     "P(not M | not F)"),
    ("MAI25-O2c", "total-sannsynlighet",
     {"structural_cues": ["conditional_given"]},
     "P(T) totalt — populasjon delt i grupper"),
    ("MAI25-O3a", "binomial-fordeling",
     {"distribution_assumption": ["binomial"], "structural_cues": ["complement_pattern"]},
     "P(X>=2) i Bin"),
    ("MAI25-O3b", "ki-andel-binomial",
     {"computes": ["confidence_interval"], "random_variable": ["proportion"]},
     "KI for andel"),
    ("MAI25-O4a", "normalfordeling",
     {"distribution_assumption": ["normal"], "computes": ["range_probability"]},
     "Normal X, P(305<X<310)"),
    ("MAI25-O4b", "en-utvalg-z-test",
     {"computes": ["hypothesis_test"], "parameters_known": ["population_variance_known"]},
     "z-test sigma kjent"),
    ("MAI25-O4c", "en-utvalg-z-test",
     {"computes": ["hypothesis_test"]},
     "p-verdi"),
    ("MAI25-O4d", "normalfordeling",
     {"computes": ["find_mu_for_threshold"]},
     "Finn mu slik at P(X<300)<0.001"),
    ("MAI25-O5a", None,
     {},
     "Spredningsplott — visualisering"),
    ("MAI25-O5b", "regresjon-korrelasjonskoeffisient",
     {"setup": ["linear_relationship"], "computes": ["correlation"]},
     "r fra observasjoner"),
    ("MAI25-O5c", "regresjon-estimat-alpha-beta",
     {"setup": ["linear_relationship"]},
     "Estimer regresjonslinje"),
    ("MAI25-O5d", "regresjon-test-stigningstall",
     {"setup": ["linear_relationship"], "computes": ["hypothesis_test"]},
     "Test beta=0"),
]


def status_of(target, matches):
    if target is None:
        return ("SKIP", "(concept-level, no formel-entry forventet)")
    if target in matches:
        if len(matches) <= 3:
            return ("OK", f"target found, {len(matches)} hits")
        return ("WIDE", f"target among {len(matches)} hits — kunne narrows")
    if not matches:
        return ("FAIL", "INGEN treff for valgt filterkombinasjon")
    return ("MISS", f"target ikke i {len(matches)} treff: {matches[:3]}...")


print(f"{'Task':<14} {'Status':<6} {'Target':<38} {'Hits'}")
print("-" * 100)
buckets = {"OK": 0, "WIDE": 0, "FAIL": 0, "MISS": 0, "SKIP": 0}
problems = []
for tid, target, sel, ordlyd in tests:
    matches = apply_filters(sel)
    status, msg = status_of(target, matches)
    buckets[status] += 1
    print(f"{tid:<14} {status:<6} {(target or '(skip)'):<38} {len(matches):<3} — {msg}")
    if status in ("FAIL", "MISS", "WIDE"):
        problems.append((tid, target, sel, status, msg, matches, ordlyd))

print("\n" + "=" * 80)
print(f"Total tasks: {len(tests)}")
for k, v in buckets.items():
    print(f"  {k}: {v}")

print("\n=== PROBLEMS ===\n")
for tid, target, sel, status, msg, matches, ordlyd in problems:
    print(f"{tid} [{status}] target={target}")
    print(f"  ordlyd: {ordlyd}")
    print(f"  filter: {sel}")
    print(f"  treff:  {matches}")
    print()
