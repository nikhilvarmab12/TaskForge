import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../services/taskService";

function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(
  window.innerWidth >= 1024
);
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("user@example.com");



  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    status: "PENDING",
    dueDate: "",
  });

  const loadTasks = async () => {
    try {
      const data = await getTasks(0, 50);
      setTasks(data.content || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
    const storedName = localStorage.getItem("userName") || "User";
    const storedEmail = localStorage.getItem("userEmail") || "user@example.com";
    setUserName(storedName);
    setUserEmail(storedEmail);
  }, []);

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "PENDING"
  ).length;
const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };
  const overdueTasks = tasks.filter(
    (task) => task.status !== "COMPLETED" && task.dueDate && isOverdue(task.dueDate)
  );

  const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const overdueFilteredTasks = filteredTasks.filter(
    (task) => task.status !== "COMPLETED" && task.dueDate && isOverdue(task.dueDate)
  );

  const pendingFilteredTasks = filteredTasks.filter(
    (task) => task.status === "PENDING" && (!task.dueDate || !isOverdue(task.dueDate))
  );

  const completedFilteredTasks = filteredTasks.filter(
    (task) => task.status === "COMPLETED"
  );

  

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    try {
      await createTask(formData);

      setFormData({
        title: "",
        description: "",
        priority: "MEDIUM",
        status: "PENDING",
        dueDate: "",
      });

      setShowModal(false);
      loadTasks();
    } catch (error) {
      console.error(error);
    }
  };

 const handleDeleteTask = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this task?"
  );

  if (!confirmed) return;

  try {
    await deleteTask(id);
    loadTasks();
  } catch (error) {
    console.error(error);
  }
};

  const handleToggleComplete = async (task) => {
    try {
      await updateTask(task.id, {
        ...task,
        status:
          task.status === "COMPLETED"
            ? "PENDING"
            : "COMPLETED",
      });

      loadTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const SkeletonCard = () => (
    <div className="rounded-xl bg-white p-6 shadow-sm animate-pulse border border-slate-100">
      <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
      <div className="h-8 bg-slate-200 rounded w-1/4"></div>
    </div>
  );

  const TaskCard = ({ task }) => (
  <div
    className={`
      group
      rounded-2xl
      border
      p-5
      shadow-sm
      transition-all
      duration-200
      hover:-translate-y-1
      hover:shadow-md
      ${
        task.status === "COMPLETED"
          ? "border-slate-200 bg-slate-50"
          : "border-slate-200 bg-white hover:border-slate-300"
      }
    `}
  >
    <div className="flex items-start gap-4">

      {/* Checkbox */}
      <input
        type="checkbox"
        aria-label={
  task.status === "COMPLETED"
    ? `Mark ${task.title} as pending`
    : `Mark ${task.title} as completed`
}
        checked={task.status === "COMPLETED"}
        onChange={() => handleToggleComplete(task)}
        className="
  mt-1
  h-5
  w-5
  cursor-pointer
  rounded
  border-slate-300
  accent-blue-600
  focus:ring-2
  focus:ring-blue-500/30
  focus:ring-offset-1
"
      />

      {/* Content */}
      <div className="min-w-0 flex-1">

        {/* Title */}
        <h3
          className={`
            text-base
            font-semibold
            leading-6
            transition-all
            ${
              task.status === "COMPLETED"
                ? "text-slate-400 line-through"
                : "text-slate-900"
            }
          `}
        >
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p
            className={`
              mt-2
              text-sm
              leading-6
              ${
                task.status === "COMPLETED"
                  ? "text-slate-400"
                  : "text-slate-600"
              }
            `}
          >
            {task.description}
          </p>
        )}

        {/* Metadata */}
        <div className="mt-4 flex flex-wrap items-center gap-3">

          {/* Priority */}
          <span
            className={`
              inline-flex
              items-center
              rounded-full
              px-3
              py-1
              text-xs
              font-semibold
              ${
                task.priority === "HIGH"
                  ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                  : task.priority === "MEDIUM"
                  ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                  : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
              }
            `}
          >
            {task.priority.charAt(0) +
              task.priority.slice(1).toLowerCase()} Priority
          </span>

          {/* Due Date */}
          {task.dueDate && (
            <span
              className={`
                inline-flex
                items-center
                rounded-full
                px-3
                py-1
                text-xs
                font-medium
                ${
                  isOverdue(task.dueDate)
                    ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                    : "bg-slate-100 text-slate-600"
                }
              `}
            >
              {isOverdue(task.dueDate)
                ? "Overdue • "
                : "Due • "}

              {new Date(task.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}

          {/* Completed Badge */}
          {task.status === "COMPLETED" && (
            <span
              className="
                inline-flex
                items-center
                rounded-full
                bg-green-50
                px-3
                py-1
                text-xs
                font-medium
                text-green-700
                ring-1
                ring-green-200
              "
            >
              Completed
            </span>
          )}
        </div>
      </div>

      {/* Delete */}
      <button
  aria-label={`Delete ${task.title}`}
  title="Delete task"
  onClick={() => handleDeleteTask(task.id)}
        className="
          rounded-xl
          p-2
          text-slate-400
          transition-all
          duration-200
          hover:bg-red-50
          hover:text-red-600
          active:scale-95
          focus:outline-none
          focus:ring-2
          focus:ring-red-500/20
        "
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>

    </div>
  </div>
);

 const EmptyState = ({
  title,
  description,
  icon,
  action,
}) => (
  <div className="py-12 text-center">

    <div className="flex justify-center">
      {icon}
    </div>

    <h3 className="mt-5 text-lg font-semibold text-slate-900">
      {title}
    </h3>

    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
      {description}
    </p>

    {action && (
      <div className="mt-6">
        {action}
      </div>
    )}

  </div>
);
useEffect(() => {
  const handleEscape = (e) => {
    if (e.key === "Escape") {
      setShowModal(false);
    }
  };

  if (showModal) {
    window.addEventListener("keydown", handleEscape);
  }

  return () => {
    window.removeEventListener("keydown", handleEscape);
  };
}, [showModal]);
useEffect(() => {
  document.body.style.overflow = showModal ? "hidden" : "";

  return () => {
    document.body.style.overflow = "";
  };
}, [showModal]);

  return (
<div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
<div
  className={`
    fixed inset-y-0 left-0 z-50
    w-64
    bg-gradient-to-b from-slate-900 to-slate-800
    text-white
    transition-transform duration-300 ease-in-out
    ${
      sidebarOpen
        ? "translate-x-0"
        : "-translate-x-full"
    }
  `}
>
        <div className="flex h-full flex-col">

          {/* Logo */}
          <div className="border-b border-slate-800 px-6 py-6">

  <div className="flex items-center gap-3">

    <div
      className="
        flex h-10 w-10 items-center justify-center
        rounded-xl
        bg-blue-600
        text-lg font-bold
      "
    >
      T
    </div>

    <div>
      <h1 className="text-lg font-semibold tracking-tight">
        TaskForge
      </h1>

      <p className="text-xs text-slate-400">
        Personal Workspace
      </p>
    </div>

  </div>

</div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
            <div className="px-4 pb-2 pt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
  Workspace
</div>

            <Link
              to="/dashboard"
              onClick={() => setSidebarOpen(false)}
className="
  flex items-center gap-3
  rounded-xl
  bg-slate-800
  px-4 py-3
  text-sm font-medium text-white
  transition-all duration-200
  hover:bg-slate-800
"            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 16l4-4m0 0l4 4m-4-4V5" />
              </svg>
              Dashboard
            </Link>

            

            <div className="my-6 border-t border-slate-700"></div>

            <div className="px-4 pb-2 pt-6 text-xs font-medium uppercase tracking-wider text-slate-500">
  Account
</div>

            

            <Link
              to="/profile"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 rounded-xl
px-4 py-3
text-slate-300
transition-all duration-200
hover:bg-slate-800
hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Profile
            </Link>

            
          </nav>
<button
  onClick={handleLogout}
className="
  mx-4 mb-4
  flex w-auto items-center gap-3
  rounded-xl
  px-4 py-3
  text-sm font-medium text-slate-300
  transition-all duration-200
  hover:bg-red-500/10
  hover:text-red-400
">
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1"
    />
  </svg>

  Logout
</button>
          {/* User Profile Card */}
          <div className="border-t border-slate-700 p-4">
<div
  className="
    rounded-2xl
    border border-slate-800
    bg-slate-800
    p-4
  "
>              <div className="flex items-center gap-3 mb-3">
<div
  className="
    flex h-11 w-11 items-center justify-center
    rounded-xl
    bg-blue-600
    text-sm font-semibold
    text-white
    flex-shrink-0
  "
>                 
 {userName
  .split(" ")
  .map((word) => word[0])
  .join("")
  .slice(0, 2)
  .toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{userName}</p>
                  <p className="text-xs text-slate-400 truncate">{userEmail}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      {sidebarOpen && (
  <div
    className="fixed inset-0 bg-black/40 z-40 "
    onClick={() => setSidebarOpen(false)}
  />
)}


      {/* Main Content */}
      <div
  className={`
    flex min-w-0 flex-1 flex-col
    transition-all duration-300
    ${sidebarOpen ? "lg:ml-64" : "lg:ml-0"}
  `}
>
       
        {/* Top Header */}
<div className="border-b border-slate-200 bg-white px-5 py-5 sm:px-6 lg:px-8 xl:px-10">
  <div className="space-y-5">
     <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {getGreeting()}, {userName}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {getCurrentDate()}
          </p>

    {/* Top Row */}
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

      {/* Left */}
      <div className="flex items-start gap-3">

        {/* Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="
            rounded-xl
            p-2.5
            text-slate-600
            transition-all
            duration-200
            hover:translate-x-1
            transition-all duration-200
            active:scale-95
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500/20
          "
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Greeting */}
        <div>
         

          {/* Quick Stats */}
          <div className="mt-3 flex flex-wrap gap-2">

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
              {totalTasks} Total
            </span>

            <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              {completedTasks} Completed
            </span>

            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
              {pendingTasks} Pending
            </span>

          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-wrap items-center gap-3">

        {/* Create Task */}
        <button
          onClick={() => setShowModal(true)}
          className="
            rounded-xl
            bg-blue-600
            px-5
            py-2.5
            text-sm
            font-semibold
            text-white
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:bg-blue-700
            hover:shadow-md
            active:scale-95
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500/20
          "
        >
          + New Task
        </button>

       

        {/* Avatar */}
        <div className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          bg-gradient-to-br
          from-blue-500
          to-blue-700
          text-sm
          font-semibold
          text-white
          shadow-sm
        ">
          {userName
  .split(" ")
  .map((word) => word[0])
  .join("")
  .slice(0, 2)
  .toUpperCase()}
        </div>

      </div>
    </div>

    {/* Bottom Row */}
    <div className="relative max-w-xl">

      <svg
        className="absolute left-3 top-3 h-5 w-5 text-slate-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      <input
        type="text"
        aria-label="Search tasks"
        placeholder="Search tasks by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="
          w-full
          rounded-xl
          border
          border-slate-300
          bg-white
          py-3
          pl-11
          pr-4
          text-sm
          placeholder:text-slate-400
          transition-all
          duration-200
          focus:border-blue-500
          focus:outline-none
          focus:ring-4
          focus:ring-blue-500/10
        "
      />
    </div>

  </div>
</div>

        {/* Content Area */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-6 lg:px-8 xl:px-10 space-y-8">

            {/* Statistics */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {loading ? (
               <>
  {[1, 2, 3, 4].map((item) => (
    <SkeletonCard key={item} />
  ))}
</>
              ) : (
              <>
  {/* Total Tasks */}
  <div
    className="
      rounded-2xl
      border
      border-slate-200
      bg-white
      p-6
      shadow-sm
      transition-all
      duration-200
      hover:-translate-y-1
      hover:shadow-md
    "
  >
    <div className="flex items-start justify-between">

      <div>
        <p className="text-sm font-medium text-slate-500">
          Total Tasks
        </p>

        <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          {totalTasks}
        </p>

        <p className="mt-2 text-xs text-slate-500">
          All tasks in your workspace
        </p>
      </div>

      <div className="rounded-xl bg-blue-50 p-3">
        <svg
          className="h-6 w-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"
          />
        </svg>
      </div>

    </div>
  </div>

  {/* Completed Tasks */}
  <div
    className="
      rounded-2xl
      border
      border-slate-200
      bg-white
      p-6
      shadow-sm
      transition-all
      duration-200
      hover:-translate-y-1
      hover:shadow-md
    "
  >
    <div className="flex items-start justify-between">

      <div>
        <p className="text-sm font-medium text-slate-500">
          Completed
        </p>

        <p className="mt-3 text-3xl font-bold tracking-tight text-green-600">
          {completedTasks}
        </p>

        <p className="mt-2 text-xs text-slate-500">
          Successfully finished
        </p>
      </div>

      <div className="rounded-xl bg-green-50 p-3">
        <svg
          className="h-6 w-6 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

    </div>
  </div>

  {/* Pending Tasks */}
  <div
    className="
      rounded-2xl
      border
      border-slate-200
      bg-white
      p-6
      shadow-sm
      transition-all
      duration-200
      hover:-translate-y-1
      hover:shadow-md
    "
  >
    <div className="flex items-start justify-between">

      <div>
        <p className="text-sm font-medium text-slate-500">
          Pending
        </p>

        <p className="mt-3 text-3xl font-bold tracking-tight text-amber-600">
          {pendingTasks}
        </p>

        <p className="mt-2 text-xs text-slate-500">
          Require attention
        </p>
      </div>

      <div className="rounded-xl bg-amber-50 p-3">
        <svg
          className="h-6 w-6 text-amber-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </div>

    </div>
  </div>

  {/* Productivity */}
  <div
    className="
      rounded-2xl
      border
      border-slate-200
      bg-white
      p-6
      shadow-sm
      transition-all
      duration-200
      hover:-translate-y-1
      hover:shadow-md
    "
  >
    <div>

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            Productivity
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-blue-600">
            {completionPercentage}%
          </p>
        </div>

        <div className="rounded-xl bg-blue-50 p-3">
          <svg
            className="h-6 w-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17v-6m4 6V7m4 10V4"
            />
          </svg>
        </div>

      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
          <span>Completion Rate</span>
          <span>{completionPercentage}%</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="
              h-full
              rounded-full
              bg-blue-600
              transition-all
              duration-500
            "
            style={{
              width: `${completionPercentage}%`,
            }}
          />
        </div>
      </div>

    </div>
  </div>
</>
              )}
            </div>
{totalTasks === 0 && !loading && (
  <div
    className="
      rounded-2xl
      border border-dashed border-slate-300
      bg-white
      px-6 py-14
      text-center
      shadow-sm
    "
  >
    <div
      className="
        mx-auto
        flex h-16 w-16 items-center justify-center
        rounded-2xl
        bg-blue-50
      "
    >
      <svg
        className="h-8 w-8 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
        />
      </svg>
    </div>

    <h3 className="mt-6 text-xl font-semibold text-slate-900">
      Welcome to TaskForge
    </h3>

    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
      Start organizing your work by creating your first task.
      Everything you add will appear here.
    </p>

    <button
      onClick={() => setShowModal(true)}
      className="
        mt-8
        rounded-xl
        bg-blue-600
        px-5 py-2.5
        text-sm font-semibold
        text-white
        transition-all duration-200
        hover:-translate-y-0.5
        hover:bg-blue-700
        hover:shadow-md
        active:scale-95
      "
    >
      + Create Your First Task
    </button>
  </div>
)}
            

            {/* Task Sections */}
            {loading ? (
              <div className="space-y-8">
                <div className="
  rounded-xl
  bg-white
  border
  border-slate-100
  p-6
  shadow-sm
  hover:scale-[1.02]
  hover:shadow-md
  transition-all
  duration-200
">
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="rounded-lg bg-slate-50 p-4 animate-pulse">
                        <div className="flex gap-4">
                          <div className="h-5 w-5 bg-slate-200 rounded"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-slate-200 rounded w-2/3 mb-3"></div>
                            <div className="h-3 bg-slate-200 rounded w-full"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">

                {/* Overdue Tasks */}
                {overdueTasks.length > 0 && (
<div
  className="
    rounded-2xl
    border
    border-slate-200
    bg-white
    shadow-sm
    overflow-hidden
  "
>                    <div className="border-b border-slate-100 px-6 py-5">
  <div className="flex items-center justify-between">

    <div className="flex items-center gap-3">

      <div className="h-2.5 w-2.5 rounded-full bg-red-500" />

      <h2 className="text-lg font-semibold text-slate-900">
        Overdue Tasks
      </h2>

    </div>

    <span
      className="
        rounded-full
        bg-red-50
        px-3
        py-1
        text-sm
        font-medium
        text-red-700
      "
    >
      {overdueFilteredTasks.length}
    </span>

  </div>
</div>
<div className="px-6 py-5">                   
     {overdueFilteredTasks.length === 0 ? (
                        <EmptyState
  title="You're all caught up"
  description="Nothing is overdue right now. Keep up the great momentum."
  icon={
    <div className="rounded-2xl bg-red-50 p-4">
      <svg
        className="h-10 w-10 text-red-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>
  }
/>
                      ) : (
                        <div className="space-y-4">
                          {overdueFilteredTasks.map((task) => (
                            <TaskCard key={task.id} task={task} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Pending Tasks */}
<div
  className="
    rounded-2xl
    border
    border-slate-200
    bg-white
    shadow-sm
    overflow-hidden
  "
>                  <div className="border-b border-slate-100 px-6 py-5">
  <div className="flex items-center justify-between">

    <div className="flex items-center gap-3">

      <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />

      <h2 className="text-lg font-semibold text-slate-900">
        Active Tasks
      </h2>

    </div>

    <span
      className="
        rounded-full
        bg-blue-50
        px-3
        py-1
        text-sm
        font-medium
        text-blue-700
      "
    >
      {pendingFilteredTasks.length}
    </span>

  </div>
</div>
                  <div className="p-5 sm:p-6">
                    {pendingFilteredTasks.length === 0 ? (
                      <EmptyState
  title="No active tasks"
  description="You currently have nothing in progress. Take a break or create something new."
  icon={
    <div className="rounded-2xl bg-blue-50 p-4">
      <svg
        className="h-10 w-10 text-blue-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7"
        />
      </svg>
    </div>
  }
  action={
    <button
      onClick={() => setShowModal(true)}
      className="
        rounded-xl
        bg-blue-600
        px-4 py-2
        text-sm font-medium
        text-white
        transition-all duration-200
        hover:bg-blue-700
        active:scale-95
      "
    >
      Create Task
    </button>
  }
/>
                    ) : (
<div className="space-y-4">
                          {pendingFilteredTasks.map((task) => (
                          <TaskCard key={task.id} task={task} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Completed Tasks */}
<div
  className="
    rounded-2xl
    border
    border-slate-200
    bg-white
    shadow-sm
    overflow-hidden
  "
>                 <div className="border-b border-slate-100 px-6 py-5">
  <div className="flex items-center justify-between">

    <div className="flex items-center gap-3">

      <div className="h-2.5 w-2.5 rounded-full bg-green-500" />

      <h2 className="text-lg font-semibold text-slate-900">
        Completed Tasks
      </h2>

    </div>

    <span
      className="
        rounded-full
        bg-green-50
        px-3
        py-1
        text-sm
        font-medium
        text-green-700
      "
    >
      {completedFilteredTasks.length}
    </span>

  </div>
</div>
                  <div className="p-5 sm:p-6">
                    {completedFilteredTasks.length === 0 ? (
                      <EmptyState
                        title="No completed tasks"
                        description="You haven't completed any tasks yet. Keep going!"
                        icon={
                          <div className="rounded-2xl bg-green-50 p-4">
                            <svg
                              className="h-10 w-10 text-green-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        }
                      />
                    ) : (
                      <div className="space-y-4">
                        {completedFilteredTasks.map((task) => (
                          <TaskCard key={task.id} task={task} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>

      </div>

      {/* Create Task Modal */}
      {showModal && (
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="create-task-title"
  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
>          <div
  className="
    w-full
    max-w-lg
    rounded-2xl
    bg-white
    shadow-xl
  "
>
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 id="create-task-title" className="text-xl font-bold text-slate-900">Create New Task</h2>
              <p className="mt-1 text-sm text-slate-500">Add a new task to your dashboard</p>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 p-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Task Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter task title..."
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Add task details..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                  rows="4"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                >
                  <option value="LOW">Low Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="HIGH">High Priority</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-white font-semibold transition-colors duration-200"
                >
                  Create Task
                </button>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg bg-slate-200 hover:bg-slate-300 px-4 py-2.5 text-slate-900 font-semibold transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;