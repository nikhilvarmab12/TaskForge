import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getActivityLogs } from "../services/activityService";
import { motion } from "framer-motion";

function Activity() {

  const [logs, setLogs] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadLogs = async () => {
      try {
        const data = await getActivityLogs();
        if (isMounted) {
          setLogs(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadLogs();

    return () => {
      isMounted = false;
    };
  }, []);

  return (

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="
        min-h-screen
        bg-gray-100
        dark:bg-gray-900
        p-6
      "
    >

      <div className="max-w-4xl mx-auto">

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-4xl font-bold">
            Activity Logs
          </h1>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="
              bg-blue-500
              text-white
              px-5
              py-2
              rounded-lg
            "
          >
            Dashboard
          </button>

        </div>

        <div className="space-y-4">

          {logs.length === 0 ? (

            <p>No activity found</p>

          ) : (

            logs.map((log, index) => (

              <motion.div
                key={log.id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.05,
                }}
                className="
                  bg-white
                  rounded-xl
                  shadow-md
                  p-5
                "
              >

                <h2 className="font-bold text-lg">
                  {log.action}
                </h2>

                <p className="text-gray-500 mt-2">
                  {new Date(
                    log.createdAt
                  ).toLocaleString()}
                </p>

              </motion.div>

            ))
          )}

        </div>

      </div>

    </motion.div>
  );
}

export default Activity;