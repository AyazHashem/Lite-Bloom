export interface HeadlineScore {
    headline:  string
    url:       string
    source:    string
    positive:  number
    negative:  number
    neutral:   number
    label:     'positive' | 'negative' | 'neutral'
}

export interface SentimentResult {
    symbol:              string
    name:                string
    label:               'BUY' | 'SELL' | 'HOLD'
    score:               number
    reasoning:           string
    headlines_analyzed:  HeadlineScore[]
    disclaimer:          string
}

export interface SentimentRequest {
    symbol: string
    name:   string
}