import React, { useState, useRef, useEffect } from "react";
import { useSearch } from "../hooks/useSearch";
import {
  InputBase,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Popper,
  ClickAwayListener,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

export default function SearchDropdown() {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const { results, loading, error, search, clear } = useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    if (input.trim().length > 1) {
      search(input.trim());
      setOpen(true);
    } else {
      clear();
      setOpen(false);
    }
  }, [input]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Навигация по сущности по клику
  const handleSelect = (entityType, id) => {
    setOpen(false);
    setInput("");
    clear();
    navigate(`/music/${entityType}/${id}`);
  };

  // Навигация на общий поиск по Enter или по кнопке
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed.length > 1) {
      setOpen(false);
      clear();
      navigate(`/music/search?query=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  // Показать хотя бы часть если есть хотя бы один результат
  const hasResults =
    results.playlists.length > 0 ||
    results.tracks.length > 0 ||
    results.performers.length > 0;

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: "relative", minWidth: 240 }}>
        <Paper
          ref={anchorRef}
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            display: "flex",
            alignItems: "center",
            px: 1,
            height: 40,
            width: 300,
            borderRadius: 3,
            boxShadow: "none",
            bgcolor: "background.paper",
          }}
        >
          <SearchIcon sx={{ mr: 1, color: "action.active" }} />
          <InputBase
            value={input}
            onChange={handleInputChange}
            placeholder="Поиск музыки..."
            inputProps={{ "aria-label": "поиск" }}
            sx={{ flex: 1 }}
            onFocus={() => {
              if (input.trim().length > 1 && hasResults) setOpen(true);
            }}
            onKeyDown={e => {
              if (e.key === "Enter") {
                handleSearchSubmit(e);
              }
            }}
          />
          <IconButton
            type="submit"
            sx={{ p: 1 }}
            aria-label="search"
            disabled={input.trim().length <= 1}
          >
            <SearchIcon />
          </IconButton>
        </Paper>
        <Popper
          open={open && (loading || error || hasResults)}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          style={{ zIndex: 1301, width: anchorRef.current?.offsetWidth || 300 }}
        >
          <Paper
            sx={{
              mt: 1,
              maxHeight: 370,
              overflowY: "auto",
              boxShadow: 6,
              borderRadius: 2,
            }}
          >
            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress size={28} />
              </Box>
            )}
            {error && (
              <Box sx={{ color: "error.main", p: 2 }}>{error}</Box>
            )}
            {hasResults && (
              <List dense>
                {results.playlists.length > 0 && (
                  <>
                    <Typography variant="subtitle2" sx={{ px: 2, pt: 1 }}>
                      Плейлисты
                    </Typography>
                    {results.playlists.slice(0, 5).map((playlist) => (
                      <ListItem
                        button
                        key={"playlist-" + playlist.id}
                        onClick={() => handleSelect("playlists", playlist.id)}
                      >
                        <ListItemText
                          primary={playlist.name}
                          secondary={playlist.description}
                        />
                      </ListItem>
                    ))}
                  </>
                )}
                {results.tracks.length > 0 && (
                  <>
                    <Typography variant="subtitle2" sx={{ px: 2, pt: 1 }}>
                      Треки
                    </Typography>
                    {results.tracks.slice(0, 5).map((track) => (
                      <ListItem
                        button
                        key={"track-" + track.id}
                        onClick={() => handleSelect("tracks", track.id)}
                      >
                        <ListItemText
                          primary={track.title}
                          secondary={track.performer?.name}
                        />
                      </ListItem>
                    ))}
                  </>
                )}
                {results.performers.length > 0 && (
                  <>
                    <Typography variant="subtitle2" sx={{ px: 2, pt: 1 }}>
                      Исполнители
                    </Typography>
                    {results.performers.slice(0, 5).map((performer) => (
                      <ListItem
                        button
                        key={"performer-" + performer.id}
                        onClick={() => handleSelect("performers", performer.id)}
                      >
                        <ListItemText primary={performer.name} />
                      </ListItem>
                    ))}
                  </>
                )}
                {!hasResults && !loading && (
                  <ListItem>
                    <ListItemText primary="Нет результатов" />
                  </ListItem>
                )}
              </List>
            )}
            {!loading && !hasResults && !error && (
              <Box sx={{ p: 2, color: "text.secondary" }}>
                Введите запрос для поиска
              </Box>
            )}
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}