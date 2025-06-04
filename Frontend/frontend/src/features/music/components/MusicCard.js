import React from "react";
import { Card, CardMedia, CardContent, Typography, CardActionArea } from "@mui/material";
import { useNavigate } from "react-router-dom";
import placeholder from './placeholder.svg';
import { useSelector, useDispatch } from "react-redux";
import { getEntityById } from "../entitiesSlice";
import { getPerformerName } from "../misc/musicUtils.js";
import { usePlayer } from "../context/PlayerContext"; 

export default function MusicCard({ item, type }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const performersById = useSelector(
    (state) => state.entities.entities.performers?.byId || {}
  );
  const { playTrack } = usePlayer?.() || {}; 

  React.useEffect(() => {
    if (type === "track" && item.performer_id && !performersById[item.performer_id]) {
      dispatch(getEntityById({ entityType: "performers", id: item.performer_id }));
    }
  }, [type, item, performersById, dispatch]);

  let title, subtitle, image, to;
  if (type === "track") {
    title = item.title;
    subtitle = getPerformerName(item, performersById);
    image = item.cover_url || placeholder;
    to = `/tracks/${item.id}`;
  } else if (type === "playlist") {
    title = item.name;
    subtitle = item.description || "Плейлист";
    image = placeholder;
    to = `/playlists/${item.id}`;
  } else if (type === "performer") {
    title = item.name;
    subtitle = item.genre || "Исполнитель";
    image = item.avatar_url || placeholder;
    to = `/performers/${item.id}`;
  }

  const handleClick = (event) => {
    event.preventDefault();
    if (type === "track" && playTrack) {
      playTrack(item);
    } else {
      navigate(to);
    }
  };

  return (
    <Card sx={{ width: 200, mx: 1, flex: "0 0 auto", cursor: 'pointer' }}>
      <CardActionArea onClick={handleClick}>
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt={title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent>
          <Typography variant="subtitle1" noWrap>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {subtitle}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}