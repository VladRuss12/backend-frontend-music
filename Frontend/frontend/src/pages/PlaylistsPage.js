import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEntities } from "../features/music/entitiesSlice";
import CardList from "../features/music/components/CardList";

export default function PlaylistsPage() {
  const dispatch = useDispatch();
  const playlists = useSelector(
    state => state.entities.entities.playlists?.allIds?.map(id => state.entities.entities.playlists.byId[id]) || []
  );

  useEffect(() => {
    if (!playlists.length) dispatch(getEntities({ entityType: "playlists" }));
  }, [dispatch, playlists.length]);

  return (
    <div>
      <CardList items={playlists} type="playlist" title="Плейлисты" />
    </div>
  );
}