import "./Footer.css";
const Footer = () => {
  return (
    <div className="footer">
      <img
        style={{ width: 200, borderRadius: 100 }}
        className="logo"
        src="./images/Logo.png"
        alt=""
      />
      <div className="footerBlock">
        <div className="secondBlock">
          <h2 className="email">
            Subscribe to our newsletter to stay up-to-date with new announcements and promotions!
          </h2>
          <div className="emailInput">
            <input
              className="reviewText"
              placeholder="Write An E-mail"
              type="text"
            ></input>
            <button
              className="contoureButton"
              onClick={() =>
                alert(
                  "You have subscribed! Thank you for staying connected. Have a good day!"
                )
              }
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
