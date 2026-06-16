import { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, Stack,
} from '@mui/material';
import type { Address, AddressRequest } from '../types';

interface Props {
  open: boolean;
  initial?: Address | null;
  onClose: () => void;
  onSubmit: (body: AddressRequest) => Promise<void>;
}

const empty: AddressRequest = {
  label: '', line1: '', line2: '', city: '', state: '', postalCode: '', country: '',
};

export default function AddressFormDialog({ open, initial, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<AddressRequest>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initial
        ? {
            label: initial.label, line1: initial.line1, line2: initial.line2 ?? '',
            city: initial.city, state: initial.state ?? '',
            postalCode: initial.postalCode, country: initial.country,
          }
        : empty);
    }
  }, [open, initial]);

  const update = (k: keyof AddressRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const isValid = form.label && form.line1 && form.city && form.postalCode && form.country;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initial ? 'Edit Address' : 'Add Address'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Label (e.g. Home, Office)" value={form.label} onChange={update('label')} required fullWidth />
          <TextField label="Address Line 1" value={form.line1} onChange={update('line1')} required fullWidth />
          <TextField label="Address Line 2" value={form.line2 ?? ''} onChange={update('line2')} fullWidth />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="City" value={form.city} onChange={update('city')} required fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="State / Province" value={form.state ?? ''} onChange={update('state')} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Postal Code" value={form.postalCode} onChange={update('postalCode')} required fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Country" value={form.country} onChange={update('country')} required fullWidth />
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!isValid || saving}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}