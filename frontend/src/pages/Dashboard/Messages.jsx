import React from "react";
import { MdOutlinePersonOutline } from "react-icons/md";
import { FaRobot } from "react-icons/fa6";

export default function Messages(props) {
  return props.messages.map((msg, index) => {
    return (
      <div
        className="single-container"
        key={index}
        style={{ display: index > 2 ? "flex" : "none" }}
      >
        <div className="icon-cont">
          {msg.role == "user" ? <MdOutlinePersonOutline /> : <FaRobot />}
        </div>
        <div className="message-cont">{msg.content}</div>
      </div>
    );
  });
}
