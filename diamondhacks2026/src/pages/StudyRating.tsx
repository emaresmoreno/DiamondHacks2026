// src/pages/StudyRating.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const StudyRating: React.FC = () => {
  const [name, setName] = useState("");
  const [chargers, setChargers] = useState(false);
  const [wifi, setWifi] = useState(false);
  const [quiet, setQuiet] = useState(5);
  const [vibe, setVibe] = useState(5);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("chargers", chargers ? "true" : "false");
    formData.append("wifi", wifi ? "true" : "false");
    formData.append("quiet", quiet.toString());
    formData.append("vibe", vibe.toString());
    formData.append("description", description);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch("http://localhost:3000/submit", {
        method: "POST",
        body: formData,
      });
      const msg = await res.text();
      alert(msg);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar__container">
          <Link to="/" id="navbar__logo">
            <span className="material-symbols-outlined">location_on</span> Where2Study
          </Link>
          <div className="navbar__toggle" id="mobile-menu">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
          <ul className="navbar__menu">
            <li className="navbar__item">
              <Link to="/" className="navbar__links">Home</Link>
            </li>
            <li className="navbar__item">
              <Link to="/tech" className="navbar__links">Tech</Link>
            </li>
            <li className="navbar__btn">
              <Link to="/" className="button">Sign Up</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Page Title */}
      <h1 style={{ textAlign: "center", fontSize: "80px", color: "black" }}>
        Location Rating
      </h1>

      {/* Form */}
      <div className="filters" style={{ padding: "20px" }}>
        {/* Location Name */}
        <div className="form-group">
          <label>Name of Location:</label>
          <textarea
            placeholder="Geisel Library"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Checkboxes */}
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={chargers}
              onChange={(e) => setChargers(e.target.checked)}
            />
            Has Charging Ports 🔌
          </label>
          <label>
            <input
              type="checkbox"
              checked={wifi}
              onChange={(e) => setWifi(e.target.checked)}
            />
            Good WiFi 📶
          </label>
        </div>

        <br />

        {/* Quiet Slider */}
        <label>How Quiet:</label>
        <input
          type="range"
          min={0}
          max={10}
          value={quiet}
          onChange={(e) => setQuiet(Number(e.target.value))}
        />
        <span>{quiet}</span>

        <br /><br />

        {/* Vibe Slider */}
        <label>What Do You Rate The Vibes:</label>
        <input
          type="range"
          min={0}
          max={10}
          value={vibe}
          onChange={(e) => setVibe(Number(e.target.value))}
        />
        <span>{vibe}</span>

        <br /><br />

        {/* Image Upload */}
        <label>Upload an Image of Your Study Spot:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
        />

        <br /><br />

        {/* Description */}
        <label>Describe your ideal study spot:</label>
        <textarea
          placeholder="I want a quiet place with good WiFi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <br /><br />

        {/* Submit Button */}
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default StudyRating;