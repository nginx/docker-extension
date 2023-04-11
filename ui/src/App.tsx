import React from 'react';
import { Typography } from '@mui/material';
import {NginxInstance} from "./instances/NginxInstances";

export function App() {

  return (
    <>
      <Typography variant="h2">NGINX Development Center</Typography>
      <NginxInstance />
    </>
  );
}
