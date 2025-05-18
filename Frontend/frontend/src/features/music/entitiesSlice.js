import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchEntityById,
  fetchEntities,
  createEntity,
  updateEntity,
  deleteEntity
} from './entitiesService';

// Универсальные async thunks
export const getEntityById = createAsyncThunk(
  'entities/getEntityById',
  async ({ entityType, id }) => {
    const data = await fetchEntityById(entityType, id);
    return { entityType, id, data };
  }
);

export const getEntities = createAsyncThunk(
  'entities/getEntities',
  async (entityType) => {
    const data = await fetchEntities(entityType);
    return { entityType, data };
  }
);

export const addEntity = createAsyncThunk(
  'entities/addEntity',
  async ({ entityType, data }) => {
    const newEntity = await createEntity(entityType, data);
    return { entityType, newEntity };
  }
);

export const editEntity = createAsyncThunk(
  'entities/editEntity',
  async ({ entityType, id, data }) => {
    const updatedEntity = await updateEntity(entityType, id, data);
    return { entityType, id, updatedEntity };
  }
);

export const removeEntity = createAsyncThunk(
  'entities/removeEntity',
  async ({ entityType, id }) => {
    await deleteEntity(entityType, id);
    return { entityType, id };
  }
);

// Начальное состояние: entities = { [entityType]: { byId: {}, allIds: [] } }
const initialState = {
  entities: {},
  loading: {},
  error: {},
};

const entitiesSlice = createSlice({
  name: 'entities',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Получить все сущности (getEntities)
    builder.addCase(getEntities.pending, (state, action) => {
      const entityType = action.meta.arg;
      state.loading[entityType] = true;
      state.error[entityType] = null;
    });
    builder.addCase(getEntities.fulfilled, (state, action) => {
      const { entityType, data } = action.payload;
      state.entities[entityType] = {
        byId: Object.fromEntries(data.map(item => [item.id, item])),
        allIds: data.map(item => item.id),
      };
      state.loading[entityType] = false;
    });
    builder.addCase(getEntities.rejected, (state, action) => {
      const entityType = action.meta.arg;
      state.loading[entityType] = false;
      state.error[entityType] = action.error.message;
    });

    // Получить одну сущность по id (getEntityById)
    builder.addCase(getEntityById.pending, (state, action) => {
      const { entityType } = action.meta.arg;
      state.loading[entityType] = true;
      state.error[entityType] = null;
    });
    builder.addCase(getEntityById.fulfilled, (state, action) => {
      const { entityType, id, data } = action.payload;
      if (!state.entities[entityType]) {
        state.entities[entityType] = { byId: {}, allIds: [] };
      }
      state.entities[entityType].byId[id] = data;
      if (!state.entities[entityType].allIds.includes(id)) {
        state.entities[entityType].allIds.push(id);
      }
      state.loading[entityType] = false;
    });
    builder.addCase(getEntityById.rejected, (state, action) => {
      const { entityType } = action.meta.arg;
      state.loading[entityType] = false;
      state.error[entityType] = action.error.message;
    });

    // Создать (addEntity)
    builder.addCase(addEntity.pending, (state, action) => {
      const { entityType } = action.meta.arg;
      state.loading[entityType] = true;
      state.error[entityType] = null;
    });
    builder.addCase(addEntity.fulfilled, (state, action) => {
      const { entityType, newEntity } = action.payload;
      if (!state.entities[entityType]) {
        state.entities[entityType] = { byId: {}, allIds: [] };
      }
      state.entities[entityType].byId[newEntity.id] = newEntity;
      if (!state.entities[entityType].allIds.includes(newEntity.id)) {
        state.entities[entityType].allIds.push(newEntity.id);
      }
      state.loading[entityType] = false;
    });
    builder.addCase(addEntity.rejected, (state, action) => {
      const { entityType } = action.meta.arg;
      state.loading[entityType] = false;
      state.error[entityType] = action.error.message;
    });

    // Редактировать (editEntity)
    builder.addCase(editEntity.pending, (state, action) => {
      const { entityType } = action.meta.arg;
      state.loading[entityType] = true;
      state.error[entityType] = null;
    });
    builder.addCase(editEntity.fulfilled, (state, action) => {
      const { entityType, id, updatedEntity } = action.payload;
      if (!state.entities[entityType]) {
        state.entities[entityType] = { byId: {}, allIds: [] };
      }
      state.entities[entityType].byId[id] = updatedEntity;
      if (!state.entities[entityType].allIds.includes(id)) {
        state.entities[entityType].allIds.push(id);
      }
      state.loading[entityType] = false;
    });
    builder.addCase(editEntity.rejected, (state, action) => {
      const { entityType } = action.meta.arg;
      state.loading[entityType] = false;
      state.error[entityType] = action.error.message;
    });

    // Удалить (removeEntity)
    builder.addCase(removeEntity.pending, (state, action) => {
      const { entityType } = action.meta.arg;
      state.loading[entityType] = true;
      state.error[entityType] = null;
    });
    builder.addCase(removeEntity.fulfilled, (state, action) => {
      const { entityType, id } = action.payload;
      if (state.entities[entityType]) {
        delete state.entities[entityType].byId[id];
        state.entities[entityType].allIds = state.entities[entityType].allIds.filter(_id => _id !== id);
      }
      state.loading[entityType] = false;
    });
    builder.addCase(removeEntity.rejected, (state, action) => {
      const { entityType } = action.meta.arg;
      state.loading[entityType] = false;
      state.error[entityType] = action.error.message;
    });
  }
});

export default entitiesSlice.reducer;