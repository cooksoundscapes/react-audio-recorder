import { CssBaseline } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Begin from './pages/Begin';
import Edit from './pages/Edit';
import { SamplerProvider } from './components/SamplerProvider';

const theme = createTheme({
    palette: {type: 'dark'}
});

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <SamplerProvider>
                <BrowserRouter>
                    <CssBaseline />
                    <Switch>
                        <Route exact path='/'>
                            <Begin />
                        </Route> 
                        <Route exact path='/edit'>
                            <Edit />
                        </Route>
                    </Switch>
                </BrowserRouter>
            </SamplerProvider>
        </ThemeProvider>
    )
}