export interface TrialStatusResponse {
  is_on_trial: boolean;
  has_access: boolean;
  has_paid: boolean;
  trial_start: string | null;
  trial_end: string | null;
  days_remaining: number;
}
