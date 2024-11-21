import { supabase } from "./supabase";
import { useNavigate } from "react-router-dom";

export const isLoggedIn = async () => {
  const res = await supabase.auth.getUser();
  return { resState: res.error == null, data: res };
};
