import './Main.css';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import LoginButton from './LoginButton'
import { useState } from 'react';

function Main() {
  const [state, setState] = useState({});
  const [data, setData] = useState(
    [{
      id: 'root',
      name: 'Top1',
      children: [
        {
          id: '1',
          name: 'Child - 1',
        },
        {
          id: '3',
          name: 'Child - 3',
          children: []
        },
      ]},
      {
        id: '2312',
        name: 'Top2',
        children: []
    }]
  );
  
  state.player = new window.ChiptuneJsPlayer(new window.ChiptuneJsConfig(-1));

  function afterLoad(path, buffer) {
    console.log('play');
    state.player.play(buffer);
  }

  function playMod() {
    state.player.load('rfchip001.xm', afterLoad.bind(this, 'Muffler-Droppop.xm'));
  }

  function stopMod() {
    state.player.stop();
  }

  // setData({
  //   id: 'root',
  //   name: 'Parent',
  //   children: [
  //     {
  //       id: '1',
  //       name: 'Child - 1',
  //     },
  //     {
  //       id: '3',
  //       name: 'Child - 3',
  //       children: [
  //         {
  //           id: '4',
  //           name: 'Child - 4',
  //         },
  //       ],
  //     },
  //   ],
  // });
  // data = {
  //   id: 'root',
  //   name: 'Parent',
  //   children: [
  //     {
  //       id: '1',
  //       name: 'Child - 1',
  //     },
  //     {
  //       id: '3',
  //       name: 'Child - 3',
  //       children: [
  //         {
  //           id: '4',
  //           name: 'Child - 4',
  //         },
  //       ],
  //     },
  //   ],
  // };

  // const renderTree = (nodes) => (
    
  //   <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
  //     {Array.isArray(nodes.children)
  //       ? nodes.children.map((node) => renderTree(node))
  //       : null}
  //   </TreeItem>
  // );

  const renderTree = (nodes) => {
    console.log(nodes);
    nodes.map((node) => (
      <TreeItem key={node.id} nodeId={node.id} label={node.name}>
        {Array.isArray(node.children)
        ? nodes.children.map((children) => renderTree(children))
        : null}
      </TreeItem>
    ))
  };

  
  const onDirLoad = (list) => {
    console.log('onDirLoad');
    console.log(list);
    //setData(list);
  }

  return (
    <div className="Main">
      <header className="App-header">
      <Grid container spacing={2} >
        <Grid container item xs={7} direction="column" >
          <TreeView
          aria-label="file system navigator"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          sx={{ height: 240, flexGrow: 1 }}
          >
          {renderTree(data)}
        </TreeView>
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
          <LoginButton onDirLoad={onDirLoad} >asdas</LoginButton>
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
