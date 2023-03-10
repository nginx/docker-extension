import {useEffect} from "react";
import {
    Alert, 
    Box, 
    Button, 
    Grid, 
    InputAdornment, 
    TextField, 
    Typography,
    ThemeProvider,
    createTheme,
} from "@mui/material";
import PublishIcon from "@mui/icons-material/Publish";

const listTheme = createTheme({
    typography: {
        h3: {
            fontSize: 30,
        },
        subtitle2: {
            fontSize: 13,
            opacity: .6,
            overflow: 'hidden',
        },
        body1: {
            fontWeight: 400,
        },
        body2: {
            fontWeight: 600,
        },
    },
});

interface ServerProps {

}

export function Server(props: ServerProps) {

    useEffect(() => {

    })

    return(
        <Grid container direction={"column"} sx={{margin: 0, padding: 5}}>
            <ThemeProvider theme={listTheme}>
                <Typography variant={"h3"} sx={{marginBottom: 2}}>Add a Server</Typography>
                <Alert severity="info" sx={{marginBottom: 4}}>
                The new virtual server will be created in a new configuration file.
                </Alert>
                <Box>
                    <TextField
                        label="Configuration File Name"
                        InputProps={{
                            startAdornment: <InputAdornment position="start" sx={{marginRight: "1.5rem"}}>/etc/nginx/conf.d/</InputAdornment>,
                        }}
                        onChange={(e: any) => {}}
                    />
                </Box>
                <Box marginTop={1}>
                    <TextField
                        label="Virtual Server Name"
                        onChange={(e: any) => {}}
                    />
                </Box>
                <Box marginTop={1}>
                    <TextField
                        label="Listen Port"
                        onChange={(e: any) => {}}
                    />
                </Box>
                <Box  marginTop={2}>
                    <Button 
                        variant={"outlined"} 
                        startIcon={<PublishIcon/>}
                        onClick={() => {}}>Publish
                    </Button>
                </Box>
            </ThemeProvider>
        </Grid>
    )

}

