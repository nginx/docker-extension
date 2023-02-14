import React from 'react';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Typography } from '@mui/material';
import {NginxInstance} from "./instances/NginxInstance";

const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

export function App() {
  const [response, setResponse] = React.useState<string>();
  const ddClient = useDockerDesktopClient();

  return (
    <>
      <Typography variant="h3">NGINX Manager</Typography>
      <NginxInstance />
    </>
  );
}
