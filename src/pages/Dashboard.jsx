import * as React from 'react'
import {styled, useTheme} from '@mui/material/styles'
import {
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
} from '@mui/icons-material'
import {
    AppBar as MuiAppBar,
    Box,
    CssBaseline,
    Divider,
    Drawer as MuiDrawer,
    IconButton,
    List,
    Toolbar,
    Typography,
} from '@mui/material'
import AtomCollapsableListItem from '../components/atoms/CollapsableListItem'
import AtomListItem from '../components/atoms/ListItem'
import {useSelector} from 'react-redux'
import {DrawerHeader} from '../utils/globalStyle'
import MainView from './MainView'

const drawerWidth = 240

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
})

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
})

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({theme, open}) => ({
    zIndex: theme.zIndex.drawer + 1,
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
}))

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({theme, open}) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
    }),
}))

export default function MiniDrawer() {
    const theme = useTheme()
    const menus = useSelector((state) => state.menu)
    const [open, setOpen] = React.useState(true)

    const toggleDrawer = () => {
        setOpen((prev) => !prev)
    }

    const renderSideBar = (menus) => {
        return menus.map(({id, childs}) => {
            if (childs) {
                return (
                    <AtomCollapsableListItem key={`collapse-${id}`} title={id}>
                        {renderSideBar(childs)}
                    </AtomCollapsableListItem>
                )
            }

            return <AtomListItem key={`item-${id}`} title={id} />
        })
    }

    console.log(menus)

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline />

            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && {display: 'none'}),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={toggleDrawer}>
                        {theme.direction === 'rtl' ? (
                            <ChevronRightIcon />
                        ) : (
                            <ChevronLeftIcon />
                        )}
                    </IconButton>
                </DrawerHeader>

                <Divider />

                <List>{renderSideBar(menus)}</List>
            </Drawer>

            <MainView />
        </Box>
    )
}
