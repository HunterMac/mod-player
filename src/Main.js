import './Main.css';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Link from '@mui/material/Link';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useState } from 'react';
import GapiManager from './GapiManager';
import PlayControls from './PlayControls';

const gapiManager = GapiManager.getInstance();

function Main() {
  const [fileList, setFileList] = useState([]);
  const [moduleURL, setModuleUrl] = useState('');
  const [breadcrumbs] = useState([<Link underline="none" key="0" color="inherit" href="/" data-index="0" > 🖿 </Link>]);

  const onGoogleFileListLoad = (event) => {
    setFileList(event.detail.items);
  }

  window.addEventListener('googleFileListLoad', onGoogleFileListLoad);

  const onBreadcrumbClick = (id, index) => {
    const event = new CustomEvent('listLoadDir', {detail: {id}});
    breadcrumbs.splice(index)
    window.dispatchEvent(event);
  }

  const onListDirClick = (id, name) => {
    const event = new CustomEvent('listLoadDir', {detail: {id}});
    const itemIndex = breadcrumbs.length + 1;
    breadcrumbs.push(<Link key={id} underline="none" color="inherit" onClick={() => onBreadcrumbClick(id, itemIndex)} > {name} </Link>);
    window.dispatchEvent(event);
  }

  const renderList = (nodes) => {
    console.log('list render!');
    return nodes.map((node) => {
      return (<ListItem key={node.id} disablePadding dense>
        <ListItemButton onClick={() => 
          node.isDir ? onListDirClick(node.id, node.name) : setModuleUrl(gapiManager.getFileUrl(node.id))
        }>
        <ListItemText primary={(node.isDir ? "> " : "") + node.name} />
        </ListItemButton>
    </ListItem>)
    })
  }

  return (
    <div className="Main">
      <header className="App-header">
      <Grid container spacing={2} >
        <Grid container item xs={7} direction="column" >
        <Breadcrumbs sx={{
          color: 'white',
          margin: '1vh',
          fontSize: 22,
        }}
        separator={<NavigateNextIcon fontSize="medium" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
        <List sx={{
        width: '100%',
        maxWidth: '40vw',
        position: 'relative',
        overflow: 'auto',
        height: '96vh',
        padding:0,
        marginLeft: '1vw',
        '& ul': { padding: 0 },
        '& div': { padding: 0 },
        '& span': { fontSize: 20, lineHeight: 'inherit' },
      }}>
        {renderList(fileList)}
        </List>
        </Grid>
        <Grid container item xs={4} direction='column' >
          <PlayControls moduleURL={moduleURL}/>
          <Button variant="contained" onClick={gapiManager.signIn}>Google Drive Login</Button>
        </Grid>
      </Grid>
      </header>
    </div>
  );
}

export default Main;
