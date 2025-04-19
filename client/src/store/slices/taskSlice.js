import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import taskService from "../../services/taskService";

// Async thunks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (filters, { rejectWithValue }) => {
    try {
      return await taskService.getTasks(filters);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, { rejectWithValue }) => {
    try {
      return await taskService.createTask(taskData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ taskId, taskData }, { rejectWithValue }) => {
    try {
      return await taskService.updateTask(taskId, taskData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId, { rejectWithValue }) => {
    try {
      await taskService.deleteTask(taskId);
      return taskId;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchProjectTasks = createAsyncThunk(
  "tasks/fetchProjectTasks",
  async ({ projectId, filters }, { rejectWithValue }) => {
    try {
      return await taskService.getProjectTasks(projectId, filters);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchUserTasks = createAsyncThunk(
  "tasks/fetchUserTasks",
  async ({ userId, filters }, { rejectWithValue }) => {
    try {
      return await taskService.getUserTasks(userId, filters);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setCurrentTask: (state, action) => {
      state.currentTask = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
        if (state.currentTask?.id === action.payload) {
          state.currentTask = null;
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch project tasks
      .addCase(fetchProjectTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchProjectTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch user tasks
      .addCase(fetchUserTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchUserTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentTask, clearError } = taskSlice.actions;
export default taskSlice.reducer;
