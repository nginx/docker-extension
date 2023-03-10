import {useEffect} from "react";
import {
    Alert, 
    Box, 
    Button, 
    Grid, 
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

interface LocationProps {

}

export function Location(props: LocationProps) {

    useEffect(() => {

    })

    return(
        <Grid container direction={"column"} sx={{margin: 0, padding: 5}}>
            <ThemeProvider theme={listTheme}>
                <Typography variant={"h3"} sx={{marginBottom: 2}}>Add a Location to Server</Typography>
                <Alert severity="info" sx={{marginBottom: 4}}>
                    Some information
                </Alert>

                <Box>
                    <Button variant={"outlined"} startIcon={<PublishIcon/>}
                            onClick={() => {}}
                            style={{marginLeft: "0.5rem"}}>Publish</Button>
                </Box>
            </ThemeProvider>
        </Grid>
    )

}

