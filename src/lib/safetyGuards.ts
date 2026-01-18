export function looksLikePatientCare(text: string): boolean {
  const t = text.toLowerCase();

  // This is intentionally conservative.
  // If a user tries to use this for patient care, we refuse.
  const redFlags = [
    "my patient",
    "the patient",
    "a patient",
    "client of mine",
    "my client",
    "patient name",
    "dob",
    "date of birth",
    "mr ",
    "mrs ",
    "icd",
    "diagnose",
    "diagnosis",
    "treatment plan",
    "medication",
    "prescribe",
    "dose",
    "risk assessment",
    "suicidal",
    "homicidal",
    "psychosis",
    "mania",
    "case formulation",
    "what should i do with this patient",
    "what do you recommend for my patient",
  ];

  return redFlags.some((k) => t.includes(k));
}

export function patientCareRefusalMessage(): string {
  return (
    "I cannot help with patient care or patient-specific questions here. " +
    "This assistant is only for the clinician's own wellbeing. " +
    "Please do not include patient details. For patient matters, use your standard clinical workflow and professional resources."
  );
}
