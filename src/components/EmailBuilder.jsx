import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import UserList, { Container as UserListContainer } from './UserList';
import EmailForm from './EmailForm';
import UserAddForm from './UserAddForm';

export default function EmailBuilder() {
  const [selectedUsers, setSelectedUsers] = React.useState([]);

  return (
    <Grid container spacing={3}>
      <Link
        href="https://console.cloud.google.com/firestore/data?project=chingu"
        target="_blank"
      >
        Manage Directly
      </Link>
      <Grid item xs={12}>
        <UserAddForm />
      </Grid>
      <Grid item xs={4}>
        <Typography variant="h5">All Users</Typography>
        <UserListContainer
          handleCheck={(_, __, newChecked) => setSelectedUsers(newChecked)}
          selectable
        />
      </Grid>
      <Grid item xs={4}>
        <Typography variant="h5">Selected Users</Typography>
        <UserList users={selectedUsers} />
      </Grid>
      <Grid item xs={4}>
        <Typography variant="h5">Email Form</Typography>
        <EmailForm targetUsers={selectedUsers} />
      </Grid>
    </Grid>
  );
}
