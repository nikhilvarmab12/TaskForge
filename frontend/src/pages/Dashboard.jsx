import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../services/taskService";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function Dashboard() {

  const navigate = useNavigate();

  // STATES

  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [editingTaskId, setEditingTaskId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");

  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [viewMode, setViewMode] = useState("grid");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "TODO",
    priority: "LOW",
    dueDate: "",
  });

  // LOAD TASKS

 const fetchTasks = async () => {

  try {

    setLoading(true);

    const data = await getTasks();

    setTasks(data);

  } catch (error) {

    console.log(error);

    toast.error("Failed to load tasks");

  } finally {

    setLoading(false);
  }
};
  // INITIAL LOAD

  useEffect(() => {
    (async () => {
      await fetchTasks();
    })();
  }, []);

  // DARK MODE

  useEffect(() => {

    if (darkMode) {

      document.documentElement.classList.add("dark");

      localStorage.setItem("theme", "dark");

    } else {

      document.documentElement.classList.remove("dark");

      localStorage.setItem("theme", "light");
    }

  }, [darkMode]);

  // HANDLE INPUTS

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // CREATE OR UPDATE TASK

  const handleCreateTask = async (e) => {

    e.preventDefault();

    try {

      if (editingTaskId) {

        await updateTask(editingTaskId, formData);

        setEditingTaskId(null);

      } else {

        await createTask(formData);
      }

      fetchTasks();
      toast.success(
  editingTaskId
    ? "Task updated successfully"
    : "Task created successfully"
);

      setFormData({
        title: "",
        description: "",
        status: "TODO",
        priority: "LOW",
        dueDate: "",
      });

    } catch (error) {

      console.log(error);

      toast.error("Operation failed");
    }
  };

  // DELETE TASK

  const handleDelete = async (id) => {

    try {

      await deleteTask(id);

      fetchTasks();
      toast.success("Task deleted successfully");

    } catch (error) {

      console.log(error);

      toast.error("Failed to delete task");
    }
  };

  // EDIT TASK
  const handleToggleComplete = async (task) => {

  try {

    const updatedTask = {
      ...task,
      status:
        task.status === "DONE"
          ? "TODO"
          : "DONE",
    };

    await updateTask(task.id, updatedTask);

    fetchTasks();

    toast.success(
      task.status === "DONE"
        ? "Task marked as pending"
        : "Task completed"
    );

  } catch (error) {

    console.log(error);

    toast.error("Failed to update task");
  }
};
  const handleEdit = (task) => {

    setEditingTaskId(task.id);

    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
    });
  };

  // LOGOUT

  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/login");
  };

  // STATS

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "DONE"
  ).length;

  const completionPercentage =
  totalTasks === 0
    ? 0
    : Math.round(
        (completedTasks / totalTasks) * 100
      );


  const pendingTasks = tasks.filter(
    (task) => task.status !== "DONE"
  ).length;

  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "HIGH"
  ).length;

  // ANALYTICS DATA

 

const statusData =
  tasks.length === 0
    ? [{ name: "EMPTY", value: 1 }]
    : [  {
    name: "TODO",
    value: tasks.filter(
      (task) => task.status === "TODO"
    ).length,
  },
  {
    name: "IN_PROGRESS",
    value: tasks.filter(
      (task) =>
        task.status === "IN_PROGRESS"
    ).length,
  },
  {
    name: "DONE",
    value: tasks.filter(
      (task) => task.status === "DONE"
    ).length,
  },
];

const priorityData = [
  {
    name: "LOW",
    value: tasks.filter(
      (task) => task.priority === "LOW"
    ).length,
  },
  {
    name: "MEDIUM",
    value: tasks.filter(
      (task) => task.priority === "MEDIUM"
    ).length,
  },
  {
    name: "HIGH",
    value: tasks.filter(
      (task) => task.priority === "HIGH"
    ).length,
  },
];

const COLORS = [
  "#3B82F6",
  "#F59E0B",
  "#10B981",
];

  const getDueStatus = (dueDate) => {

  if (!dueDate) {
    return {
      text: "No Due Date",
      color: "bg-gray-500",
    };
  }

  const today = new Date();

  const due = new Date(dueDate);

  // REMOVE TIME FOR ACCURATE COMPARISON

  today.setHours(0, 0, 0, 0);

  due.setHours(0, 0, 0, 0);

  // OVERDUE

  if (due < today) {

    return {
      text: "Overdue",
      color: "bg-red-500",
    };
  }

  // TODAY

  if (due.getTime() === today.getTime()) {

    return {
      text: "Due Today",
      color: "bg-yellow-500",
    };
  }

  // UPCOMING

  return {
    text: "Upcoming",
    color: "bg-green-500",
  };
};

  // FILTERED TASKS

  const filteredTasks = tasks.filter((task) => {

    const matchesSearch =
      task.title.toLowerCase().includes(
        searchTerm.toLowerCase()
      );

    const matchesStatus =
      statusFilter === "ALL" ||
      task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "ALL" ||
      task.priority === priorityFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority
    );
  });

  const todoTasks = filteredTasks.filter(
  (task) => task.status === "TODO"
);

const inProgressTasks = filteredTasks.filter(
  (task) => task.status === "IN_PROGRESS"
);

const doneTasks = filteredTasks.filter(
  (task) => task.status === "DONE"
);

const handleDragEnd = async (result) => {

  if (!result.destination) return;

  const taskId = result.draggableId;

  const newStatus =
    result.destination.droppableId;

  const taskToUpdate = tasks.find(
    (task) => task.id.toString() === taskId
  );

  if (!taskToUpdate) return;

  try {

    const updatedTask = {
      ...taskToUpdate,
      status: newStatus,
    };

    await updateTask(
      taskToUpdate.id,
      updatedTask
    );

    fetchTasks();

    toast.success("Task moved successfully");

  } catch (error) {

    console.log(error);

    toast.error("Failed to move task");
  }
};

  return (

    <motion.div
     initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
      className={`min-h-screen p-6 transition-all duration-300 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-black"
      }`}
    >

      {/* HEADER */}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">

        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">
          TaskForge Dashboard
        </h1>

        <div className="flex gap-4">
          <div
  className={`
    flex
    rounded-lg
    overflow-hidden
    border
    ${
      darkMode
        ? "border-gray-600"
        : "border-gray-300"
    }
  `}
>

  <button
    onClick={() => setViewMode("grid")}
    className={`
      px-4
      py-2
      transition-all
      ${
        viewMode === "grid"
          ? "bg-blue-500 text-white"
          : darkMode
          ? "bg-gray-800 text-gray-300"
          : "bg-white text-black"
      }
    `}
  >
    📦
  </button>

  <button
    onClick={() => setViewMode("kanban")}
    className={`
      px-4
      py-2
      transition-all
      ${
        viewMode === "kanban"
          ? "bg-blue-500 text-white"
          : darkMode
          ? "bg-gray-800 text-gray-300"
          : "bg-white text-black"
      }
    `}
  >
    📋
  </button>

</div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              darkMode
                ? "bg-yellow-400 text-black"
                : "bg-gray-800 text-white"
            }`}
          >
      {darkMode ? "🌞" : "🌛"}          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>
      </div>

      {/* TASK FORM */}

      <div
        className={`p-6 rounded-2xl shadow-md mb-8 ${
          darkMode
            ? "bg-gray-800 text-white"
            : "bg-white text-black"
        }`}
      >

        <h2 className="text-2xl font-semibold mb-4">
          {editingTaskId ? "Update Task" : "Create New Task"}
        </h2>

        <form
          onSubmit={handleCreateTask}
          className="space-y-4"
        >

          <input
            type="text"
            name="title"
            placeholder="Task Title"
            value={formData.title}
            onChange={handleChange}
            required
            className={`w-full border p-3 rounded-lg ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-black border-gray-300"
            }`}
          />

          <textarea
            name="description"
            placeholder="Task Description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className={`w-full border p-3 rounded-lg ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-black border-gray-300"
            }`}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`border p-3 rounded-lg ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-black border-gray-300"
              }`}
            >
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className={`border p-3 rounded-lg ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-black border-gray-300"
              }`}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>

            <input
              type="datetime-local"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={`border p-3 rounded-lg ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-black border-gray-300"
              }`}
            />

          </div>

          <button
            type="submit"
className="
  bg-blue-600
  hover:bg-blue-700
  text-white
  px-6
  py-3
  rounded-lg
  transform
  hover:scale-105
  transition-all
  duration-300
"          >
            {editingTaskId ? "Update Task" : "Create Task"}
          </button>

        </form>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <StatCard
          darkMode={darkMode}
          title="Total Tasks"
          value={totalTasks}
          color="text-blue-500"
        />

        <StatCard
          darkMode={darkMode}
          title="Completed"
          value={completedTasks}
          color="text-green-500"
        />

        <StatCard
          darkMode={darkMode}
          title="Pending"
          value={pendingTasks}
          color="text-yellow-500"
        />

        <StatCard
          darkMode={darkMode}
          title="High Priority"
          value={highPriorityTasks}
          color="text-red-500"
        />

      </div>
              {/* PROGRESS BAR */}
<div
  className={`
    rounded-2xl
    shadow-md
    p-6
    mb-8
    ${
      darkMode
        ? "bg-gray-800 text-white"
        : "bg-white text-black"
    }
  `}
>

          <div className="flex justify-between mb-3">

<h2 className={`text-xl font-bold`}>
              Task Progress
            </h2>

            <span className="font-bold text-blue-600">
              {completionPercentage}%
            </span>

          </div>

          {/* BAR */}

        <div className="
          w-full
          bg-gray-200
          dark:bg-gray-700
          rounded-full
          h-5
          overflow-hidden
        ">

          <div
            className="
              bg-gradient-to-r
              from-blue-500
              to-cyan-400
              h-5
              rounded-full
              transition-all
              duration-500
            "
            style={{
              width: `${completionPercentage}%`,
            }}
          ></div>

        </div>

        <p className="
          mt-3
          text-sm
          text-gray-600
          dark:text-gray-300
        ">
          {completedTasks} of {totalTasks} tasks completed
        </p>

        </div>

        {/* ANALYTICS */}

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

  {/* TASK STATUS CHART */}

  <div
    className={`
      rounded-2xl
      shadow-md
      p-6
      ${
        darkMode
          ? "bg-gray-800 text-white"
          : "bg-white text-black"
      }
    `}
  >

    <h2 className="text-2xl font-bold mb-6">
      Task Status Analytics
    </h2>

    <div className="h-80">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <PieChart>

          <Pie
            data={statusData}
            dataKey="value"
            nameKey="name"
            outerRadius={110}
            label
          >

            {statusData.map(
              (entry, index) => (

                <Cell
                  key={index}
                  fill={
                    COLORS[index % COLORS.length]
                  }
                />

              )
            )}

          </Pie>

          <Tooltip />

        </PieChart>

      </ResponsiveContainer>

    </div>

  </div>

  {/* PRIORITY CHART */}

  <div
    className={`
      rounded-2xl
      shadow-md
      p-6
      ${
        darkMode
          ? "bg-gray-800 text-white"
          : "bg-white text-black"
      }
    `}
  >

    <h2 className="text-2xl font-bold mb-6">
      Priority Distribution
    </h2>

    <div className="h-80">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <BarChart data={priorityData}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="value"
            fill="#3B82F6"
            radius={[10, 10, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  </div>

</div>

      {/* FILTERS */}

      <div
        className={`p-4 rounded-2xl shadow-md mb-6 ${
          darkMode
            ? "bg-gray-800"
            : "bg-white"
        }`}
      >

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`border p-3 rounded-lg ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-black border-gray-300"
            }`}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`border p-3 rounded-lg ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-black border-gray-300"
            }`}
          >
            <option value="ALL">All Status</option>
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className={`border p-3 rounded-lg ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-black border-gray-300"
            }`}
          >
            <option value="ALL">All Priority</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>

        </div>
      </div>

      {/* TASK CARDS */}
       {/* TASK DISPLAY */}

{loading ? (

  <div className="flex justify-center items-center mt-20">

    <div
      className="
        h-16
        w-16
        border-4
        border-blue-500
        border-t-transparent
        rounded-full
        animate-spin
      "
    ></div>

  </div>

) : viewMode === "grid" ? (

  /* GRID VIEW */

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

    {filteredTasks.length === 0 ? (

      <p>No tasks found</p>

    ) : (

      filteredTasks.map((task) => (

        <TaskCard
          key={task.id}
          task={task}
          darkMode={darkMode}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleToggleComplete={handleToggleComplete}
          getDueStatus={getDueStatus}
        />

      ))
    )}

  </div>

) : (

  /* KANBAN VIEW */

 /* DRAG & DROP KANBAN */

<DragDropContext
  onDragEnd={handleDragEnd}
>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

    <KanbanColumn
      id="TODO"
      title="TODO"
      tasks={todoTasks}
      darkMode={darkMode}
      color="bg-blue-500"
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      handleToggleComplete={handleToggleComplete}
      getDueStatus={getDueStatus}
    />

    <KanbanColumn
      id="IN_PROGRESS"
      title="IN PROGRESS"
      tasks={inProgressTasks}
      darkMode={darkMode}
      color="bg-yellow-500"
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      handleToggleComplete={handleToggleComplete}
      getDueStatus={getDueStatus}
    />

    <KanbanColumn
      id="DONE"
      title="DONE"
      tasks={doneTasks}
      darkMode={darkMode}
      color="bg-green-500"
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      handleToggleComplete={handleToggleComplete}
      getDueStatus={getDueStatus}
    />

  </div>

</DragDropContext>

)}  

    </motion.div>
  );
}

// STAT CARD COMPONENT

function StatCard({ darkMode, title, value, color }) {

  return (

    <div
      className={`rounded-2xl shadow-md p-6 ${
        darkMode
          ? "bg-gray-800 text-white"
          : "bg-white text-black"
      }`}
    >

      <h2 className="text-sm text-gray-500 mb-2">
        {title}
      </h2>

      <p className={`text-4xl font-bold ${color}`}>
        {value}
      </p>

    </div>
  );
}
function TaskCard({
  task,
  darkMode,
  handleEdit,
  handleDelete,
  handleToggleComplete,
  getDueStatus,
}) {

  return (

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className={`
        rounded-2xl
        shadow-md
        p-5
        hover:shadow-2xl
        transition-all
        duration-300
        ${
          darkMode
            ? "bg-gray-800 text-white"
            : "bg-white text-black"
        }
      `}
    >

      <div className="flex justify-between items-center mb-3">

        <h2
          className={`
            text-xl
            font-bold
            ${
              task.status === "DONE"
                ? "line-through opacity-60"
                : ""
            }
          `}
        >
          {task.title}
        </h2>

        <span
          className={`px-3 py-1 rounded-full text-white text-sm ${
            task.priority === "HIGH"
              ? "bg-red-500"
              : task.priority === "MEDIUM"
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
        >
          {task.priority}
        </span>

      </div>

      <p className="mb-4 opacity-80">
        {task.description}
      </p>

      <div className="space-y-2 text-sm">

        <p>
          <strong>Status:</strong> {task.status}
        </p>

        <p>
          <strong>Due:</strong>{" "}
          {task.dueDate
            ? new Date(task.dueDate).toLocaleString()
            : "No date"}
        </p>

        <span
          className={`
            px-3
            py-1
            rounded-full
            text-white
            text-xs
            font-semibold
            ${getDueStatus(task.dueDate).color}
          `}
        >
          {getDueStatus(task.dueDate).text}
        </span>

      </div>

      <div className="flex flex-wrap gap-3 mt-4">

        <button
          onClick={() =>
            handleToggleComplete(task)
          }
          className={`
            px-4
            py-2
            rounded-lg
            text-white
            ${
              task.status === "DONE"
                ? "bg-gray-500"
                : "bg-green-500"
            }
          `}
        >
          {task.status === "DONE"
            ? "↩"
            : "✅"}
        </button>

        <button
          onClick={() => handleEdit(task)}
          className="
            bg-yellow-500
            hover:bg-yellow-600
            text-white
            px-4
            py-2
            rounded-lg
          "
        >
          ✏
        </button>

        <button
          onClick={() =>
            handleDelete(task.id)
          }
          className="
            bg-red-500
            hover:bg-red-600
            text-white
            px-4
            py-2
            rounded-lg
          "
        >
          🗑
        </button>

      </div>

    </motion.div>
  );
}
function KanbanColumn({
  id,
  title,
  tasks,
  darkMode,
  color,
  handleEdit,
  handleDelete,
  handleToggleComplete,
  getDueStatus,
}) {

  return (

    <div
      className={`
        rounded-2xl
        p-4
        min-h-[500px]
        ${
          darkMode
            ? "bg-gray-800"
            : "bg-gray-200"
        }
      `}
    >

      <div className="flex items-center gap-3 mb-6">

        <div
          className={`w-4 h-4 rounded-full ${color}`}
        ></div>

        <h2 className="text-xl font-bold">
          {title}
        </h2>

        <span
          className="
            bg-black/20
            px-2
            py-1
            rounded-lg
            text-sm
          "
        >
          {tasks.length}
        </span>

      </div>

     <Droppable droppableId={id}>

  {(provided) => (

    <div
      {...provided.droppableProps}
      ref={provided.innerRef}
      className="space-y-4 min-h-[400px]"
    >

      {tasks.map((task, index) => (

        <Draggable
          key={task.id.toString()}
          draggableId={task.id.toString()}
          index={index}
        >

          {(provided) => (

            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >

              <TaskCard
                task={task}
                darkMode={darkMode}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleToggleComplete={handleToggleComplete}
                getDueStatus={getDueStatus}
              />

            </div>

          )}

        </Draggable>

      ))}

      {provided.placeholder}

    </div>

  )}

</Droppable>

    </div>
  );
}

export default Dashboard;