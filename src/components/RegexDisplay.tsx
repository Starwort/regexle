import {Paper, Typography} from "@suid/material";

interface RegexDisplayProps {
    regex: string;
    word: string;
}
export default function RegexDisplay(props: RegexDisplayProps) {
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
            p: 1,
            m: 1,
            borderRadius: 1,
            backgroundColor: (new RegExp(props.regex, 'gi')).test(props.word) ? 'success.main' : 'error.main',
            color: (new RegExp(props.regex, 'gi')).test(props.word) ? 'success.contrastText' : 'error.contrastText',
        }}>
            <Typography
                variant="h4"
                component="code"
                sx={{
                    fontFamily: "'Source Code Pro', 'Courier New', 'Lucida Console', Courier, monospace"
                }}
            >
                {props.regex}
            </Typography>
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