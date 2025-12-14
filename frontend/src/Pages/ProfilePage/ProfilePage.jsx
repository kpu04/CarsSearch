import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import ProfileCard from "../../Components/ProfileComponent/ProfileComponent";
import "./ProfilePage.css";

const ProfilePage = () => {
  return (
    <div className="profile">
      <Header />
      <ProfileCard />

      <Footer />
    </div>
  );
};

export default ProfilePage;
