import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@suid/material";

interface InfoDialogueProps {
    open: boolean;
    onClose(): void;
}
export default function InfoDialogue(props: InfoDialogueProps) {
    return <Dialog
        open={props.open}
        onClose={props.onClose}
    >
        <DialogTitle>How to play</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Guess the Regexle in 6 tries.
                <ul>
                    <li>

                        The secret word will be a random word from the Collins Scrabble dictionary (CSW 2019).
                    </li>
                    <li>
                        Each guess must be a valid regex, as determined by the browser's regex parser.
                    </li>
                    <li>
                        The colour of the regex will change to show if it matches the secret word.
                    </li>
                    <li>
                        The number of words remaining will decrease as you continue to make guesses.
                    </li>
                    <li>
                        The game ends when you reduce the number of words remaining to 1.
                    </li>
                </ul>
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Got it</Button>
        </DialogActions>
    </Dialog>;
}