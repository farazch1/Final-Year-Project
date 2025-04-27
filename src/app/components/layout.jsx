import * as React from 'react';
import { styled, useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CloudIcon from '@mui/icons-material/Cloud';
import WavesIcon from '@mui/icons-material/Waves';
import GrainIcon from '@mui/icons-material/Grain';
import OpacityIcon from '@mui/icons-material/Opacity';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import GlacierIcon from '@mui/icons-material/AcUnit';
import ReferenceIcon from '@mui/icons-material/LibraryBooks';
import PlotIcon from '@mui/icons-material/ShowChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import MapIcon from '@mui/icons-material/Map';
import SankeyChartIcon from '@mui/icons-material/CallSplit';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Image from 'next/image';
import logo from './logo.png';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Switch } from '@mui/material'; // Import Switch component
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : '#ffffff',
  color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })( 
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
      backgroundColor: theme.palette.background.default,
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
      backgroundColor: theme.palette.background.default,
    }),
  })
);

export default function Layout({ children }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [openPlot, setOpenPlot] = React.useState(false);
  const [openForecast, setOpenForecast] = React.useState(false);
  const [openMap, setOpenMap] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false); // State for dark mode
  const router = useRouter();
  const pathname = usePathname();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClickPlot = () => {
    setOpenPlot(!openPlot);
  };

  const handleClickForecast = () => {
    setOpenForecast(!openForecast);
  };

  const handleClickMap = () => {
    setOpenMap(!openMap);
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode); // Toggle dark mode state
  };

  // Define light and dark themes
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ marginRight: 5, ...(open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
     PID DashBoard
    </Typography>
    {/* Search Field */}
    <TextField
      variant="outlined"
      size="small"
      placeholder="Search..."
      sx={{ marginRight: 2, width: 200 }} // Adjust width as needed
    />
    {/* Sign In Button */}
    <Button color="inherit" sx={{ marginRight: 1 }}>
      Sign In
    </Button>
    {/* Sign Up Button */}
    <Button color="inherit">
      Sign Up
    </Button>
            <Switch checked={darkMode} onChange={handleToggleDarkMode} sx={{ marginLeft: 'auto' }} /> {/* Dark mode switch */}
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <Image src={logo} height={45} width={45} alt="logo" className="-ml-2 mr-2" />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Punjab Irrigation
            </Typography>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            <ListItem key="Dashboard" disablePadding className={pathname.startsWith("/dashboard") ? "text-sky-600" : "text-slate-700"} onClick={() => { router.push("/dashboard") }}>
              <ListItemButton>
                <ListItemIcon className={pathname.startsWith("/dashboard") ? "text-sky-600" : "text-slate-700"}>
                  <DashboardIcon sx={{ color: 'blue' }} />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem key="Water_Level" disablePadding className={pathname.startsWith("/water_Level") ? "text-sky-600" : "text-slate-700"} onClick={() => { router.push("/water_Level"); }}>
              <ListItemButton>
                <ListItemIcon>
                  <PieChartIcon sx={{ color: 'green' }} /> {/* Replaced DashboardIcon with PieChartIcon */}
              </ListItemIcon>
            <ListItemText primary="Water_Level" />
              </ListItemButton>
                </ListItem>
            <ListItem key="RiversData"
              disablePadding
              className={pathname.startsWith("/riversdata") ? "text-sky-600" : "text-slate-700"}
              onClick={() => { router.push("/riversdata") }}>
                <ListItemButton>
                  <ListItemIcon>
                    <WavesIcon sx={{ color: 'blue' }} />
                  </ListItemIcon>
                  <ListItemText primary="Rivers Data" />
                </ListItemButton>
              
            </ListItem>

            <ListItem key="RiversDataMap"
              disablePadding
              className={pathname.startsWith("/riversdatamap") ? "text-sky-600" : "text-slate-700"}
              onClick={() => { router.push("/riversdatamap") }}>
                <ListItemButton>
                  <ListItemIcon>
                    <WavesIcon sx={{ color: 'blue' }} />
                  </ListItemIcon>
                  <ListItemText primary="Rivers Data Map" />
                </ListItemButton>
              
            </ListItem>


            {/* Forecast Dropdown */}
            <ListItem key="Forecast" disablePadding className={pathname.startsWith("/forecast") ? "text-sky-600" : "text-slate-700"} onClick={() => { router.push("/forecast") }}>
              <ListItemButton>
                <ListItemIcon>
                  <CloudIcon sx={{ color: 'orange' }} /> {/* Replaced DashboardIcon with PieChartIcon */}
              </ListItemIcon>
            <ListItemText primary="Forecast" />
              </ListItemButton>
                </ListItem>

            <Divider />
            {/* Other Menu Items */}
            <ListItem key="Precipitation" disablePadding className={pathname.startsWith("/precipitation") ? "text-sky-600" : "text-slate-700"} onClick={() => { router.push("/precipitation") }}>
              <ListItemButton>
                <ListItemIcon>
                  <OpacityIcon sx={{ color: 'blue' }} />
                </ListItemIcon>
                <ListItemText primary="Precipitation" />
              </ListItemButton>
            </ListItem>
            <ListItem key="Temperature" disablePadding className={pathname.startsWith("/temperature") ? "text-sky-600" : "text-slate-700"} onClick={() => { router.push("/temperature") }}>
              <ListItemButton>
                <ListItemIcon>
                  <ThermostatIcon sx={{ color: 'red' }} />
                </ListItemIcon>
                <ListItemText primary="Temperature" />
              </ListItemButton>
            </ListItem>
            <ListItem key="Ml_Predictions" disablePadding className={pathname.startsWith("/glacier") ? "text-sky-600" : "text-slate-700"} onClick={() => { router.push("/ml_predictions") }}>
              <ListItemButton>
                <ListItemIcon>
                  <GlacierIcon sx={{ color: 'blue' }} />
                </ListItemIcon>
                <ListItemText primary="Ml_Predictions" />
              </ListItemButton>
            </ListItem>
            <Divider />
            {/* Plots Dropdown */}
            <ListItemButton onClick={handleClickPlot} className={pathname.startsWith("/plots") ? "text-sky-600" : "text-slate-700"}>
              <ListItemIcon>
                <PlotIcon sx={{ color: 'purple' }} />
              </ListItemIcon>
              <ListItemText primary="Plots" />
              {openPlot ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openPlot} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }} className={pathname === "/plots/pie-chart" ? "text-sky-600" : "text-slate-700"} onClick={() => { router.push("/plots/pie-chart") }}>
                  <ListItemIcon>
                    <PieChartIcon sx={{ color: 'purple' }} />
                  </ListItemIcon>
                  <ListItemText primary="Pie Chart" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }} className={pathname === "/plots/bar-chart" ? "text-sky-600" : "text-slate-700"} onClick={() => { router.push("/plots/bar-chart") }}>
                  <ListItemIcon>
                    <BarChartIcon sx={{ color: 'purple' }} />
                  </ListItemIcon>
                  <ListItemText primary="Bar Chart" />
                </ListItemButton>
              </List>
            </Collapse>
            <Divider />
            {/* Map Dropdown */}
            <ListItemButton 
  onClick={handleClickMap} 
  className={pathname.startsWith("/maps") ? "text-sky-600" : "text-slate-700"}
>
  <ListItemIcon>
    <MapIcon sx={{ color: 'green' }} />
  </ListItemIcon>
  <ListItemText primary="Maps" />
  {openMap ? <ExpandLess /> : <ExpandMore />}
</ListItemButton>
<Collapse in={openMap} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>
    <ListItemButton 
      sx={{ pl: 4 }} 
      className={pathname === "/maps/map-1" ? "text-sky-600" : "text-slate-700"} 
      onClick={() => { router.push("/maps/map-1") }}
    >
      <ListItemIcon>
        <MapIcon sx={{ color: 'green' }} />
      </ListItemIcon>
      <ListItemText primary="Map 1" />
    </ListItemButton>
    <ListItemButton 
      sx={{ pl: 4 }} 
      className={pathname === "/maps/map-2" ? "text-sky-600" : "text-slate-700"} 
      onClick={() => { router.push("/maps/map-2") }}
    >
      <ListItemIcon>
        <MapIcon sx={{ color: 'green' }} />
      </ListItemIcon>
      <ListItemText primary="Map 2" />
    </ListItemButton>
  </List>
</Collapse>
            <Divider />
            <ListItem key="Schmetic" disablePadding className={pathname.startsWith("/schmetic") ? "text-sky-600" : "text-slate-700"} onClick={() => { router.push("/schmetic") }}>
              <ListItemButton>
                <ListItemIcon>
                  <ReferenceIcon sx={{ color: 'grey' }} />
                </ListItemIcon>
                <ListItemText primary="Schmetic" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
          <DrawerHeader />
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
