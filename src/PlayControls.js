import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import { useState, useEffect, useCallback } from "react";
import GapiManager from "./GapiManager";
import PlayerManager from "./PlayerManager";

import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";
import PauseCircleFilledRoundedIcon from "@mui/icons-material/PauseCircleFilledRounded";

const playerManager = PlayerManager.getInstance();
const gapi = GapiManager.getInstance();

const TinyText = styled(Typography)({
  margin: 6,
  fontSize: "1rem",
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});

const mainIconColor = "#fff";

function PlayControls({ moduleInfo }) {
  const [name, setName] = useState("No module playing");
  const [paused, setPaused] = useState(false);
  const [currentPosition, setPosition] = useState(0);
  const [duration, setDuration] = useState(100);

  const afterLoad = useCallback((name, buffer) => {
    playerManager.player.play(buffer);
    setPaused(false);
    setDuration(playerManager.player.duration());
    setMetadata(name);
  }, []);

  useEffect(() => {
    if (moduleInfo && moduleInfo.url) {
      playerManager.player.stop();
      const headers = gapi.getAuthHeaders();
      playerManager.player.load(
        moduleInfo.url,
        afterLoad.bind(this, moduleInfo.fileName),
        headers
      );
    }
  }, [moduleInfo, afterLoad]);

  useEffect(() => {
    setInterval(() => {
      if (playerManager.player.currentPlayingNode) {
        setPosition(playerManager.player.getCurrentTime());
      }
    }, 500);
  }, []);

  const setMetadata = (name) => {
    const metadata = playerManager.player.metadata();
    var result = "";
    if (metadata["artist"] !== "") {
      result += metadata["artist"] + " : ";
    }
    if (metadata["title"] !== "") {
      result += metadata["title"];
    } else {
      result += name;
    }
    setName(result);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return minutes > 0 ? minutes + ":" + seconds : seconds;
  };

  const onSliderClick = (value) => {
    setPosition(value);
    playerManager.player.setCurrentTime(value);
  };

  const onPlayToggle = () => {
    setPaused(!paused);
    playerManager.player.togglePause();
  };

  return (
    <div sx={{ marginTop: "260px" }}>
      <Typography
        sx={{
          fontSize: 30,
          marginTop: 2,
          marginBottom: 1,
        }}
      >
        {name}
      </Typography>
      <Slider
        aria-label="time-indicator"
        min={0}
        max={duration}
        value={currentPosition}
        step={0.2}
        onChange={(_, value) => onSliderClick(value)}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: -2,
        }}
      >
        <TinyText>{formatTime(currentPosition)}</TinyText>
        <TinyText>{formatTime(duration)}</TinyText>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: -1,
        }}
      ></Box>
      <IconButton
        aria-label={paused ? "play" : "pause"}
        onClick={() => onPlayToggle(!paused)}
        sx={{ position: "relative", top: "-20px" }}
      >
        {paused ? (
          <PlayCircleRoundedIcon
            sx={{ fontSize: "5.5rem" }}
            htmlColor={mainIconColor}
          />
        ) : (
          <PauseCircleFilledRoundedIcon
            sx={{ fontSize: "5.5rem" }}
            htmlColor={mainIconColor}
          />
        )}
      </IconButton>
    </div>
  );
}

export default PlayControls;
