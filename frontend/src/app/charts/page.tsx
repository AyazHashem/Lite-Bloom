import TerminalLayout from '@/components/terminal/TerminalLayout'
import ErrorBoundary from '@/components/shared/ErrorBoundary'

export default function ChartsPage() {
    return (
        <ErrorBoundary label="Chart Analysis">
            <TerminalLayout />
        </ErrorBoundary>
    )
}