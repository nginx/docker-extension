import React from "react";
import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import {DockerMuiThemeProvider} from "@docker/docker-mui-theme";

import {App} from './App';
import {createTheme, ThemeProvider, useTheme} from "@mui/material";

const CustomThemeProvider = ({ children }: any) => {
    const theme = useTheme();
    theme.components = {
        ...theme.components,
        MuiChip: {
            styleOverrides: {
                outlined: {
                    textTransform: "inherit"
                },
            },
        },
    };
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <DockerMuiThemeProvider>
            <CustomThemeProvider>
                <CssBaseline/>
                <App/>
            </CustomThemeProvider>
        </DockerMuiThemeProvider>
    </React.StrictMode>
);
