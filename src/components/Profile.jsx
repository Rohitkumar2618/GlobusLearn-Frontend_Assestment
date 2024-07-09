import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

function Profile() {
  const [userDetails, setUserDetails] = useState(null);

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log(user);
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
          console.log(docSnap.data());
        } else {
          console.log("User not found in the database");
        }
      } else {
        console.log("User is not logged in");
      }
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  async function handleLogout() {
    try {
      await auth.signOut();
      window.location.href = "/login";
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        {userDetails ? (
          <>
            <div className="flex justify-center mb-6">
              <img
                src={userDetails.photo}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>
            <h3 className="mb-4 text-2xl font-bold text-center text-gray-800">
              Welcome, {userDetails.firstName} 🙏🙏
            </h3>
            <div className="mb-6">
              <p className="mb-2 text-gray-700">
                <span className="font-semibold">Email:</span>{" "}
                {userDetails.email}
              </p>
              <p className="mb-2 text-gray-700">
                <span className="font-semibold">First Name:</span>{" "}
                {userDetails.firstName}
              </p>
              {/* Uncomment if you want to show last name
              <p className="mb-2 text-gray-700">
                <span className="font-semibold">Last Name:</span> {userDetails.lastName}
              </p>
              */}
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleLogout}
                className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
