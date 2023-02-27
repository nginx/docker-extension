import React from 'react';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Typography } from '@mui/material';
import {NginxInstance} from "./instances/NginxInstances";

const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

export function App() {
  const [response, setResponse] = React.useState<string>();
  const ddClient = useDockerDesktopClient();

  return (
    <>
      <Typography variant="h2">NGINX Development Center</Typography>
      <Typography variant="subtitle2">Alpha-Release alpha.0.1</Typography>
      <NginxInstance />
    </>
  );
}
