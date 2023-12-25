import {OutlinedInput, Paper, Typography} from "@suid/material";
import {createSignal} from "solid-js";

interface RegexEntryProps {
    onComplete(regex: string): void;
}
export default function RegexEntry(props: RegexEntryProps) {
    const [regex, setRegex] = createSignal('');
    return <span style={{display: 'flex', "align-items": 'center'}}>
        <Typography
            variant="h4"
            component="code"
            sx={{
                opacity: 0.6,
                fontFamily: "'Source Code Pro', 'Courier New', 'Lucida Console', Courier, monospace"
            }}
        >
            /
        </Typography>
        <Paper sx={{
            display: 'inline-block',
            borderRadius: 1,
            m: 1,
        }} >
            <Typography
                variant="h4"
                component={OutlinedInput}
                inputProps={{
                    sx: {
                        fontFamily: "'Source Code Pro', 'Courier New', 'Lucida Console', Courier, monospace",
                        p: 1,
                    },
                } as any}
                width={22 * Math.max(regex().length, 1) + 16}
                value={regex()}
                onChange={(e: any) => setRegex(e.currentTarget.value)}
                onKeyDown={key => {
                    if (key.key == 'Enter') {
                        props.onComplete(regex());
                        setRegex('');
                    }
                }}
                error={(() => {
                    try {RegExp(regex(), 'i');}
                    catch (e) {return true;}
                    return false;
                })()}
            />
        </Paper>
        <Typography
            variant="h4"
            component="code"
            sx={{
                opacity: 0.6,
                fontFamily: "'Source Code Pro', 'Courier New', 'Lucida Console', Courier, monospace"
            }}
        >
            /i
        </Typography>
    </span>;
}