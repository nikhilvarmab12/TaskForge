import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  motion
} from "framer-motion";

import toast from "react-hot-toast";

import {
  getProfile,
  updateProfile,
  uploadAvatar
} from "../services/profileService";

function Profile() {

  const navigate =
    useNavigate();

  const [profile, setProfile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [editing, setEditing] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
    });


 const fetchProfile = async () => {
  try {

    const data = await getProfile();

    setProfile(data);

    setFormData({
      name: data.name,
      email: data.email,
    });

  } catch (error) {

    console.error(error);

  } finally {

    setLoading(false);
  }
};

useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  fetchProfile();
}, []);
const handleAvatarChange =
    async (e) => {

      const file =
        e.target.files[0];

      if (!file) return;

      try {

        await uploadAvatar(file);

        toast.success(
          "Avatar updated"
        );

        fetchProfile();

      } catch {

        toast.error(
          "Upload failed"
        );
      }
    };  

  
const handleUpdate =
    async () => {

      try {

        const updated =
          await updateProfile(
            formData
          );

        setProfile(updated);

        setEditing(false);

        toast.success(
          "Profile updated"
        );

      } catch {

        toast.error(
          "Update failed"
        );
      }
    };
  if (loading) {

    return (

      <div className="
        min-h-screen
        flex
        justify-center
        items-center
      ">

        <div className="
          h-16
          w-16
          border-4
          border-blue-500
          border-t-transparent
          rounded-full
          animate-spin
        "></div>

      </div>
    );
  }

  return (

    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      className="
        min-h-screen
        bg-gradient-to-br
        from-indigo-50
        via-white
        to-purple-100
        p-8
      "
    >

      <div className="
        max-w-4xl
        mx-auto
      ">

        <motion.div

          initial={{
            y: 50,
            opacity: 0
          }}

          animate={{
            y: 0,
            opacity: 1
          }}

          className="
            bg-white
            rounded-3xl
            shadow-2xl
            p-8
          "
        >

          <div className="
            flex
            flex-col
            items-center
          ">

            <img

              src={
                profile.avatarUrl
                  ? `${import.meta.env.VITE_API_URL}/uploads/${profile.avatarUrl}`
                  : "https://ui-avatars.com/api/?name=" +
                    profile.name
              }

              alt="avatar"

              className="
                w-40
                h-40
                rounded-full
                object-cover
                border-4
                border-indigo-500
                shadow-lg
              "
            />

            <label
              className="
                mt-4
                bg-indigo-600
                text-white
                px-5
                py-2
                rounded-lg
                cursor-pointer
              "
            >
              Change Photo

              <input
                type="file"
                hidden
                onChange={
                  handleAvatarChange
                }
              />
            </label>

          </div>

          <div className="
            mt-10
            grid
            md:grid-cols-2
            gap-6
          ">

            <div>

              <label className="
                font-semibold
              ">
                Name
              </label>

              <input

                value={
                  formData.name
                }

                disabled={
                  !editing
                }

                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name:
                      e.target.value,
                  })
                }

                className="
                  w-full
                  border
                  p-3
                  rounded-lg
                  mt-2
                "
              />

            </div>

            <div>

              <label className="
                font-semibold
              ">
                Email
              </label>

              <input

                value={
                  formData.email
                }

                disabled={
                  !editing
                }

                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email:
                      e.target.value,
                  })
                }

                className="
                  w-full
                  border
                  p-3
                  rounded-lg
                  mt-2
                "
              />

            </div>

          </div>

          <div className="
            mt-8
            flex
            flex-wrap
            gap-4
          ">

            <span className="
              bg-purple-100
              text-purple-700
              px-4
              py-2
              rounded-full
              font-semibold
            ">
              {profile.role}
            </span>

          </div>

          <div className="
            flex
            gap-4
            mt-10
          ">

            {!editing ? (

              <button

                onClick={() =>
                  setEditing(true)
                }

                className="
                  bg-yellow-500
                  text-white
                  px-6
                  py-3
                  rounded-lg
                "
              >
                Edit Profile
              </button>

            ) : (

              <button

                onClick={
                  handleUpdate
                }

                className="
                  bg-green-600
                  text-white
                  px-6
                  py-3
                  rounded-lg
                "
              >
                Save Changes
              </button>

            )}

            <button

              onClick={() =>
                navigate(
                  "/dashboard"
                )
              }

              className="
                bg-blue-600
                text-white
                px-6
                py-3
                rounded-lg
              "
            >
              Dashboard
            </button>

          </div>

        </motion.div>

      </div>

    </motion.div>
  );
}

export default Profile;