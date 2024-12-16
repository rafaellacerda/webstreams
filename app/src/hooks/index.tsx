import { useCallback, useState } from "react";
import { consumeAPI } from "../services/dragonball";

export default function useDragonBall() {
    const [error, setError] = useState<unknown>();
    const [isLoading, setIsLoading] = useState(false);
    const [tokens, setTokens] = useState<string[]>([]);

    const [abortController, setAbortController] =
        useState<AbortController | null>(null);

    const appendToHTML = () => {
        return new WritableStream({
            write({ title, power, sagaOrMovie, series }) {
                setTokens((prev) => [...prev,
                {
                    title, power, sagaOrMovie, series
                } as any]);

            },
            abort(reason) {
                console.log('aborted**', reason)
            }
        })
    }

    const start = useCallback(
        async () => {
            setIsLoading(true);
            setTokens([]);

            let signal;

            if (!abortController) {
                const controller = new AbortController();
                signal = controller.signal;
                setAbortController(controller);
            }
            else signal = abortController.signal;

            try {
                const readable = await consumeAPI(signal);
                await readable.pipeTo(appendToHTML(), { signal });
            } catch (err) {
                if (
                    err instanceof Error &&
                    err.name === "AbortError"
                ) {
                    return; // abort errors are expected
                }
                setError(err);
            }
            setIsLoading(false);
        },
        [abortController]
    );

    const stop = () => {
        abortController?.abort();
        setAbortController(null);
    }

    const data = tokens;
    return [start, stop, { data, isLoading, error }] as const;
}
