import React from 'react';
import AppShell from './AppShell';
import EmailBuilder from '../components/EmailBuilder';

function Home() {
  return (
    <AppShell>
      <EmailBuilder />
    </AppShell>
  );
}

export default Home;
