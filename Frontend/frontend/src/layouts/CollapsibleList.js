import React, { useState } from 'react';
import { List, ListItem, Collapse, Button, Box, Typography, Fade } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function CollapsibleList({
  items = [],
  maxVisible = 5,
  renderItem,
  title,
  sx,
  ...props
}) {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? items : items.slice(0, maxVisible);
  const hasMore = items.length > maxVisible;

  return (
    <Box sx={{ width: '100%', ...sx }}>
      {title && (
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          {title}
        </Typography>
      )}
      <List
        disablePadding
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: 2,
          bgcolor: 'background.paper',
          transition: 'box-shadow 0.3s',
        }}
        {...props}
      >
        {visibleItems.map((item, idx) => (
          <Fade in timeout={300} key={item.id || idx}>
            <div>
              {renderItem ? renderItem(item, idx) : (
                <ListItem>
                  <Typography>{typeof item === 'string' ? item : JSON.stringify(item)}</Typography>
                </ListItem>
              )}
            </div>
          </Fade>
        ))}
        {hasMore && (
          <ListItem
            disableGutters
            sx={{ justifyContent: 'center', bgcolor: 'background.default' }}
          >
            <Button
              variant="text"
              color="primary"
              onClick={() => setExpanded(e => !e)}
              endIcon={expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              sx={{
                transition: 'color 0.2s',
                fontWeight: 500,
                '&:hover': { color: 'primary.dark' }
              }}
            >
              {expanded ? "Скрыть" : `Показать ещё (${items.length - maxVisible})`}
            </Button>
          </ListItem>
        )}
      </List>
    </Box>
  );
}