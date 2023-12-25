import HelpIcon from '@suid/icons-material/HelpOutline';
import SettingsIcon from '@suid/icons-material/Settings';
import {AppBar, Card, CardContent, CardHeader, CssBaseline, IconButton, ThemeProvider, Toolbar, Typography} from '@suid/material';
import {For, createEffect, createSignal} from 'solid-js';
import RegexDisplay from './components/RegexDisplay';
import RegexEntry from './components/RegexEntry';
import words from './dictionary';
import {dark, light} from './themes';

function App() {
    const [wordsLeft, setWordsLeft] = createSignal([...words]);
    const [regexes, setRegexes] = createSignal<string[]>([]);
    const [theme, setTheme] = createSignal(localStorage.theme ?? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
    const seed = Math.floor((+new Date()) / 86400_000);
    const wordIdx = (seed * 864013) % words.length;
    const word = words[wordIdx];

    const finished = () => wordsLeft().length == 1 || regexes().length == 6;

    createEffect(() => {
        localStorage.theme = theme();
    });

    return (
        <ThemeProvider theme={theme() == 'light' ? light : dark}>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar sx={{
                    display: 'flex',
                    gap: 1,
                }}>
                    <div style={{
                        opacity: 0,
                        'pointer-events': 'none',
                    }}><IconButton size="large" >.</IconButton></div>
                    <div style={{
                        opacity: 0,
                        'pointer-events': 'none',
                    }}><IconButton size="large" >.</IconButton></div>
                    <Typography
                        sx={{
                            textAlign: 'center',
                            flexGrow: 1,
                        }}
                        variant="h6"
                        component="h1"
                    >
                        Regexle
                    </Typography>
                    <IconButton size="large"><HelpIcon /></IconButton>
                    <IconButton size="large"><SettingsIcon /></IconButton>
                </Toolbar>
            </AppBar>
            <Card sx={{margin: '16px auto', width: 'fit-content'}}>
                <CardHeader title={wordsLeft().length > 1 ? `${wordsLeft().length} words left` : "1 word left (win)"} style={{'text-align': 'center'}} />
                <CardContent sx={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                    {/* <p>{word}</p>
                    {wordsLeft().length < 10 && <ul><For each={wordsLeft()}>{word => word}</For></ul>} */}
                    <For each={regexes()}>{(regex) => <RegexDisplay regex={regex} word={word} />}</For>
                    {!finished() && <RegexEntry onComplete={(regex) => {
                        setRegexes(regexes => [...regexes, regex]);
                        let rxp = new RegExp(regex, 'i');
                        let result = rxp.test(word);
                        console.log(word, regex, result);
                        setWordsLeft(wordsLeft => {
                            if (!wordsLeft.includes(word)) console.log('Lost word', word);
                            let newWordsLeft = wordsLeft.filter(word => rxp.test(word) == result);
                            let wordsDropped = wordsLeft.filter(word => rxp.test(word) != result);
                            if (wordsDropped.length != wordsLeft.length - newWordsLeft.length) console.log('Inconsistent word count');
                            if (wordsDropped.length < 50) {
                                console.log('Dropped', wordsDropped, 'after', regex);
                            }
                            if (!newWordsLeft.includes(word)) console.log('Lost word', word, 'after', regex);
                            return newWordsLeft;
                        });
                    }} />}
                </CardContent>
            </Card>
        </ThemeProvider>
    );
}

export default App;
