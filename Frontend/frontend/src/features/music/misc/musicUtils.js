export function getPerformerName(item, performersById) {
    if (item.performer && item.performer.name) return item.performer.name;
    if (item.performer_id && performersById[item.performer_id] && performersById[item.performer_id].name)
      return performersById[item.performer_id].name;
    return "Исполнитель";
  }