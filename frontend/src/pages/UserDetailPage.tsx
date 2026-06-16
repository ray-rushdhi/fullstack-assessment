import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Stack, Typography, Paper, TextField, Button, Grid, IconButton,
  CircularProgress, Alert, Snackbar, Divider, Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  getUser, updateUser, addAddress, updateAddress, deleteAddress,
} from '../api/users';
import type { UserDetail, Address, AddressRequest } from '../types';
import AddressFormDialog from '../components/AddressFormDialog';
import ConfirmDialog from '../components/ConfirmDialog';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const navigate = useNavigate();

  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Profile form state
  const [profile, setProfile] = useState({ email: '', firstName: '', lastName: '' });
  const [profileDirty, setProfileDirty] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Address dialog state
  const [addrDialogOpen, setAddrDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Delete confirm state
  const [confirmDelete, setConfirmDelete] = useState<Address | null>(null);

  // Toast state
  const [toast, setToast] = useState<{ msg: string; severity: 'success' | 'error' } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getUser(userId)
      .then(u => {
        if (cancelled) return;
        setUser(u);
        setProfile({ email: u.email, firstName: u.firstName, lastName: u.lastName });
      })
      .catch(() => { if (!cancelled) setError('Failed to load user.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [userId]);

  const updateProfileField = (k: 'email' | 'firstName' | 'lastName') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setProfile(prev => ({ ...prev, [k]: e.target.value }));
      setProfileDirty(true);
    };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      const updated = await updateUser(user.id, profile);
      setUser(updated);
      setProfileDirty(false);
      setToast({ msg: 'Profile updated', severity: 'success' });
    } catch {
      setToast({ msg: 'Failed to update profile', severity: 'error' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddressSubmit = async (body: AddressRequest) => {
    if (!user) return;
    try {
      if (editingAddress) {
        const updated = await updateAddress(user.id, editingAddress.id, body);
        setUser({
          ...user,
          addresses: user.addresses.map(a => a.id === updated.id ? updated : a),
        });
        setToast({ msg: 'Address updated', severity: 'success' });
      } else {
        const created = await addAddress(user.id, body);
        setUser({ ...user, addresses: [...user.addresses, created] });
        setToast({ msg: 'Address added', severity: 'success' });
      }
    } catch {
      setToast({ msg: 'Failed to save address', severity: 'error' });
      throw new Error('save failed');
    }
  };

  const handleDeleteAddress = async () => {
    if (!user || !confirmDelete) return;
    try {
      await deleteAddress(user.id, confirmDelete.id);
      setUser({ ...user, addresses: user.addresses.filter(a => a.id !== confirmDelete.id) });
      setToast({ msg: 'Address deleted', severity: 'success' });
    } catch {
      setToast({ msg: 'Failed to delete address', severity: 'error' });
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  }
  if (error || !user) {
    return <Alert severity="error">{error ?? 'User not found.'}</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/users')} sx={{ mb: 1 }}>
          Back to users
        </Button>
        <Typography variant="h5">{user.firstName} {user.lastName}</Typography>
        <Typography variant="body2" color="text.secondary">{user.email}</Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Profile</Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="First Name" value={profile.firstName} onChange={updateProfileField('firstName')} fullWidth />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Last Name" value={profile.lastName} onChange={updateProfileField('lastName')} fullWidth />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField label="Email" value={profile.email} onChange={updateProfileField('email')} fullWidth />
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="contained"
            disabled={!profileDirty || savingProfile}
            onClick={handleSaveProfile}
          >
            {savingProfile ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">Addresses</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => { setEditingAddress(null); setAddrDialogOpen(true); }}
          >
            Add Address
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {user.addresses.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
            No addresses yet. Click "Add Address" to create one.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {user.addresses.map(addr => (
              <Paper key={addr.id} variant="outlined" sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Chip label={addr.label} size="small" sx={{ mb: 1 }} />
                    <Typography variant="body2">{addr.line1}</Typography>
                    {addr.line2 && <Typography variant="body2">{addr.line2}</Typography>}
                    <Typography variant="body2">
                      {[addr.city, addr.state, addr.postalCode].filter(Boolean).join(', ')}
                    </Typography>
                    <Typography variant="body2">{addr.country}</Typography>
                  </Box>
                  <Box>
                    <IconButton onClick={() => { setEditingAddress(addr); setAddrDialogOpen(true); }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => setConfirmDelete(addr)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>

      <AddressFormDialog
        open={addrDialogOpen}
        initial={editingAddress}
        onClose={() => setAddrDialogOpen(false)}
        onSubmit={handleAddressSubmit}
      />

      <ConfirmDialog
        open={confirmDelete !== null}
        title="Delete address?"
        message={`Are you sure you want to delete the "${confirmDelete?.label}" address?`}
        onConfirm={handleDeleteAddress}
        onClose={() => setConfirmDelete(null)}
      />

      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {toast ? <Alert severity={toast.severity}>{toast.msg}</Alert> : undefined}
      </Snackbar>
    </Stack>
  );
}