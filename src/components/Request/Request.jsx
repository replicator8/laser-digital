import "./Request.css";
import ActiveRequest from "../ActiveRequest";
import ArchiveRequest from "../ArchiveRequest";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function Request() {
  return (
    <section style={{ marginLeft: "20px" }}>
      <h1 className="r-title">
        Мои <span>заявки</span>
      </h1>
      <div className="active-requests">
        <div className="create-request">
          <button className="add-btn">
            <img src="src/photo/plus.svg" alt="add..." />
          </button>
        </div>
        <ActiveRequest />
        <ActiveRequest />
        <ActiveRequest />
        <ActiveRequest />
      </div>
      <h1 className="r-title">
        Архивные <span>заявки</span>
      </h1>
      <div className="archive-requests">
        <ArchiveRequest />
        <ArchiveRequest />
        <ArchiveRequest />
        <ArchiveRequest />
      </div>
    </section>
  );
}
