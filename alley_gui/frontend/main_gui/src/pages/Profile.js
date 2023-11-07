import { Link, Route, Routes } from "react-router-dom";
import ViewProfile from "../components/ViewProfile";
import EditProfile from "../components/EditProfile";

const Profile = () => {
  return (
    <>
      <h1>Profile Page</h1>
      <ul>
        <li>
          <Link to="viewprofile">View Profile</Link>
        </li>
        <li>
          <Link to="/editprofile">Edit Profile</Link>
        </li>
      </ul>

      <Routes>
        <Route path="/profile/viewprofile" Component={<ViewProfile />} />
        <Route path="/profile/editprofile" Component={<EditProfile />} />
      </Routes>
    </>
  );
};

export default Profile;
