import {Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Switch} from "@suid/material";

interface SettingsDialogueProps {
    open: boolean;
    onClose(): void;
    theme: 'light' | 'dark';
    onThemeChange(): void;
}
export default function SettingsDialogue(props: SettingsDialogueProps) {
    return <Dialog
        open={props.open}
        onClose={props.onClose}
    >
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
            <FormControlLabel
                control={<Switch checked={props.theme == 'dark'} onChange={props.onThemeChange} />}
                label="Dark mode"
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Done</Button>
        </DialogActions>
    </Dialog>;
}