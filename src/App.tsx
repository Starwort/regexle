import {Rerun} from '@solid-primitives/keyed';
import HelpIcon from '@suid/icons-material/HelpOutline';
import SettingsIcon from '@suid/icons-material/Settings';
import {AppBar, Button, Card, CardContent, CardHeader, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, ThemeProvider, Toolbar, Typography} from '@suid/material';
import {For, createEffect, createSignal} from 'solid-js';
import InfoDialogue from './components/InfoDialogue';
import RegexDisplay from './components/RegexDisplay';
import RegexEntry from './components/RegexEntry';
import SettingsDialogue from './components/SettingsDialogue';
import words from './dictionary';
import {dark, light} from './themes';

function App() {
    const seed = Math.floor((+new Date()) / 86400_000);
    const wordIdx = (seed * 7153873) % words.length;
    const word = words[wordIdx];
    const [regexes, setRegexes] = createSignal<string[]>(JSON.parse(localStorage[`regexle-seed-${seed}`] ?? '[]'));
    const [wordsLeft, setWordsLeft] = createSignal((() => {
        let wordsLeft = words;
        for (let regex of regexes()) {
            const result = (new RegExp(regex, 'i')).test(word);
            wordsLeft = wordsLeft.filter(word => (new RegExp(regex, 'i')).test(word) == result);
        }
        return wordsLeft;
    })());
    const [theme, setTheme] = createSignal(localStorage.theme ?? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
    const [info, setInfo] = createSignal(false);
    const [settings, setSettings] = createSignal(false);
    const [win, setWin] = createSignal(wordsLeft().length == 1);

    const finished = () => wordsLeft().length == 1;

    createEffect(() => {
        localStorage.theme = theme();
    });
    createEffect(() => {
        if (wordsLeft().length == 1) {
            setWin(true);
        }
    });
    createEffect(() => {
        localStorage[`regexle-seed-${seed}`] = JSON.stringify(regexes());
    });


    return <Rerun on={theme()}>
        <ThemeProvider theme={theme() == 'dark' ? dark : light}>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar sx={{
                    display: 'flex',
                    gap: 1,
                }}>
                    <div style={{
                        opacity: 0,
                        'pointer-events': 'none',
                    }}><IconButton size="large" ><HelpIcon /></IconButton></div>
                    <div style={{
                        opacity: 0,
                        'pointer-events': 'none',
                    }}><IconButton size="large" ><HelpIcon /></IconButton></div>
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
                    <IconButton size="large" onClick={() => setInfo(true)}><HelpIcon /></IconButton>
                    <IconButton size="large" onClick={() => setSettings(true)}><SettingsIcon /></IconButton>
                </Toolbar>
            </AppBar>
            <Card sx={{margin: '16px auto', width: 'fit-content'}}>
                <CardHeader title={wordsLeft().length > 1 ? `${wordsLeft().length} words left` : "1 word left"} style={{'text-align': 'center'}} />
                <CardContent sx={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                    <For each={regexes()}>{(regex) => <RegexDisplay regex={regex} word={word} />}</For>
                    {!finished() && <RegexEntry onComplete={(regex) => {
                        setRegexes(regexes => [...regexes, regex]);
                        let rxp = new RegExp(regex, 'i');
                        let result = rxp.test(word);
                        setWordsLeft(wordsLeft => wordsLeft.filter(word => rxp.test(word) == result));
                    }} />}
                </CardContent>
            </Card>
            <InfoDialogue open={info()} onClose={() => setInfo(false)} />
            <SettingsDialogue
                open={settings()}
                onClose={() => setSettings(false)}
                theme={theme()}
                onThemeChange={() => setTheme(
                    theme => theme == 'light' ? 'dark' : 'light'
                )}
            />
            <Dialog open={win()}>
                <DialogTitle>You won!</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {makeTextRepresentation(regexes(), word, seed).split('\n').map(line => <>{line}<br /></>)}
                        The word was {word}.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={
                        () => navigator.clipboard.writeText(
                            makeTextRepresentation(regexes(), word, seed)
                        )
                    }>Share</Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    </Rerun>;
}

function makeTextRepresentation(regexes: string[], word: string, seed: number) {
    let lengths = regexes.map(regex => Math.ceil(regex.length * 5 / word.length));
    let colours = regexes.map(regex => (new RegExp(regex, 'i')).test(word) ? '🟩' : '🟥');
    return `Regexle #${seed}\n${lengths.map(
        (length, idx) => colours[idx].repeat(length)
    ).join('\n')}\n${regexes.length} regex${'es'.repeat(+(regexes.length != 1))}`;
}

export default App;;
