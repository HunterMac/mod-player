import './Main.css';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Link from '@mui/material/Link';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useState, useEffect } from 'react';
import Gapi from './Gapi';
import PlayerManager from './PlayerManager';

import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';

const playerManager = PlayerManager.getInstance();
const gapi = Gapi.getInstance();

const TinyText = styled(Typography)({
  fontSize: '0.75rem',
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});

const mainIconColor = '#fff';

function Main() {
  const [name, setName] = useState('No module playing')
  const [paused, setPaused] = useState(false);
  const [currentPosition, setPosition] = useState(0);
  const [duration, setDuration] = useState(100);
  const [data, setData] = useState([]);
  const [breadcrumbs] = useState([<Link underline="none" key="1" color="inherit" href="/" data-index="0" > 🖿 </Link>]);

  useEffect(() => {
    setInterval(() => {
      setPosition(playerManager.player.getCurrentTime());
    }, 250);
  }, []);

  const onGoogleFileListLoad = (event) => {
    console.log('googleFileListLoad');
    setData(event.detail.items);
  }

  window.addEventListener('googleFileListLoad', onGoogleFileListLoad);

  const setMetadata = (name) => {
    const metadata = playerManager.player.metadata();
    var result = '';
    if (metadata['artist'] != '') {
      result += metadata['artist'] + ' : ';
    }
    if (metadata['title'] != '') {
      result += metadata['title'];
    } else {
      result += name;
    }
    setName(result);
  }

  function playMod() {
    playerManager.player.load('rfchip001.xm', afterLoad.bind(this, 'Muffler-Droppop.xm'));
  }

  function stopMod() {
    playerManager.player.stop();
  }

  function afterLoad(name, buffer) {
    playerManager.player.play(buffer);
    setDuration(playerManager.player.duration());
    
    setMetadata(name);
    //pausePauseButton();
    const event = new CustomEvent('modLoaded');
    window.dispatchEvent(event);
  }

  const onBreadcrumbClick = (id, index) => {
    const event = new CustomEvent('listLoadDir', {detail: {id}});
    breadcrumbs.splice(index)
    window.dispatchEvent(event);
  }

  const onListDirClick = (id, name) => {
    const event = new CustomEvent('listLoadDir', {detail: {id}});
    const itemIndex = breadcrumbs.length + 1;
    breadcrumbs.push(<Link underline="none" color="inherit" onClick={() => onBreadcrumbClick(id, itemIndex)} > {name} </Link>);
    window.dispatchEvent(event);
  }

  const onListFileClick = (id, name) => {
    playerManager.player.stop();
    const headers = gapi.getAuthHeaders();
    const path = `https://www.googleapis.com/drive/v3/files/${id}?alt=media`;
    playerManager.player.load(path, afterLoad.bind(this, name), headers);
  }

  const renderList = (nodes) => {
    console.log('list render!');
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

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return minutes > 0 ? minutes + ':' + seconds : seconds;
  }

  const changePlayerPosition = (value) => {
    console.log('change position from component!')
    setPosition(value);
    playerManager.player.setCurrentTime(value);
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
        {renderList(data)}
        </List>
        </Grid>
      <Grid container item xs={4} direction="column" >
        <p>
          {name}
          <Slider
            aria-label="time-indicator"
            min={0}
            max={duration}
            value={currentPosition}
            step={0.2}
            onChange={(_, value) => changePlayerPosition(value)}
          />
          <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: -2,
          }}
        >
          <TinyText>{formatTime(currentPosition)}</TinyText>
          <TinyText>{formatTime(duration)}</TinyText>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: -1,
          }}
        ></Box>
          <br/>
          <IconButton
            aria-label={paused ? 'play' : 'pause'}
            onClick={() => setPaused(!paused)}
          >
            {paused ? (
              <PlayArrowRounded
                sx={{ fontSize: '3rem' }}
                htmlColor={mainIconColor}
              />
            ) : (
              <PauseRounded sx={{ fontSize: '3rem' }} htmlColor={mainIconColor} />
            )}
          </IconButton>
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
