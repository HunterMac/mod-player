import './Main.css';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Link from '@mui/material/Link';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useState } from 'react';
import Gapi from './Gapi';

function Main() {
  const [state] = useState({});
  const [data, setData] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([<Link underline="none" key="1" color="inherit" href="/" > 🖿 </Link>]);

  const onGoogleFileListLoad = (event) => {
    console.log('googleFileListLoad');
    setData(event.detail.items);
  }

  window.addEventListener('googleFileListLoad', onGoogleFileListLoad);
  const gapi = Gapi.getInstance();
    
  state.player = new window.ChiptuneJsPlayer(new window.ChiptuneJsConfig(-1));

  function playMod() {
    state.player.load('rfchip001.xm', afterLoad.bind(this, 'Muffler-Droppop.xm'));
  }

  function stopMod() {
    state.player.stop();
  }

  function afterLoad(path, buffer) {
    state.player.play(buffer);
    //setMetadata(path);
    //pausePauseButton();
    const event = new CustomEvent('modLoaded');
    window.dispatchEvent(event);
  }

  const onBreadcrumbClick = (id, name) => {
    const event = new CustomEvent('listLoadDir', {detail: {id}});
    //breadcrumbs.push(<Link underline="none" key="1" color="inherit" onClick={() => onListDirClick(id)} > {name} </Link>);
    setBreadcrumbs(breadcrumbs);
    window.dispatchEvent(event);
  }

  const onListDirClick = (id, name) => {
    const event = new CustomEvent('listLoadDir', {detail: {id}});
    breadcrumbs.push(<Link underline="none" key="1" color="inherit" onClick={() => onBreadcrumbClick(id)} > {name} </Link>);
    setBreadcrumbs(breadcrumbs);
    window.dispatchEvent(event);
  }

  const onListFileClick = (id) => {
    state.player.stop();
    const headers = gapi.getAuthHeaders();
    console.log(headers);
    const path = `https://www.googleapis.com/drive/v3/files/${id}?alt=media`;
    state.player.load(path, afterLoad.bind(this, path), headers);
  }

  const renderList = (nodes) => {
    console.log('list render!');
    console.log(nodes);
    return nodes.map((node) => {
      return (<ListItem key={node.path} disablePadding dense>
        <ListItemButton onClick={() => 
          node.isDir ? onListDirClick(node.id, node.name) : onListFileClick(node.id, node.name)
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
        marginLeft: '1vw',
        '& ul': { padding: 0 },
        '& div': { padding: 0 },
        '& span': { fontSize: 20 },
      }}>
        {renderList(data)}
        </List>
        </Grid>
      <Grid container item xs={4} direction="column" >
        <p>
          No module selected
          <Slider
            aria-label="Temperature"
            defaultValue={30}
            valueLabelDisplay="auto"
            min={10}
            max={100}
          />
          <br/>
          <Button variant="contained" onClick={gapi.signIn}>Google Drive Login</Button>
          <Button variant="contained" onClick={playMod} >Play mod</Button>
          <Button variant="contained" onClick={stopMod} >Stop mod</Button>
        </p>
        </Grid>
      </Grid>
      </header>
    </div>
  );
}

export default Main;
