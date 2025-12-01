const ParsedCommit = {
    raw: "added dark mode",
    type: null,              // will be 'feat', 'fix', etc.
    scope: null,             // will be 'ui', 'auth', etc.
    subject: "added dark mode", // the main message
    body: null,
    footer: null,
    breaking: false
};

// This is what the analyzer outputs
const AnalysisOutput = {
    score: 60,
    isValid: false,
    parsed: ParsedCommit,
    issues: [
        { type: 'missing-type', severity: 'error', message: 'Commit type is required' },
        { type: 'missing-scope', severity: 'warning', message: 'Scope is recommended' },
        { type: 'past-tense', severity: 'warning', message: 'Use imperative mood (add, not added)' }
    ],
    suggestions: [
        {
        suggestedMessage: 'feat(ui): add dark mode',
        reason: 'Detected action: "add", inferred scope: "ui"'
        }
    ]
};