import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress, Typography } from "@mui/material";
import MusicTable from "../../music/components/MusicTable";
import { searchAll, clearSearch } from "../searchSlice";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResultsPage() {
  const query = useQuery().get("query") || "";
  const dispatch = useDispatch();
  const { results, loading, error } = useSelector((state) => state.search);

  useEffect(() => {
    if (!query) {
      dispatch(clearSearch());
      return;
    }
    dispatch(searchAll(query));
  }, [query, dispatch]);

  if (!query) return <Typography>Введите запрос для поиска</Typography>;
  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;

  const { tracks = [], playlists = [], performers = [] } = results || {};

  const totalFound = tracks.length + playlists.length + performers.length;

  return (
    <Box>
      <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>
        Результаты по запросу: "{query}"(всего найдено  {totalFound})
      </Typography>

      {tracks.length > 0 && (
        <MusicTable items={tracks} type="track" showAlbum={true} />
      )}
      {playlists.length > 0 && (
        <MusicTable items={playlists} type="playlist" />
      )}
      {performers.length > 0 && (
        <MusicTable items={performers} type="performer" />
      )}

      {totalFound === 0 && (
        <Typography sx={{ mt: 3 }}>Нет данных по вашему запросу</Typography>
      )}
    </Box>
  );
}