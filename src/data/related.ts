export interface RelatedNextStep {
  label: string;
  href: string;
  reason: string;
}

export const relatedNextSteps: Record<'seeds' | 'mutations' | 'progression' | 'updates', RelatedNextStep[]> = {
  seeds: [
    { label: 'Check mutation value reports', href: '/mechanics/mutations/', reason: 'See which reported multipliers may change a harvest value before you model the result.' },
    { label: 'Record the run in the calculator', href: '/', reason: 'Use your observed buy-in, harvest value, wait time, and failed attempts instead of an assumed profit tier.' },
    { label: 'Check what changed', href: '/updates/', reason: 'Review version and data revisions before relying on an expensive reported seed price.' },
  ],
  mutations: [
    { label: 'Choose a reported seed', href: '/seeds/list/', reason: 'Compare current buy-in and spawn reports before risking replacement capital on an event.' },
    { label: 'Review lightning risk', href: '/mechanics/lightning/', reason: 'Separate source-matched strike conditions from outcomes that still need controlled gameplay evidence.' },
    { label: 'Calculate an observed outcome', href: '/', reason: 'Enter the multiplier or final harvest result you actually saw without assuming a stacking formula.' },
  ],
  progression: [
    { label: 'Protect the next planting', href: '/guides/get-money-fast/', reason: 'Turn the progression outline into a bankroll-first recovery and spending decision.' },
    { label: 'Check ticket evidence', href: '/guides/tickets/', reason: 'Review currently supported ticket sources before building a progression step around them.' },
    { label: 'Model a repeatable run', href: '/', reason: 'Compare observed cost, timing, and failures before moving to a more expensive stage.' },
  ],
  updates: [
    { label: 'Recheck the seed catalog', href: '/seeds/list/', reason: 'Inspect the current source-matched prices and version boundary after an update signal.' },
    { label: 'Recheck mutation reports', href: '/mechanics/mutations/', reason: 'See which triggers and multiplier claims remain matched reports rather than developer-confirmed facts.' },
    { label: 'Verify codes separately', href: '/codes/', reason: 'Use the dedicated status page for current verification and redeem troubleshooting after a patch.' },
  ],
};
