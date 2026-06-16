import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, CircularProgress, Alert, Button, Stack,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { listUsers } from '../api/users';
import type { UserSummary } from '../types';

export default function UserListPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listUsers()
      .then(data => { if (!cancelled) setUsers(data); })
      .catch(() => { if (!cancelled) setError('Failed to load users.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const columns: GridColDef<UserSummary>[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 180,
      valueGetter: (_, row) => `${row.firstName} ${row.lastName}`,
    },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 220 },
    { field: 'addressCount', headerName: 'Addresses', width: 130, type: 'number' },
    {
      field: 'actions',
      headerName: '',
      sortable: false,
      filterable: false,
      width: 130,
      renderCell: (params) => (
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/users/${params.row.id}`)}
        >
          Manage
        </Button>
      ),
    },
  ];

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5">Users</Typography>
        <Typography variant="body2" color="text.secondary">
          Manage user profiles and their addresses.
        </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper sx={{ height: 520, p: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={users}
            columns={columns}
            disableRowSelectionOnClick
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            pageSizeOptions={[10, 25]}
          />
        )}
      </Paper>
    </Stack>
  );
}