import React, { useEffect, useState, useRef } from "react";
import { isLoggedIn } from "../../services/supaActions";
import { getText, getAnswer } from "../../services/test";
import { supabase } from "../../services/supabase";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "./Dashboard.css";
import { MdAdd } from "react-icons/md";
import { MdMessage } from "react-icons/md";
import { MdLogout } from "react-icons/md";
import { database as dbRef } from "../../services/firebase";
import { getDatabase, ref, set, onValue, get, child } from "firebase/database";
import Messages from "./Messages";
import { MdSend } from "react-icons/md";
import { TailSpin, ThreeDots } from "react-loader-spinner";
import { MdOutlinePerson } from "react-icons/md";
import { MdInsertDriveFile } from "react-icons/md";

export default function Dashboard() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [userID, setuserID] = useState("");
  const [currentChat, setCurrentChat] = useState(0);
  const [chats, setChats] = useState([]);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMsgLoading, setNewMsgLoading] = useState(false);
  const [chatsLoading, setChatsLoading] = useState(true);
  const uploadRef = useRef(null);
  const messagesRef = useRef(null);
  const [currChatName, setCurrChatName] = useState("");
  const signOutHandler = async () => {
    console.log("trying to sign out");
    const response = await supabase.auth.signOut();
    console.log(response);
    navigate("/signin");
  };

  const chatChangeHandler = async (id) => {
    setCurrentChat(id);
    console.log("starting to get message");
    onValue(ref(dbRef, "chats/" + id), (msg) => {
      setMessages(msg.val());
    });
  };

  const handleQuestion = async () => {
    if (question) {
      const currChatRef = ref(dbRef, "chats/" + currentChat);
      set(currChatRef, [...messages, { role: "user", content: question }]);
      setQuestion("");
      setNewMsgLoading(true);
      const res = await getAnswer(messages, question);
      if (res.error) {
        alert(res.error.message);
      } else {
        const tempMessages = [
          ...messages,
          { role: "user", content: question },
          { role: "assistant", content: res.data.answer },
        ];
        set(currChatRef, tempMessages);
        setNewMsgLoading(false);
      }
    }
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    const { data, error } = await supabase.storage
      .from("pdfReader")
      .upload(userID + "/" + uuidv4(), file);
    if (data) {
      alert("Upload Succesfull");
      const res = await getText(formData);

      await supabase
        .from("chats")
        .insert([{ created_by: userID, name: file.name }])
        .select("id")
        .then((data) => {
          set(ref(dbRef, "chats/" + data.data[0].id), [
            {
              role: "user",
              content:
                "I have extracted the text from a pdf and will be asking some questions related to this text answer in some detail if you cant find the asked question in the pdf tell me the same. Also give me all the outputs in string type format which ill be pasting somehweher else so be sure to use symbols like /n and other things",
            },
            { role: "assistant", content: "Understood" },
            { role: "user", content: res.data.text },
          ]);
          chatChangeHandler(data.data[0].id);
        });
    } else {
      alert(error.message);
    }
  };

  const getChats = async () => {
    const { data: chats, error } = await supabase
      .from("chats")
      .select("id , name")
      .eq("created_by", userID);
    if (chats) {
      setChats(chats);
      setChatsLoading(false);
    } else {
      console.log(error.message);
    }
  };

  useEffect(() => {
    isLoggedIn().then((res) => {
      if (!res.resState) {
        signOutHandler();
      } else {
        setuserID(res.data.data.user.id);
        setName(res.data.data.user.user_metadata.name);
        getChats();
      }
    });
  }, [chats]);

  useEffect(() => {
    messagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentChat]);

  return (
    <div className="dash-container">
      <div className="left-navbar">
        <div className="uploadPdf">
          <div
            className="pdfOutline"
            onClick={(e) => {
              uploadRef.current.click();
            }}
          >
            <MdAdd className="plus-icon" />
            <input
              type="file"
              style={{ display: "none" }}
              ref={uploadRef}
              onChange={(e) => uploadImage(e)}
            />
            Upload Pdf
          </div>
        </div>
        <div className="convo-label-container">
          <div className="convo-title">RECENT CONVERSATIONS</div>
          <div
            className="align-system"
            style={{ display: chatsLoading ? "flex" : "none" }}
          >
            <TailSpin visible={chatsLoading} color="#f7f7f7" />
          </div>
          {chats.map((chat, index) => {
            return (
              <div
                className="convo-label"
                key={index}
                onClick={() => {
                  chatChangeHandler(chat.id);
                  setCurrChatName(chat.name);
                  console.log(chat.id);
                }}
              >
                <div className="msg-icon">
                  <MdMessage />
                </div>
                <div className="chat-name">{chat.name}</div>
              </div>
            );
          })}
        </div>
        <div className="actions-container">
          <div className="logout" onClick={signOutHandler}>
            Sign Out
            <MdLogout className="logout-icon" />
          </div>
          <div className="profile-icon">
            <MdOutlinePerson />
          </div>
        </div>
      </div>
      <div className="convo">
        <div
          className="navbar"
          style={{ display: currentChat == 0 ? "none" : "flex" }}
        >
          <div className="file-name-container">
            <MdInsertDriveFile className="file-icon" />
            <div>{currChatName}</div>
          </div>
        </div>
        {currentChat == 0 ? (
          <div className="align-system">
            <h1 style={{ marginBottom: "0px" }}>
              <div>Hello, {name}</div>
            </h1>
            <h3>Continue where you left or upload a new pdf</h3>
          </div>
        ) : null}
        <div
          className="messages-container"
          style={{ display: currentChat == 0 ? "none" : "flex" }}
        >
          <Messages messages={messages} />
          {newMsgLoading ? <ThreeDots color="#fdcb9e" /> : null}
          <div ref={messagesRef}></div>
        </div>
        <div className="input-container">
          {currentChat == 0 ? null : (
            <div className="input-inside-container">
              <input
                className="question-input"
                type="text"
                placeholder="Ask this pdf"
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                }}
              />
              <div className="icon-cont-send">
                <MdSend className="send-icon" onClick={handleQuestion} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
