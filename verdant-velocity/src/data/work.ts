export type WorkItem = {
  slug: string;
  title: string;
  tags: string[];
  blurb: string;
  cover: string;
  role: string;
  tools: string[];
  problem: string;
  process: string;
  challenges: string;
  outcome: string;
  impact: string;
};

export const workItems: WorkItem[] = [
  {
    slug: 'fusion-stability-lab',
    title: 'Fusion Stability Lab',
    tags: ['time-series', 'interpretability', 'research'],
    blurb: 'Early-warning signals for tokamak disruption prediction with interpretable TS models.',
    cover: '/images/placeholders/fusion-stability.svg',
    role: 'Research + modeling',
    tools: ['Python', 'PyTorch', 'Time-series', 'Visualization'],
    problem:
      'Detect disruptions before they cascade. Build models that domain experts can interrogate.',
    process:
      'Data cleaning, feature synthesis, interpretable baselines, uncertainty calibration, and visual probes.',
    challenges: 'Noisy sensors, drift across runs, and balancing sensitivity vs. false alarms.',
    outcome:
      'Prototype early-warning tool with transparent feature attributions and sensitivity tests.',
    impact: 'Placeholder impact: replace with real metrics.',
  },
  {
    slug: 'race-strategy-sim',
    title: 'Race Strategy Sim',
    tags: ['bayesian', 'fastf1', 'simulation'],
    blurb: 'Bayesian race strategy simulations leveraging FastF1 data and tyre deg priors.',
    cover: '/images/placeholders/race-strategy.svg',
    role: 'Modeling + simulation',
    tools: ['Python', 'FastF1', 'Bayesian', 'MCMC'],
    problem: 'Plan pit windows and safety car scenarios under uncertainty.',
    process:
      'Built priors from historical stints, simulated safety cars, evaluated strategies with posterior sampling.',
    challenges: 'Sparse data for rare events; aligning lap time models with changing conditions.',
    outcome: 'Scenario explorer to compare strategies with credible intervals.',
    impact: 'Placeholder impact: replace with real metrics.',
  },
  {
    slug: 'resilient-forecasting',
    title: 'Resilient Forecasting',
    tags: ['forecasting', 'uncertainty', 'systems'],
    blurb: 'Uncertainty-aware pipelines for energy/telemetry streams resilient to drift.',
    cover: '/images/placeholders/forecasting.svg',
    role: 'Modeling + reliability',
    tools: ['Python', 'Forecasting', 'Monitoring'],
    problem: 'Forecast under drift and regime shifts while surfacing uncertainty.',
    process:
      'Calibrated ensembles, drift detection, and visualization for forecast trust and interventions.',
    challenges: 'Regime changes, missing data, and conveying uncertainty to stakeholders.',
    outcome: 'Prototype forecasting stack with drift alerts and calibrated prediction intervals.',
    impact: 'Placeholder impact: replace with real metrics.',
  },
];
