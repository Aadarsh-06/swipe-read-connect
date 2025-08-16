import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const process = async () => {
      // Supabase handles tokens in URL; trigger a session check then redirect
      await supabase.auth.getSession();
      navigate("/", { replace: true });
    };
    process();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Confirming your account...
    </div>
  );
};

export default AuthCallback;